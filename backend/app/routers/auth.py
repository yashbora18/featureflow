import os
import secrets

from google.oauth2 import id_token
from app.core.dependencies import get_current_user
from google.auth.transport import requests as google_requests
from fastapi import APIRouter, Depends, HTTPException
from datetime import datetime, timedelta
from sqlalchemy.orm import Session

from app.core.database import SessionLocal
from app.models.user import User
from app.schemas.user import (
    UserRegister,
    UserLogin,
    UserResponse,
)
from app.core.security import (
    hash_password,
    verify_password,
    create_access_token,
)

router = APIRouter(
    prefix="/auth",
    tags=["Authentication"],
)


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@router.post(
    "/register",
    response_model=UserResponse,
)
def register(
    user: UserRegister,
    db: Session = Depends(get_db),
):

    existing_email = (
        db.query(User)
        .filter(User.email == user.email)
        .first()
    )

    if existing_email:
        raise HTTPException(
            status_code=400,
            detail="Email already registered",
        )

    existing_username = (
        db.query(User)
        .filter(User.username == user.username)
        .first()
    )

    if existing_username:
        raise HTTPException(
            status_code=400,
            detail="Username already exists",
        )

    new_user = User(
        username=user.username,
        email=user.email,
        hashed_password=hash_password(user.password),
    )

    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    return new_user


@router.post("/login")
def login(
    user: UserLogin,
    db: Session = Depends(get_db),
):

    db_user = (
        db.query(User)
        .filter(User.email == user.email)
        .first()
    )

    if not db_user:
        raise HTTPException(
            status_code=401,
            detail="Invalid email or password",
        )

    if not verify_password(
        user.password,
        db_user.hashed_password,
    ):
        raise HTTPException(
            status_code=401,
            detail="Invalid email or password",
        )

    token = create_access_token(
        {
            "sub": db_user.email
        }
    )

    return {
        "access_token": token,
        "token_type": "bearer",
        "user": {
            "id": db_user.id,
            "username": db_user.username,
            "email": db_user.email,
        },
    }

@router.post("/google")
def google_login(
    data: dict,
    db: Session = Depends(get_db),
):
    credential = data.get("credential")

    if not credential:
        raise HTTPException(
            status_code=400,
            detail="Google credential is required",
        )

    try:
        google_client_id = os.getenv("GOOGLE_CLIENT_ID")

        if not google_client_id:
            raise HTTPException(
                status_code=500,
                detail="Google Client ID is not configured",
            )

        google_user = id_token.verify_oauth2_token(
            credential,
            google_requests.Request(),
            google_client_id,
        )

        email = google_user.get("email")
        name = google_user.get("name") or email.split("@")[0]

        if not email:
            raise HTTPException(
                status_code=400,
                detail="Google account email not available",
            )

    except ValueError:
        raise HTTPException(
            status_code=401,
            detail="Invalid Google credential",
        )

    db_user = (
        db.query(User)
        .filter(User.email == email)
        .first()
    )

    if not db_user:
        username = name.replace(" ", "").lower()

        existing_username = (
            db.query(User)
            .filter(User.username == username)
            .first()
        )

        if existing_username:
            username = username + secrets.token_hex(3)

        db_user = User(
            username=username,
            email=email,
            hashed_password=hash_password(
                secrets.token_urlsafe(32)
            ),
        )

        db.add(db_user)
        db.commit()
        db.refresh(db_user)

    token = create_access_token(
        {
            "sub": db_user.email
        }
    )

    return {
        "access_token": token,
        "token_type": "bearer",
        "user": {
            "id": db_user.id,
            "username": db_user.username,
            "email": db_user.email,
        },
    }

@router.put("/change-password")
def change_password(
    data: dict,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    current_password = data.get("current_password")
    new_password = data.get("new_password")

    if not current_password or not new_password:
        raise HTTPException(
            status_code=400,
            detail="Current password and new password are required",
        )

    if not verify_password(
        current_password,
        current_user.hashed_password,
    ):
        raise HTTPException(
            status_code=401,
            detail="Current password is incorrect",
        )

    if len(new_password) < 8:
        raise HTTPException(
            status_code=400,
            detail="New password must be at least 8 characters",
        )

    current_user.hashed_password = hash_password(
        new_password
    )

    db.commit()

    return {
        "message": "Password updated successfully"
    }

# =====================================================
# FORGOT PASSWORD
# =====================================================

@router.post("/forgot-password")
def forgot_password(
    data: dict,
    db: Session = Depends(get_db),
):
    email = data.get("email")

    if not email:
        raise HTTPException(
            status_code=400,
            detail="Email address is required",
        )

    db_user = (
        db.query(User)
        .filter(User.email == email)
        .first()
    )

    # Don't reveal whether the email exists
    if not db_user:
        return {
            "message": "If an account exists with this email, a reset link has been generated."
        }

    # Generate secure reset token
    reset_token = secrets.token_urlsafe(32)

    db_user.reset_token = reset_token
    db_user.reset_token_expires = (
        datetime.utcnow() + timedelta(minutes=30)
    ).isoformat()

    db.commit()

    # DEVELOPMENT ONLY
    # The reset link will appear in the backend terminal.
    reset_link = (
        f"http://localhost:5173/reset-password"
        f"?token={reset_token}"
    )

    print("\n========================================")
    print("PASSWORD RESET REQUEST")
    print("========================================")
    print(f"Email: {db_user.email}")
    print(f"Reset Link: {reset_link}")
    print("Expires: 30 minutes")
    print("========================================\n")

    return {
        "message": "Password reset link generated successfully."
    }


# =====================================================
# RESET PASSWORD
# =====================================================

@router.post("/reset-password")
def reset_password(
    data: dict,
    db: Session = Depends(get_db),
):
    token = data.get("token")
    new_password = data.get("new_password")

    if not token:
        raise HTTPException(
            status_code=400,
            detail="Reset token is required",
        )

    if not new_password:
        raise HTTPException(
            status_code=400,
            detail="New password is required",
        )

    if len(new_password) < 8:
        raise HTTPException(
            status_code=400,
            detail="Password must be at least 8 characters",
        )

    db_user = (
        db.query(User)
        .filter(User.reset_token == token)
        .first()
    )

    if not db_user:
        raise HTTPException(
            status_code=400,
            detail="Invalid or expired reset token",
        )

    if not db_user.reset_token_expires:
        raise HTTPException(
            status_code=400,
            detail="Invalid or expired reset token",
        )

    try:
        expires_at = datetime.fromisoformat(
            db_user.reset_token_expires
        )
    except ValueError:
        raise HTTPException(
            status_code=400,
            detail="Invalid reset token",
        )

    if datetime.utcnow() > expires_at:
        db_user.reset_token = None
        db_user.reset_token_expires = None
        db.commit()

        raise HTTPException(
            status_code=400,
            detail="Reset token has expired",
        )

    # Update password
    db_user.hashed_password = hash_password(
        new_password
    )

    # Make token single-use
    db_user.reset_token = None
    db_user.reset_token_expires = None

    db.commit()

    return {
        "message": "Password reset successfully"
    }