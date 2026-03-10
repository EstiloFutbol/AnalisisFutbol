import os
import json
from dotenv import load_dotenv
from supabase import create_client, Client

load_dotenv('.env.local')

url: str = os.environ.get("VITE_SUPABASE_URL")
key: str = os.environ.get("VITE_SUPABASE_SERVICE_ROLE_KEY")

supabase: Client = create_client(url, key)

response = supabase.table('matches').select('id, matchday, match_date, home_team:teams!home_team_id(name), away_team:teams!away_team_id(name), home_corners, away_corners, total_corners').eq('total_corners', 25).execute()

print(json.dumps(response.data, indent=2))
