import re


SKILLS_LIST = [
    "Python", "Java", "C", "C++", "SQL", "MySQL", "PostgreSQL", "MongoDB",
    "FastAPI", "Flask", "Django", "HTML", "CSS", "JavaScript", "React",
    "Node.js", "Git", "GitHub", "Machine Learning", "Deep Learning", "NLP",
    "Data Analysis", "Data Analytics", "Pandas", "NumPy", "Scikit-learn",
    "TensorFlow", "Keras", "Power BI", "Excel", "MS Excel", "Streamlit",
    "LangChain", "LangGraph", "RAG", "Recruitment", "Human Resources", "HR",
    "Communication", "Leadership", "Team Management", "Sales", "Marketing",
    "SEO", "Content Marketing", "Social Media Marketing", "Negotiation",
    "CRM", "Accounting", "Tally", "GST", "Taxation", "Financial Analysis",
    "Auditing", "Banking", "AutoCAD", "SolidWorks", "CATIA", "MATLAB",
    "Site Management", "Quality Control", "Canva", "Figma", "UI/UX",
    "Employee Engagement", "Payroll", "Onboarding", "Screening",
    "Interviewing", "MS Office", "Jupyter", "VS Code", "Data Mining",
    "Logistic Regression", "TF-IDF", "Model Evaluation", "NLTK", "Joblib",
    "Data Cleaning", "Data Preprocessing", "Data Visualization",
    "Exploratory Data Analysis", "Statistical Analysis", "OpenCV", "Pillow"
]


SECTION_PATTERNS = {
    "education": [
        "education", "academic qualification", "qualification",
        "academics", "academic details"
    ],
    "experience": [
        "experience", "work experience", "professional experience",
        "internship", "employment", "career history"
    ],
    "projects": [
        "projects", "academic projects", "personal projects",
        "project work", "key projects"
    ],
    "certifications": [
        "certifications", "certificates", "courses", "training"
    ]
}


ALL_SECTION_HEADERS = [
    "summary", "objective", "profile", "about me", "skills",
    "technical skills", "core skills", "education", "academic qualification",
    "qualification", "experience", "work experience", "professional experience",
    "internship", "employment", "projects", "academic projects",
    "personal projects", "certifications", "certificates", "achievements",
    "awards", "languages", "hobbies", "interests", "contact"
]


def clean_text(text: str) -> str:
    if not text:
        return ""

    text = text.replace("\r", "\n")
    text = re.sub(r"[ \t]+", " ", text)
    text = re.sub(r"\n{2,}", "\n", text)

    return text.strip()


def get_lines(text: str):
    text = clean_text(text)

    return [
        line.strip()
        for line in text.split("\n")
        if line.strip()
    ]


def extract_email(text: str):
    match = re.search(
        r"[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+",
        text
    )

    return match.group(0) if match else None


def extract_phone(text: str):
    match = re.search(
        r"(\+91[\s-]?)?[6-9]\d{9}",
        text
    )

    return match.group(0) if match else None


def extract_links(text: str):
    linkedin_url = None
    github_url = None

    patterns = [
        r"https?://[^\s,|]+",
        r"www\.[^\s,|]+",
        r"linkedin\.com/[^\s,|]+",
        r"github\.com/[^\s,|]+"
    ]

    links = []

    for pattern in patterns:
        links.extend(re.findall(pattern, text, re.IGNORECASE))

    for link in links:
        clean_link = link.strip().rstrip(".,)")

        if clean_link.lower().startswith("www."):
            clean_link = "https://" + clean_link

        if clean_link.lower().startswith("linkedin.com"):
            clean_link = "https://" + clean_link

        if clean_link.lower().startswith("github.com"):
            clean_link = "https://" + clean_link

        lower_link = clean_link.lower()

        if "linkedin.com" in lower_link:
            linkedin_url = clean_link

        if "github.com" in lower_link:
            github_url = clean_link

    return linkedin_url, github_url


