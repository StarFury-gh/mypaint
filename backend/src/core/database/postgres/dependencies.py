from fastapi import Request
from asyncpg import create_pool

from core.config import config_object


async def create_pg_pool():
    pool = await create_pool(dsn=config_object.POSTGRES_DSN)
    return pool


async def get_pg_conn(req: Request):
    async with req.app.state.pg_pool.acquire() as conn:
        yield conn
