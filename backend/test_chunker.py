from app.rag.loader import DocumentLoader
from app.rag.chunker import DocumentChunker

loader = DocumentLoader(
    "app/data/knowledge_base"
)

documents = loader.load_documents()

chunker = DocumentChunker()

chunks = chunker.split_documents(
    documents
)

print("=" * 50)
print("Documents :", len(documents))
print("Chunks    :", len(chunks))
print("=" * 50)

for i, chunk in enumerate(chunks):

    print(f"\nChunk {i+1}\n")

    print(chunk)

    print("-" * 50)