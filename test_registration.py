import requests
import json

# Test registration endpoint
url = "http://127.0.0.1:8000/api/register/"
import time
unique_id = int(time.time())
data = {
    "username": f"testuser{unique_id}",
    "email": f"test{unique_id}@example.com",
    "password": "SecurePass123!",
    "password2": "SecurePass123!",
    "first_name": "Test",
    "last_name": "User",
    "role": "trainee"
}

headers = {
    "Content-Type": "application/json"
}

try:
    response = requests.post(url, data=json.dumps(data), headers=headers)
    print(f"Status Code: {response.status_code}")
    print(f"Response: {response.text}")

    if response.status_code == 201:
        print("✅ Registration successful!")
    else:
        print("❌ Registration failed!")
        print(f"Error: {response.json()}")

except Exception as e:
    print(f"Error: {e}")
