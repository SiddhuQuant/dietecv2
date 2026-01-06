-- Create lab tests table
CREATE TABLE IF NOT EXISTS lab_tests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  price DECIMAL(10, 2) NOT NULL,
  duration VARCHAR(100) NOT NULL,
  category VARCHAR(100) NOT NULL,
  preparation_required BOOLEAN DEFAULT false,
  preparation_instructions TEXT,
  fasting_required BOOLEAN DEFAULT false,
  sample_type VARCHAR(100),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for faster searches
CREATE INDEX IF NOT EXISTS idx_lab_tests_category ON lab_tests(category);
CREATE INDEX IF NOT EXISTS idx_lab_tests_name ON lab_tests(name);

-- Insert default lab tests
INSERT INTO lab_tests (name, description, price, duration, category, preparation_required, preparation_instructions, fasting_required, sample_type) VALUES
('Complete Blood Count (CBC)', 'Comprehensive blood test measuring red blood cells, white blood cells, and platelets. Helps diagnose anemia, infections, and blood disorders.', 500.00, '24 hours', 'Blood Tests', false, NULL, false, 'Blood'),
('Lipid Profile', 'Measures cholesterol levels including HDL, LDL, and triglycerides. Essential for heart health assessment.', 800.00, '24 hours', 'Blood Tests', true, 'Fast for 9-12 hours before test. Water is allowed.', true, 'Blood'),
('Thyroid Function Test (TSH)', 'Measures thyroid-stimulating hormone levels to check thyroid function. Helps diagnose thyroid disorders.', 600.00, '48 hours', 'Hormone Tests', false, NULL, false, 'Blood'),
('Blood Glucose (Fasting)', 'Measures blood sugar levels after fasting. Used to diagnose and monitor diabetes.', 300.00, '12 hours', 'Blood Tests', true, 'Fast for 8-10 hours before test. Only water is allowed.', true, 'Blood'),
('HbA1c (Glycated Hemoglobin)', 'Shows average blood sugar levels over past 2-3 months. Key test for diabetes management.', 700.00, '24 hours', 'Blood Tests', false, NULL, false, 'Blood'),
('Liver Function Test (LFT)', 'Measures enzymes and proteins in blood to assess liver health. Includes ALT, AST, and bilirubin.', 900.00, '24 hours', 'Blood Tests', true, 'Fast for 8-12 hours before test.', true, 'Blood'),
('Kidney Function Test (KFT)', 'Measures creatinine and urea levels to assess kidney health and function.', 850.00, '24 hours', 'Blood Tests', false, NULL, false, 'Blood'),
('Vitamin D Test', 'Measures vitamin D levels in blood. Important for bone health and immunity.', 1200.00, '48 hours', 'Vitamin Tests', false, NULL, false, 'Blood'),
('Vitamin B12 Test', 'Measures vitamin B12 levels. Helps diagnose deficiency causing fatigue and nerve problems.', 1000.00, '48 hours', 'Vitamin Tests', false, NULL, false, 'Blood'),
('Urine Routine Test', 'Comprehensive urine analysis checking for infections, kidney problems, and diabetes.', 250.00, '12 hours', 'Urine Tests', false, 'Collect first morning urine sample in provided container.', false, 'Urine'),
('ECG (Electrocardiogram)', 'Records electrical activity of heart. Detects heart rhythm problems and heart disease.', 400.00, 'Immediate', 'Cardiac Tests', false, NULL, false, 'N/A'),
('Chest X-Ray', 'Imaging test to check lungs, heart, and chest bones. Helps diagnose respiratory and cardiac conditions.', 600.00, '2 hours', 'Imaging', false, 'Remove all metal objects and jewelry.', false, 'N/A'),
('COVID-19 RT-PCR', 'Molecular test to detect active COVID-19 infection. Most accurate test for diagnosis.', 800.00, '24 hours', 'Infectious Disease', false, NULL, false, 'Nasal Swab'),
('Dengue NS1 Antigen', 'Early detection test for dengue fever. Can detect infection within first 5 days.', 900.00, '6 hours', 'Infectious Disease', false, NULL, false, 'Blood'),
('Iron Studies', 'Comprehensive test measuring iron levels, ferritin, and iron-binding capacity. Diagnoses anemia.', 1100.00, '24 hours', 'Blood Tests', true, 'Fast for 8 hours before test.', true, 'Blood')
ON CONFLICT DO NOTHING;

-- Create test bookings table
CREATE TABLE IF NOT EXISTS test_bookings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_number VARCHAR(50) UNIQUE NOT NULL,
  user_id UUID REFERENCES auth.users(id),
  test_id UUID REFERENCES lab_tests(id),
  patient_name VARCHAR(255) NOT NULL,
  patient_age INTEGER NOT NULL,
  patient_phone VARCHAR(20) NOT NULL,
  booking_date DATE NOT NULL,
  booking_time TIME NOT NULL,
  collection_type VARCHAR(50) NOT NULL,
  address TEXT,
  status VARCHAR(20) NOT NULL DEFAULT 'scheduled',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  CONSTRAINT valid_status CHECK (status IN ('scheduled', 'completed', 'cancelled')),
  CONSTRAINT valid_collection_type CHECK (collection_type IN ('home', 'lab'))
);

-- Create indexes for test bookings
CREATE INDEX IF NOT EXISTS idx_test_bookings_user ON test_bookings(user_id);
CREATE INDEX IF NOT EXISTS idx_test_bookings_test ON test_bookings(test_id);
CREATE INDEX IF NOT EXISTS idx_test_bookings_date ON test_bookings(booking_date);
CREATE INDEX IF NOT EXISTS idx_test_bookings_status ON test_bookings(status);
