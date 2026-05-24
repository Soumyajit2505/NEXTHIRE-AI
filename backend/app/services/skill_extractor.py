import re
from typing import List, Optional


def clean_skill(skill: str) -> str:
    """
    Cleans a single skill value.

    Example:
    " Python " -> "Python"
    """

    return skill.strip()


def split_skills(skills_text: Optional[str]) -> List[str]:
    """
    Converts comma-separated skills into a clean list.

    Example:
    "Python, SQL, Machine Learning"
    ->
    ["Python", "SQL", "Machine Learning"]

    This works for all domains because skills are not hardcoded.
    """

    if not skills_text:
        return []

    # Split skills using comma
    raw_skills = skills_text.split(",")

    cleaned_skills = []

    for skill in raw_skills:
        cleaned = clean_skill(skill)

        # Avoid empty values
        if cleaned:
            cleaned_skills.append(cleaned)

    return cleaned_skills


def normalize_skill(skill: str) -> str:
    """
    Normalizes one skill for accurate comparison.

    Example:
    " Machine   Learning " -> "machine learning"
    "PYTHON" -> "python"

    This helps avoid mismatch due to case or extra spaces.
    """

    skill = skill.lower().strip()

    # Replace multiple spaces with a single space
    skill = re.sub(r"\s+", " ", skill)

    return skill


def normalize_skills(skills: List[str]) -> List[str]:
    """
    Normalizes a list of skills for matching.
    """

    normalized = []

    for skill in skills:
        if skill and skill.strip():
            normalized.append(normalize_skill(skill))

    return normalized


def extract_job_skills(
    must_have_skills: str,
    preferred_skills: Optional[str] = None
) -> dict:
    """
    Extracts must-have and preferred skills from job data.

    Phase 4 approach:
    Recruiter manually enters must-have and preferred skills.

    Why this is accurate:
    - No hardcoded skill list
    - Works for technical and non-technical domains
    - Recruiter has control over required skills

    Future upgrade:
    AI will auto-extract these skills from full job description.
    """

    must_have = split_skills(must_have_skills)
    preferred = split_skills(preferred_skills)

    return {
        "must_have": must_have,
        "preferred": preferred
    }


def extract_candidate_skills(candidate_skills: Optional[str]) -> List[str]:
    """
    Extracts candidate skills from stored candidate profile.

    Candidate skills usually come from Phase 3 extraction.
    They are stored as comma-separated text in the database.
    """

    return split_skills(candidate_skills)