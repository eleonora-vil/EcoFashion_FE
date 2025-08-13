import { create } from "zustand";
import { persist } from "zustand/middleware";
import { AuthService } from "../services/api/authService";
import type {
  User,
  AuthResponse,
  SignupResponse,
} from "../services/api/authService";
import type { SupplierModel } from "../services/api/supplierService";
import type { DesignerProfile } from "../services/api/designerService";
import {
  getUserAvatarUrl,
  getUserInitials,
  hasRole,
  isAdmin,
  isSupplier,
  isCustomer,
  isDesigner,
  isAuthenticated,
} from "../utils/authUtils";
import { clearAllAuthData } from "../utils/authUtils";

interface AuthState {
  // State
  user: User | null;
  supplierProfile: SupplierModel | null;
  designerProfile: DesignerProfile | null;
  loading: boolean;
  isAuthenticated: boolean;
  isLoadingProfile: boolean;

  // Actions
  setUser: (user: User | null) => void;
  setSupplierProfile: (profile: SupplierModel | null) => void;
  setDesignerProfile: (profile: DesignerProfile | null) => void;
  setLoading: (loading: boolean) => void;
  setLoadingProfile: (loading: boolean) => void;

  // Auth methods
  login: (email: string, password: string) => Promise<AuthResponse>;
  signup: (
    email: string,
    password: string,
    fullname: string,
    username: string,
    phone?: string
  ) => Promise<SignupResponse>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;

  // Profile loading methods
  loadUserProfile: () => Promise<void>;

  // User utilities
  getAvatarUrl: () => string | null;
  getDesignerId: () => string | null;
  getInitials: (fallback?: string) => string;
  getDisplayName: () => string;

  // Role checks
  hasRole: (role: string) => boolean;
  isAdmin: () => boolean;
  isSupplier: () => boolean;
  isCustomer: () => boolean;
  isDesigner: () => boolean;

  // Token utilities
  isTokenValid: () => boolean;

  // Clear all data
  clearAuth: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      // Initial state
      user: null,
      supplierProfile: null,
      designerProfile: null,
      loading: false,
      isAuthenticated: false,
      isLoadingProfile: false,

      // Actions
      setUser: (user) => set({ user, isAuthenticated: !!user }),
      setSupplierProfile: (supplierProfile) => set({ supplierProfile }),
      setDesignerProfile: (designerProfile) => set({ designerProfile }),
      setLoading: (loading) => set({ loading }),
      setLoadingProfile: (isLoadingProfile) => set({ isLoadingProfile }),

      // Auth methods
      login: async (email: string, password: string) => {
        set({ loading: true });
        try {
          const response = await AuthService.login(email, password);

          // AuthService already handles localStorage
          set({
            user: response.user,
            isAuthenticated: true,
            loading: false,
          });

          // Auto-load profile based on role
          await get().loadUserProfile();

          return response;
        } catch (error) {
          set({ loading: false });
          throw error;
        }
      },

      signup: async (
        email: string,
        password: string,
        fullname: string,
        username: string,
        phone?: string
      ) => {
        set({ loading: true });
        try {
          const response = await AuthService.signup(
            email,
            password,
            fullname,
            username,
            phone
          );
          set({ loading: false });
          return response;
        } catch (error) {
          set({ loading: false });
          throw error;
        }
      },

      logout: async () => {
        set({ loading: true });
        try {
          // Try to call logout API, but don't fail if it doesn't work
          try {
            await AuthService.logout();
          } catch (apiError) {
            console.warn(
              "Logout API call failed, but continuing with local logout:",
              apiError
            );
          }

          // Always clear local data
          clearAllAuthData();
          set({
            user: null,
            supplierProfile: null,
            designerProfile: null,
            isAuthenticated: false,
            loading: false,
          });
        } catch (error) {
          console.error("Logout error:", error);
          // Even if there's an error, clear the state
          set({
            user: null,
            supplierProfile: null,
            designerProfile: null,
            isAuthenticated: false,
            loading: false,
          });
        }
      },

      refreshUser: async () => {
        const { user } = get();
        if (!user) return;

        try {
          const freshUser = await AuthService.refreshUserProfile();
          set({ user: freshUser });

          // Refresh profile data
          await get().loadUserProfile();
        } catch (error) {
          console.error("Error refreshing user:", error);
          // Don't logout on refresh error, just log it
        }
      },

