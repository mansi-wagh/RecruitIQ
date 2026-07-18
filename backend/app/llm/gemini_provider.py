import os

import google.generativeai as genai

from app.llm.base import BaseLLMProvider
from app.logger import logger


class GeminiProvider(BaseLLMProvider):
    """
    Gemini implementation of the BaseLLMProvider.
    """

    def __init__(self):

        api_key = os.getenv("GEMINI_API_KEY")

        if not api_key:
            raise ValueError(
                "GEMINI_API_KEY not found in environment variables."
            )

        genai.configure(api_key=api_key)

        self.model = genai.GenerativeModel(
            "gemini-2.5-flash"
        )

    def generate(
        self,
        prompt: str,
        response_mime_type: str = "text/plain",
    ) -> str:
        try:
            config = genai.types.GenerationConfig(
                response_mime_type=response_mime_type
            )
            response = self.model.generate_content(prompt, generation_config=config)

            if not response or not response.text:
                logger.warning("Gemini returned an empty response")
                return "AI analysis is temporarily unavailable. Please try again."

            return response.text.strip()

        except Exception as e:
            logger.error("Gemini API error: %s", e, exc_info=True)
            return "AI analysis is temporarily unavailable due to an API error. Please try again later."

    async def generate_async(
        self,
        prompt: str,
        response_mime_type: str = "text/plain",
    ) -> str:
        try:
            config = genai.types.GenerationConfig(
                response_mime_type=response_mime_type
            )
            response = await self.model.generate_content_async(prompt, generation_config=config)

            if not response or not response.text:
                logger.warning("Gemini returned an empty response")
                return "AI analysis is temporarily unavailable. Please try again."

            return response.text.strip()

        except Exception as e:
            logger.error("Gemini API error: %s", e, exc_info=True)
            return "AI analysis is temporarily unavailable due to an API error. Please try again later."