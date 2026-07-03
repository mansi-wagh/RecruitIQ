import os

from app.llm.gemini_provider import GeminiProvider
from app.llm.base import BaseLLMProvider


class ProviderFactory:
    """
    Factory class responsible for creating
    the configured LLM provider.

    Future supported providers:
    - Gemini
    - OpenAI
    - Claude
    - Ollama
    """

    @staticmethod
    def get_provider() -> BaseLLMProvider:

        provider = os.getenv(
            "LLM_PROVIDER",
            "gemini",
        ).lower()

        if provider == "gemini":
            return GeminiProvider()

        raise ValueError(
            f"Unsupported LLM provider: {provider}"
        )