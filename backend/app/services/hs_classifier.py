from app.services.llm_service import llm_service
from app.models.response_models import HSAnalysis

class HSClassifier:
    async def classify(self, product_description: str) -> HSAnalysis:
        system_prompt = (
            "You are a master customs agent. Classify the user's product description into its official 6-digit Harmonized System (HS) code. "
            "CRITICAL EXCEPTION: If the description is NOT a physical product that can be shipped (e.g., a person's name like 'John Doe', "
            "an abstract concept, software, or gibberish), you MUST return 'INVALID' as the predicted_code and 0.0 for confidence. "
            "Otherwise, rely entirely on your training data to find the most accurate 6-digit HS code. "
            "Output MUST be strictly valid JSON matching this schema: "
            '{"predicted_code": "123456" or "INVALID", "confidence": 0.95, "alternatives": ["123457"], "reasoning": "Explanation"}'
        )
        
        user_prompt = f"Product Description: {product_description}"
        raw_json = await llm_service.generate_json(system_prompt, user_prompt)
        return HSAnalysis(**raw_json)

hs_classifier = HSClassifier()