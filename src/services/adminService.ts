export interface User {
  id: string;
  name: string;
  email: string;
  role: "patient" | "doctor" | "admin";
  joinDate: string;
  status: "active" | "inactive" | "suspended";
}

const USERS_STORAGE_KEY = 'dietec_admin_users';

const DEFAULT_USERS: User[] = [
  {
    id: "1",
    name: "John Doe",
    email: "john@example.com",
    role: "patient",
    joinDate: "2025-12-01",
    status: "active"
  },
  {
    id: "2",
    name: "Dr. Sarah Smith",
    email: "sarah@example.com",
    role: "doctor",
    joinDate: "2025-11-15",
    status: "active"
  },
  {
    id: "3",
    name: "Jane Doe",
    email: "jane@example.com",
    role: "patient",
    joinDate: "2025-12-10",
    status: "active"
  },
  {
    id: "4",
    name: "Dr. Mike Wilson",
    email: "mike@example.com",
    role: "doctor",
    joinDate: "2025-11-01",
    status: "inactive"
  }
];

class AdminService {
  getUsers(): User[] {
    try {
      const stored = localStorage.getItem(USERS_STORAGE_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (error) {
      console.error('Error loading users:', error);
    }
    
    this.saveUsers(DEFAULT_USERS);
    return DEFAULT_USERS;
  }

  saveUsers(users: User[]): void {
    try {
      localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
    } catch (error) {
      console.error('Error saving users:', error);
    }
  }

  addUser(user: Omit<User, 'id'>): User {
    const users = this.getUsers();
    const maxId = users.reduce((max, u) => {
      const num = parseInt(u.id);
      return num > max ? num : max;
    }, 0);
    
    const newUser: User = {
      ...user,
      id: String(maxId + 1)
    };
    
    users.push(newUser);
    this.saveUsers(users);
    
    return newUser;
  }

  updateUserStatus(userId: string, status: "active" | "inactive" | "suspended"): void {
    const users = this.getUsers();
    const updated = users.map(u => 
      u.id === userId ? { ...u, status } : u
    );
    this.saveUsers(updated);
  }

  deleteUser(userId: string): void {
    const users = this.getUsers();
    const filtered = users.filter(u => u.id !== userId);
    this.saveUsers(filtered);
  }

  getMetrics() {
    const users = this.getUsers();
    return {
      totalUsers: users.length,
      activeDoctors: users.filter(u => u.role === "doctor" && u.status === "active").length,
      activePatients: users.filter(u => u.role === "patient" && u.status === "active").length,
      // Mock data for now, could be calculated from actual bookings later
      totalBookings: 342
    };
  }
}

export const adminService = new AdminService();
