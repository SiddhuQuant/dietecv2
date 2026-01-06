export interface MedicalTest {
  id: number;
  name: string;
  description: string;
  price: number;
  category: string;
  preparation?: string;
  duration?: string;
  available: boolean;
}

export interface TestBooking {
  id: number;
  testId: number;
  testName: string;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  date: string;
  price: number;
}

class MedicalTestService {
  private readonly TESTS_KEY = 'medical_tests';
  private readonly BOOKINGS_KEY = 'test_bookings';

  // Get all available medical tests
  getTests(): MedicalTest[] {
    const stored = localStorage.getItem(this.TESTS_KEY);
    if (stored) {
      return JSON.parse(stored);
    }

    // Default tests data
    const defaultTests: MedicalTest[] = [
      {
        id: 1,
        name: "Complete Blood Count (CBC)",
        description: "Comprehensive blood test measuring red cells, white cells, platelets, hemoglobin, and hematocrit",
        price: 500,
        category: "Blood Tests",
        preparation: "Fasting not required",
        duration: "24 hours",
        available: true
      },
      {
        id: 2,
        name: "Lipid Profile",
        description: "Measures cholesterol levels including HDL, LDL, triglycerides",
        price: 800,
        category: "Blood Tests",
        preparation: "12-hour fasting required",
        duration: "24 hours",
        available: true
      },
      {
        id: 3,
        name: "Thyroid Function Test (TFT)",
        description: "Measures TSH, T3, T4 levels to assess thyroid function",
        price: 900,
        category: "Hormone Tests",
        preparation: "Fasting not required",
        duration: "48 hours",
        available: true
      },
      {
        id: 4,
        name: "Blood Glucose (Fasting)",
        description: "Measures blood sugar levels after fasting",
        price: 300,
        category: "Blood Tests",
        preparation: "8-12 hour fasting required",
        duration: "24 hours",
        available: true
      },
      {
        id: 5,
        name: "HbA1c Test",
        description: "Measures average blood sugar levels over 2-3 months",
        price: 600,
        category: "Blood Tests",
        preparation: "Fasting not required",
        duration: "24 hours",
        available: true
      },
      {
        id: 6,
        name: "Liver Function Test (LFT)",
        description: "Assesses liver health through enzyme levels",
        price: 700,
        category: "Organ Function",
        preparation: "Fasting not required",
        duration: "24 hours",
        available: true
      },
      {
        id: 7,
        name: "Kidney Function Test (KFT)",
        description: "Measures creatinine, urea, and electrolytes",
        price: 650,
        category: "Organ Function",
        preparation: "Fasting not required",
        duration: "24 hours",
        available: true
      },
      {
        id: 8,
        name: "Vitamin D Test",
        description: "Measures vitamin D levels in blood",
        price: 1200,
        category: "Vitamin Tests",
        preparation: "Fasting not required",
        duration: "48 hours",
        available: true
      },
      {
        id: 9,
        name: "Vitamin B12 Test",
        description: "Measures vitamin B12 levels",
        price: 800,
        category: "Vitamin Tests",
        preparation: "Fasting not required",
        duration: "48 hours",
        available: true
      },
      {
        id: 10,
        name: "ECG (Electrocardiogram)",
        description: "Records electrical activity of the heart",
        price: 400,
        category: "Cardiac Tests",
        preparation: "No preparation needed",
        duration: "Immediate",
        available: true
      },
      {
        id: 11,
        name: "Chest X-Ray",
        description: "Imaging test for lungs and heart",
        price: 600,
        category: "Imaging",
        preparation: "No preparation needed",
        duration: "2 hours",
        available: true
      },
      {
        id: 12,
        name: "Ultrasound Abdomen",
        description: "Imaging test for abdominal organs",
        price: 1500,
        category: "Imaging",
        preparation: "6-hour fasting required",
        duration: "24 hours",
        available: true
      },
      {
        id: 13,
        name: "Urine Routine",
        description: "Basic urine analysis for infections and kidney function",
        price: 250,
        category: "Urine Tests",
        preparation: "Morning sample preferred",
        duration: "24 hours",
        available: true
      },
      {
        id: 14,
        name: "Stool Routine",
        description: "Checks for infections and digestive issues",
        price: 350,
        category: "Stool Tests",
        preparation: "Fresh sample required",
        duration: "48 hours",
        available: true
      },
      {
        id: 15,
        name: "COVID-19 RT-PCR",
        description: "RT-PCR test for COVID-19 detection",
        price: 800,
        category: "Infectious Disease",
        preparation: "No preparation needed",
        duration: "24 hours",
        available: true
      }
    ];

    localStorage.setItem(this.TESTS_KEY, JSON.stringify(defaultTests));
    return defaultTests;
  }

  // Get test bookings
  getBookings(): TestBooking[] {
    const stored = localStorage.getItem(this.BOOKINGS_KEY);
    return stored ? JSON.parse(stored) : [];
  }

  // Add a new test booking
  addBooking(testId: number, testName: string, price: number, date: string): TestBooking {
    const bookings = this.getBookings();
    const newBooking: TestBooking = {
      id: Date.now(),
      testId,
      testName,
      status: 'pending',
      date,
      price
    };
    bookings.push(newBooking);
    localStorage.setItem(this.BOOKINGS_KEY, JSON.stringify(bookings));
    return newBooking;
  }

  // Update booking status
  updateBookingStatus(bookingId: number, status: TestBooking['status']): void {
    const bookings = this.getBookings();
    const index = bookings.findIndex(b => b.id === bookingId);
    if (index !== -1) {
      bookings[index].status = status;
      localStorage.setItem(this.BOOKINGS_KEY, JSON.stringify(bookings));
    }
  }

  // Cancel booking
  cancelBooking(bookingId: number): void {
    this.updateBookingStatus(bookingId, 'cancelled');
  }

  // Delete booking
  deleteBooking(bookingId: number): void {
    const bookings = this.getBookings();
    const filtered = bookings.filter(b => b.id !== bookingId);
    localStorage.setItem(this.BOOKINGS_KEY, JSON.stringify(filtered));
  }

  // Get active bookings count (pending + confirmed)
  getActiveBookingsCount(): number {
    const bookings = this.getBookings();
    return bookings.filter(b => b.status === 'pending' || b.status === 'confirmed').length;
  }

  // Get test by ID
  getTestById(testId: number): MedicalTest | undefined {
    const tests = this.getTests();
    return tests.find(t => t.id === testId);
  }
}

export const medicalTestService = new MedicalTestService();
