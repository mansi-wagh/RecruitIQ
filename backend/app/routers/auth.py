from fastapi import APIRouter, Depends,Header
from sqlalchemy.orm import Session
from app.auth.jwt_handler import create_access_token
from app.schemas.user import UserRegister, UserLogin, UserUpdate, ForgotPasswordRequest
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
        raise HTTPException(
            status_code=400,
            detail="Email already registered"
)

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
        raise HTTPException(
            status_code=401,
            detail="Invalid email or password"
)

    # Verify password
    if not verify_password(
        user.password,
        existing_user.password_hash
    ):
        raise HTTPException(
            status_code=401,
            detail="Invalid email or password"
)

    access_token = create_access_token(
        {
            "sub": existing_user.email,
            "role": existing_user.role,
        }
    )



    return {
        "access_token": access_token,
        "token_type": "bearer",
    }


@router.get("/me")
def current_user(
    credentials: HTTPAuthorizationCredentials = Depends(security),
    db: Session = Depends(get_db)
):
    token = credentials.credentials

    payload = verify_token(token)

    if payload is None:
        raise HTTPException(
            status_code=401,
            detail="Invalid token"
        )

    email = payload["sub"]

    user = db.query(User).filter(
        User.email == email
    ).first()

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


@router.put("/me")
def update_profile(
    body: UserUpdate,
    credentials: HTTPAuthorizationCredentials = Depends(security),
    db: Session = Depends(get_db)
):
    token = credentials.credentials
    payload = verify_token(token)

    if payload is None:
        raise HTTPException(
            status_code=401,
            detail="Invalid or expired token"
        )

    current_email = payload["sub"]
    user = db.query(User).filter(User.email == current_email).first()

    if user is None:
        raise HTTPException(
            status_code=404,
            detail="User not found"
        )

    # 1. Update password
    if body.new_password:
        if not body.current_password:
            raise HTTPException(
                status_code=400,
                detail="Current password is required to set a new password"
            )
        if not verify_password(body.current_password, user.password_hash):
            raise HTTPException(
                status_code=400,
                detail="Incorrect current password"
            )
        user.password_hash = hash_password(body.new_password)

    # 2. Update email
    if body.email and body.email.strip().lower() != user.email.lower():
        email_clean = body.email.strip()
        exists = db.query(User).filter(User.email == email_clean).first()
        if exists:
            raise HTTPException(
                status_code=400,
                detail="Email already registered"
            )
        user.email = email_clean

    # 3. Update name
    if body.name:
        user.name = body.name.strip()

    db.commit()
    db.refresh(user)

    # Create new access token with updated email/subject
    access_token = create_access_token(
        {
            "sub": user.email,
            "role": user.role,
        }
    )

    return {
        "message": "Profile updated successfully",
        "access_token": access_token,
        "user": {
            "id": user.id,
            "name": user.name,
            "email": user.email,
            "role": user.role
        }
    }


@router.post("/forgot-password")
def forgot_password(
    body: ForgotPasswordRequest,
    db: Session = Depends(get_db)
):
    user = db.query(User).filter(User.email == body.email).first()
    if not user:
        raise HTTPException(
            status_code=404,
            detail="User with this email does not exist"
        )

    temp_pass = "Reset123!"
    user.password_hash = hash_password(temp_pass)
    db.commit()

    return {
        "message": f"A temporary password has been set. You can now log in using: {temp_pass}. Please change it immediately after logging in."
    }


