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