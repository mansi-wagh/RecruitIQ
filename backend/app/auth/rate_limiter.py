import os
import time
import threading
from collections import defaultdict
from fastapi import Request, HTTPException, status

class InMemoryRateLimiter:
    """
    A thread-safe, zero-dependency in-memory rate limiter using a sliding window.
    """
    def __init__(self, requests_limit: int, window_seconds: int):
        self.requests_limit = requests_limit
        self.window_seconds = window_seconds
        self.history = defaultdict(list)
        self._lock = threading.Lock()

    def is_allowed(self, client_ip: str) -> bool:
        # Bypass rate limiting in SQLite test environments to avoid blocking test runs
        if os.getenv("DATABASE_URL", "").startswith("sqlite"):
            return True

        now = time.time()
        with self._lock:
            # Filter history to keep only timestamps within the sliding window
            self.history[client_ip] = [
                t for t in self.history[client_ip]
                if now - t < self.window_seconds
            ]
            if len(self.history[client_ip]) >= self.requests_limit:
                return False
            self.history[client_ip].append(now)
            return True

    def __call__(self, request: Request):
        client_ip = request.client.host if request.client else "unknown"
        # Support proxies such as Render, Cloudflare, etc.
        forwarded = request.headers.get("x-forwarded-for")
        if forwarded:
            client_ip = forwarded.split(",")[0].strip()

        if not self.is_allowed(client_ip):
            raise HTTPException(
                status_code=status.HTTP_429_TOO_MANY_REQUESTS,
                detail="Too many requests. Please try again later."
            )

# Shared Rate Limiter Instances
login_limiter = InMemoryRateLimiter(requests_limit=5, window_seconds=60)
register_limiter = InMemoryRateLimiter(requests_limit=5, window_seconds=60)
ai_limiter = InMemoryRateLimiter(requests_limit=10, window_seconds=60)
chat_limiter = InMemoryRateLimiter(requests_limit=10, window_seconds=60)
