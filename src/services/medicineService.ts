export interface Medicine {
  id: string;
  name: string;
  genericName: string;
  price: number;
  originalPrice?: number;
  manufacturer: string;
  description: string;
  prescription: boolean;
  inStock: boolean;
  rating: number;
  category: string;
}

export interface PrescriptionOrder {
  id: string;
  medicines: string[];
  date: string;
  status: "processing" | "ready" | "delivered";
  total: number;
}

const MEDICINES_STORAGE_KEY = 'dietec_medicines';
const ORDERS_STORAGE_KEY = 'dietec_prescription_orders';

const DEFAULT_MEDICINES: Medicine[] = [
  {
    id: "1",
    name: "Paracetamol 500mg",
    genericName: "Acetaminophen",
    price: 25,
    originalPrice: 35,
    manufacturer: "PharmaCo",
    description: "Pain relief and fever reducer. Effective for headaches, body aches, and fever.",
    prescription: false,
    inStock: true,
    rating: 4.5,
    category: "Pain Relief"
  },
  {
    id: "2",
    name: "Amoxicillin 250mg",
    genericName: "Amoxicillin",
    price: 120,
    manufacturer: "MediLife",
    description: "Antibiotic for bacterial infections. Treats respiratory, ear, and throat infections.",
    prescription: true,
    inStock: true,
    rating: 4.7,
    category: "Antibiotics"
  },
  {
    id: "3",
    name: "Cetirizine 10mg",
    genericName: "Cetirizine",
    price: 45,
    originalPrice: 60,
    manufacturer: "AllergyFree",
    description: "Antihistamine for allergy relief. Controls sneezing, runny nose, and itching.",
    prescription: false,
    inStock: true,
    rating: 4.3,
    category: "Allergy"
  },
  {
    id: "4",
    name: "Omeprazole 20mg",
    genericName: "Omeprazole",
    price: 85,
    manufacturer: "GastroCare",
    description: "Reduces stomach acid. Treats GERD, ulcers, and acid reflux.",
    prescription: true,
    inStock: true,
    rating: 4.6,
    category: "Digestive"
  },
  {
    id: "5",
    name: "Vitamin D3 1000IU",
    genericName: "Cholecalciferol",
    price: 180,
    originalPrice: 220,
    manufacturer: "WellnessPlus",
    description: "Essential vitamin D supplement. Supports bone health and immunity.",
    prescription: false,
    inStock: true,
    rating: 4.8,
    category: "Supplements"
  },
  {
    id: "6",
    name: "Aspirin 75mg",
    genericName: "Acetylsalicylic Acid",
    price: 30,
    manufacturer: "HeartCare",
    description: "Blood thinner and pain relief. Used for heart health and pain management.",
    prescription: false,
    inStock: false,
    rating: 4.4,
    category: "Cardiovascular"
  },
  {
    id: "7",
    name: "Ibuprofen 400mg",
    genericName: "Ibuprofen",
    price: 40,
    originalPrice: 55,
    manufacturer: "PainAway",
    description: "Anti-inflammatory and pain reliever. Effective for arthritis and muscle pain.",
    prescription: false,
    inStock: true,
    rating: 4.6,
    category: "Pain Relief"
  },
  {
    id: "8",
    name: "Metformin 500mg",
    genericName: "Metformin HCl",
    price: 95,
    manufacturer: "DiabetCare",
    description: "Diabetes medication. Controls blood sugar levels in type 2 diabetes.",
    prescription: true,
    inStock: true,
    rating: 4.5,
    category: "Diabetes"
  },
  {
    id: "9",
    name: "Azithromycin 500mg",
    genericName: "Azithromycin",
    price: 150,
    manufacturer: "MediLife",
    description: "Broad-spectrum antibiotic. Treats respiratory and skin infections.",
    prescription: true,
    inStock: true,
    rating: 4.7,
    category: "Antibiotics"
  },
  {
    id: "10",
    name: "Calcium + Vitamin D",
    genericName: "Calcium Carbonate",
    price: 220,
    originalPrice: 280,
    manufacturer: "BoneStrong",
    description: "Complete bone health supplement. Combines calcium and vitamin D3.",
    prescription: false,
    inStock: true,
    rating: 4.7,
    category: "Supplements"
  },
  {
    id: "11",
    name: "Lisinopril 10mg",
    genericName: "Lisinopril",
    price: 110,
    manufacturer: "HeartCare",
    description: "Blood pressure medication. ACE inhibitor for hypertension management.",
    prescription: true,
    inStock: true,
    rating: 4.6,
    category: "Cardiovascular"
  },
  {
    id: "12",
    name: "Vitamin B-Complex",
    genericName: "B Vitamins",
    price: 160,
    originalPrice: 200,
    manufacturer: "WellnessPlus",
    description: "Complete B vitamin complex. Boosts energy and supports metabolism.",
    prescription: false,
    inStock: true,
    rating: 4.5,
    category: "Supplements"
  }
];

