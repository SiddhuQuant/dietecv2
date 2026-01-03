import { useState, useEffect, useRef } from "react";
import { ChevronLeft, ChevronRight, Volume2, VolumeX, X, Check } from "lucide-react";

interface OnboardingGuideProps {
  isFirstTimeUser: boolean;
  onComplete: () => void;
  isDarkMode: boolean;
}

interface OnboardingStep {
  id: number;
  title: string;
  content: string;
  voiceText: string;
  icon: string;
}

// Mock UI components
const Button = ({ children, onClick, disabled, className = "", variant = "default", size = "default", title }: any) => (
  <button 
    onClick={onClick} 
    disabled={disabled}
    title={title}
    className={`px-4 py-2 rounded-lg font-medium transition-all ${
      variant === "outline" ? "border-2 border-gray-300 bg-white hover:bg-gray-50" : 
      variant === "ghost" ? "hover:bg-gray-100" :
      "bg-blue-600 text-white hover:bg-blue-700"
    } ${size === "sm" ? "px-3 py-1.5 text-sm" : ""} ${disabled ? "opacity-50 cursor-not-allowed" : ""} ${className}`}
  >
    {children}
  </button>
);

const Card = ({ children, className = "" }: any) => (
  <div className={`bg-white rounded-xl shadow-lg ${className}`}>{children}</div>
);

