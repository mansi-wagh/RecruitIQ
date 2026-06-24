from fastapi import APIRouter, Depends,Header
from sqlalchemy.orm import Session
from app.auth.jwt_handler import create_access_token
from app.schemas.user import UserRegister, UserLogin
from app.auth.security import hash_password, verify_password
from app.models.user import User
from app.database import get_db
from app.auth.jwt_handler import verify_token
from fastapi import HTTPException
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials


router = APIRouter(
    prefix="/auth",
    tags=["Authentication"]
)

security = HTTPBearer()

@router.post("/register")
def register(
    user: UserRegister,
    db: Session = Depends(get_db)
):

    # Check if email already exists
    existing_user = db.query(User).filter(
        User.email == user.email
    ).first()

    if existing_user:
        return {
            "message": "Email already registered"
        }

    # Hash password
    hashed_password = hash_password(user.password)

    # Create user object
    new_user = User(
        name=user.name,
        email=user.email,
        password_hash=hashed_password,
        role=user.role
    )

    # Save to PostgreSQL
    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    return {
        "message": "User registered successfully",
        "id": new_user.id,
        "name": new_user.name,
        "email": new_user.email,
        "role": new_user.role
    }

@router.post("/login")
def login(
    user: UserLogin,
    db: Session = Depends(get_db)
):

    # Find user by email
    existing_user = db.query(User).filter(
        User.email == user.email
    ).first()

    if not existing_user:
        return {
            "message": "User not found"
        }

    # Verify password
    if not verify_password(
        user.password,
        existing_user.password_hash
    ):
        return {
            "message": "Invalid password"
        }

    access_token = create_access_token(

    {

        "sub": existing_user.email,

        "role": existing_user.role

    }

)
    return {

        "access_token": access_token,

        "token_type": "bearer"

}

@router.get("/me")
def current_user(

    credentials: HTTPAuthorizationCredentials = Depends(security),

    db: Session = Depends(get_db)

):

    token = credentials.credentials

    payload = verify_token(token)

    if payload is None:

        return {
            "message": "Invalid Token"
        }

    email = payload["sub"]

    user = db.query(User).filter(
        User.email == email
    ).first()
    
    
    if payload is None:
        raise HTTPException(
        status_code=401,
        detail="Invalid Token"
    )

    if user is None:
        raise HTTPException(
        status_code=404,
        detail="User not found"
    )

    return {

        "id": user.id,

        "name": user.name,

        "email": user.email,

        "role": user.role

    }
