import os
import shutil
from uuid import uuid4

from fastapi import APIRouter, Depends, File, HTTPException, UploadFile, status
from sqlalchemy.orm import Session

from app.database import get_db
from app.dependencies import get_current_user
from app.models import Candidate, Resume, User
from app.schemas import ResumeResponse
from app.services.candidate_extractor import extract_candidate_details
from app.services.resume_parser import parse_resume


router = APIRouter(
    prefix="/resumes",
    tags=["Resumes"]
)


UPLOAD_DIR = "uploads/resumes"
ALLOWED_EXTENSIONS = [".pdf", ".docx"]


@router.post("/upload", response_model=ResumeResponse, status_code=status.HTTP_201_CREATED)
def upload_resume(
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    # Get uploaded file extension: .pdf or .docx
    file_extension = os.path.splitext(file.filename)[1].lower()

    # Allow only PDF and DOCX files
    if file_extension not in ALLOWED_EXTENSIONS:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid file type. Only PDF and DOCX are allowed."
        )

    # Create upload folder if it does not exist
    os.makedirs(UPLOAD_DIR, exist_ok=True)

    # Generate unique file name to avoid duplicate file conflicts
    unique_filename = f"{uuid4()}{file_extension}"
    file_path = os.path.join(UPLOAD_DIR, unique_filename)

    try:
        # Save uploaded resume file into local uploads folder
        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)

        # Extract raw text from uploaded resume
        extracted_text = parse_resume(file_path)

        # Save resume data in resumes table
        new_resume = Resume(
            filename=file.filename,
            file_path=file_path,
            file_type=file_extension.replace(".", ""),
            extracted_text=extracted_text,
            user_id=current_user.id
        )

        db.add(new_resume)
        db.commit()
        db.refresh(new_resume)

        # Extract structured candidate details from resume text
        candidate_data = extract_candidate_details(extracted_text)

        # Save extracted candidate data in candidates table
        new_candidate = Candidate(
            full_name=candidate_data.get("full_name"),
            email=candidate_data.get("email"),
            phone=candidate_data.get("phone"),

            skills=candidate_data.get("skills"),
            education=candidate_data.get("education"),
            experience=candidate_data.get("experience"),
            projects=candidate_data.get("projects"),
            certifications=candidate_data.get("certifications"),

            linkedin_url=candidate_data.get("linkedin_url"),
            github_url=candidate_data.get("github_url"),

            resume_id=new_resume.id,
            user_id=current_user.id
        )

        db.add(new_candidate)
        db.commit()
        db.refresh(new_candidate)

        # API still returns resume response.
        # Candidate data can be checked from GET /candidates.
        return new_resume

    except ValueError as error:
        # Delete uploaded file if resume parser gives validation error
        if os.path.exists(file_path):
            os.remove(file_path)

        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(error)
        )

    except Exception:
        # Delete uploaded file if any unexpected error occurs
        if os.path.exists(file_path):
            os.remove(file_path)

        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Something went wrong while uploading resume."
        )


@router.get("/my-resumes", response_model=list[ResumeResponse])
def get_my_resumes(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    # Fetch only logged-in user's resumes
    resumes = (
        db.query(Resume)
        .filter(Resume.user_id == current_user.id)
        .order_by(Resume.created_at.desc())
        .all()
    )

    return resumes