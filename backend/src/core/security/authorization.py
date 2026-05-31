from fastapi import Depends, Header

from api.users.dependencies import get_users_service, Users_Service
from .schemas import JWTUserInfo


async def get_authorization(
    users_service: Users_Service = Depends(get_users_service),
    authorization=Header(None, alias="Authorization"),
) -> JWTUserInfo | None:

    try:
        if authorization is None:
            return None

        payload = users_service._decode_jwt(authorization)

        return JWTUserInfo(**payload)

    except Exception as e:
        print(f"Decoding error at 'get_authorization': {e}")
        return None
