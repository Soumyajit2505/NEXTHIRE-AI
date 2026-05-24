from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.database import get_db
from app.models import ATSResult, Job


router = APIRouter(
    prefix="/ranking",
    tags=["Candidate Ranking"]
)


@router.get("/job/{job_id}")
def rank_candidates_for_job(
    job_id: int,
    db: Session = Depends(get_db)
):
    """
    Rank candidates for a specific job based on ATS score.

    Highest ATS score candidate appears first.
    """

    # Check if job exists
    job = db.query(Job).filter(Job.id == job_id).first()

    if not job:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Job not found"
        )

    # Fetch ATS results for the selected job
    ranked_results = (
        db.query(ATSResult)
        .filter(ATSResult.job_id == job_id)
        .order_by(ATSResult.ats_score.desc())
        .all()
    )

    if not ranked_results:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="No ATS results found for this job"
        )

    ranking_data = []

    for index, result in enumerate(ranked_results, start=1):
        ranking_data.append({
            "rank": index,
            "candidate_id": result.candidate_id,
            "job_id": result.job_id,
            "ats_score": result.ats_score,
            "match_level": result.match_level,
            "matched_skills": result.matched_skills,
            "missing_skills": result.missing_skills,
            "recommendation": result.recommendation
        })

    return {
        "job_id": job.id,
        "job_title": job.title,
        "total_candidates": len(ranking_data),
        "ranked_candidates": ranking_data
    }