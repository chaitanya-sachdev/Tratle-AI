import asyncio
import sys
from app.services.hs_classifier import hs_classifier
from app.services.llm_service import llm_service, HSClassificationResult

async def run_tests():
    print("--- 1. Testing FAISS Vector Retrieval ---")
    test_query = "Apple iPhone 15 Pro Max 256GB"
    
    try:
        candidates = hs_classifier.get_candidate_codes(test_query, k=5)
        print(f"Query: {test_query}")
        print(f"Top Candidate Retrieved: {candidates[0]['hs_code']} - {candidates[0]['description']}")
        
        # Explicit assertion for Architect's requirement
        assert any(c['hs_code'].startswith('851713') for c in candidates), "CRITICAL: FAISS failed to map iPhone to 851713."
        print("✅ FAISS Retrieval Passed.")
    except Exception as e:
        print(f"❌ FAISS Retrieval Failed: {e}")
        sys.exit(1)

    print("\n--- 2. Stress-Testing Groq LLM JSON Output ---")
    edge_cases = [
        "Apple iPhone 15 Pro Max 256GB",
        "Used 2015 Toyota Corolla front bumper plastic clip",
        "Industrial CNC 5-axis milling machine replacement spindle 220V",
        "Organic raw unroasted arabica coffee beans from Colombia 50kg bag",
        "Mens 100% cotton crewneck t-shirt size large black"
    ]

    for i, product in enumerate(edge_cases, 1):
        try:
            candidates = hs_classifier.get_candidate_codes(product, k=3)
            result: HSClassificationResult = await llm_service.classify_product(product, candidates)
            
            # Validation happens implicitly via Pydantic model (HSClassificationResult)
            print(f"Test {i}/5 PASSED | Query: '{product[:30]}...' -> Code: {result.predicted_code} | Conf: {result.confidence}")
            
        except Exception as e:
            print(f"❌ LLM JSON Validation Failed on Test {i}: {e}")
            sys.exit(1)
            
    print("\n✅ All NLP Pipeline Tests Passed. Ready for integration.")

if __name__ == "__main__":
    asyncio.run(run_tests())