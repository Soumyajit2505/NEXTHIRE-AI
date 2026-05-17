import re

# Common technical skills we want to detect from resume text
SKILLS_LIST = [
    "Python", "Java", "C", "C++", "SQL", "MySQL", "PostgreSQL",
    "MongoDB", "FastAPI", "Flask", "Django",
    "HTML", "CSS", "JavaScript", "React", "Node.js",
    "Machine Learning", "Deep Learning", "NLP",
    "Data Analysis", "Pandas", "NumPy", "Scikit-learn",
    "TensorFlow", "Keras", "Power BI", "Excel",
    "Git", "GitHub", "Streamlit", "LangChain", "LangGraph", "RAG"
]


def extract_email(text: str):
    # Finds first valid email address from resume text
    match = re.search(
        r"[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+",
        text
    )
    return match.group(0) if match else None


def extract_phone(text: str):
    # Finds Indian phone number format
    match = re.search(r"(\+91[\s-]?)?[6-9]\d{9}", text)
    return match.group(0) if match else None


def extract_links(text: str):
    # Finds LinkedIn and GitHub URLs
    linkedin_url = None
    github_url = None

    links = re.findall(r"https?://[^\s]+|www\.[^\s]+", text)

    for link in links:
        link = link.strip().rstrip(".,)")

        if "linkedin.com" in link.lower():
            linkedin_url = link

        if "github.com" in link.lower():
            github_url = link

    return linkedin_url, github_url


def extract_name(text: str):
    # Candidate name is usually in the first few lines
    lines = [line.strip() for line in text.split("\n") if line.strip()]

    for line in lines[:6]:
        lower_line = line.lower()

        if "@" in line:
            continue
        if "linkedin" in lower_line or "github" in lower_line:
            continue
        if any(char.isdigit() for char in line):
            continue

        words = line.split()

        if 2 <= len(words) <= 4:
            return line

    return None


def extract_skills(text: str):
    # Matches only skills from our predefined skill list
    found_skills = []

    for skill in SKILLS_LIST:
        pattern = rf"\b{re.escape(skill)}\b"

        if re.search(pattern, text, re.IGNORECASE):
            found_skills.append(skill)

    return ", ".join(sorted(set(found_skills))) if found_skills else None


def extract_section(text: str, start_keywords: list, stop_keywords: list):
    # Extracts section content like Education, Experience, Projects
    lines = [line.strip() for line in text.split("\n") if line.strip()]
    collected_lines = []
    is_collecting = False

    for line in lines:
        lower_line = line.lower()

        if any(keyword in lower_line for keyword in start_keywords):
            is_collecting = True
            continue

        if is_collecting and any(keyword == lower_line for keyword in stop_keywords):
            break

        if is_collecting:
            collected_lines.append(line)

    return " ".join(collected_lines[:6]) if collected_lines else None


def extract_candidate_details(text: str):
    # Main function called from resume upload route
    linkedin_url, github_url = extract_links(text)

    stop_keywords = [
        "summary", "skills", "education", "experience",
        "projects", "certifications", "achievements",
        "contact", "languages"
    ]

    return {
        "full_name": extract_name(text),
        "email": extract_email(text),
        "phone": extract_phone(text),
        "skills": extract_skills(text),

        "education": extract_section(
            text,
            ["education", "academic qualification", "qualification"],
            stop_keywords
        ),

        "experience": extract_section(
            text,
            ["experience", "work experience", "internship"],
            stop_keywords
        ),

        "projects": extract_section(
            text,
            ["projects", "academic projects", "personal projects"],
            stop_keywords
        ),

        "certifications": extract_section(
            text,
            ["certifications", "certificates"],
            stop_keywords
        ),

        "linkedin_url": linkedin_url,
        "github_url": github_url
    }