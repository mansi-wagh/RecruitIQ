from typing import Dict, List

from app.llm.provider_factory import ProviderFactory
from app.llm.prompts import (
    candidate_summary_prompt,
    skill_gap_prompt,
    interview_questions_prompt,
    resume_improvement_prompt,
)
from app.rag.retriever import DocumentRetriever


class LLMService:
    """
    Handles all AI interactions for RecruitIQ.
    """

    def __init__(self):

        self.provider = ProviderFactory.get_provider()

        self.retriever = DocumentRetriever()

    def _build_context(
        self,
        query: str,
    ) -> str:
        """
        Retrieves relevant documents from ChromaDB
        and converts them into a single context string.
        """

        retrieved_docs = self.retriever.retrieve(query)

        if not retrieved_docs:
            return "No relevant company knowledge found."

        context = "\n\n".join(
            doc["document"]
            for doc in retrieved_docs
        )

        return context

    def generate_candidate_summary(
        self,
        resume: Dict,
        prediction: Dict,
    ) -> str:

        context = self._build_context(
            "candidate hiring policy"
        )

        prompt = candidate_summary_prompt(
            resume,
            prediction,
            context,
        )

        return self.provider.generate(prompt)

    def generate_skill_gap(
        self,
        matched_skills: List[str],
        missing_skills: List[str],
    ) -> str:

        context = self._build_context(
            "skill gap policy"
        )

        prompt = skill_gap_prompt(
            matched_skills,
            missing_skills,
            context,
        )

        return self.provider.generate(prompt)

    def generate_interview_questions(
        self,
        missing_skills: List[str],
    ) -> str:

        context = self._build_context(
            "technical interview guide"
        )

        prompt = interview_questions_prompt(
            missing_skills,
            context,
        )

        return self.provider.generate(prompt)

    def generate_resume_suggestions(
        self,
        missing_skills: List[str],
    ) -> str:

        context = self._build_context(
            "resume writing guideline"
        )

        prompt = resume_improvement_prompt(
            missing_skills,
            context,
        )

        return self.provider.generate(prompt)