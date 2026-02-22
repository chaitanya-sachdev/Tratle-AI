from app.services.llm_service import llm_service
from app.models.response_models import HSAnalysis, AlternativeCode

class HSClassifier:
    async def classify(self, product_description: str) -> HSAnalysis:
        system_prompt = (
            "You are a master customs agent. Classify the user's product description into its official 6-digit Harmonized System (HS) code. "
            "CRITICAL EXCEPTION: If the description is NOT a physical product that can be shipped (e.g., a person's name like 'John Doe', "
            "an abstract concept, software, or gibberish), you MUST return 'INVALID' as the predicted_code and 0.0 for confidence. "
            "Otherwise, rely entirely on your training data to find the most accurate 6-digit HS code. "
            "Output MUST be strictly valid JSON matching this schema: "
            '{"predicted_code": "123456" or "INVALID", "confidence": 0.95, "alternatives": [{"code": "123457", "description": "Description", "confidence": 0.85}], "reasoning": "Explanation"}'
        )
        
        user_prompt = f"Product Description: {product_description}"
        raw_json = await llm_service.generate_json(system_prompt, user_prompt)
        
        # Convert alternatives to AlternativeCode objects if needed
        if 'alternatives' in raw_json and isinstance(raw_json['alternatives'], list):
            alternatives = []
            for alt in raw_json['alternatives']:
                if isinstance(alt, str):
                    # Convert string to AlternativeCode object
                    alternatives.append(AlternativeCode(code=alt, description="Alternative classification", confidence=0.0))
                elif isinstance(alt, dict):
                    alternatives.append(AlternativeCode(**alt))
            raw_json['alternatives'] = alternatives
        
        return HSAnalysis(**raw_json)

hs_classifier = HSClassifier()