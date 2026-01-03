import { Heart, ArrowRight, User, Calendar, Phone, MapPin } from "lucide-react";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { motion } from "motion/react";

interface ProfileCompletionBannerProps {
  onCompleteProfile: () => void;
  userName: string;
}

export function ProfileCompletionBanner({ onCompleteProfile, userName }: ProfileCompletionBannerProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="mb-6"
    >
      <Card className="bg-gradient-to-br from-teal-50 to-blue-50 dark:from-teal-900/20 dark:to-blue-900/20 border-2 border-teal-200 dark:border-teal-800 shadow-lg overflow-hidden">
        <div className="p-6">
          {/* Header with Icon */}
          <div className="flex items-center justify-center mb-4">
            <motion.div
              animate={{ 
                scale: [1, 1.1, 1],
              }}
              transition={{ 
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut"
              }}
              className="w-16 h-16 bg-gradient-to-br from-teal-500 to-teal-600 rounded-full flex items-center justify-center shadow-lg"
            >
              <Heart className="h-8 w-8 text-white" fill="white" />
            </motion.div>
          </div>

          {/* Title and Description */}
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">
              Complete Your Profile
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              Help us provide better health recommendations
            </p>
          </div>

          {/* Progress Steps */}
          <div className="flex items-center justify-center mb-6">
            <div className="flex items-center space-x-2">
              {/* Step 1 */}
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2 }}
                className="w-10 h-10 rounded-full bg-teal-500 text-white flex items-center justify-center font-semibold shadow-md"
              >
                1
              </motion.div>
              <div className="w-12 h-0.5 bg-gray-300 dark:bg-gray-600"></div>
              
              {/* Step 2 */}
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.4 }}
                className="w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-700 text-gray-400 dark:text-gray-500 flex items-center justify-center font-semibold"
              >
                2
              </motion.div>
              <div className="w-12 h-0.5 bg-gray-300 dark:bg-gray-600"></div>
              
              {/* Step 3 */}
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.6 }}
                className="w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-700 text-gray-400 dark:text-gray-500 flex items-center justify-center font-semibold"
              >
                3
              </motion.div>
            </div>
          </div>

          {/* Info Cards - What to Fill */}
          <div className="grid grid-cols-2 gap-3 mb-6">
            <div className="bg-white dark:bg-gray-800 rounded-lg p-3 border border-teal-100 dark:border-teal-800">
              <div className="flex items-center space-x-2 text-teal-600 dark:text-teal-400 mb-1">
                <User className="h-4 w-4" />
                <span className="text-xs font-medium">Personal Info</span>
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400">Name, Gender, DOB</p>
            </div>
            
            <div className="bg-white dark:bg-gray-800 rounded-lg p-3 border border-blue-100 dark:border-blue-800">
              <div className="flex items-center space-x-2 text-blue-600 dark:text-blue-400 mb-1">
                <Phone className="h-4 w-4" />
                <span className="text-xs font-medium">Contact</span>
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400">Phone & Emergency</p>
            </div>
            
            <div className="bg-white dark:bg-gray-800 rounded-lg p-3 border border-purple-100 dark:border-purple-800">
              <div className="flex items-center space-x-2 text-purple-600 dark:text-purple-400 mb-1">
                <Heart className="h-4 w-4" />
                <span className="text-xs font-medium">Health Info</span>
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400">Blood, Allergies</p>
            </div>
            
            <div className="bg-white dark:bg-gray-800 rounded-lg p-3 border border-green-100 dark:border-green-800">
              <div className="flex items-center space-x-2 text-green-600 dark:text-green-400 mb-1">
                <MapPin className="h-4 w-4" />
                <span className="text-xs font-medium">Location</span>
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400">Address Details</p>
            </div>
          </div>

          {/* CTA Button */}
          <motion.div
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Button
              onClick={onCompleteProfile}
              className="w-full bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700 text-white py-6 rounded-xl shadow-md font-semibold"
            >
              Complete Profile Now
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </motion.div>

          {/* Additional Info */}
          <div className="mt-4 text-center">
            <p className="text-xs text-gray-500 dark:text-gray-400">
              ⏱️ Takes only 2-3 minutes • 🔒 Your data is secure
            </p>
          </div>
        </div>
      </Card>
    </motion.div>
  );
}