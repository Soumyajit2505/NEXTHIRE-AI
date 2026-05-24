from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.database import get_db
from app.models import Candidate, Job
from app.services.semantic_matcher import generate_semantic_result


router = APIRouter(
    prefix="/semantic",
    tags=["Semantic Matching"]
)


@router.post("/match/{candidate_id}/{job_id}")
def semantic_match_candidate_job(
    candidate_id: int,
    job_id: int,
    db: Session = Depends(get_db)
):
    """
    Generate semantic similarity score between a candidate profile
    and a job description using Sentence Transformers.

    This checks meaning-based similarity, not only exact keyword matching.
    """

    # Fetch candidate from database
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

    # Fetch job from database
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

    # Candidate should have at least some useful extracted information
    if not any([
        candidate.skills,
        candidate.experience,
        candidate.projects,
        candidate.education,
        candidate.certifications
    ]):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Candidate profile does not contain enough data for semantic matching"
        )

    # Job should have enough information for semantic comparison
    if not job.description or not job.must_have_skills:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Job description does not contain enough data for semantic matching"
        )

    # Generate semantic similarity result
    semantic_result = generate_semantic_result(
        candidate=candidate,
        job=job
    )

    return {
        "candidate_id": candidate.id,
        "job_id": job.id,
        "job_title": job.title,
        "semantic_score": semantic_result["semantic_score"],
        "semantic_match_level": semantic_result["semantic_match_level"],
        "message": semantic_result["message"]
    }