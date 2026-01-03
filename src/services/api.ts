/**
 * DIETEC API Client
 * 
 * HYBRID ARCHITECTURE:
 * - Supabase: Authentication (login, signup, session management)
 * - FastAPI: AI features, complex processing, health analytics
 * 
 * The frontend uses Supabase tokens to authenticate with FastAPI.
 */

import { supabase } from "../utils/supabase/client";

// API Configuration
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v1';
const USE_FASTAPI = import.meta.env.VITE_USE_FASTAPI === 'true';

/**
 * API Client class for making requests to the FastAPI backend
 */
class ApiClient {
  private baseUrl: string;

  constructor(baseUrl: string = API_BASE_URL) {
    this.baseUrl = baseUrl;
  }

  /**
   * Get authentication headers with Supabase token
   */
  private async getAuthHeaders(): Promise<HeadersInit> {
    const { data: { session } } = await supabase.auth.getSession();
    
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };

    if (session?.access_token) {
      headers['Authorization'] = `Bearer ${session.access_token}`;
    }

    return headers;
  }

  /**
   * Make a GET request
   */
  async get<T>(endpoint: string, params?: Record<string, string>): Promise<T> {
    const headers = await this.getAuthHeaders();
    
    let url = `${this.baseUrl}${endpoint}`;
    if (params) {
      const searchParams = new URLSearchParams(params);
      url += `?${searchParams.toString()}`;
    }

    const response = await fetch(url, {
      method: 'GET',
      headers,
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ detail: 'Request failed' }));
      throw new Error(error.detail || `HTTP ${response.status}`);
    }

    return response.json();
  }

  /**
   * Make a POST request
   */
  async post<T>(endpoint: string, data?: unknown): Promise<T> {
    const headers = await this.getAuthHeaders();

    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      method: 'POST',
      headers,
      body: data ? JSON.stringify(data) : undefined,
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ detail: 'Request failed' }));
      throw new Error(error.detail || `HTTP ${response.status}`);
    }

    return response.json();
  }

  /**
   * Make a PUT request
   */
  async put<T>(endpoint: string, data?: unknown): Promise<T> {
    const headers = await this.getAuthHeaders();

    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      method: 'PUT',
      headers,
      body: data ? JSON.stringify(data) : undefined,
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ detail: 'Request failed' }));
      throw new Error(error.detail || `HTTP ${response.status}`);
    }

    return response.json();
  }

  /**
   * Make a DELETE request
   */
  async delete<T>(endpoint: string): Promise<T> {
    const headers = await this.getAuthHeaders();

    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      method: 'DELETE',
      headers,
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ detail: 'Request failed' }));
      throw new Error(error.detail || `HTTP ${response.status}`);
    }

    return response.json();
  }
}

// Create singleton instance
const apiClient = new ApiClient();

// ==================== User API ====================

export const userApi = {
  /**
   * Get current user info
   */
  getCurrentUser: () => apiClient.get<{
    id: string;
    email: string;
    full_name?: string;
    phone?: string;
    is_profile_complete: boolean;
  }>('/users/me'),

  /**
   * Update current user
   */
  updateUser: (data: {
    full_name?: string;
    phone?: string;
    date_of_birth?: string;
    gender?: string;
    address?: string;
  }) => apiClient.put<{ message: string }>('/users/me', data),

  /**
   * Get user profile
   */
  getProfile: () => apiClient.get<UserProfile | null>('/users/profile'),

  /**
   * Save user profile
   */
  saveProfile: (data: UserProfileInput) => 
    apiClient.post<{ message: string }>('/users/profile', data),

  /**
   * Check if profile is complete
   */
  isProfileComplete: () => 
    apiClient.get<{ is_complete: boolean }>('/users/profile/complete'),
};

// ==================== Medical API ====================

export const medicalApi = {
  // Basic Info
  getBasicInfo: () => apiClient.get<BasicInfo | null>('/medical/basic-info'),
  saveBasicInfo: (data: BasicInfoInput) => 
    apiClient.post<{ message: string }>('/medical/basic-info', data),

  // Medical Conditions
  getConditions: () => apiClient.get<MedicalCondition[]>('/medical/conditions'),
  createCondition: (data: MedicalConditionInput) => 
    apiClient.post<{ message: string; id: string }>('/medical/conditions', data),
  saveConditionsBulk: (conditions: MedicalConditionInput[]) => 
    apiClient.post<{ message: string }>('/medical/conditions/bulk', conditions),
  deleteCondition: (id: string) => 
    apiClient.delete<{ message: string }>(`/medical/conditions/${id}`),

  // Allergies
  getAllergies: () => apiClient.get<Allergy[]>('/medical/allergies'),
  createAllergy: (data: AllergyInput) => 
    apiClient.post<{ message: string; id: string }>('/medical/allergies', data),
  saveAllergiesBulk: (allergies: AllergyInput[]) => 
    apiClient.post<{ message: string }>('/medical/allergies/bulk', allergies),
  deleteAllergy: (id: string) => 
    apiClient.delete<{ message: string }>(`/medical/allergies/${id}`),

  // Skin Problems
  getSkinProblems: () => apiClient.get<SkinProblem[]>('/medical/skin-problems'),
  createSkinProblem: (data: SkinProblemInput) => 
    apiClient.post<{ message: string; id: string }>('/medical/skin-problems', data),
  saveSkinProblemsBulk: (problems: SkinProblemInput[]) => 
    apiClient.post<{ message: string }>('/medical/skin-problems/bulk', problems),
  deleteSkinProblem: (id: string) => 
    apiClient.delete<{ message: string }>(`/medical/skin-problems/${id}`),
};

