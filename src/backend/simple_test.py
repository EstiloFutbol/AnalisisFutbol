import requests
import json

def test_api_endpoints():
    base_url = "http://localhost:8000"
    
    print("Testing API endpoints...")
    
    # Test health endpoint
    try:
        response = requests.get(f"{base_url}/health")
        print(f"✓ /health: Status {response.status_code}")
        if response.status_code == 200:
            print(f"  Response: {response.json()}")
    except Exception as e:
        print(f"✗ /health: Failed - {e}")
    
    # Test competitions endpoint
    try:
        response = requests.get(f"{base_url}/api/competitions")
        print(f"✓ /api/competitions: Status {response.status_code}")
        if response.status_code == 200:
            data = response.json()
            print(f"  Found {len(data)} competitions")
            if data:
                print(f"  First competition: {data[0].get('competition_name', 'Unknown')}")
    except Exception as e:
        print(f"✗ /api/competitions: Failed - {e}")
    
    # Test matches endpoint with required parameters
    try:
        response = requests.get(f"{base_url}/api/matches?competition_id=11&season_id=4")
        print(f"✓ /api/matches: Status {response.status_code}")
        if response.status_code == 200:
            data = response.json()
            print(f"  Found {len(data)} matches")
        else:
            print(f"  Error response: {response.text}")
    except Exception as e:
        print(f"✗ /api/matches: Failed - {e}")
    
    # Test players endpoint
    try:
        response = requests.get(f"{base_url}/api/players/11/4")
        print(f"✓ /api/players: Status {response.status_code}")
        if response.status_code == 200:
            data = response.json()
            print(f"  Found {len(data)} players")
    except Exception as e:
        print(f"✗ /api/players: Failed - {e}")
    
    # Test auth endpoint with correct data format
    try:
        # Using form data for OAuth2PasswordRequestForm
        response = requests.post(f"{base_url}/api/auth/login", data={"username": "admin", "password": "admin123"})
        print(f"✓ /api/auth/login: Status {response.status_code}")
        if response.status_code == 200:
            print(f"  Login successful")
        else:
            print(f"  Error response: {response.text}")
    except Exception as e:
        print(f"✗ /api/auth/login: Failed - {e}")
    
    # Test auth endpoint with JSON format
    try:
        response = requests.post(f"{base_url}/api/auth/login-json", json={"username": "admin", "password": "admin123"})
        print(f"✓ /api/auth/login-json: Status {response.status_code}")
        if response.status_code == 200:
            print(f"  Login successful")
        else:
            print(f"  Error response: {response.text}")
    except Exception as e:
        print(f"✗ /api/auth/login-json: Failed - {e}")

if __name__ == "__main__":
    test_api_endpoints()