import { useState, useEffect, useRef } from "react";
import { Mic, MicOff, Volume2, VolumeX, MessageCircle, X, Play, Pause, RotateCcw } from "lucide-react";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Badge } from "./ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";

interface VoiceBotProps {
  currentSection: string;
  userName?: string;
  isLoggedIn: boolean;
  isDarkMode: boolean;
}

interface HelpTopic {
  id: string;
  title: string;
  content: string;
  section: string;
}

export function VoiceBot({ currentSection, userName, isLoggedIn, isDarkMode }: VoiceBotProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [currentMessage, setCurrentMessage] = useState("");
  const [selectedLanguage, setSelectedLanguage] = useState("en-US");
  const [speechRate, setSpeechRate] = useState(0.9);
  const [volume, setVolume] = useState(0.8);
  const [isMuted, setIsMuted] = useState(false);
  
  const speechSynthesis = useRef<SpeechSynthesis | null>(null);
  const speechRecognition = useRef<any>(null);
  const currentUtterance = useRef<SpeechSynthesisUtterance | null>(null);

  // Initialize speech APIs
  useEffect(() => {
    if (typeof window !== 'undefined') {
      speechSynthesis.current = window.speechSynthesis;
      
      // Initialize speech recognition if available
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRecognition) {
        speechRecognition.current = new SpeechRecognition();
        speechRecognition.current.continuous = false;
        speechRecognition.current.interimResults = false;
        speechRecognition.current.lang = selectedLanguage;
        
        speechRecognition.current.onresult = (event: any) => {
          const transcript = event.results[0][0].transcript.toLowerCase();
          handleVoiceCommand(transcript);
        };
        
        speechRecognition.current.onend = () => {
          setIsListening(false);
        };
      }
    }
  }, []);

  // Help content for different sections
  const helpTopics: HelpTopic[] = [
    // Login/Signup Help
    {
      id: "login-help",
      title: "How to Login or Sign Up",
      content: `Welcome to DIETEC! To get started, you need to create an account or login. Here's how: 

      To Sign Up: Click on the 'Sign Up' tab, then enter your full name, email address, and create a secure password. Make sure to confirm your password. Click 'Create Account' when done.

      To Login: If you already have an account, stay on the 'Login' tab, enter your email and password, then click 'Login'.

      If you forget your password, don't worry! Click 'Forgot Password' and we'll help you reset it.`,
      section: "login"
    },
    
    // App Overview
    {
      id: "app-overview",
      title: "About DIETEC App",
      content: `DIETEC is your complete digital health and nutrition platform designed especially for rural communities. Here's what you can do:

      1. Personal Doctor & Info - Manage your doctor contacts and medical information
      2. Medical History - Track your health conditions, allergies, and skin problems
      3. Medical Doubts & Q&A - Get answers to your health questions
      4. Diet & Nutrition Guide - Get healthy meal plans with local ingredients like millets and dal
      5. First Aid Help - Learn emergency care with step-by-step instructions
      6. Call Doctor - Connect with local healthcare providers
      7. Physiotherapy Exercises - Safe daily movement routines
      8. Medicine Scanner - Find medicine alternatives and compare prices

      Everything works offline too, so you can access help even without internet!`,
      section: "home"
    },

    // Diet & Nutrition Help
    {
      id: "diet-help",
      title: "How to Use Diet & Nutrition Guide",
      content: `Your complete nutrition companion with AI-powered food recognition:

      🔍 FOOD SCANNER MODES:
      1. Local AI Mode - Works offline with basic food recognition for common Indian foods
      2. Google Lens Mode - Advanced recognition powered by Google AI (requires internet)

      📱 SCANNER FEATURES:
      • Take Photo - Use camera directly for instant capture
      • From Gallery - Choose existing photos from your device
      • Google Lens Integration - Enhanced accuracy with global food database
      • Detailed Nutrition Data - Calories, protein, carbs, vitamins, and minerals
      • Health Recommendations - Personalized advice based on your food choices

      🤖 AI NUTRITION ASSISTANT:
      • Ask questions about healthy eating and get personalized advice
      • Meal planning with local ingredients like millets, dal, and vegetables  
      • Nutrition tracking and daily meal recommendations

      💡 GOOGLE LENS BENEFITS:
      • Identifies specific food varieties and brands
      • Enhanced descriptions with preparation methods
      • Links to Google search for more information
      • Higher accuracy for complex dishes and international foods

      Ask the AI assistant: "What should I eat for diabetes?" or "How to make healthy meals with limited budget?"`,
      section: "diet"
    },

    // Medical History Help
    {
      id: "medical-help",
      title: "Managing Your Medical History",
      content: `Keep track of your health information easily:

      1. Scan Reports - Take photos of your medical reports and let AI extract the information
      2. Add Manually - Enter information yourself using simple forms
      3. Track Everything - Medical conditions, allergies, skin problems, and basic info
      4. Emergency Info - Your medical information is always available for emergencies

      To add something manually: Click 'Add Manually', choose what to add (condition, allergy, or skin problem), fill the simple form, and save.

      Keep this updated so doctors can help you better!`,
      section: "medical"
    },

    // First Aid Help
    {
      id: "firstaid-help",
      title: "Using First Aid Help",
      content: `Get emergency help when you need it most:

      1. Emergency Situations - Find step-by-step instructions for common emergencies
      2. Injury Scanner - Take a photo of injuries for immediate guidance
      3. Offline Access - All first aid instructions work without internet
      4. Call Emergency - Quick access to emergency numbers like 108

      For emergencies: Stay calm, follow the step-by-step instructions, and call for professional help when needed.

      Remember: This is for first aid only. Always seek professional medical help for serious injuries.`,
      section: "firstaid"
    },

    // Doctor Connect Help
    {
      id: "doctor-help",
      title: "Connecting with Doctors",
      content: `Find and connect with healthcare providers:

      1. Local Doctors - See available doctors in your area with their contact information
      2. Emergency Numbers - Quick access to 108 (ambulance), 102 (health helpline), and other important numbers
      3. Doctor Availability - Check when doctors are available before calling
      4. Telemedicine - Many doctors now offer phone or video consultations

      To call a doctor: Find the doctor you need, check if they're available, and tap the call button to dial their number directly.

      Keep your health records ready when calling doctors!`,
      section: "doctor"
    },

    // Medical Advisor Help
    {
      id: "medicaladvisor-help",
      title: "Using Medical Treatment Advisor",
      content: `Get comprehensive treatment suggestions and global healthcare information with AI-powered search:

      🔍 SEARCH OPTIONS:
      1. Local Search - Browse our offline health database with common conditions
      2. AI Search - Get real-time information from Google and ChatGPT (requires internet)

      📊 FEATURES AVAILABLE:
      1. Treatment Options - Simple home treatments, advanced medical care, and emergency protocols
      2. Global Medicine Pricing - Compare medicine costs from India, USA, UK, and other countries
      3. Hospital Recommendations - Find hospitals worldwide with ratings, costs, and contact information
      4. Home Remedies - Safe, natural treatments using local ingredients like tulsi and ginger
      5. AI Medical Analysis - Get latest research and treatment insights from ChatGPT
      6. Google Medical Search - Access information from Mayo Clinic, WebMD, and NHS

      🎯 HOW TO USE:
      - Switch between "Local" and "AI Search" modes using the toggle
      - Type your condition or symptoms in the search bar
      - For AI Search: Wait for results from Google and ChatGPT (takes 1-2 seconds)
      - Click on any result to get detailed information
      - Use the tabs to explore treatments, medicines, hospitals, and remedies

      ⚠️ IMPORTANT: This provides information only. Always consult qualified healthcare providers for medical advice and treatment decisions!`,
      section: "medicaladvisor"
    }
  ];

  const speak = (text: string) => {
    if (!speechSynthesis.current || isMuted) return;

    // Stop any current speech
    speechSynthesis.current.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = selectedLanguage;
    utterance.rate = speechRate;
    utterance.volume = volume;

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    currentUtterance.current = utterance;
    speechSynthesis.current.speak(utterance);
  };

  const stopSpeaking = () => {
    if (speechSynthesis.current) {
      speechSynthesis.current.cancel();
      setIsSpeaking(false);
    }
  };

  const startListening = () => {
    if (speechRecognition.current) {
      setIsListening(true);
      speechRecognition.current.start();
    } else {
      setCurrentMessage("Voice recognition is not supported in your browser. You can still use the text help below!");
    }
  };

  const stopListening = () => {
    if (speechRecognition.current) {
      speechRecognition.current.stop();
    }
    setIsListening(false);
  };

  const handleVoiceCommand = (command: string) => {
    let response = "";

    if (command.includes("help") || command.includes("how")) {
      if (command.includes("login") || command.includes("sign up") || command.includes("register")) {
        response = helpTopics.find(t => t.id === "login-help")?.content || "";
      } else if (command.includes("diet") || command.includes("food") || command.includes("nutrition")) {
        response = helpTopics.find(t => t.id === "diet-help")?.content || "";
      } else if (command.includes("medical") || command.includes("history") || command.includes("health")) {
        response = helpTopics.find(t => t.id === "medical-help")?.content || "";
      } else if (command.includes("first aid") || command.includes("emergency")) {
        response = helpTopics.find(t => t.id === "firstaid-help")?.content || "";
      } else if (command.includes("doctor") || command.includes("call")) {
        response = helpTopics.find(t => t.id === "doctor-help")?.content || "";
      } else if (command.includes("treatment") || command.includes("medicine") || command.includes("hospital") || command.includes("advisor")) {
        response = helpTopics.find(t => t.id === "medicaladvisor-help")?.content || "";
      } else {
        response = helpTopics.find(t => t.id === "app-overview")?.content || "";
      }
    } else if (command.includes("what is dietec") || command.includes("about app")) {
      response = helpTopics.find(t => t.id === "app-overview")?.content || "";
    } else {
      response = `I heard "${command}". I can help you with login, diet nutrition, medical history, first aid, doctor connect, medical treatment advisor, and general app information. What would you like to know about?`;
    }

    setCurrentMessage(response);
    speak(response);
  };

  const getContextualHelp = () => {
    const contextHelp = helpTopics.find(topic => 
      topic.section === currentSection || 
      (currentSection === 'home' && topic.section === 'home') ||
      (!isLoggedIn && topic.section === 'login')
    );
    
    if (contextHelp) {
      setCurrentMessage(contextHelp.content);
      speak(contextHelp.content);
    }
  };

  const getWelcomeMessage = () => {
    let message = "";
    if (!isLoggedIn) {
      message = "Welcome to DIETEC! I'm your voice assistant. I can help you learn how to login, sign up, and use all the app features. Click the microphone to ask me questions or select a help topic below.";
    } else {
      message = `Hello ${userName}! I'm here to help you use DIETEC. You can ask me about any feature, how to navigate the app, or get help with your current section. What would you like to know?`;
    }
    return message;
  };

  const languages = [
    { code: "en-US", name: "English" },
    { code: "hi-IN", name: "हिंदी (Hindi)" },
    { code: "bn-IN", name: "বাংলা (Bengali)" },
    { code: "te-IN", name: "తెలుగు (Telugu)" },
    { code: "ta-IN", name: "தமிழ் (Tamil)" },
    { code: "mr-IN", name: "मराठी (Marathi)" },
    { code: "gu-IN", name: "ગુજરાતી (Gujarati)" },
  ];

  useEffect(() => {
    if (isOpen && !currentMessage) {
      const welcome = getWelcomeMessage();
      setCurrentMessage(welcome);
      speak(welcome);
    }
  }, [isOpen, isLoggedIn]);

  return (
    <>
      {/* Voice Bot Toggle Button */}
      <div className="fixed bottom-4 right-4 z-30">
        <Button
          onClick={() => setIsOpen(!isOpen)}
          className="w-14 h-14 rounded-full bg-blue-600 hover:bg-blue-700 shadow-lg"
          size="sm"
        >
          {isOpen ? <X className="h-6 w-6" /> : <MessageCircle className="h-6 w-6" />}
        </Button>
      </div>

      {/* Voice Bot Panel */}
      {isOpen && (
        <div className="fixed bottom-20 right-4 z-30 w-80 max-w-[calc(100vw-2rem)]">
          <Card className="bg-card shadow-2xl border-2">
            <div className="p-4">
              {/* Header */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                  <h3 className="font-semibold text-foreground">DIETEC Voice Assistant</h3>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsOpen(false)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>

              {/* Language & Settings */}
              <div className="mb-4 space-y-2">
                <Select value={selectedLanguage} onValueChange={setSelectedLanguage}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select language" />
                  </SelectTrigger>
                  <SelectContent>
                    {languages.map(lang => (
                      <SelectItem key={lang.code} value={lang.code}>
                        {lang.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Voice Controls */}
              <div className="flex space-x-2 mb-4">
                <Button
                  variant={isListening ? "destructive" : "default"}
                  size="sm"
                  onClick={isListening ? stopListening : startListening}
                  className="flex-1"
                >
                  {isListening ? <MicOff className="h-4 w-4 mr-2" /> : <Mic className="h-4 w-4 mr-2" />}
                  {isListening ? "Stop" : "Voice"}
                </Button>
                
                <Button
                  variant="outline"
                  size="sm"
                  onClick={isSpeaking ? stopSpeaking : () => speak(currentMessage)}
                  disabled={!currentMessage}
                >
                  {isSpeaking ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                </Button>
                
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsMuted(!isMuted)}
                >
                  {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
                </Button>
              </div>

              {/* Status */}
              {(isListening || isSpeaking) && (
                <div className="mb-4">
                  {isListening && (
                    <Badge variant="secondary" className="mr-2">
                      🎤 Listening...
                    </Badge>
                  )}
                  {isSpeaking && (
                    <Badge variant="secondary">
                      🔊 Speaking...
                    </Badge>
                  )}
                </div>
              )}

              {/* Current Message */}
              {currentMessage && (
                <div className="mb-4 p-3 bg-muted rounded-lg max-h-32 overflow-y-auto">
                  <p className="text-sm text-foreground whitespace-pre-line">
                    {currentMessage}
                  </p>
                </div>
              )}

              {/* Quick Help Buttons */}
              <div className="space-y-2">
                <h4 className="text-sm font-medium text-muted-foreground">Quick Help Topics:</h4>
                
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    const help = helpTopics.find(t => t.section === currentSection) || 
                                helpTopics.find(t => t.section === 'home');
                    if (help) {
                      setCurrentMessage(help.content);
                      speak(help.content);
                    }
                  }}
                  className="w-full justify-start"
                >
                  Help with current section
                </Button>

                {!isLoggedIn && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      const help = helpTopics.find(t => t.id === 'login-help');
                      if (help) {
                        setCurrentMessage(help.content);
                        speak(help.content);
                      }
                    }}
                    className="w-full justify-start"
                  >
                    How to Login/Sign Up
                  </Button>
                )}

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    const help = helpTopics.find(t => t.id === 'app-overview');
                    if (help) {
                      setCurrentMessage(help.content);
                      speak(help.content);
                    }
                  }}
                  className="w-full justify-start"
                >
                  About DIETEC App
                </Button>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    const help = helpTopics.find(t => t.id === 'diet-help');
                    if (help) {
                      setCurrentMessage(help.content);
                      speak(help.content);
                    }
                  }}
                  className="w-full justify-start"
                >
                  Diet & Nutrition Guide
                </Button>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    const help = helpTopics.find(t => t.id === 'medicaladvisor-help');
                    if (help) {
                      setCurrentMessage(help.content);
                      speak(help.content);
                    }
                  }}
                  className="w-full justify-start"
                >
                  Medical Treatment Advisor
                </Button>
              </div>

              {/* Voice Commands Help */}
              <div className="mt-4 p-2 bg-blue-50 dark:bg-blue-900/20 rounded text-xs">
                <p className="text-blue-800 dark:text-blue-200">
                  <strong>Voice Commands:</strong> "Help with login", "How to use diet guide", "About DIETEC", "Help with medical history"
                </p>
              </div>
            </div>
          </Card>
        </div>
      )}
    </>
  );
}