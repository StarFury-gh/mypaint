from pydantic import BaseModel


class User(BaseModel):
    id: str
    username: str
    password: str


class RegisterUserDTO(BaseModel):
    username: str
    password: str


class LoginUserDTO(BaseModel):
    username: str
    password: str
