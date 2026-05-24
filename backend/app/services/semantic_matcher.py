from typing import Optional

from sentence_transformers import SentenceTransformer
from sklearn.metrics.pairwise import cosine_similarity


# Free, lightweight semantic embedding model.
# It downloads automatically first time and then runs locally.
MODEL_NAME = "all-MiniLM-L6-v2"


# Load model once when this service is imported.
# This avoids loading the model again and again for every API request.
model = SentenceTransformer(MODEL_NAME)


def clean_text(text: Optional[str]) -> str:
    """
    Clean text before embedding generation.
    """

    if not text:
        return ""

    return " ".join(text.strip().split())


def build_candidate_text(
    skills: Optional[str],
    experience: Optional[str],
    projects: Optional[str],
    education: Optional[str],
    certifications: Optional[str]
) -> str:
    """
    Combine candidate profile fields into one meaningful text block.
    """

    parts = [
        skills,
        experience,
        projects,
        education,
        certifications
    ]

    cleaned_parts = []

    for part in parts:
        cleaned = clean_text(part)

        if cleaned:
            cleaned_parts.append(cleaned)

    return " ".join(cleaned_parts)


def build_job_text(
    title: str,
    description: str,
    must_have_skills: str,
    preferred_skills: Optional[str],
    domain: Optional[str]
) -> str:
    """
    Combine job information into one meaningful text block.
    """

    parts = [
        title,
        description,
        must_have_skills,
        preferred_skills,
        domain
    ]

    cleaned_parts = []

    for part in parts:
        cleaned = clean_text(part)

        if cleaned:
            cleaned_parts.append(cleaned)

    return " ".join(cleaned_parts)


def calculate_semantic_score(
    candidate_text: str,
    job_text: str
) -> float:
    """
    Calculate semantic similarity between candidate profile and job description.

    Output range:
    0 to 100
    """

    if not candidate_text or not job_text:
        return 0.0

    embeddings = model.encode(
        [candidate_text, job_text],
        convert_to_numpy=True
    )

    similarity = cosine_similarity(
        [embeddings[0]],
        [embeddings[1]]
    )[0][0]

    return round(float(similarity) * 100, 2)


def get_semantic_match_level(score: float) -> str:
    """
    Convert semantic score into human-readable level.
    """

    if score >= 85:
        return "Excellent Semantic Match"

    if score >= 75:
        return "Strong Semantic Match"

    if score >= 65:
        return "Good Semantic Match"

    if score >= 50:
        return "Average Semantic Match"

    return "Low Semantic Match"


def generate_semantic_message(score: float) -> str:
    """
    Generate explanation message for semantic matching.
    """

    if score >= 85:
        return "Candidate profile is highly aligned with the job description."

    if score >= 75:
        return "Candidate profile is strongly aligned with the job description."

    if score >= 65:
        return "Candidate profile is reasonably aligned with the job description."

    if score >= 50:
        return "Candidate profile has partial semantic alignment with the job description."

    return "Candidate profile has low semantic alignment with the job description."


def generate_semantic_result(candidate, job) -> dict:
    """
    Main semantic matching function.

    Input:
    - Candidate database object
    - Job database object

    Output:
    - semantic_score
    - semantic_match_level
    - message
    """

    candidate_text = build_candidate_text(
        skills=candidate.skills,
        experience=candidate.experience,
        projects=candidate.projects,
        education=candidate.education,
        certifications=candidate.certifications
    )

    job_text = build_job_text(
        title=job.title,
        description=job.description,
        must_have_skills=job.must_have_skills,
        preferred_skills=job.preferred_skills,
        domain=job.domain
    )

    semantic_score = calculate_semantic_score(
        candidate_text=candidate_text,
        job_text=job_text
    )

    return {
        "semantic_score": semantic_score,
        "semantic_match_level": get_semantic_match_level(semantic_score),
        "message": generate_semantic_message(semantic_score)
    }