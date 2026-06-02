from pydantic import BaseModel


class UploadImageDTO(BaseModel):
    img: str
    title: str


class Image(BaseModel):
    id: str
    author_id: str
    title: str
    path: str
    created_at: str
    updated_at: str


class Pagination(BaseModel):
    limit: int = 5
    offset: int = 0
