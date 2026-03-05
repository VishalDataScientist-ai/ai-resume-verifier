import os
from werkzeug.datastructures import FileStorage
from io import BytesIO

import sys
sys.path.append(os.path.join(os.path.dirname(__file__), 'backend'))

from app import create_app

app = create_app()
app.testing = True
client = app.test_client()

# Create a mock PDF file
pdf_content = b"%PDF-1.4\n%EOF"

data = {
    'name': 'Test User',
    'email': 'test@example.com',
    'github_username': 'testuser',
    'portfolio_url': 'example.com',
    'resume': (BytesIO(pdf_content), 'resume.pdf')
}

response = client.post('/api/analyze', data=data, content_type='multipart/form-data')

print(f"Status Code: {response.status_code}")
print(f"Response Data: {response.data.decode('utf-8')}")
