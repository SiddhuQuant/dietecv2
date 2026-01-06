-- Create medicines table
CREATE TABLE IF NOT EXISTS medicines (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    generic_name VARCHAR(255) NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    original_price DECIMAL(10, 2),
    manufacturer VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    prescription BOOLEAN NOT NULL DEFAULT false,
    in_stock BOOLEAN NOT NULL DEFAULT true,
    rating DECIMAL(2, 1) CHECK (rating >= 0 AND rating <= 5),
    category VARCHAR(100) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create tests table
CREATE TABLE IF NOT EXISTS medical_tests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    category VARCHAR(100) NOT NULL,
    preparation TEXT,
    duration VARCHAR(100),
    available BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Insert medicine inventory
INSERT INTO medicines (name, generic_name, price, original_price, manufacturer, description, prescription, in_stock, rating, category) VALUES
('Paracetamol 500mg', 'Acetaminophen', 25.00, 35.00, 'PharmaCo', 'Pain relief and fever reducer. Effective for headaches, body aches, and fever.', false, true, 4.5, 'Pain Relief'),
('Amoxicillin 250mg', 'Amoxicillin', 120.00, NULL, 'MediLife', 'Antibiotic for bacterial infections. Treats respiratory, ear, and throat infections.', true, true, 4.7, 'Antibiotics'),
('Cetirizine 10mg', 'Cetirizine', 45.00, 60.00, 'AllergyFree', 'Antihistamine for allergy relief. Controls sneezing, runny nose, and itching.', false, true, 4.3, 'Allergy'),
('Omeprazole 20mg', 'Omeprazole', 85.00, NULL, 'GastroCare', 'Reduces stomach acid. Treats GERD, ulcers, and acid reflux.', true, true, 4.6, 'Digestive'),
('Vitamin D3 1000IU', 'Cholecalciferol', 180.00, 220.00, 'WellnessPlus', 'Essential vitamin D supplement. Supports bone health and immunity.', false, true, 4.8, 'Supplements'),
('Aspirin 75mg', 'Acetylsalicylic Acid', 30.00, NULL, 'HeartCare', 'Blood thinner and pain relief. Used for heart health and pain management.', false, false, 4.4, 'Cardiovascular'),
('Ibuprofen 400mg', 'Ibuprofen', 40.00, 55.00, 'PainAway', 'Anti-inflammatory and pain reliever. Effective for arthritis and muscle pain.', false, true, 4.6, 'Pain Relief'),
('Metformin 500mg', 'Metformin HCl', 95.00, NULL, 'DiabetCare', 'Diabetes medication. Controls blood sugar levels in type 2 diabetes.', true, true, 4.5, 'Diabetes'),
('Azithromycin 500mg', 'Azithromycin', 150.00, NULL, 'MediLife', 'Broad-spectrum antibiotic. Treats respiratory and skin infections.', true, true, 4.7, 'Antibiotics'),
('Calcium + Vitamin D', 'Calcium Carbonate', 220.00, 280.00, 'BoneStrong', 'Complete bone health supplement. Combines calcium and vitamin D3.', false, true, 4.7, 'Supplements'),
('Lisinopril 10mg', 'Lisinopril', 110.00, NULL, 'HeartCare', 'Blood pressure medication. ACE inhibitor for hypertension management.', true, true, 4.6, 'Cardiovascular'),
('Vitamin B-Complex', 'B Vitamins', 160.00, 200.00, 'WellnessPlus', 'Complete B vitamin complex. Boosts energy and supports metabolism.', false, true, 4.5, 'Supplements');

-- Insert medical tests
INSERT INTO medical_tests (name, description, price, category, preparation, duration, available) VALUES
('Complete Blood Count (CBC)', 'Comprehensive blood test measuring red cells, white cells, platelets, hemoglobin, and hematocrit', 500.00, 'Blood Tests', 'Fasting not required', '24 hours', true),
('Lipid Profile', 'Measures cholesterol levels including HDL, LDL, triglycerides', 800.00, 'Blood Tests', '12-hour fasting required', '24 hours', true),
('Thyroid Function Test (TFT)', 'Measures TSH, T3, T4 levels to assess thyroid function', 900.00, 'Hormone Tests', 'Fasting not required', '48 hours', true),
('Blood Glucose (Fasting)', 'Measures blood sugar levels after fasting', 300.00, 'Blood Tests', '8-12 hour fasting required', '24 hours', true),
('HbA1c Test', 'Measures average blood sugar levels over 2-3 months', 600.00, 'Blood Tests', 'Fasting not required', '24 hours', true),
('Liver Function Test (LFT)', 'Assesses liver health through enzyme levels', 700.00, 'Organ Function', 'Fasting not required', '24 hours', true),
('Kidney Function Test (KFT)', 'Measures creatinine, urea, and electrolytes', 650.00, 'Organ Function', 'Fasting not required', '24 hours', true),
('Vitamin D Test', 'Measures vitamin D levels in blood', 1200.00, 'Vitamin Tests', 'Fasting not required', '48 hours', true),
('Vitamin B12 Test', 'Measures vitamin B12 levels', 800.00, 'Vitamin Tests', 'Fasting not required', '48 hours', true),
('ECG (Electrocardiogram)', 'Records electrical activity of the heart', 400.00, 'Cardiac Tests', 'No preparation needed', 'Immediate', true),
('Chest X-Ray', 'Imaging test for lungs and heart', 600.00, 'Imaging', 'No preparation needed', '2 hours', true),
('Ultrasound Abdomen', 'Imaging test for abdominal organs', 1500.00, 'Imaging', '6-hour fasting required', '24 hours', true),
('Urine Routine', 'Basic urine analysis for infections and kidney function', 250.00, 'Urine Tests', 'Morning sample preferred', '24 hours', true),
('Stool Routine', 'Checks for infections and digestive issues', 350.00, 'Stool Tests', 'Fresh sample required', '48 hours', true),
('COVID-19 RT-PCR', 'RT-PCR test for COVID-19 detection', 800.00, 'Infectious Disease', 'No preparation needed', '24 hours', true);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_medicines_category ON medicines(category);
CREATE INDEX IF NOT EXISTS idx_medicines_in_stock ON medicines(in_stock);
CREATE INDEX IF NOT EXISTS idx_tests_category ON medical_tests(category);
CREATE INDEX IF NOT EXISTS idx_tests_available ON medical_tests(available);

-- Enable Row Level Security (RLS)
ALTER TABLE medicines ENABLE ROW LEVEL SECURITY;
ALTER TABLE medical_tests ENABLE ROW LEVEL SECURITY;

-- Create policies for medicines (public read access)
CREATE POLICY "Public can view medicines" ON medicines
    FOR SELECT USING (true);

CREATE POLICY "Authenticated users can insert medicines" ON medicines
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can update medicines" ON medicines
    FOR UPDATE USING (auth.role() = 'authenticated');

-- Create policies for medical tests (public read access)
CREATE POLICY "Public can view tests" ON medical_tests
    FOR SELECT USING (true);

CREATE POLICY "Authenticated users can insert tests" ON medical_tests
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can update tests" ON medical_tests
    FOR UPDATE USING (auth.role() = 'authenticated');
