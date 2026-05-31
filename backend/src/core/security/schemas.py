from pydantic import BaseModel


class JWTUserInfo(BaseModel):
    id: str
    username: str
