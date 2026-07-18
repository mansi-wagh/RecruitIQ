import os
import sys
from pathlib import Path

# Add project root to sys.path
backend_dir = Path(__file__).resolve().parents[2]
sys.path.insert(0, str(backend_dir))

from app.logger import logger
from app.rag.embeddings import EmbeddingGenerator
from app.rag.qdrant_db import QdrantDBManager
from app.rag.loader import DocumentLoader
from app.rag.chunker import DocumentChunker

def run_indexing():
    logger.info("Starting offline RAG knowledge base indexing...")
    
    # Instantiate components
    embedder = EmbeddingGenerator()
    db = QdrantDBManager()
    
    # Path configuration
    kb_path = os.path.join(backend_dir, "app", "data", "knowledge_base")
    
    if not os.path.exists(kb_path):
        logger.error("Knowledge base path not found: %s", kb_path)
        sys.exit(1)
        
    logger.info("Loading documents from: %s", kb_path)
    loader = DocumentLoader(kb_path)
    docs = loader.load_documents()
    
    if not docs:
        logger.warning("No documents found in knowledge base.")
        return
        
    logger.info("Splitting %d documents into chunks...", len(docs))
    chunker = DocumentChunker()
    chunks = chunker.split_documents(docs)
    
    if not chunks:
        logger.warning("No chunks created from documents.")
        return
        
    logger.info("Generating embeddings for %d chunks...", len(chunks))
    embedded_chunks = embedder.generate_embeddings(chunks)
    
    logger.info("Writing %d embedded chunks to vector database...", len(embedded_chunks))
    db.add_documents(embedded_chunks)
    
    logger.info("RAG knowledge base indexing completed successfully! Total points in collection: %d", db.count())

if __name__ == "__main__":
    run_indexing()
