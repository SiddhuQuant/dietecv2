import os
from supabase import create_client, Client
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Initialize Supabase client
url: str = os.getenv("SUPABASE_URL")
service_key: str = os.getenv("SUPABASE_SERVICE_KEY")
supabase: Client = create_client(url, service_key)

def run_migrations():
    """Run SQL migrations to create and populate tables"""
    
    print("Starting Supabase migrations...")
    
    # Read the SQL file
    with open('supabase_migrations.sql', 'r') as f:
        sql_content = f.read()
    
    # Split by semicolons to get individual statements
    statements = [s.strip() for s in sql_content.split(';') if s.strip()]
    
    success_count = 0
    error_count = 0
    
    for i, statement in enumerate(statements, 1):
        if not statement:
            continue
            
        try:
            # Execute SQL using Supabase RPC
            result = supabase.rpc('exec_sql', {'query': statement}).execute()
            print(f"✓ Statement {i}/{len(statements)} executed successfully")
            success_count += 1
        except Exception as e:
            print(f"✗ Error in statement {i}: {str(e)}")
            error_count += 1
    
    print(f"\nMigration complete!")
    print(f"✓ Successful: {success_count}")
    print(f"✗ Failed: {error_count}")
    
    # Verify data was inserted
    try:
        medicines = supabase.table('medicines').select("*").execute()
        tests = supabase.table('medical_tests').select("*").execute()
        
        print(f"\n📦 Medicines in database: {len(medicines.data)}")
        print(f"🧪 Tests in database: {len(tests.data)}")
    except Exception as e:
        print(f"Note: {str(e)}")

if __name__ == "__main__":
    run_migrations()
