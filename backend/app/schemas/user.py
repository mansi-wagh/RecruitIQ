from pydantic import BaseModel, EmailStr, field_validator
from typing import Literal, Optional


class UserRegister(BaseModel):

    name: str

    email: EmailStr

    password: str

    role: Literal["hr", "candidate"]

    @field_validator("password")
    @classmethod
    def password_strength(cls, v: str) -> str:
        if not v or len(v.strip()) < 8:
            raise ValueError("Password must be at least 8 characters long and cannot be empty whitespace")
        return v

    @field_validator("name")
    @classmethod
    def name_not_empty(cls, v: str) -> str:
        if not v or not v.strip():
            raise ValueError("Name cannot be empty")
        return v.strip()


class UserLogin(BaseModel):

    email: EmailStr

    password: str


class UserUpdate(BaseModel):
    name: Optional[str] = None
    email: Optional[EmailStr] = None
    current_password: Optional[str] = None
    new_password: Optional[str] = None

    @field_validator("new_password")
    @classmethod
    def new_password_strength(cls, v: Optional[str]) -> Optional[str]:
        if v is not None and len(v) < 8:
            raise ValueError("New password must be at least 8 characters long")
        return v


class ForgotPasswordRequest(BaseModel):
    email: EmailStr


