import { supabase } from "../utils/supabase/client";
import { projectId } from "../utils/supabase/info";
import { userApi, medicalApi } from "./api";

export interface UserProfile {
  // Personal Information
  fullName: string;
  dateOfBirth: string;
  gender: string;
  phone: string;
  address: string;
  
  // Medical History
  bloodGroup: string;
  height: string;
  weight: string;
  allergies: string;
  chronicConditions: string;
  currentMedications: string;
  emergencyContact: string;
  emergencyPhone: string;
  emergencyRelation?: string;
}

// Configuration for backend selection
const USE_FASTAPI_BACKEND = import.meta.env.VITE_USE_FASTAPI === 'true';
const FASTAPI_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v1';

class UserProfileService {
  private baseUrl = `https://${projectId}.supabase.co/functions/v1/make-server-e46e3ba6/user-data`;

  async getSession() {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session?.access_token) {
      throw new Error("Not authenticated");
    }
    return session;
  }

  async saveProfile(profile: UserProfile): Promise<void> {
    // Try FastAPI backend first if enabled
    if (USE_FASTAPI_BACKEND) {
      try {
        await userApi.saveProfile({
          full_name: profile.fullName,
          date_of_birth: profile.dateOfBirth,
          gender: profile.gender,
          phone: profile.phone,
          address: profile.address,
          blood_group: profile.bloodGroup,
          height: profile.height,
          weight: profile.weight,
          allergies: profile.allergies,
          chronic_conditions: profile.chronicConditions,
          current_medications: profile.currentMedications,
          emergency_contact_name: profile.emergencyContact,
          emergency_contact_phone: profile.emergencyPhone,
          emergency_contact_relation: profile.emergencyRelation,
        });
        console.log('✅ Profile saved via FastAPI backend');
        return;
      } catch (error) {
        console.warn('FastAPI backend unavailable, falling back to Supabase:', error);
      }
    }

    // Fallback to Supabase
    const session = await this.getSession();
    
    const response = await fetch(`${this.baseUrl}/profile`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${session.access_token}`
      },
      body: JSON.stringify({ data: profile })
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to save profile');
    }
  }

  async getProfile(): Promise<UserProfile | null> {
    // Try FastAPI backend first if enabled
    if (USE_FASTAPI_BACKEND) {
      try {
        const profile = await userApi.getProfile();
        if (profile) {
          console.log('✅ Profile loaded via FastAPI backend');
          return profile;
        }
      } catch (error) {
        console.warn('FastAPI backend unavailable, falling back to Supabase:', error);
      }
    }

    // Fallback to Supabase
    try {
      const session = await this.getSession();
      
      const response = await fetch(`${this.baseUrl}/profile`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${session.access_token}`
        }
      });

      if (!response.ok) {
        if (response.status === 404) {
          return null; // Profile not found
        }
        throw new Error('Failed to load profile');
      }

      const { data } = await response.json();
      return data;
    } catch (error) {
      console.error('Error loading profile:', error);
      return null;
    }
  }

  async hasCompletedProfile(): Promise<boolean> {
    // Try FastAPI backend first if enabled
    if (USE_FASTAPI_BACKEND) {
      try {
        const result = await userApi.isProfileComplete();
        return result.is_complete;
      } catch (error) {
        console.warn('FastAPI backend unavailable, falling back to Supabase:', error);
      }
    }

    // Fallback to checking profile
    const profile = await this.getProfile();
    return profile !== null;
  }

  // Convenience method for saving user profile with flexible input
  async saveUserProfile(data: {
    fullName: string;
    dateOfBirth: string;
    gender: string;
    phoneNumber: string;
    address: string;
    medicalConditions?: string;
    allergies?: string;
    emergencyContact?: string;
  }): Promise<void> {
    const profile: UserProfile = {
      fullName: data.fullName,
      dateOfBirth: data.dateOfBirth,
      gender: data.gender,
      phone: data.phoneNumber,
      address: data.address,
      bloodGroup: '',
      height: '',
      weight: '',
      allergies: data.allergies || '',
      chronicConditions: data.medicalConditions || '',
      currentMedications: '',
      emergencyContact: data.emergencyContact || '',
      emergencyPhone: '',
      emergencyRelation: ''
    };
    
    // Save profile
    await this.saveProfile(profile);
    
    // Also sync to Medical History tables
    await this.syncToMedicalHistory(profile);
  }

  // Sync profile data to medical history tables
  private async syncToMedicalHistory(profile: UserProfile): Promise<void> {
    try {
      const session = await this.getSession();
      const headers = {
        'Authorization': `Bearer ${session.access_token}`,
        'Content-Type': 'application/json'
      };

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

      // Create basic_info
      const basicInfo = {
        age: age,
        gender: profile.gender || '',
        bloodType: profile.bloodGroup || '',
        height: profile.height || '',
        weight: profile.weight || '',
        emergencyContact: profile.emergencyContact || ''
      };

      // Save basic info
      await fetch(`${this.baseUrl}/basic_info`, {
        method: 'POST',
        headers,
        body: JSON.stringify({ data: basicInfo })
      });

      // Create medical conditions from chronicConditions
      if (profile.chronicConditions) {
        const conditions = profile.chronicConditions
          .split(',')
          .map((c: string) => c.trim())
          .filter((c: string) => c);
        
        if (conditions.length > 0) {
          const medicalConditions = conditions.map((condition: string, index: number) => ({
            id: `profile-condition-${Date.now()}-${index}`,
            name: condition,
            diagnosedDate: profile.dateOfBirth || new Date().toISOString().split('T')[0],
            severity: 'moderate' as const,
            notes: 'Imported from profile setup'
          }));

          await fetch(`${this.baseUrl}/medical_conditions`, {
            method: 'POST',
            headers,
            body: JSON.stringify({ data: medicalConditions })
          });
        }
      }

      // Create allergies
      if (profile.allergies) {
        const allergyList = profile.allergies
          .split(',')
          .map((a: string) => a.trim())
          .filter((a: string) => a);
        
        if (allergyList.length > 0) {
          const allergies = allergyList.map((allergen: string, index: number) => ({
            id: `profile-allergy-${Date.now()}-${index}`,
            allergen: allergen,
            type: 'Food Allergy',
            severity: 'moderate' as const,
            symptoms: [],
            notes: 'Imported from profile setup'
          }));

          await fetch(`${this.baseUrl}/allergies`, {
            method: 'POST',
            headers,
            body: JSON.stringify({ data: allergies })
          });
        }
      }

      console.log('✅ Profile data synced to Medical History successfully');
    } catch (error) {
      console.error('Error syncing to medical history:', error);
      // Don't throw error - profile is still saved
    }
  }
}

export const userProfileService = new UserProfileService();