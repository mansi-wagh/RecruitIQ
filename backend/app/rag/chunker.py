from typing import Dict, List

from langchain_text_splitters import RecursiveCharacterTextSplitter


class DocumentChunker:

    def __init__(
        self,
        chunk_size: int = 500,
        chunk_overlap: int = 100,
    ):

        self.splitter = RecursiveCharacterTextSplitter(
            chunk_size=chunk_size,
            chunk_overlap=chunk_overlap,
        )

    def split_documents(
        self,
        documents: List[Dict],
    ) -> List[Dict]:

        chunks = []

        for document in documents:

            split_text = self.splitter.split_text(
                document["text"]
            )

            for chunk in split_text:

                chunks.append(
                    {
                        "text": chunk,
                        "source": document["source"],
                        "category": document["category"],
                    }
                )

        return chunks