export interface Appointment {
  id: string;
  patientName: string;
  date: string;
  time: string;
  reason: string;
  status: "pending" | "confirmed" | "completed" | "cancelled";
}

const APPOINTMENTS_STORAGE_KEY = 'dietec_appointments';

const DEFAULT_APPOINTMENTS: Appointment[] = [
  {
    id: "1",
    patientName: "John Doe",
    date: "2026-01-05",
    time: "10:00",
    reason: "Regular checkup",
    status: "confirmed"
  },
  {
    id: "2",
    patientName: "Jane Smith",
    date: "2026-01-05",
    time: "11:30",
    reason: "Follow-up consultation",
    status: "pending"
  },
  {
    id: "3",
    patientName: "Mike Johnson",
    date: "2026-01-06",
    time: "14:00",
    reason: "Blood pressure check",
    status: "confirmed"
  }
];

class AppointmentService {
  getAppointments(): Appointment[] {
    try {
      const stored = localStorage.getItem(APPOINTMENTS_STORAGE_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (error) {
      console.error('Error loading appointments:', error);
    }
    
    this.saveAppointments(DEFAULT_APPOINTMENTS);
    return DEFAULT_APPOINTMENTS;
  }

  saveAppointments(appointments: Appointment[]): void {
    try {
      localStorage.setItem(APPOINTMENTS_STORAGE_KEY, JSON.stringify(appointments));
    } catch (error) {
      console.error('Error saving appointments:', error);
    }
  }

  addAppointment(appointment: Omit<Appointment, 'id'>): Appointment {
    const appointments = this.getAppointments();
    const maxId = appointments.reduce((max, a) => {
      const num = parseInt(a.id);
      return num > max ? num : max;
    }, 0);
    
    const newAppointment: Appointment = {
      ...appointment,
      id: String(maxId + 1)
    };
    
    appointments.push(newAppointment);
    this.saveAppointments(appointments);
    
    return newAppointment;
  }

  updateAppointmentStatus(appointmentId: string, status: "pending" | "confirmed" | "completed" | "cancelled"): void {
    const appointments = this.getAppointments();
    const updated = appointments.map(a => 
      a.id === appointmentId ? { ...a, status } : a
    );
    this.saveAppointments(updated);
  }

  deleteAppointment(appointmentId: string): void {
    const appointments = this.getAppointments();
    const filtered = appointments.filter(a => a.id !== appointmentId);
    this.saveAppointments(filtered);
  }
}

export const appointmentService = new AppointmentService();
