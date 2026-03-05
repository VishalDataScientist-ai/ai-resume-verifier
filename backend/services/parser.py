import fitz  # PyMuPDF
import spacy
import re

# Load spaCy English model
try:
    nlp = spacy.load("en_core_web_sm")
except OSError:
    # Fallback if not downloaded properly
    import subprocess
    subprocess.run(["python", "-m", "spacy", "download", "en_core_web_sm"])
    nlp = spacy.load("en_core_web_sm")

# List of common tech skills to look for
COMMON_SKILLS = {
    "python", "javascript", "java", "c++", "c#", "ruby", "go", "rust", "php", "typescript", "swift", "kotlin",
    "sql", "postgresql", "mysql", "mongodb", "redis", "elasticsearch", "sqlite",
    "react", "react.js", "reactjs", "angular", "vue", "vue.js", "svelte", "html", "html5", "css", "css3", "tailwind", "tailwindcss", "bootstrap",
    "node.js", "nodejs", "express", "django", "flask", "fastapi", "spring", "spring boot", "nestjs",
    "machine learning", "deep learning", "nlp", "computer vision", "tensorflow", "pytorch", "scikit-learn", "pandas", "numpy", "keras",
    "aws", "gcp", "azure", "docker", "kubernetes", "terraform", "ci/cd", "jenkins", "github actions", "gitlab ci", "linux", "bash"
}

# Aliases to normalize skills
SKILL_ALIASES = {
    "react.js": "react", "reactjs": "react",
    "vue.js": "vue",
    "node.js": "node.js", "nodejs": "node.js",
    "html5": "html",
    "css3": "css",
    "tailwindcss": "tailwind",
    "spring boot": "spring"
}

def extract_text_from_pdf(pdf_path_or_bytes):
    """Extracts text from a PDF file."""
    text = ""
    try:
        if isinstance(pdf_path_or_bytes, bytes):
            doc = fitz.open(stream=pdf_path_or_bytes, filetype="pdf")
        else:
            doc = fitz.open(pdf_path_or_bytes)
            
        for page in doc:
            text += page.get_text()
    except Exception as e:
        print(f"Error extracting text from PDF: {e}")
    return text

def extract_image_from_pdf(pdf_bytes):
    """Converts the first page of a PDF to a PNG image byte string."""
    try:
        doc = fitz.open(stream=pdf_bytes, filetype="pdf")
        if len(doc) > 0:
            page = doc[0]
            # Matrix(2, 2) increases the resolution/dpi of the generated image
            pix = page.get_pixmap(matrix=fitz.Matrix(2, 2))
            return pix.tobytes("png")
    except Exception as e:
        print(f"Error rendering PDF to image: {e}")
    return None

def extract_skills(text):
    """Uses NLP to extract potential skills from text."""
    doc = nlp(text)
    found_skills = set()
    
    # Simple matching against known skills
    text_lower = text.lower()
    
    # Token-based matching to allow special characters like ++, #, .
    words = re.findall(r'\b[\w\.\+#-]+\b', text_lower)
    
    for skill in COMMON_SKILLS:
        if " " in skill or skill in text_lower:
            # Word boundary regex for multi-word or special skills
            if re.search(r'\b' + re.escape(skill) + r'(?!\w)', text_lower):
                found_skills.add(SKILL_ALIASES.get(skill, skill))
        if skill in words:
            found_skills.add(SKILL_ALIASES.get(skill, skill))
                
    # Use spaCy entities for additional context
    for ent in doc.ents:
        if ent.label_ in ["ORG", "PRODUCT"]:
            name = ent.text.lower()
            if name in COMMON_SKILLS:
                found_skills.add(SKILL_ALIASES.get(name, name))
                
    return list(found_skills)

def extract_name(text):
    """Uses NLP and aggressive heuristics to extract the candidate's name."""
    lines = text.strip().split('\n')
    
    clean_lines = []
    for line in lines:
        line = line.strip()
        lower_line = line.lower()
        if not line or len(line) < 2:
            continue
        # Skip lines that are obviously contact info or resume headers
        if any(kw in lower_line for kw in ["resume", "curriculum vitae", "cv", "email", "phone", "mobile", "github", "linkedin", "address", "@", ".com"]):
            continue
        # Skip lines with too many numbers
        if sum(c.isdigit() for c in line) > 2:
            continue
        clean_lines.append(line)
        
    doc = nlp("\n".join(clean_lines[:15]))
    
    # 1. Try SpaCy
    for ent in doc.ents:
        if ent.label_ == "PERSON" and len(ent.text.split()) >= 2:
            return ent.text.title()
            
    # 2. Strong Fallback: Return the very first clean line that looks like a 2-4 word name
    for line in clean_lines[:5]:
        words = line.split()
        if 1 <= len(words) <= 4:
            # Check if it contains only alphabetical chars
            if all(re.match(r"^[A-Za-z\.\-\']+$", w) for w in words):
                return " ".join(w.capitalize() for w in words)
            
    return None

JOB_ROLE_SKILLS = {
    "frontend": {"html", "css", "javascript", "typescript", "react", "vue", "angular", "tailwind", "node.js"},
    "backend": {"python", "java", "node.js", "go", "ruby", "sql", "postgresql", "docker", "aws", "typescript", "c#", "php"},
    "fullstack": {"javascript", "typescript", "react", "node.js", "sql", "html", "css", "docker", "aws", "python"},
    "data scientist": {"python", "sql", "machine learning", "pandas", "numpy", "tensorflow", "pytorch", "scikit-learn"},
    "devops": {"docker", "kubernetes", "aws", "terraform", "ci/cd", "jenkins", "linux", "python", "bash"},
    "software": {"javascript", "python", "java", "sql", "docker", "aws", "c++", "node.js", "html"},
    "developer": {"javascript", "python", "java", "sql", "docker", "aws", "node.js", "html"}
}

def analyze_resume(pdf_bytes, job_role=None):
    """Main pipeline for resume parsing."""
    text = extract_text_from_pdf(pdf_bytes)
    skills = extract_skills(text)
    image_bytes = extract_image_from_pdf(pdf_bytes)
    
    missing_skills = []
    required_skills = set()
    
    if job_role:
        # Simple keyword matching to find the closest job role profile
        role_lower = job_role.lower()
        for key, req_skills in JOB_ROLE_SKILLS.items():
            if key in role_lower:
                required_skills = req_skills
                break
                
        # If we matched a profile, figure out what's missing
        if required_skills:
            parsed_set = set(skills)
            missing_skills = list(required_skills - parsed_set)
    
    return {
        "text_length": len(text),
        "raw_text": text,
        "extracted_name": extract_name(text),
        "extracted_skills": skills,
        "missing_skills": missing_skills,
        "required_skills": list(required_skills),
        "cv_image_data": image_bytes
    }
