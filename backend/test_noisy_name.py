import requests
import json
import fitz
import os

def test_noisy_name_extraction():
    url = "http://127.0.0.1:5001/api/analyze"
    pdf_path = "test_noisy_resume.pdf"

    # Create a dummy PDF with noisy headers (email, phone, etc.)
    doc = fitz.open()
    page = doc.new_page()
    content = """
    Resume
    Curriculum Vitae
    developer@email.com
    +91 9876543210
    https://github.com/vishalsingh
    Vishal Singh
    
    Skills: HTML5, CSS3, React.js, Nodejs, tailwindcss
    Experience: 3 years building web apps.
    """
    page.insert_text((50, 50), content, fontsize=12)
    doc.save(pdf_path)
    doc.close()

    payload = {
        'name': '', # Simulate blank form name
        'email': 'vishal@example.com',
        'github_username': 'vishalsingh',
        'job_role': 'Frontend'
    }

    print("Uploading resume with noisy header and aliases (HTML5, CSS3, React.js)...")
    try:
        with open(pdf_path, 'rb') as f:
            files = {'resume': (pdf_path, f, 'application/pdf')}
            response = requests.post(url, data=payload, files=files)

        if response.status_code == 200:
            data = response.json()
            score_data = data.get('score_data', {})
            resume_data = data.get('resume_data', {})
            
            print(f"Extracted Candidate Name: {data.get('candidate_id')} (From DB this is not passed directly, checking resume_data...)")
            print(f"Name from Parser: {resume_data.get('extracted_name')}")
            print(f"Extracted Skills: {resume_data.get('extracted_skills')}")
            print(f"Missing Skills: {resume_data.get('missing_skills')}")
            
        else:
            print(f"Error! Response: {response.text}")

    except Exception as e:
         print(f"Request failed: {e}")
    finally:
        if os.path.exists(pdf_path):
             os.remove(pdf_path)

if __name__ == "__main__":
    test_noisy_name_extraction()
