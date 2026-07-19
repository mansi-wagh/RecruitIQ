from typing import Dict, List


class EmbeddingGenerator:
    _instance = None
    _shared_model = None

    def __new__(cls, *args, **kwargs):
        if cls._instance is None:
            cls._instance = super(EmbeddingGenerator, cls).__new__(cls)
        return cls._instance

    def __init__(
        self,
        model_name: str = "all-MiniLM-L6-v2",
    ):
        if not hasattr(self, "initialized"):
            import time
            from app.logger import logger
            start_time = time.perf_counter()

            # Set torch threads to 1 to reduce memory footprint on limited host environments like Render
            try:
                import torch
                torch.set_num_threads(1)
            except Exception:
                pass
            
            from sentence_transformers import SentenceTransformer
            EmbeddingGenerator._shared_model = SentenceTransformer(model_name)
            self.model = EmbeddingGenerator._shared_model
            self.initialized = True

            elapsed = time.perf_counter() - start_time
            logger.info(f"[{elapsed:.1f}s] SentenceTransformer Loaded")

    def generate_embeddings(
        self,
        chunks: List[Dict],
    ) -> List[Dict]:

        texts = [
            chunk["text"]
            for chunk in chunks
        ]

        embeddings = self.model.encode(
            texts,
            convert_to_numpy=True,
        )

        results = []

        for chunk, embedding in zip(
            chunks,
            embeddings,
        ):

            results.append(
                {
                    **chunk,
                    "embedding": embedding.tolist(),
                }
            )

        return results