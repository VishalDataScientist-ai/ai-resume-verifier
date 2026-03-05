import requests
import json
import os

def test_analyze_endpoint():
    url = "http://127.0.0.1:5001/api/analyze"

    # Create a dummy PDF file simulating a resume with some frontend skills
    pdf_path = "test_frontend_resume.pdf"
    import fitz
    doc = fitz.open()
    page = doc.new_page()
    page.insert_text((50, 50), "John Doe Resume\nSkills: HTML, CSS, JavaScript, React\nExperience: 3 years building web apps.", fontsize=12)
    doc.save(pdf_path)
    doc.close()

    payload = {
        'name': 'John Frontend',
        'email': 'john@example.com',
        'github_username': 'johndoe123',
        'job_role': 'Frontend Engineer'
    }

    print(f"Sending request to {url} with job_role: Frontend Engineer")
    print("Simulated Resume Content: HTML, CSS, JavaScript, React")

    try:
        with open(pdf_path, 'rb') as f:
            files = {'resume': (pdf_path, f, 'application/pdf')}
            response = requests.post(url, data=payload, files=files)

        if response.status_code == 200:
            print("\n✅ Success! Response Status: 200")
            print("\nResponse Data:")
            data = response.json()
            score_data = data.get('score_data', {})
            resume_data = data.get('resume_data', {})
            
            print(f"Candidate ID: {data.get('candidate_id')}")
            print(f"Final Skill Trust Score: {score_data.get('final_score')}%")
            print(f"Job Match Score Component: {score_data.get('components', {}).get('project_match_score')}%")
            print(f"Extracted Skills: {resume_data.get('extracted_skills')}")
            print(f"Missing Skills: {resume_data.get('missing_skills')}")
            print(f"AI Summary: {score_data.get('ai_summary')}")
            print(f"Risk Alerts: {score_data.get('risk_alerts')}")
            
        else:
            print(f"\n❌ Error! Response Status: {response.status_code}")
            print(response.text)

    except Exception as e:
         print(f"Request failed: {e}")
    finally:
        if os.path.exists(pdf_path):
             os.remove(pdf_path)

if __name__ == "__main__":
    test_analyze_endpoint()
