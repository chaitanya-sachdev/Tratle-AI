import json
import re
import os
from typing import List, Dict, Any
from groq import AsyncGroq
from pydantic import BaseModel
from dotenv import load_dotenv
load_dotenv()
class HSClassificationResult(BaseModel):
    predicted_code: str
    confidence: float
    alternatives: List[str]
    reasoning: str

class LLMService:
    def __init__(self):
        # Utilizing Groq for Llama-3 (Fast, Free Tier)
        api_key = os.getenv("GROQ_API_KEY")
        if not api_key:
            raise ValueError("GROQ_API_KEY environment variable is missing.")
        
        self.client = AsyncGroq(api_key=api_key)
        self.model = "llama3-70b-8192"

    async def classify_product(self, product_description: str, candidates: List[Dict[str, Any]]) -> HSClassificationResult:
        """Calls LLM to classify product based on user description and FAISS context."""
        context_str = "\n".join([
            f"- HS Code: {c.get('hs_code')}, Description: {c.get('description')}" 
            for c in candidates
        ])

        system_prompt = (
            "You are an expert customs agent specializing in 6-digit HS code classification. "
            "You will receive a product description and a list of candidate HS codes retrieved via semantic search. "
            "Select the most accurate 6-digit HS code from the candidates, or suggest a better valid 6-digit code if none fit. "
            "You MUST output strictly valid JSON matching this schema: "
            '{"predicted_code": "string", "confidence": float, "alternatives": ["string"], "reasoning": "string"}. '
            "Do NOT include markdown formatting, code blocks, or explanations outside the JSON."
        )

        user_prompt = (
            f"Product Description: {product_description}\n\n"
            f"Candidate HS Codes:\n{context_str}"
        )

        try:
            response = await self.client.chat.completions.create(
                messages=[
                    {"role": "system", "content": system_prompt},
                    {"role": "user", "content": user_prompt}
                ],
                model=self.model,
                temperature=0.0,
                response_format={"type": "json_object"}
            )
            
            raw_output = response.choices[0].message.content
            return self._parse_json_response(raw_output)

        except Exception as e:
            # Catching rate limits (429) or other API errors
            raise RuntimeError(f"LLM Inference failed: {str(e)}")

    def _parse_json_response(self, raw_text: str) -> HSClassificationResult:
        """Parses LLM output with regex fallback for markdown code blocks."""
        try:
            parsed_json = json.loads(raw_text)
            return HSClassificationResult(**parsed_json)
        except json.JSONDecodeError:
            json_match = re.search(r'```(?:json)?\s*(\{.*?\})\s*```', raw_text, re.DOTALL)
            if json_match:
                try:
                    parsed_json = json.loads(json_match.group(1))
                    return HSClassificationResult(**parsed_json)
                except json.JSONDecodeError:
                    pass
            raise ValueError(f"Failed to extract valid JSON from LLM output. Raw: {raw_text}")

# Singleton instance for FastAPI dependency injection
llm_service = LLMService()