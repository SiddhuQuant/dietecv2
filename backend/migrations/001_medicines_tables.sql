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
  rating DECIMAL(2, 1) DEFAULT 0,
  category VARCHAR(100) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for faster searches
CREATE INDEX IF NOT EXISTS idx_medicines_category ON medicines(category);
CREATE INDEX IF NOT EXISTS idx_medicines_name ON medicines(name);
CREATE INDEX IF NOT EXISTS idx_medicines_in_stock ON medicines(in_stock);

-- Insert default medicines
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
('Vitamin B-Complex', 'B Vitamins', 160.00, 200.00, 'WellnessPlus', 'Complete B vitamin complex. Boosts energy and supports metabolism.', false, true, 4.5, 'Supplements')
ON CONFLICT DO NOTHING;

-- Create prescription orders table
CREATE TABLE IF NOT EXISTS prescription_orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_number VARCHAR(50) UNIQUE NOT NULL,
  user_id UUID REFERENCES auth.users(id),
  medicines TEXT[] NOT NULL,
  order_date DATE NOT NULL DEFAULT CURRENT_DATE,
  status VARCHAR(20) NOT NULL DEFAULT 'processing',
  total DECIMAL(10, 2) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  CONSTRAINT valid_status CHECK (status IN ('processing', 'ready', 'delivered'))
);

-- Create index for prescription orders
CREATE INDEX IF NOT EXISTS idx_prescription_orders_user ON prescription_orders(user_id);
CREATE INDEX IF NOT EXISTS idx_prescription_orders_status ON prescription_orders(status);
CREATE INDEX IF NOT EXISTS idx_prescription_orders_date ON prescription_orders(order_date);
