from typing import Dict, List

from app.llm.provider_factory import ProviderFactory
from app.llm.prompts import (
    candidate_summary_prompt,
    skill_gap_prompt,
    interview_questions_prompt,
    resume_improvement_prompt,
)
class LLMService:
    """
    Handles all AI interactions for RecruitIQ.
    """

    def __init__(self):
        self.provider = ProviderFactory.get_provider()
        self._retriever = None

    @property
    def retriever(self):
        if self._retriever is None:
            from app.rag.retriever import DocumentRetriever
            self._retriever = DocumentRetriever()
        return self._retriever

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
        context = self._build_context("candidate hiring policy")
        prompt = candidate_summary_prompt(resume, prediction, context)
        raw_response = self.provider.generate(prompt, response_mime_type="application/json")
        try:
            import json
            data = json.loads(raw_response)
            summary = data.get("candidate_summary", "")
            strengths = "\n".join(f"- {s}" for s in data.get("strengths", []))
            weaknesses = "\n".join(f"- {w}" for w in data.get("weaknesses", []))
            rec = data.get("hiring_recommendation", "")
            return f"{summary}\n\n**Key Strengths**:\n{strengths}\n\n**Areas for Growth**:\n{weaknesses}\n\n**Recommendation**:\n{rec}"
        except Exception:
            return raw_response

    async def generate_candidate_summary_async(
        self,
        resume: Dict,
        prediction: Dict,
    ) -> str:
        context = self._build_context("candidate hiring policy")
        prompt = candidate_summary_prompt(resume, prediction, context)
        raw_response = await self.provider.generate_async(prompt, response_mime_type="application/json")
        try:
            import json
            data = json.loads(raw_response)
            summary = data.get("candidate_summary", "")
            strengths = "\n".join(f"- {s}" for s in data.get("strengths", []))
            weaknesses = "\n".join(f"- {w}" for w in data.get("weaknesses", []))
            rec = data.get("hiring_recommendation", "")
            return f"{summary}\n\n**Key Strengths**:\n{strengths}\n\n**Areas for Growth**:\n{weaknesses}\n\n**Recommendation**:\n{rec}"
        except Exception:
            return raw_response

    def generate_skill_gap(
        self,
        matched_skills: List[str],
        missing_skills: List[str],
    ) -> str:
        context = self._build_context("skill gap policy")
        prompt = skill_gap_prompt(matched_skills, missing_skills, context)
        raw_response = self.provider.generate(prompt, response_mime_type="application/json")
        try:
            import json
            data = json.loads(raw_response)
            strengths = data.get("strengths_analysis", "")
            weaknesses = data.get("weaknesses_analysis", "")
            roadmap = "\n".join(f"- {step}" for step in data.get("learning_roadmap", []))
            return f"**Current Competencies**:\n{strengths}\n\n**Skill Gap Analysis**:\n{weaknesses}\n\n**Upskilling Roadmap**:\n{roadmap}"
        except Exception:
            return raw_response

    async def generate_skill_gap_async(
        self,
        matched_skills: List[str],
        missing_skills: List[str],
    ) -> str:
        context = self._build_context("skill gap policy")
        prompt = skill_gap_prompt(matched_skills, missing_skills, context)
        raw_response = await self.provider.generate_async(prompt, response_mime_type="application/json")
        try:
            import json
            data = json.loads(raw_response)
            strengths = data.get("strengths_analysis", "")
            weaknesses = data.get("weaknesses_analysis", "")
            roadmap = "\n".join(f"- {step}" for step in data.get("learning_roadmap", []))
            return f"**Current Competencies**:\n{strengths}\n\n**Skill Gap Analysis**:\n{weaknesses}\n\n**Upskilling Roadmap**:\n{roadmap}"
        except Exception:
            return raw_response

    def generate_interview_questions(
        self,
        missing_skills: List[str],
    ) -> str:
        context = self._build_context("technical interview guide")
        prompt = interview_questions_prompt(missing_skills, context)
        raw_response = self.provider.generate(prompt, response_mime_type="application/json")
        try:
            import json
            data = json.loads(raw_response)
            questions_list = []
            for i, q in enumerate(data.get("questions", []), 1):
                skill_name = q.get("skill", "")
                question_text = q.get("question", "")
                questions_list.append(f"{i}. **{skill_name.title()}**: {question_text}")
            return "\n".join(questions_list)
        except Exception:
            return raw_response

    async def generate_interview_questions_async(
        self,
        missing_skills: List[str],
    ) -> str:
        context = self._build_context("technical interview guide")
        prompt = interview_questions_prompt(missing_skills, context)
        raw_response = await self.provider.generate_async(prompt, response_mime_type="application/json")
        try:
            import json
            data = json.loads(raw_response)
            questions_list = []
            for i, q in enumerate(data.get("questions", []), 1):
                skill_name = q.get("skill", "")
                question_text = q.get("question", "")
                questions_list.append(f"{i}. **{skill_name.title()}**: {question_text}")
            return "\n".join(questions_list)
        except Exception:
            return raw_response

    def generate_resume_suggestions(
        self,
        missing_skills: List[str],
    ) -> str:
        context = self._build_context("resume writing guideline")
        prompt = resume_improvement_prompt(missing_skills, context)
        raw_response = self.provider.generate(prompt, response_mime_type="application/json")
        try:
            import json
            data = json.loads(raw_response)
            suggestions = "\n".join(f"- {s}" for s in data.get("suggestions", []))
            return suggestions
        except Exception:
            return raw_response

    async def generate_resume_suggestions_async(
        self,
        missing_skills: List[str],
    ) -> str:
        context = self._build_context("resume writing guideline")
        prompt = resume_improvement_prompt(missing_skills, context)
        raw_response = await self.provider.generate_async(prompt, response_mime_type="application/json")
        try:
            import json
            data = json.loads(raw_response)
            suggestions = "\n".join(f"- {s}" for s in data.get("suggestions", []))
            return suggestions
        except Exception:
            return raw_response


    def generate_chat_response(self, query: str) -> dict:
        """
        RAG Chat assistant for HR policy queries.
        """
        # Retrieve context from ChromaDB
        retrieved_docs = self.retriever.retrieve(query, top_k=3)
        
        if not retrieved_docs:
            context = "No specific company knowledge documents matched this query."
        else:
            context = "\n\n".join(
                f"[Source: {doc['source']}] (Category: {doc['category']})\n{doc['document']}"
                for doc in retrieved_docs
            )
            
        prompt = f"""
You are RecruitIQ HR assistant. You answer recruiter questions regarding company policies, recruitment procedures, guidelines, and interview questions.

Use the following retrieved context passages to answer the user's query. If the context does not contain the answer, say "Based on the company documentation, I couldn't find the answer, but here is what I know: " and answer generally based on your knowledge. Keep the response professional, concise, and structured.

Retrieved Context:
{context}

User Query:
{query}

Response:
"""
        response_text = self.provider.generate(prompt)
        
        # Extract unique sources
        sources = list(set(doc["source"] for doc in retrieved_docs if doc.get("source")))
        
        return {
            "text": response_text,
            "sources": sources
        }