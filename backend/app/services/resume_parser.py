import logging

import fitz
import docx

logger = logging.getLogger(__name__)


def parse_resume(file_path: str) -> str:
    """Parse a PDF or DOCX resume file and return its text content."""
    try:
        if file_path.lower().endswith(".docx"):
            return _parse_docx(file_path)
        return _parse_pdf(file_path)
    except ValueError:
        raise
    except Exception as e:
        logger.error("Failed to parse resume '%s': %s", file_path, e, exc_info=True)
        raise ValueError(f"Failed to parse resume: {e}") from e


def _parse_docx(file_path: str) -> str:
    try:
        doc = docx.Document(file_path)
    except Exception as e:
        raise ValueError(f"Cannot open DOCX file: {e}") from e

    text = []
    for para in doc.paragraphs:
        if para.text.strip():
            text.append(para.text.strip())
    for table in doc.tables:
        for row in table.rows:
            for cell in row.cells:
                if cell.text.strip():
                    text.append(cell.text.strip())
    return "\n".join(text)


def _parse_pdf(file_path: str) -> str:
    try:
        document = fitz.open(file_path)
    except Exception as e:
        raise ValueError(f"Cannot open PDF file: {e}") from e

    try:
        text = ""
        for page in document:
            text += page.get_text()
        return text
    finally:
        document.close()