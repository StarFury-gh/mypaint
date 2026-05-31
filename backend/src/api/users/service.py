from fastapi import HTTPException, status

from jwt import encode, decode
from asyncpg import UniqueViolationError

from logging import Logger
from hashlib import sha256

from api.users.pg_repository import PG_Users_Repository
from core.config import config_object
from core.security import JWTUserInfo

from .schemas import LoginUserDTO, RegisterUserDTO


class Users_Service:
    def __init__(self, repo: PG_Users_Repository) -> None:
        self._repo = repo

    def _encode_jwt(self, payload: dict) -> str:
        return encode(payload, key=config_object.JWT_SECRET_KEY, algorithm="HS256")

    def _decode_jwt(self, token: str) -> dict:
        return decode(token, key=config_object.JWT_SECRET_KEY, algorithms=["HS256"])

    async def login(self, body: LoginUserDTO):
        hashed_password = sha256(body.password.encode("utf-8")).hexdigest()

        user_id = await self._repo.get_user_id_by_credentials(
            username=body.username, password=hashed_password
        )

        if user_id is None:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid credentials"
            )

        token = self._encode_jwt(
            {
                "id": user_id,
                "username": body.username,
            }
        )

        return {"status": True, "jwt": token}

    async def register(
        self, body: RegisterUserDTO, logger: Logger | None = None
    ) -> dict | None:
        hashed_password = sha256(body.password.encode("utf-8")).hexdigest()

        try:
            created_user_id = await self._repo.create_user(
                username=body.username, password=hashed_password
            )

            if created_user_id is None:
                raise HTTPException(
                    status_code=status.HTTP_409_CONFLICT, detail="User already exist"
                )

            jwt = self._encode_jwt({"id": created_user_id, "username": body.username})
            return {"status": True, "jwt": jwt}

        except UniqueViolationError:
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT, detail="User already exist"
            )

        except Exception as e:
            if logger is not None:
                logger.error(f"Register user error: {e}")
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Internal server error",
            )

    async def authorize(self, auth: JWTUserInfo | None) -> dict:
        if auth is not None:
            return {"user": auth}

        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED, detail="No jwt provided"
        )
