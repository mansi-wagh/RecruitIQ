from abc import ABC, abstractmethod


class BaseLLMProvider(ABC):
    """
    Base interface for all LLM providers.

    Every provider (Gemini, OpenAI, Claude,
    Ollama, etc.) must implement this class.
    """

    @abstractmethod
    def generate(
        self,
        prompt: str,
    ) -> str:
        """
        Generate a response for the supplied prompt.
        """
        pass

    @abstractmethod
    async def generate_async(
        self,
        prompt: str,
        response_mime_type: str = "text/plain",
    ) -> str:
        """
        Generate a response asynchronously.
        """
        pass