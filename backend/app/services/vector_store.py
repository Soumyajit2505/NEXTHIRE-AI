import json
import os
from typing import Dict, List

import faiss
import numpy as np

from app.models import Candidate
from app.services.semantic_matcher import model


# Folder where FAISS index and metadata will be stored
VECTOR_STORE_DIR = "vector_store"

# FAISS index file path
INDEX_FILE = os.path.join(VECTOR_STORE_DIR, "candidate_index.faiss")

# Candidate metadata file path
METADATA_FILE = os.path.join(VECTOR_STORE_DIR, "candidate_metadata.json")


def ensure_vector_store_dir() -> None:
    """
    Creates vector_store folder if it does not exist.
    """

    os.makedirs(VECTOR_STORE_DIR, exist_ok=True)


def clean_text(text: str | None) -> str:
    """
    Cleans text before embedding generation.
    """

    if not text:
        return ""

    return " ".join(text.strip().split())


def build_candidate_text(candidate: Candidate) -> str:
    """
    Combines important candidate fields into one text block.

    This text is converted into embedding and stored in FAISS.
    """

    parts = [
        candidate.full_name,
        candidate.skills,
        candidate.education,
        candidate.experience,
        candidate.projects,
        candidate.certifications
    ]

    cleaned_parts = []

    for part in parts:
        cleaned = clean_text(part)

        if cleaned:
            cleaned_parts.append(cleaned)

    return " ".join(cleaned_parts)


def get_embedding(text: str) -> np.ndarray:
    """
    Converts text into embedding vector using Sentence Transformer model.
    """

    embedding = model.encode(
        text,
        convert_to_numpy=True
    )

    return embedding.astype("float32")


def build_candidate_index(candidates: List[Candidate]) -> Dict:
    """
    Builds FAISS index from candidate profiles.

    Steps:
    1. Convert candidate profile into text
    2. Generate embeddings
    3. Store embeddings in FAISS index
    4. Save candidate metadata separately
    """

    ensure_vector_store_dir()

    embeddings = []
    metadata = []

    for candidate in candidates:
        candidate_text = build_candidate_text(candidate)

        # Skip candidates with no useful text
        if not candidate_text:
            continue

        embedding = get_embedding(candidate_text)

        embeddings.append(embedding)

        metadata.append({
            "candidate_id": candidate.id,
            "full_name": candidate.full_name,
            "email": candidate.email,
            "skills": candidate.skills,
            "experience": candidate.experience,
            "projects": candidate.projects
        })

    if not embeddings:
        return {
            "message": "No valid candidate data found for indexing.",
            "total_indexed": 0
        }

    embedding_matrix = np.vstack(embeddings).astype("float32")

    # Normalize vectors for cosine similarity using inner product
    faiss.normalize_L2(embedding_matrix)

    dimension = embedding_matrix.shape[1]

    # IndexFlatIP gives cosine similarity after L2 normalization
    index = faiss.IndexFlatIP(dimension)

    index.add(embedding_matrix)

    faiss.write_index(index, INDEX_FILE)

    with open(METADATA_FILE, "w", encoding="utf-8") as file:
        json.dump(metadata, file, indent=4)

    return {
        "message": "Candidate FAISS index built successfully.",
        "total_indexed": len(metadata)
    }


def load_candidate_index():
    """
    Loads FAISS index and candidate metadata from disk.
    """

    if not os.path.exists(INDEX_FILE) or not os.path.exists(METADATA_FILE):
        return None, []

    index = faiss.read_index(INDEX_FILE)

    with open(METADATA_FILE, "r", encoding="utf-8") as file:
        metadata = json.load(file)

    return index, metadata


def search_candidates(
    query: str,
    top_k: int = 5
) -> Dict:
    """
    Searches candidates semantically using FAISS.

    Example query:
    "Python developer with machine learning projects"
    """

    index, metadata = load_candidate_index()

    if index is None or not metadata:
        return {
            "message": "Candidate index not found. Please rebuild index first.",
            "results": []
        }

    query_embedding = get_embedding(query).reshape(1, -1).astype("float32")

    # Normalize query vector for cosine similarity
    faiss.normalize_L2(query_embedding)

    top_k = min(top_k, len(metadata))

    scores, indices = index.search(query_embedding, top_k)

    results = []

    for score, idx in zip(scores[0], indices[0]):
        if idx == -1:
            continue

        candidate_data = metadata[idx]

        results.append({
            "candidate_id": candidate_data["candidate_id"],
            "full_name": candidate_data["full_name"],
            "email": candidate_data["email"],
            "skills": candidate_data["skills"],
            "experience": candidate_data["experience"],
            "projects": candidate_data["projects"],
            "semantic_score": round(float(score) * 100, 2)
        })

    return {
        "query": query,
        "top_k": top_k,
        "results": results
    }