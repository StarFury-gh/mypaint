from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

from slowapi import _rate_limit_exceeded_handler
from slowapi.errors import RateLimitExceeded
from slowapi.middleware import SlowAPIMiddleware

from prometheus_fastapi_instrumentator import Instrumentator

from core.limiter.slowapi import limiter

from uvicorn import run

from contextlib import asynccontextmanager
import os

from api.users import users_router
from api.images import images_router

from core.config import config_object
from core.database.postgres import create_pg_pool


@asynccontextmanager
async def lifespan(app: FastAPI):
    pool = await create_pg_pool()
    app.state.pg_pool = pool

    app.state.limiter = limiter

    yield
    await app.state.pg_pool.close()


os.makedirs("./saved", exist_ok=True)


app = FastAPI(lifespan=lifespan)
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)  # type: ignore
Instrumentator().instrument(app).expose(app)
app.mount("/images/saved", StaticFiles(directory="./saved", check_dir=True))

app.add_middleware(SlowAPIMiddleware)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://frontend:80",
        "http://frontend:8080",
    ],
    allow_credentials=True,
    allow_methods=["GET", "POST", "DELETE", "PATCH"],
    allow_headers=["*"],
)

app.include_router(users_router)
app.include_router(images_router)


@app.get("/health")
def health():
    return {"status": "healthy"}


if __name__ == "__main__":
    run(
        "main:app",
        host=config_object.SERVER_HOST,
        port=config_object.SERVER_PORT,
        reload=config_object.ENV_TYPE == "dev",
    )
