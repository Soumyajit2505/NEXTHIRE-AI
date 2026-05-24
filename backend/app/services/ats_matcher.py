from typing import Dict, List, Optional

from app.services.skill_extractor import normalize_skill, normalize_skills


def calculate_skill_score(
    matched_count: int,
    total_count: int,
    weight: float
) -> float:
    """
    Calculates weighted score for a skill category.

    Example:
    matched_count = 2
    total_count = 3
    weight = 60

    Score = (2 / 3) * 60 = 40
    """

    if total_count == 0:
        return 0.0

    return round((matched_count / total_count) * weight, 2)


def find_matched_skills(
    candidate_skills: List[str],
    required_skills: List[str]
) -> List[str]:
    """
    Finds skills that are present in both candidate profile and job requirement.
    Matching is case-insensitive and space-normalized.
    """

    normalized_candidate_skills = normalize_skills(candidate_skills)

    matched_skills = []

    for skill in required_skills:
        normalized_skill = normalize_skill(skill)

        if normalized_skill in normalized_candidate_skills:
            matched_skills.append(skill)

    return matched_skills


def find_missing_skills(
    candidate_skills: List[str],
    required_skills: List[str]
) -> List[str]:
    """
    Finds job-required skills missing from candidate profile.
    """

    normalized_candidate_skills = normalize_skills(candidate_skills)

    missing_skills = []

    for skill in required_skills:
        normalized_skill = normalize_skill(skill)

        if normalized_skill not in normalized_candidate_skills:
            missing_skills.append(skill)

    return missing_skills


def get_match_level(score: float) -> str:
    """
    Converts ATS score into human-friendly match level.
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
    Generates recruiter-friendly recommendation based on ATS score.
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
    Calculates final ATS score using weighted scoring.

    Final Formula:
    Must-have Skills       = 60%
    Preferred Skills       = 20%
    Experience Relevance   = 10%
    Project Relevance      = 10%

    Current Phase 4:
    Experience and project relevance are estimated simply:
    - If experience text exists, give 10 marks
    - If project text exists, give 10 marks

    Future Upgrade:
    Use embeddings or AI similarity for deeper relevance checking.
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

    match_level = get_match_level(final_score)

    recommendation = generate_recommendation(
        score=final_score,
        missing_skills=missing_skills
    )

    return {
        "ats_score": final_score,
        "match_level": match_level,
        "matched_skills": matched_skills,
        "missing_skills": missing_skills,
        "recommendation": recommendation,
        "breakdown": {
            "must_have_score": must_have_score,
            "preferred_score": preferred_score,
            "experience_score": experience_score,
            "project_score": project_score
        }
    }