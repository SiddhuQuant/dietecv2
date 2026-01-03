import { ArrowLeft, Clock, Users, DollarSign, MessageCircle, Send, Bot, User, Scan, Wifi, WifiOff, Loader2, Sparkles, X, RefreshCw, Maximize2, Minimize2 } from "lucide-react";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Badge } from "./ui/badge";
import { Input } from "./ui/input";
import { ScrollArea } from "./ui/scroll-area";
import { Alert, AlertDescription } from "./ui/alert";
import { Switch } from "./ui/switch";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { ThemeToggle } from "./ThemeToggle";
import { useState, useEffect, useRef } from "react";
import { motion } from "motion/react";
import { FoodScanner } from "./FoodScanner";
import { chatGPTService } from "./ChatGPTService";

interface DietNutritionGuideProps {
  onBack: () => void;
  isDarkMode: boolean;
  onToggleTheme: () => void;
}

interface ChatMessage {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
  isTyping?: boolean;
  source?: 'local' | 'chatgpt';
}

// Simple component to render text with basic formatting
const FormattedText = ({ text }: { text: string }) => {
  // Split by newlines
  const lines = text.split('\n');
  
  return (
    <div className="space-y-1">
      {lines.map((line, i) => {
        // Check for bullet points
        const isBullet = line.trim().startsWith('•') || line.trim().startsWith('-');
        const cleanLine = line.replace(/^[•-]\s*/, '');
        
        // Parse bold text (**text**)
        const parts = cleanLine.split(/(\*\*.*?\*\*)/g);
        
        return (
          <div key={i} className={`${isBullet ? 'pl-4 relative' : ''} ${line.trim() === '' ? 'h-2' : ''}`}>
            {isBullet && (
              <span className="absolute left-0 top-1.5 w-1.5 h-1.5 bg-current rounded-full opacity-60"></span>
            )}
            {parts.map((part, j) => {
              if (part.startsWith('**') && part.endsWith('**')) {
                return <strong key={j} className="font-bold">{part.slice(2, -2)}</strong>;
              }
              return <span key={j}>{part}</span>;
            })}
          </div>
        );
      })}
    </div>
  );
};

