import { Stethoscope, Calendar, Users, LogOut, TrendingUp, Clock, CheckCircle, AlertCircle, Plus, RefreshCw } from "lucide-react";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { ThemeToggle } from "./ThemeToggle";
import { motion } from "motion/react";
import { useState, useEffect } from "react";
import { apiClient } from "../services/api";
import { appointmentService, Appointment } from "../services/appointmentService";

interface DoctorDashboardProps {
  onNavigate: (section: string) => void;
  doctorName: string;
  onLogout: () => void;
  isDarkMode: boolean;
  onToggleTheme: () => void;
}

export function DoctorDashboard({ doctorName, onLogout, isDarkMode, onToggleTheme }: DoctorDashboardProps) {
  const [appointments, setAppointments] = useState<Appointment[]>([]);

  useEffect(() => {
    loadAppointments();
  }, []);

  const loadAppointments = async () => {
    try {
      // Try to fetch from API
      const response = await apiClient.get<Appointment[]>('/bookings/doctors/my-appointments');
      if (response && Array.isArray(response)) {
        setAppointments(response);
      } else {
        // Use service data if API fails
        const serviceAppointments = appointmentService.getAppointments();
        setAppointments(serviceAppointments);
      }
    } catch (err) {
      console.log('Using service data for appointments');
      const serviceAppointments = appointmentService.getAppointments();
      setAppointments(serviceAppointments);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring" as const,
        stiffness: 100,
        damping: 12
      }
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "confirmed":
        return "bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300";
      case "pending":
        return "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300";
      case "completed":
        return "bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300";
      case "cancelled":
        return "bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300";
      default:
        return "bg-gray-100 dark:bg-gray-900/30 text-gray-800 dark:text-gray-300";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "confirmed":
        return <CheckCircle className="w-4 h-4" />;
      case "pending":
        return <AlertCircle className="w-4 h-4" />;
      case "completed":
        return <CheckCircle className="w-4 h-4" />;
      default:
        return <Clock className="w-4 h-4" />;
    }
  };

  return (
    <div className={`min-h-screen transition-colors duration-300 ${
      isDarkMode ? "bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900" : "bg-gradient-to-br from-blue-50 via-white to-purple-50"
    }`}>
      {/* Header */}
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className={`sticky top-0 z-50 backdrop-blur-lg border-b transition-colors ${
          isDarkMode ? "bg-slate-900/80 border-slate-700" : "bg-white/80 border-blue-100"
        }`}
      >
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-gradient-to-r from-blue-500 to-cyan-500">
              <Stethoscope className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 dark:from-blue-400 dark:to-cyan-400 bg-clip-text text-transparent">
                Doctor Portal
              </h1>
              <p className={`text-sm ${isDarkMode ? "text-slate-400" : "text-gray-600"}`}>
                Welcome, Dr. {doctorName}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <ThemeToggle isDarkMode={isDarkMode} onToggle={onToggleTheme} />
            <Button
              onClick={onLogout}
              variant="outline"
              className="flex items-center gap-2"
            >
              <LogOut className="w-4 h-4" />
              Logout
            </Button>
          </div>
        </div>
      </motion.header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8"
        >
          {/* Stats Cards */}
          <motion.div variants={itemVariants}>
            <Card className={`p-6 border-0 ${isDarkMode ? "bg-gradient-to-br from-blue-900/20 to-cyan-900/20" : "bg-gradient-to-br from-blue-50 to-cyan-50"}`}>
              <div className="flex items-center justify-between">
                <div>
                  <p className={`text-sm font-medium ${isDarkMode ? "text-blue-300" : "text-blue-600"}`}>
                    Today's Appointments
                  </p>
                  <p className="text-3xl font-bold mt-2">2</p>
                </div>
                <Calendar className={`w-8 h-8 ${isDarkMode ? "text-blue-400" : "text-blue-500"}`} />
              </div>
            </Card>
          </motion.div>

          <motion.div variants={itemVariants}>
            <Card className={`p-6 border-0 ${isDarkMode ? "bg-gradient-to-br from-green-900/20 to-emerald-900/20" : "bg-gradient-to-br from-green-50 to-emerald-50"}`}>
              <div className="flex items-center justify-between">
                <div>
                  <p className={`text-sm font-medium ${isDarkMode ? "text-green-300" : "text-green-600"}`}>
                    Total Patients
                  </p>
                  <p className="text-3xl font-bold mt-2">24</p>
                </div>
                <Users className={`w-8 h-8 ${isDarkMode ? "text-green-400" : "text-green-500"}`} />
              </div>
            </Card>
          </motion.div>

          <motion.div variants={itemVariants}>
            <Card className={`p-6 border-0 ${isDarkMode ? "bg-gradient-to-br from-purple-900/20 to-pink-900/20" : "bg-gradient-to-br from-purple-50 to-pink-50"}`}>
              <div className="flex items-center justify-between">
                <div>
                  <p className={`text-sm font-medium ${isDarkMode ? "text-purple-300" : "text-purple-600"}`}>
                    Appointments This Month
                  </p>
                  <p className="text-3xl font-bold mt-2">18</p>
                </div>
                <TrendingUp className={`w-8 h-8 ${isDarkMode ? "text-purple-400" : "text-purple-500"}`} />
              </div>
            </Card>
          </motion.div>
        </motion.div>

        {/* Appointments Section */}
        <motion.div variants={itemVariants}>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold flex items-center gap-2">
              <Calendar className="w-6 h-6" />
              Upcoming Appointments
            </h2>
            <Button className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700">
              <Plus className="w-4 h-4" />
              Add Appointment
            </Button>
          </div>

          <Card className={`border-0 ${isDarkMode ? "bg-slate-800/50" : "bg-white/50"}`}>
            <div className="p-6">
              <div className="space-y-4">
                {appointments.map((appointment, index) => (
                  <motion.div
                    key={appointment.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className={`p-4 rounded-lg border-2 ${
                      isDarkMode
                        ? "border-slate-700 bg-slate-700/30"
                        : "border-blue-100 bg-blue-50/50"
                    } hover:shadow-lg transition-shadow`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <h3 className="font-semibold text-lg">
                          {appointment.patientName}
                        </h3>
                        <p className={`text-sm ${isDarkMode ? "text-slate-400" : "text-gray-600"} mt-1`}>
                          {appointment.date} at {appointment.time}
                        </p>
                        <p className={`text-sm mt-2 ${isDarkMode ? "text-slate-300" : "text-gray-700"}`}>
                          Reason: {appointment.reason}
                        </p>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-2 ${getStatusColor(appointment.status)}`}>
                          {getStatusIcon(appointment.status)}
                          {appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}
                        </span>
                        <Button variant="outline" size="sm">
                          View Details
                        </Button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Additional Information */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8"
        >
          <motion.div variants={itemVariants}>
            <Card className={`p-6 border-0 ${isDarkMode ? "bg-slate-800/50" : "bg-white/50"}`}>
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Clock className="w-5 h-5" />
                Recent Patient Notes
              </h3>
              <div className={`space-y-3 text-sm ${isDarkMode ? "text-slate-300" : "text-gray-700"}`}>
                <p>• John Doe - BP normal, continue medication</p>
                <p>• Jane Smith - Follow-up in 2 weeks</p>
                <p>• Mike Johnson - Request blood test results</p>
              </div>
            </Card>
          </motion.div>

          <motion.div variants={itemVariants}>
            <Card className={`p-6 border-0 ${isDarkMode ? "bg-slate-800/50" : "bg-white/50"}`}>
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <AlertCircle className="w-5 h-5" />
                Pending Actions
              </h3>
              <div className={`space-y-3 text-sm ${isDarkMode ? "text-slate-300" : "text-gray-700"}`}>
                <p>• Confirm 3 pending appointments</p>
                <p>• Review 2 new patient reports</p>
                <p>• Update prescription for 1 patient</p>
              </div>
            </Card>
          </motion.div>
        </motion.div>

        {/* My Patients Section */}
        <motion.div variants={itemVariants} className="mt-8">
          <h2 className="text-2xl font-bold flex items-center gap-2 mb-6">
            <Users className="w-6 h-6" />
            My Patients
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              { name: "John Doe", age: 45, condition: "Hypertension", lastVisit: "2026-01-03" },
              { name: "Jane Smith", age: 32, condition: "Diabetes", lastVisit: "2026-01-04" },
              { name: "Mike Johnson", age: 58, condition: "Arthritis", lastVisit: "2025-12-28" },
              { name: "Sarah Williams", age: 28, condition: "Allergy", lastVisit: "2025-12-20" },
              { name: "David Brown", age: 51, condition: "Asthma", lastVisit: "2026-01-02" },
              { name: "Lisa Anderson", age: 39, condition: "Migraine", lastVisit: "2025-12-15" }
            ].map((patient, index) => (
              <Card key={index} className={`p-4 border-0 hover:shadow-lg transition-shadow cursor-pointer ${
                isDarkMode ? "bg-slate-800/50" : "bg-white/50"
              }`}>
                <div className="flex items-center gap-3 mb-3">
                  <div className="h-10 w-10 rounded-full bg-gradient-to-br from-blue-400 to-cyan-400 flex items-center justify-center text-white font-semibold">
                    {patient.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div>
                    <h4 className="font-semibold">{patient.name}</h4>
                    <p className={`text-xs ${isDarkMode ? "text-slate-400" : "text-gray-600"}`}>Age: {patient.age}</p>
                  </div>
                </div>
                <div className={`text-sm space-y-1 ${isDarkMode ? "text-slate-300" : "text-gray-700"}`}>
                  <p><strong>Condition:</strong> {patient.condition}</p>
                  <p className="text-xs">Last visit: {patient.lastVisit}</p>
                </div>
                <Button variant="outline" size="sm" className="w-full mt-3">
                  View Records
                </Button>
              </Card>
            ))}
          </div>
        </motion.div>
      </main>
    </div>
  );
}
