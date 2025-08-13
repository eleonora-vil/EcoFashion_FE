// API Services Index
// Centralized exports for all API services

// ===== Core API utilities =====
export { apiClient, ApiError } from "./baseApi";
export type { BaseApiResponse } from "./baseApi";

// ===== Authentication service =====
export { AuthService } from "./authService";
export type {
  LoginRequest,
  SignupRequest,
  VerifyOTPRequest,
  ResendOTPRequest,
  User,
  AuthResponse,
  SignupResponse,
  OTPResponse,
} from "./authService";

// ===== Designer service =====
export { DesignerService } from "./designerService";
export type {
  DesignerProfile,
  UpdateDesignerRequest,
  DesignerSummary,
  DesignerPublic,
  FollowedSupplierResponse,
} from "./designerService";

// ===== Supplier service =====
export { SupplierService } from "./supplierService";
export type {
  SupplierModel,
  SupplierPublic,
  SupplierSummary,
  UpdateSupplierRequest,
} from "./supplierService";

// ===== Design service =====
export { DesignService } from "./designService";

// ===== Material service =====
export { materialService } from "./materialService";

// ===== Application service =====
export { applicationService } from "./applicationService";

// ===== Default export =====
import { apiClient } from "./baseApi";
export default apiClient;
