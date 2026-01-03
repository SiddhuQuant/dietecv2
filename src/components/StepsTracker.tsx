import { useState, useEffect } from "react";
import { Footprints, Target, Zap, TrendingUp, Award, Flame } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface StepsTrackerProps {
  userName: string;
}

interface StepsData {
  currentSteps: number;
  targetSteps: number;
  caloriesBurned: number;
  dietTarget: string;
}

// Mock Card and Progress components
const Card = ({ children, className }: { children: React.ReactNode; className?: string }) => (
  <div className={className}>{children}</div>
);

const Progress = ({ value, className }: { value: number; className?: string }) => (
  <div className={`relative h-2 w-full overflow-hidden rounded-full bg-gray-200 ${className}`}>
    <div
      className="h-full bg-gradient-to-r from-teal-500 to-emerald-500 transition-all duration-300"
      style={{ width: `${value}%` }}
    />
  </div>
);

export function StepsTracker({ userName }: StepsTrackerProps) {
  const [stepsData, setStepsData] = useState<StepsData>({
    currentSteps: 2455,
    targetSteps: 8000,
    caloriesBurned: 98,
    dietTarget: "Weight Loss"
  });

  // Simulate step counting
  useEffect(() => {
    const interval = setInterval(() => {
      setStepsData(prev => {
        const newSteps = Math.min(prev.currentSteps + Math.floor(Math.random() * 50), prev.targetSteps + 2000);
        const caloriesPerStep = 0.04;
        const newCalories = Math.round(newSteps * caloriesPerStep);
        
        return {
          ...prev,
          currentSteps: newSteps,
          caloriesBurned: newCalories
        };
      });
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const progressPercentage = Math.min((stepsData.currentSteps / stepsData.targetSteps) * 100, 100);
  const isTargetReached = stepsData.currentSteps >= stepsData.targetSteps;

  const getMotivationalMessage = () => {
    const percentage = progressPercentage;
    if (percentage >= 100) return "🎉 Goal achieved! Keep going!";
    if (percentage >= 75) return "💪 Almost there! You got this!";
    if (percentage >= 50) return "🚶‍♀️ Halfway there! Keep walking!";
    if (percentage >= 25) return "👍 Good start! Keep moving!";
    return "🌟 Let's start walking today!";
  };

  return (
    <motion.div 
      className="w-full max-w-md mx-auto p-4"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="p-5 bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 border-2 border-emerald-200 shadow-lg overflow-hidden relative rounded-xl">
        {/* Background decoration */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-teal-400/10 rounded-full blur-2xl"></div>
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-emerald-400/10 rounded-full blur-2xl"></div>

        <div className="flex items-center space-x-4 relative z-10">
          {/* Circular Progress Display - FIXED */}
          <motion.div 
            className="relative w-28 h-28 flex-shrink-0"
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            {/* Background Circle */}
            <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 100 100">
              <circle
                cx="50"
                cy="50"
                r="45"
                fill="none"
                stroke="#e5e7eb"
                strokeWidth="8"
              />
              {/* Progress Circle with Animation */}
              <motion.circle
                cx="50"
                cy="50"
                r="45"
                fill="none"
                stroke={isTargetReached ? '#10b981' : '#14b8a6'}
                strokeWidth="8"
                strokeLinecap="round"
                strokeDasharray={283} // 2 * PI * r = 2 * 3.14159 * 45
                initial={{ strokeDashoffset: 283 }}
                animate={{ 
                  strokeDashoffset: 283 - (283 * progressPercentage) / 100 
                }}
                transition={{ duration: 1, ease: "easeOut" }}
              />
            </svg>
            
            {/* Center Content - NO ROTATION */}
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <AnimatePresence mode="wait">
                <motion.div 
                  key={stepsData.currentSteps}
                  className={`text-2xl font-bold ${isTargetReached ? 'text-emerald-600' : 'text-teal-600'}`}
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.8, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  {(stepsData.currentSteps / 1000).toFixed(1)}K
                </motion.div>
              </AnimatePresence>
              <motion.div 
                className="text-xs text-gray-600 font-medium"
                key={`${progressPercentage}-percent`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                {Math.round(progressPercentage)}%
              </motion.div>
            </div>

            {/* Celebration animation when goal is reached */}
            {isTargetReached && (
              <motion.div
                className="absolute -top-2 -right-2"
                initial={{ scale: 0 }}
                animate={{ scale: [0, 1.2, 1], rotate: [0, 10, -10, 0] }}
                transition={{ duration: 0.5 }}
              >
                <Award className="h-7 w-7 text-yellow-500 fill-yellow-400" />
              </motion.div>
            )}
          </motion.div>

          {/* Stats Display */}
          <div className="flex-1 space-y-2.5">
            {/* Header */}
            <div className="flex items-center">
              <motion.div
                animate={{ x: [0, 2, 0] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                <Footprints className="h-5 w-5 text-emerald-600 mr-2" />
              </motion.div>
              <span className="font-semibold text-gray-800">Daily Steps</span>
            </div>

            {/* Stats Row */}
            <div className="grid grid-cols-3 gap-2">
              {/* Current Steps */}
              <motion.div 
                className="bg-white/80 backdrop-blur-sm rounded-lg p-2 text-center shadow-sm"
                whileHover={{ scale: 1.05, y: -2 }}
                transition={{ type: "spring", stiffness: 400 }}
              >
                <AnimatePresence mode="wait">
                  <motion.div 
                    key={stepsData.currentSteps}
                    className="font-semibold text-emerald-600"
                    initial={{ y: 10, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: -10, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    {stepsData.currentSteps.toLocaleString()}
                  </motion.div>
                </AnimatePresence>
                <div className="text-xs text-gray-600 flex items-center justify-center mt-1">
                  <Footprints className="h-3 w-3 mr-1" />
                  Steps
                </div>
              </motion.div>

              {/* Target Steps */}
              <motion.div 
                className="bg-white/80 backdrop-blur-sm rounded-lg p-2 text-center shadow-sm"
                whileHover={{ scale: 1.05, y: -2 }}
                transition={{ type: "spring", stiffness: 400 }}
              >
                <div className="font-semibold text-orange-600">
                  {(stepsData.targetSteps / 1000)}K
                </div>
                <div className="text-xs text-gray-600 flex items-center justify-center mt-1">
                  <Target className="h-3 w-3 mr-1" />
                  Goal
                </div>
              </motion.div>

              {/* Calories */}
              <motion.div 
                className="bg-white/80 backdrop-blur-sm rounded-lg p-2 text-center shadow-sm"
                whileHover={{ scale: 1.05, y: -2 }}
                transition={{ type: "spring", stiffness: 400 }}
              >
                <AnimatePresence mode="wait">
                  <motion.div 
                    key={stepsData.caloriesBurned}
                    className="font-semibold text-red-600"
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.8, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    {stepsData.caloriesBurned}
                  </motion.div>
                </AnimatePresence>
                <div className="text-xs text-gray-600 flex items-center justify-center mt-1">
                  <Flame className="h-3 w-3 mr-1" />
                  Cal
                </div>
              </motion.div>
            </div>

            {/* Progress Bar */}
            <div className="relative">
              <Progress 
                value={progressPercentage} 
                className={isTargetReached ? 'bg-emerald-100' : 'bg-teal-100'}
              />
              {isTargetReached && (
                <motion.div
                  className="absolute -top-1 left-0 right-0"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: [0, 1, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <div className="h-4 bg-gradient-to-r from-yellow-400 to-yellow-300 rounded-full opacity-50"></div>
                </motion.div>
              )}
            </div>

            {/* Status Message */}
            <AnimatePresence mode="wait">
              <motion.div 
                key={getMotivationalMessage()}
                className={`text-xs font-medium flex items-center ${
                  isTargetReached ? 'text-emerald-700' : 'text-teal-700'
                }`}
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -5 }}
                transition={{ duration: 0.3 }}
              >
                {isTargetReached ? (
                  <>
                    <TrendingUp className="h-3 w-3 mr-1" />
                    {getMotivationalMessage()}
                  </>
                ) : (
                  <>
                    <Zap className="h-3 w-3 mr-1" />
                    {(stepsData.targetSteps - stepsData.currentSteps).toLocaleString()} steps to goal
                  </>
                )}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </Card>
    </motion.div>
  );
}