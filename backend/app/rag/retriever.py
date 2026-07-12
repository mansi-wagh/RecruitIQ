from typing import List, Dict

from app.rag.embeddings import EmbeddingGenerator
from app.rag.chroma_db import ChromaDBManager


class DocumentRetriever:
    """
    Retrieves the most relevant document chunks
    from ChromaDB.
    """

    def __init__(self):

        self.embedder = EmbeddingGenerator()

        self.db = ChromaDBManager()

        try:
            if self.db.collection.count() == 0:
                from app.rag.loader import DocumentLoader
                from app.rag.chunker import DocumentChunker
                import os
                
                kb_path = "app/data/knowledge_base"
                if os.path.exists(kb_path):
                    loader = DocumentLoader(kb_path)
                    docs = loader.load_documents()
                    if docs:
                        chunker = DocumentChunker()
                        chunks = chunker.split_documents(docs)
                        if chunks:
                            embedded = self.embedder.generate_embeddings(chunks)
                            self.db.add_documents(embedded)
        except Exception as e:
            print(f"RAG bootstrap indexing error: {e}")

    def retrieve(
        self,
        query: str,
        top_k: int = 5,
    ) -> List[Dict]:

        query_embedding = self.embedder.model.encode(
            query,
            convert_to_numpy=True,
        ).tolist()

        results = self.db.search(
            query_embedding=query_embedding,
            top_k=top_k,
        )

        retrieved = []

        documents = results.get(
            "documents",
            [[]]
        )[0]

        metadatas = results.get(
            "metadatas",
            [[]]
        )[0]

        distances = results.get(
            "distances",
            [[]]
        )[0]

        for document, metadata, distance in zip(
            documents,
            metadatas,
            distances,
        ):

            retrieved.append(
                {
                    "document": document,
                    "source": metadata.get(
                        "source",
                        "Unknown",
                    ),
                    "category": metadata.get(
                        "category",
                        "Unknown",
                    ),
                    "distance": round(
                        distance,
                        4,
                    ),
                }
            )

        return retrieved