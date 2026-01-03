import { ArrowLeft, User, Heart, AlertTriangle, Plus, Edit, Save, X, Scan, Camera, Upload, FileText, Loader2 } from "lucide-react";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Badge } from "./ui/badge";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Checkbox } from "./ui/checkbox";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { ThemeToggle } from "./ThemeToggle";
import { useState, useEffect } from "react";
import { supabase } from "../utils/supabase/client";
import { projectId } from "../utils/supabase/info";
import { userProfileService } from "../services/userProfileService";

interface MedicalHistoryProps {
  onBack: () => void;
  userName: string;
  isDarkMode: boolean;
  onToggleTheme: () => void;
}

interface MedicalCondition {
  id: string;
  name: string;
  diagnosedDate: string;
  severity: 'mild' | 'moderate' | 'severe';
  notes: string;
}

interface Allergy {
  id: string;
  allergen: string;
  type: string;
  severity: 'mild' | 'moderate' | 'severe';
  symptoms: string[];
  notes: string;
}

interface SkinProblem {
  id: string;
  condition: string;
  bodyPart: string;
  severity: 'mild' | 'moderate' | 'severe';
  duration: string;
  treatment: string;
  notes: string;
}

export function MedicalHistory({ onBack, userName, isDarkMode, onToggleTheme }: MedicalHistoryProps) {
  const [activeTab, setActiveTab] = useState<'overview' | 'conditions' | 'allergies' | 'skin'>('overview');
  const [isEditing, setIsEditing] = useState(false);
  const [showScanner, setShowScanner] = useState(false);
  const [showManualEntry, setShowManualEntry] = useState(false);
  const [manualEntryType, setManualEntryType] = useState<'condition' | 'allergy' | 'skin' | null>(null);
  const [scanType, setScanType] = useState<'camera' | 'upload' | null>(null);
  const [scannedData, setScannedData] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);

  // Form states for manual entry
  const [newCondition, setNewCondition] = useState<Partial<MedicalCondition>>({
    name: '',
    diagnosedDate: '',
    severity: 'mild',
    notes: ''
  });

  const [newAllergy, setNewAllergy] = useState<Partial<Allergy>>({
    allergen: '',
    type: '',
    severity: 'mild',
    symptoms: [],
    notes: ''
  });

  const [newSkinProblem, setNewSkinProblem] = useState<Partial<SkinProblem>>({
    condition: '',
    bodyPart: '',
    severity: 'mild',
    duration: '',
    treatment: '',
    notes: ''
  });
  
  const [medicalConditions, setMedicalConditions] = useState<MedicalCondition[]>([]);
  const [allergies, setAllergies] = useState<Allergy[]>([]);
  const [skinProblems, setSkinProblems] = useState<SkinProblem[]>([]);

  const [basicInfo, setBasicInfo] = useState({
    age: '',
    gender: '',
    bloodType: '',
    height: '',
    weight: '',
    emergencyContact: ''
  });

  // Load data from Supabase
  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) {
          setIsLoading(false);
          return;
        }

        const headers = { 'Authorization': `Bearer ${session.access_token}` };
        const baseUrl = `https://${projectId}.supabase.co/functions/v1/make-server-e46e3ba6/user-data`;

        // Load all data in parallel for better performance
        const [profileResult, conditionsRes, allergiesRes, skinRes, infoRes] = await Promise.allSettled([
            userProfileService.getProfile(),
            fetch(`${baseUrl}/medical_conditions`, { headers }),
            fetch(`${baseUrl}/allergies`, { headers }),
            fetch(`${baseUrl}/skin_problems`, { headers }),
            fetch(`${baseUrl}/basic_info`, { headers })
        ]);

        // Extract profile safely
        const profile = profileResult.status === 'fulfilled' ? profileResult.value : null;

        let loadedConditions: MedicalCondition[] = [];
        let loadedAllergies: Allergy[] = [];
        let loadedSkinProblems: SkinProblem[] = [];
        let loadedBasicInfo = null;

        // Process medical conditions
        if (conditionsRes.status === 'fulfilled' && conditionsRes.value.ok) {
            try {
              const { data } = await conditionsRes.value.json();
              if (data) loadedConditions = data;
            } catch (e) {
              // Silent fail
            }
        }
        
        // Process allergies
        if (allergiesRes.status === 'fulfilled' && allergiesRes.value.ok) {
            try {
              const { data } = await allergiesRes.value.json();
              if (data) loadedAllergies = data;
            } catch (e) {
              // Silent fail
            }
        }
        
        // Process skin problems
        if (skinRes.status === 'fulfilled' && skinRes.value.ok) {
            try {
              const { data } = await skinRes.value.json();
              if (data) loadedSkinProblems = data;
            } catch (e) {
              // Silent fail
            }
        }
        
        // Process basic info
        if (infoRes.status === 'fulfilled' && infoRes.value.ok) {
            try {
              const { data } = await infoRes.value.json();
              if (data && data.age) loadedBasicInfo = data;
            } catch (e) {
              // Silent fail
            }
        }
        
        console.log('📋 Loaded Medical History:', {
          conditions: loadedConditions.length,
          allergies: loadedAllergies.length,
          skinProblems: loadedSkinProblems.length,
          hasBasicInfo: !!loadedBasicInfo,
          hasProfile: !!profile
        });
        
        // Set conditions and allergies
        setMedicalConditions(loadedConditions);
        setAllergies(loadedAllergies);
        setSkinProblems(loadedSkinProblems);
        
        // Handle basic info - populate from profile if not already saved
        if (loadedBasicInfo) {
          setBasicInfo(loadedBasicInfo);
          console.log('✅ Basic info loaded from database');
        } else if (profile) {
          // No basic_info saved yet, populate from profile
          const populatedInfo = populateBasicInfoFromProfile(profile);
          setBasicInfo(populatedInfo);
          // Save to database so it persists
          await saveData('basic_info', populatedInfo);
          console.log('✅ Basic info populated from profile and saved');
        }
        
        // Also populate conditions and allergies from profile if they don't exist
        if (profile) {
          // Add chronic conditions from profile if not already in medical conditions
          if (profile.chronicConditions && loadedConditions.length === 0) {
            const conditions = profile.chronicConditions.split(',').map((c: string) => c.trim()).filter((c: string) => c);
            const newConditions: MedicalCondition[] = conditions.map((condition: string, index: number) => ({
              id: `profile-condition-${index}`,
              name: condition,
              diagnosedDate: profile.dateOfBirth || new Date().toISOString().split('T')[0],
              severity: 'moderate' as const,
              notes: 'Imported from profile setup'
            }));
            if (newConditions.length > 0) {
              setMedicalConditions(newConditions);
              await saveData('medical_conditions', newConditions);
              console.log(`✅ Imported ${newConditions.length} conditions from profile`);
            }
          } else if (loadedConditions.length > 0) {
            console.log(`✅ Using ${loadedConditions.length} existing conditions from database`);
          }
          
          // Add allergies from profile if not already in allergies
          if (profile.allergies && loadedAllergies.length === 0) {
            const allergyList = profile.allergies.split(',').map((a: string) => a.trim()).filter((a: string) => a);
            const newAllergies: Allergy[] = allergyList.map((allergen: string, index: number) => ({
              id: `profile-allergy-${index}`,
              allergen: allergen,
              type: 'Food Allergy',
              severity: 'moderate' as const,
              symptoms: [],
              notes: 'Imported from profile setup'
            }));
            if (newAllergies.length > 0) {
              setAllergies(newAllergies);
              await saveData('allergies', newAllergies);
              console.log(`✅ Imported ${newAllergies.length} allergies from profile`);
            }
          } else if (loadedAllergies.length > 0) {
            console.log(`✅ Using ${loadedAllergies.length} existing allergies from database`);
          }
        }

      } catch (error) {
        console.error("❌ Error loading medical history:", error);
      } finally {
        setIsLoading(false);
      }
    };

    const populateBasicInfoFromProfile = (profile: any) => {
      // Calculate age from date of birth
      let age = '';
      if (profile.dateOfBirth) {
        const birthDate = new Date(profile.dateOfBirth);
        const today = new Date();
        const ageYears = today.getFullYear() - birthDate.getFullYear();
        const monthDiff = today.getMonth() - birthDate.getMonth();
        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
          age = (ageYears - 1).toString();
        } else {
          age = ageYears.toString();
        }
      }
      
      const populatedInfo = {
        age: age,
        gender: profile.gender || '',
        bloodType: profile.bloodGroup || '',
        height: profile.height ? `${profile.height} cm` : '',
        weight: profile.weight ? `${profile.weight} kg` : '',
        emergencyContact: profile.emergencyContact && profile.emergencyPhone
          ? `${profile.emergencyContact} (${profile.emergencyPhone}${profile.emergencyRelation ? ` - ${profile.emergencyRelation}` : ''})`
          : profile.emergencyContact || ''
      };
      
      return populatedInfo;
    };

    loadData();
  }, []);

  const saveData = async (key: string, data: any) => {
    try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) return;

        await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-e46e3ba6/user-data/${key}`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${session.access_token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ data })
        });
    } catch (error) {
        console.error(`Error saving ${key}:`, error);
    }
  };

  const handleBasicInfoSave = async () => {
    setIsEditing(false);
    await saveData('basic_info', basicInfo);
  };

  const allergyTypes = [
    'Food Allergy',
    'Drug Allergy',
    'Environmental',
    'Seasonal',
    'Contact Allergy',
    'Insect Sting',
    'Other'
  ];

  const skinConditions = [
    'Eczema',
    'Psoriasis',
    'Dermatitis',
    'Acne',
    'Rosacea',
    'Fungal Infection',
    'Bacterial Infection',
    'Dry Skin',
    'Rash',
    'Other'
  ];

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'mild': return 'bg-green-100 text-green-800';
      case 'moderate': return 'bg-yellow-100 text-yellow-800';
      case 'severe': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Simulate OCR processing
      setTimeout(() => {
        setScannedData(`
