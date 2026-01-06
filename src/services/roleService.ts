/**
 * Role Management Service
 * Handles role-related operations and validations
 */

import { supabase } from "../utils/supabase/client";

export type UserRole = "patient" | "doctor" | "admin";

interface RoleValidation {
  isValid: boolean;
  error?: string;
}

class RoleService {
  /**
   * Get current user's role
   */
  async getCurrentUserRole(): Promise<UserRole> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        return "patient"; // Default role
      }
      return (user.user_metadata?.role || "patient") as UserRole;
    } catch (error) {
      console.error("Error getting user role:", error);
      return "patient";
    }
  }

  /**
   * Validate if user has access to a feature
   */
  async validateFeatureAccess(
    requiredRole: UserRole | UserRole[]
  ): Promise<RoleValidation> {
    const currentRole = await this.getCurrentUserRole();
    const roles = Array.isArray(requiredRole) ? requiredRole : [requiredRole];

    if (roles.includes(currentRole)) {
      return { isValid: true };
    }

    return {
      isValid: false,
      error: `Access denied. Required role: ${roles.join(" or ")}`
    };
  }

  /**
   * Check if user is doctor
   */
  async isDoctor(): Promise<boolean> {
    const role = await this.getCurrentUserRole();
    return role === "doctor";
  }

  /**
   * Check if user is admin
   */
  async isAdmin(): Promise<boolean> {
    const role = await this.getCurrentUserRole();
    return role === "admin";
  }

  /**
   * Check if user is patient
   */
  async isPatient(): Promise<boolean> {
    const role = await this.getCurrentUserRole();
    return role === "patient";
  }

  /**
   * Update user role (admin only)
   */
  async updateUserRole(userId: string, newRole: UserRole): Promise<void> {
    const isAdmin = await this.isAdmin();
    if (!isAdmin) {
      throw new Error("Only admins can update user roles");
    }

    const { error } = await supabase.auth.admin.updateUserById(userId, {
      user_metadata: { role: newRole }
    });

    if (error) {
      throw new Error(`Failed to update user role: ${error.message}`);
    }
  }

  /**
   * Get role display name
   */
  getRoleDisplayName(role: UserRole): string {
    const names: Record<UserRole, string> = {
      patient: "Patient",
      doctor: "Doctor",
      admin: "Administrator"
    };
    return names[role] || "User";
  }

  /**
   * Get role icon emoji
   */
  getRoleIcon(role: UserRole): string {
    const icons: Record<UserRole, string> = {
      patient: "👤",
      doctor: "👨‍⚕️",
      admin: "👮"
    };
    return icons[role] || "👤";
  }

  /**
   * Get role color
   */
  getRoleColor(role: UserRole): string {
    const colors: Record<UserRole, string> = {
      patient: "bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300",
      doctor: "bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300",
      admin: "bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300"
    };
    return colors[role] || "bg-gray-100 dark:bg-gray-900/30 text-gray-800 dark:text-gray-300";
  }
}

export const roleService = new RoleService();
