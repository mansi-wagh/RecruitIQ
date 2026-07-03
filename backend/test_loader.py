from app.rag.loader import DocumentLoader

loader = DocumentLoader(
    "app/data/knowledge_base"
)

documents = loader.load_documents()

print(len(documents))

for document in documents:
    print(document[:100])