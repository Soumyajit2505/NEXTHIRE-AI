from sqlalchemy import Column, DateTime, Float, ForeignKey, Integer, String, Text
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func

from app.database import Base


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)

    full_name = Column(String(100), nullable=False)

    email = Column(String(255), unique=True, index=True, nullable=False)

    hashed_password = Column(String(255), nullable=False)

    created_at = Column(
        DateTime(timezone=True),
        server_default=func.now(),
        nullable=False
    )

    resumes = relationship(
        "Resume",
        back_populates="user",
        cascade="all, delete-orphan"
    )

    candidates = relationship(
        "Candidate",
        back_populates="user",
        cascade="all, delete-orphan"
    )


class Resume(Base):
    __tablename__ = "resumes"

    id = Column(Integer, primary_key=True, index=True)

    filename = Column(String(255), nullable=False)

    file_path = Column(String(500), nullable=False)

    file_type = Column(String(20), nullable=False)

    extracted_text = Column(Text, nullable=False)

    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)

    created_at = Column(
        DateTime(timezone=True),
        server_default=func.now(),
        nullable=False
    )

    user = relationship(
        "User",
        back_populates="resumes"
    )

    candidate = relationship(
        "Candidate",
        back_populates="resume",
        uselist=False,
        cascade="all, delete-orphan"
    )


class Candidate(Base):
    __tablename__ = "candidates"

    id = Column(Integer, primary_key=True, index=True)

    full_name = Column(String(150), nullable=True)
    email = Column(String(255), nullable=True, index=True)
    phone = Column(String(30), nullable=True)

    skills = Column(Text, nullable=True)
    education = Column(Text, nullable=True)
    experience = Column(Text, nullable=True)
    projects = Column(Text, nullable=True)
    certifications = Column(Text, nullable=True)

    linkedin_url = Column(String(500), nullable=True)
    github_url = Column(String(500), nullable=True)

    resume_id = Column(
        Integer,
        ForeignKey("resumes.id"),
        nullable=False,
        unique=True
    )

    user_id = Column(
        Integer,
        ForeignKey("users.id"),
        nullable=False
    )

    created_at = Column(
        DateTime(timezone=True),
        server_default=func.now(),
        nullable=False
    )

    resume = relationship(
        "Resume",
        back_populates="candidate"
    )

    user = relationship(
        "User",
        back_populates="candidates"
    )

    ats_results = relationship(
        "ATSResult",
        back_populates="candidate",
        cascade="all, delete-orphan"
    )


class Job(Base):
    __tablename__ = "jobs"

    id = Column(Integer, primary_key=True, index=True)

    title = Column(String(150), nullable=False)

    description = Column(Text, nullable=False)

    domain = Column(String(100), nullable=True)

    must_have_skills = Column(Text, nullable=False)

    preferred_skills = Column(Text, nullable=True)

    created_at = Column(
        DateTime(timezone=True),
        server_default=func.now(),
        nullable=False
    )

    ats_results = relationship(
        "ATSResult",
        back_populates="job",
        cascade="all, delete-orphan"
    )


class ATSResult(Base):
    __tablename__ = "ats_results"

    id = Column(Integer, primary_key=True, index=True)

    candidate_id = Column(
        Integer,
        ForeignKey("candidates.id"),
        nullable=False
    )

    job_id = Column(
        Integer,
        ForeignKey("jobs.id"),
        nullable=False
    )

    matched_skills = Column(Text, nullable=True)

    missing_skills = Column(Text, nullable=True)

    # Skill-based weighted ATS score
    ats_score = Column(Float, nullable=False)

    # Semantic AI similarity score
    semantic_score = Column(Float, nullable=True)

    # Final hybrid score
    # Hybrid Score = 70% ATS Score + 30% Semantic Score
    hybrid_score = Column(Float, nullable=True)

    match_level = Column(String(50), nullable=False)

    recommendation = Column(Text, nullable=True)

    created_at = Column(
        DateTime(timezone=True),
        server_default=func.now(),
        nullable=False
    )

    candidate = relationship(
        "Candidate",
        back_populates="ats_results"
    )

    job = relationship(
        "Job",
        back_populates="ats_results"
    )