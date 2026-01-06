import os
from supabase import create_client, Client
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Supabase credentials
url = os.environ.get("SUPABASE_URL")
key = os.environ.get("SUPABASE_SERVICE_KEY")

# Initialize Supabase client
supabase: Client = create_client(url, key)

print("🔍 Checking Supabase table schemas...")
print("=" * 60)

# Check appointments table
print("\n📅 Appointments table structure:")
try:
    result = supabase.table('appointments').select("*").limit(1).execute()
    if result.data:
        print(f"Columns found: {list(result.data[0].keys())}")
    else:
        print("Table exists but no data yet")
except Exception as e:
    print(f"Error: {e}")

# Check bills table
print("\n💳 Bills table structure:")
try:
    result = supabase.table('bills').select("*").limit(1).execute()
    if result.data:
        print(f"Columns found: {list(result.data[0].keys())}")
    else:
        print("Table exists but no data yet")
except Exception as e:
    print(f"Error: {e}")

# Check medicines table
print("\n📦 Medicines table structure:")
try:
    result = supabase.table('medicines').select("*").limit(1).execute()
    if result.data:
        print(f"Columns found: {list(result.data[0].keys())}")
except Exception as e:
    print(f"Error: {e}")

# Check medical_tests table
print("\n🧪 Medical tests table structure:")
try:
    result = supabase.table('medical_tests').select("*").limit(1).execute()
    if result.data:
        print(f"Columns found: {list(result.data[0].keys())}")
except Exception as e:
    print(f"Error: {e}")

# Check admin_users table
print("\n👮 Admin users table structure:")
try:
    result = supabase.table('admin_users').select("*").limit(1).execute()
    if result.data:
        print(f"Columns found: {list(result.data[0].keys())}")
except Exception as e:
    print(f"Error: {e}")

print("\n" + "=" * 60)
