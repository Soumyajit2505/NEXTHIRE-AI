from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database import get_db
from app.models import Candidate
from app.schemas import CandidateResponse


# This router handles all candidate-related APIs
router = APIRouter(
    prefix="/candidates",
    tags=["Candidates"]
)


@router.get("/", response_model=list[CandidateResponse])
def get_all_candidates(db: Session = Depends(get_db)):
    """
    Get all candidates stored in database.
    Latest candidate will appear first.
    """
    candidates = db.query(Candidate).order_by(Candidate.id.desc()).all()

    return candidates


@router.get("/{candidate_id}", response_model=CandidateResponse)
def get_candidate_by_id(candidate_id: int, db: Session = Depends(get_db)):
    """
    Get one candidate by candidate ID.
    """
    candidate = db.query(Candidate).filter(Candidate.id == candidate_id).first()

    if not candidate:
        raise HTTPException(
            status_code=404,
            detail="Candidate not found"
        )

    return candidate