import os
import re

import fitz
from docx import Document


# Allowed resume file formats
ALLOWED_EXTENSIONS = [".pdf", ".docx"]


# Important keywords normally found inside resumes
RESUME_KEYWORDS = [
    "skills",
    "education",
    "experience",
    "projects",
    "internship",
    "certification",
    "certifications",
    "summary",
    "objective",
    "technical skills",
]


def extract_text_from_pdf(file_path: str) -> str:
    """
    Extract text from PDF while preserving line structure.
    """

    text = ""

    try:
        pdf_document = fitz.open(file_path)

        for page in pdf_document:
            page_text = page.get_text("text")

            if page_text:
                text += page_text + "\n"

        pdf_document.close()

    except Exception:
        raise ValueError(
            "Could not read PDF file."
        )

    return text


def extract_text_from_docx(file_path: str) -> str:
    """
    Extract text from DOCX while preserving paragraph structure.
    """

    try:
        document = Document(file_path)

        text = "\n".join(
            paragraph.text.strip()
            for paragraph in document.paragraphs
            if paragraph.text.strip()
        )

    except Exception:
        raise ValueError(
            "Could not read DOCX file."
        )

    return text


def clean_text(text: str) -> str:
    """
    Clean extracted resume text
    WITHOUT destroying line breaks.

    Very important for:
    - name extraction
    - section detection
    - LinkedIn/GitHub extraction
    """

    if not text:
        return ""

    # Normalize line endings
    text = text.replace("\r", "\n")

    # Remove excessive spaces/tabs
    text = re.sub(r"[ \t]+", " ", text)

    # Remove excessive blank lines
    text = re.sub(r"\n{3,}", "\n\n", text)

    # Remove weird unicode spaces
    text = text.replace("\xa0", " ")

    return text.strip()


def contains_contact_info(text: str) -> bool:
    """
    Resume should contain either:
    - email
    - phone
    """

    email_pattern = (
        r"[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+"
    )

    phone_pattern = r"(\+91[\s-]?)?[6-9]\d{9}"

    has_email = re.search(email_pattern, text)

    has_phone = re.search(phone_pattern, text)

    return bool(has_email or has_phone)


def contains_resume_keywords(text: str) -> bool:
    """
    Basic validation:
    resume should contain at least
    some resume-related keywords.
    """

    lower_text = text.lower()

    keyword_count = sum(
        1
        for keyword in RESUME_KEYWORDS
        if keyword in lower_text
    )

    return keyword_count >= 2


def validate_resume_text(text: str) -> bool:
    """
    Validate whether uploaded file
    actually looks like a resume.
    """

    if len(text) < 250:
        return False

    if not contains_contact_info(text):
        return False

    if not contains_resume_keywords(text):
        return False

    return True


def parse_resume(file_path: str) -> str:
    """
    Main resume parser function.

    Supports:
    - PDF
    - DOCX
    """

    if not os.path.exists(file_path):
        raise ValueError(
            "Resume file not found."
        )

    extension = os.path.splitext(file_path)[1].lower()

    if extension not in ALLOWED_EXTENSIONS:
        raise ValueError(
            "Invalid file type. Only PDF and DOCX are allowed."
        )

    # Extract raw text
    if extension == ".pdf":
        text = extract_text_from_pdf(file_path)

    elif extension == ".docx":
        text = extract_text_from_docx(file_path)

    else:
        raise ValueError(
            "Unsupported file format."
        )

    # Clean text
    cleaned_text = clean_text(text)

    if not cleaned_text:
        raise ValueError(
            "Could not extract text from file."
        )

    # Validate resume
    if not validate_resume_text(cleaned_text):
        raise ValueError(
            "Uploaded file does not appear to be a valid resume."
        )

    return cleaned_text