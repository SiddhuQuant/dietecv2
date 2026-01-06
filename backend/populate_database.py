import os
from supabase import create_client, Client
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Initialize Supabase client
url: str = os.getenv("SUPABASE_URL")
service_key: str = os.getenv("SUPABASE_SERVICE_KEY")
supabase: Client = create_client(url, service_key)

# Medicine data
medicines_data = [
    {
        "name": "Paracetamol 500mg",
        "generic_name": "Acetaminophen",
        "price": 25.00,
        "original_price": 35.00,
        "manufacturer": "PharmaCo",
        "description": "Pain relief and fever reducer. Effective for headaches, body aches, and fever.",
        "prescription": False,
        "in_stock": True,
        "rating": 4.5,
        "category": "Pain Relief"
    },
    {
        "name": "Amoxicillin 250mg",
        "generic_name": "Amoxicillin",
        "price": 120.00,
        "manufacturer": "MediLife",
        "description": "Antibiotic for bacterial infections. Treats respiratory, ear, and throat infections.",
        "prescription": True,
        "in_stock": True,
        "rating": 4.7,
        "category": "Antibiotics"
    },
    {
        "name": "Cetirizine 10mg",
        "generic_name": "Cetirizine",
        "price": 45.00,
        "original_price": 60.00,
        "manufacturer": "AllergyFree",
        "description": "Antihistamine for allergy relief. Controls sneezing, runny nose, and itching.",
        "prescription": False,
        "in_stock": True,
        "rating": 4.3,
        "category": "Allergy"
    },
    {
        "name": "Omeprazole 20mg",
        "generic_name": "Omeprazole",
        "price": 85.00,
        "manufacturer": "GastroCare",
        "description": "Reduces stomach acid. Treats GERD, ulcers, and acid reflux.",
        "prescription": True,
        "in_stock": True,
        "rating": 4.6,
        "category": "Digestive"
    },
    {
        "name": "Vitamin D3 1000IU",
        "generic_name": "Cholecalciferol",
        "price": 180.00,
        "original_price": 220.00,
        "manufacturer": "WellnessPlus",
        "description": "Essential vitamin D supplement. Supports bone health and immunity.",
        "prescription": False,
        "in_stock": True,
        "rating": 4.8,
        "category": "Supplements"
    },
    {
        "name": "Aspirin 75mg",
        "generic_name": "Acetylsalicylic Acid",
        "price": 30.00,
        "manufacturer": "HeartCare",
        "description": "Blood thinner and pain relief. Used for heart health and pain management.",
        "prescription": False,
        "in_stock": False,
        "rating": 4.4,
        "category": "Cardiovascular"
    },
    {
        "name": "Ibuprofen 400mg",
        "generic_name": "Ibuprofen",
        "price": 40.00,
        "original_price": 55.00,
        "manufacturer": "PainAway",
        "description": "Anti-inflammatory and pain reliever. Effective for arthritis and muscle pain.",
        "prescription": False,
        "in_stock": True,
        "rating": 4.6,
        "category": "Pain Relief"
    },
    {
        "name": "Metformin 500mg",
        "generic_name": "Metformin HCl",
        "price": 95.00,
        "manufacturer": "DiabetCare",
        "description": "Diabetes medication. Controls blood sugar levels in type 2 diabetes.",
        "prescription": True,
        "in_stock": True,
        "rating": 4.5,
        "category": "Diabetes"
    },
    {
        "name": "Azithromycin 500mg",
        "generic_name": "Azithromycin",
        "price": 150.00,
        "manufacturer": "MediLife",
        "description": "Broad-spectrum antibiotic. Treats respiratory and skin infections.",
        "prescription": True,
        "in_stock": True,
        "rating": 4.7,
        "category": "Antibiotics"
    },
    {
        "name": "Calcium + Vitamin D",
        "generic_name": "Calcium Carbonate",
        "price": 220.00,
        "original_price": 280.00,
        "manufacturer": "BoneStrong",
        "description": "Complete bone health supplement. Combines calcium and vitamin D3.",
        "prescription": False,
        "in_stock": True,
        "rating": 4.7,
        "category": "Supplements"
    },
    {
        "name": "Lisinopril 10mg",
        "generic_name": "Lisinopril",
        "price": 110.00,
        "manufacturer": "HeartCare",
        "description": "Blood pressure medication. ACE inhibitor for hypertension management.",
        "prescription": True,
        "in_stock": True,
        "rating": 4.6,
        "category": "Cardiovascular"
    },
    {
        "name": "Vitamin B-Complex",
        "generic_name": "B Vitamins",
        "price": 160.00,
        "original_price": 200.00,
        "manufacturer": "WellnessPlus",
        "description": "Complete B vitamin complex. Boosts energy and supports metabolism.",
        "prescription": False,
        "in_stock": True,
        "rating": 4.5,
        "category": "Supplements"
    }
]

