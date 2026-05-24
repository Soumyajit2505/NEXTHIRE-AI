from typing import Dict, List, Optional

from app.services.skill_extractor import normalize_skill
from app.services.skill_aliases import normalize_with_alias


def calculate_skill_score(
    matched_count: int,
    total_count: int,
    weight: float
) -> float:
    """
    Calculates weighted score for a skill category.
    """

    if total_count == 0:
        return 0.0

    return round((matched_count / total_count) * weight, 2)


def normalize_for_matching(skill: str) -> str:
    """
    Normalizes skill for accurate matching.
    """

    cleaned_skill = normalize_skill(skill)
    return normalize_with_alias(cleaned_skill)


def normalize_skill_list(skills: List[str]) -> List[str]:
    """
    Normalizes a list of skills.
    """

    normalized_skills = []

    for skill in skills:
        if skill and skill.strip():
            normalized_skills.append(normalize_for_matching(skill))

    return normalized_skills


def is_skill_match(required_skill: str, candidate_skill: str) -> bool:
    """
    Checks exact and safe partial skill match.

    Examples:
    required: python
    candidate: python programming
    result: matched

    required: recruitment
    candidate: recruitment management
    result: matched
    """

    required = normalize_for_matching(required_skill)
    candidate = normalize_for_matching(candidate_skill)

    if required == candidate:
        return True

    if required in candidate:
        return True

    if candidate in required:
        return True

    return False


def find_matched_skills(
    candidate_skills: List[str],
    required_skills: List[str]
) -> List[str]:
    """
    Finds matched skills between candidate and job.
    """

    matched_skills = []

    for required_skill in required_skills:
        for candidate_skill in candidate_skills:
            if is_skill_match(required_skill, candidate_skill):
                matched_skills.append(required_skill)
                break

    return matched_skills


def find_missing_skills(
    candidate_skills: List[str],
    required_skills: List[str]
) -> List[str]:
    """
    Finds required skills missing from candidate profile.
    """

    missing_skills = []

    for required_skill in required_skills:
        matched = False

        for candidate_skill in candidate_skills:
            if is_skill_match(required_skill, candidate_skill):
                matched = True
                break

        if not matched:
            missing_skills.append(required_skill)

    return missing_skills


def get_match_level(score: float) -> str:
    """
    Converts ATS score into match level.
    """

    if score >= 85:
        return "Excellent Match"

    if score >= 75:
        return "Strong Match"

    if score >= 65:
        return "Good Match"

    if score >= 50:
        return "Average Match"

    return "Low Match"


def generate_recommendation(
    score: float,
    missing_skills: List[str]
) -> str:
    """
    Generates recommendation based on score.
    """

    if score >= 85:
        return "Candidate is an excellent fit for this role."

    if score >= 75:
        return "Candidate is a strong fit with minor improvement areas."

    if score >= 65:
        return "Candidate is a good fit but should improve some missing skills."

    if score >= 50:
        return "Candidate has partial fit and needs improvement in key skills."

    if missing_skills:
        return "Candidate is currently a low match and should improve important required skills."

    return "Candidate profile needs more relevant information for better matching."


def calculate_ats_score(
    candidate_skills: List[str],
    must_have_skills: List[str],
    preferred_skills: List[str],
    experience_text: Optional[str] = None,
    projects_text: Optional[str] = None
) -> Dict:
    """
    Calculates final ATS score.

    Formula:
    Must-have Skills       = 60%
    Preferred Skills       = 20%
    Experience Relevance   = 10%
    Project Relevance      = 10%
    """

    matched_must_have = find_matched_skills(
        candidate_skills,
        must_have_skills
    )

    missing_must_have = find_missing_skills(
        candidate_skills,
        must_have_skills
    )

    must_have_score = calculate_skill_score(
        matched_count=len(matched_must_have),
        total_count=len(must_have_skills),
        weight=60
    )

    matched_preferred = find_matched_skills(
        candidate_skills,
        preferred_skills
    )

    missing_preferred = find_missing_skills(
        candidate_skills,
        preferred_skills
    )

    preferred_score = calculate_skill_score(
        matched_count=len(matched_preferred),
        total_count=len(preferred_skills),
        weight=20
    )

    experience_score = 10 if experience_text and experience_text.strip() else 0
    project_score = 10 if projects_text and projects_text.strip() else 0

    final_score = round(
        must_have_score
        + preferred_score
        + experience_score
        + project_score,
        2
    )

    matched_skills = matched_must_have + matched_preferred
    missing_skills = missing_must_have + missing_preferred

    return {
        "ats_score": final_score,
        "match_level": get_match_level(final_score),
        "matched_skills": matched_skills,
        "missing_skills": missing_skills,
        "recommendation": generate_recommendation(
            final_score,
            missing_skills
        ),
        "breakdown": {
            "must_have_score": must_have_score,
            "preferred_score": preferred_score,
            "experience_score": experience_score,
            "project_score": project_score
        }
    }