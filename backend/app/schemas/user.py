from pydantic import BaseModel, EmailStr
from typing import Optional


class UserRegister(BaseModel):

    name: str

    email: EmailStr

    password: str

    role: str

class UserLogin(BaseModel):

    email: EmailStr

    password: str


class UserUpdate(BaseModel):
    name: Optional[str] = None
    email: Optional[EmailStr] = None
    current_password: Optional[str] = None
    new_password: Optional[str] = None
