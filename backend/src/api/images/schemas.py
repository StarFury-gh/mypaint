from pydantic import BaseModel


class Image(BaseModel):
    id: str
    author_id: str


class Pagination(BaseModel):
    limit: int = 5
    offset: int = 0
