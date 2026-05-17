from fastapi import FastAPI

# Import all database models
# Important:
# This ensures all tables are created properly
from app import models

from app.database import Base, engine

# Import API routers
from app.routes.auth import router as auth_router
from app.routes.resume import router as resume_router
from app.routes.candidate import router as candidate_router


# Create all database tables automatically
Base.metadata.create_all(bind=engine)


# Initialize FastAPI application
app = FastAPI(
    title="NextHire AI API",
    version="1.0.0"
)


# Authentication APIs
app.include_router(auth_router)

# Resume upload APIs
app.include_router(resume_router)

# Candidate extraction APIs
app.include_router(candidate_router)


# Health check route
@app.get("/")
def root():
    return {
        "message": "NextHire AI Backend Running"
    }