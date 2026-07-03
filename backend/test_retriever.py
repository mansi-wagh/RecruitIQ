from app.rag.retriever import DocumentRetriever

retriever = DocumentRetriever()

results = retriever.retrieve(
    "Python backend hiring policy"
)

print("=" * 60)

print("Retrieved Documents")

print("=" * 60)

for i, result in enumerate(results, start=1):

    print(f"\nResult {i}")

    print("-" * 40)

    print("Source    :", result["source"])

    print("Category  :", result["category"])

    print("Distance  :", result["distance"])

    print()

    print(result["document"])