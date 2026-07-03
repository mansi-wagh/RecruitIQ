from app.rag.loader import DocumentLoader
from app.rag.chunker import DocumentChunker
from app.rag.embeddings import EmbeddingGenerator
from app.rag.chroma_db import ChromaDBManager

loader = DocumentLoader(
    "app/data/knowledge_base"
)

documents = loader.load_documents()

chunker = DocumentChunker()

chunks = chunker.split_documents(
    documents
)

embedder = EmbeddingGenerator()

embedded_chunks = embedder.generate_embeddings(
    chunks
)

db = ChromaDBManager()

db.add_documents(
    embedded_chunks
)

query_embedding = embedder.model.encode(
    "Python backend hiring policy",
    convert_to_numpy=True,
).tolist()

results = db.search(
    query_embedding=query_embedding,
)

print(results)