import { Heart, Phone, Utensils, Activity, FileText, LogOut, HelpCircle, UserCheck, Stethoscope, Droplets, TrendingUp } from "lucide-react";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { StepsTracker } from "./StepsTracker";
import { ThemeToggle } from "./ThemeToggle";
import { ProfileCompletionBanner } from "./ProfileCompletionBanner";
import { motion } from "motion/react";
import { useState, useEffect } from "react";
import { userProfileService } from "../services/userProfileService";

interface HomePageProps {
  onNavigate: (section: string) => void;
  userName: string;
  onLogout: () => void;
  isDarkMode: boolean;
  onToggleTheme: () => void;
  showProfileBanner?: boolean;
  onCompleteProfile?: () => void;
}

export function HomePage({ onNavigate, userName, onLogout, isDarkMode, onToggleTheme, onCompleteProfile }: HomePageProps) {
  const [showProfileBanner, setShowProfileBanner] = useState(false);

  // Check if profile is completed on component mount
  useEffect(() => {
    const checkProfile = async () => {
      try {
        const hasCompletedProfile = await userProfileService.hasCompletedProfile();
        setShowProfileBanner(!hasCompletedProfile);
      } catch (error) {
        console.error('Error checking profile status:', error);
        setShowProfileBanner(false);
      }
    };
    
    checkProfile();
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 12
      }
    }
  };

  const features = [
    {
      id: 'personal-doctor',
      title: 'Personal Doctor & Info',
      description: 'Manage doctors & medical information',
      icon: UserCheck,
      emoji: '👨‍⚕️',
      gradient: 'from-blue-500 to-cyan-500',
      bgColor: 'bg-blue-50 dark:bg-blue-900/20',
      iconBg: 'bg-blue-100 dark:bg-blue-900/40',
      iconColor: 'text-blue-600 dark:text-blue-400',
      borderColor: 'border-blue-200 dark:border-blue-800'
    },
    {
      id: 'medical',
      title: 'Medical History',
      description: 'Track conditions, allergies & skin problems',
      icon: FileText,
      emoji: '📋',
      gradient: 'from-teal-500 to-emerald-500',
      bgColor: 'bg-teal-50 dark:bg-teal-900/20',
      iconBg: 'bg-teal-100 dark:bg-teal-900/40',
      iconColor: 'text-teal-600 dark:text-teal-400',
      borderColor: 'border-teal-200 dark:border-teal-800'
    },
    {
      id: 'doubts',
      title: 'Medical Doubts & Q&A',
      description: 'Get answers to health questions',
      icon: HelpCircle,
      emoji: '❓',
      gradient: 'from-indigo-500 to-purple-500',
      bgColor: 'bg-indigo-50 dark:bg-indigo-900/20',
      iconBg: 'bg-indigo-100 dark:bg-indigo-900/40',
      iconColor: 'text-indigo-600 dark:text-indigo-400',
      borderColor: 'border-indigo-200 dark:border-indigo-800'
    },
    {
      id: 'diet',
      title: 'Diet & Nutrition Guide',
      description: 'Healthy meals with local ingredients',
      icon: Utensils,
      emoji: '🥗',
      gradient: 'from-green-500 to-lime-500',
      bgColor: 'bg-green-50 dark:bg-green-900/20',
      iconBg: 'bg-green-100 dark:bg-green-900/40',
      iconColor: 'text-green-600 dark:text-green-400',
      borderColor: 'border-green-200 dark:border-green-800'
    },
    {
      id: 'firstaid',
      title: 'First Aid Help',
      description: 'Emergency care instructions',
      icon: Heart,
      emoji: '🚑',
      gradient: 'from-red-500 to-pink-500',
      bgColor: 'bg-red-50 dark:bg-red-900/20',
      iconBg: 'bg-red-100 dark:bg-red-900/40',
      iconColor: 'text-red-600 dark:text-red-400',
      borderColor: 'border-red-200 dark:border-red-800',
      pulse: true
    },
    {
      id: 'doctor',
      title: 'Call Doctor',
      description: 'Connect with local healthcare',
      icon: Phone,
      emoji: '📞',
      gradient: 'from-sky-500 to-blue-500',
      bgColor: 'bg-sky-50 dark:bg-sky-900/20',
      iconBg: 'bg-sky-100 dark:bg-sky-900/40',
      iconColor: 'text-sky-600 dark:text-sky-400',
      borderColor: 'border-sky-200 dark:border-sky-800'
    },
    {
      id: 'exercises',
      title: 'Physiotherapy Exercises',
      description: 'Safe daily movement routines',
      icon: Activity,
      emoji: '🧘‍♀️',
      gradient: 'from-purple-500 to-fuchsia-500',
      bgColor: 'bg-purple-50 dark:bg-purple-900/20',
      iconBg: 'bg-purple-100 dark:bg-purple-900/40',
      iconColor: 'text-purple-600 dark:text-purple-400',
      borderColor: 'border-purple-200 dark:border-purple-800'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      {/* Decorative Background Elements */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl float-animation"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl float-animation" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl"></div>
      </div>

      <div className="relative max-w-md mx-auto p-4">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-6 pt-6"
        >
          <div className="flex items-center justify-between mb-4">
            <motion.div 
              className="flex items-center"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <div className="relative">
                <Heart className="h-10 w-10 text-teal-600 mr-2" fill="currentColor" />
                <div className="absolute inset-0 animate-ping opacity-20">
                  <Heart className="h-10 w-10 text-teal-600" fill="currentColor" />
                </div>
              </div>
              <div className="text-left">
                <h1 className="text-3xl font-extrabold bg-gradient-to-r from-teal-600 to-blue-600 bg-clip-text text-transparent">
                  DIETEC
                </h1>
                <p className="text-xs text-muted-foreground">Health Platform</p>
              </div>
            </motion.div>
            <div className="flex items-center space-x-2">
              <ThemeToggle isDarkMode={isDarkMode} onToggle={onToggleTheme} />
              <Button variant="ghost" size="sm" onClick={onLogout} className="hover:bg-red-50 dark:hover:bg-red-900/20">
                <LogOut className="h-4 w-4 text-red-600" />
              </Button>
            </div>
          </div>
          
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="bg-gradient-to-r from-teal-500 to-blue-500 text-white rounded-2xl p-4 shadow-lg mb-4"
          >
            <div className="flex items-center justify-between">
              <div className="text-left">
                <p className="text-sm opacity-90">Welcome back,</p>
                <p className="text-xl font-bold">{userName}! 👋</p>
              </div>
              <div className="text-right">
                <TrendingUp className="h-8 w-8 opacity-80 float-animation" />
              </div>
            </div>
          </motion.div>
        </motion.div>

        {/* Steps Tracker and Health Quick Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <StepsTracker userName={userName} />
        </motion.div>

        {/* Profile Completion Banner - Shows for new users */}
        {showProfileBanner && onCompleteProfile && (
          <ProfileCompletionBanner 
            onCompleteProfile={onCompleteProfile}
            userName={userName}
          />
        )}

        {/* Main Feature Cards */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="space-y-3 mt-6"
        >
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={feature.id}
                variants={itemVariants}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Card 
                  className={`p-5 bg-card border-2 ${feature.borderColor} cursor-pointer card-hover overflow-hidden relative group`}
                  onClick={() => onNavigate(feature.id)}
                >
                  {/* Background Gradient on Hover */}
                  <div className={`absolute inset-0 bg-gradient-to-r ${feature.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-300`}></div>
                  
                  <div className="flex items-center space-x-4 relative z-10">
                    <motion.div 
                      className={`${feature.iconBg} p-4 rounded-2xl ${feature.pulse ? 'pulse-glow' : ''}`}
                      whileHover={{ rotate: [0, -10, 10, -10, 0] }}
                      transition={{ duration: 0.5 }}
                    >
                      <Icon className={`h-7 w-7 ${feature.iconColor}`} />
                    </motion.div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-card-foreground mb-1">{feature.title}</h3>
                      <p className="text-sm text-muted-foreground">{feature.description}</p>
                    </div>
                    <motion.div 
                      className="text-3xl"
                      whileHover={{ scale: 1.2, rotate: 10 }}
                    >
                      {feature.emoji}
                    </motion.div>
                  </div>
                  
                  {/* Shimmer Effect on Hover */}
                  <div className="absolute inset-0 shimmer opacity-0 group-hover:opacity-100 pointer-events-none"></div>
                </Card>
              </motion.div>
            );
          })}

          {/* Medical Treatment Advisor - Special Card */}
          <motion.div
            variants={itemVariants}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Card 
              className="p-5 bg-gradient-to-br from-emerald-50 via-teal-50 to-blue-50 dark:from-emerald-900/20 dark:via-teal-900/20 dark:to-blue-900/20 border-2 border-emerald-300 dark:border-emerald-700 cursor-pointer card-hover overflow-hidden relative group shadow-lg"
              onClick={() => onNavigate('medicaladvisor')}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-emerald-400 to-blue-500 opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>
              
              <div className="flex items-center space-x-4 relative z-10">
                <motion.div 
                  className="bg-gradient-to-br from-emerald-500 to-teal-600 p-4 rounded-2xl shadow-lg"
                  whileHover={{ rotate: [0, -10, 10, -10, 0], scale: 1.1 }}
                  transition={{ duration: 0.5 }}
                >
                  <Stethoscope className="h-7 w-7 text-white" />
                </motion.div>
                <div className="flex-1">
                  <h3 className="font-semibold text-card-foreground mb-1">Medical Treatment Advisor</h3>
                  <p className="text-sm text-muted-foreground mb-2">Global treatments, medicines & hospitals</p>
                  <div className="flex flex-wrap gap-2">
                    <motion.span 
                      className="text-xs bg-emerald-500 text-white px-3 py-1 rounded-full shadow-sm"
                      whileHover={{ scale: 1.1 }}
                    >
                      ✨ NEW
                    </motion.span>
                    <motion.span 
                      className="text-xs bg-blue-500 text-white px-3 py-1 rounded-full shadow-sm"
                      whileHover={{ scale: 1.1 }}
                    >
                      🌍 Global
                    </motion.span>
                    <motion.span 
                      className="text-xs bg-purple-500 text-white px-3 py-1 rounded-full shadow-sm"
                      whileHover={{ scale: 1.1 }}
                    >
                      💡 AI-Powered
                    </motion.span>
                  </div>
                </div>
                <motion.div 
                  className="text-3xl"
                  whileHover={{ scale: 1.3, rotate: 360 }}
                  transition={{ duration: 0.6 }}
                >
                  🌍
                </motion.div>
              </div>
              
              <div className="absolute inset-0 shimmer opacity-0 group-hover:opacity-100 pointer-events-none"></div>
            </Card>
          </motion.div>
        </motion.div>

        {/* Emergency Quick Access */}
        <motion.div 
          className="mt-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <Button 
            className="w-full bg-gradient-to-r from-red-600 to-red-500 hover:from-red-700 hover:to-red-600 text-white py-6 shadow-lg hover:shadow-xl transition-all duration-300 relative overflow-hidden group"
            onClick={() => onNavigate('doctor')}
          >
            <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-20 transition-opacity"></div>
            <Phone className="h-6 w-6 mr-2 animate-pulse" />
            <span className="text-lg">🚨 Emergency Call</span>
          </Button>
        </motion.div>

        {/* Health Tips Card */}
        <motion.div 
          className="mt-6 mb-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
        >
          <Card className="p-5 bg-gradient-to-br from-yellow-50 via-orange-50 to-amber-50 dark:from-yellow-900/20 dark:via-orange-900/20 dark:to-amber-900/20 border-2 border-yellow-300 dark:border-yellow-700 shadow-md">
            <div className="flex items-start space-x-3">
              <motion.div
                animate={{ 
                  y: [0, -5, 0],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              >
                <Droplets className="h-8 w-8 text-blue-500" />
              </motion.div>
              <div className="flex-1">
                <h4 className="font-semibold text-yellow-900 dark:text-yellow-100 mb-1">Daily Health Tip 💡</h4>
                <p className="text-sm text-yellow-800 dark:text-yellow-200">
                  Remember to drink 8 glasses of water and take a 10-minute walk today!
                </p>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Quick Stats */}
        <motion.div 
          className="grid grid-cols-3 gap-3 mb-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
        >
          <Card className="p-4 text-center bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 border-blue-200 dark:border-blue-800">
            <div className="text-2xl mb-1">💧</div>
            <p className="text-xs text-muted-foreground">Water</p>
            <p className="font-semibold">6/8 cups</p>
          </Card>
          <Card className="p-4 text-center bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border-green-200 dark:border-green-800">
            <div className="text-2xl mb-1">🥗</div>
            <p className="text-xs text-muted-foreground">Meals</p>
            <p className="font-semibold">2/3 today</p>
          </Card>
          <Card className="p-4 text-center bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 border-purple-200 dark:border-purple-800">
            <div className="text-2xl mb-1">😊</div>
            <p className="text-xs text-muted-foreground">Mood</p>
            <p className="font-semibold">Good</p>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}