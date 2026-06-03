from fastapi import APIRouter, Depends

from core.security import get_authorization

from .dependencies import get_images_service, Images_Service
from .schemas import Pagination, UploadImageDTO, UpdateImageDTO

images_router = APIRouter(prefix="/images", tags=["images"])


@images_router.get("/")
async def get_users_images(
    authorization=Depends(get_authorization),
    pagination=Depends(Pagination),
    service: Images_Service = Depends(get_images_service),
):
    return await service.get_users_images(
        authorization, limit=pagination.limit, offset=pagination.offset
    )


@images_router.get("/{image_id}")
async def get_image_by_id(
    image_id: str,
    authorization=Depends(get_authorization),
    service: Images_Service = Depends(get_images_service),
):
    return await service.get_image_by_id(image_id=image_id, authorization=authorization)


@images_router.post("/upload")
async def upload_file(
    body: UploadImageDTO,
    service: Images_Service = Depends(get_images_service),
    authorization=Depends(get_authorization),
):
    return await service.upload_base64(
        base64=body.img, authorization=authorization, title=body.title
    )


@images_router.patch("/update")
async def update_image(
    body: UpdateImageDTO,
    service: Images_Service = Depends(get_images_service),
    authorization=Depends(get_authorization),
):
    return await service.update_image(
        new_title=body.new_title,
        id=body.id,
        image=body.img,
        authorization=authorization,
    )


@images_router.delete("/{image_id}")
async def delete_image(
    image_id: str,
    authorization=Depends(get_authorization),
    service: Images_Service = Depends(get_images_service),
):
    return await service.delete_image(id=image_id, authorization=authorization)
