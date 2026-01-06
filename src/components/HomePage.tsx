import { Heart, Phone, Utensils, Activity, FileText, LogOut, HelpCircle, UserCheck, Stethoscope, Droplets, Calendar, Syringe, TrendingUp, CreditCard, Pill } from "lucide-react";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { StepsTracker } from "./StepsTracker";
import { ThemeToggle } from "./ThemeToggle";
import { ProfileCompletionBanner } from "./ProfileCompletionBanner";
import { TestBookingComponent } from "./TestBookingComponent";
import { DoctorBookingComponent } from "./DoctorBookingComponent";
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

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border bg-card">
        <div className="max-w-4xl mx-auto px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 bg-teal-600 rounded-lg flex items-center justify-center">
                <Heart className="h-5 w-5 text-white" fill="white" />
              </div>
              <div>
                <h1 className="text-lg font-bold text-foreground">DIETEC</h1>
                <p className="text-xs text-muted-foreground">Health Dashboard</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <ThemeToggle isDarkMode={isDarkMode} onToggle={onToggleTheme} />
              <Button variant="outline" size="sm" onClick={onLogout}>
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-6 lg:px-8 py-6">
        {/* Welcome */}
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-foreground mb-1">Welcome back, {userName}</h2>
            <p className="text-sm text-muted-foreground">Manage your health services</p>
          </div>
          <Card className="p-5 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/30 dark:to-emerald-950/20 border-green-200 dark:border-green-900/40 flex-shrink-0">
            <StepsTracker userName={userName} />
          </Card>
        </div>

        {/* Profile Banner */}
        {showProfileBanner && onCompleteProfile && (
          <div className="mb-6">
            <ProfileCompletionBanner 
              onCompleteProfile={onCompleteProfile}
              userName={userName}
            />
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Main - 3 cols */}
          <div className="lg:col-span-3 space-y-6">
            {/* Priority Actions */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card 
                className="p-5 hover:shadow-md transition-all cursor-pointer border-orange-200 dark:border-orange-900/40 bg-gradient-to-br from-orange-50 to-white dark:from-orange-950/30 dark:to-background"
                onClick={() => onNavigate('book-tests')}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="h-12 w-12 bg-orange-100 dark:bg-orange-900/50 rounded-xl flex items-center justify-center">
                    <Syringe className="h-6 w-6 text-orange-600 dark:text-orange-400" />
                  </div>
                  <span className="text-2xl">🧪</span>
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-1">Book Lab Tests</h3>
                <p className="text-sm text-muted-foreground">Schedule medical tests</p>
              </Card>

              <Card 
                className="p-5 hover:shadow-md transition-all cursor-pointer border-blue-200 dark:border-blue-900/40 bg-gradient-to-br from-blue-50 to-white dark:from-blue-950/30 dark:to-background"
                onClick={() => onNavigate('book-appointments')}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="h-12 w-12 bg-blue-100 dark:bg-blue-900/50 rounded-xl flex items-center justify-center">
                    <Calendar className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                  </div>
                  <span className="text-2xl">📅</span>
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-1">Doctor Appointment</h3>
                <p className="text-sm text-muted-foreground">Consult specialists</p>
              </Card>

              <Card 
                className="p-5 hover:shadow-md transition-all cursor-pointer border-purple-200 dark:border-purple-900/40 bg-gradient-to-br from-purple-50 to-white dark:from-purple-950/30 dark:to-background"
                onClick={() => onNavigate('billing')}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="h-12 w-12 bg-purple-100 dark:bg-purple-900/50 rounded-xl flex items-center justify-center">
                    <CreditCard className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                  </div>
                  <span className="text-2xl">💳</span>
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-1">Billing</h3>
                <p className="text-sm text-muted-foreground">View bills & payments</p>
              </Card>

              <Card 
                className="p-5 hover:shadow-md transition-all cursor-pointer border-cyan-200 dark:border-cyan-900/40 bg-gradient-to-br from-cyan-50 to-white dark:from-cyan-950/30 dark:to-background"
                onClick={() => onNavigate('medicines')}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="h-12 w-12 bg-cyan-100 dark:bg-cyan-900/50 rounded-xl flex items-center justify-center">
                    <Pill className="h-6 w-6 text-cyan-600 dark:text-cyan-400" />
                  </div>
                  <span className="text-2xl">💊</span>
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-1">Medicines</h3>
                <p className="text-sm text-muted-foreground">Order medicines online</p>
              </Card>
            </div>

            {/* Health Services */}
            <div>
              <h3 className="text-base font-semibold text-foreground mb-3">Health Services</h3>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { id: 'personal-doctor', title: 'Personal Doctor', icon: UserCheck, color: 'blue' },
                  { id: 'medical', title: 'Medical History', icon: FileText, color: 'teal' },
                  { id: 'doubts', title: 'Medical Q&A', icon: HelpCircle, color: 'indigo' },
                  { id: 'diet', title: 'Nutrition', icon: Utensils, color: 'green' },
                  { id: 'firstaid', title: 'First Aid', icon: Heart, color: 'red' },
                  { id: 'exercises', title: 'Exercises', icon: Activity, color: 'purple' }
                ].map((service) => {
                  const Icon = service.icon;
                  return (
                    <Card 
                      key={service.id}
                      className="p-4 hover:shadow-sm transition-all cursor-pointer bg-card"
                      onClick={() => onNavigate(service.id)}
                    >
                      <div className="flex flex-col items-center text-center gap-2">
                        <div className={`h-12 w-12 bg-${service.color}-100 dark:bg-${service.color}-900/40 rounded-xl flex items-center justify-center`}>
                          <Icon className={`h-6 w-6 text-${service.color}-600 dark:text-${service.color}-400`} />
                        </div>
                        <h4 className="text-sm font-medium text-foreground">{service.title}</h4>
                      </div>
                    </Card>
                  );
                })}
              </div>
            </div>

            {/* Featured Services */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card 
                className="p-5 hover:shadow-md transition-all cursor-pointer border-emerald-200 dark:border-emerald-900/40 bg-gradient-to-br from-emerald-50 to-white dark:from-emerald-950/30 dark:to-background"
                onClick={() => onNavigate('medicaladvisor')}
              >
                <div className="flex items-start gap-3">
                  <div className="h-11 w-11 bg-emerald-100 dark:bg-emerald-900/50 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Stethoscope className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                  </div>
                  <div>
                    <h3 className="text-base font-semibold text-foreground mb-1">Treatment Advisor</h3>
                    <p className="text-sm text-muted-foreground">Global treatments & hospitals</p>
                  </div>
                </div>
              </Card>

              <Card 
                className="p-5 hover:shadow-md transition-all cursor-pointer border-red-200 dark:border-red-900/40 bg-gradient-to-br from-red-50 to-white dark:from-red-950/30 dark:to-background"
                onClick={() => onNavigate('doctor')}
              >
                <div className="flex items-start gap-3">
                  <div className="h-11 w-11 bg-red-100 dark:bg-red-900/50 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Phone className="h-5 w-5 text-red-600 dark:text-red-400" />
                  </div>
                  <div>
                    <h3 className="text-base font-semibold text-foreground mb-1">Emergency Call</h3>
                    <p className="text-sm text-muted-foreground">24/7 urgent care</p>
                  </div>
                </div>
              </Card>
            </div>
          </div>

          {/* Sidebar - 1 col */}
          <div className="space-y-4">
            {/* Stats */}
            <Card className="p-5 bg-gradient-to-br from-card to-card/80 border-teal-200/30 dark:border-teal-900/30">
              <h3 className="text-sm font-semibold text-foreground mb-4 flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-teal-600" />
                Quick Stats
              </h3>
              <div className="space-y-4">
                <div className="bg-gradient-to-br from-teal-50 to-cyan-50 dark:from-teal-950/20 dark:to-cyan-950/20 rounded-xl p-3 border border-teal-100/50 dark:border-teal-900/30">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <div className="h-10 w-10 bg-teal-100 dark:bg-teal-900/50 rounded-lg flex items-center justify-center">
                        <Activity className="h-5 w-5 text-teal-600 dark:text-teal-400" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-foreground">Steps</p>
                        <p className="text-xs text-muted-foreground">Today</p>
                      </div>
                    </div>
                    <span className="text-lg font-bold text-teal-600 dark:text-teal-400">8.4K</span>
                  </div>
                  <div className="w-full bg-teal-200 dark:bg-teal-900/30 rounded-full h-1.5">
                    <div className="bg-gradient-to-r from-teal-500 to-cyan-500 h-1.5 rounded-full" style={{ width: '84%' }}></div>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1.5">5.5K steps to goal</p>
                </div>

                <div className="bg-gradient-to-br from-red-50 to-pink-50 dark:from-red-950/20 dark:to-pink-950/20 rounded-xl p-3 border border-red-100/50 dark:border-red-900/30">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <div className="h-10 w-10 bg-red-100 dark:bg-red-900/50 rounded-lg flex items-center justify-center">
                        <Heart className="h-5 w-5 text-red-600 dark:text-red-400" fill="currentColor" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-foreground">Heart Rate</p>
                        <p className="text-xs text-muted-foreground">Normal</p>
                      </div>
                    </div>
                    <span className="text-lg font-bold text-red-600 dark:text-red-400">72 BPM</span>
                  </div>
                  <div className="w-full bg-red-200 dark:bg-red-900/30 rounded-full h-1.5">
                    <div className="bg-gradient-to-r from-red-500 to-pink-500 h-1.5 rounded-full" style={{ width: '60%' }}></div>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-950/20 dark:to-cyan-950/20 rounded-xl p-3 border border-blue-100/50 dark:border-blue-900/30">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <div className="h-10 w-10 bg-blue-100 dark:bg-blue-900/50 rounded-lg flex items-center justify-center">
                        <Droplets className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-foreground">Hydration</p>
                        <p className="text-xs text-muted-foreground">Daily Goal</p>
                      </div>
                    </div>
                    <span className="text-lg font-bold text-blue-600 dark:text-blue-400">75%</span>
                  </div>
                  <div className="w-full bg-blue-200 dark:bg-blue-900/30 rounded-full h-1.5">
                    <div className="bg-gradient-to-r from-blue-500 to-cyan-500 h-1.5 rounded-full" style={{ width: '75%' }}></div>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1.5">1 more glass to go</p>
                </div>
              </div>
            </Card>

            {/* Tip */}
            <Card className="p-4 bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-950/20 dark:to-orange-950/20 border-amber-200 dark:border-amber-800/30">
              <div className="flex items-start gap-2">
                <span className="text-lg">💡</span>
                <div>
                  <h4 className="text-xs font-semibold text-foreground mb-1">Daily Tip</h4>
                  <p className="text-xs text-muted-foreground">Stay hydrated - drink 8 glasses daily</p>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
