// Authentication service - specialized for auth operations
import { apiClient, handleApiResponse, handleApiError } from "./baseApi";
import type { BaseApiResponse } from "./baseApi";

// Types for authentication
export interface LoginRequest {
  email: string;
  passwordHash: string;
  // ⚠️ Naming: Backend expects "passwordHash" field, but it's actually raw password
}

export interface SignupRequest {
  email: string;
  password: string;
  fullname: string;
  username: string;
  phone?: string;
}

export interface VerifyOTPRequest {
  email: string;
  otpCode: string;
}

export interface ResendOTPRequest {
  email: string;
}

export interface User {
  userId: number;
  fullName: string;
  email: string;
  phone?: string;
  username?: string;
  role: string;
  roleId: number;
  status: string;
  createdAt: string;
  avatarUrl?: string;
}

export interface AuthResponse {
  token: string;
  user: User;
  expiresAt: string;
}

export interface SignupResponse {
  success: boolean;
  message: string;
  email: string;
}

export interface OTPResponse {
  success: boolean;
  message: string;
}

/**
 * Authentication Service
 * Handles all authentication-related API calls
 */
export class AuthService {
  /**
   * User login
   */
  static async login(email: string, password: string): Promise<AuthResponse> {
    try {
      const credentials: LoginRequest = {
        email,
        passwordHash: password,
        // ⚠️ Raw password được gửi qua field "passwordHash"
      };

      const response = await apiClient.post<BaseApiResponse<AuthResponse>>(
        "/User/login",
        credentials
      );

      const authData = handleApiResponse(response);

      // Store auth data
      localStorage.setItem("authToken", authData.token);
      localStorage.setItem("tokenExpiresAt", authData.expiresAt);
      localStorage.setItem("userInfo", JSON.stringify(authData.user));

      return authData;
    } catch (error) {
      return handleApiError(error);
    }
  }

  /**
   * User signup/registration
   */
  static async signup(
    email: string,
    password: string,
    fullname: string,
    username: string,
    phone?: string
  ): Promise<SignupResponse> {
    try {
      const userData: SignupRequest = {
        email,
        password,
        fullname,
        username,
        phone,
      };

      const response = await apiClient.post<BaseApiResponse<SignupResponse>>(
        "/User/signup",
        userData
      );

      return handleApiResponse(response);
    } catch (error) {
      return handleApiError(error);
    }
  }

  /**
   * Verify OTP after signup
   */
  static async verifyOTP(email: string, otpCode: string): Promise<OTPResponse> {
    try {
      const otpData: VerifyOTPRequest = { email, otpCode };

      const response = await apiClient.post<BaseApiResponse<OTPResponse>>(
        "/User/verify-otp",
        otpData
      );

      return handleApiResponse(response);
    } catch (error) {
      return handleApiError(error);
    }
  }

  /**
   * Resend OTP
   */
  static async resendOTP(email: string): Promise<OTPResponse> {
    try {
      const resendData: ResendOTPRequest = { email };

      const response = await apiClient.post<BaseApiResponse<OTPResponse>>(
        "/User/resend-otp",
        resendData
      );

      return handleApiResponse(response);
    } catch (error) {
      return handleApiError(error);
    }
  }

  /**
   * Logout user
   */
  static async logout(): Promise<void> {
    // Backend doesn't have logout endpoint, just clear local data
    localStorage.removeItem("authToken");
    localStorage.removeItem("userInfo");
    localStorage.removeItem("tokenExpiresAt");
    localStorage.removeItem("supplierInfo"); // Also remove supplier data
  }

  /**
   * Get current user from localStorage
   */
  static getCurrentUser(): User | null {
    try {
      const userInfo = localStorage.getItem("userInfo");
      return userInfo ? JSON.parse(userInfo) : null;
    } catch (error) {
      return null;
    }
  }

  /**
   * Check if user is authenticated
   */
  static isAuthenticated(): boolean {
    const token = localStorage.getItem("authToken");
    const expiresAt = localStorage.getItem("tokenExpiresAt");

    if (!token || !expiresAt) {
      return false;
    }

    // Check if token is expired
    const now = new Date().getTime();
    const expiration = new Date(expiresAt).getTime();

    if (now >= expiration) {
      // Token expired, remove it
      AuthService.logout();
      return false;
    }

    return true;
  }

  /**
   * Get auth token
   */
  static getToken(): string | null {
    return localStorage.getItem("authToken");
  }

  /**
   * Refresh current user profile from server
   */
  static async refreshUserProfile(): Promise<User> {
    try {
      const response = await apiClient.get<BaseApiResponse<User>>(
        "/User/profile"
      );
      const userProfile = handleApiResponse(response);

      // Update localStorage with fresh user data
      localStorage.setItem("userInfo", JSON.stringify(userProfile));

      return userProfile;
    } catch (error) {
      return handleApiError(error);
    }
  }
}

export default AuthService;
