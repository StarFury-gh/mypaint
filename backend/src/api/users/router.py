from fastapi import APIRouter, Depends

from core.logger import get_logger
from core.security import get_authorization

from .schemas import RegisterUserDTO, LoginUserDTO
from .dependencies import get_users_service

users_router = APIRouter(prefix="/users", tags=["users"])


@users_router.post("/register")
async def register_user(
    body: RegisterUserDTO,
    service=Depends(get_users_service),
    logger=Depends(get_logger(__name__)),
):
    return await service.register(body, logger=logger)


@users_router.post("/login")
async def login_user(body: LoginUserDTO, service=Depends(get_users_service)):
    return await service.login(body)


@users_router.get("/auth")
async def authorize(
    authorization=Depends(get_authorization), service=Depends(get_users_service)
):
    return service.authorize(authorization)
