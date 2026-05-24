from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session

from app.database import get_db
from app.models import Candidate, Resume
from app.schemas import CandidateResponse
from app.services.candidate_extractor import extract_candidate_details
from app.services.resume_parser import parse_resume


router = APIRouter(
    prefix="/candidates",
    tags=["Candidates"]
)


@router.post(
    "/extract/{resume_id}",
    response_model=CandidateResponse,
    status_code=status.HTTP_201_CREATED
)
def extract_candidate_from_resume(
    resume_id: int,
    db: Session = Depends(get_db)
):
    """
    Extract candidate details from uploaded resume.

    If candidate already exists for the same resume,
    this route updates the old candidate with newly extracted data.
    """

    # Fetch uploaded resume
    resume = db.query(Resume).filter(Resume.id == resume_id).first()

    if not resume:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Resume not found"
        )

    # Parse resume text from existing uploaded file
    try:
        resume_text = parse_resume(resume.file_path)

    except ValueError as error:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(error)
        )

    # Extract latest candidate details using improved extractor
    extracted_data = extract_candidate_details(resume_text)

    # Check if candidate already exists for this resume
    existing_candidate = (
        db.query(Candidate)
        .filter(Candidate.resume_id == resume.id)
        .first()
    )

    if existing_candidate:
        # Update old candidate data instead of returning outdated null values
        existing_candidate.full_name = extracted_data.get("full_name")
        existing_candidate.email = extracted_data.get("email")
        existing_candidate.phone = extracted_data.get("phone")

        existing_candidate.skills = extracted_data.get("skills")
        existing_candidate.education = extracted_data.get("education")
        existing_candidate.experience = extracted_data.get("experience")
        existing_candidate.projects = extracted_data.get("projects")
        existing_candidate.certifications = extracted_data.get("certifications")

        existing_candidate.linkedin_url = extracted_data.get("linkedin_url")
        existing_candidate.github_url = extracted_data.get("github_url")

        db.commit()
        db.refresh(existing_candidate)

        return existing_candidate

    # Create new candidate if no candidate exists for this resume
    new_candidate = Candidate(
        full_name=extracted_data.get("full_name"),
        email=extracted_data.get("email"),
        phone=extracted_data.get("phone"),

        skills=extracted_data.get("skills"),
        education=extracted_data.get("education"),
        experience=extracted_data.get("experience"),
        projects=extracted_data.get("projects"),
        certifications=extracted_data.get("certifications"),

        linkedin_url=extracted_data.get("linkedin_url"),
        github_url=extracted_data.get("github_url"),

        resume_id=resume.id,
        user_id=resume.user_id
    )

    try:
        db.add(new_candidate)
        db.commit()
        db.refresh(new_candidate)

    except IntegrityError:
        db.rollback()

        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Candidate already exists for this resume"
        )

    return new_candidate


@router.get("/", response_model=list[CandidateResponse])
def get_all_candidates(db: Session = Depends(get_db)):
    """
    Fetch all candidates.
    Latest candidates appear first.
    """

    candidates = (
        db.query(Candidate)
        .order_by(Candidate.id.desc())
        .all()
    )

    return candidates


@router.get("/{candidate_id}", response_model=CandidateResponse)
def get_candidate_by_id(
    candidate_id: int,
    db: Session = Depends(get_db)
):
    """
    Fetch one candidate by candidate ID.
    """

    candidate = (
        db.query(Candidate)
        .filter(Candidate.id == candidate_id)
        .first()
    )

    if not candidate:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Candidate not found"
        )

    return candidate