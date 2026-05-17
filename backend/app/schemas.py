from datetime import datetime

from pydantic import BaseModel, EmailStr


class UserSignup(BaseModel):
    full_name: str
    email: EmailStr
    password: str


class UserLogin(BaseModel):
    email: EmailStr
    password: str


class UserResponse(BaseModel):
    id: int
    full_name: str
    email: EmailStr

    class Config:
        from_attributes = True


# Resume Response Schema
class ResumeResponse(BaseModel):
    id: int
    filename: str
    file_type: str
    created_at: datetime

    class Config:
        from_attributes = True