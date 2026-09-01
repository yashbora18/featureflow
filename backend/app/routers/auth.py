import os
import secrets
from datetime import datetime, timedelta

import resend

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from google.oauth2 import id_token
from google.auth.transport import requests as google_requests

from app.core.database import SessionLocal
from app.core.dependencies import get_current_user
from app.core.security import (
    hash_password,
    verify_password,
    create_access_token,
)
from app.models.user import User
from app.schemas.user import (
    UserRegister,
    UserLogin,
    UserResponse,
)


router = APIRouter(
    prefix="/auth",
    tags=["Authentication"],
)


# =====================================================
# CONFIGURATION
# =====================================================

RESEND_API_KEY = os.getenv("RESEND_API_KEY")

FRONTEND_URL = os.getenv(
    "FRONTEND_URL",
    "http://localhost:5173",
)

if RESEND_API_KEY:
    resend.api_key = RESEND_API_KEY


# =====================================================
# DATABASE
# =====================================================

def get_db():
    db = SessionLocal()

    try:
        yield db

    finally:
        db.close()


# =====================================================
# REGISTER
# =====================================================

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


# =====================================================
# LOGIN
# =====================================================

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


# =====================================================
# GOOGLE LOGIN
# =====================================================

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
        google_client_id = os.getenv(
            "GOOGLE_CLIENT_ID"
        )

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

        if not email:
            raise HTTPException(
                status_code=400,
                detail="Google account email not available",
            )

        name = (
            google_user.get("name")
            or email.split("@")[0]
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
        username = name.replace(
            " ", ""
        ).lower()

        existing_username = (
            db.query(User)
            .filter(User.username == username)
            .first()
        )

        if existing_username:
            username = (
                username
                + secrets.token_hex(3)
            )

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


# =====================================================
# CHANGE PASSWORD
# =====================================================

@router.put("/change-password")
def change_password(
    data: dict,
    current_user: User = Depends(
        get_current_user
    ),
    db: Session = Depends(get_db),
):
    current_password = data.get(
        "current_password"
    )

    new_password = data.get(
        "new_password"
    )

    if not current_password or not new_password:
        raise HTTPException(
            status_code=400,
            detail=(
                "Current password and new password "
                "are required"
            ),
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
            detail=(
                "New password must be at least "
                "8 characters"
            ),
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

    # Do not reveal whether an account exists
    if not db_user:
        return {
            "message": (
                "If an account exists with this email, "
                "a reset link has been generated."
            )
        }

    # Check Resend configuration
    if not RESEND_API_KEY:
        raise HTTPException(
            status_code=500,
            detail="Email service is not configured",
        )

    # Generate secure reset token
    reset_token = secrets.token_urlsafe(32)

    db_user.reset_token = reset_token

    db_user.reset_token_expires = (
        datetime.utcnow()
        + timedelta(minutes=30)
    ).isoformat()

    db.commit()

    # Create FRONTEND reset URL
    reset_link = (
        f"{FRONTEND_URL}/reset-password"
        f"?token={reset_token}"
    )

    try:
        response = resend.Emails.send(
            {
                "from": "onboarding@resend.dev",
                "to": [db_user.email],
                "subject": (
                    "FeatureFlow - Reset Your Password"
                ),
                "html": f"""
                    <div style="
                        font-family: Arial, sans-serif;
                        max-width: 600px;
                        margin: 0 auto;
                        padding: 30px;
                        color: #222;
                    ">

                        <h2>
                            Reset your FeatureFlow password
                        </h2>

                        <p>
                            We received a request to reset
                            your FeatureFlow password.
                        </p>

                        <p>
                            Click the button below to create
                            a new password:
                        </p>

                        <p>
                            <a
                                href="{reset_link}"
                                style="
                                    display: inline-block;
                                    padding: 12px 24px;
                                    background: #4f46e5;
                                    color: white;
                                    text-decoration: none;
                                    border-radius: 8px;
                                    font-weight: bold;
                                "
                            >
                                Reset Password
                            </a>
                        </p>

                        <p>
                            This link will expire in
                            <strong>30 minutes</strong>.
                        </p>

                        <p>
                            If you did not request this
                            password reset, you can safely
                            ignore this email.
                        </p>

                        <p>
                            — FeatureFlow Team
                        </p>

                    </div>
                """,
            }
        )

        print(
            "Password reset email sent:",
            response,
        )

    except Exception as e:

        # Remove token if email sending failed
        db_user.reset_token = None
        db_user.reset_token_expires = None

        db.commit()

        print(
            "Resend email error:",
            str(e),
        )

        raise HTTPException(
            status_code=500,
            detail="Unable to send password reset email",
        )

    return {
        "message": (
            "Password reset link sent to your email."
        )
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

    new_password = data.get(
        "new_password"
    )

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
            detail=(
                "Password must be at least "
                "8 characters"
            ),
        )

    db_user = (
        db.query(User)
        .filter(
            User.reset_token == token
        )
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

    # Make reset token single-use
    db_user.reset_token = None
    db_user.reset_token_expires = None

    db.commit()

    return {
        "message": "Password reset successfully"
    }