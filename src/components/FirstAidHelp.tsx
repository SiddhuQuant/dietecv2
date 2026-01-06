import { ArrowLeft, Heart, Thermometer, Zap, AlertTriangle, Phone, Camera, Scan, Search, ExternalLink, LogOut } from "lucide-react";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Badge } from "./ui/badge";
import { Alert, AlertDescription } from "./ui/alert";
import { ThemeToggle } from "./ThemeToggle";
import { useState } from "react";

interface FirstAidHelpProps {
  onBack: () => void;
  isDarkMode: boolean;
  onToggleTheme: () => void;
  userName?: string;
  onLogout?: () => void;
}

export function FirstAidHelp({ onBack, isDarkMode, onToggleTheme, userName = "User", onLogout = () => {} }: FirstAidHelpProps) {
  const [selectedEmergency, setSelectedEmergency] = useState<string | null>(null);
  const [showScanner, setShowScanner] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const emergencies = [
    {
      id: "chest-pain",
      title: "Chest Pain",
      icon: Heart,
      severity: "critical",
      steps: [
        "Make the person sit down and rest",
        "Loosen tight clothing around neck and chest",
        "If conscious, give 1 aspirin to chew (if not allergic)",
        "Call emergency services immediately: 108",
        "Monitor breathing and pulse",
        "If breathing stops, start CPR",
        "Stay calm and reassure the person"
      ]
    },
    {
      id: "fainting",
      title: "Fainting",
      icon: Zap,
      severity: "moderate",
      steps: [
        "Check if person is breathing and has pulse",
        "Lay them flat on their back",
        "Raise their legs 12 inches above heart level",
        "Loosen tight clothing",
        "Check for injuries from falling",
        "Turn them on their side if vomiting",
        "Call for help if they don't wake up in 1 minute"
      ]
    },
    {
      id: "burns",
      title: "Burns",
      icon: Thermometer,
      severity: "moderate",
      steps: [
        "Remove from heat source immediately",
        "Cool the burn with clean, cool water for 10-20 minutes",
        "Remove jewelry/clothing from burned area (if not stuck)",
        "Cover with clean, dry cloth",
        "Do NOT apply ice, butter, or oils",
        "Give water to drink if conscious",
        "Seek medical help for large or deep burns"
      ]
    },
    {
      id: "cuts",
      title: "Cuts & Wounds",
      icon: AlertTriangle,
      severity: "low",
      steps: [
        "Wash your hands first",
        "Apply direct pressure with clean cloth to stop bleeding",
        "Raise the injured area above heart level if possible",
        "Clean wound gently with clean water",
        "Apply antibiotic ointment if available",
        "Cover with sterile bandage",
        "Change bandage daily and keep wound clean"
      ]
    },
    {
      id: "breathing",
      title: "Breathing Problems",
      icon: Heart,
      severity: "critical",
      steps: [
        "Help person sit upright",
        "Loosen tight clothing",
        "Open windows for fresh air",
        "If they have inhaler, help them use it",
        "Stay calm and encourage slow, deep breathing",
        "Call emergency services: 108",
        "Monitor closely until help arrives"
      ]
    }
  ];

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "critical": return "bg-red-100 text-red-800 border-red-200";
      case "moderate": return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "low": return "bg-green-100 text-green-800 border-green-200";
      default: return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const handleImageCapture = () => {
    setIsAnalyzing(true);
    
    // Simulate AI analysis
    setTimeout(() => {
      const analysisResults = [
        {
          condition: "Minor Cut/Laceration",
          confidence: "85%",
          description: "Appears to be a shallow cut that may require cleaning and bandaging",
          instructions: "Clean with water, apply pressure to stop bleeding, cover with sterile bandage",
          googleSearch: "minor cut wound care first aid"
        },
        {
          condition: "Burn (1st Degree)",
          confidence: "78%", 
          description: "Redness and mild swelling visible, consistent with first-degree burn",
          instructions: "Cool with water for 10-20 minutes, do not apply ice or butter",
          googleSearch: "first degree burn treatment"
        },
        {
          condition: "Bruise/Contusion",
          confidence: "72%",
          description: "Discoloration suggests blunt force trauma to soft tissue",
          instructions: "Apply ice pack wrapped in cloth, elevate if possible",
          googleSearch: "bruise treatment first aid"
        }
      ];
      
      const randomResult = analysisResults[Math.floor(Math.random() * analysisResults.length)];
      setAnalysisResult(JSON.stringify(randomResult));
      setIsAnalyzing(false);
    }, 3000);
  };

  const openGoogleSearch = (searchTerm: string) => {
    const searchUrl = `https://www.google.com/search?q=${encodeURIComponent(searchTerm + " images treatment")}&tbm=isch`;
    window.open(searchUrl, '_blank');
  };

  if (selectedEmergency) {
    const emergency = emergencies.find(e => e.id === selectedEmergency);
    if (!emergency) return null;

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
        <div className="max-w-md mx-auto">
          <div className="flex items-center mb-6">
            <h1 className="text-xl font-semibold">{emergency.title}</h1>
          </div>

          <Alert className="mb-6 border-red-200 bg-red-50">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription className="text-red-800">
              If this is a life-threatening emergency, call 108 immediately!
            </AlertDescription>
          </Alert>

          <Card className="p-4 mb-4">
            <div className="flex items-center space-x-3 mb-4">
              <emergency.icon className="h-6 w-6 text-red-600" />
              <h2 className="font-semibold">Step-by-Step Instructions</h2>
            </div>
            
            <div className="space-y-3">
              {emergency.steps.map((step, index) => (
                <div key={index} className="flex space-x-3">
                  <div className="w-6 h-6 rounded-full bg-red-600 text-white text-sm flex items-center justify-center flex-shrink-0 mt-0.5">
                    {index + 1}
                  </div>
                  <p className="text-sm text-gray-700 flex-1">{step}</p>
                </div>
              ))}
            </div>
          </Card>

          <div className="space-y-3">
            <Button className="w-full bg-red-600 hover:bg-red-700 text-white py-3" onClick={() => window.open('tel:108')}>
              <Phone className="h-5 w-5 mr-2" />
              Call Emergency: 108
            </Button>
            
            <Button variant="outline" className="w-full py-3" onClick={() => window.open('tel:102')}>
              <Phone className="h-5 w-5 mr-2" />
              Call Health Helpline: 102
            </Button>
          </div>

          <Card className="p-4 mt-4 bg-blue-50 border-blue-200">
            <h3 className="font-semibold text-blue-800 mb-2">Remember:</h3>
            <ul className="text-sm text-blue-700 space-y-1">
              <li>• Stay calm and act quickly</li>
              <li>• Call for professional help when needed</li>
              <li>• Keep the person comfortable and warm</li>
              <li>• Do not give food or water unless instructed</li>
            </ul>
          </Card>
        </div>
        </div>
      </div>
    );
  }

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

        <Alert className="mb-6 border-red-200 bg-red-50">
          <Phone className="h-4 w-4" />
          <AlertDescription className="text-red-800">
            <strong>Emergency Numbers:</strong> Ambulance: 108 | Health Helpline: 102
          </AlertDescription>
        </Alert>

        {/* Scanner Button */}
        <Card className="p-4 mb-6 bg-blue-50 border-blue-200">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-semibold text-blue-800 mb-1">Injury Scanner</h2>
              <p className="text-sm text-blue-700">Take a photo to identify the injury</p>
            </div>
            <Button 
              onClick={() => setShowScanner(true)}
              className="bg-blue-600 hover:bg-blue-700"
            >
              <Scan className="h-4 w-4 mr-2" />
              Scan
            </Button>
          </div>
        </Card>

        <div className="space-y-4">
          <h2 className="font-semibold text-gray-800">Or Select Emergency Type</h2>
          
          {emergencies.map((emergency) => {
            const IconComponent = emergency.icon;
            return (
              <Card 
                key={emergency.id}
                className="p-4 bg-white shadow-md cursor-pointer hover:shadow-lg transition-shadow"
                onClick={() => setSelectedEmergency(emergency.id)}
              >
                <div className="flex items-center space-x-4">
                  <div className="bg-red-100 p-3 rounded-full">
                    <IconComponent className="h-6 w-6 text-red-600" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-800">{emergency.title}</h3>
                    <Badge className={`mt-1 text-xs ${getSeverityColor(emergency.severity)}`}>
                      {emergency.severity.toUpperCase()}
                    </Badge>
                  </div>
                  <div className="text-red-600">→</div>
                </div>
              </Card>
            );
          })}
        </div>

        <Card className="p-4 mt-6 bg-green-50 border-green-200">
          <h2 className="font-semibold mb-3 text-green-800">Offline Access</h2>
          <p className="text-sm text-green-700">
            ✓ These instructions work without internet connection. 
            Save this app to your home screen for quick access during emergencies.
          </p>
        </Card>

        <Card className="p-4 mt-4 bg-yellow-50 border-yellow-200">
          <h2 className="font-semibold mb-3 text-yellow-800">Important Note</h2>
          <p className="text-sm text-yellow-700">
            This app provides basic first aid guidance. Always seek professional medical help for serious injuries or when in doubt.
          </p>
        </Card>

        {/* Scanner Modal */}
        {showScanner && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-20 flex items-center justify-center p-4">
            <Card className="w-full max-w-md bg-white">
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold">Injury Scanner</h3>
                  <Button variant="ghost" size="sm" onClick={() => {
                    setShowScanner(false);
                    setAnalysisResult(null);
                    setIsAnalyzing(false);
                  }}>
                    ✕
                  </Button>
                </div>

                {!analysisResult && !isAnalyzing && (
                  <div className="space-y-4">
                    <div className="text-center">
                      <div className="w-full h-48 bg-gray-100 rounded-lg flex items-center justify-center mb-4">
                        <div className="text-gray-500">
                          <Camera className="h-12 w-12 mx-auto mb-2" />
                          <p>Position injury in camera view</p>
                          <p className="text-sm mt-1">Point camera at the affected area</p>
                        </div>
                      </div>
                      
                      <Button 
                        onClick={handleImageCapture}
                        className="w-full bg-blue-600 hover:bg-blue-700 py-3"
                      >
                        <Camera className="h-5 w-5 mr-2" />
                        Capture Image
                      </Button>
                    </div>
                    
                    <div className="bg-yellow-50 p-3 rounded text-sm text-yellow-800">
                      <AlertTriangle className="h-4 w-4 inline mr-1" />
                      AI will analyze the image and suggest possible conditions
                    </div>
                  </div>
                )}

                {isAnalyzing && (
                  <div className="text-center space-y-4">
                    <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto"></div>
                    <p className="text-sm text-gray-600">Analyzing image...</p>
                    <p className="text-xs text-gray-500">AI is identifying the condition</p>
                  </div>
                )}

                {analysisResult && (
                  <div className="space-y-4">
                    {(() => {
                      const result = JSON.parse(analysisResult);
                      return (
                        <>
                          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                            <h4 className="font-semibold text-green-800 mb-2">Analysis Complete</h4>
                            <div className="space-y-2">
                              <div>
                                <span className="text-sm font-medium">Detected: </span>
                                <span className="text-sm">{result.condition}</span>
                                <Badge variant="secondary" className="ml-2 text-xs">
                                  {result.confidence} confident
                                </Badge>
                              </div>
                              <p className="text-sm text-gray-700">{result.description}</p>
                            </div>
                          </div>

                          <Card className="p-3 bg-blue-50">
                            <h5 className="font-medium text-blue-800 mb-2">Recommended Action:</h5>
                            <p className="text-sm text-blue-700">{result.instructions}</p>
                          </Card>

                          <div className="space-y-2">
                            <Button 
                              onClick={() => openGoogleSearch(result.googleSearch)}
                              className="w-full bg-green-600 hover:bg-green-700"
                            >
                              <Search className="h-4 w-4 mr-2" />
                              View Similar Cases on Google
                              <ExternalLink className="h-3 w-3 ml-2" />
                            </Button>
                            
                            <Button 
                              variant="outline" 
                              onClick={() => setSelectedEmergency(result.condition.toLowerCase().includes('cut') ? 'cuts' : 'burns')}
                              className="w-full"
                            >
                              View Detailed Instructions
                            </Button>
                          </div>

                          <div className="bg-red-50 p-3 rounded text-sm text-red-800">
                            <AlertTriangle className="h-4 w-4 inline mr-1" />
                            If this is a serious injury, call emergency services: 108
                          </div>
                        </>
                      );
                    })()}
                  </div>
                )}
              </div>
            </Card>
          </div>
        )}
      </div>
      </div>
    </div>
  );
}