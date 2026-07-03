import hashlib
from typing import Dict, List

import chromadb
from chromadb.config import Settings


class ChromaDBManager:

    def __init__(
        self,
        persist_directory="app/chroma_db",
        collection_name="recruitiq",
    ):

        self.client = chromadb.PersistentClient(
            path=persist_directory,
            settings=Settings(
                anonymized_telemetry=False,
            ),
        )

        self.collection = self.client.get_or_create_collection(
            collection_name
        )

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