import sqlite3
import os

# Connect to the existing dietec.db
db_path = 'dietec.db'
conn = sqlite3.connect(db_path)
cursor = conn.cursor()

print("🚀 Adding tables to dietec.db...")
print("=" * 60)

# Create medicines table
print("\n📦 Creating medicines table...")
cursor.execute('''
CREATE TABLE IF NOT EXISTS medicines (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    generic_name TEXT NOT NULL,
    price REAL NOT NULL,
    original_price REAL,
    manufacturer TEXT NOT NULL,
    description TEXT NOT NULL,
    prescription INTEGER NOT NULL DEFAULT 0,
    in_stock INTEGER NOT NULL DEFAULT 1,
    rating REAL,
    category TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
)
''')
print("✅ Medicines table created")

# Create medical_tests table
print("\n🧪 Creating medical_tests table...")
cursor.execute('''
CREATE TABLE IF NOT EXISTS medical_tests (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    description TEXT NOT NULL,
    price REAL NOT NULL,
    category TEXT NOT NULL,
    preparation TEXT,
    duration TEXT,
    available INTEGER NOT NULL DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
)
''')
print("✅ Medical tests table created")

# Create appointments table
print("\n📅 Creating appointments table...")
cursor.execute('''
CREATE TABLE IF NOT EXISTS appointments (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    patient_name TEXT NOT NULL,
    doctor_name TEXT,
    date TEXT NOT NULL,
    time TEXT NOT NULL,
    reason TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
)
''')
print("✅ Appointments table created")

# Create bills table
print("\n💳 Creating bills table...")
cursor.execute('''
CREATE TABLE IF NOT EXISTS bills (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    invoice_id TEXT UNIQUE NOT NULL,
    user_id INTEGER,
    date TEXT NOT NULL,
    service TEXT NOT NULL,
    amount REAL NOT NULL,
    status TEXT NOT NULL DEFAULT 'pending',
    due_date TEXT,
    doctor TEXT,
    description TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
)
''')
print("✅ Bills table created")

# Create admin_users table
print("\n👮 Creating admin_users table...")
cursor.execute('''
CREATE TABLE IF NOT EXISTS admin_users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    role TEXT NOT NULL DEFAULT 'patient',
    join_date TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
)
''')
print("✅ Admin users table created")

# Commit table creation
conn.commit()

# Insert medicines data
print("\n📦 Inserting medicines data...")
medicines_data = [
    ("Paracetamol 500mg", "Acetaminophen", 25.00, 35.00, "PharmaCo", "Pain relief and fever reducer. Effective for headaches, body aches, and fever.", 0, 1, 4.5, "Pain Relief"),
    ("Amoxicillin 250mg", "Amoxicillin", 120.00, None, "MediLife", "Antibiotic for bacterial infections. Treats respiratory, ear, and throat infections.", 1, 1, 4.7, "Antibiotics"),
    ("Cetirizine 10mg", "Cetirizine", 45.00, 60.00, "AllergyFree", "Antihistamine for allergy relief. Controls sneezing, runny nose, and itching.", 0, 1, 4.3, "Allergy"),
    ("Omeprazole 20mg", "Omeprazole", 85.00, None, "GastroCare", "Reduces stomach acid. Treats GERD, ulcers, and acid reflux.", 1, 1, 4.6, "Digestive"),
    ("Vitamin D3 1000IU", "Cholecalciferol", 180.00, 220.00, "WellnessPlus", "Essential vitamin D supplement. Supports bone health and immunity.", 0, 1, 4.8, "Supplements"),
    ("Aspirin 75mg", "Acetylsalicylic Acid", 30.00, None, "HeartCare", "Blood thinner and pain relief. Used for heart health and pain management.", 0, 0, 4.4, "Cardiovascular"),
    ("Ibuprofen 400mg", "Ibuprofen", 40.00, 55.00, "PainAway", "Anti-inflammatory and pain reliever. Effective for arthritis and muscle pain.", 0, 1, 4.6, "Pain Relief"),
    ("Metformin 500mg", "Metformin HCl", 95.00, None, "DiabetCare", "Diabetes medication. Controls blood sugar levels in type 2 diabetes.", 1, 1, 4.5, "Diabetes"),
    ("Azithromycin 500mg", "Azithromycin", 150.00, None, "MediLife", "Broad-spectrum antibiotic. Treats respiratory and skin infections.", 1, 1, 4.7, "Antibiotics"),
    ("Calcium + Vitamin D", "Calcium Carbonate", 220.00, 280.00, "BoneStrong", "Complete bone health supplement. Combines calcium and vitamin D3.", 0, 1, 4.7, "Supplements"),
    ("Lisinopril 10mg", "Lisinopril", 110.00, None, "HeartCare", "Blood pressure medication. ACE inhibitor for hypertension management.", 1, 1, 4.6, "Cardiovascular"),
    ("Vitamin B-Complex", "B Vitamins", 160.00, 200.00, "WellnessPlus", "Complete B vitamin complex. Boosts energy and supports metabolism.", 0, 1, 4.5, "Supplements")
]