Scanned Medical Report Data:
Patient Name: ${userName}
Blood Pressure: 140/90 mmHg (High)
Blood Sugar (Fasting): 125 mg/dL (Borderline)
Cholesterol: 220 mg/dL (High)
Hemoglobin: 12.5 g/dL (Normal)
Allergies: Peanuts (Severe)
Current Medications: Metformin 500mg
Doctor Notes: Monitor blood pressure regularly
        `);
        setScanType(null);
      }, 2000);
    }
  };

  const extractDataFromReport = async () => {
    const newConditionsList = [...medicalConditions];
    const newAllergiesList = [...allergies];
    let updated = false;

    if (scannedData.includes('Blood Pressure: 140/90')) {
      const newCondition: MedicalCondition = {
        id: Date.now().toString(),
        name: 'Hypertension',
        diagnosedDate: new Date().toISOString().split('T')[0],
        severity: 'moderate',
        notes: 'Detected from medical report scan - Monitor regularly'
      };
      newConditionsList.push(newCondition);
      updated = true;
    }
    
    if (scannedData.includes('Peanuts (Severe)')) {
      const newAllergy: Allergy = {
        id: Date.now().toString(),
        allergen: 'Peanuts',
        type: 'Food Allergy',
        severity: 'severe',
        symptoms: ['Swelling', 'Difficulty breathing'],
        notes: 'Detected from medical report scan'
      };
      newAllergiesList.push(newAllergy);
      updated = true;
    }
    
    if (updated) {
        setMedicalConditions(newConditionsList);
        setAllergies(newAllergiesList);
        await saveData('medical_conditions', newConditionsList);
        await saveData('allergies', newAllergiesList);
    }
    
    setScannedData('');
    setShowScanner(false);
  };

  const handleManualEntry = () => {
    setShowManualEntry(true);
    setManualEntryType(null);
  };

  const addManualCondition = async () => {
    if (newCondition.name && newCondition.diagnosedDate) {
      const condition: MedicalCondition = {
        id: Date.now().toString(),
        name: newCondition.name,
        diagnosedDate: newCondition.diagnosedDate,
        severity: newCondition.severity as 'mild' | 'moderate' | 'severe',
        notes: newCondition.notes || ''
      };
      const updated = [...medicalConditions, condition];
      setMedicalConditions(updated);
      await saveData('medical_conditions', updated);
      
      setNewCondition({ name: '', diagnosedDate: '', severity: 'mild', notes: '' });
      setShowManualEntry(false);
      setManualEntryType(null);
    }
  };

  const addManualAllergy = async () => {
    if (newAllergy.allergen && newAllergy.type) {
      const allergy: Allergy = {
        id: Date.now().toString(),
        allergen: newAllergy.allergen,
        type: newAllergy.type,
        severity: newAllergy.severity as 'mild' | 'moderate' | 'severe',
        symptoms: newAllergy.symptoms || [],
        notes: newAllergy.notes || ''
      };
      const updated = [...allergies, allergy];
      setAllergies(updated);
      await saveData('allergies', updated);

      setNewAllergy({ allergen: '', type: '', severity: 'mild', symptoms: [], notes: '' });
      setShowManualEntry(false);
      setManualEntryType(null);
    }
  };

  const addManualSkinProblem = async () => {
    if (newSkinProblem.condition && newSkinProblem.bodyPart) {
      const skinProblem: SkinProblem = {
        id: Date.now().toString(),
        condition: newSkinProblem.condition,
        bodyPart: newSkinProblem.bodyPart,
        severity: newSkinProblem.severity as 'mild' | 'moderate' | 'severe',
        duration: newSkinProblem.duration || '',
        treatment: newSkinProblem.treatment || '',
        notes: newSkinProblem.notes || ''
      };
      const updated = [...skinProblems, skinProblem];
      setSkinProblems(updated);
      await saveData('skin_problems', updated);

      setNewSkinProblem({ condition: '', bodyPart: '', severity: 'mild', duration: '', treatment: '', notes: '' });
      setShowManualEntry(false);
      setManualEntryType(null);
    }
  };

  const renderOverview = () => (
    <div className="space-y-6">
      {/* Basic Information */}
      <Card className="p-4 bg-card">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-semibold flex items-center text-foreground">
            <User className="h-5 w-5 mr-2 text-blue-600" />
            Basic Information
          </h2>
          <Button variant="ghost" size="sm" onClick={isEditing ? handleBasicInfoSave : () => setIsEditing(true)}>
            {isEditing ? <Save className="h-4 w-4" /> : <Edit className="h-4 w-4" />}
          </Button>
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label className="text-sm text-muted-foreground">Age</Label>
            {isEditing ? (
              <Input value={basicInfo.age} onChange={(e) => setBasicInfo({...basicInfo, age: e.target.value})} />
            ) : (
              <p className="font-medium text-foreground">{basicInfo.age} years</p>
            )}
          </div>
          <div>
            <Label className="text-sm text-gray-600">Gender</Label>
            {isEditing ? (
              <Select value={basicInfo.gender} onValueChange={(value) => setBasicInfo({...basicInfo, gender: value})}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Male">Male</SelectItem>
                  <SelectItem value="Female">Female</SelectItem>
                  <SelectItem value="Other">Other</SelectItem>
                </SelectContent>
              </Select>
            ) : (
              <p className="font-medium">{basicInfo.gender}</p>
            )}
          </div>
          <div>
            <Label className="text-sm text-gray-600">Blood Type</Label>
            {isEditing ? (
              <Input value={basicInfo.bloodType} onChange={(e) => setBasicInfo({...basicInfo, bloodType: e.target.value})} />
            ) : (
              <p className="font-medium">{basicInfo.bloodType}</p>
            )}
          </div>
          <div>
            <Label className="text-sm text-gray-600">Height</Label>
            {isEditing ? (
              <Input value={basicInfo.height} onChange={(e) => setBasicInfo({...basicInfo, height: e.target.value})} />
            ) : (
              <p className="font-medium">{basicInfo.height}</p>
            )}
          </div>
          <div>
            <Label className="text-sm text-gray-600">Weight</Label>
            {isEditing ? (
              <Input value={basicInfo.weight} onChange={(e) => setBasicInfo({...basicInfo, weight: e.target.value})} />
            ) : (
              <p className="font-medium">{basicInfo.weight}</p>
            )}
          </div>
          <div>
            <Label className="text-sm text-gray-600">Emergency Contact</Label>
            {isEditing ? (
              <Input value={basicInfo.emergencyContact} onChange={(e) => setBasicInfo({...basicInfo, emergencyContact: e.target.value})} />
            ) : (
              <p className="font-medium">{basicInfo.emergencyContact}</p>
            )}
          </div>
        </div>
      </Card>

      {/* Summary Cards */}
      <div className="grid grid-cols-3 gap-3">
        <Card className="p-3 text-center">
          <div className="text-xl font-semibold text-blue-600">{medicalConditions.length}</div>
          <div className="text-sm text-gray-600">Medical Conditions</div>
        </Card>
        <Card className="p-3 text-center">
          <div className="text-xl font-semibold text-orange-600">{allergies.length}</div>
          <div className="text-sm text-gray-600">Known Allergies</div>
        </Card>
        <Card className="p-3 text-center">
          <div className="text-xl font-semibold text-purple-600">{skinProblems.length}</div>
          <div className="text-sm text-gray-600">Skin Problems</div>
        </Card>
      </div>

      {/* Recent Items */}
      <Card className="p-4">
        <h3 className="font-semibold mb-3">Recent Updates</h3>
        <div className="space-y-2">
          {medicalConditions.slice(0, 2).map(condition => (
            <div key={condition.id} className="flex items-center justify-between p-2 bg-gray-50 rounded">
              <span className="text-sm">{condition.name}</span>
              <Badge className={getSeverityColor(condition.severity)}>{condition.severity}</Badge>
            </div>
          ))}
          {allergies.slice(0, 1).map(allergy => (
            <div key={allergy.id} className="flex items-center justify-between p-2 bg-gray-50 rounded">
              <span className="text-sm">Allergy: {allergy.allergen}</span>
              <Badge className={getSeverityColor(allergy.severity)}>{allergy.severity}</Badge>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );

  const renderAllergies = () => (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="font-semibold">Known Allergies</h2>
        <Button size="sm" className="bg-orange-600 hover:bg-orange-700" onClick={() => {
            setManualEntryType('allergy');
            setShowManualEntry(true);
        }}>
          <Plus className="h-4 w-4 mr-1" />
          Add Allergy
        </Button>
      </div>

      {allergies.map(allergy => (
        <Card key={allergy.id} className="p-4">
          <div className="flex items-start justify-between mb-2">
            <div>
              <h3 className="font-semibold text-gray-800">{allergy.allergen}</h3>
              <p className="text-sm text-gray-600">{allergy.type}</p>
            </div>
            <Badge className={getSeverityColor(allergy.severity)}>{allergy.severity}</Badge>
          </div>
          
          <div className="mb-3">
            <Label className="text-sm text-gray-600">Symptoms:</Label>
            <div className="flex flex-wrap gap-1 mt-1">
              {allergy.symptoms.map((symptom, index) => (
                <Badge key={index} variant="secondary" className="text-xs">{symptom}</Badge>
              ))}
            </div>
          </div>
          
          {allergy.notes && (
            <div>
              <Label className="text-sm text-gray-600">Notes:</Label>
              <p className="text-sm text-gray-700">{allergy.notes}</p>
            </div>
          )}
        </Card>
      ))}
    </div>
  );

  const renderSkinProblems = () => (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="font-semibold">Skin Problems</h2>
        <Button size="sm" className="bg-purple-600 hover:bg-purple-700" onClick={() => {
            setManualEntryType('skin');
            setShowManualEntry(true);
        }}>
          <Plus className="h-4 w-4 mr-1" />
          Add Skin Issue
        </Button>
      </div>

      {skinProblems.map(problem => (
        <Card key={problem.id} className="p-4">
          <div className="flex items-start justify-between mb-2">
            <div>
              <h3 className="font-semibold text-gray-800">{problem.condition}</h3>
              <p className="text-sm text-gray-600">{problem.bodyPart}</p>
            </div>
            <Badge className={getSeverityColor(problem.severity)}>{problem.severity}</Badge>
          </div>
          
          <div className="grid grid-cols-2 gap-4 mb-3">
            <div>
              <Label className="text-sm text-gray-600">Duration:</Label>
              <p className="text-sm text-gray-700">{problem.duration}</p>
            </div>
            <div>
              <Label className="text-sm text-gray-600">Treatment:</Label>
              <p className="text-sm text-gray-700">{problem.treatment}</p>
            </div>
          </div>
          
          {problem.notes && (
            <div>
              <Label className="text-sm text-gray-600">Notes:</Label>
              <p className="text-sm text-gray-700">{problem.notes}</p>
            </div>
          )}
        </Card>
      ))}
    </div>
  );

  const renderConditions = () => (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="font-semibold">Medical Conditions</h2>
        <Button size="sm" className="bg-blue-600 hover:bg-blue-700" onClick={() => {
            setManualEntryType('condition');
            setShowManualEntry(true);
        }}>
          <Plus className="h-4 w-4 mr-1" />
          Add Condition
        </Button>
      </div>

      {medicalConditions.map(condition => (
        <Card key={condition.id} className="p-4">
          <div className="flex items-start justify-between mb-2">
            <div>
              <h3 className="font-semibold text-gray-800">{condition.name}</h3>
              <p className="text-sm text-gray-600">Diagnosed: {condition.diagnosedDate}</p>
            </div>
            <Badge className={getSeverityColor(condition.severity)}>{condition.severity}</Badge>
          </div>
          
          {condition.notes && (
            <div>
              <Label className="text-sm text-gray-600">Notes:</Label>
              <p className="text-sm text-gray-700">{condition.notes}</p>
            </div>
          )}
        </Card>
      ))}
    </div>
  );

  if (isLoading) {
    return (
        <div className="flex items-center justify-center min-h-screen">
            <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
        </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-md mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <Button variant="ghost" size="sm" onClick={onBack} className="mr-2 p-2">
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div>
              <h1 className="text-xl font-semibold text-foreground">Medical History</h1>
              <p className="text-sm text-muted-foreground">{userName}</p>
            </div>
          </div>
          <ThemeToggle isDarkMode={isDarkMode} onToggle={onToggleTheme} />
        </div>

        {/* Action Buttons */}
        <div className="flex space-x-2 mb-4">
          <Button
            onClick={() => setShowScanner(true)}
            className="flex-1 bg-blue-600 hover:bg-blue-700"
          >
            <Scan className="h-4 w-4 mr-2" />
            Scan Report
          </Button>
          <Button onClick={handleManualEntry} variant="outline" className="flex-1">
            <Plus className="h-4 w-4 mr-2" />
            Add Manually
          </Button>
        </div>

        {/* Tab Navigation */}
        <div className="flex space-x-1 mb-6 bg-muted p-1 rounded-lg">
          <button 
            className={`flex-1 py-2 px-3 rounded text-sm font-medium transition-colors ${
              activeTab === 'overview' 
                ? 'bg-card text-blue-600 shadow-sm' 
                : 'text-muted-foreground hover:text-foreground'
            }`}
            onClick={() => setActiveTab('overview')}
          >
            Overview
          </button>
          <button 
            className={`flex-1 py-2 px-3 rounded text-sm font-medium transition-colors ${
              activeTab === 'conditions' 
                ? 'bg-card text-blue-600 shadow-sm' 
                : 'text-muted-foreground hover:text-foreground'
            }`}
            onClick={() => setActiveTab('conditions')}
          >
            Conditions
          </button>
          <button 
            className={`flex-1 py-2 px-3 rounded text-sm font-medium transition-colors ${
              activeTab === 'allergies' 
                ? 'bg-card text-orange-600 shadow-sm' 
                : 'text-muted-foreground hover:text-foreground'
            }`}
            onClick={() => setActiveTab('allergies')}
          >
            Allergies
          </button>
          <button 
            className={`flex-1 py-2 px-3 rounded text-sm font-medium transition-colors ${
              activeTab === 'skin' 
                ? 'bg-card text-purple-600 shadow-sm' 
                : 'text-muted-foreground hover:text-foreground'
            }`}
            onClick={() => setActiveTab('skin')}
          >
            Skin
          </button>
        </div>

        {/* Content */}
        {activeTab === 'overview' && renderOverview()}
        {activeTab === 'conditions' && renderConditions()}
        {activeTab === 'allergies' && renderAllergies()}
        {activeTab === 'skin' && renderSkinProblems()}

        {/* Emergency Alert */}
        <Card className="p-4 mt-6 bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800">
          <div className="flex items-center space-x-2">
            <AlertTriangle className="h-5 w-5 text-red-600 dark:text-red-400" />
            <div>
              <h3 className="font-semibold text-red-800 dark:text-red-200">Emergency Information</h3>
              <p className="text-sm text-red-700 dark:text-red-300">
                Always inform medical professionals about allergies and current conditions during emergencies.
              </p>
            </div>
          </div>
        </Card>

        {/* Scanner Modal */}
        {showScanner && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-20 flex items-center justify-center p-4">
            <Card className="w-full max-w-md bg-card">
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-foreground">Scan Medical Report</h3>
                  <Button variant="ghost" size="sm" onClick={() => setShowScanner(false)}>
                    <X className="h-4 w-4" />
                  </Button>
                </div>

                {!scanType && !scannedData && (
                  <div className="space-y-4">
                    <p className="text-sm text-muted-foreground mb-4">
                      Choose how you want to scan your medical report:
                    </p>
                    
                    <Button
                      onClick={() => setScanType('camera')}
                      className="w-full bg-blue-600 hover:bg-blue-700 py-3"
                    >
                      <Camera className="h-5 w-5 mr-2" />
                      Take Photo
                    </Button>
                    
                    <Button
                      onClick={() => setScanType('upload')}
                      variant="outline"
                      className="w-full py-3"
                    >
                      <Upload className="h-5 w-5 mr-2" />
                      Upload Image
                    </Button>
                  </div>
                )}

                {scanType === 'camera' && (
                  <div className="text-center space-y-4">
                    <div className="w-full h-48 bg-muted rounded-lg flex items-center justify-center">
                      <div className="text-muted-foreground">
                        <Camera className="h-12 w-12 mx-auto mb-2" />
                        <p>Camera Preview</p>
                        <p className="text-sm">(Simulated)</p>
                      </div>
                    </div>
                    <Button onClick={() => handleFileUpload({ target: { files: [new File([], 'camera.jpg')] } } as any)}>
                      Capture Report
                    </Button>
                  </div>
                )}

                {scanType === 'upload' && (
                  <div className="text-center space-y-4">
                    <div className="border-2 border-dashed border-border rounded-lg p-6">
                      <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-2" />
                      <p className="text-sm text-muted-foreground mb-2">Upload your medical report</p>
                      <input
                        type="file"
                        accept="image/*,.pdf"
                        onChange={handleFileUpload}
                        className="w-full text-sm text-muted-foreground file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                      />
                    </div>
                  </div>
                )}

                {scannedData && (
                  <div className="space-y-4">
                    <h4 className="font-semibold text-green-800 dark:text-green-400">Report Scanned Successfully!</h4>
                    <div className="bg-muted p-3 rounded text-sm max-h-40 overflow-y-auto">
                      <pre className="whitespace-pre-wrap text-xs">{scannedData}</pre>
                    </div>
                    <div className="flex space-x-2">
                      <Button onClick={extractDataFromReport} className="flex-1 bg-green-600 hover:bg-green-700">
                        Add to Medical History
                      </Button>
                      <Button variant="outline" onClick={() => setScannedData('')}>
                        Scan Again
                      </Button>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      AI has extracted key medical information from your report.
                    </p>
                  </div>
                )}
              </div>
            </Card>
          </div>
        )}

        {/* Manual Entry Modal */}
        {showManualEntry && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-20 flex items-center justify-center p-4">
            <Card className="w-full max-w-md bg-card max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-foreground">Add Medical Information</h3>
                  <Button variant="ghost" size="sm" onClick={() => {
                    setShowManualEntry(false);
                    setManualEntryType(null);
                  }}>
                    <X className="h-4 w-4" />
                  </Button>
                </div>

                {!manualEntryType && (
                  <div className="space-y-4">
                    <p className="text-sm text-muted-foreground mb-4">
                      What would you like to add to your medical history?
                    </p>
                    
                    <Button
                      onClick={() => setManualEntryType('condition')}
                      className="w-full bg-blue-600 hover:bg-blue-700 py-3"
                    >
                      <Heart className="h-5 w-5 mr-2" />
                      Medical Condition
                    </Button>
                    
                    <Button
                      onClick={() => setManualEntryType('allergy')}
                      className="w-full bg-orange-600 hover:bg-orange-700 py-3"
                    >
                      <AlertTriangle className="h-5 w-5 mr-2" />
                      Allergy
                    </Button>
                    
                    <Button
                      onClick={() => setManualEntryType('skin')}
                      className="w-full bg-purple-600 hover:bg-purple-700 py-3"
                    >
                      <User className="h-5 w-5 mr-2" />
                      Skin Problem
                    </Button>
                  </div>
                )}

                {manualEntryType === 'condition' && (
                    <div className="space-y-4">
                        <div>
                            <Label>Condition Name</Label>
                            <Input 
                                value={newCondition.name} 
                                onChange={(e) => setNewCondition({...newCondition, name: e.target.value})}
                                placeholder="e.g. Hypertension" 
                            />
                        </div>
                        <div>
                            <Label>Diagnosed Date</Label>
                            <Input 
                                type="date"
                                value={newCondition.diagnosedDate} 
                                onChange={(e) => setNewCondition({...newCondition, diagnosedDate: e.target.value})} 
                            />
                        </div>
                        <div>
                            <Label>Severity</Label>
                            <Select 
                                value={newCondition.severity} 
                                onValueChange={(v: any) => setNewCondition({...newCondition, severity: v})}
                            >
                                <SelectTrigger><SelectValue /></SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="mild">Mild</SelectItem>
                                    <SelectItem value="moderate">Moderate</SelectItem>
                                    <SelectItem value="severe">Severe</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div>
                            <Label>Notes</Label>
                            <Textarea 
                                value={newCondition.notes} 
                                onChange={(e) => setNewCondition({...newCondition, notes: e.target.value})} 
                            />
                        </div>
                        <Button onClick={addManualCondition} className="w-full bg-blue-600">Save Condition</Button>
                    </div>
                )}

                {manualEntryType === 'allergy' && (
                    <div className="space-y-4">
                        <div>
                            <Label>Allergen</Label>
                            <Input 
                                value={newAllergy.allergen} 
                                onChange={(e) => setNewAllergy({...newAllergy, allergen: e.target.value})}
                                placeholder="e.g. Peanuts" 
                            />
                        </div>
                        <div>
                            <Label>Type</Label>
                            <Select 
                                value={newAllergy.type} 
                                onValueChange={(v) => setNewAllergy({...newAllergy, type: v})}
                            >
                                <SelectTrigger><SelectValue placeholder="Select Type" /></SelectTrigger>
                                <SelectContent>
                                    {allergyTypes.map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}
                                </SelectContent>
                            </Select>
                        </div>
                        <div>
                            <Label>Severity</Label>
                            <Select 
                                value={newAllergy.severity} 
                                onValueChange={(v: any) => setNewAllergy({...newAllergy, severity: v})}
                            >
                                <SelectTrigger><SelectValue /></SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="mild">Mild</SelectItem>
                                    <SelectItem value="moderate">Moderate</SelectItem>
                                    <SelectItem value="severe">Severe</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div>
                            <Label>Notes</Label>
                            <Textarea 
                                value={newAllergy.notes} 
                                onChange={(e) => setNewAllergy({...newAllergy, notes: e.target.value})} 
                            />
                        </div>
                        <Button onClick={addManualAllergy} className="w-full bg-orange-600">Save Allergy</Button>
                    </div>
                )}

                {manualEntryType === 'skin' && (
                    <div className="space-y-4">
                        <div>
                            <Label>Condition</Label>
                            <Select 
                                value={newSkinProblem.condition} 
                                onValueChange={(v) => setNewSkinProblem({...newSkinProblem, condition: v})}
                            >
                                <SelectTrigger><SelectValue placeholder="Select Condition" /></SelectTrigger>
                                <SelectContent>
                                    {skinConditions.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                                </SelectContent>
                            </Select>
                        </div>
                        <div>
                            <Label>Body Part</Label>
                            <Input 
                                value={newSkinProblem.bodyPart} 
                                onChange={(e) => setNewSkinProblem({...newSkinProblem, bodyPart: e.target.value})} 
                            />
                        </div>
                        <div>
                            <Label>Severity</Label>
                            <Select 
                                value={newSkinProblem.severity} 
                                onValueChange={(v: any) => setNewSkinProblem({...newSkinProblem, severity: v})}
                            >
                                <SelectTrigger><SelectValue /></SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="mild">Mild</SelectItem>
                                    <SelectItem value="moderate">Moderate</SelectItem>
                                    <SelectItem value="severe">Severe</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div>
                            <Label>Treatment</Label>
                            <Input 
                                value={newSkinProblem.treatment} 
                                onChange={(e) => setNewSkinProblem({...newSkinProblem, treatment: e.target.value})} 
                            />
                        </div>
                        <div>
                            <Label>Notes</Label>
                            <Textarea 
                                value={newSkinProblem.notes} 
                                onChange={(e) => setNewSkinProblem({...newSkinProblem, notes: e.target.value})} 
                            />
                        </div>
                        <Button onClick={addManualSkinProblem} className="w-full bg-purple-600">Save Skin Problem</Button>
                    </div>
                )}
              </div>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}