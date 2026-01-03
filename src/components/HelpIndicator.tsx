import { useState, useEffect } from "react";
import { HelpCircle, Volume2, ChevronUp, ChevronDown } from "lucide-react";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Badge } from "./ui/badge";

interface HelpIndicatorProps {
  currentSection: string;
  isLoggedIn: boolean;
  userName?: string;
}

interface TipContent {
  section: string;
  tips: string[];
  voiceText: string;
}

export function HelpIndicator({ currentSection, isLoggedIn, userName }: HelpIndicatorProps) {
  const [isVisible, setIsVisible] = useState(true);
  const [currentTipIndex, setCurrentTipIndex] = useState(0);
  const [isExpanded, setIsExpanded] = useState(false);

  const helpContent: TipContent[] = [
    {
      section: "home",
      tips: [
        "💡 Click any card to explore that feature",
        "📱 All features work offline for emergencies", 
        "🔍 Use the search or voice assistant for quick help",
        "⚡ Red emergency button calls 108 immediately"
      ],
      voiceText: "Welcome home! You can click any card to explore features. All features work offline. Use the voice assistant for help. Red emergency button calls 108."
    },
    {
      section: "login",
      tips: [
        "✅ New user? Click 'Sign Up' tab to create account",
        "🔑 Returning user? Use 'Login' tab with your email",
        "📧 Make sure to use a valid email address",
        "🆘 Forgot password? Click the 'Forgot Password' link"
      ],
      voiceText: "To get started: New users click Sign Up tab, returning users use Login tab. Use valid email address. Click Forgot Password if needed."
    },
    {
      section: "diet",
      tips: [
        "🔍 Toggle between Local AI and Google Lens for food scanning",
        "🌐 Google Lens mode provides enhanced food recognition (needs internet)",
        "💬 Chat with AI for personalized nutrition advice",
        "🥗 Browse healthy meals with local ingredients like millets and dal"
      ],
      voiceText: "Diet section now includes Google Lens integration for advanced food recognition. Toggle between Local AI and Google Lens modes. Scan food for detailed nutrition info or chat with AI assistant for meal planning."
    },
    {
      section: "medical",
      tips: [
        "📋 Keep all your health info in one place",
        "📸 Scan medical reports to add them automatically",
        "✏️ Add information manually using simple forms",
        "🚨 Emergency info is always accessible to doctors"
      ],
      voiceText: "Medical history keeps all health info organized. Scan reports or add manually. Emergency information is always accessible."
    },
    {
      section: "firstaid",
      tips: [
        "🚑 Find step-by-step emergency instructions",
        "📸 Scan injuries for immediate guidance",
        "📱 All instructions work without internet",
        "☎️ Quick access to emergency numbers like 108"
      ],
      voiceText: "First aid provides emergency instructions. Scan injuries for guidance. All instructions work offline. Quick access to emergency numbers."
    },
    {
      section: "doctor",
      tips: [
        "👨‍⚕️ Find local doctors with contact information",
        "⏰ Check doctor availability before calling",
        "📞 Direct calling to doctor numbers",
        "🆘 Emergency numbers always available"
      ],
      voiceText: "Doctor connect helps find local healthcare. Check availability, call directly, and access emergency numbers anytime."
    },
    {
      section: "exercises",
      tips: [
        "🧘‍♀️ Safe exercises designed for everyone",
        "🎥 Video demonstrations for each exercise",
        "⏱️ Start with short sessions and build up",
        "💪 Focus on consistency over intensity"
      ],
      voiceText: "Physiotherapy exercises are safe for everyone. Watch video demonstrations, start with short sessions, focus on consistency."
    },
    {
      section: "medicaladvisor",
      tips: [
        "🤖 Toggle between Local search and AI Search (Google + ChatGPT)",
        "🌐 AI Search provides real-time medical information when online",
        "🏠 Local search works offline with essential health conditions",
        "⚠️ All information is for reference only - consult healthcare providers"
      ],
      voiceText: "Medical Treatment Advisor now includes AI-powered search. Use Local mode for offline access or AI Search mode to get real-time information from Google and ChatGPT. Toggle between modes using the switch at top right. Always consult healthcare providers for medical decisions."
    }
  ];

  const getCurrentHelp = (): TipContent | null => {
    if (!isLoggedIn) {
      return helpContent.find(h => h.section === "login") || null;
    }
    return helpContent.find(h => h.section === currentSection) || helpContent.find(h => h.section === "home") || null;
  };

  const currentHelp = getCurrentHelp();

  useEffect(() => {
    setCurrentTipIndex(0);
    setIsVisible(true);
  }, [currentSection]);

  useEffect(() => {
    if (currentHelp && currentHelp.tips.length > 1) {
      const interval = setInterval(() => {
        setCurrentTipIndex(prev => (prev + 1) % currentHelp.tips.length);
      }, 4000);
      return () => clearInterval(interval);
    }
  }, [currentHelp]);

  const speakHelp = () => {
    if (currentHelp && 'speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(currentHelp.voiceText);
      utterance.lang = 'en-US';
      utterance.rate = 0.9;
      speechSynthesis.speak(utterance);
    }
  };

  if (!currentHelp || !isVisible) return null;

  return (
    <div className="fixed top-4 left-4 z-20 max-w-xs">
      <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/30 dark:to-indigo-900/30 border-blue-200 dark:border-blue-800 shadow-lg">
        <div className="p-3">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center space-x-2">
              <HelpCircle className="h-4 w-4 text-blue-600 dark:text-blue-400" />
              <span className="text-sm font-medium text-blue-800 dark:text-blue-200">Quick Tip</span>
              {currentHelp.tips.length > 1 && (
                <Badge variant="secondary" className="text-xs">
                  {currentTipIndex + 1}/{currentHelp.tips.length}
                </Badge>
              )}
            </div>
            <div className="flex space-x-1">
              <Button
                variant="ghost"
                size="sm"
                onClick={speakHelp}
                className="h-6 w-6 p-0"
                title="Read tip aloud"
              >
                <Volume2 className="h-3 w-3" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsExpanded(!isExpanded)}
                className="h-6 w-6 p-0"
              >
                {isExpanded ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsVisible(false)}
                className="h-6 w-6 p-0 text-gray-500"
              >
                ×
              </Button>
            </div>
          </div>
          
          <div className="text-sm text-blue-700 dark:text-blue-300">
            {currentHelp.tips[currentTipIndex]}
          </div>

          {isExpanded && (
            <div className="mt-3 pt-3 border-t border-blue-200 dark:border-blue-700">
              <div className="space-y-1">
                {currentHelp.tips.map((tip, index) => (
                  <div 
                    key={index}
                    className={`text-xs p-2 rounded ${
                      index === currentTipIndex 
                        ? 'bg-blue-100 dark:bg-blue-800/50 text-blue-800 dark:text-blue-200' 
                        : 'text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-800/30 cursor-pointer'
                    }`}
                    onClick={() => setCurrentTipIndex(index)}
                  >
                    {tip}
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="mt-2 pt-2 border-t border-blue-200 dark:border-blue-700">
            <div className="flex justify-between items-center">
              <span className="text-xs text-blue-600 dark:text-blue-400">
                Need more help? Use voice bot →
              </span>
              <div className="flex space-x-1">
                {currentHelp.tips.map((_, index) => (
                  <div
                    key={index}
                    className={`w-1.5 h-1.5 rounded-full ${
                      index === currentTipIndex 
                        ? 'bg-blue-600 dark:bg-blue-400' 
                        : 'bg-blue-300 dark:bg-blue-600'
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}