      // Profile loading methods
      loadUserProfile: async () => {
        const { user } = get();
        if (!user) return;

        set({ isLoadingProfile: true });

        try {
          if (user.role === "supplier") {
            const { SupplierService } = await import(
              "../services/api/supplierService"
            );
            const profile = await SupplierService.getSupplierByUserId(
              user.userId
            );
            set({ supplierProfile: profile });
          } else if (user.role === "designer") {
            const { DesignerService } = await import(
              "../services/api/designerService"
            );
            const profile = await DesignerService.getDesignerByUserId(
              user.userId
            );
            set({ designerProfile: profile });
          }
        } catch (error) {
          console.error("Error loading user profile:", error);
        } finally {
          set({ isLoadingProfile: false });
        }
      },

      // User utilities - use functions from userUtils
      getAvatarUrl: () => {
        const { user, supplierProfile, designerProfile } = get();

        // Check supplier profile first
        if (supplierProfile?.avatarUrl) {
          return supplierProfile.avatarUrl;
        }

        // Check designer profile
        if (designerProfile?.avatarUrl) {
          return designerProfile.avatarUrl;
        }

        // Fallback to user avatar
        return getUserAvatarUrl(user);
      },

      // User utilities - use functions from userUtils
      getDesignerId: () => get().designerProfile?.designerId || null,

      getInitials: (fallback: string = "U") => {
        const { user, supplierProfile, designerProfile } = get();

        let displayName: string | undefined;

        if (supplierProfile?.supplierName) {
          displayName = supplierProfile.supplierName;
        } else if (designerProfile?.designerName) {
          displayName = designerProfile.designerName;
        } else {
          displayName = user?.fullName;
        }

        return getUserInitials(displayName, fallback);
      },

      getDisplayName: () => {
        const { user, supplierProfile, designerProfile } = get();

        let displayName: string;

        if (supplierProfile?.supplierName) {
          displayName = supplierProfile.supplierName;
        } else if (designerProfile?.designerName) {
          displayName = designerProfile.designerName;
        } else if (user?.fullName) {
          displayName = user.fullName;
        } else if (user?.email) {
          displayName = user.email;
        } else {
          displayName = "User";
        }

        return displayName;
      },

      // Role checks - use functions from userUtils
      hasRole: (role: string) => {
        const { user } = get();
        return hasRole(user, role);
      },

      isAdmin: () => {
        const { user } = get();
        return isAdmin(user);
      },

      isSupplier: () => {
        const { user } = get();
        return isSupplier(user);
      },

      isCustomer: () => {
        const { user } = get();
        return isCustomer(user);
      },

      isDesigner: () => {
        const { user } = get();
        return isDesigner(user);
      },

      // Token utilities
      isTokenValid: () => {
        return isAuthenticated();
      },

      // Clear all data
      clearAuth: () => {
        set({
          user: null,
          supplierProfile: null,
          designerProfile: null,
          isAuthenticated: false,
          loading: false,
          isLoadingProfile: false,
        });
      },
    }),
    {
      name: "auth-storage", // localStorage key
      partialize: (state) => ({
        // Only persist user and profile data, not loading states
        user: state.user,
        supplierProfile: state.supplierProfile,
        designerProfile: state.designerProfile,
        isAuthenticated: state.isAuthenticated,
      }),
      onRehydrateStorage: () => (state) => {
        // Called after hydration is finished
        if (state) {
          // Check if token is still valid
          if (!isAuthenticated()) {
            // Token expired, clear state
            state.user = null;
            state.supplierProfile = null;
            state.designerProfile = null;
            state.isAuthenticated = false;
          } else {
            // Token is valid, load user from localStorage
            const userInfo = localStorage.getItem("userInfo");
            if (userInfo) {
              try {
                const user: User = JSON.parse(userInfo);
                state.user = user;
                state.isAuthenticated = true;
              } catch (error) {
                console.error("Error parsing user info on rehydration:", error);
                // Clear invalid data
                state.user = null;
                state.supplierProfile = null;
                state.designerProfile = null;
                state.isAuthenticated = false;
              }
            }
          }
        }
      },
    }
  )
);
