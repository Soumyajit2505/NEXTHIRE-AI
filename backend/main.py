from fastapi import FastAPI

from app import models
from app.database import Base, engine
from app.routes.auth import router as auth_router

Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="NextHire AI API",
    version="1.0.0"
)

app.include_router(auth_router)


@app.get("/")
def root():
    return {"message": "NextHire AI Backend Running"}