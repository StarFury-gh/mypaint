from dotenv import load_dotenv
from os import getenv


class Config:
    def __init__(self) -> None:
        load_dotenv()

        self.SERVER_HOST = getenv("SERVER_HOST") or "0.0.0.0"
        self.SERVER_PORT = int(getenv("SERVER_PORT") or 8000)
        self.ENV_TYPE = getenv("ENV_TYPE") or "dev"

        if self.ENV_TYPE == "dev":
            self.__POSTGRES_HOST = "localhost"
            self.__POSTGRES_PORT = 5432
            self.__POSTGRES_USER = "postgres"
            self.__POSTGRES_PASSWORD = "postgres"
            self.__POSTGRES_DB = "mypaint"
            self.JWT_SECRET_KEY = "CHANGE_ME"

        else:
            self.__POSTGRES_HOST = getenv("POSTGRES_HOST")
            self.__POSTGRES_PORT = int(getenv("POSTGRES_PORT") or 5432)
            self.__POSTGRES_USER = getenv("POSTGRES_USER")
            self.__POSTGRES_PASSWORD = getenv("POSTGRES_PASSWORD")
            self.__POSTGRES_DB = getenv("POSTGRES_DB")

        self.UPLOAD_DIR = "saved"
        self.JWT_SECRET_KEY = getenv("JWT_SECRET_KEY")
        self.POSTGRES_DSN = f"postgres://{self.__POSTGRES_USER}:{self.__POSTGRES_PASSWORD}@{self.__POSTGRES_HOST}:{self.__POSTGRES_PORT}/{self.__POSTGRES_DB}"


config_object = Config()
