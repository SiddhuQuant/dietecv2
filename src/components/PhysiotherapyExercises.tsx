import { ArrowLeft, Play, Clock, Target, CheckCircle, RotateCcw, Youtube, ExternalLink } from "lucide-react";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Badge } from "./ui/badge";
import { Progress } from "./ui/progress";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { ThemeToggle } from "./ThemeToggle";
import { useState } from "react";
import chairExercisesImage from "figma:asset/b1ab25d8ba7835d4aff16d952e67a0acf1f36aa7.png";

interface PhysiotherapyExercisesProps {
  onBack: () => void;
  isDarkMode: boolean;
  onToggleTheme: () => void;
}

export function PhysiotherapyExercises({ onBack, isDarkMode, onToggleTheme }: PhysiotherapyExercisesProps) {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [completedExercises, setCompletedExercises] = useState<Set<string>>(new Set());

  const exerciseCategories = [
    {
      id: "breathing",
      title: "Breathing Exercises",
      description: "Improve lung capacity and reduce stress",
      duration: "5-10 mins",
      difficulty: "Easy",
      exercises: [
        {
          id: "deep-breathing",
          name: "Deep Breathing",
          duration: "5 minutes",
          steps: [
            "Sit comfortably with back straight",
            "Place one hand on chest, one on belly",
            "Breathe in slowly through nose for 4 counts",
            "Hold breath for 4 counts",
            "Exhale slowly through mouth for 6 counts",
            "Repeat 10-15 times"
          ],
          benefits: "Reduces stress, improves oxygen flow"
        },
        {
          id: "box-breathing",
          name: "Box Breathing",
          duration: "3 minutes",
          steps: [
            "Sit with feet flat on floor",
            "Inhale for 4 counts",
            "Hold for 4 counts", 
            "Exhale for 4 counts",
            "Hold empty for 4 counts",
            "Repeat cycle 8-10 times"
          ],
          benefits: "Calms nervous system, improves focus"
        }
      ]
    },
    {
      id: "stretching",
      title: "Gentle Stretching",
      description: "Improve flexibility and reduce stiffness",
      duration: "10-15 mins",
      difficulty: "Easy",
      exercises: [
        {
          id: "neck-stretch",
          name: "Neck Stretches",
          duration: "3 minutes",
          steps: [
            "Sit or stand with good posture",
            "Slowly tilt head to right shoulder",
            "Hold for 15-30 seconds",
            "Return to center",
            "Repeat on left side",
            "Do 3 sets each side"
          ],
          benefits: "Relieves neck tension and stiffness"
        },
        {
          id: "shoulder-rolls",
          name: "Shoulder Rolls",
          duration: "2 minutes",
          steps: [
            "Stand or sit with arms at sides",
            "Lift shoulders toward ears",
            "Roll shoulders back in circular motion",
            "Complete 10 backward circles",
            "Reverse direction for 10 forward circles",
            "Relax and repeat"
          ],
          benefits: "Reduces shoulder tension"
        }
      ]
    },
    {
      id: "walking",
      title: "Safe Walking Routines",
      description: "Low-impact cardiovascular exercise",
      duration: "15-30 mins",
      difficulty: "Moderate",
      exercises: [
        {
          id: "slow-walk",
          name: "Gentle Walking",
          duration: "15 minutes",
          steps: [
            "Start with 5 minutes warm-up walking",
            "Walk at comfortable pace",
            "Focus on good posture",
            "Swing arms naturally",
            "Take rest breaks as needed",
            "Cool down with slow walking"
          ],
          benefits: "Improves circulation, strengthens legs"
        },
        {
          id: "stair-climbing",
          name: "Stair Climbing",
          duration: "5-10 minutes",
          steps: [
            "Use handrail for support",
            "Step up with stronger leg first",
            "Step down with weaker leg first",
            "Go slowly and steadily",
            "Rest between sets",
            "Stop if feeling dizzy"
          ],
          benefits: "Builds leg strength and endurance"
        }
      ]
    },
    {
      id: "chair-exercises",
      title: "Chair Exercises",
      description: "Safe exercises for limited mobility",
      duration: "10-20 mins",
      difficulty: "Easy",
      exercises: [
        {
          id: "seated-marching",
          name: "Seated Marching",
          duration: "2 minutes",
          steps: [
            "Sit tall in sturdy chair",
            "Lift right knee up as high as comfortable",
            "Lower right foot to floor",
            "Lift left knee up",
            "Continue alternating legs",
            "March for 30 seconds, rest, repeat"
          ],
          benefits: "Improves circulation and leg strength"
        },
        {
          id: "arm-circles",
          name: "Seated Arm Circles",
          duration: "3 minutes",
          steps: [
            "Sit with back straight",
            "Extend arms out to sides",
            "Make small circles forward",
            "Do 10 circles, then reverse direction",
            "Rest arms down for 30 seconds",
            "Repeat 3 sets"
          ],
          benefits: "Improves shoulder flexibility"
        }
      ]
    },
    {
      id: "metabolism-yoga",
      title: "Improving Metabolism & Reducing Belly Fat",
      description: "Yoga poses to boost metabolism and reduce belly fat",
      duration: "12-18 mins",
      difficulty: "Moderate",
      exercises: [
        {
          id: "cobra-pose",
          name: "Cobra Pose (Bhujangasana)",
          duration: "4 minutes",
          videoUrl: "https://youtu.be/k48O2CxvZ3o?si=OWJMPMXzZb1zzYQ9",
          steps: [
            "Lie face down on mat, legs extended behind",
            "Place palms flat on floor under shoulders",
            "Press pelvis and tops of feet into floor",
            "Inhale and straighten arms to lift chest off floor",
            "Keep shoulders relaxed, away from ears",
            "Hold for 15-30 seconds, lower down slowly",
            "Repeat 3-4 times with breathing"
          ],
          benefits: "Strengthens spine, opens chest, stimulates abdominal organs, boosts metabolism"
        },
        {
          id: "bow-pose",
          name: "Bow Pose (Dhanurasana)",
          duration: "4 minutes",
          videoUrl: "https://youtu.be/eUC_cGLeEMQ?si=6EeWB9Mv8g149DZN",
          steps: [
            "Lie on stomach, feet hip-width apart, arms at sides",
            "Bend knees, bring heels toward buttocks",
            "Reach back and hold ankles with hands",
            "Inhale, lift chest and thighs off the floor",
            "Pull ankles to lift legs higher",
            "Hold for 15-20 seconds, breathing deeply",
            "Release slowly, rest for 15 seconds, repeat 2-3 times"
          ],
          benefits: "Stretches entire front body, strengthens back, massages abdominal organs, burns belly fat"
        },
        {
          id: "boat-pose",
          name: "Boat Pose (Navasana)",
          duration: "4 minutes",
          videoUrl: "https://youtu.be/AV7VHk5qlHg?si=wqv1SStVmtmY9vTI",
          steps: [
            "Sit on floor with knees bent, feet flat",
            "Lean back slightly, engage core muscles",
            "Lift feet off floor, shins parallel to ground",
            "Extend arms forward parallel to floor",
            "Straighten legs if comfortable (forming V-shape)",
            "Hold for 10-20 seconds, maintaining balance",
            "Lower down with control, repeat 3-5 times"
          ],
          benefits: "Strengthens core and hip flexors, improves digestion, burns belly fat, boosts metabolism"
        }
      ]
    },
    {
      id: "mindful-flow",
      title: "Mindful Body Flow",
      description: "Active stretching sequence for flexibility and awareness",
      duration: "15-25 mins",
      difficulty: "Moderate",
      exercises: [
        {
          id: "cat-cow-stretch",
          name: "Cat-Cow Stretch",
          duration: "3 minutes",
          steps: [
            "Start on hands and knees (tabletop position)",
            "Hands under shoulders, knees under hips",
            "Inhale: Arch back, lift head and tailbone (Cow)",
            "Exhale: Round spine, tuck chin to chest (Cat)",
            "Move slowly between positions",
            "Repeat 10-15 times, sync with breath"
          ],
          benefits: "Improves spine flexibility, relieves back tension"
        },
        {
          id: "downward-dog-modified",
          name: "Modified Downward Dog",
          duration: "2 minutes",
          steps: [
            "From hands and knees, tuck toes under",
            "Lift hips up and back, forming triangle shape",
            "Bend knees slightly if hamstrings are tight",
            "Press hands firmly into ground",
            "Lengthen spine, relax neck",
            "Hold for 30 seconds, rest, repeat 3 times"
          ],
          benefits: "Strengthens arms and shoulders, stretches back and legs"
        },
        {
          id: "child-pose",
          name: "Child's Pose (Balasana)",
          duration: "3 minutes",
          steps: [
            "Kneel on floor, big toes touching",
            "Sit back on heels",
            "Fold forward, rest forehead on ground",
            "Extend arms forward or rest beside body",
            "Breathe deeply into back",
            "Stay for 1-3 minutes for relaxation"
          ],
          benefits: "Gentle stretch for back, hips, thighs; calms mind"
        },
        {
          id: "standing-forward-bend",
          name: "Standing Forward Bend",
          duration: "2 minutes",
          steps: [
            "Stand with feet hip-width apart",
            "Inhale, lengthen spine",
            "Exhale, hinge at hips, fold forward",
            "Bend knees slightly to protect back",
            "Let arms hang or hold opposite elbows",
            "Sway gently, hold 30-60 seconds"
          ],
          benefits: "Stretches hamstrings and spine, calms nervous system"
        },
        {
          id: "seated-spinal-twist",
          name: "Seated Spinal Twist",
          duration: "4 minutes",
          steps: [
            "Sit cross-legged on floor or mat",
            "Place right hand behind you for support",
            "Left hand on right knee",
            "Inhale, lengthen spine",
            "Exhale, twist gently to the right",
            "Hold 30 seconds, repeat on other side",
            "Do 3 sets each side"
          ],
          benefits: "Improves spinal mobility, aids digestion"
        },
        {
          id: "hip-flexor-stretch",
          name: "Low Lunge (Hip Flexor Stretch)",
          duration: "4 minutes",
          steps: [
            "Start in tabletop position",
            "Step right foot forward between hands",
            "Lower left knee to ground (use cushion if needed)",
            "Keep right knee over ankle",
            "Lift torso upright, hands on front thigh",
            "Hold 30-45 seconds, switch sides",
            "Repeat 2-3 times each side"
          ],
          benefits: "Opens hip flexors, improves posture and balance"
        },
        {
          id: "bridge-pose",
          name: "Bridge Pose (Setu Bandhasana)",
          duration: "3 minutes",
          steps: [
            "Lie on back, knees bent, feet flat on floor",
            "Feet hip-width apart, arms by sides",
            "Press feet and arms into floor",
            "Lift hips toward ceiling",
            "Clasp hands under back if comfortable",
            "Hold 30 seconds, lower slowly, repeat 4 times"
          ],
          benefits: "Strengthens back and glutes, opens chest and shoulders"
        },
        {
          id: "supine-twist",
          name: "Supine Spinal Twist",
          duration: "4 minutes",
          steps: [
            "Lie on back, arms extended to sides",
            "Bring both knees to chest",
            "Lower knees to right side",
            "Keep shoulders flat on ground",
            "Turn head to left (opposite direction)",
            "Hold 1-2 minutes, switch sides"
          ],
          benefits: "Releases lower back tension, massages internal organs"
        }
      ]
    },
    {
      id: "strength-bodyweight",
      title: "Strength and Bodyweight Exercises",
      description: "Build strength with fundamental bodyweight movements",
      duration: "15-25 mins",
      difficulty: "Moderate",
      exercises: [
        {
          id: "squats",
          name: "Squats",
          duration: "5 minutes",
          videoUrl: "https://youtu.be/YaXPRqUwItQ?si=B8iy6DASfdpNqCe2",
          steps: [
            "Stand with feet shoulder-width apart",
            "Keep your chest up and core engaged",
            "Lower your body by bending knees and hips",
            "Go down until thighs are parallel to floor",
            "Push through heels to return to starting position",
            "Keep knees aligned with toes throughout",
            "Start with 10-15 reps, rest, repeat 3 sets"
          ],
          benefits: "Strengthens legs, glutes, and core; improves balance and mobility; builds lower body power"
        },
        {
          id: "plank",
          name: "Plank",
          duration: "3 minutes",
          videoUrl: "https://youtu.be/pvIjsG5Svck?si=POAyrK5uIW3rRly7",
          steps: [
            "Start in push-up position on forearms",
            "Keep elbows directly under shoulders",
            "Engage core and keep body in straight line",
            "Don't let hips sag or rise up",
            "Keep neck neutral, look at floor",
            "Hold for 20-30 seconds to start",
            "Rest 30 seconds, repeat 3-5 times"
          ],
          benefits: "Strengthens core, shoulders, and back; improves posture; enhances stability and balance"
        },
        {
          id: "lunges",
          name: "Lunges",
          duration: "5 minutes",
          videoUrl: "https://youtu.be/wrwwXE_x-pQ?si=2-4WvNzftPMkUJ0o",
          steps: [
            "Stand tall with feet hip-width apart",
            "Step forward with right leg",
            "Lower hips until both knees bent at 90°",
            "Keep front knee over ankle, not past toes",
            "Back knee should hover just above floor",
            "Push through front heel to return to start",
            "Alternate legs, do 10-12 reps each side, 3 sets"
          ],
          benefits: "Strengthens legs and glutes; improves balance and coordination; enhances hip flexibility"
        }
      ]
    }
  ];

  const toggleExerciseComplete = (exerciseId: string) => {
    const newCompleted = new Set(completedExercises);
    if (newCompleted.has(exerciseId)) {
      newCompleted.delete(exerciseId);
    } else {
      newCompleted.add(exerciseId);
    }
    setCompletedExercises(newCompleted);
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "Easy": return "bg-green-100 text-green-800";
      case "Moderate": return "bg-yellow-100 text-yellow-800";
      case "Hard": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  if (selectedCategory) {
    const category = exerciseCategories.find(c => c.id === selectedCategory);
    if (!category) return null;

    const categoryCompleted = category.exercises.filter(ex => completedExercises.has(ex.id)).length;
    const progressPercent = (categoryCompleted / category.exercises.length) * 100;

    return (
      <div className="min-h-screen bg-background p-4">
        <div className="max-w-md mx-auto">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center">
              <Button variant="ghost" size="sm" onClick={() => setSelectedCategory(null)} className="mr-2 p-2">
                <ArrowLeft className="h-4 w-4" />
              </Button>
              <h1 className="text-xl font-semibold text-foreground">{category.title}</h1>
            </div>
            <ThemeToggle isDarkMode={isDarkMode} onToggle={onToggleTheme} />
          </div>

          {/* Progress */}
          <Card className="p-4 mb-6 bg-white">
            <div className="flex items-center justify-between mb-2">
              <h2 className="font-semibold">Today's Progress</h2>
              <span className="text-sm text-gray-600">{categoryCompleted}/{category.exercises.length}</span>
            </div>
            <Progress value={progressPercent} className="mb-2" />
            <p className="text-sm text-gray-600">{Math.round(progressPercent)}% Complete</p>
          </Card>

          {/* Video Resource for Breathing Exercises */}
          {selectedCategory === 'breathing' && (
            <Card className="p-4 mb-4 bg-blue-50 border-blue-200">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center">
                  <Youtube className="h-6 w-6 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-blue-800 mb-1">Video Guide</h3>
                  <p className="text-sm text-blue-700">Professional breathing exercises tutorial</p>
                </div>
                <Button 
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                  onClick={() => window.open('https://youtu.be/oN8xV3Kb5-Q?si=ViBhhVSEAi_6RzXt', '_blank')}
                >
                  <Play className="h-4 w-4 mr-2" />
                  Watch
                  <ExternalLink className="h-3 w-3 ml-1" />
                </Button>
              </div>
              <p className="text-xs text-blue-600 mt-2">
                🎥 Follow along with expert-guided breathing techniques for better results
              </p>
            </Card>
          )}

          {/* Video Resource for Chair Exercises */}
          {selectedCategory === 'chair-exercises' && (
            <Card className="p-4 mb-4 bg-blue-50 border-blue-200">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center">
                  <Youtube className="h-6 w-6 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-blue-800 mb-1">Video Guide</h3>
                  <p className="text-sm text-blue-700">Chair exercises for limited mobility</p>
                </div>
                <Button 
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                  onClick={() => window.open('https://youtu.be/p7zik_Di5Lc?si=uDFrWpMT_40Xl9P5', '_blank')}
                >
                  <Play className="h-4 w-4 mr-2" />
                  Watch
                  <ExternalLink className="h-3 w-3 ml-1" />
                </Button>
              </div>
              <p className="text-xs text-blue-600 mt-2">
                🎥 Safe and effective exercises you can do from your chair
              </p>
            </Card>
          )}

          {/* Video Resource for Mindful Body Flow */}
          {selectedCategory === 'mindful-flow' && (
            <Card className="p-4 mb-4 bg-blue-50 border-blue-200">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
                  <Youtube className="h-6 w-6 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-blue-800 mb-1">Active Stretch Flow</h3>
                  <p className="text-sm text-blue-700">Complete guided stretching routine for flexibility</p>
                </div>
                <Button 
                  size="sm"
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                  onClick={() => window.open('https://youtu.be/7CTMm8z7kOA?si=C_tb-cokZO-QVuRV', '_blank')}
                >
                  Watch
                </Button>
              </div>
              <p className="text-xs text-blue-600 mt-2">
                🎥 Follow along with this mindful stretching flow for better flexibility and body awareness
              </p>
            </Card>
          )}

          {/* Video Resources for Metabolism Yoga Poses */}
          {selectedCategory === 'metabolism-yoga' && (
            <div className="space-y-3 mb-4">
              {/* Cobra Pose Video */}
              <Card className="p-4 bg-gradient-to-r from-orange-50 to-red-50 dark:from-orange-900/20 dark:to-red-900/20 border-orange-200 dark:border-orange-700">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-orange-600 rounded-full flex items-center justify-center flex-shrink-0">
                    <Youtube className="h-6 w-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-orange-800 dark:text-orange-200 mb-1">Cobra Pose Tutorial</h3>
                    <p className="text-sm text-orange-700 dark:text-orange-300">Learn proper form for Bhujangasana</p>
                  </div>
                  <Button 
                    size="sm"
                    className="bg-orange-600 hover:bg-orange-700 text-white"
                    onClick={() => window.open('https://youtu.be/k48O2CxvZ3o?si=OWJMPMXzZb1zzYQ9', '_blank')}
                  >
                    <Play className="h-3 w-3 mr-1" />
                    Watch
                  </Button>
                </div>
              </Card>

              {/* Bow Pose Video */}
              <Card className="p-4 bg-gradient-to-r from-rose-50 to-pink-50 dark:from-rose-900/20 dark:to-pink-900/20 border-rose-200 dark:border-rose-700">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-rose-600 rounded-full flex items-center justify-center flex-shrink-0">
                    <Youtube className="h-6 w-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-rose-800 dark:text-rose-200 mb-1">Bow Pose Tutorial</h3>
                    <p className="text-sm text-rose-700 dark:text-rose-300">Master the Dhanurasana technique</p>
                  </div>
                  <Button 
                    size="sm"
                    className="bg-rose-600 hover:bg-rose-700 text-white"
                    onClick={() => window.open('https://youtu.be/eUC_cGLeEMQ?si=6EeWB9Mv8g149DZN', '_blank')}
                  >
                    <Play className="h-3 w-3 mr-1" />
                    Watch
                  </Button>
                </div>
              </Card>

              {/* Boat Pose Video */}
              <Card className="p-4 bg-gradient-to-r from-teal-50 to-cyan-50 dark:from-teal-900/20 dark:to-cyan-900/20 border-teal-200 dark:border-teal-700">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-teal-600 rounded-full flex items-center justify-center flex-shrink-0">
                    <Youtube className="h-6 w-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-teal-800 dark:text-teal-200 mb-1">Boat Pose Tutorial</h3>
                    <p className="text-sm text-teal-700 dark:text-teal-300">Perfect your Navasana core workout</p>
                  </div>
                  <Button 
                    size="sm"
                    className="bg-teal-600 hover:bg-teal-700 text-white"
                    onClick={() => window.open('https://youtu.be/AV7VHk5qlHg?si=wqv1SStVmtmY9vTI', '_blank')}
                  >
                    <Play className="h-3 w-3 mr-1" />
                    Watch
                  </Button>
                </div>
              </Card>

              <p className="text-xs text-center text-muted-foreground mt-2">
                🎥 Watch all tutorials before starting for best results
              </p>
            </div>
          )}

          {/* Video Resources for Strength and Bodyweight Exercises */}
          {selectedCategory === 'strength-bodyweight' && (
            <div className="space-y-3 mb-4">
              {/* Squats Video */}
              <Card className="p-4 bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 border-indigo-200 dark:border-indigo-700">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-indigo-600 rounded-full flex items-center justify-center flex-shrink-0">
                    <Youtube className="h-6 w-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-indigo-800 dark:text-indigo-200 mb-1">Squats Tutorial</h3>
                    <p className="text-sm text-indigo-700 dark:text-indigo-300">Perfect your squat form and technique</p>
                  </div>
                  <Button 
                    size="sm"
                    className="bg-indigo-600 hover:bg-indigo-700 text-white"
                    onClick={() => window.open('https://youtu.be/YaXPRqUwItQ?si=B8iy6DASfdpNqCe2', '_blank')}
                  >
                    <Play className="h-3 w-3 mr-1" />
                    Watch
                  </Button>
                </div>
              </Card>

              {/* Plank Video */}
              <Card className="p-4 bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 border-blue-200 dark:border-blue-700">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
                    <Youtube className="h-6 w-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-blue-800 dark:text-blue-200 mb-1">Plank Tutorial</h3>
                    <p className="text-sm text-blue-700 dark:text-blue-300">Master core stability with proper plank form</p>
                  </div>
                  <Button 
                    size="sm"
                    className="bg-blue-600 hover:bg-blue-700 text-white"
                    onClick={() => window.open('https://youtu.be/pvIjsG5Svck?si=POAyrK5uIW3rRly7', '_blank')}
                  >
                    <Play className="h-3 w-3 mr-1" />
                    Watch
                  </Button>
                </div>
              </Card>

              {/* Lunges Video */}
              <Card className="p-4 bg-gradient-to-r from-violet-50 to-fuchsia-50 dark:from-violet-900/20 dark:to-fuchsia-900/20 border-violet-200 dark:border-violet-700">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-violet-600 rounded-full flex items-center justify-center flex-shrink-0">
                    <Youtube className="h-6 w-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-violet-800 dark:text-violet-200 mb-1">Lunges Tutorial</h3>
                    <p className="text-sm text-violet-700 dark:text-violet-300">Learn proper lunge technique for leg strength</p>
                  </div>
                  <Button 
                    size="sm"
                    className="bg-violet-600 hover:bg-violet-700 text-white"
                    onClick={() => window.open('https://youtu.be/wrwwXE_x-pQ?si=2-4WvNzftPMkUJ0o', '_blank')}
                  >
                    <Play className="h-3 w-3 mr-1" />
                    Watch
                  </Button>
                </div>
              </Card>

              <p className="text-xs text-center text-muted-foreground mt-2">
                🎥 Watch all video tutorials to learn proper form and avoid injury
              </p>
            </div>
          )}

          {/* Exercises List */}
          <div className="space-y-4">
            {category.exercises.map((exercise) => {
              const isCompleted = completedExercises.has(exercise.id);
              
              return (
                <Card key={exercise.id} className={`p-4 ${isCompleted ? 'bg-green-50 border-green-200' : 'bg-white'}`}>
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <h3 className={`font-semibold ${isCompleted ? 'text-green-800' : 'text-gray-800'}`}>
                        {exercise.name}
                      </h3>
                      <div className="flex items-center space-x-2 mt-1">
                        <Badge variant="secondary" className="text-xs">
                          <Clock className="h-3 w-3 mr-1" />
                          {exercise.duration}
                        </Badge>
                      </div>
                    </div>
                    <Button
                      variant={isCompleted ? "default" : "outline"}
                      size="sm"
                      className={isCompleted ? "bg-green-600 hover:bg-green-700" : ""}
                      onClick={() => toggleExerciseComplete(exercise.id)}
                    >
                      {isCompleted ? (
                        <CheckCircle className="h-4 w-4" />
                      ) : (
                        <Target className="h-4 w-4" />
                      )}
                    </Button>
                  </div>

                  <p className="text-sm text-green-600 mb-3">{exercise.benefits}</p>

                  <div className="space-y-2">
                    <h4 className="font-medium text-sm">Steps:</h4>
                    <ol className="text-sm text-gray-700 space-y-1">
                      {exercise.steps.map((step, stepIndex) => (
                        <li key={stepIndex} className="flex">
                          <span className="w-5 h-5 bg-purple-100 text-purple-600 rounded-full text-xs flex items-center justify-center mr-2 mt-0.5 flex-shrink-0">
                            {stepIndex + 1}
                          </span>
                          <span className="flex-1">{step}</span>
                        </li>
                      ))}
                    </ol>
                  </div>
                </Card>
              );
            })}
          </div>

          {/* Safety Tips */}
          <Card className="p-4 mt-6 bg-yellow-50 border-yellow-200">
            <h2 className="font-semibold mb-3 text-yellow-800">Safety Tips</h2>
            <ul className="text-sm text-yellow-700 space-y-1">
              {selectedCategory === 'mindful-flow' ? (
                <>
                  <li>• Use a yoga mat or soft surface for comfort</li>
                  <li>• Never force your body into painful positions</li>
                  <li>• Modify poses by bending knees or using props (cushions, blocks)</li>
                  <li>• Breathe deeply and continuously - never hold your breath</li>
                  <li>• Move slowly and mindfully between poses</li>
                  <li>• If you have wrist issues, do poses on forearms instead</li>
                  <li>• Avoid inversions if you have high blood pressure</li>
                  <li>• Stop immediately if you feel sharp pain or dizziness</li>
                  <li>• Warm up with gentle movements before starting</li>
                  <li>• Listen to your body - skip poses that feel uncomfortable</li>
                </>
              ) : selectedCategory === 'metabolism-yoga' ? (
                <>
                  <li>• Use a yoga mat for cushioning and grip</li>
                  <li>• Warm up for 5-10 minutes before starting these poses</li>
                  <li>• Avoid these poses if pregnant or have back injuries</li>
                  <li>• Don't practice immediately after eating (wait 2-3 hours)</li>
                  <li>• Breathe normally - never hold your breath during poses</li>
                  <li>• For Cobra & Bow: Keep elbows slightly bent to avoid strain</li>
                  <li>• For Boat Pose: Start with bent knees if you're a beginner</li>
                  <li>• Stop if you feel sharp pain in spine, neck, or abdomen</li>
                  <li>• Practice consistently for best metabolism results</li>
                  <li>• Combine with healthy diet for effective belly fat reduction</li>
                </>
              ) : selectedCategory === 'strength-bodyweight' ? (
                <>
                  <li>• Warm up for 5-10 minutes before starting (light cardio, arm circles)</li>
                  <li>• For Squats: Keep knees behind toes, back straight, chest up</li>
                  <li>• For Plank: Don't let hips sag or pike up - maintain straight line</li>
                  <li>• For Lunges: Ensure front knee stays aligned with ankle</li>
                  <li>• Start with fewer reps if you're a beginner (5-8 reps per set)</li>
                  <li>• Rest 30-60 seconds between sets</li>
                  <li>• Breathe normally - exhale on exertion, inhale on recovery</li>
                  <li>• Stop if you feel sharp joint pain (muscle burn is normal)</li>
                  <li>• Use a mat or soft surface for comfort during planks</li>
                  <li>• Progress gradually - add reps/duration weekly as you get stronger</li>
                  <li>• Stay hydrated and allow 48 hours rest between strength sessions</li>
                </>
              ) : (
                <>
                  <li>• Stop if you feel pain or dizziness</li>
                  <li>• Start slowly and gradually increase intensity</li>
                  <li>• Breathe normally during exercises</li>
                  <li>• Stay hydrated</li>
                  <li>• Consult doctor if you have health concerns</li>
                </>
              )}
            </ul>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-md mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <Button variant="ghost" size="sm" onClick={onBack} className="mr-2 p-2">
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <h1 className="text-xl font-semibold text-foreground">Physiotherapy Exercises</h1>
          </div>
          <ThemeToggle isDarkMode={isDarkMode} onToggle={onToggleTheme} />
        </div>

        {/* Daily Goal */}
        <Card className="p-4 mb-6 bg-gradient-to-r from-purple-100 to-pink-100 border-purple-200">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-purple-600 rounded-full flex items-center justify-center">
              <Target className="h-6 w-6 text-white" />
            </div>
            <div>
              <h2 className="font-semibold text-purple-800">Today's Goal</h2>
              <p className="text-sm text-purple-700">Complete 15 minutes of gentle exercise</p>
            </div>
          </div>
        </Card>

        {/* Exercise Categories */}
        <div className="space-y-4">
          <h2 className="font-semibold text-gray-800">Choose Exercise Type</h2>
          
          {exerciseCategories.map((category) => (
            <Card 
              key={category.id}
              className="p-4 bg-white shadow-md cursor-pointer hover:shadow-lg transition-shadow"
              onClick={() => setSelectedCategory(category.id)}
            >
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 rounded-lg overflow-hidden bg-purple-100 flex items-center justify-center">
                  {category.id === 'chair-exercises' ? (
                    <ImageWithFallback 
                      src={chairExercisesImage}
                      alt={category.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <ImageWithFallback 
                      src="https://images.unsplash.com/photo-1658279445014-dcc466ac1192?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxlbGRlcmx5JTIwZXhlcmNpc2UlMjB5b2dhJTIwc3RyZXRjaGluZ3xlbnwxfHx8fDE3NTc2ODM5NzF8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                      alt={category.title}
                      className="w-full h-full object-cover"
                    />
                  )}
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-800 mb-1">{category.title}</h3>
                  <p className="text-sm text-gray-600 mb-2">{category.description}</p>
                  
                  <div className="flex space-x-2">
                    <Badge variant="secondary" className="text-xs">
                      <Clock className="h-3 w-3 mr-1" />
                      {category.duration}
                    </Badge>
                    <Badge className={`text-xs ${getDifficultyColor(category.difficulty)}`}>
                      {category.difficulty}
                    </Badge>
                  </div>
                </div>
                <div className="text-purple-600">
                  <Play className="h-5 w-5" />
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Weekly Summary */}
        <Card className="p-4 mt-6 bg-blue-50 border-blue-200">
          <h2 className="font-semibold mb-3 text-blue-800">This Week's Activity</h2>
          <div className="grid grid-cols-7 gap-1 mb-3">
            {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((day, index) => (
              <div key={index} className="text-center">
                <div className="text-xs text-blue-600 mb-1">{day}</div>
                <div className={`w-6 h-6 rounded-full mx-auto ${
                  index < 3 ? 'bg-blue-600' : index === 3 ? 'bg-blue-300' : 'bg-gray-200'
                }`}></div>
              </div>
            ))}
          </div>
          <p className="text-sm text-blue-700">4 days active this week. Keep going!</p>
        </Card>

        {/* Reset Progress */}
        <Button 
          variant="outline" 
          className="w-full mt-4"
          onClick={() => setCompletedExercises(new Set())}
        >
          <RotateCcw className="h-4 w-4 mr-2" />
          Reset Today's Progress
        </Button>
      </div>
    </div>
  );
}