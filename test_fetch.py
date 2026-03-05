import requests

response = requests.get('http://127.0.0.1:5001/api/candidates/11')
print(response.json())
