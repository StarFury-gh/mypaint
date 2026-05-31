from fastapi import APIRouter, Depends, UploadFile, File
from fastapi.staticfiles import StaticFiles

from core.security import get_authorization

from .dependencies import get_images_service, Images_Service
from .schemas import Pagination

images_router = APIRouter(prefix="/images", tags=["images"])
images_router.mount("/files", StaticFiles(directory="./saved"))


@images_router.get("/")
async def get_users_images(
    authorization=Depends(get_authorization),
    pagination=Depends(Pagination),
    service: Images_Service = Depends(get_images_service),
):
    return await service.get_users_images(
        authorization, limit=pagination.limit, offset=pagination.offset
    )


@images_router.post("/upload")
async def upload_file(
    service: Images_Service = Depends(get_images_service),
    authorization=Depends(get_authorization),
    file: UploadFile = File(),
):
    return await service.upload_file(file=file, authorization=authorization)
