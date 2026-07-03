from typing import Dict, List

from sentence_transformers import SentenceTransformer


class EmbeddingGenerator:

    def __init__(
        self,
        model_name: str = "all-MiniLM-L6-v2",
    ):

        self.model = SentenceTransformer(model_name)

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