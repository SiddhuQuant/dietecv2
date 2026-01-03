import { ArrowLeft, Search, HelpCircle, AlertTriangle, Heart, Thermometer, Pill, Baby, Users, Eye } from "lucide-react";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Badge } from "./ui/badge";
import { Input } from "./ui/input";
import { Alert, AlertDescription } from "./ui/alert";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "./ui/accordion";
import { useState } from "react";

interface MedicalDoubtsProps {
  onBack: () => void;
}

interface MedicalQuestion {
  id: string;
  question: string;
  answer: string;
  category: string;
  severity: 'info' | 'warning' | 'emergency';
  tags: string[];
}

export function MedicalDoubts({ onBack }: MedicalDoubtsProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  const categories = [
    { id: "all", name: "All Questions", icon: HelpCircle },
    { id: "general", name: "General Health", icon: Heart },
    { id: "fever", name: "Fever & Cold", icon: Thermometer },
    { id: "medication", name: "Medicines", icon: Pill },
    { id: "children", name: "Child Health", icon: Baby },
    { id: "elderly", name: "Elderly Care", icon: Users },
    { id: "eyes", name: "Eye Problems", icon: Eye }
  ];

  const medicalQuestions: MedicalQuestion[] = [
    // General Health
    {
      id: "1",
      question: "What should be normal blood pressure for adults?",
      answer: "Normal blood pressure for adults is typically 120/80 mmHg or lower. High blood pressure (hypertension) is 140/90 mmHg or higher. If your blood pressure is consistently high, consult a doctor. You can help maintain healthy blood pressure by reducing salt intake, exercising regularly, maintaining healthy weight, and managing stress.",
      category: "general",
      severity: "info",
      tags: ["blood pressure", "hypertension", "heart health"]
    },
    {
      id: "2",
      question: "When should I be worried about chest pain?",
      answer: "Seek immediate medical attention if chest pain is accompanied by: difficulty breathing, sweating, nausea, pain radiating to arm/jaw/back, dizziness, or if pain is severe and sudden. Even mild chest pain that persists should be evaluated by a doctor. Never ignore chest pain, especially if you have risk factors like diabetes, high blood pressure, or family history of heart disease.",
      category: "general",
      severity: "emergency",
      tags: ["chest pain", "heart attack", "emergency"]
    },
    {
      id: "3",
      question: "How much water should I drink daily?",
      answer: "Adults should aim for 8-10 glasses (2-2.5 liters) of water daily. Increase intake during hot weather, illness, or physical activity. Signs of good hydration include pale yellow urine, moist lips, and good energy levels. Dark yellow urine, dry mouth, or headaches may indicate dehydration.",
      category: "general",
      severity: "info",
      tags: ["water", "hydration", "health"]
    },
    
    // Fever & Cold
    {
      id: "4",
      question: "When is fever dangerous and needs immediate care?",
      answer: "Seek immediate medical care if: fever is 103°F (39.4°C) or higher, fever lasts more than 3 days, accompanied by severe headache, difficulty breathing, chest pain, persistent vomiting, or signs of dehydration. For children under 3 months, any fever requires immediate medical attention.",
      category: "fever",
      severity: "warning",
      tags: ["fever", "temperature", "emergency", "children"]
    },
    {
      id: "5",
      question: "How can I treat common cold at home?",
      answer: "Rest plenty, drink warm fluids (water, herbal tea, warm soup), gargle with salt water, use steam inhalation, eat nutritious foods. Honey can soothe throat (not for children under 1 year). Avoid antibiotics for viral colds. See a doctor if symptoms worsen after 7 days or if you develop high fever, severe headache, or difficulty breathing.",
      category: "fever",
      severity: "info",
      tags: ["cold", "home remedies", "treatment"]
    },
    {
      id: "6",
      question: "What's the difference between viral and bacterial infections?",
      answer: "Viral infections: Usually start gradually, cause body aches, fatigue, clear nasal discharge. Antibiotics don't work. Bacterial infections: Often sudden onset, may cause fever, thick/colored mucus, localized pain. May need antibiotics. Only a doctor can determine which type you have through examination.",
      category: "fever",
      severity: "info",
      tags: ["viral", "bacterial", "infection", "antibiotics"]
    },

    // Medication
    {
      id: "7",
      question: "Is it safe to take medicines after expiry date?",
      answer: "No, never take expired medicines. They may lose effectiveness or become harmful. Some medicines like insulin or heart medications can be dangerous when expired. Always check expiry dates before taking any medicine. Store medicines in cool, dry places away from direct sunlight and children's reach.",
      category: "medication",
      severity: "warning",
      tags: ["expired medicine", "safety", "storage"]
    },
    {
      id: "8",
      question: "Can I stop antibiotics if I feel better?",
      answer: "No, always complete the full course of antibiotics as prescribed, even if you feel better. Stopping early can cause the infection to return stronger and may lead to antibiotic resistance. If you experience side effects, contact your doctor rather than stopping the medicine yourself.",
      category: "medication",
      severity: "warning",
      tags: ["antibiotics", "treatment", "resistance"]
    },
    {
      id: "9",
      question: "What should I do if I miss a dose of my medicine?",
      answer: "Take the missed dose as soon as you remember, unless it's almost time for the next dose. Never take a double dose to make up for a missed one. For critical medicines like heart or diabetes medications, contact your doctor if you miss doses frequently. Set reminders to help remember your medicines.",
      category: "medication",
      severity: "info",
      tags: ["missed dose", "medication schedule", "reminders"]
    },

    // Child Health
    {
      id: "10",
      question: "When should I worry about my child's fever?",
      answer: "For babies under 3 months: Any fever needs immediate medical care. For 3-6 months: Fever over 101°F (38.3°C). For older children: Fever over 104°F (40°C), fever lasting more than 3 days, difficulty breathing, severe headache, neck stiffness, persistent vomiting, or if child seems very sick or unusually drowsy.",
      category: "children",
      severity: "warning",
      tags: ["child fever", "babies", "pediatric", "emergency"]
    },
    {
      id: "11",
      question: "How can I tell if my child is dehydrated?",
      answer: "Signs of dehydration in children: dry mouth and tongue, no tears when crying, sunken eyes, no wet diapers for 6+ hours (babies), dark yellow urine, unusual sleepiness or fussiness. Severe dehydration is a medical emergency. Give small, frequent sips of water or oral rehydration solution.",
      category: "children",
      severity: "warning",
      tags: ["dehydration", "children", "fluids"]
    },
    {
      id: "12",
      question: "What vaccines are essential for children?",
      answer: "Essential vaccines include: BCG (tuberculosis), DPT (diphtheria, pertussis, tetanus), Polio, MMR (measles, mumps, rubella), Hepatitis B, and others as per national immunization schedule. Vaccines prevent serious diseases and protect community health. Follow your doctor's vaccination schedule and keep records safe.",
      category: "children",
      severity: "info",
      tags: ["vaccination", "immunization", "prevention"]
    },

    // Elderly Care
    {
      id: "13",
      question: "What are warning signs of stroke in elderly?",
      answer: "Remember FAST: Face drooping, Arm weakness, Speech difficulty, Time to call emergency (108). Other signs: sudden confusion, trouble seeing, severe headache, difficulty walking. Stroke is a medical emergency - every minute matters. Do not give food, water, or medicine. Call 108 immediately.",
      category: "elderly",
      severity: "emergency",
      tags: ["stroke", "elderly", "emergency", "FAST"]
    },
    {
      id: "14",
      question: "How can elderly prevent falls at home?",
      answer: "Remove loose rugs, ensure good lighting, install grab bars in bathroom, wear proper footwear, keep floors clear of clutter, use night lights, exercise regularly for balance and strength. Check medicines that may cause dizziness. Regular eye check-ups are important. Consider using walking aids if needed.",
      category: "elderly",
      severity: "info",
      tags: ["falls", "elderly", "home safety", "prevention"]
    },
    {
      id: "15",
      question: "How often should elderly people see a doctor?",
      answer: "Generally, elderly should have check-ups every 6 months, or more frequently if they have chronic conditions like diabetes or heart disease. Annual screenings for blood pressure, cholesterol, diabetes, and cancer are important. Don't ignore new symptoms or changes in health - see doctor promptly.",
      category: "elderly",
      severity: "info",
      tags: ["elderly", "check-ups", "screening", "healthcare"]
    },

    // Eye Problems
    {
      id: "16",
      question: "When should I worry about eye redness?",
      answer: "See a doctor immediately if eye redness is accompanied by: severe pain, vision changes, light sensitivity, discharge with fever, or injury. Mild redness from dust or tiredness usually improves with rest and clean water rinse. Persistent redness for more than 2-3 days should be evaluated.",
      category: "eyes",
      severity: "warning",
      tags: ["red eyes", "eye pain", "vision"]
    },
    {
      id: "17",
      question: "How can I protect my eyes from screen strain?",
      answer: "Follow 20-20-20 rule: Every 20 minutes, look at something 20 feet away for 20 seconds. Ensure good lighting, keep screen 20-24 inches away, blink frequently, adjust screen brightness to match surroundings. Take regular breaks and ensure adequate sleep.",
      category: "eyes",
      severity: "info",
      tags: ["screen time", "eye strain", "computer vision"]
    },
    {
      id: "18",
      question: "What causes sudden vision loss?",
      answer: "Sudden vision loss is a medical emergency. Causes may include: stroke, detached retina, blood clot, severe glaucoma, or eye injury. Do not wait - seek immediate medical attention. Cover the affected eye gently and avoid rubbing. Time is critical for preserving vision.",
      category: "eyes",
      severity: "emergency",
      tags: ["vision loss", "emergency", "blindness"]
    }
  ];

  const filteredQuestions = medicalQuestions.filter(q => {
    const matchesSearch = q.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         q.answer.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         q.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory = selectedCategory === "all" || q.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'emergency': return 'bg-red-100 text-red-800 border-red-200';
      case 'warning': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'info': return 'bg-blue-100 text-blue-800 border-blue-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'emergency': return <AlertTriangle className="h-4 w-4 text-red-600" />;
      case 'warning': return <AlertTriangle className="h-4 w-4 text-yellow-600" />;
      default: return <HelpCircle className="h-4 w-4 text-blue-600" />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 p-4">
      <div className="max-w-md mx-auto">
        {/* Header */}
        <div className="flex items-center mb-6">
          <Button variant="ghost" size="sm" onClick={onBack} className="mr-2 p-2">
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-xl font-semibold">Medical Doubts & Q&A</h1>
            <p className="text-sm text-gray-600">Get answers to common health questions</p>
          </div>
        </div>

        {/* Emergency Notice */}
        <Alert className="mb-6 border-red-200 bg-red-50">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription className="text-red-800">
            <strong>Emergency:</strong> For serious symptoms, call 108 immediately. This is for general information only.
          </AlertDescription>
        </Alert>

        {/* Search */}
        <div className="relative mb-6">
          <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search medical questions..."
            className="pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* Categories */}
        <div className="mb-6">
          <div className="flex space-x-2 overflow-x-auto pb-2">
            {categories.map((category) => {
              const IconComponent = category.icon;
              return (
                <Button
                  key={category.id}
                  variant={selectedCategory === category.id ? "default" : "outline"}
                  size="sm"
                  className="whitespace-nowrap"
                  onClick={() => setSelectedCategory(category.id)}
                >
                  <IconComponent className="h-4 w-4 mr-1" />
                  {category.name}
                </Button>
              );
            })}
          </div>
        </div>

        {/* Questions */}
        <div className="space-y-4">
          {filteredQuestions.length === 0 ? (
            <Card className="p-6 text-center">
              <HelpCircle className="h-12 w-12 text-gray-400 mx-auto mb-3" />
              <p className="text-gray-600">No questions found matching your search.</p>
            </Card>
          ) : (
            <Accordion type="single" collapsible className="space-y-3">
              {filteredQuestions.map((question) => (
                <Card key={question.id} className="overflow-hidden">
                  <AccordionItem value={question.id} className="border-none">
                    <AccordionTrigger className="px-4 py-3 hover:no-underline">
                      <div className="flex items-start space-x-3 text-left">
                        {getSeverityIcon(question.severity)}
                        <div className="flex-1">
                          <p className="font-medium text-sm">{question.question}</p>
                          <div className="flex items-center space-x-2 mt-1">
                            <Badge className={`text-xs ${getSeverityColor(question.severity)}`}>
                              {question.severity}
                            </Badge>
                            <span className="text-xs text-gray-500 capitalize">
                              {categories.find(c => c.id === question.category)?.name}
                            </span>
                          </div>
                        </div>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="px-4 pb-4">
                      <div className="text-sm text-gray-700 leading-relaxed">
                        {question.answer}
                      </div>
                      <div className="mt-3 pt-3 border-t border-gray-100">
                        <div className="flex flex-wrap gap-1">
                          {question.tags.map((tag, index) => (
                            <Badge key={index} variant="secondary" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                </Card>
              ))}
            </Accordion>
          )}
        </div>

        {/* Bottom Note */}
        <Card className="p-4 mt-6 bg-yellow-50 border-yellow-200">
          <h3 className="font-semibold text-yellow-800 mb-2">Important Note</h3>
          <p className="text-sm text-yellow-700">
            This information is for educational purposes only and doesn't replace professional medical advice. 
            Always consult with healthcare providers for proper diagnosis and treatment.
          </p>
        </Card>

        {/* Quick Contact */}
        <Card className="p-4 mt-4 bg-green-50 border-green-200">
          <h3 className="font-semibold text-green-800 mb-2">Need More Help?</h3>
          <div className="space-y-2">
            <Button 
              variant="outline" 
              size="sm" 
              className="w-full border-green-300 text-green-700"
              onClick={() => window.open('tel:102')}
            >
              Call Health Helpline: 102
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              className="w-full border-green-300 text-green-700"
              onClick={onBack}
            >
              Connect with Local Doctor
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}