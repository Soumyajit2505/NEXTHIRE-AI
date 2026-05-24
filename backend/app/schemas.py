from datetime import datetime
from typing import Optional

from pydantic import BaseModel, EmailStr


# =========================
# USER SCHEMAS
# =========================

class UserSignup(BaseModel):
    # Data required when a new user signs up
    full_name: str
    email: EmailStr
    password: str


class UserLogin(BaseModel):
    # Data required when user logs in
    email: EmailStr
    password: str


class UserResponse(BaseModel):
    # Data returned after signup/login
    id: int
    full_name: str
    email: EmailStr

    class Config:
        # Allows Pydantic to read SQLAlchemy model objects
        from_attributes = True


# =========================
# RESUME SCHEMAS
# =========================

class ResumeResponse(BaseModel):
    # Data returned after resume upload
    id: int
    filename: str
    file_type: str
    created_at: datetime

    class Config:
        from_attributes = True


# =========================
# CANDIDATE SCHEMAS
# =========================

class CandidateResponse(BaseModel):
    # Candidate ID from database
    id: int

    # Basic extracted details
    full_name: Optional[str] = None
    email: Optional[str] = None
    phone: Optional[str] = None

    # Extracted resume sections
    skills: Optional[str] = None
    education: Optional[str] = None
    experience: Optional[str] = None
    projects: Optional[str] = None
    certifications: Optional[str] = None

    # Extracted profile links
    linkedin_url: Optional[str] = None
    github_url: Optional[str] = None

    # Relation IDs
    resume_id: Optional[int] = None
    user_id: Optional[int] = None

    # Candidate creation time
    created_at: datetime

    class Config:
        from_attributes = True


# =========================
# JOB SCHEMAS
# =========================

class JobCreate(BaseModel):
    """
    Request schema for creating a new job description.
    Works for technical and non-technical roles.
    """

    # Job title
    # Example: Data Scientist, HR Manager, Marketing Executive
    title: str

    # Full job description
    description: str

    # Optional job domain/category
    # Example: IT, HR, Finance, Marketing, Civil, Mechanical
    domain: Optional[str] = None

    # Mandatory required skills
    # Example: Python, SQL OR Recruitment, Communication
    must_have_skills: str

    # Optional/bonus skills
    # Example: Power BI, TensorFlow OR Excel, Negotiation
    preferred_skills: Optional[str] = None


class JobResponse(BaseModel):
    """
    Response schema for returning job description data.
    """

    id: int
    title: str
    description: str
    domain: Optional[str] = None
    must_have_skills: str
    preferred_skills: Optional[str] = None
    created_at: datetime

    class Config:
        from_attributes = True


# =========================
# ATS RESULT SCHEMAS
# =========================

class ATSResultResponse(BaseModel):
    """
    Response schema for final ATS matching result.
    """

    id: int
    candidate_id: int
    job_id: int

    matched_skills: Optional[str] = None
    missing_skills: Optional[str] = None

    ats_score: float
    match_level: str
    recommendation: Optional[str] = None

    created_at: datetime

    class Config:
        from_attributes = True