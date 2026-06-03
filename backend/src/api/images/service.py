from fastapi import HTTPException, status, UploadFile
from pydantic import Base64Str

from asyncpg import ForeignKeyViolationError

from core.security.authorization import JWTUserInfo

from .repository import Images_Repository


class Images_Service:
    def __init__(self, repository: Images_Repository) -> None:
        self._repo = repository

    async def get_image_by_id(self, authorization: JWTUserInfo, image_id: str):
        if authorization is None:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN, detail="Authorization required"
            )

        image = await self._repo.get_image_by_id(
            image_id=image_id, author_id=authorization.id
        )

        if image is None:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND, detail="Image not found"
            )

        return {"image": image}

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

    async def upload_file(
        self, file: UploadFile, authorization: JWTUserInfo, title: str
    ):
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
            result = await self._repo.save_image(
                file=file, author_id=authorization.id, title=title
            )
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

    async def upload_base64(
        self, base64: Base64Str, title: str, authorization: JWTUserInfo
    ):
        if authorization is None:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Authorization required",
            )

        if base64 is None:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST, detail="Base64 is required"
            )
        if title is None:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST, detail="Title is required"
            )

        try:
            result = await self._repo.save_base64(
                base64_str=base64, title=title, author_id=authorization.id
            )
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

    async def delete_image(self, id: str, authorization: JWTUserInfo):
        if authorization is None:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Authorization required",
            )

        result = await self._repo.delete(id=id, author_id=authorization.id)

        if result is None:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND, detail="Image not found"
            )

        return {"status": True, "deleted": result}

    async def update_image(
        self, new_title: str | None, id: str, image: str, authorization: JWTUserInfo
    ):
        if authorization is None:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Authorization required",
            )

        if image is None:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST, detail="Image is required"
            )

        result = await self._repo.update_image_content(
            new_title=new_title, id=id, new_img=image, author_id=authorization.id
        )

        if result is None:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND, detail="Image not found"
            )

        return {"status": True, "updated": result}