# Medical tests data
tests_data = [
    {
        "name": "Complete Blood Count (CBC)",
        "description": "Comprehensive blood test measuring red cells, white cells, platelets, hemoglobin, and hematocrit",
        "price": 500.00,
        "category": "Blood Tests",
        "preparation": "Fasting not required",
        "duration": "24 hours",
        "available": True
    },
    {
        "name": "Lipid Profile",
        "description": "Measures cholesterol levels including HDL, LDL, triglycerides",
        "price": 800.00,
        "category": "Blood Tests",
        "preparation": "12-hour fasting required",
        "duration": "24 hours",
        "available": True
    },
    {
        "name": "Thyroid Function Test (TFT)",
        "description": "Measures TSH, T3, T4 levels to assess thyroid function",
        "price": 900.00,
        "category": "Hormone Tests",
        "preparation": "Fasting not required",
        "duration": "48 hours",
        "available": True
    },
    {
        "name": "Blood Glucose (Fasting)",
        "description": "Measures blood sugar levels after fasting",
        "price": 300.00,
        "category": "Blood Tests",
        "preparation": "8-12 hour fasting required",
        "duration": "24 hours",
        "available": True
    },
    {
        "name": "HbA1c Test",
        "description": "Measures average blood sugar levels over 2-3 months",
        "price": 600.00,
        "category": "Blood Tests",
        "preparation": "Fasting not required",
        "duration": "24 hours",
        "available": True
    },
    {
        "name": "Liver Function Test (LFT)",
        "description": "Assesses liver health through enzyme levels",
        "price": 700.00,
        "category": "Organ Function",
        "preparation": "Fasting not required",
        "duration": "24 hours",
        "available": True
    },
    {
        "name": "Kidney Function Test (KFT)",
        "description": "Measures creatinine, urea, and electrolytes",
        "price": 650.00,
        "category": "Organ Function",
        "preparation": "Fasting not required",
        "duration": "24 hours",
        "available": True
    },
    {
        "name": "Vitamin D Test",
        "description": "Measures vitamin D levels in blood",
        "price": 1200.00,
        "category": "Vitamin Tests",
        "preparation": "Fasting not required",
        "duration": "48 hours",
        "available": True
    },
    {
        "name": "Vitamin B12 Test",
        "description": "Measures vitamin B12 levels",
        "price": 800.00,
        "category": "Vitamin Tests",
        "preparation": "Fasting not required",
        "duration": "48 hours",
        "available": True
    },
    {
        "name": "ECG (Electrocardiogram)",
        "description": "Records electrical activity of the heart",
        "price": 400.00,
        "category": "Cardiac Tests",
        "preparation": "No preparation needed",
        "duration": "Immediate",
        "available": True
    },
    {
        "name": "Chest X-Ray",
        "description": "Imaging test for lungs and heart",
        "price": 600.00,
        "category": "Imaging",
        "preparation": "No preparation needed",
        "duration": "2 hours",
        "available": True
    },
    {
        "name": "Ultrasound Abdomen",
        "description": "Imaging test for abdominal organs",
        "price": 1500.00,
        "category": "Imaging",
        "preparation": "6-hour fasting required",
        "duration": "24 hours",
        "available": True
    },
    {
        "name": "Urine Routine",
        "description": "Basic urine analysis for infections and kidney function",
        "price": 250.00,
        "category": "Urine Tests",
        "preparation": "Morning sample preferred",
        "duration": "24 hours",
        "available": True
    },
    {
        "name": "Stool Routine",
        "description": "Checks for infections and digestive issues",
        "price": 350.00,
        "category": "Stool Tests",
        "preparation": "Fresh sample required",
        "duration": "48 hours",
        "available": True
    },
    {
        "name": "COVID-19 RT-PCR",
        "description": "RT-PCR test for COVID-19 detection",
        "price": 800.00,
        "category": "Infectious Disease",
        "preparation": "No preparation needed",
        "duration": "24 hours",
        "available": True
    }
]

def populate_database():
    """Populate Supabase database with medicines and tests"""
    
    print("🚀 Starting database population...")
    print("=" * 50)
    
    # Insert medicines
    print("\n📦 Inserting medicines...")
    try:
        result = supabase.table('medicines').insert(medicines_data).execute()
        print(f"✅ Successfully inserted {len(medicines_data)} medicines!")
    except Exception as e:
        print(f"❌ Error inserting medicines: {str(e)}")
    
    # Insert tests
    print("\n🧪 Inserting medical tests...")
    try:
        result = supabase.table('medical_tests').insert(tests_data).execute()
        print(f"✅ Successfully inserted {len(tests_data)} medical tests!")
    except Exception as e:
        print(f"❌ Error inserting tests: {str(e)}")
    
    # Verify
    print("\n" + "=" * 50)
    print("🔍 Verifying database contents...")
    try:
        medicines = supabase.table('medicines').select("*").execute()
        tests = supabase.table('medical_tests').select("*").execute()
        
        print(f"📦 Total medicines in database: {len(medicines.data)}")
        print(f"🧪 Total tests in database: {len(tests.data)}")
        print("\n✅ Database population complete!")
    except Exception as e:
        print(f"❌ Error verifying data: {str(e)}")

if __name__ == "__main__":
    populate_database()
