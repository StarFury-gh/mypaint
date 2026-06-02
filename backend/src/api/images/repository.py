from fastapi import UploadFile

import aiofiles
from pathlib import Path

from asyncpg import Connection
from typing import List

from asyncpg import ForeignKeyViolationError

from core.config import config_object
from .schemas import Image


class Images_Repository:
    def __init__(self, db: Connection) -> None:
        self._db = db

    def _prepare_to_model(self, record: dict) -> Image:
        return Image(
            id=str(record.get("id")),
            author_id=str(record.get("author_id")),
            path=record.get("path"),
            title=record.get("title"),
            created_at=str(record.get("created_at")),
            updated_at=str(record.get("updated_at")),
        )

    async def get_users_images(
        self, author_id: str, limit: int, offset: int
    ) -> List[Image]:
        records = await self._db.fetch(
            "SELECT id, title, author_id, path, created_at, updated_at FROM paintings WHERE author_id=$1 LIMIT $2 OFFSET $3",
            author_id,
            limit,
            offset,
        )

        records = [self._prepare_to_model(dict(record)) for record in records]

        return records

    async def save_image(self, file: UploadFile, author_id: str) -> str | None:
        tx = self._db.transaction()
        await tx.start()
        try:
            try:
                uuid = await self._db.fetchval(
                    "INSERT INTO paintings (title, author_id) VALUES ($1, $2) RETURNING id",
                    "MyPainting",
                    author_id,
                )
                await self._db.execute(
                    "UPDATE paintings SET path=$1 WHERE id=$2",
                    f"{uuid}.png",
                    uuid,
                )
                path = Path(config_object.UPLOAD_DIR) / f"{uuid}.png"
                async with aiofiles.open(path, "wb") as buffer:
                    content = await file.read()
                    await buffer.write(content)

                await tx.commit()

                return f"{uuid}.png"

            except ForeignKeyViolationError as e:
                await tx.rollback()
                raise e

        except ForeignKeyViolationError as e:
            raise e

        except Exception as e:
            print(f"Saving file error: {e}")
            await tx.rollback()
