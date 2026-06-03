from pydantic import BaseModel


class UploadImageDTO(BaseModel):
    img: str
    title: str


class UpdateImageDTO(BaseModel):
    id: str
    img: str
    new_title: str | None


class Image(BaseModel):
    id: str
    author_id: str
    title: str
    path: str
    created_at: str | None
    updated_at: str | None


class Pagination(BaseModel):
    limit: int = 5
    offset: int = 0
