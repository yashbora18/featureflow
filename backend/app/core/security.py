from datetime import datetime, timedelta
from jose import JWTError, jwt
from passlib.context import CryptContext

# Change this to a long random string before deployment
SECRET_KEY = "featureflow-super-secret-key-change-this"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60 * 24  # 1 day

pwd_context = CryptContext(
    schemes=["bcrypt"],
    deprecated="auto"
)


def hash_password(password: str) -> str:
    """Hash a plain password."""
    return pwd_context.hash(password)


def verify_password(
    plain_password: str,
    hashed_password: str,
) -> bool:
    """Verify a password."""
    return pwd_context.verify(
        plain_password,
        hashed_password,
    )


def create_access_token(data: dict):
    """Generate JWT token."""
    to_encode = data.copy()

    expire = datetime.utcnow() + timedelta(
        minutes=ACCESS_TOKEN_EXPIRE_MINUTES
    )

    to_encode.update({"exp": expire})

    return jwt.encode(
        to_encode,
        SECRET_KEY,
        algorithm=ALGORITHM,
    )