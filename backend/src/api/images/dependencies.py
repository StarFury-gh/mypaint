from fastapi import Depends

from core.database.postgres import get_pg_conn

from .repository import Images_Repository
from .service import Images_Service


def get_images_repository(pg_conn=Depends(get_pg_conn)):
    return Images_Repository(pg_conn)


def get_images_service(repository=Depends(get_images_repository)):
    return Images_Service(repository=repository)
