import json
import os
import numpy as np
import faiss
from typing import List, Dict, Any
from sentence_transformers import SentenceTransformer

class HSClassifier:
    def __init__(self, data_path: str = "app/data/hs_codes.json"):
        self.data_path = data_path
        self.model_name = "all-MiniLM-L6-v2"
        # Load lightweight embedding model
        self.model = SentenceTransformer(self.model_name)
        self.hs_data: List[Dict[str, str]] = []
        self.index: faiss.IndexFlatL2 | None = None
        
        self._load_and_build_index()

    def _load_and_build_index(self) -> None:
        """Loads HS codes from JSON and builds the FAISS vector index."""
        if not os.path.exists(self.data_path):
            # For hackathon robust startup, initialize empty if missing, but log it
            print(f"Warning: Data file not found at {self.data_path}")
            return
            
        with open(self.data_path, 'r', encoding='utf-8') as f:
            self.hs_data = json.load(f)
            
        if not self.hs_data:
            return

        descriptions = [item.get("description", "") for item in self.hs_data]
        embeddings = self.model.encode(descriptions, convert_to_numpy=True)
        
        dimension = embeddings.shape[1]
        self.index = faiss.IndexFlatL2(dimension)
        self.index.add(embeddings)

    def get_candidate_codes(self, query: str, k: int = 5) -> List[Dict[str, Any]]:
        """Performs semantic search to find top k closest HS codes."""
        if self.index is None or not self.hs_data:
            raise RuntimeError("FAISS index is not initialized or data is empty.")
            
        query_embedding = self.model.encode([query], convert_to_numpy=True)
        distances, indices = self.index.search(query_embedding, k)
        
        results = []
        for i, idx in enumerate(indices[0]):
            if idx != -1 and idx < len(self.hs_data):
                result_item = self.hs_data[idx].copy()
                result_item["distance"] = float(distances[0][i])
                results.append(result_item)
                
        return results

# Singleton instance for FastAPI dependency injection
hs_classifier = HSClassifier()