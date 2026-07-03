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