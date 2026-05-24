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
    Generate weighted ATS score between one candidate and one job.

    Formula:
    Must-have Skills     = 60%
    Preferred Skills     = 20%
    Experience Relevance = 10%
    Project Relevance    = 10%
    """

    candidate = db.query(Candidate).filter(Candidate.id == candidate_id).first()

    if not candidate:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Candidate not found"
        )

    job = db.query(Job).filter(Job.id == job_id).first()

    if not job:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Job not found"
        )

    candidate_skills = extract_candidate_skills(candidate.skills)

    job_skills = extract_job_skills(
        must_have_skills=job.must_have_skills,
        preferred_skills=job.preferred_skills
    )

    ats_data = calculate_ats_score(
        candidate_skills=candidate_skills,
        must_have_skills=job_skills["must_have"],
        preferred_skills=job_skills["preferred"],
        experience_text=candidate.experience,
        projects_text=candidate.projects
    )

    new_ats_result = ATSResult(
        candidate_id=candidate.id,
        job_id=job.id,
        matched_skills=", ".join(ats_data["matched_skills"]),
        missing_skills=", ".join(ats_data["missing_skills"]),
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

    return db.query(ATSResult).order_by(ATSResult.id.desc()).all()


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