const DEFAULT_ORDERS: PrescriptionOrder[] = [
  {
    id: "PO-001",
    medicines: ["Amoxicillin 250mg", "Omeprazole 20mg"],
    date: "2026-01-04",
    status: "delivered",
    total: 205
  },
  {
    id: "PO-002",
    medicines: ["Metformin 500mg"],
    date: "2026-01-05",
    status: "ready",
    total: 95
  }
];

class MedicineService {
  getMedicines(): Medicine[] {
    try {
      const stored = localStorage.getItem(MEDICINES_STORAGE_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (error) {
      console.error('Error loading medicines:', error);
    }
    
    // Initialize with defaults
    this.saveMedicines(DEFAULT_MEDICINES);
    return DEFAULT_MEDICINES;
  }

  saveMedicines(medicines: Medicine[]): void {
    try {
      localStorage.setItem(MEDICINES_STORAGE_KEY, JSON.stringify(medicines));
    } catch (error) {
      console.error('Error saving medicines:', error);
    }
  }

  updateMedicineStock(medicineId: string, inStock: boolean): void {
    const medicines = this.getMedicines();
    const updated = medicines.map(m => 
      m.id === medicineId ? { ...m, inStock } : m
    );
    this.saveMedicines(updated);
  }

  addMedicine(medicine: Omit<Medicine, 'id'>): Medicine {
    const medicines = this.getMedicines();
    const maxId = medicines.reduce((max, m) => {
      const num = parseInt(m.id);
      return num > max ? num : max;
    }, 0);
    
    const newMedicine: Medicine = {
      ...medicine,
      id: String(maxId + 1)
    };
    
    medicines.push(newMedicine);
    this.saveMedicines(medicines);
    
    return newMedicine;
  }

  getPrescriptionOrders(): PrescriptionOrder[] {
    try {
      const stored = localStorage.getItem(ORDERS_STORAGE_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (error) {
      console.error('Error loading orders:', error);
    }
    
    this.saveOrders(DEFAULT_ORDERS);
    return DEFAULT_ORDERS;
  }

  saveOrders(orders: PrescriptionOrder[]): void {
    try {
      localStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify(orders));
    } catch (error) {
      console.error('Error saving orders:', error);
    }
  }

  addPrescriptionOrder(order: Omit<PrescriptionOrder, 'id'>): PrescriptionOrder {
    const orders = this.getPrescriptionOrders();
    const maxId = orders.reduce((max, o) => {
      const num = parseInt(o.id.replace('PO-', ''));
      return num > max ? num : max;
    }, 0);
    
    const newOrder: PrescriptionOrder = {
      ...order,
      id: `PO-${String(maxId + 1).padStart(3, '0')}`
    };
    
    orders.unshift(newOrder);
    this.saveOrders(orders);
    
    return newOrder;
  }

  updateOrderStatus(orderId: string, status: "processing" | "ready" | "delivered"): void {
    const orders = this.getPrescriptionOrders();
    const updated = orders.map(o => 
      o.id === orderId ? { ...o, status } : o
    );
    this.saveOrders(updated);
  }
}

export const medicineService = new MedicineService();