export function DietNutritionGuide({ onBack, isDarkMode, onToggleTheme }: DietNutritionGuideProps) {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [showFoodScanner, setShowFoodScanner] = useState(false);
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [useChatGPT, setUseChatGPT] = useState(true);
  const [isTyping, setIsTyping] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      text: 'Hello! I\'m your AI nutrition assistant. I can help you with:\n\n• Personalized dietary advice\n• Local ingredient recipes\n• Meal planning (₹150-200/day)\n• Child & maternal nutrition\n\nHow can I help you eat healthier today?',
      sender: 'bot',
      timestamp: new Date(),
      source: 'chatgpt'
    }
  ]);
  const [newMessage, setNewMessage] = useState('');
  const [waterIntake, setWaterIntake] = useState(0);

  // Monitor online status
  useEffect(() => {
    const handleOnlineStatus = () => setIsOnline(navigator.onLine);
    const handleOfflineStatus = () => setIsOnline(false);

    window.addEventListener('online', handleOnlineStatus);
    window.addEventListener('offline', handleOfflineStatus);

    return () => {
      window.removeEventListener('online', handleOnlineStatus);
      window.removeEventListener('offline', handleOfflineStatus);
    };
  }, []);

  // Auto-switch to local mode when offline
  useEffect(() => {
    if (!isOnline && useChatGPT) {
      setUseChatGPT(false);
    }
  }, [isOnline, useChatGPT]);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth', block: 'end' });
    }
  }, [chatMessages]);

  // Scroll to the end of messages when the chat opens
  useEffect(() => {
    if (isChatOpen && messagesEndRef.current) {
      setTimeout(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
      }, 100);
    }
  }, [isChatOpen]);

  const reminders = [
    "💧 Drink 8-10 glasses of water daily",
    "🚶‍♀️ Walk for 20-30 minutes after meals",
    "🥗 Include green vegetables in every meal",
    "🌅 Eat dinner 2-3 hours before sleeping",
    "🍎 Have fruits as snacks instead of fried foods"
  ];

  // Enhanced ChatGPT API integration using ChatGPTService
  const getChatGPTResponse = async (userInput: string): Promise<string> => {
    try {
      return await chatGPTService.getNutritionAdvice(userInput);
    } catch (error) {
      console.error('ChatGPT service error:', error);
      // Fallback to basic response if ChatGPT fails
      throw error;
    }
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim()) return;
    
    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      text: newMessage,
      sender: 'user',
      timestamp: new Date()
    };
    
    setChatMessages(prev => [...prev, userMessage]);
    const currentMessage = newMessage;
    setNewMessage('');
    setIsTyping(true);

    // Add typing indicator
    const typingMessage: ChatMessage = {
      id: 'typing',
      text: '',
      sender: 'bot',
      timestamp: new Date(),
      isTyping: true,
      source: useChatGPT && isOnline ? 'chatgpt' : 'local'
    };
    setChatMessages(prev => [...prev, typingMessage]);
    
    try {
      let botResponse: string;
      
      if (useChatGPT && isOnline) {
        // Use ChatGPT API
        botResponse = await getChatGPTResponse(currentMessage);
      } else {
        // Fallback to local responses
        botResponse = getBotResponse(currentMessage);
      }
      
      // Remove typing indicator and add actual response
      setChatMessages(prev => prev.filter(msg => msg.id !== 'typing'));
      
      const botMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        text: botResponse,
        sender: 'bot',
        timestamp: new Date(),
        source: useChatGPT && isOnline ? 'chatgpt' : 'local'
      };
      
      setChatMessages(prev => [...prev, botMessage]);
    } catch (error) {
      console.error('Chat error:', error);
      
      // Remove typing indicator
      setChatMessages(prev => prev.filter(msg => msg.id !== 'typing'));
      
      // Show error message with fallback
      const errorMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        text: 'Sorry, I encountered an issue. Let me help you with basic nutrition advice: ' + getBotResponse(currentMessage),
        sender: 'bot',
        timestamp: new Date(),
        source: 'local'
      };
      
      setChatMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  const getBotResponse = (userInput: string): string => {
    const input = userInput.toLowerCase();
    
    if (input.includes('millet') || input.includes('bajra')) {
      return '🌾 Millets are excellent! They\'re rich in fiber, protein, and minerals. Try millet roti with vegetables or millet khichdi. They help control blood sugar and are perfect for rural diets.';
    } else if (input.includes('dal') || input.includes('lentil')) {
      return '🫘 Dal is a great protein source! Mix different dals like moong, masoor, and chana. Add vegetables like spinach or bottle gourd to make it more nutritious and filling.';
    } else if (input.includes('diabetes') || input.includes('sugar')) {
      return '🩺 For diabetes: Focus on whole grains like millets, include fiber-rich vegetables, avoid refined sugar, eat small frequent meals, and include bitter gourd and fenugreek in your diet.';
    } else if (input.includes('weight') || input.includes('lose')) {
      return '⚖️ For weight management: Eat more vegetables, use millets instead of rice, drink water before meals, avoid fried foods, and include physical activities like farming or walking.';
    } else if (input.includes('water') || input.includes('hydration')) {
      return '💧 Drink water regularly! Start with 2 glasses in the morning, drink water 30 minutes before meals, and carry a water bottle during work. Add lemon or mint for taste.';
    } else if (input.includes('seasonal') || input.includes('vegetables')) {
      return '🥬 Eat seasonal vegetables - they\'re cheaper and more nutritious! Current season vegetables like okra, bottle gourd, and spinach are perfect. Visit local markets early morning for fresh produce.';
    } else {
      return '🤖 I can help you with nutrition advice, local ingredient recipes, meal planning for rural areas, and health tips. What specific dietary question do you have?';
    }
  };

  const handleWaterClick = (index: number) => {
    if (index < waterIntake) {
      // If clicking on a filled glass, reset to that amount
      setWaterIntake(index);
    } else {
      // Fill up to this glass
      setWaterIntake(index + 1);
    }
  };

  // Show Food Scanner if selected
  if (showFoodScanner) {
    return <FoodScanner onBack={() => setShowFoodScanner(false)} />;
  }

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <Button variant="ghost" size="sm" onClick={onBack} className="mr-2 p-2">
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <h1 className="text-xl font-semibold text-foreground">Diet & Nutrition Guide</h1>
          </div>
          <ThemeToggle isDarkMode={isDarkMode} onToggle={onToggleTheme} />
        </div>

        {/* Daily Reminders */}
        <Card className="p-4 mb-6 bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800">
          <h2 className="font-semibold mb-3 text-yellow-800 dark:text-yellow-200">Daily Health Reminders</h2>
          <div className="space-y-2">
            {reminders.map((reminder, index) => (
              <div key={index} className="text-sm text-yellow-700 dark:text-yellow-300">
                {reminder}
              </div>
            ))}
          </div>
        </Card>

        {/* Main Action Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
          {/* Food Scanner */}
          <Card className="p-4 bg-gradient-to-r from-orange-100 to-red-100 dark:from-orange-900/30 dark:to-red-900/30 border-orange-200 dark:border-orange-700">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="font-semibold mb-2 text-orange-800 dark:text-orange-200">Scan Your Food</h2>
                <p className="text-sm text-orange-700 dark:text-orange-300">
                  Use our food scanner to get instant nutrition information and health scores for any food item.
                </p>
              </div>
              <Button
                onClick={() => setShowFoodScanner(true)}
                className="bg-orange-600 hover:bg-orange-700 text-white"
              >
                <Scan className="h-4 w-4 mr-2" />
                Scan Food
              </Button>
            </div>
          </Card>

          {/* Chat with AI Assistant */}
          <Card className="p-4 bg-gradient-to-r from-green-100 to-blue-100 dark:from-green-900/30 dark:to-blue-900/30 border-green-200 dark:border-green-700">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Sparkles className="h-5 w-5 text-green-600 dark:text-green-400" />
                <h2 className="font-semibold text-green-800 dark:text-green-200">AI Nutrition Assistant</h2>
                {isOnline ? (
                  <Wifi className="h-4 w-4 text-green-600 dark:text-green-400" />
                ) : (
                  <WifiOff className="h-4 w-4 text-red-500" />
                )}
              </div>
              <Button
                onClick={() => setIsChatOpen(true)}
                className="bg-green-600 hover:bg-green-700 text-white"
              >
                <MessageCircle className="h-4 w-4 mr-2" />
                Chat Now
              </Button>
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-green-700 dark:text-green-300">
                  {useChatGPT && isOnline 
                    ? 'Powered by ChatGPT for advanced personalized nutrition advice'
                    : 'Basic nutrition assistant (works offline)'
                  }
                </p>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-xs text-green-600 dark:text-green-400">
                  {useChatGPT ? 'ChatGPT' : 'Basic'}
                </span>
                <Switch
                  checked={useChatGPT}
                  onCheckedChange={setUseChatGPT}
                  disabled={!isOnline}
                />
              </div>
            </div>

            {/* Quick Questions for ChatGPT */}
            {useChatGPT && isOnline && (
              <div className="space-y-2">
                <p className="text-xs font-medium text-blue-700 dark:text-blue-300">💡 Try asking ChatGPT:</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {[
                    "Create a weekly meal plan for ₹200",
                    "Help manage diabetes with local foods",  
                    "Nutrition for 2-year-old weight gain",
                    "Kitchen garden plan for small space"
                  ].map((question, index) => (
                    <Button
                      key={index}
                      variant="outline"
                      size="sm"
                      className="h-auto p-2 text-xs text-left justify-start bg-blue-50 dark:bg-blue-900/50 border-blue-200 dark:border-blue-700 text-blue-700 dark:text-blue-300 hover:bg-blue-100 dark:hover:bg-blue-900/70"
                      onClick={() => {
                        setNewMessage(question);
                        setIsChatOpen(true);
                      }}
                    >
                      "{question}"
                    </Button>
                  ))}
                </div>
              </div>
            )}

            {!isOnline && (
              <Alert className="border-yellow-200 bg-yellow-50 dark:border-yellow-800 dark:bg-yellow-900/20">
                <AlertDescription className="text-yellow-800 dark:text-yellow-200 text-xs">
                  You're offline. Using basic nutrition assistant. Connect to internet for ChatGPT-powered advice.
                </AlertDescription>
              </Alert>
            )}
          </div>
          </Card>
        </div>

        {/* Weekly Tips and Water Tracker */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
          {/* Weekly Tips */}
          <Card className="p-4 bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800">
            <h2 className="font-semibold mb-3 text-blue-800 dark:text-blue-200">This Week's Tip</h2>
            <p className="text-sm text-blue-700 dark:text-blue-300">
              <strong>Local Market Day:</strong> Visit your local market early morning for fresh vegetables. 
              Seasonal vegetables are not only cheaper but also more nutritious and suited to your body's needs.
            </p>
          </Card>

          {/* Water Intake Tracker */}
          <Card className="p-4 bg-cyan-50 dark:bg-cyan-900/20 border-cyan-200 dark:border-cyan-800">
            <h2 className="font-semibold mb-3 text-cyan-800 dark:text-cyan-200">Water Intake Today</h2>
            <div className="flex items-center space-x-2">
              <div className="flex space-x-1">
                {[...Array(8)].map((_, i) => (
                  <div 
                    key={i} 
                    className={`w-6 h-6 rounded-full border cursor-pointer transition-colors ${
                      i < waterIntake
                        ? 'bg-cyan-500 border-cyan-600 dark:bg-cyan-400 dark:border-cyan-500'
                        : 'bg-cyan-200 border-cyan-300 dark:bg-cyan-700 dark:border-cyan-600 hover:bg-cyan-300 dark:hover:bg-cyan-600'
                    }`}
                    onClick={() => handleWaterClick(i)}
                  ></div>
                ))}
              </div>
              <span className="text-sm text-cyan-700 dark:text-cyan-300">{waterIntake}/8 glasses</span>
            </div>
            <p className="text-xs text-cyan-600 dark:text-cyan-400 mt-2">Tap each circle when you drink a glass of water</p>
          </Card>
        </div>

        {/* Chat Button */}
        <Button
          onClick={() => setIsChatOpen(true)}
          className="fixed bottom-6 right-6 w-14 h-14 rounded-full bg-green-600 hover:bg-green-700 shadow-lg z-10"
        >
          <MessageCircle className="h-6 w-6 text-white" />
        </Button>

        {/* Chat Interface */}
        {isChatOpen && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="w-full max-w-3xl h-[85vh] max-h-[800px] flex flex-col shadow-2xl rounded-xl overflow-hidden"
            >
              <Card className="flex-1 flex flex-col h-full border-0 rounded-none">
                {/* Chat Header */}
                <div className="flex items-center justify-between p-4 border-b bg-muted/30">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                      {useChatGPT && isOnline ? (
                        <Sparkles className="h-5 w-5 text-green-600" />
                      ) : (
                        <Bot className="h-5 w-5 text-green-600" />
                      )}
                    </div>
                    <div>
                      <h3 className="font-semibold text-base">
                        {useChatGPT && isOnline ? 'AI Nutrition Assistant' : 'Basic Assistant'}
                      </h3>
                      <div className="flex items-center space-x-2">
                        <div className="flex items-center space-x-1">
                          {isOnline ? (
                            <Wifi className="h-3 w-3 text-green-500" />
                          ) : (
                            <WifiOff className="h-3 w-3 text-red-500" />
                          )}
                          <span className="text-xs text-muted-foreground">
                            {isOnline ? 'Online' : 'Offline'}
                          </span>
                        </div>
                        <Badge variant="outline" className="text-[10px] px-1 py-0 h-4">
                          {useChatGPT && isOnline ? 'Advanced' : 'Basic'}
                        </Badge>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    {isOnline && (
                      <div className="flex items-center space-x-2 bg-muted px-2 py-1 rounded-full mr-2">
                        <span className="text-xs font-medium">AI Mode</span>
                        <Switch
                          checked={useChatGPT}
                          onCheckedChange={setUseChatGPT}
                          className="scale-75"
                        />
                      </div>
                    )}
                    <Button 
                      variant="ghost" 
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => {
                        setChatMessages([{
                          id: '1',
                          text: useChatGPT && isOnline 
                            ? 'Hello! I\'m your AI nutrition assistant. I can help you with:\n\n• Personalized dietary advice\n• Local ingredient recipes\n• Meal planning (₹150-200/day)\n• Child & maternal nutrition\n\nHow can I help you eat healthier today?'
                            : 'Hello! I\'m your nutrition assistant. Ask me about healthy meals, local ingredients, or dietary advice for rural areas.',
                          sender: 'bot',
                          timestamp: new Date(),
                          source: useChatGPT && isOnline ? 'chatgpt' : 'local'
                        }]);
                        if (useChatGPT) {
                          chatGPTService.clearHistory();
                        }
                      }}
                      title="Clear conversation"
                    >
                      <RefreshCw className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setIsChatOpen(false)}>
                      <X className="h-5 w-5" />
                    </Button>
                  </div>
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-4 bg-slate-50 dark:bg-slate-900/50">
                  {/* API Info Banner - Show when ChatGPT is enabled */}
                  {useChatGPT && isOnline && !chatGPTService.isConfigured() && (
                    <Alert className="mb-4 bg-blue-50 dark:bg-blue-950/30 border-blue-200 dark:border-blue-800">
                      <Sparkles className="h-4 w-4 text-blue-600" />
                      <AlertDescription className="text-sm">
                        <div className="space-y-2">
                          <p className="font-medium text-blue-900 dark:text-blue-100">
                            ℹ️ Using Smart Fallback Mode
                          </p>
                          <p className="text-blue-700 dark:text-blue-300 text-xs">
                            You're getting intelligent nutrition responses tailored for rural India. 
                            For even more personalized advice with ChatGPT, add your OpenAI API key in the console:
                            <code className="block mt-1 p-2 bg-blue-100 dark:bg-blue-900/50 rounded text-xs">
                              chatGPTService.setApiKey('your-api-key-here')
                            </code>
                          </p>
                        </div>
                      </AlertDescription>
                    </Alert>
                  )}
                  
                  <div className="space-y-6">
                    {chatMessages.map((message) => (
                      <div
                        key={message.id}
                        className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                      >
                        <div className={`flex items-start space-x-2 max-w-[85%] md:max-w-[75%] ${message.sender === 'user' ? 'flex-row-reverse space-x-reverse' : ''}`}>
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 shadow-sm ${
                            message.sender === 'user' 
                              ? 'bg-green-600' 
                              : message.source === 'chatgpt' 
                                ? 'bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300' 
                                : 'bg-green-100 dark:bg-green-900 text-green-600 dark:text-green-300'
                          }`}>
                            {message.isTyping ? (
                              <Loader2 className="h-4 w-4 animate-spin" />
                            ) : message.sender === 'user' ? (
                              <User className="h-4 w-4 text-white" />
                            ) : message.source === 'chatgpt' ? (
                              <Sparkles className="h-4 w-4" />
                            ) : (
                              <Bot className="h-4 w-4" />
                            )}
                          </div>
                          
                          <div className="flex flex-col space-y-1">
                            <div
                              className={`p-3.5 rounded-2xl shadow-sm text-sm ${
                                message.sender === 'user'
                                  ? 'bg-green-600 text-white rounded-tr-none'
                                  : 'bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 text-foreground rounded-tl-none'
                              }`}
                            >
                              {message.isTyping ? (
                                <div className="flex items-center space-x-1 h-5">
                                  <div className="w-1.5 h-1.5 bg-current rounded-full animate-bounce"></div>
                                  <div className="w-1.5 h-1.5 bg-current rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                                  <div className="w-1.5 h-1.5 bg-current rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                                </div>
                              ) : (
                                <div>
                                  <FormattedText text={message.text} />
                                  {message.source === 'chatgpt' && (
                                    <div className="flex items-center space-x-1 mt-2 pt-2 border-t border-black/5 dark:border-white/5 opacity-70">
                                      <Sparkles className="h-3 w-3" />
                                      <span className="text-[10px] font-medium uppercase tracking-wider">AI Generated</span>
                                    </div>
                                  )}
                                </div>
                              )}
                            </div>
                            <span className={`text-[10px] text-muted-foreground ${message.sender === 'user' ? 'text-right' : 'text-left'} px-1`}>
                              {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                    <div ref={messagesEndRef} />
                  </div>
                </div>

                {/* Message Input */}
                <div className="p-4 bg-background border-t">
                  <div className="relative flex items-end space-x-2">
                    <Input
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      placeholder={useChatGPT ? "Ask detailed questions about diet..." : "Ask simple questions..."}
                      onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                      className="flex-1 pr-10 py-6"
                      disabled={isTyping}
                    />
                    <Button 
                      onClick={handleSendMessage} 
                      size="icon" 
                      className="h-12 w-12 rounded-xl bg-green-600 hover:bg-green-700 shrink-0 shadow-md transition-all hover:scale-105 active:scale-95"
                      disabled={isTyping || !newMessage.trim()}
                    >
                      <Send className="h-5 w-5" />
                    </Button>
                  </div>
                  <div className="mt-2 flex items-center justify-between">
                    <p className="text-[10px] text-muted-foreground">
                      {useChatGPT && isOnline 
                        ? '✨ AI can make mistakes. Verify important medical advice.'
                        : '📡 Basic offline mode active.'
                      }
                    </p>
                    {isTyping && (
                      <span className="text-[10px] text-green-600 flex items-center font-medium animate-pulse">
                        Generating response...
                      </span>
                    )}
                  </div>
                </div>
              </Card>
            </motion.div>
          </div>
        )}
      </div>
    </div>
  );
}