import os
import re

import fitz
from docx import Document


ALLOWED_EXTENSIONS = [".pdf", ".docx"]

RESUME_KEYWORDS = [
    "skills",
    "education",
    "experience",
    "projects",
    "internship",
    "certification",
    "summary",
    "objective",
    "technical skills",
]


def extract_text_from_pdf(file_path: str) -> str:
    text = ""

    pdf_document = fitz.open(file_path)

    for page in pdf_document:
        text += page.get_text()

    pdf_document.close()

    return text


def extract_text_from_docx(file_path: str) -> str:
    document = Document(file_path)

    text = "\n".join(
        paragraph.text for paragraph in document.paragraphs
    )

    return text


def clean_text(text: str) -> str:
    text = re.sub(r"\s+", " ", text)

    return text.strip()


def contains_contact_info(text: str) -> bool:
    email_pattern = r"[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+"

    phone_pattern = r"\+?\d[\d\s-]{8,}"

    has_email = re.search(email_pattern, text)

    has_phone = re.search(phone_pattern, text)

    return bool(has_email or has_phone)


def contains_resume_keywords(text: str) -> bool:
    text = text.lower()

    keyword_count = sum(
        1 for keyword in RESUME_KEYWORDS
        if keyword in text
    )

    return keyword_count >= 2


def validate_resume_text(text: str) -> bool:
    if len(text) < 300:
        return False

    if not contains_contact_info(text):
        return False

    if not contains_resume_keywords(text):
        return False

    return True


def parse_resume(file_path: str) -> str:
    extension = os.path.splitext(file_path)[1].lower()

    if extension not in ALLOWED_EXTENSIONS:
        raise ValueError(
            "Invalid file type. Only PDF and DOCX are allowed."
        )

    if extension == ".pdf":
        text = extract_text_from_pdf(file_path)

    elif extension == ".docx":
        text = extract_text_from_docx(file_path)

    else:
        raise ValueError("Unsupported file format.")

    cleaned_text = clean_text(text)

    if not cleaned_text:
        raise ValueError(
            "Could not extract text from file."
        )

    if not validate_resume_text(cleaned_text):
        raise ValueError(
            "Uploaded file does not appear to be a valid resume."
        )

    return cleaned_text