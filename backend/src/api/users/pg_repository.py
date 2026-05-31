from asyncpg import Connection

from .schemas import User


class PG_Users_Repository:
    def __init__(self, db: Connection) -> None:
        self._db = db

    async def get_user_id_by_credentials(
        self, username: str, password: str
    ) -> str | None:
        user_id = await self._db.fetchval(
            "SELECT id FROM users WHERE username=$1 AND password=$2",
            username,
            password,
        )

        if user_id is not None:
            return str(user_id)

        return None

    async def get_user_by_id(self, u_id: str) -> User | None:
        result = await self._db.fetchrow(
            "SELECT id, username, password, created_at FROM users WHERE id=$1", u_id
        )

        if result is not None:
            result["id"] = str(result["id"])
            return User(**result)

        return None

    async def create_user(self, username: str, password: str) -> str | None:
        u_id = await self._db.fetchval(
            "INSERT INTO users (username, password) VALUES($1, $2) RETURNING id",
            username,
            password,
        )

        if u_id is not None:
            return str(u_id)

        return None
