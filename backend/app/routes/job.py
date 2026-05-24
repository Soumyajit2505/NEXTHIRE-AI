from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.database import get_db
from app.models import Job
from app.schemas import JobCreate, JobResponse


router = APIRouter(
    prefix="/jobs",
    tags=["Jobs"]
)


@router.post(
    "/create",
    response_model=JobResponse,
    status_code=status.HTTP_201_CREATED
)
def create_job(job_data: JobCreate, db: Session = Depends(get_db)):
    if not job_data.title.strip():
        raise HTTPException(status_code=400, detail="Job title cannot be empty")

    if not job_data.description.strip():
        raise HTTPException(status_code=400, detail="Job description cannot be empty")

    if not job_data.must_have_skills.strip():
        raise HTTPException(status_code=400, detail="Must-have skills cannot be empty")

    new_job = Job(
        title=job_data.title.strip(),
        description=job_data.description.strip(),
        domain=job_data.domain.strip() if job_data.domain else None,
        must_have_skills=job_data.must_have_skills.strip(),
        preferred_skills=job_data.preferred_skills.strip()
        if job_data.preferred_skills else None
    )

    db.add(new_job)
    db.commit()
    db.refresh(new_job)

    return new_job


@router.get("/", response_model=list[JobResponse])
def get_all_jobs(db: Session = Depends(get_db)):
    return db.query(Job).order_by(Job.id.desc()).all()


@router.get("/{job_id}", response_model=JobResponse)
def get_job_by_id(job_id: int, db: Session = Depends(get_db)):
    job = db.query(Job).filter(Job.id == job_id).first()

    if not job:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Job not found"
        )

    return job