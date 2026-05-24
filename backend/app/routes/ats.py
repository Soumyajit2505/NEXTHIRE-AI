from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.database import get_db
from app.models import ATSResult, Candidate, Job
from app.schemas import ATSResultResponse
from app.services.ats_matcher import calculate_ats_score
from app.services.skill_extractor import (
    extract_candidate_skills,
    extract_job_skills
)


router = APIRouter(
    prefix="/ats",
    tags=["ATS Matching"]
)


@router.post(
    "/match/{candidate_id}/{job_id}",
    response_model=ATSResultResponse,
    status_code=status.HTTP_201_CREATED
)
def generate_ats_result(
    candidate_id: int,
    job_id: int,
    db: Session = Depends(get_db)
):
    """
    Generate or update weighted ATS score between one candidate and one job.

    Formula:
    Must-have Skills     = 60%
    Preferred Skills     = 20%
    Experience Relevance = 10%
    Project Relevance    = 10%

    Important:
    If the same candidate-job result already exists,
    this API updates it instead of creating duplicate records.
    """

    # Fetch candidate by ID
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

    # Fetch job by ID
    job = (
        db.query(Job)
        .filter(Job.id == job_id)
        .first()
    )

    if not job:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Job not found"
        )

    # Extract candidate skills from stored candidate profile
    candidate_skills = extract_candidate_skills(candidate.skills)

    # Extract must-have and preferred skills from job record
    job_skills = extract_job_skills(
        must_have_skills=job.must_have_skills,
        preferred_skills=job.preferred_skills
    )

    # Calculate weighted ATS score
    ats_data = calculate_ats_score(
        candidate_skills=candidate_skills,
        must_have_skills=job_skills["must_have"],
        preferred_skills=job_skills["preferred"],
        experience_text=candidate.experience,
        projects_text=candidate.projects
    )

    # Convert skill lists into comma-separated strings for database storage
    matched_skills_text = ", ".join(ats_data["matched_skills"])
    missing_skills_text = ", ".join(ats_data["missing_skills"])

    # Check if ATS result already exists for same candidate and job
    existing_ats_result = (
        db.query(ATSResult)
        .filter(
            ATSResult.candidate_id == candidate.id,
            ATSResult.job_id == job.id
        )
        .first()
    )

    if existing_ats_result:
        # Update existing result instead of creating duplicate
        existing_ats_result.matched_skills = matched_skills_text
        existing_ats_result.missing_skills = missing_skills_text
        existing_ats_result.ats_score = ats_data["ats_score"]
        existing_ats_result.match_level = ats_data["match_level"]
        existing_ats_result.recommendation = ats_data["recommendation"]

        db.commit()
        db.refresh(existing_ats_result)

        return existing_ats_result

    # Create new ATS result if not already available
    new_ats_result = ATSResult(
        candidate_id=candidate.id,
        job_id=job.id,
        matched_skills=matched_skills_text,
        missing_skills=missing_skills_text,
        ats_score=ats_data["ats_score"],
        match_level=ats_data["match_level"],
        recommendation=ats_data["recommendation"]
    )

    db.add(new_ats_result)
    db.commit()
    db.refresh(new_ats_result)

    return new_ats_result


@router.get("/", response_model=list[ATSResultResponse])
def get_all_ats_results(db: Session = Depends(get_db)):
    """
    Fetch all ATS matching results.
    Latest results appear first.
    """

    return (
        db.query(ATSResult)
        .order_by(ATSResult.id.desc())
        .all()
    )


@router.get("/{ats_result_id}", response_model=ATSResultResponse)
def get_ats_result_by_id(
    ats_result_id: int,
    db: Session = Depends(get_db)
):
    """
    Fetch one ATS result by result ID.
    """

    ats_result = (
        db.query(ATSResult)
        .filter(ATSResult.id == ats_result_id)
        .first()
    )

    if not ats_result:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="ATS result not found"
        )

    return ats_result