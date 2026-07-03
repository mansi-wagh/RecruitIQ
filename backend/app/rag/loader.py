from pathlib import Path
from typing import Dict, List


class DocumentLoader:
    """
    Loads documents from the RecruitIQ knowledge base.
    Returns both document text and metadata.
    """

    SUPPORTED_EXTENSIONS = {
        ".txt",
        ".md",
    }

    def __init__(self, knowledge_base_path: str):
        self.knowledge_base_path = Path(knowledge_base_path)

    def load_documents(self) -> List[Dict]:

        documents = []

        if not self.knowledge_base_path.exists():
            return documents

        for file_path in self.knowledge_base_path.rglob("*"):

            if (
                file_path.is_file()
                and file_path.suffix.lower()
                in self.SUPPORTED_EXTENSIONS
            ):

                with open(
                    file_path,
                    "r",
                    encoding="utf-8",
                ) as file:

                    documents.append(
                        {
                            "text": file.read(),
                            "source": file_path.name,
                            "category": file_path.parent.name,
                        }
                    )

        return documents