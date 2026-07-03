from app.rag.loader import DocumentLoader
from app.rag.chunker import DocumentChunker
from app.rag.embeddings import EmbeddingGenerator

loader = DocumentLoader(
    "app/data/knowledge_base"
)

documents = loader.load_documents()

chunker = DocumentChunker()

chunks = chunker.split_documents(
    documents
)

embedder = EmbeddingGenerator()

embeddings = embedder.generate_embeddings(
    chunks
)

print("=" * 60)
print("Documents :", len(documents))
print("Chunks    :", len(chunks))
print("Vectors   :", len(embeddings))
print("=" * 60)

print("\nEmbedding Dimension:")

print(len(embeddings[0]))

print("\nFirst 10 Values:")

print(embeddings[0][:10])