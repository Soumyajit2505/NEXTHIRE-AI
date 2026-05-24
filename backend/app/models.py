from sqlalchemy import Column, DateTime, Float, ForeignKey, Integer, String, Text
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func

from app.database import Base


class User(Base):
    __tablename__ = "users"

    # Primary key for each user
    id = Column(Integer, primary_key=True, index=True)

    # User full name
    full_name = Column(String(100), nullable=False)

    # User email must be unique
    email = Column(String(255), unique=True, index=True, nullable=False)

    # Encrypted password, never store plain password
    hashed_password = Column(String(255), nullable=False)

    # Account creation time
    created_at = Column(
        DateTime(timezone=True),
        server_default=func.now(),
        nullable=False
    )

    # One user can upload many resumes
    resumes = relationship(
        "Resume",
        back_populates="user",
        cascade="all, delete-orphan"
    )

    # One user can have many extracted candidate records
    candidates = relationship(
        "Candidate",
        back_populates="user",
        cascade="all, delete-orphan"
    )


class Resume(Base):
    __tablename__ = "resumes"

    # Primary key for each uploaded resume
    id = Column(Integer, primary_key=True, index=True)

    # Original uploaded file name
    filename = Column(String(255), nullable=False)

    # Local storage path of uploaded file
    file_path = Column(String(500), nullable=False)

    # File type: pdf, docx, etc.
    file_type = Column(String(20), nullable=False)

    # Extracted raw resume text
    extracted_text = Column(Text, nullable=False)

    # Resume belongs to one user
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)

    # Resume upload time
    created_at = Column(
        DateTime(timezone=True),
        server_default=func.now(),
        nullable=False
    )

    # Relationship with user table
    user = relationship(
        "User",
        back_populates="resumes"
    )

    # One resume creates one candidate profile
    candidate = relationship(
        "Candidate",
        back_populates="resume",
        uselist=False,
        cascade="all, delete-orphan"
    )


class Candidate(Base):
    __tablename__ = "candidates"

    # Primary key for each extracted candidate profile
    id = Column(Integer, primary_key=True, index=True)

    # Basic candidate details
    full_name = Column(String(150), nullable=True)
    email = Column(String(255), nullable=True, index=True)
    phone = Column(String(30), nullable=True)

    # Extracted resume information
    skills = Column(Text, nullable=True)
    education = Column(Text, nullable=True)
    experience = Column(Text, nullable=True)
    projects = Column(Text, nullable=True)
    certifications = Column(Text, nullable=True)

    # Professional profile links
    linkedin_url = Column(String(500), nullable=True)
    github_url = Column(String(500), nullable=True)

    # Candidate is created from one resume
    resume_id = Column(
        Integer,
        ForeignKey("resumes.id"),
        nullable=False,
        unique=True
    )

    # Candidate belongs to one user
    user_id = Column(
        Integer,
        ForeignKey("users.id"),
        nullable=False
    )

    # Candidate profile creation time
    created_at = Column(
        DateTime(timezone=True),
        server_default=func.now(),
        nullable=False
    )

    # Relationship with resume table
    resume = relationship(
        "Resume",
        back_populates="candidate"
    )

    # Relationship with user table
    user = relationship(
        "User",
        back_populates="candidates"
    )

    # One candidate can have many ATS results
    ats_results = relationship(
        "ATSResult",
        back_populates="candidate",
        cascade="all, delete-orphan"
    )


class Job(Base):
    __tablename__ = "jobs"

    # Primary key for each job description
    id = Column(Integer, primary_key=True, index=True)

    # Job title
    # Example: Data Scientist, HR Executive, Civil Engineer
    title = Column(String(150), nullable=False)

    # Full job description text
    description = Column(Text, nullable=False)

    # Job domain/category
    # Example: IT, HR, Finance, Marketing, Civil, Mechanical
    domain = Column(String(100), nullable=True)

    # Important required skills
    # Example: Python, SQL OR Recruitment, Communication
    must_have_skills = Column(Text, nullable=False)

    # Optional or bonus skills
    preferred_skills = Column(Text, nullable=True)

    # Job creation time
    created_at = Column(
        DateTime(timezone=True),
        server_default=func.now(),
        nullable=False
    )

    # One job can have many ATS results
    ats_results = relationship(
        "ATSResult",
        back_populates="job",
        cascade="all, delete-orphan"
    )


class ATSResult(Base):
    __tablename__ = "ats_results"

    # Primary key for each ATS result
    id = Column(Integer, primary_key=True, index=True)

    # Candidate linked to this ATS result
    candidate_id = Column(
        Integer,
        ForeignKey("candidates.id"),
        nullable=False
    )

    # Job linked to this ATS result
    job_id = Column(
        Integer,
        ForeignKey("jobs.id"),
        nullable=False
    )

    # Skills matched between candidate and job
    matched_skills = Column(Text, nullable=True)

    # Important skills missing from candidate profile
    missing_skills = Column(Text, nullable=True)

    # Final weighted ATS score
    ats_score = Column(Float, nullable=False)

    # Example: Excellent Match, Strong Match, Good Match
    match_level = Column(String(50), nullable=False)

    # Human-readable improvement recommendation
    recommendation = Column(Text, nullable=True)

    # ATS result creation time
    created_at = Column(
        DateTime(timezone=True),
        server_default=func.now(),
        nullable=False
    )

    # Relationship with candidate table
    candidate = relationship(
        "Candidate",
        back_populates="ats_results"
    )

    # Relationship with job table
    job = relationship(
        "Job",
        back_populates="ats_results"
    )