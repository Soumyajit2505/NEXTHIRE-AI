from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import desc
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
    Rank candidates for a specific job.

    Ranking priority:
    1. Hybrid Score
       - 70% ATS Score
       - 30% Semantic Score

    2. ATS Score fallback
       - Used when hybrid score is not available
    """

    # Check if job exists
    job = db.query(Job).filter(Job.id == job_id).first()

    if not job:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Job not found"
        )

    # Fetch ATS results for this job
    ats_results = (
        db.query(ATSResult)
        .filter(ATSResult.job_id == job_id)
        .all()
    )

    if not ats_results:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="No ATS results found for this job"
        )

    # Sort candidates by hybrid_score first.
    # If hybrid_score is missing, fallback to ats_score.
    ranked_results = sorted(
        ats_results,
        key=lambda result: (
            result.hybrid_score
            if result.hybrid_score is not None
            else result.ats_score
        ),
        reverse=True
    )

    ranking_data = []

    for index, result in enumerate(ranked_results, start=1):
        final_ranking_score = (
            result.hybrid_score
            if result.hybrid_score is not None
            else result.ats_score
        )

        ranking_data.append({
            "rank": index,
            "candidate_id": result.candidate_id,
            "job_id": result.job_id,

            # Original skill-based ATS score
            "ats_score": result.ats_score,

            # Semantic AI similarity score
            "semantic_score": result.semantic_score,

            # Final score used for ranking
            "hybrid_score": result.hybrid_score,
            "final_ranking_score": final_ranking_score,

            "match_level": result.match_level,
            "matched_skills": result.matched_skills,
            "missing_skills": result.missing_skills,
            "recommendation": result.recommendation
        })

    return {
        "job_id": job.id,
        "job_title": job.title,
        "ranking_basis": "hybrid_score if available, otherwise ats_score",
        "total_candidates": len(ranking_data),
        "ranked_candidates": ranking_data
    }