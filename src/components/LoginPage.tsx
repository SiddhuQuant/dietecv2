import { useState } from "react";
import { Heart, User, Lock, Mail, Sparkles, Shield, Activity, Stethoscope, Loader2, AlertCircle } from "lucide-react";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { ThemeToggle } from "./ThemeToggle";
import { motion } from "motion/react";
import { Alert, AlertDescription } from "./ui/alert";
import { supabase } from "../utils/supabase/client";
import { projectId, publicAnonKey } from "../utils/supabase/info";

interface LoginPageProps {
  onLogin: (userData: { name: string; email: string }) => void;
  isDarkMode: boolean;
  onToggleTheme: () => void;
}

export function LoginPage({ onLogin, isDarkMode, onToggleTheme }: LoginPageProps) {
  const [loginForm, setLoginForm] = useState({ email: "", password: "" });
  const [signupForm, setSignupForm] = useState({ 
    name: "", 
    email: "", 
    password: "", 
    confirmPassword: "" 
  });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email: loginForm.email,
        password: loginForm.password,
      });

      if (error) throw error;
      // Auth state listener in App.tsx will handle the rest
    } catch (err: any) {
      setError(err.message || "Failed to sign in");
    } finally {
      setLoading(false);
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (signupForm.password !== signupForm.confirmPassword) {
        setError("Passwords do not match");
        return;
    }
    
    setLoading(true);
    setError(null);

    try {
        const response = await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-e46e3ba6/signup`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${publicAnonKey}`
            },
            body: JSON.stringify({
                email: signupForm.email,
                password: signupForm.password,
                name: signupForm.name
            })
        });

        let data;
        try {
            data = await response.json();
        } catch (e) {
            console.error("Failed to parse signup response:", e);
            throw new Error(`Server responded with status ${response.status}`);
        }
        
        if (!response.ok) {
            throw new Error(data.error || `Signup failed with status ${response.status}`);
        }

        // Auto login after signup
        const { error: loginError } = await supabase.auth.signInWithPassword({
            email: signupForm.email,
            password: signupForm.password,
        });

        if (loginError) throw loginError;

    } catch (err: any) {
        console.error("Signup error:", err);
        setError(err.message || "Failed to sign up. Please try again.");
    } finally {
        setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 via-blue-50 to-purple-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-900 p-4 flex items-center justify-center relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div 
          className="absolute top-20 left-10 w-72 h-72 bg-teal-500/20 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div 
          className="absolute bottom-20 right-10 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.3, 0.6, 0.3],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1
          }}
        />
        <motion.div 
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.4, 1],
            rotate: [0, 180, 360],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: "linear"
          }}
        />
      </div>

      <div className="max-w-md w-full relative z-10">
        {/* Header */}
        <motion.div 
          className="text-center mb-8"
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="flex items-center justify-between mb-6">
            <motion.div 
              className="flex items-center mx-auto"
              whileHover={{ scale: 1.05 }}
            >
              <div className="relative">
                <Heart className="h-16 w-16 text-teal-600 mr-3" fill="currentColor" />
                <motion.div 
                  className="absolute inset-0"
                  animate={{
                    scale: [1, 1.2, 1],
                    opacity: [0.5, 0, 0.5]
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                >
                  <Heart className="h-16 w-16 text-teal-400" fill="currentColor" />
                </motion.div>
              </div>
              <div className="text-left">
                <h1 className="text-5xl font-extrabold bg-gradient-to-r from-teal-600 via-blue-600 to-purple-600 bg-clip-text text-transparent">
                  DIETEC
                </h1>
                <p className="text-sm text-muted-foreground">Health Platform</p>
              </div>
            </motion.div>
            <ThemeToggle isDarkMode={isDarkMode} onToggle={onToggleTheme} />
          </div>
          
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <p className="text-lg text-foreground mb-2">Digital Health & Nutrition Platform</p>
            <p className="text-sm text-muted-foreground flex items-center justify-center gap-2">
              <Sparkles className="h-4 w-4 text-teal-600" />
              Your Complete Rural Healthcare Companion
              <Sparkles className="h-4 w-4 text-teal-600" />
            </p>
          </motion.div>
        </motion.div>

        {/* Login/Signup Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card className="p-6 bg-white/90 dark:bg-gray-900/90 backdrop-blur-xl shadow-2xl border-2 border-teal-100 dark:border-teal-900">
            <Tabs defaultValue="login" className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-6 bg-teal-100 dark:bg-teal-900/40">
                <TabsTrigger value="login" className="data-[state=active]:bg-teal-600 data-[state=active]:text-white">
                  Login
                </TabsTrigger>
                <TabsTrigger value="signup" className="data-[state=active]:bg-teal-600 data-[state=active]:text-white">
                  Sign Up
                </TabsTrigger>
              </TabsList>
              
              <div className="min-h-[350px]">
                {error && (
                  <Alert variant="destructive" className="mb-4">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}

                <TabsContent value="login">
                  <form onSubmit={handleLogin} className="space-y-5">
                    <div className="space-y-2">
                      <Label htmlFor="email" className="text-foreground">Email</Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-3 h-5 w-5 text-teal-600" />
                        <Input
                          id="email"
                          type="email"
                          placeholder="Enter your email"
                          className="pl-11 h-12 border-2 border-gray-200 dark:border-gray-700 focus:border-teal-500 transition-colors"
                          value={loginForm.email}
                          onChange={(e) => setLoginForm({ ...loginForm, email: e.target.value })}
                          required
                          disabled={loading}
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="password" className="text-foreground">Password</Label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-3 h-5 w-5 text-teal-600" />
                        <Input
                          id="password"
                          type="password"
                          placeholder="Enter your password"
                          className="pl-11 h-12 border-2 border-gray-200 dark:border-gray-700 focus:border-teal-500 transition-colors"
                          value={loginForm.password}
                          onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
                          required
                          disabled={loading}
                        />
                      </div>
                    </div>
                    
                    <motion.div
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Button 
                        type="submit" 
                        className="w-full bg-gradient-to-r from-teal-600 to-blue-600 hover:from-teal-700 hover:to-blue-700 text-white py-6 shadow-lg hover:shadow-xl transition-all duration-300"
                        disabled={loading}
                      >
                        {loading ? <Loader2 className="h-5 w-5 mr-2 animate-spin" /> : <User className="h-5 w-5 mr-2" />}
                        {loading ? "Logging in..." : "Login to DIETEC"}
                      </Button>
                    </motion.div>
                  </form>
                </TabsContent>
                
                <TabsContent value="signup">
                  <form onSubmit={handleSignup} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="name" className="text-foreground">Full Name</Label>
                      <div className="relative">
                        <User className="absolute left-3 top-3 h-5 w-5 text-teal-600" />
                        <Input
                          id="name"
                          type="text"
                          placeholder="Enter your full name"
                          className="pl-11 h-12 border-2 border-gray-200 dark:border-gray-700 focus:border-teal-500 transition-colors"
                          value={signupForm.name}
                          onChange={(e) => setSignupForm({ ...signupForm, name: e.target.value })}
                          required
                          disabled={loading}
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="signup-email" className="text-foreground">Email</Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-3 h-5 w-5 text-teal-600" />
                        <Input
                          id="signup-email"
                          type="email"
                          placeholder="Enter your email"
                          className="pl-11 h-12 border-2 border-gray-200 dark:border-gray-700 focus:border-teal-500 transition-colors"
                          value={signupForm.email}
                          onChange={(e) => setSignupForm({ ...signupForm, email: e.target.value })}
                          required
                          disabled={loading}
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="signup-password" className="text-foreground">Password</Label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-3 h-5 w-5 text-teal-600" />
                        <Input
                          id="signup-password"
                          type="password"
                          placeholder="Create a password"
                          className="pl-11 h-12 border-2 border-gray-200 dark:border-gray-700 focus:border-teal-500 transition-colors"
                          value={signupForm.password}
                          onChange={(e) => setSignupForm({ ...signupForm, password: e.target.value })}
                          required
                          disabled={loading}
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="confirm-password" className="text-foreground">Confirm Password</Label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-3 h-5 w-5 text-teal-600" />
                        <Input
                          id="confirm-password"
                          type="password"
                          placeholder="Confirm your password"
                          className="pl-11 h-12 border-2 border-gray-200 dark:border-gray-700 focus:border-teal-500 transition-colors"
                          value={signupForm.confirmPassword}
                          onChange={(e) => setSignupForm({ ...signupForm, confirmPassword: e.target.value })}
                          required
                          disabled={loading}
                        />
                      </div>
                    </div>
                    
                    <motion.div
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Button 
                        type="submit" 
                        className="w-full bg-gradient-to-r from-teal-600 to-blue-600 hover:from-teal-700 hover:to-blue-700 text-white py-6 shadow-lg hover:shadow-xl transition-all duration-300"
                        disabled={loading}
                      >
                        {loading ? <Loader2 className="h-5 w-5 mr-2 animate-spin" /> : <Sparkles className="h-5 w-5 mr-2" />}
                        {loading ? "Creating Account..." : "Create DIETEC Account"}
                      </Button>
                    </motion.div>
                  </form>
                </TabsContent>
              </div>
            </Tabs>
          </Card>
        </motion.div>

        {/* Features Preview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <Card className="p-5 mt-6 bg-gradient-to-br from-teal-50 to-blue-50 dark:from-teal-900/20 dark:to-blue-900/20 border-2 border-teal-200 dark:border-teal-800 shadow-lg">
            <div className="flex items-center mb-4">
              <Shield className="h-6 w-6 text-teal-600 mr-2" />
              <h3 className="font-semibold text-teal-800 dark:text-teal-200">Why Choose DIETEC?</h3>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <motion.div 
                className="flex items-start space-x-2"
                whileHover={{ x: 5 }}
              >
                <div className="w-8 h-8 bg-teal-500 rounded-full flex items-center justify-center flex-shrink-0 shadow-md">
                  <span className="text-white">🥗</span>
                </div>
                <div>
                  <p className="text-sm font-semibold text-teal-800 dark:text-teal-200">Nutrition Plans</p>
                  <p className="text-xs text-teal-700 dark:text-teal-300">Local ingredients</p>
                </div>
              </motion.div>
              
              <motion.div 
                className="flex items-start space-x-2"
                whileHover={{ x: 5 }}
              >
                <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0 shadow-md">
                  <span className="text-white">📋</span>
                </div>
                <div>
                  <p className="text-sm font-semibold text-blue-800 dark:text-blue-200">Medical History</p>
                  <p className="text-xs text-blue-700 dark:text-blue-300">Track health data</p>
                </div>
              </motion.div>
              
              <motion.div 
                className="flex items-start space-x-2"
                whileHover={{ x: 5 }}
              >
                <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center flex-shrink-0 shadow-md">
                  <span className="text-white">🚑</span>
                </div>
                <div>
                  <p className="text-sm font-semibold text-red-800 dark:text-red-200">First Aid</p>
                  <p className="text-xs text-red-700 dark:text-red-300">Emergency help</p>
                </div>
              </motion.div>
              
              <motion.div 
                className="flex items-start space-x-2"
                whileHover={{ x: 5 }}
              >
                <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center flex-shrink-0 shadow-md">
                  <span className="text-white">🧘‍♀️</span>
                </div>
                <div>
                  <p className="text-sm font-semibold text-purple-800 dark:text-purple-200">Exercises</p>
                  <p className="text-xs text-purple-700 dark:text-purple-300">Safe routines</p>
                </div>
              </motion.div>
            </div>
          </Card>
        </motion.div>

        {/* Trust Badges */}
        <motion.div
          className="flex justify-center items-center space-x-6 mt-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
        >
          <div className="flex items-center space-x-2 text-sm text-muted-foreground">
            <Shield className="h-4 w-4 text-teal-600" />
            <span>Secure</span>
          </div>
          <div className="flex items-center space-x-2 text-sm text-muted-foreground">
            <Activity className="h-4 w-4 text-blue-600" />
            <span>Offline Ready</span>
          </div>
          <div className="flex items-center space-x-2 text-sm text-muted-foreground">
            <Stethoscope className="h-4 w-4 text-purple-600" />
            <span>Expert Care</span>
          </div>
        </motion.div>
      </div>
    </div>
  );
}