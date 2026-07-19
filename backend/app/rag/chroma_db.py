import hashlib
from pathlib import Path
from typing import Dict, List
import threading

import chromadb
from chromadb.config import Settings

# Compute absolute path to app/chroma_db regardless of CWD
BASE_DIR = Path(__file__).resolve().parent.parent
DEFAULT_CHROMA_DIR = str(BASE_DIR / "chroma_db")


class ChromaDBManager:
    _instance = None
    _init_lock = threading.Lock()

    def __new__(cls, *args, **kwargs):
        if cls._instance is None:
            cls._instance = super(ChromaDBManager, cls).__new__(cls)
        return cls._instance

    def __init__(
        self,
        persist_directory=None,
        collection_name="recruitiq_gemini",
    ):
        with self._init_lock:
            if hasattr(self, "initialized"):
                return
            if persist_directory is None:
                persist_directory = DEFAULT_CHROMA_DIR
            else:
                persist_directory = str(Path(persist_directory).resolve())
            import time
            from app.logger import logger
            start_time = time.perf_counter()

            self.client = chromadb.PersistentClient(
                path=persist_directory,
                settings=Settings(
                    anonymized_telemetry=False,
                ),
            )

            self.collection = self.client.get_or_create_collection(
                collection_name
            )
            self.initialized = True

            elapsed = time.perf_counter() - start_time
            logger.info(f"[{elapsed:.1f}s] Chroma Connected")

    def add_documents(
        self,
        embedded_chunks: List[Dict],
    ):

        ids = []

        documents = []

        embeddings = []

        metadatas = []

        for chunk in embedded_chunks:

            ids.append(
                hashlib.md5(
                    chunk["text"].encode()
                ).hexdigest()
            )

            documents.append(
                chunk["text"]
            )

            embeddings.append(
                chunk["embedding"]
            )

            metadatas.append(
                {
                    "source": chunk["source"],
                    "category": chunk["category"],
                }
            )

        existing = set(
            self.collection.get()["ids"]
        )

        new_ids = []
        new_docs = []
        new_embeddings = []
        new_metadata = []

        for i in range(len(ids)):

            if ids[i] not in existing:

                new_ids.append(ids[i])

                new_docs.append(documents[i])

                new_embeddings.append(
                    embeddings[i]
                )

                new_metadata.append(
                    metadatas[i]
                )

        if new_ids:

            self.collection.add(
                ids=new_ids,
                documents=new_docs,
                embeddings=new_embeddings,
                metadatas=new_metadata,
            )

    def search(
        self,
        query_embedding,
        top_k=5,
    ):

        return self.collection.query(
            query_embeddings=[query_embedding],
            n_results=top_k,
        )