cursor.executemany('''
INSERT INTO medicines (name, generic_name, price, original_price, manufacturer, description, prescription, in_stock, rating, category)
VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
''', medicines_data)
print(f"✅ Inserted {len(medicines_data)} medicines")

# Insert medical tests data
print("\n🧪 Inserting medical tests data...")
tests_data = [
    ("Complete Blood Count (CBC)", "Comprehensive blood test measuring red cells, white cells, platelets, hemoglobin, and hematocrit", 500.00, "Blood Tests", "Fasting not required", "24 hours", 1),
    ("Lipid Profile", "Measures cholesterol levels including HDL, LDL, triglycerides", 800.00, "Blood Tests", "12-hour fasting required", "24 hours", 1),
    ("Thyroid Function Test (TFT)", "Measures TSH, T3, T4 levels to assess thyroid function", 900.00, "Hormone Tests", "Fasting not required", "48 hours", 1),
    ("Blood Glucose (Fasting)", "Measures blood sugar levels after fasting", 300.00, "Blood Tests", "8-12 hour fasting required", "24 hours", 1),
    ("HbA1c Test", "Measures average blood sugar levels over 2-3 months", 600.00, "Blood Tests", "Fasting not required", "24 hours", 1),
    ("Liver Function Test (LFT)", "Assesses liver health through enzyme levels", 700.00, "Organ Function", "Fasting not required", "24 hours", 1),
    ("Kidney Function Test (KFT)", "Measures creatinine, urea, and electrolytes", 650.00, "Organ Function", "Fasting not required", "24 hours", 1),
    ("Vitamin D Test", "Measures vitamin D levels in blood", 1200.00, "Vitamin Tests", "Fasting not required", "48 hours", 1),
    ("Vitamin B12 Test", "Measures vitamin B12 levels", 800.00, "Vitamin Tests", "Fasting not required", "48 hours", 1),
    ("ECG (Electrocardiogram)", "Records electrical activity of the heart", 400.00, "Cardiac Tests", "No preparation needed", "Immediate", 1),
    ("Chest X-Ray", "Imaging test for lungs and heart", 600.00, "Imaging", "No preparation needed", "2 hours", 1),
    ("Ultrasound Abdomen", "Imaging test for abdominal organs", 1500.00, "Imaging", "6-hour fasting required", "24 hours", 1),
    ("Urine Routine", "Basic urine analysis for infections and kidney function", 250.00, "Urine Tests", "Morning sample preferred", "24 hours", 1),
    ("Stool Routine", "Checks for infections and digestive issues", 350.00, "Stool Tests", "Fresh sample required", "48 hours", 1),
    ("COVID-19 RT-PCR", "RT-PCR test for COVID-19 detection", 800.00, "Infectious Disease", "No preparation needed", "24 hours", 1)
]

