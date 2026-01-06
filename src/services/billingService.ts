export interface Bill {
  id: string;
  date: string;
  service: string;
  amount: number;
  status: "paid" | "pending" | "overdue";
  dueDate?: string;
  doctor?: string;
  description: string;
}

const STORAGE_KEY = 'dietec_bills';

class BillingService {
  getBills(): Bill[] {
    try {
      const bills = localStorage.getItem(STORAGE_KEY);
      if (bills) {
        return JSON.parse(bills);
      }
    } catch (error) {
      console.error('Error loading bills:', error);
    }
    
    // Return default mock bills if nothing in storage
    return [
      {
        id: "INV-001",
        date: "2026-01-03",
        service: "Doctor Consultation",
        amount: 500,
        status: "paid",
        doctor: "Dr. Sarah Smith",
        description: "General checkup and prescription"
      },
      {
        id: "INV-002",
        date: "2026-01-04",
        service: "Lab Tests - Blood Panel",
        amount: 1500,
        status: "paid",
        description: "Complete blood count, lipid profile"
      },
      {
        id: "INV-003",
        date: "2026-01-05",
        service: "Doctor Consultation",
        amount: 800,
        status: "pending",
        dueDate: "2026-01-12",
        doctor: "Dr. Mike Wilson",
        description: "Follow-up consultation"
      },
      {
        id: "INV-004",
        date: "2025-12-28",
        service: "Physiotherapy Session",
        amount: 600,
        status: "overdue",
        dueDate: "2026-01-04",
        description: "3 sessions completed"
      }
    ];
  }

  saveBills(bills: Bill[]): void {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(bills));
    } catch (error) {
      console.error('Error saving bills:', error);
    }
  }

  addBill(bill: Omit<Bill, 'id'>): Bill {
    const bills = this.getBills();
    
    // Generate new ID
    const maxId = bills.reduce((max, b) => {
      const num = parseInt(b.id.replace('INV-', ''));
      return num > max ? num : max;
    }, 0);
    
    const newBill: Bill = {
      ...bill,
      id: `INV-${String(maxId + 1).padStart(3, '0')}`
    };
    
    bills.unshift(newBill); // Add to beginning
    this.saveBills(bills);
    
    return newBill;
  }

  updateBillStatus(billId: string, status: "paid" | "pending" | "overdue"): void {
    const bills = this.getBills();
    const updatedBills = bills.map(b => 
      b.id === billId ? { ...b, status } : b
    );
    this.saveBills(updatedBills);
  }

  deleteBill(billId: string): void {
    const bills = this.getBills();
    const filteredBills = bills.filter(b => b.id !== billId);
    this.saveBills(filteredBills);
  }
}

export const billingService = new BillingService();
