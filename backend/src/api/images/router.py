from fastapi import APIRouter, Depends, Request

from core.security import get_authorization
from core.limiter.slowapi import limiter

from .dependencies import get_images_service, Images_Service
from .schemas import Pagination, UploadImageDTO, UpdateImageDTO

images_router = APIRouter(prefix="/images", tags=["images"])


@images_router.get("/")
@limiter.limit("10/minute")
async def get_users_images(
    request: Request,
    authorization=Depends(get_authorization),
    pagination=Depends(Pagination),
    service: Images_Service = Depends(get_images_service),
):
    return await service.get_users_images(
        authorization, limit=pagination.limit, offset=pagination.offset
    )


@images_router.get("/{image_id}")
@limiter.limit("25/minute")
async def get_image_by_id(
    request: Request,
    image_id: str,
    authorization=Depends(get_authorization),
    service: Images_Service = Depends(get_images_service),
):
    return await service.get_image_by_id(image_id=image_id, authorization=authorization)


@images_router.post("/upload")
@limiter.limit("10/minute")
async def upload_file(
    request: Request,
    body: UploadImageDTO,
    service: Images_Service = Depends(get_images_service),
    authorization=Depends(get_authorization),
):
    return await service.upload_base64(
        base64=body.img, authorization=authorization, title=body.title
    )


@images_router.patch("/update")
@limiter.limit("10/minute")
async def update_image(
    request: Request,
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
@limiter.limit("10/minute")
async def delete_image(
    request: Request,
    image_id: str,
    authorization=Depends(get_authorization),
    service: Images_Service = Depends(get_images_service),
):
    return await service.delete_image(id=image_id, authorization=authorization)
