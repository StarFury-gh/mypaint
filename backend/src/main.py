from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

from uvicorn import run

from contextlib import asynccontextmanager

from api.users import users_router
from api.images import images_router

from core.config import config_object
from core.database.postgres import create_pg_pool


@asynccontextmanager
async def lifespan(app: FastAPI):
    pool = await create_pg_pool()
    app.state.pg_pool = pool
    yield
    await app.state.pg_pool.close()


app = FastAPI(lifespan=lifespan)
app.mount("/images/saved", StaticFiles(directory="./saved", check_dir=True))

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
