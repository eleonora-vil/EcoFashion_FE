// Base API configuration
import axios from "axios";
import type { AxiosResponse } from "axios";

// Determine API base URL based on environment
const API_BASE_URL = import.meta.env.DEV
  ? "http://localhost:5148/api"
  : "https://yourdomain.com/api";

// Create axios instance with common config
export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 300000, //10000
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
  withCredentials: false, // Disable credentials for CORS
});

// Request interceptor
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("authToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // Log all requests in dev mode
    if (import.meta.env.DEV) {
      console.log(
        `🚀 API Request: ${config.method?.toUpperCase()} ${config.url}`
      );
    }

    return config;
  },
  (error) => {
    console.error("❌ Request Error:", error);
    return Promise.reject(error);
  }
);

// Response interceptor
apiClient.interceptors.response.use(
  (response: AxiosResponse) => {
    // Log responses in dev mode
    if (import.meta.env.DEV) {
      console.log(
        `✅ API Response: ${response.config.method?.toUpperCase()} ${
          response.config.url
        } - ${response.status}`
      );
    }
    return response;
  },
  (error) => {
    // Handle common errors
    if (error.response?.status === 401) {
      // Check if this is a legitimate auth failure vs missing authorization
      const errorMessage =
        error.response?.data?.ErrorMessage ||
        error.response?.data?.message ||
        "";

      // Only auto-logout for actual token expiration, not missing authorization
      if (
        errorMessage.toLowerCase().includes("token") ||
        errorMessage.toLowerCase().includes("expired") ||
        errorMessage.toLowerCase().includes("invalid token")
      ) {
        console.warn("Token expired, logging out");
        localStorage.removeItem("authToken");
        localStorage.removeItem("tokenExpiresAt");
        localStorage.removeItem("userInfo");
        window.location.href = "/login";
      } else {
        // For other 401 errors (like missing authorization), just log but don't logout
        console.warn(
          "Authorization error but keeping user logged in:",
          errorMessage
        );
      }
    }

    console.error("❌ API Error:", {
      status: error.response?.status,
      message: error.response?.data?.message || error.message,
      url: error.config?.url,
      error: error,
    });

    return Promise.reject(error);
  }
);

// Common interfaces - matching backend ApiResult structure
export interface BaseApiResponse<T = any> {
  Success: boolean;
  Result?: T;
  ErrorMessage?: string;
  success?: boolean;
  data?: T;
  result?: T;
  message?: string;
  errorMessage?: string;
  errors?: string[];
}

// Generic API error class
export class ApiError extends Error {
  public status?: number;
  public code?: string;

  constructor(message: string, status?: number, code?: string) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.code = code;
  }
}

// Generic API response handler - Improved version
export const handleApiResponse = <T>(
  response: AxiosResponse<BaseApiResponse<T>>
): T => {
  const { data } = response;

  // Check camelCase format first (preferred - từ backend với JsonNamingPolicy.CamelCase)
  if (data.success !== undefined) {
    if (data.success) {
      return data.result || data.data || (data as unknown as T);
    } else {
      throw new ApiError(
        data.errorMessage || data.message || "API call failed",
        response.status
      );
    }
  }

  // Check PascalCase format (fallback - cho backward compatibility)
  if (data.Success !== undefined) {
    if (data.Success) {
      return data.Result || (data as unknown as T);
    } else {
      throw new ApiError(
        data.ErrorMessage || "API call failed",
        response.status
      );
    }
  }

  // Handle array response directly (common for list endpoints)
  if (Array.isArray(data)) {
    return data as T;
  }

  // Direct data (for cases where response is directly the data)
  if (typeof data === "object" && data !== null) {
    return data as T;
  }

  // If all else fails
  throw new ApiError("Invalid API response format", response.status);
};

// Generic error handler
export const handleApiError = (error: any): never => {
  if (error.response?.data) {
    const { data } = error.response;
    // Check backend format first (uppercase)
    const message =
      data.ErrorMessage ||
      data.errorMessage ||
      data.message ||
      "API error occurred";
    throw new ApiError(message, error.response.status, data.code);
  } else if (
    error.code === "ECONNREFUSED" ||
    error.message.includes("Network Error")
  ) {
    throw new ApiError(
      "Không thể kết nối đến server. Vui lòng kiểm tra kết nối mạng."
    );
  } else {
    throw new ApiError(error.message || "Đã xảy ra lỗi không xác định");
  }
};

export default apiClient;
