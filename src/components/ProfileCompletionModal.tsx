import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Heart, User, Phone, MapPin, Calendar, ArrowRight, X } from "lucide-react";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { ScrollArea } from "./ui/scroll-area";

interface ProfileCompletionModalProps {
  isOpen: boolean;
  onComplete: (profileData: ProfileData) => void;
  onClose: () => void;
}

export interface ProfileData {
  fullName: string;
  dateOfBirth: string;
  gender: "male" | "female" | "other" | "";
  phoneNumber: string;
  address: string;
  medicalConditions?: string;
  allergies?: string;
  emergencyContact?: string;
}

export function ProfileCompletionModal({ isOpen, onComplete, onClose }: ProfileCompletionModalProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [profileData, setProfileData] = useState<ProfileData>({
    fullName: "",
    dateOfBirth: "",
    gender: "",
    phoneNumber: "",
    address: "",
    medicalConditions: "",
    allergies: "",
    emergencyContact: "",
  });

  const updateField = (field: keyof ProfileData, value: string) => {
    setProfileData(prev => ({ ...prev, [field]: value }));
  };

  const handleNext = () => {
    if (currentStep < 3) {
      setCurrentStep(prev => prev + 1);
    } else {
      // Final step - complete profile
      onComplete(profileData);
    }
  };

  const isStepValid = () => {
    switch (currentStep) {
      case 1:
        return profileData.fullName && profileData.dateOfBirth && profileData.gender && profileData.phoneNumber && profileData.address;
      case 2:
        return true; // Medical info is optional
      case 3:
        return true; // Emergency contact is optional
      default:
        return false;
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50 backdrop-blur-sm"
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, y: -100, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -100, scale: 0.9 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="fixed top-4 left-1/2 -translate-x-1/2 z-50 w-full max-w-lg px-4 max-h-[95vh]"
          >
            <motion.div
              whileHover={{ scale: 1.02, boxShadow: "0 20px 60px rgba(0,0,0,0.3)" }}
              transition={{ type: "spring", stiffness: 400 }}
            >
              <Card className="bg-white dark:bg-gray-800 shadow-2xl relative overflow-hidden flex flex-col max-h-[90vh]">
                {/* Close Button */}
                <button
                  onClick={onClose}
                  className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors z-10"
                >
                  <X className="h-5 w-5" />
                </button>

                {/* Scrollable Content */}
                <ScrollArea className="flex-1 overflow-y-auto">
                  <div className="p-6">
                    {/* Header with Icon */}
                    <div className="flex flex-col items-center mb-6">
                      <motion.div
                        animate={{ 
                          scale: [1, 1.1, 1],
                          rotate: [0, 5, -5, 0]
                        }}
                        transition={{ 
                          duration: 2,
                          repeat: Infinity,
                          ease: "easeInOut"
                        }}
                        className="w-16 h-16 bg-gradient-to-br from-teal-500 to-cyan-600 rounded-full flex items-center justify-center mb-4 shadow-lg"
                      >
                        <Heart className="h-8 w-8 text-white" fill="white" />
                      </motion.div>
                      <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                        Complete Your Profile
                      </h2>
                      <p className="text-sm text-gray-600 dark:text-gray-400 text-center mt-2">
                        Help us provide better health recommendations
                      </p>
                    </div>

                    {/* Step Indicator */}
                    <div className="flex items-center justify-center mb-8">
                      {[1, 2, 3].map((step, index) => (
                        <div key={step} className="flex items-center">
                          <motion.div
                            whileHover={{ scale: 1.2 }}
                            className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-all ${
                              step === currentStep
                                ? "bg-gradient-to-br from-teal-500 to-cyan-600 text-white shadow-lg scale-110"
                                : step < currentStep
                                ? "bg-teal-500 text-white"
                                : "bg-gray-200 dark:bg-gray-600 text-gray-500 dark:text-gray-400"
                            }`}
                          >
                            {step}
                          </motion.div>
                          {index < 2 && (
                            <div className={`w-12 h-1 mx-2 transition-all ${
                              step < currentStep ? "bg-teal-500" : "bg-gray-200 dark:bg-gray-600"
                            }`} />
                          )}
                        </div>
                      ))}
                    </div>

                    {/* Step 1: Basic Information */}
                    {currentStep === 1 && (
                      <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        className="space-y-4"
                      >
                        {/* Full Name */}
                        <div className="space-y-2">
                          <Label htmlFor="fullName" className="flex items-center space-x-2 text-gray-700 dark:text-gray-300">
                            <User className="h-4 w-4 text-teal-600" />
                            <span>Full Name <span className="text-red-500">*</span></span>
                          </Label>
                          <motion.div whileFocus={{ scale: 1.02 }}>
                            <Input
                              id="fullName"
                              type="text"
                              placeholder="Enter your full name"
                              value={profileData.fullName}
                              onChange={(e) => updateField("fullName", e.target.value)}
                              className="bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600 focus:border-teal-500 focus:ring-teal-500"
                            />
                          </motion.div>
                        </div>

                        {/* Date of Birth */}
                        <div className="space-y-2">
                          <Label htmlFor="dob" className="flex items-center space-x-2 text-gray-700 dark:text-gray-300">
                            <Calendar className="h-4 w-4 text-teal-600" />
                            <span>Date of Birth <span className="text-red-500">*</span></span>
                          </Label>
                          <motion.div whileFocus={{ scale: 1.02 }}>
                            <Input
                              id="dob"
                              type="date"
                              value={profileData.dateOfBirth}
                              onChange={(e) => updateField("dateOfBirth", e.target.value)}
                              className="bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600 focus:border-teal-500 focus:ring-teal-500"
                            />
                          </motion.div>
                        </div>

                        {/* Gender */}
                        <div className="space-y-2">
                          <Label className="text-gray-700 dark:text-gray-300">
                            Gender <span className="text-red-500">*</span>
                          </Label>
                          <div className="grid grid-cols-3 gap-3">
                            {[
                              { value: "male", label: "Male" },
                              { value: "female", label: "Female" },
                              { value: "other", label: "Other" }
                            ].map((option) => (
                              <motion.button
                                key={option.value}
                                type="button"
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => updateField("gender", option.value)}
                                className={`py-3 px-4 rounded-lg border-2 font-medium transition-all ${
                                  profileData.gender === option.value
                                    ? "border-teal-500 bg-teal-50 dark:bg-teal-900/30 text-teal-700 dark:text-teal-300"
                                    : "border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:border-teal-300"
                                }`}
                              >
                                {option.label}
                              </motion.button>
                            ))}
                          </div>
                        </div>

                        {/* Phone Number */}
                        <div className="space-y-2">
                          <Label htmlFor="phone" className="flex items-center space-x-2 text-gray-700 dark:text-gray-300">
                            <Phone className="h-4 w-4 text-teal-600" />
                            <span>Phone Number <span className="text-red-500">*</span></span>
                          </Label>
                          <motion.div whileFocus={{ scale: 1.02 }}>
                            <Input
                              id="phone"
                              type="tel"
                              placeholder="Enter your phone number"
                              value={profileData.phoneNumber}
                              onChange={(e) => updateField("phoneNumber", e.target.value)}
                              className="bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600 focus:border-teal-500 focus:ring-teal-500"
                            />
                          </motion.div>
                        </div>

                        {/* Address */}
                        <div className="space-y-2">
                          <Label htmlFor="address" className="flex items-center space-x-2 text-gray-700 dark:text-gray-300">
                            <MapPin className="h-4 w-4 text-teal-600" />
                            <span>Address <span className="text-red-500">*</span></span>
                          </Label>
                          <motion.div whileFocus={{ scale: 1.02 }}>
                            <Input
                              id="address"
                              type="text"
                              placeholder="Enter your address"
                              value={profileData.address}
                              onChange={(e) => updateField("address", e.target.value)}
                              className="bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600 focus:border-teal-500 focus:ring-teal-500"
                            />
                          </motion.div>
                        </div>
                      </motion.div>
                    )}

                    {/* Step 2: Medical Information */}
                    {currentStep === 2 && (
                      <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        className="space-y-4"
                      >
                        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700 rounded-lg p-4 mb-4">
                          <p className="text-sm text-blue-800 dark:text-blue-200">
                            💡 <strong>Note:</strong> This information will automatically sync with your Medical History section. You won't need to enter it again!
                          </p>
                        </div>

                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                          Optional: Help us provide better health advice
                        </p>

                        {/* Medical Conditions */}
                        <div className="space-y-2">
                          <Label htmlFor="conditions" className="text-gray-700 dark:text-gray-300">
                            Medical Conditions (Optional)
                          </Label>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            Separate multiple conditions with commas (e.g., Diabetes, Hypertension, Asthma)
                          </p>
                          <motion.div whileFocus={{ scale: 1.02 }}>
                            <textarea
                              id="conditions"
                              placeholder="E.g., Diabetes, Hypertension, Asthma..."
                              value={profileData.medicalConditions}
                              onChange={(e) => updateField("medicalConditions", e.target.value)}
                              rows={4}
                              className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 outline-none transition-all resize-none"
                            />
                          </motion.div>
                        </div>

                        {/* Allergies */}
                        <div className="space-y-2">
                          <Label htmlFor="allergies" className="text-gray-700 dark:text-gray-300">
                            Allergies (Optional)
                          </Label>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            Separate multiple allergies with commas (e.g., Peanuts, Penicillin, Dust)
                          </p>
                          <motion.div whileFocus={{ scale: 1.02 }}>
                            <textarea
                              id="allergies"
                              placeholder="E.g., Peanuts, Penicillin, Dust..."
                              value={profileData.allergies}
                              onChange={(e) => updateField("allergies", e.target.value)}
                              rows={4}
                              className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 outline-none transition-all resize-none"
                            />
                          </motion.div>
                        </div>
                      </motion.div>
                    )}

                    {/* Step 3: Emergency Contact */}
                    {currentStep === 3 && (
                      <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        className="space-y-4"
                      >
                        <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-700 rounded-lg p-4 mb-4">
                          <p className="text-sm text-green-800 dark:text-green-200">
                            🔒 <strong>Privacy Protected:</strong> Your emergency contact will be securely stored and synced across all sections.
                          </p>
                        </div>

                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                          Optional: Add an emergency contact for safety
                        </p>

                        {/* Emergency Contact */}
                        <div className="space-y-2">
                          <Label htmlFor="emergency" className="flex items-center space-x-2 text-gray-700 dark:text-gray-300">
                            <Phone className="h-4 w-4 text-teal-600" />
                            <span>Emergency Contact (Optional)</span>
                          </Label>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            Include name and phone number (e.g., John Doe - 9876543210)
                          </p>
                          <motion.div whileFocus={{ scale: 1.02 }}>
                            <Input
                              id="emergency"
                              type="text"
                              placeholder="Name and phone number"
                              value={profileData.emergencyContact}
                              onChange={(e) => updateField("emergencyContact", e.target.value)}
                              className="bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600 focus:border-teal-500 focus:ring-teal-500"
                            />
                          </motion.div>
                        </div>

                        {/* Completion Message */}
                        <div className="bg-teal-50 dark:bg-teal-900/20 border border-teal-200 dark:border-teal-700 rounded-lg p-4 mt-6">
                          <p className="text-sm text-teal-800 dark:text-teal-200 text-center">
                            ✓ You're almost done! Click Complete to finish your profile.
                          </p>
                          <p className="text-xs text-teal-700 dark:text-teal-300 text-center mt-2">
                            All your information will be automatically available in Medical History, Personal Doctor, and other relevant sections.
                          </p>
                        </div>
                      </motion.div>
                    )}
                  </div>
                </ScrollArea>

                {/* Action Buttons - Fixed at bottom */}
                <div className="p-6 pt-0 border-t border-gray-200 dark:border-gray-700">
                  <div className="flex space-x-3">
                    {currentStep > 1 && (
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setCurrentStep(prev => prev - 1)}
                        className="flex-1"
                      >
                        Back
                      </Button>
                    )}
                    <motion.div
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="flex-1"
                    >
                      <Button
                        type="button"
                        onClick={handleNext}
                        disabled={!isStepValid()}
                        className="w-full bg-gradient-to-r from-teal-500 to-cyan-600 hover:from-teal-600 hover:to-cyan-700 text-white disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {currentStep === 3 ? "Complete" : "Next"}
                        <ArrowRight className="h-4 w-4 ml-2" />
                      </Button>
                    </motion.div>
                  </div>
                </div>
              </Card>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
