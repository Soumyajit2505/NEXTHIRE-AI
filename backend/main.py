from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

# Import all models so SQLAlchemy can register all tables
from app import models

# Database engine and Base class
from app.database import Base, engine

# Phase 1: Authentication routes
from app.routes.auth import router as auth_router

# Phase 2: Resume upload and parsing routes
from app.routes.resume import router as resume_router

# Phase 3: Candidate extraction routes
from app.routes.candidate import router as candidate_router

# Phase 4: Job description routes
from app.routes.job import router as job_router

# Phase 4: ATS matching routes
from app.routes.ats import router as ats_router

# Phase 5: Candidate ranking routes
from app.routes.ranking import router as ranking_router

# Phase 6: Semantic AI matching routes
from app.routes.semantic import router as semantic_router


# Create all database tables automatically
# Existing tables and data will not be deleted
Base.metadata.create_all(bind=engine)


# Initialize FastAPI application
app = FastAPI(
    title="NextHire AI API",
    version="1.0.0",
    description="AI-powered Resume Screening and ATS Matching System"
)


# CORS configuration
# Allows frontend to communicate with backend during development
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Change to frontend URL in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Register all API routers
app.include_router(auth_router)
app.include_router(resume_router)
app.include_router(candidate_router)
app.include_router(job_router)
app.include_router(ats_router)
app.include_router(ranking_router)
app.include_router(semantic_router)


# Health check route
@app.get("/")
def root():
    return {
        "message": "NextHire AI Backend Running Successfully"
    }