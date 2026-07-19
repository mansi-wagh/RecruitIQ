import os
import google.generativeai as genai
from app.logger import logger
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
        model_name: str = "models/gemini-embedding-001",
    ):
        if not hasattr(self, "initialized"):
            import time
            start_time = time.perf_counter()

            api_key = os.getenv("GEMINI_API_KEY")
            if api_key:
                genai.configure(api_key=api_key)
            else:
                logger.warning("GEMINI_API_KEY not found in environment variables.")

            class GeminiEmbeddingWrapper:
                def __init__(self, model_name: str):
                    self.model_name = model_name

                def encode(self, texts, convert_to_numpy=True):
                    import numpy as np
                    import time as py_time

                    is_single = isinstance(texts, str)
                    text_list = [texts] if is_single else list(texts)

                    # Batch requests in chunks of 50 to avoid payload and rate limit errors
                    batch_size = 50
                    all_embeddings = []

                    for i in range(0, len(text_list), batch_size):
                        batch = text_list[i : i + batch_size]
                        retries = 8
                        delay = 30.0

                        while retries > 0:
                            try:
                                task_type = "retrieval_query" if is_single else "retrieval_document"
                                res = genai.embed_content(
                                    model=self.model_name,
                                    content=batch,
                                    task_type=task_type,
                                )
                                embs = res["embedding"]
                                if isinstance(embs[0], list):
                                    all_embeddings.extend(embs)
                                else:
                                    all_embeddings.append(embs)
                                break
                            except Exception as e:
                                err_msg = str(e)
                                if "429" in err_msg or "ResourceExhausted" in err_msg or "quota" in err_msg.lower() or "limit" in err_msg.lower():
                                    logger.warning(
                                        f"Rate limit hit embedding batch {i//batch_size}. Retrying in {delay:.1f}s... Error: {err_msg}"
                                    )
                                    py_time.sleep(delay)
                                    delay = max(delay * 1.5, 30.0)
                                    retries -= 1
                                else:
                                    logger.error(f"Error embedding batch: {e}")
                                    raise e
                        else:
                            raise RuntimeError("Exceeded maximum retries for embedding due to rate limits.")

                    if is_single:
                        result_val = all_embeddings[0]
                    else:
                        result_val = all_embeddings

                    if convert_to_numpy:
                        return np.array(result_val)
                    return result_val

            EmbeddingGenerator._shared_model = GeminiEmbeddingWrapper(model_name)
            self.model = EmbeddingGenerator._shared_model
            self.initialized = True

            elapsed = time.perf_counter() - start_time
            logger.info(f"[{elapsed:.1f}s] Gemini EmbeddingGenerator Loaded")

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