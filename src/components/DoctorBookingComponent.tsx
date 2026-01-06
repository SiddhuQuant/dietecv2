import { useState } from 'react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { LogOut, ArrowLeft, Calendar } from 'lucide-react';
import { ThemeToggle } from './ThemeToggle';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';

interface DoctorBookingComponentProps {
  isDarkMode: boolean;
  userName: string;
  onLogout: () => void;
  onToggleTheme: () => void;
  onBack: () => void;
}

const doctors = [
  { id: 1, name: 'Dr. John Smith', specialty: 'General Medicine' },
  { id: 2, name: 'Dr. Sarah Johnson', specialty: 'Pediatrics' },
  { id: 3, name: 'Dr. Mike Wilson', specialty: 'Cardiology' },
  { id: 4, name: 'Dr. Emma Brown', specialty: 'Dermatology' },
  { id: 5, name: 'Dr. James Lee', specialty: 'Neurology' }
];

const timeSlots = ['09:00', '09:30', '10:00', '10:30', '11:00', '11:30', '14:00', '14:30', '15:00', '15:30', '16:00', '16:30'];

export function DoctorBookingComponent({ 
  isDarkMode, 
  userName, 
  onLogout, 
  onToggleTheme, 
  onBack 
}: DoctorBookingComponentProps) {
  const [selectedDoctor, setSelectedDoctor] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [appointments, setAppointments] = useState([
    { id: 1, doctorName: 'Dr. John Smith', date: '2026-01-10', time: '10:00', status: 'confirmed' },
    { id: 2, doctorName: 'Dr. Sarah Johnson', date: '2026-01-12', time: '14:00', status: 'pending' }
  ]);

  const handleBook = () => {
    if (!selectedDoctor || !selectedDate || !selectedTime) return;

    const doctor = doctors.find(d => d.id.toString() === selectedDoctor);
    if (!doctor) return;

    // Check for duplicates
    const duplicate = appointments.some(
      a => a.doctorName === doctor.name && 
           a.date === selectedDate && 
           a.time === selectedTime &&
           (a.status === 'pending' || a.status === 'confirmed')
    );

    if (duplicate) {
      alert('You already have a booking for this doctor at this time!');
      return;
    }

    setAppointments([...appointments, {
      id: Date.now(),
      doctorName: doctor.name,
      date: selectedDate,
      time: selectedTime,
      status: 'pending'
    }]);

    setSelectedDoctor('');
    setSelectedDate('');
    setSelectedTime('');
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border bg-card">
        <div className="max-w-4xl mx-auto px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Button variant="ghost" size="sm" onClick={onBack}>
                <ArrowLeft className="h-4 w-4" />
              </Button>
              <Calendar className="h-5 w-5 text-teal-600" />
              <div>
                <h1 className="text-lg font-bold text-foreground">Book Doctor Appointment</h1>
                <p className="text-xs text-muted-foreground">Schedule a consultation</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <ThemeToggle isDarkMode={isDarkMode} onToggle={onToggleTheme} />
              <Button variant="outline" size="sm" onClick={onLogout}>
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-6 lg:px-8 py-6">
        <Card className="p-6">
          <div className="space-y-4">
            <div>
              <Label htmlFor="doctor">Select Doctor</Label>
              <Select value={selectedDoctor} onValueChange={setSelectedDoctor}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose a doctor" />
                </SelectTrigger>
                <SelectContent>
                  {doctors.map(doctor => (
                    <SelectItem key={doctor.id} value={doctor.id.toString()}>
                      {doctor.name} - {doctor.specialty}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="date">Appointment Date</Label>
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="w-full px-3 py-2 border border-input rounded-md"
              />
            </div>

            <div>
              <Label htmlFor="time">Time Slot</Label>
              <Select value={selectedTime} onValueChange={setSelectedTime}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose a time" />
                </SelectTrigger>
                <SelectContent>
                  {timeSlots.map(time => (
                    <SelectItem key={time} value={time}>
                      {time}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <Button 
              onClick={handleBook}
              disabled={!selectedDoctor || !selectedDate || !selectedTime}
              className="w-full"
            >
              Book Appointment
            </Button>

            <div className="mt-6 space-y-3">
              <h3 className="font-semibold">Your Appointments</h3>
              {appointments.map(appointment => (
                <div key={appointment.id} className="p-3 border border-border rounded-lg">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-medium">{appointment.doctorName}</p>
                      <p className="text-sm text-muted-foreground">
                        {appointment.date} at {appointment.time}
                      </p>
                    </div>
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      appointment.status === 'confirmed' 
                        ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-200'
                        : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-200'
                    }`}>
                      {appointment.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
