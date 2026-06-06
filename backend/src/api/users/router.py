from fastapi import APIRouter, Depends, Request

from core.logger import get_logger
from core.security import get_authorization
from core.limiter.slowapi import limiter

from .schemas import RegisterUserDTO, LoginUserDTO
from .dependencies import get_users_service

users_router = APIRouter(prefix="/users", tags=["users"])


@users_router.post("/register")
@limiter.limit("10/minute")
async def register_user(
    request: Request,
    body: RegisterUserDTO,
    service=Depends(get_users_service),
    logger=Depends(get_logger(__name__)),
):
    return await service.register(body, logger=logger)


@users_router.post("/login")
@limiter.limit("10/minute")
async def login_user(
    request: Request, body: LoginUserDTO, service=Depends(get_users_service)
):
    return await service.login(body)


@users_router.get("/auth")
@limiter.limit("10/minute")
async def authorize(
    request: Request,
    authorization=Depends(get_authorization),
    service=Depends(get_users_service),
):
    return await service.authorize(authorization)
