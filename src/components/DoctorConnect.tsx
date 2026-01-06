import { ArrowLeft, Phone, MapPin, Clock, User, Heart, LogOut } from "lucide-react";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Badge } from "./ui/badge";
import { Alert, AlertDescription } from "./ui/alert";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { ThemeToggle } from "./ThemeToggle";
import { useState } from "react";

interface DoctorConnectProps {
  onBack: () => void;
  isDarkMode: boolean;
  onToggleTheme: () => void;
  userName?: string;
  onLogout?: () => void;
}

export function DoctorConnect({ onBack, isDarkMode, onToggleTheme, userName = "User", onLogout = () => {} }: DoctorConnectProps) {
  const [localDoctors, setLocalDoctors] = useState<{
    name: string;
    specialty: string;
    phone: string;
    location: string;
    availability: string;
    status: string;
    experience: string;
  }[]>([]);
  
  // Previously hardcoded doctors removed as per request.
  // In a real app, this would fetch from a backend or allow user entry.


  const emergencyNumbers = [
    {
      name: "Emergency Ambulance",
      number: "108",
      description: "24/7 Emergency medical services",
      type: "emergency"
    },
    {
      name: "Health Helpline",
      number: "102",
      description: "Medical advice and guidance",
      type: "helpline"
    },
    {
      name: "Women Helpline",
      number: "181",
      description: "Women's health and safety support",
      type: "helpline"
    },
    {
      name: "Mental Health Helpline",
      number: "9152987821",
      description: "Psychological support and counseling",
      type: "helpline"
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "available": return "bg-green-100 text-green-800";
      case "busy": return "bg-yellow-100 text-yellow-800";
      case "offline": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const handleCall = (number: string) => {
    window.open(`tel:${number}`);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border bg-card">
        <div className="max-w-4xl mx-auto px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 bg-teal-600 rounded-lg flex items-center justify-center">
                <Heart className="h-5 w-5 text-white" fill="white" />
              </div>
              <div>
                <h1 className="text-lg font-bold text-foreground">DIETEC</h1>
                <p className="text-xs text-muted-foreground">Health Dashboard</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <ThemeToggle isDarkMode={isDarkMode} onToggle={onToggleTheme} />
              <Button variant="outline" size="sm" onClick={onBack}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Button>
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
      <div className="max-w-md mx-auto\">

        {/* Emergency Alert */}
        <Alert className="mb-6 border-red-200 bg-red-50">
          <Heart className="h-4 w-4" />
          <AlertDescription className="text-red-800">
            <strong>Emergency?</strong> Call 108 immediately for life-threatening situations
          </AlertDescription>
        </Alert>

        {/* Quick Emergency Call */}
        <Card className="p-4 mb-6 bg-red-50 border-red-200">
          <Button 
            className="w-full bg-red-600 hover:bg-red-700 text-white py-4"
            onClick={() => handleCall('108')}
          >
            <Phone className="h-5 w-5 mr-2" />
            Emergency Call - 108
          </Button>
        </Card>

        {/* Local Doctors */}
        <div className="space-y-4">
          <h2 className="font-semibold text-gray-800">Local Doctors</h2>
          
          {localDoctors.map((doctor, index) => (
            <Card key={index} className="p-4 bg-white shadow-md">
              <div className="flex space-x-3">
                <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                  <User className="h-6 w-6 text-blue-600" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <h3 className="font-semibold text-gray-800">{doctor.name}</h3>
                    <Badge className={`text-xs ${getStatusColor(doctor.status)}`}>
                      {doctor.status}
                    </Badge>
                  </div>
                  
                  <p className="text-sm text-blue-600 mb-2">{doctor.specialty}</p>
                  
                  <div className="space-y-1 text-xs text-gray-600 mb-3">
                    <div className="flex items-center">
                      <MapPin className="h-3 w-3 mr-1" />
                      {doctor.location}
                    </div>
                    <div className="flex items-center">
                      <Clock className="h-3 w-3 mr-1" />
                      {doctor.availability}
                    </div>
                    <div className="flex items-center">
                      <User className="h-3 w-3 mr-1" />
                      {doctor.experience} experience
                    </div>
                  </div>
                  
                  <Button 
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2"
                    onClick={() => handleCall(doctor.phone)}
                    disabled={doctor.status === "offline"}
                  >
                    <Phone className="h-4 w-4 mr-2" />
                    Call {doctor.phone}
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Emergency Numbers */}
        <div className="mt-8">
          <h2 className="font-semibold text-gray-800 mb-4">Emergency & Helpline Numbers</h2>
          
          <div className="space-y-3">
            {emergencyNumbers.map((contact, index) => (
              <Card key={index} className="p-3 bg-white shadow-sm">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <h3 className="font-medium text-gray-800 text-sm">{contact.name}</h3>
                    <p className="text-xs text-gray-600">{contact.description}</p>
                  </div>
                  <Button 
                    size="sm" 
                    className={`px-4 py-2 ${
                      contact.type === 'emergency' 
                        ? 'bg-red-600 hover:bg-red-700' 
                        : 'bg-blue-600 hover:bg-blue-700'
                    } text-white`}
                    onClick={() => handleCall(contact.number)}
                  >
                    <Phone className="h-3 w-3 mr-1" />
                    {contact.number}
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Telemedicine Info */}
        <Card className="p-4 mt-6 bg-green-50 border-green-200">
          <h2 className="font-semibold mb-3 text-green-800">Telemedicine Available</h2>
          <p className="text-sm text-green-700 mb-3">
            Get medical consultation from home through video/phone calls. 
            Many doctors now offer online consultations.
          </p>
          <Button variant="outline" className="w-full border-green-300 text-green-700 hover:bg-green-100">
            Learn More About Online Consultations
          </Button>
        </Card>

        {/* Important Note */}
        <Card className="p-4 mt-4 bg-yellow-50 border-yellow-200">
          <h2 className="font-semibold mb-2 text-yellow-800">Important Notes</h2>
          <ul className="text-sm text-yellow-700 space-y-1">
            <li>• Keep your health records and medications list ready when calling</li>
            <li>• Describe symptoms clearly and calmly</li>
            <li>• Follow up with in-person visits when recommended</li>
            <li>• Save these numbers in your phone contacts</li>
          </ul>
        </Card>
      </div>
      </div>
    </div>
  );
}