// ==================== Chat API ====================

export const chatApi = {
  /**
   * Send message to AI and get response
   */
  sendMessage: (message: string, chatType: 'nutrition' | 'medical' | 'general' = 'general') =>
    apiClient.post<ChatResponse>('/chat/send', { message, chat_type: chatType }),

  /**
   * Get chat history
   */
  getHistory: (chatType?: string, limit: number = 50) =>
    apiClient.get<ChatResponse[]>('/chat/history', { 
      ...(chatType && { chat_type: chatType }),
      limit: limit.toString()
    }),

  /**
   * Clear chat history
   */
  clearHistory: (chatType?: string) =>
    apiClient.delete<{ message: string }>(
      chatType ? `/chat/history?chat_type=${chatType}` : '/chat/history'
    ),
};

// ==================== Health API ====================

export const healthApi = {
  /**
   * Get daily health data
   */
  getDaily: (date?: string) =>
    apiClient.get<DailyHealth>('/health/daily', date ? { date_str: date } : undefined),

  /**
   * Update daily health data
   */
  updateDaily: (data: DailyHealthInput) =>
    apiClient.post<{ message: string }>('/health/daily', data),

  /**
   * Update steps count
   */
  updateSteps: (steps: number, date?: string) =>
    apiClient.post<{ message: string; steps: number }>('/health/steps', { steps, date }),

  /**
   * Update water intake
   */
  updateWater: (glasses: number, date?: string) =>
    apiClient.post<{ message: string; glasses: number }>('/health/water', { glasses, date }),

  /**
   * Get health history
   */
  getHistory: (days: number = 7) =>
    apiClient.get<DailyHealth[]>('/health/history', { days: days.toString() }),
};

// ==================== Type Definitions ====================

export interface UserProfile {
  fullName: string;
  dateOfBirth: string;
  gender: string;
  phone: string;
  address: string;
  bloodGroup?: string;
  height?: string;
  weight?: string;
  allergies?: string;
  chronicConditions?: string;
  currentMedications?: string;
  emergencyContact?: string;
  emergencyPhone?: string;
  emergencyRelation?: string;
}

export interface UserProfileInput {
  full_name: string;
  date_of_birth: string;
  gender: string;
  phone: string;
  address: string;
  blood_group?: string;
  height?: string;
  weight?: string;
  allergies?: string;
  chronic_conditions?: string;
  current_medications?: string;
  emergency_contact_name?: string;
  emergency_contact_phone?: string;
  emergency_contact_relation?: string;
}

export interface BasicInfo {
  id?: string;
  age?: string;
  gender?: string;
  bloodType?: string;
  height?: string;
  weight?: string;
  emergencyContact?: string;
}

export interface BasicInfoInput {
  age?: string;
  gender?: string;
  blood_type?: string;
  height?: string;
  weight?: string;
  emergency_contact?: string;
}

export interface MedicalCondition {
  id: string;
  name: string;
  diagnosedDate?: string;
  severity: 'mild' | 'moderate' | 'severe';
  notes?: string;
}

export interface MedicalConditionInput {
  name: string;
  diagnosed_date?: string;
  severity?: 'mild' | 'moderate' | 'severe';
  notes?: string;
}

export interface Allergy {
  id: string;
  allergen: string;
  type?: string;
  severity: 'mild' | 'moderate' | 'severe';
  symptoms?: string[];
  notes?: string;
}

export interface AllergyInput {
  allergen: string;
  allergy_type?: string;
  severity?: 'mild' | 'moderate' | 'severe';
  symptoms?: string[];
  notes?: string;
}

export interface SkinProblem {
  id: string;
  condition: string;
  bodyPart?: string;
  severity: 'mild' | 'moderate' | 'severe';
  duration?: string;
  treatment?: string;
  notes?: string;
}

export interface SkinProblemInput {
  condition: string;
  body_part?: string;
  severity?: 'mild' | 'moderate' | 'severe';
  duration?: string;
  treatment?: string;
  notes?: string;
}

export interface ChatResponse {
  id?: string;
  message: string;
  response: string;
  chat_type?: string;
  created_at?: string;
}

export interface DailyHealth {
  id?: string;
  date: string;
  steps: number;
  steps_goal: number;
  water_intake: number;
  water_goal: number;
  sleep_hours: number;
  weight?: number;
  notes?: string;
}

export interface DailyHealthInput {
  date?: string;
  steps?: number;
  steps_goal?: number;
  water_intake?: number;
  water_goal?: number;
  sleep_hours?: number;
  weight?: number;
  notes?: string;
}

// Export the API client for direct use if needed
export { apiClient };
