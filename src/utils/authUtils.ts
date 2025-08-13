import { useAuthStore } from '../store/authStore';
import type { User } from '../services/api/authService';

/**
 * Utility functions for authentication and profile management
 */

// ===== Basic User Utilities =====

/**
 * Get user data from localStorage
 * @returns User object or null if not found/invalid
 */
export const getUserFromStorage = (): User | null => {
  try {
    const userInfo = localStorage.getItem('userInfo');
    if (userInfo) {
      const userData: User = JSON.parse(userInfo);
      return userData;
    }
  } catch (error) {
    console.error('Error loading user data from localStorage:', error);
  }
  return null;
};

/**
 * Get the correct avatar URL for a user
 * @param user User object
 * @returns Avatar URL or null
 */
export const getUserAvatarUrl = (user: User | null): string | null => {
  if (!user) return null;
  return user.avatarUrl || null;
};

/**
 * Get user initials from full name
 * @param fullName User's full name
 * @param fallback Fallback text if no name provided
 * @returns User initials (max 2 characters)
 */
export const getUserInitials = (fullName?: string, fallback: string = 'U'): string => {
  if (!fullName) return fallback;
  return fullName
    .split(' ')
    .map(name => name.charAt(0))
    .join('')
    .toUpperCase()
    .slice(0, 2);
};

/**
 * Check if user is authenticated
 * @returns boolean
 */
export const isAuthenticated = (): boolean => {
  try {
    const token = localStorage.getItem('authToken');
    const tokenExpiresAt = localStorage.getItem('tokenExpiresAt');
    
    if (!token || !tokenExpiresAt) return false;
    
    const expirationTime = new Date(tokenExpiresAt).getTime();
    const currentTime = Date.now();
    
    return currentTime < expirationTime;
  } catch (error) {
    console.error('Error checking authentication:', error);
    return false;
  }
};

/**
 * Get role display name
 * @param role User role from API
 * @returns Formatted role name
 */
export const getRoleDisplayName = (role: string): string => {
  const roleMap: Record<string, string> = {
    'admin': 'Admin',
    'supplier': 'Supplier',
    'customer': 'Customer',
    'designer': 'Designer'
  };
  
  return roleMap[role.toLowerCase()] || role;
};

/**
 * Check if user has specific role
 * @param user User object
 * @param role Role to check
 * @returns boolean
 */
export const hasRole = (user: User | null, role: string): boolean => {
  if (!user) return false;
  return user.role.toLowerCase() === role.toLowerCase();
};

/**
 * Check if user is admin
 * @param user User object
 * @returns boolean
 */
export const isAdmin = (user: User | null): boolean => {
  return hasRole(user, 'admin');
};

/**
 * Check if user is supplier
 * @param user User object
 * @returns boolean
 */
export const isSupplier = (user: User | null): boolean => {
  return hasRole(user, 'supplier');
};

/**
 * Check if user is customer
 * @param user User object
 * @returns boolean
 */
export const isCustomer = (user: User | null): boolean => {
  return hasRole(user, 'customer');
};

/**
 * Check if user is designer
 * @param user User object
 * @returns boolean
 */
export const isDesigner = (user: User | null): boolean => {
  return hasRole(user, 'designer');
};

// ===== Advanced Auth Utilities =====

/**
 * Clear all auth data
 */
export const clearAllAuthData = () => {
  const clearAuth = useAuthStore.getState().clearAuth;
  
  // Clear Zustand store
  clearAuth();
  
  // Clear localStorage
  localStorage.removeItem('authToken');
  localStorage.removeItem('tokenExpiresAt');
  localStorage.removeItem('userInfo');
  localStorage.removeItem('supplierInfo');
  
  // Clear React Query cache if available
  try {
    // Dynamic import to avoid issues if React Query is not installed
    const { useQueryClient } = require('@tanstack/react-query');
    const queryClient = useQueryClient();
    if (queryClient) {
      queryClient.clear();
    }
  } catch (error) {
    // React Query not available, skip cache clearing
    console.log('React Query not available for cache clearing');
  }
};

/**
 * Get current user profile based on role
 */
export const getCurrentUserProfile = () => {
  const { user, supplierProfile, designerProfile } = useAuthStore.getState();
  
  if (!user) return null;
  
  switch (user.role) {
    case 'supplier':
      return supplierProfile;
    case 'designer':
      return designerProfile;
    default:
      return null;
  }
};

/**
 * Check if user has a complete profile
 */
export const hasCompleteProfile = () => {
  const profile = getCurrentUserProfile();
  if (!profile) return false;
  
  // Check if profile has required fields based on role
  const { user } = useAuthStore.getState();
  
  if (user?.role === 'supplier') {
    return !!(profile as any).supplierName && !!(profile as any).email;
  }
  
  if (user?.role === 'designer') {
    return !!(profile as any).designerName && !!(profile as any).email;
  }
  
  return false;
};

/**
 * Check if user needs to complete profile
 */
export const needsProfileCompletion = () => {
  const { user } = useAuthStore.getState();
  
  if (!user) return false;
  
  // Admin and customer don't need additional profiles
  if (user.role === 'admin' || user.role === 'customer') {
    return false;
  }
  
  // Supplier and designer need complete profiles
  return !hasCompleteProfile();
};

/**
 * Get profile completion percentage
 */
export const getProfileCompletionPercentage = () => {
  const profile = getCurrentUserProfile();
  if (!profile) return 0;
  
  const { user } = useAuthStore.getState();
  const requiredFields = user?.role === 'supplier' 
    ? ['supplierName', 'email', 'phoneNumber', 'address']
    : ['designerName', 'email', 'phoneNumber', 'address'];
  
  let completedFields = 0;
  
  requiredFields.forEach(field => {
    if ((profile as any)[field]) {
      completedFields++;
    }
  });
  
  return Math.round((completedFields / requiredFields.length) * 100);
};

/**
 * Invalidate profile queries when profile is updated
 */
export const invalidateProfileQueries = () => {
  try {
    // Dynamic import to avoid issues if React Query is not installed
    const { useQueryClient } = require('@tanstack/react-query');
    const queryClient = useQueryClient();
    const { user } = useAuthStore.getState();
    
    if (!user || !queryClient) return;
    
    if (user.role === 'supplier') {
      queryClient.invalidateQueries({ queryKey: ['supplier', 'profile'] });
    } else if (user.role === 'designer') {
      queryClient.invalidateQueries({ queryKey: ['designer', 'profile'] });
    }
  } catch (error) {
    // React Query not available, skip invalidation
    console.log('React Query not available for cache invalidation');
  }
};

/**
 * Refresh user profile data
 */
export const refreshUserProfile = async () => {
  const { loadUserProfile } = useAuthStore.getState();
  await loadUserProfile();
  invalidateProfileQueries();
}; 