const Badge = ({ children, variant = "default", className = "" }: any) => (
  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
    variant === "secondary" ? "bg-gray-100 text-gray-700" : "bg-blue-100 text-blue-700"
  } ${className}`}>
    {children}
  </span>
);

export default function OnboardingGuide({ isFirstTimeUser, onComplete, isDarkMode }: OnboardingGuideProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [isVisible, setIsVisible] = useState(true);
  const [hasPlayedVoice, setHasPlayedVoice] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  
  // Ref to track the current utterance
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  const steps: OnboardingStep[] = [
    {
      id: 1,
      title: "Welcome to DIETEC!",
      content: "DIETEC is your complete digital health companion designed for rural communities. It works online and offline, making healthcare accessible everywhere.",
      voiceText: "Welcome to DIETEC! Your complete digital health companion designed for rural communities. It works online and offline, making healthcare accessible everywhere.",
      icon: "🏥"
    },
    {
      id: 2,
      title: "Voice Assistant Available",
      content: "I'm your voice assistant! Click the blue chat button at the bottom-right anytime to get help. I can explain features, guide you through the app, and answer questions in multiple languages.",
      voiceText: "I'm your voice assistant! Click the blue chat button at the bottom right anytime for help. I can explain features, guide you through the app, and answer questions in multiple languages.",
      icon: "🎙️"
    },
    {
      id: 3,
      title: "Diet & Nutrition Made Easy",
      content: "Get healthy meal plans using local ingredients like millets, dal, and vegetables. Scan your food to check nutrition, and chat with AI for personalized advice.",
      voiceText: "Get healthy meal plans using local ingredients like millets, dal, and vegetables. Scan your food to check nutrition, and chat with AI for personalized advice.",
      icon: "🥗"
    },
    {
      id: 4,
      title: "Medical Information Tracking",
      content: "Keep all your health records safe. Scan medical reports with your phone camera, or add information manually. Everything is stored securely on your device.",
      voiceText: "Keep all your health records safe. Scan medical reports with your phone camera, or add information manually. Everything is stored securely on your device.",
      icon: "📋"
    },
    {
      id: 5,
      title: "Emergency Help Always Ready",
      content: "Get step-by-step first aid instructions that work offline. Connect with local doctors, access emergency numbers like 108, and scan injuries for immediate guidance.",
      voiceText: "Get step by step first aid instructions that work offline. Connect with local doctors, access emergency numbers like 108, and scan injuries for immediate guidance.",
      icon: "🚑"
    },
    {
      id: 6,
      title: "Everything Works Offline",
      content: "Most features work without internet connection. Your health information is always available when you need it, even in areas with poor connectivity.",
      voiceText: "Most features work without internet connection. Your health information is always available when you need it, even in areas with poor connectivity.",
      icon: "📱"
    },
    {
      id: 7,
      title: "Get Started!",
      content: "You're all set! Look for the blue chat button for voice help, yellow tips in the top-left corner for quick guidance, and don't hesitate to explore. DIETEC is designed to be simple and helpful.",
      voiceText: "You're all set! Look for the blue chat button for voice help, yellow tips in the top left corner for quick guidance, and don't hesitate to explore. DIETEC is designed to be simple and helpful.",
      icon: "✅"
    }
  ];

  const currentStepData = steps[currentStep];

  // Cleanup speech on unmount
  useEffect(() => {
    return () => {
      if ('speechSynthesis' in window) {
        speechSynthesis.cancel();
      }
    };
  }, []);

  const speakStep = () => {
    if ('speechSynthesis' in window && !isMuted) {
      // Stop any current speech
      speechSynthesis.cancel();
      
      const utterance = new SpeechSynthesisUtterance(currentStepData.voiceText);
      utterance.lang = 'en-US';
      utterance.rate = 0.8;
      utterance.volume = 0.9;
      
      // Track speaking state
      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);
      
      utteranceRef.current = utterance;
      speechSynthesis.speak(utterance);
    }
  };

  const stopSpeech = () => {
    if ('speechSynthesis' in window) {
      speechSynthesis.cancel();
      setIsSpeaking(false);
    }
  };

  const toggleMute = () => {
    const newMutedState = !isMuted;
    setIsMuted(newMutedState);
    
    if (newMutedState) {
      // If muting, stop any current speech
      stopSpeech();
    } else {
      // If unmuting, optionally restart the current step
      // Uncomment the line below if you want it to auto-play when unmuting
      // speakStep();
    }
  };

  useEffect(() => {
    if (isVisible && !hasPlayedVoice && !isMuted) {
      setTimeout(() => {
        speakStep();
        setHasPlayedVoice(true);
      }, 1000);
    }
  }, [currentStep, isVisible, isMuted]);

  const nextStep = () => {
    stopSpeech(); // Stop current speech before moving
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
      setHasPlayedVoice(false);
    } else {
      completeOnboarding();
    }
  };

  const prevStep = () => {
    stopSpeech(); // Stop current speech before moving
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
      setHasPlayedVoice(false);
    }
  };

  const completeOnboarding = () => {
    stopSpeech();
    setIsVisible(false);
    onComplete();
    
    // Welcome message after onboarding
    if (!isMuted) {
      setTimeout(() => {
        if ('speechSynthesis' in window) {
          const welcome = new SpeechSynthesisUtterance("Welcome to DIETEC! I'm always here to help. Click the blue chat button anytime you need assistance.");
          welcome.lang = 'en-US';
          welcome.rate = 0.8;
          speechSynthesis.speak(welcome);
        }
      }, 1000);
    }
  };

  const skipOnboarding = () => {
    stopSpeech();
    completeOnboarding();
  };

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              <div className="text-2xl">{currentStepData.icon}</div>
              <div>
                <h2 className="font-semibold text-gray-900">{currentStepData.title}</h2>
                <Badge variant="secondary" className="text-xs mt-1">
                  Step {currentStep + 1} of {steps.length}
                </Badge>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={skipOnboarding}
              className="text-gray-500"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          {/* Progress Bar */}
          <div className="mb-6">
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
              />
            </div>
          </div>

          {/* Content */}
          <div className="mb-6">
            <p className="text-gray-700 leading-relaxed">
              {currentStepData.content}
            </p>
          </div>

          {/* Controls */}
          <div className="flex items-center justify-between">
            <div className="flex space-x-2">
              {/* FIXED: Mute/Unmute Toggle Button */}
              <Button
                variant="outline"
                size="sm"
                onClick={toggleMute}
                title={isMuted ? "Unmute voice" : "Mute voice"}
                className={`relative ${isSpeaking && !isMuted ? 'ring-2 ring-blue-400' : ''}`}
              >
                {isMuted ? (
                  <VolumeX className="h-4 w-4 text-red-500" />
                ) : (
                  <Volume2 className={`h-4 w-4 ${isSpeaking ? 'text-blue-600' : ''}`} />
                )}
                {isSpeaking && !isMuted && (
                  <span className="absolute -top-1 -right-1 w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                )}
              </Button>
              
              {/* Play/Stop Button (separate from mute) */}
              {!isMuted && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={isSpeaking ? stopSpeech : speakStep}
                  title={isSpeaking ? "Stop reading" : "Read aloud"}
                >
                  {isSpeaking ? "Stop" : "Play"}
                </Button>
              )}
              
              <Button
                variant="outline"
                size="sm"
                onClick={skipOnboarding}
              >
                Skip Guide
              </Button>
            </div>

            <div className="flex space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={prevStep}
                disabled={currentStep === 0}
              >
                <ChevronLeft className="h-4 w-4 mr-1" />
                Back
              </Button>
              <Button
                onClick={nextStep}
                size="sm"
                className="bg-blue-600 hover:bg-blue-700"
              >
                {currentStep === steps.length - 1 ? (
                  <>
                    <Check className="h-4 w-4 mr-1" />
                    Get Started
                  </>
                ) : (
                  <>
                    Next
                    <ChevronRight className="h-4 w-4 ml-1" />
                  </>
                )}
              </Button>
            </div>
          </div>

          {/* Step Indicators */}
          <div className="flex justify-center space-x-1 mt-4">
            {steps.map((_, index) => (
              <button
                key={index}
                onClick={() => {
                  stopSpeech();
                  setCurrentStep(index);
                  setHasPlayedVoice(false);
                }}
                className={`w-2 h-2 rounded-full transition-colors ${
                  index === currentStep 
                    ? 'bg-blue-600' 
                    : index < currentStep 
                      ? 'bg-green-500' 
                      : 'bg-gray-300'
                }`}
              />
            ))}
          </div>
        </div>
      </Card>
    </div>
  );
}