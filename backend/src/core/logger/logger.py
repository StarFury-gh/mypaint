from fastapi import Request

import logging
from typing import Optional


def get_logger(name: Optional[str] = None):
    """Создает dependency для получения логгера с указанным именем"""

    def _get_logger(request: Request):
        logger = logging.getLogger(name or "my_paint")
        # request ID для трейсинга
        logger = logging.LoggerAdapter(
            logger, {"request_id": getattr(request.state, "request_id", "N/A")}
        )
        return logger

    return _get_logger
