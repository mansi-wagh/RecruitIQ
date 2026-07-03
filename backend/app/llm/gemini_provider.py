import os

import google.generativeai as genai

from app.llm.base import BaseLLMProvider


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
    ) -> str:

        response = self.model.generate_content(
            prompt
        )

        return response.text.strip()