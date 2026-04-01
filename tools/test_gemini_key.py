"""Quick test to verify a Gemini API key works."""
import urllib.request, json, sys

KEY = input("Paste your Gemini API key: AIzaSyCobqSFk-sfPVopS3Aq5OfRCgZxBCG3mXE").strip()

for model in ["gemini-2.0-flash", "gemini-1.5-flash"]:
    url = f"https://generativelanguage.googleapis.com/v1beta/models/{model}:generateContent?key={KEY}"
    body = json.dumps({"contents": [{"parts": [{"text": "Say hello in one word"}]}]}).encode()
    req = urllib.request.Request(url, data=body, headers={"Content-Type": "application/json"})
    try:
        with urllib.request.urlopen(req) as r:
            data = json.loads(r.read())
            text = data["candidates"][0]["content"]["parts"][0]["text"]
            print(f"OK {model}: {text.strip()}")
    except urllib.error.HTTPError as e:
        err = json.loads(e.read())
        code = err.get("error", {}).get("code")
        msg  = err.get("error", {}).get("message", "")[:200]
        print(f"FAIL {model}: HTTP {code} -- {msg}")
    except Exception as ex:
        print(f"ERROR {model}: {ex}")
