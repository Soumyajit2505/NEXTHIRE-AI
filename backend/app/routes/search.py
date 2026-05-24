from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session

from app.database import get_db
from app.models import Candidate
from app.services.vector_store import (
    build_candidate_index,
    search_candidates
)


router = APIRouter(
    prefix="/search",
    tags=["Semantic Candidate Search"]
)


@router.post("/rebuild-index")
def rebuild_candidate_index(db: Session = Depends(get_db)):
    """
    Rebuild FAISS candidate index from all stored candidate profiles.

    Run this API after:
    - uploading new resumes
    - extracting new candidates
    - updating candidate profile data
    """

    candidates = db.query(Candidate).all()

    if not candidates:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="No candidates found to build FAISS index"
        )

    result = build_candidate_index(candidates)

    if result["total_indexed"] == 0:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="No valid candidate text found for indexing"
        )

    return {
        "message": result["message"],
        "total_indexed": result["total_indexed"]
    }


@router.post("/candidates")
def search_candidate_profiles(
    query: str = Query(
        ...,
        min_length=2,
        description="Natural language query, e.g. Python developer with ML projects"
    ),
    top_k: int = Query(
        5,
        ge=1,
        le=20,
        description="Number of top candidates to return"
    )
):
    """
    Search candidate profiles semantically using FAISS.

    Example queries:
    - Python developer with machine learning projects
    - HR candidate with recruitment experience
    - Data analyst with SQL and dashboard skills
    - Marketing candidate with SEO and campaign experience
    """

    result = search_candidates(
        query=query,
        top_k=top_k
    )

    if not result["results"]:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=result["message"]
        )

    return result