def is_bad_name_line(line: str) -> bool:
    lower_line = line.lower()

    bad_words = [
        "resume", "cv", "curriculum vitae", "email", "phone", "mobile",
        "linkedin", "github", "portfolio", "address", "skills", "education",
        "experience", "projects", "certification", "b.tech", "cgpa",
        "developer", "engineer", "scientist", "analyst", "intern",
        "summary", "objective", "profile"
    ]

    if any(word in lower_line for word in bad_words):
        return True

    if "@" in line or "http" in lower_line or "www." in lower_line:
        return True

    if any(char.isdigit() for char in line):
        return True

    return False


def extract_name(text: str):
    lines = get_lines(text)

    # Best case: name is usually first clean line
    for line in lines[:10]:
        clean_line = re.sub(r"[^A-Za-z. ]", " ", line)
        clean_line = re.sub(r"\s+", " ", clean_line).strip()

        if not clean_line:
            continue

        if is_bad_name_line(clean_line):
            continue

        words = clean_line.split()

        if 2 <= len(words) <= 4:
            return " ".join(words).title()

    # Backup: Name: Tia Patel
    match = re.search(
        r"(name\s*[:\-]\s*)([A-Z][a-zA-Z.]+(?:\s+[A-Z][a-zA-Z.]+){1,3})",
        text,
        re.IGNORECASE
    )

    if match:
        return match.group(2).strip().title()

    # Final fallback: email prefix only if it forms a real two-word name
    email = extract_email(text)

    if email:
        email_prefix = email.split("@")[0]
        email_prefix = re.sub(r"\d+", "", email_prefix)
        email_prefix = re.sub(r"[._\-]+", " ", email_prefix).strip()

        if " " not in email_prefix:
            return None

        words = [
            word.capitalize()
            for word in email_prefix.split()
            if len(word) > 1
        ]

        if len(words) >= 2:
            return " ".join(words)

    return None


def extract_skills(text: str):
    found_skills = []

    for skill in SKILLS_LIST:
        pattern = rf"\b{re.escape(skill)}\b"

        if re.search(pattern, text, re.IGNORECASE):
            found_skills.append(skill)

    return ", ".join(sorted(set(found_skills))) if found_skills else None


def normalize_header(line: str) -> str:
    return line.lower().strip().strip(":-|• ")


def is_section_header(line: str) -> bool:
    normalized = normalize_header(line)

    return normalized in ALL_SECTION_HEADERS


def extract_section_by_lines(text: str, start_keywords: list):
    lines = get_lines(text)

    collected = []
    collecting = False

    for line in lines:
        normalized_line = normalize_header(line)

        if any(keyword == normalized_line for keyword in start_keywords):
            collecting = True
            continue

        if collecting and is_section_header(line):
            break

        if collecting:
            collected.append(line)

    if collected:
        return " ".join(collected[:14])

    return None


def extract_section_by_regex(text: str, start_keywords: list):
    lower_text = text.lower()
    start_positions = []

    for keyword in start_keywords:
        match = re.search(rf"\b{re.escape(keyword)}\b", lower_text)

        if match:
            start_positions.append(match.end())

    if not start_positions:
        return None

    start = min(start_positions)
    end = len(text)

    for header in ALL_SECTION_HEADERS:
        match = re.search(rf"\b{re.escape(header)}\b", lower_text[start:])

        if match:
            candidate_end = start + match.start()

            if start < candidate_end < end:
                end = candidate_end

    section_text = text[start:end].strip(" :-|\n\t")

    if not section_text:
        return None

    words = section_text.split()

    return " ".join(words[:140])


def extract_section(text: str, section_name: str):
    start_keywords = SECTION_PATTERNS.get(section_name, [])

    section = extract_section_by_lines(text, start_keywords)

    if section:
        return section

    return extract_section_by_regex(text, start_keywords)


def extract_candidate_details(text: str):
    text = clean_text(text)

    linkedin_url, github_url = extract_links(text)

    return {
        "full_name": extract_name(text),
        "email": extract_email(text),
        "phone": extract_phone(text),
        "skills": extract_skills(text),
        "education": extract_section(text, "education"),
        "experience": extract_section(text, "experience"),
        "projects": extract_section(text, "projects"),
        "certifications": extract_section(text, "certifications"),
        "linkedin_url": linkedin_url,
        "github_url": github_url
    }