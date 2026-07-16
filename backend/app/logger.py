"""
Centralized logging configuration for RecruitIQ.

Usage:
    from app.logger import logger
    logger.info("Something happened")
    logger.error("Something failed", exc_info=True)
"""

import logging
import sys

LOG_FORMAT = "%(asctime)s | %(levelname)-8s | %(name)s:%(funcName)s:%(lineno)d — %(message)s"
LOG_DATE_FORMAT = "%Y-%m-%d %H:%M:%S"


def _create_logger() -> logging.Logger:
    _logger = logging.getLogger("recruitiq")
    _logger.setLevel(logging.DEBUG)

    if not _logger.handlers:
        console = logging.StreamHandler(sys.stdout)
        console.setLevel(logging.INFO)
        console.setFormatter(logging.Formatter(LOG_FORMAT, datefmt=LOG_DATE_FORMAT))
        _logger.addHandler(console)

    return _logger


logger = _create_logger()
