from fastapi import Depends

from core.database.postgres import get_pg_conn

from .service import Users_Service
from .pg_repository import PG_Users_Repository


def get_pg_repo(conn=Depends(get_pg_conn)) -> PG_Users_Repository:
    return PG_Users_Repository(conn)


def get_users_service(
    repository: PG_Users_Repository = Depends(get_pg_repo),
) -> Users_Service:
    return Users_Service(repository)
