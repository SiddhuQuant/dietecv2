import { ArrowLeft, UserCheck, Phone, MapPin, Plus, Edit, Save, X, Shield, AlertTriangle, Hospital, Loader2 } from "lucide-react";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Badge } from "./ui/badge";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Alert, AlertDescription } from "./ui/alert";
import { useState, useEffect } from "react";
import { supabase } from "../utils/supabase/client";
import { projectId } from "../utils/supabase/info";
import { userProfileService } from "../services/userProfileService";

interface PersonalDoctorProps {
  onBack: () => void;
  userName: string;
}

interface Doctor {
  id: string;
  name: string;
  specialty: string;
  phone: string;
  email: string;
  clinic: string;
  address: string;
  isPrimary: boolean;
  notes: string;
}

interface MedicalInfo {
  bloodType: string;
  emergencyContact1: { name: string; relation: string; phone: string };
  emergencyContact2: { name: string; relation: string; phone: string };
  insurance: { provider: string; policyNumber: string; groupNumber: string };
  preferredHospital: string;
  pharmacyName: string;
  pharmacyPhone: string;
  organDonor: boolean;
  medicalDirectives: string;
  importantNotes: string;
}

export function PersonalDoctor({ onBack, userName }: PersonalDoctorProps) {
  const [activeTab, setActiveTab] = useState<'doctors' | 'info'>('doctors');
  const [isEditingInfo, setIsEditingInfo] = useState(false);
  const [showAddDoctor, setShowAddDoctor] = useState(false);
  const [editingDoctorId, setEditingDoctorId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Sample data - in real app, this would come from backend
  const [doctors, setDoctors] = useState<Doctor[]>([]);

  const [doctorForm, setDoctorForm] = useState<Omit<Doctor, 'id'>>({
    name: '',
    specialty: '',
    phone: '',
    email: '',
    clinic: '',
    address: '',
    isPrimary: false,
    notes: ''
  });

  const [medicalInfo, setMedicalInfo] = useState<MedicalInfo>({
    bloodType: '',
    emergencyContact1: { name: '', relation: '', phone: '' },
    emergencyContact2: { name: '', relation: '', phone: '' },
    insurance: { provider: '', policyNumber: '', groupNumber: '' },
    preferredHospital: '',
    pharmacyName: '',
    pharmacyPhone: '',
    organDonor: false,
    medicalDirectives: '',
    importantNotes: ''
  });

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) return;

        const headers = { 'Authorization': `Bearer ${session.access_token}` };
        const baseUrl = `https://${projectId}.supabase.co/functions/v1/make-server-e46e3ba6/user-data`;

        // Load user profile data
        const profile = await userProfileService.getProfile();

        const [doctorsRes, medicalInfoRes] = await Promise.all([
            fetch(`${baseUrl}/personal_doctors`, { headers }),
            fetch(`${baseUrl}/personal_medical_info`, { headers })
        ]);

        if (doctorsRes.ok) {
            const { data } = await doctorsRes.json();
            if (data) setDoctors(data);
        }
        if (medicalInfoRes.ok) {
            const { data } = await medicalInfoRes.json();
            if (data) {
              setMedicalInfo(data);
            } else if (profile) {
              // Populate from profile if medical info doesn't exist
              populateMedicalInfoFromProfile(profile);
            }
        } else if (profile) {
          // Populate from profile if request failed
          populateMedicalInfoFromProfile(profile);
        }

      } catch (error) {
        console.error("Error loading personal doctor data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    const populateMedicalInfoFromProfile = (profile: any) => {
      const populatedInfo: MedicalInfo = {
        bloodType: profile.bloodGroup || '',
        emergencyContact1: {
          name: profile.emergencyContact || '',
          relation: profile.emergencyRelation || 'Not specified',
          phone: profile.emergencyPhone || ''
        },
        emergencyContact2: { name: '', relation: '', phone: '' },
        insurance: { provider: '', policyNumber: '', groupNumber: '' },
        preferredHospital: '',
        pharmacyName: '',
        pharmacyPhone: '',
        organDonor: false,
        medicalDirectives: '',
        importantNotes: profile.chronicConditions 
          ? `Chronic Conditions: ${profile.chronicConditions}\nAllergies: ${profile.allergies || 'None'}` 
          : ''
      };
      
      setMedicalInfo(populatedInfo);
      // Also save this to backend for future use
      saveData('personal_medical_info', populatedInfo);
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

  const specialties = [
    'General Physician',
    'Cardiologist',
    'Dermatologist',
    'Orthopedic',
    'Gynecologist',
    'Pediatrician',
    'Neurologist',
    'Psychiatrist',
    'Ophthalmologist',
    'ENT Specialist',
    'Dentist',
    'Other'
  ];

  const bloodTypes = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-', 'Unknown'];
  const relations = ['Spouse', 'Parent', 'Child', 'Sibling', 'Friend', 'Relative', 'Other'];

  const handleSaveDoctor = async () => {
    if (doctorForm.name && doctorForm.phone) {
      let updatedDoctors: Doctor[];
      
      if (editingDoctorId) {
        updatedDoctors = doctors.map(doc => 
          doc.id === editingDoctorId 
            ? { ...doctorForm, id: editingDoctorId } 
            : doc
        );
      } else {
        const doctor: Doctor = {
          ...doctorForm,
          id: Date.now().toString()
        };
        updatedDoctors = [...doctors, doctor];
      }
      
      setDoctors(updatedDoctors);
      await saveData('personal_doctors', updatedDoctors);
      
      resetDoctorForm();
    }
  };
  
  const handleEditDoctor = (doctor: Doctor) => {
    setDoctorForm({
      name: doctor.name,
      specialty: doctor.specialty,
      phone: doctor.phone,
      email: doctor.email,
      clinic: doctor.clinic,
      address: doctor.address,
      isPrimary: doctor.isPrimary,
      notes: doctor.notes
    });
    setEditingDoctorId(doctor.id);
    setShowAddDoctor(true);
  };
  
  const resetDoctorForm = () => {
    setDoctorForm({
      name: '',
      specialty: '',
      phone: '',
      email: '',
      clinic: '',
      address: '',
      isPrimary: false,
      notes: ''
    });
    setEditingDoctorId(null);
    setShowAddDoctor(false);
  };

  const handleSaveInfo = async () => {
    setIsEditingInfo(false);
    await saveData('personal_medical_info', medicalInfo);
  };

  const renderDoctors = () => (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="font-semibold">My Doctors</h2>
        <Button 
          size="sm" 
          className="bg-blue-600 hover:bg-blue-700"
          onClick={() => {
            resetDoctorForm();
            setShowAddDoctor(true);
          }}
        >
          <Plus className="h-4 w-4 mr-1" />
          Add Doctor
        </Button>
      </div>

      {/* Add/Edit Doctor Form */}
      {showAddDoctor && (
        <Card className="p-4 bg-blue-50 border-blue-200">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-blue-800">
              {editingDoctorId ? 'Edit Doctor' : 'Add New Doctor'}
            </h3>
            <Button variant="ghost" size="sm" onClick={resetDoctorForm}>
              <X className="h-4 w-4" />
            </Button>
          </div>
          
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label className="text-sm">Doctor Name *</Label>
                <Input
                  value={doctorForm.name}
                  onChange={(e) => setDoctorForm({...doctorForm, name: e.target.value})}
                  placeholder="Dr. Name"
                />
              </div>
              <div>
                <Label className="text-sm">Specialty</Label>
                <Select value={doctorForm.specialty} onValueChange={(value) => setDoctorForm({...doctorForm, specialty: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select specialty" />
                  </SelectTrigger>
                  <SelectContent>
                    {specialties.map(specialty => (
                      <SelectItem key={specialty} value={specialty}>{specialty}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label className="text-sm">Phone *</Label>
                <Input
                  value={doctorForm.phone}
                  onChange={(e) => setDoctorForm({...doctorForm, phone: e.target.value})}
                  placeholder="+91-98765-43210"
                />
              </div>
              <div>
                <Label className="text-sm">Email</Label>
                <Input
                  value={doctorForm.email}
                  onChange={(e) => setDoctorForm({...doctorForm, email: e.target.value})}
                  placeholder="doctor@clinic.com"
                />
              </div>
            </div>
            
            <div>
              <Label className="text-sm">Clinic/Hospital</Label>
              <Input
                value={doctorForm.clinic}
                onChange={(e) => setDoctorForm({...doctorForm, clinic: e.target.value})}
                placeholder="Clinic or Hospital Name"
              />
            </div>
            
            <div>
              <Label className="text-sm">Address</Label>
              <Textarea
                value={doctorForm.address}
                onChange={(e) => setDoctorForm({...doctorForm, address: e.target.value})}
                placeholder="Complete address"
                rows={2}
              />
            </div>
            
            <div>
              <Label className="text-sm">Notes</Label>
              <Textarea
                value={doctorForm.notes}
                onChange={(e) => setDoctorForm({...doctorForm, notes: e.target.value})}
                placeholder="Any special notes about this doctor"
                rows={2}
              />
            </div>
            
            <div className="flex space-x-2">
              <Button onClick={handleSaveDoctor} size="sm" className="bg-blue-600 hover:bg-blue-700">
                {editingDoctorId ? 'Update Doctor' : 'Save Doctor'}
              </Button>
              <Button variant="outline" size="sm" onClick={resetDoctorForm}>
                Cancel
              </Button>
            </div>
          </div>
        </Card>
      )}

      {/* Doctors List */}
      {doctors.length === 0 && !showAddDoctor && (
        <Card className="p-8 text-center text-muted-foreground border-dashed">
            <UserCheck className="h-12 w-12 mx-auto mb-2 opacity-20" />
            <p>No doctors added yet.</p>
            <Button variant="link" onClick={() => setShowAddDoctor(true)}>Add your first doctor</Button>
        </Card>
      )}

      {doctors.map(doctor => (
        <Card key={doctor.id} className="p-4">
          <div className="flex items-start justify-between mb-3">
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="font-semibold text-gray-800">{doctor.name}</h3>
                {doctor.isPrimary && (
                  <Badge className="bg-green-100 text-green-800 text-xs">Primary</Badge>
                )}
              </div>
              <p className="text-sm text-gray-600">{doctor.specialty}</p>
            </div>
            <Button variant="ghost" size="sm" onClick={() => handleEditDoctor(doctor)}>
              <Edit className="h-4 w-4" />
            </Button>
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <Phone className="h-4 w-4 text-gray-500" />
              <span className="text-sm text-gray-700">{doctor.phone}</span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => window.open(`tel:${doctor.phone}`)}
                className="ml-auto text-xs"
              >
                Call
              </Button>
            </div>
            
            {doctor.email && (
              <div className="flex items-center space-x-2">
                <div className="h-4 w-4"></div>
                <span className="text-sm text-gray-700">{doctor.email}</span>
              </div>
            )}
            
            {doctor.clinic && (
              <div className="flex items-center space-x-2">
                <Hospital className="h-4 w-4 text-gray-500" />
                <span className="text-sm text-gray-700">{doctor.clinic}</span>
              </div>
            )}
            
            {doctor.address && (
              <div className="flex items-start space-x-2">
                <MapPin className="h-4 w-4 text-gray-500 mt-0.5" />
                <span className="text-sm text-gray-700">{doctor.address}</span>
              </div>
            )}
            
            {doctor.notes && (
              <div className="mt-3 pt-3 border-t border-gray-100">
                <p className="text-sm text-gray-600">{doctor.notes}</p>
              </div>
            )}
          </div>
        </Card>
      ))}
    </div>
  );

  const renderMedicalInfo = () => (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="font-semibold">Personal Medical Information</h2>
        <Button variant="ghost" size="sm" onClick={isEditingInfo ? handleSaveInfo : () => setIsEditingInfo(true)}>
          {isEditingInfo ? <Save className="h-4 w-4" /> : <Edit className="h-4 w-4" />}
        </Button>
      </div>

      {/* Basic Info */}
      <Card className="p-4">
        <h3 className="font-semibold mb-3 flex items-center">
          <Shield className="h-5 w-5 mr-2 text-blue-600" />
          Essential Information
        </h3>
        
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label className="text-sm text-gray-600">Blood Type</Label>
            {isEditingInfo ? (
              <Select value={medicalInfo.bloodType} onValueChange={(value) => setMedicalInfo({...medicalInfo, bloodType: value})}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {bloodTypes.map(type => (
                    <SelectItem key={type} value={type}>{type}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            ) : (
              <p className="font-medium text-red-600">{medicalInfo.bloodType || 'Not set'}</p>
            )}
          </div>
          
          <div>
            <Label className="text-sm text-gray-600">Organ Donor</Label>
            {isEditingInfo ? (
              <Select value={medicalInfo.organDonor ? 'yes' : 'no'} onValueChange={(value) => setMedicalInfo({...medicalInfo, organDonor: value === 'yes'})}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="yes">Yes</SelectItem>
                  <SelectItem value="no">No</SelectItem>
                </SelectContent>
              </Select>
            ) : (
              <p className="font-medium">{medicalInfo.organDonor ? 'Yes' : 'No'}</p>
            )}
          </div>
        </div>
      </Card>

      {/* Emergency Contacts */}
      <Card className="p-4">
        <h3 className="font-semibold mb-3 flex items-center">
          <AlertTriangle className="h-5 w-5 mr-2 text-red-600" />
          Emergency Contacts
        </h3>
        
        <div className="space-y-4">
          {/* Contact 1 */}
          <div>
            <Label className="text-sm text-gray-600">Primary Emergency Contact</Label>
            <div className="grid grid-cols-3 gap-2 mt-1">
              {isEditingInfo ? (
                <>
                  <Input
                    value={medicalInfo.emergencyContact1.name}
                    onChange={(e) => setMedicalInfo({
                      ...medicalInfo,
                      emergencyContact1: {...medicalInfo.emergencyContact1, name: e.target.value}
                    })}
                    placeholder="Name"
                  />
                  <Select value={medicalInfo.emergencyContact1.relation} onValueChange={(value) => setMedicalInfo({
                    ...medicalInfo,
                    emergencyContact1: {...medicalInfo.emergencyContact1, relation: value}
                  })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Relation" />
                    </SelectTrigger>
                    <SelectContent>
                      {relations.map(relation => (
                        <SelectItem key={relation} value={relation}>{relation}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Input
                    value={medicalInfo.emergencyContact1.phone}
                    onChange={(e) => setMedicalInfo({
                      ...medicalInfo,
                      emergencyContact1: {...medicalInfo.emergencyContact1, phone: e.target.value}
                    })}
                    placeholder="Phone"
                  />
                </>
              ) : (
                <>
                  <p className="font-medium">{medicalInfo.emergencyContact1.name || '-'}</p>
                  <p className="text-sm text-gray-600">{medicalInfo.emergencyContact1.relation || '-'}</p>
                  <p className="font-medium text-green-600">{medicalInfo.emergencyContact1.phone || '-'}</p>
                </>
              )}
            </div>
          </div>

          {/* Contact 2 */}
          <div>
            <Label className="text-sm text-gray-600">Secondary Emergency Contact</Label>
            <div className="grid grid-cols-3 gap-2 mt-1">
              {isEditingInfo ? (
                <>
                  <Input
                    value={medicalInfo.emergencyContact2.name}
                    onChange={(e) => setMedicalInfo({
                      ...medicalInfo,
                      emergencyContact2: {...medicalInfo.emergencyContact2, name: e.target.value}
                    })}
                    placeholder="Name"
                  />
                  <Select value={medicalInfo.emergencyContact2.relation} onValueChange={(value) => setMedicalInfo({
                    ...medicalInfo,
                    emergencyContact2: {...medicalInfo.emergencyContact2, relation: value}
                  })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Relation" />
                    </SelectTrigger>
                    <SelectContent>
                      {relations.map(relation => (
                        <SelectItem key={relation} value={relation}>{relation}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Input
                    value={medicalInfo.emergencyContact2.phone}
                    onChange={(e) => setMedicalInfo({
                      ...medicalInfo,
                      emergencyContact2: {...medicalInfo.emergencyContact2, phone: e.target.value}
                    })}
                    placeholder="Phone"
                  />
                </>
              ) : (
                <>
                  <p className="font-medium">{medicalInfo.emergencyContact2.name || '-'}</p>
                  <p className="text-sm text-gray-600">{medicalInfo.emergencyContact2.relation || '-'}</p>
                  <p className="font-medium text-green-600">{medicalInfo.emergencyContact2.phone || '-'}</p>
                </>
              )}
            </div>
          </div>
        </div>
      </Card>

      {/* Healthcare Preferences */}
      <Card className="p-4">
        <h3 className="font-semibold mb-3">Healthcare Preferences</h3>
        
        <div className="space-y-3">
          <div>
            <Label className="text-sm text-gray-600">Preferred Hospital</Label>
            {isEditingInfo ? (
              <Input
                value={medicalInfo.preferredHospital}
                onChange={(e) => setMedicalInfo({...medicalInfo, preferredHospital: e.target.value})}
                placeholder="Hospital name"
              />
            ) : (
              <p className="font-medium">{medicalInfo.preferredHospital || 'Not set'}</p>
            )}
          </div>
          
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label className="text-sm text-gray-600">Pharmacy</Label>
              {isEditingInfo ? (
                <Input
                  value={medicalInfo.pharmacyName}
                  onChange={(e) => setMedicalInfo({...medicalInfo, pharmacyName: e.target.value})}
                  placeholder="Pharmacy name"
                />
              ) : (
                <p className="font-medium">{medicalInfo.pharmacyName || 'Not set'}</p>
              )}
            </div>
            <div>
              <Label className="text-sm text-gray-600">Pharmacy Phone</Label>
              {isEditingInfo ? (
                <Input
                  value={medicalInfo.pharmacyPhone}
                  onChange={(e) => setMedicalInfo({...medicalInfo, pharmacyPhone: e.target.value})}
                  placeholder="Phone number"
                />
              ) : (
                <p className="font-medium">{medicalInfo.pharmacyPhone || 'Not set'}</p>
              )}
            </div>
          </div>
        </div>
      </Card>

      {/* Insurance */}
      <Card className="p-4">
        <h3 className="font-semibold mb-3">Insurance Information</h3>
        
        <div className="space-y-3">
          <div>
            <Label className="text-sm text-gray-600">Insurance Provider</Label>
            {isEditingInfo ? (
              <Input
                value={medicalInfo.insurance.provider}
                onChange={(e) => setMedicalInfo({
                  ...medicalInfo,
                  insurance: {...medicalInfo.insurance, provider: e.target.value}
                })}
                placeholder="Insurance company"
              />
            ) : (
              <p className="font-medium">{medicalInfo.insurance.provider || 'Not set'}</p>
            )}
          </div>
          
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label className="text-sm text-gray-600">Policy Number</Label>
              {isEditingInfo ? (
                <Input
                  value={medicalInfo.insurance.policyNumber}
                  onChange={(e) => setMedicalInfo({
                    ...medicalInfo,
                    insurance: {...medicalInfo.insurance, policyNumber: e.target.value}
                  })}
                  placeholder="Policy number"
                />
              ) : (
                <p className="font-medium">{medicalInfo.insurance.policyNumber || 'Not set'}</p>
              )}
            </div>
            <div>
              <Label className="text-sm text-gray-600">Group Number</Label>
              {isEditingInfo ? (
                <Input
                  value={medicalInfo.insurance.groupNumber}
                  onChange={(e) => setMedicalInfo({
                    ...medicalInfo,
                    insurance: {...medicalInfo.insurance, groupNumber: e.target.value}
                  })}
                  placeholder="Group number"
                />
              ) : (
                <p className="font-medium">{medicalInfo.insurance.groupNumber || 'Not set'}</p>
              )}
            </div>
          </div>
        </div>
      </Card>

      {/* Medical Directives */}
      <Card className="p-4">
        <h3 className="font-semibold mb-3">Medical Directives & Notes</h3>
        
        <div className="space-y-3">
          <div>
            <Label className="text-sm text-gray-600">Medical Directives</Label>
            {isEditingInfo ? (
              <Textarea
                value={medicalInfo.medicalDirectives}
                onChange={(e) => setMedicalInfo({...medicalInfo, medicalDirectives: e.target.value})}
                placeholder="Advanced directives, DNR status, etc."
                rows={3}
              />
            ) : (
              <p className="text-sm text-gray-700">{medicalInfo.medicalDirectives || 'None'}</p>
            )}
          </div>
          
          <div>
            <Label className="text-sm text-gray-600">Important Medical Notes</Label>
            {isEditingInfo ? (
              <Textarea
                value={medicalInfo.importantNotes}
                onChange={(e) => setMedicalInfo({...medicalInfo, importantNotes: e.target.value})}
                placeholder="Important notes for medical professionals"
                rows={3}
              />
            ) : (
              <p className="text-sm text-gray-700">{medicalInfo.importantNotes || 'None'}</p>
            )}
          </div>
        </div>
      </Card>
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 p-4">
      <div className="max-w-md mx-auto">
        {/* Header */}
        <div className="flex items-center mb-6">
          <Button variant="ghost" size="sm" onClick={onBack} className="mr-2 p-2">
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-xl font-semibold">Personal Doctor & Info</h1>
            <p className="text-sm text-gray-600">{userName}</p>
          </div>
        </div>

        {/* Tab Navigation */}
        <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as 'doctors' | 'info')} className="mb-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="doctors" className="flex items-center space-x-2">
              <UserCheck className="h-4 w-4" />
              <span>My Doctors</span>
            </TabsTrigger>
            <TabsTrigger value="info" className="flex items-center space-x-2">
              <Shield className="h-4 w-4" />
              <span>Medical Info</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="doctors">
            {renderDoctors()}
          </TabsContent>

          <TabsContent value="info">
            {renderMedicalInfo()}
          </TabsContent>
        </Tabs>

        {/* Emergency Alert */}
        <Alert className="mt-6 border-red-200 bg-red-50">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription className="text-red-800">
            <strong>Emergency:</strong> Keep this information updated and accessible during medical emergencies.
          </AlertDescription>
        </Alert>
      </div>
    </div>
  );
}