cursor.executemany('''
INSERT INTO medical_tests (name, description, price, category, preparation, duration, available)
VALUES (?, ?, ?, ?, ?, ?, ?)
''', tests_data)
print(f"✅ Inserted {len(tests_data)} medical tests")

# Insert sample appointments
print("\n📅 Inserting sample appointments...")
appointments_data = [
    ("John Doe", "Dr. Sarah Smith", "2026-01-05", "10:00", "Regular checkup", "confirmed"),
    ("Jane Smith", "Dr. Mike Wilson", "2026-01-05", "11:30", "Follow-up consultation", "pending"),
    ("Mike Johnson", "Dr. Sarah Smith", "2026-01-06", "14:00", "Blood pressure check", "confirmed")
]

cursor.executemany('''
INSERT INTO appointments (patient_name, doctor_name, date, time, reason, status)
VALUES (?, ?, ?, ?, ?, ?)
''', appointments_data)
print(f"✅ Inserted {len(appointments_data)} appointments")

# Insert sample bills
print("\n💳 Inserting sample bills...")
bills_data = [
    ("INV-001", "2026-01-03", "Doctor Consultation", 500.00, "paid", None, "Dr. Sarah Smith", "General checkup and prescription"),
    ("INV-002", "2026-01-04", "Lab Tests - Blood Panel", 1500.00, "paid", None, None, "Complete blood count, lipid profile"),
    ("INV-003", "2026-01-05", "Doctor Consultation", 800.00, "pending", "2026-01-12", "Dr. Mike Wilson", "Follow-up consultation"),
    ("INV-004", "2025-12-28", "Physiotherapy Session", 600.00, "overdue", "2026-01-04", None, "3 sessions completed")
]

cursor.executemany('''
INSERT INTO bills (invoice_id, date, service, amount, status, due_date, doctor, description)
VALUES (?, ?, ?, ?, ?, ?, ?, ?)
''', bills_data)
print(f"✅ Inserted {len(bills_data)} bills")

# Insert sample admin users
print("\n👮 Inserting sample users...")
users_data = [
    ("John Doe", "john@example.com", "patient", "2025-12-01", "active"),
    ("Dr. Sarah Smith", "sarah@example.com", "doctor", "2025-11-15", "active"),
    ("Jane Doe", "jane@example.com", "patient", "2025-12-10", "active"),
    ("Dr. Mike Wilson", "mike@example.com", "doctor", "2025-11-01", "inactive"),
    ("Admin User", "admin@dietec.com", "admin", "2025-10-01", "active")
]

cursor.executemany('''
INSERT INTO admin_users (name, email, role, join_date, status)
VALUES (?, ?, ?, ?, ?)
''', users_data)
print(f"✅ Inserted {len(users_data)} users")

# Commit all changes
conn.commit()

# Verify data
print("\n" + "=" * 60)
print("🔍 Verifying database contents...")

cursor.execute("SELECT COUNT(*) FROM medicines")
medicines_count = cursor.fetchone()[0]
print(f"📦 Medicines: {medicines_count}")

cursor.execute("SELECT COUNT(*) FROM medical_tests")
tests_count = cursor.fetchone()[0]
print(f"🧪 Medical tests: {tests_count}")

cursor.execute("SELECT COUNT(*) FROM appointments")
appointments_count = cursor.fetchone()[0]
print(f"📅 Appointments: {appointments_count}")

cursor.execute("SELECT COUNT(*) FROM bills")
bills_count = cursor.fetchone()[0]
print(f"💳 Bills: {bills_count}")

cursor.execute("SELECT COUNT(*) FROM admin_users")
users_count = cursor.fetchone()[0]
print(f"👮 Users: {users_count}")

print("\n✅ Database setup complete!")
print("=" * 60)

# Close connection
conn.close()
