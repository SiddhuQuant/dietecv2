import { useState, useEffect } from "react";
import { User, Calendar, Phone, MapPin, Heart, Activity, Pill, AlertCircle, ArrowRight, CheckCircle2, Loader2 } from "lucide-react";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { motion, AnimatePresence } from "motion/react";
import { Alert, AlertDescription } from "./ui/alert";
import { userProfileService, UserProfile } from "../services/userProfileService";
import { supabase } from "../utils/supabase/client";
import { projectId } from "../utils/supabase/info";

interface UserProfileSetupProps {
  userName: string;
  userEmail: string;
  onComplete: () => void;
  isDarkMode: boolean;
}

interface ProfileData extends UserProfile {
  emergencyRelation?: string;
}

export function UserProfileSetup({ userName, userEmail, onComplete, isDarkMode }: UserProfileSetupProps) {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const [profileData, setProfileData] = useState<ProfileData>({
    fullName: userName,
    dateOfBirth: "",
    gender: "",
    phone: "",
    address: "",
    bloodGroup: "",
    height: "",
    weight: "",
    allergies: "",
    chronicConditions: "",
    currentMedications: "",
    emergencyContact: "",
    emergencyPhone: "",
    emergencyRelation: "",
  });

  // Load existing profile data if available
  useEffect(() => {
    const loadExistingProfile = async () => {
      try {
        const existingProfile = await userProfileService.getProfile();
        if (existingProfile) {
          setProfileData({
            ...existingProfile,
            emergencyRelation: existingProfile.emergencyRelation || ""
          });
        }
      } catch (error) {
        console.error("Error loading profile:", error);
      } finally {
        setLoadingProfile(false);
      }
    };

    loadExistingProfile();
  }, []);

  const updateField = (field: keyof ProfileData, value: string) => {
    setProfileData(prev => ({ ...prev, [field]: value }));
  };

  const validateStep1 = () => {
    if (!profileData.fullName.trim()) {
      setError("Full name is required");
      return false;
    }
    if (!profileData.dateOfBirth) {
      setError("Date of birth is required");
      return false;
    }
    if (!profileData.gender) {
      setError("Please select your gender");
      return false;
    }
    return true;
  };

  const validateStep2 = () => {
    if (!profileData.phone.trim()) {
      setError("Phone number is required");
      return false;
    }
    if (!profileData.emergencyContact.trim()) {
      setError("Emergency contact name is required");
      return false;
    }
    if (!profileData.emergencyPhone.trim()) {
      setError("Emergency contact phone is required");
      return false;
    }
    return true;
  };

  const handleNext = () => {
    setError(null);
    if (step === 1 && !validateStep1()) return;
    if (step === 2 && !validateStep2()) return;
    
    if (step < 3) {
      setStep(step + 1);
    }
  };

  const handleBack = () => {
    setError(null);
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const handleSubmit = async () => {
    setError(null);
    setLoading(true);

    try {
      // Get the current session
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.access_token) {
        throw new Error("Not authenticated");
      }

      // Save profile data to backend
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-e46e3ba6/user-data/profile`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${session.access_token}`
          },
          body: JSON.stringify({ data: profileData })
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to save profile');
      }

      // Mark profile as completed in localStorage
      localStorage.setItem("dietec-profile-completed", "true");
      
      setSuccess(true);
      setTimeout(() => {
        onComplete();
      }, 1500);

    } catch (err: any) {
      console.error("Profile setup error:", err);
      setError(err.message || "Failed to save profile. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    },
    exit: { opacity: 0 }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <div className={`min-h-screen flex items-center justify-center p-4 ${isDarkMode ? 'bg-gray-900' : 'bg-gradient-to-br from-teal-50 via-cyan-50 to-blue-50'}`}>
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-2xl"
      >
        <Card className="p-6 md:p-8 shadow-2xl">
          {/* Header */}
          <div className="text-center mb-8">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 200 }}
              className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-teal-500 to-cyan-600 rounded-full mb-4"
            >
              <Heart className="h-8 w-8 text-white" />
            </motion.div>
            <h1 className="text-3xl mb-2">Complete Your Profile</h1>
            <p className="text-muted-foreground">
              Help us provide better health recommendations
            </p>
          </div>

          {/* Progress Indicator */}
          <div className="flex items-center justify-center mb-8 gap-2">
            {[1, 2, 3].map((s) => (
              <div key={s} className="flex items-center">
                <motion.div
                  initial={false}
                  animate={{
                    scale: step === s ? 1.2 : 1,
                    backgroundColor: step >= s ? '#14b8a6' : '#e5e7eb'
                  }}
                  className={`w-10 h-10 rounded-full flex items-center justify-center text-white transition-colors`}
                >
                  {step > s ? (
                    <CheckCircle2 className="h-5 w-5" />
                  ) : (
                    <span>{s}</span>
                  )}
                </motion.div>
                {s < 3 && (
                  <motion.div
                    initial={false}
                    animate={{
                      backgroundColor: step > s ? '#14b8a6' : '#e5e7eb'
                    }}
                    className="w-12 h-1 mx-2"
                  />
                )}
              </div>
            ))}
          </div>

          {/* Error Alert */}
          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="mb-6"
              >
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Success Message */}
          <AnimatePresence>
            {success && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="text-center py-12"
              >
                <motion.div
                  animate={{ scale: [1, 1.2, 1], rotate: [0, 360] }}
                  transition={{ duration: 0.6 }}
                  className="inline-flex items-center justify-center w-20 h-20 bg-green-500 rounded-full mb-4"
                >
                  <CheckCircle2 className="h-10 w-10 text-white" />
                </motion.div>
                <h2 className="text-2xl mb-2">Profile Complete!</h2>
                <p className="text-muted-foreground">Redirecting to dashboard...</p>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Form Steps */}
          {!success && (
            <AnimatePresence mode="wait">
              <motion.div
                key={step}
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
              >
                {/* Step 1: Personal Information */}
                {step === 1 && (
                  <motion.div variants={containerVariants} className="space-y-4">
                    <motion.div variants={itemVariants}>
                      <Label htmlFor="fullName" className="flex items-center gap-2">
                        <User className="h-4 w-4" />
                        Full Name *
                      </Label>
                      <Input
                        id="fullName"
                        type="text"
                        value={profileData.fullName}
                        onChange={(e) => updateField('fullName', e.target.value)}
                        placeholder="Enter your full name"
                        className="mt-1"
                      />
                    </motion.div>

                    <motion.div variants={itemVariants}>
                      <Label htmlFor="dateOfBirth" className="flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        Date of Birth *
                      </Label>
                      <Input
                        id="dateOfBirth"
                        type="date"
                        value={profileData.dateOfBirth}
                        onChange={(e) => updateField('dateOfBirth', e.target.value)}
                        className="mt-1"
                      />
                    </motion.div>

                    <motion.div variants={itemVariants}>
                      <Label className="mb-2 block">Gender *</Label>
                      <div className="grid grid-cols-3 gap-3">
                        {['Male', 'Female', 'Other'].map((gender) => (
                          <button
                            key={gender}
                            type="button"
                            onClick={() => updateField('gender', gender)}
                            className={`p-3 rounded-lg border-2 transition-all ${
                              profileData.gender === gender
                                ? 'border-teal-500 bg-teal-50 dark:bg-teal-900/20'
                                : 'border-gray-200 hover:border-gray-300'
                            }`}
                          >
                            {gender}
                          </button>
                        ))}
                      </div>
                    </motion.div>

                    <motion.div variants={itemVariants}>
                      <Label htmlFor="phone" className="flex items-center gap-2">
                        <Phone className="h-4 w-4" />
                        Phone Number
                      </Label>
                      <Input
                        id="phone"
                        type="tel"
                        value={profileData.phone}
                        onChange={(e) => updateField('phone', e.target.value)}
                        placeholder="+91 1234567890"
                        className="mt-1"
                      />
                    </motion.div>

                    <motion.div variants={itemVariants}>
                      <Label htmlFor="address" className="flex items-center gap-2">
                        <MapPin className="h-4 w-4" />
                        Address
                      </Label>
                      <Textarea
                        id="address"
                        value={profileData.address}
                        onChange={(e) => updateField('address', e.target.value)}
                        placeholder="Enter your address"
                        className="mt-1"
                        rows={3}
                      />
                    </motion.div>
                  </motion.div>
                )}

                {/* Step 2: Emergency Contact */}
                {step === 2 && (
                  <motion.div variants={containerVariants} className="space-y-4">
                    <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg p-4 mb-6">
                      <div className="flex items-start gap-3">
                        <AlertCircle className="h-5 w-5 text-amber-600 mt-0.5" />
                        <div>
                          <h3 className="font-semibold text-amber-900 dark:text-amber-100">Emergency Contact</h3>
                          <p className="text-sm text-amber-700 dark:text-amber-300 mt-1">
                            This person will be contacted in case of medical emergency
                          </p>
                        </div>
                      </div>
                    </div>

                    <motion.div variants={itemVariants}>
                      <Label htmlFor="emergencyContact" className="flex items-center gap-2">
                        <User className="h-4 w-4" />
                        Emergency Contact Name *
                      </Label>
                      <Input
                        id="emergencyContact"
                        type="text"
                        value={profileData.emergencyContact}
                        onChange={(e) => updateField('emergencyContact', e.target.value)}
                        placeholder="Enter contact person's name"
                        className="mt-1"
                      />
                    </motion.div>

                    <motion.div variants={itemVariants}>
                      <Label htmlFor="emergencyPhone" className="flex items-center gap-2">
                        <Phone className="h-4 w-4" />
                        Emergency Contact Phone *
                      </Label>
                      <Input
                        id="emergencyPhone"
                        type="tel"
                        value={profileData.emergencyPhone}
                        onChange={(e) => updateField('emergencyPhone', e.target.value)}
                        placeholder="+91 1234567890"
                        className="mt-1"
                      />
                    </motion.div>

                    <motion.div variants={itemVariants}>
                      <Label htmlFor="phoneVerify" className="flex items-center gap-2">
                        <Phone className="h-4 w-4" />
                        Your Phone Number *
                      </Label>
                      <Input
                        id="phoneVerify"
                        type="tel"
                        value={profileData.phone}
                        onChange={(e) => updateField('phone', e.target.value)}
                        placeholder="+91 1234567890"
                        className="mt-1"
                      />
                    </motion.div>
                  </motion.div>
                )}

                {/* Step 3: Medical History */}
                {step === 3 && (
                  <motion.div variants={containerVariants} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <motion.div variants={itemVariants}>
                        <Label htmlFor="bloodGroup" className="flex items-center gap-2">
                          <Activity className="h-4 w-4" />
                          Blood Group
                        </Label>
                        <select
                          id="bloodGroup"
                          value={profileData.bloodGroup}
                          onChange={(e) => updateField('bloodGroup', e.target.value)}
                          className="mt-1 w-full px-3 py-2 border border-input rounded-md bg-background"
                        >
                          <option value="">Select</option>
                          <option value="A+">A+</option>
                          <option value="A-">A-</option>
                          <option value="B+">B+</option>
                          <option value="B-">B-</option>
                          <option value="AB+">AB+</option>
                          <option value="AB-">AB-</option>
                          <option value="O+">O+</option>
                          <option value="O-">O-</option>
                        </select>
                      </motion.div>

                      <motion.div variants={itemVariants}>
                        <Label htmlFor="height">Height (cm)</Label>
                        <Input
                          id="height"
                          type="number"
                          value={profileData.height}
                          onChange={(e) => updateField('height', e.target.value)}
                          placeholder="170"
                          className="mt-1"
                        />
                      </motion.div>

                      <motion.div variants={itemVariants}>
                        <Label htmlFor="weight">Weight (kg)</Label>
                        <Input
                          id="weight"
                          type="number"
                          value={profileData.weight}
                          onChange={(e) => updateField('weight', e.target.value)}
                          placeholder="65"
                          className="mt-1"
                        />
                      </motion.div>
                    </div>

                    <motion.div variants={itemVariants}>
                      <Label htmlFor="allergies" className="flex items-center gap-2">
                        <AlertCircle className="h-4 w-4" />
                        Allergies
                      </Label>
                      <Textarea
                        id="allergies"
                        value={profileData.allergies}
                        onChange={(e) => updateField('allergies', e.target.value)}
                        placeholder="List any allergies (e.g., peanuts, penicillin)"
                        className="mt-1"
                        rows={2}
                      />
                    </motion.div>

                    <motion.div variants={itemVariants}>
                      <Label htmlFor="chronicConditions" className="flex items-center gap-2">
                        <Heart className="h-4 w-4" />
                        Chronic Conditions
                      </Label>
                      <Textarea
                        id="chronicConditions"
                        value={profileData.chronicConditions}
                        onChange={(e) => updateField('chronicConditions', e.target.value)}
                        placeholder="List any chronic conditions (e.g., diabetes, hypertension)"
                        className="mt-1"
                        rows={2}
                      />
                    </motion.div>

                    <motion.div variants={itemVariants}>
                      <Label htmlFor="currentMedications" className="flex items-center gap-2">
                        <Pill className="h-4 w-4" />
                        Current Medications
                      </Label>
                      <Textarea
                        id="currentMedications"
                        value={profileData.currentMedications}
                        onChange={(e) => updateField('currentMedications', e.target.value)}
                        placeholder="List current medications and dosage"
                        className="mt-1"
                        rows={2}
                      />
                    </motion.div>
                  </motion.div>
                )}

                {/* Navigation Buttons */}
                <motion.div
                  variants={itemVariants}
                  className="flex gap-3 mt-8"
                >
                  {step > 1 && (
                    <Button
                      type="button"
                      variant="outline"
                      onClick={handleBack}
                      disabled={loading}
                      className="flex-1"
                    >
                      Back
                    </Button>
                  )}
                  
                  {step < 3 ? (
                    <Button
                      type="button"
                      onClick={handleNext}
                      className="flex-1 bg-gradient-to-r from-teal-500 to-cyan-600 hover:from-teal-600 hover:to-cyan-700"
                    >
                      Next
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  ) : (
                    <Button
                      type="button"
                      onClick={handleSubmit}
                      disabled={loading}
                      className="flex-1 bg-gradient-to-r from-teal-500 to-cyan-600 hover:from-teal-600 hover:to-cyan-700"
                    >
                      {loading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Saving...
                        </>
                      ) : (
                        <>
                          Complete Setup
                          <CheckCircle2 className="ml-2 h-4 w-4" />
                        </>
                      )}
                    </Button>
                  )}
                </motion.div>
              </motion.div>
            </AnimatePresence>
          )}
        </Card>

        {/* Skip Option */}
        {!success && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="text-center mt-4"
          >
            <button
              onClick={onComplete}
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              Skip for now (you can complete this later)
            </button>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}