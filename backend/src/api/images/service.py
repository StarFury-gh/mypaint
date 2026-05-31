from fastapi import HTTPException, status, UploadFile

from asyncpg import ForeignKeyViolationError

from core.security.authorization import JWTUserInfo

from .repository import Images_Repository


class Images_Service:
    def __init__(self, repository: Images_Repository) -> None:
        self._repo = repository

    async def get_users_images(
        self, authorization: JWTUserInfo | None, limit: int, offset: int
    ):
        if authorization is None:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Authorization required",
            )

        images = await self._repo.get_users_images(
            author_id=authorization.id, limit=limit, offset=offset
        )

        return {"images": images}

    async def upload_file(self, file: UploadFile, authorization: JWTUserInfo):
        if authorization is None:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Authorization required",
            )

        if not file.content_type.startswith("image/"):  # type: ignore
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="You can only upload images",
            )

        try:
            result = await self._repo.save_image(file=file, author_id=authorization.id)
        except ForeignKeyViolationError:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED, detail="User does not exists"
            )

        if result is None:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Internal server error",
            )

        return {"status": True, "uploaded_file": result}
