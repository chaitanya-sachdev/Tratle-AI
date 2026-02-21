import os
import json
from groq import AsyncGroq
from dotenv import load_dotenv

load_dotenv()

class LLMService:
    def __init__(self):
        api_key = os.getenv("GROQ_API_KEY")
        if not api_key:
            raise ValueError("GROQ_API_KEY is missing from .env")
        self.client = AsyncGroq(api_key=api_key)
        self.model = "llama-3.3-70b-versatile"

    async def generate_json(self, system_prompt: str, user_prompt: str) -> dict:
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
            return json.loads(raw_output)
        except Exception as e:
            raise RuntimeError(f"LLM Inference failed: {str(e)}")

llm_service = LLMService()