"""
Skill Alias Mapping System

Purpose:
Improves ATS matching accuracy by handling:

- Short forms
- Abbreviations
- Alternate naming styles
- Recruiter naming variations

IMPORTANT:
This is NOT a fixed skill list.

If a skill is not present in this dictionary,
the system will still work normally.

Example:
"AutoCAD" -> remains "autocad"
"SAP" -> remains "sap"

So the ATS still supports ANY domain and ANY skill.
"""


# Dictionary containing known skill aliases
# Key   = alternate skill name
# Value = standardized skill name
SKILL_ALIASES = {

    # =========================
    # AI / Data Science
    # =========================

    "ml": "machine learning",
    "machine learning": "machine learning",

    "dl": "deep learning",
    "deep learning": "deep learning",

    "nlp": "natural language processing",
    "natural language processing": "natural language processing",

    "cv": "computer vision",
    "computer vision": "computer vision",

    "gen ai": "generative ai",
    "generative ai": "generative ai",

    "llm": "large language models",
    "large language models": "large language models",

    "ai": "artificial intelligence",
    "artificial intelligence": "artificial intelligence",

    # =========================
    # Programming
    # =========================

    "py": "python",
    "python": "python",

    "js": "javascript",
    "javascript": "javascript",

    "ts": "typescript",
    "typescript": "typescript",

    "cpp": "c++",
    "c plus plus": "c++",
    "c++": "c++",

    # =========================
    # Analytics / BI
    # =========================

    "powerbi": "power bi",
    "power bi": "power bi",

    "ms excel": "excel",
    "microsoft excel": "excel",
    "excel": "excel",

    "sql": "sql",

    # =========================
    # Cloud / DevOps
    # =========================

    "aws": "amazon web services",
    "amazon web services": "amazon web services",

    "gcp": "google cloud platform",
    "google cloud platform": "google cloud platform",

    "azure": "microsoft azure",
    "microsoft azure": "microsoft azure",

    # =========================
    # HR / Business
    # =========================

    "hr": "human resources",
    "human resources": "human resources",

    "seo": "search engine optimization",
    "search engine optimization": "search engine optimization",

    # =========================
    # UI/UX
    # =========================

    "ui ux": "ui/ux design",
    "ui/ux": "ui/ux design",
    "ui ux design": "ui/ux design",

    # =========================
    # ERP / Finance
    # =========================

    "tally erp": "tally",
    "tally prime": "tally",
    "tally": "tally"
}


def normalize_with_alias(skill: str) -> str:
    """
    Standardizes a skill using alias mapping.

    Example:
    "ML" -> "machine learning"
    "PowerBI" -> "power bi"

    If skill is unknown:
    "AutoCAD" -> "autocad"

    So unknown skills are NOT rejected.
    """

    # Normalize text
    normalized_skill = skill.lower().strip()

    # Return alias if available
    # Otherwise return original normalized skill
    return SKILL_ALIASES.get(
        normalized_skill,
        normalized_skill
    )