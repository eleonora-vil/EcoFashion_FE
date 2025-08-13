import apiClient, { handleApiResponse } from "./baseApi";
import {
  applicationModelResponseSchema,
  ApplyApplicationFormValues,
  type ApplicationModelResponse,
} from "../../schemas/applyApplicationSchema";

// // Model for Application data returned from API
// // This matches the backend ApplicationModel structure
// // Use camelCase for all properties to match backend API
// export interface ApplicationModel {
//   applicationId: number;
//   userId: number;
//   targetRoleId: number;

//   // Portfolio & Profile Images
//   avatarUrl?: string;
//   bannerUrl?: string;
//   portfolioUrl?: string;
//   portfolioFiles?: string; // JSON array of file urls
//   specializationUrl?: string;
//   bio?: string;
//   certificates?: string;
//   taxNumber?: string;
//   address?: string;

//   // Social Media
//   socialLinks?: string; // JSON object of social media links

//   // Identification / Xác minh - 2 hình CCCD mat truoc và sau

//   identificationNumber?: string;
//   identificationPictureFront?: string;
//   identificationPictureBack?: string;
//   isIdentificationVerified?: boolean;

//   //Tracking
//   createdAt: string;
//   processedAt?: string;

//   // Kết quả xử lý
//   processedBy?: number;
//   rejectionReason?: string;
//   note?: string;

//   status: "pending" | "approved" | "rejected";

//   // Navigation properties
//   user?: {
//     userId: number;
//     fullName?: string;
//     email?: string;
//   };
//   role?: {
//     roleId: number;
//     roleName: string;
//   };
//   processedByUser?: {
//     userId: number;
//     fullName?: string;
//     email?: string;
//   };

//   phoneNumber?: string;
// }

// Mapping schema
export const backendFieldMapping = {
  // Frontend field -> Backend field
  avatarFile: "AvatarFile", //File upload
  bannerFile: "BannerFile", //File upload
  portfolioUrl: "PortfolioUrl",
  portfolioFiles: "PortfolioFiles",
  bio: "Bio",
  specializationUrl: "SpecializationUrl",
  socialLinks: "SocialLinks",
  identificationNumber: "IdentificationNumber",
  identificationPictureFront: "IdentificationPictureFront", // File upload
  identificationPictureBack: "IdentificationPictureBack", // File upload
  note: "Note",
  phoneNumber: "PhoneNumber",
  address: "Address",
  taxNumber: "TaxNumber",
  certificates: "Certificates",
} as const;

export interface ApiResult<T> {
  success: boolean; // Backend response sử dụng camelCase
  result: T; // Backend response sử dụng camelCase
  errorMessage?: string; // Backend response sử dụng camelCase
}

class ApplicationService {
  private readonly API_BASE = "Applications";

  /**
   * Helper method to create FormData for file upload
   */
  private createFormData(request: ApplyApplicationFormValues): FormData {
    const formData = new FormData();

    // Profile images - match backend field names exactly
    if (request.avatarFile) {
      formData.append(backendFieldMapping.avatarFile, request.avatarFile);
    }
    if (request.bannerFile) {
      formData.append(backendFieldMapping.bannerFile, request.bannerFile);
    }

    // Portfolio files (multiple)
    if (request.portfolioFiles && request.portfolioFiles.length > 0) {
      request.portfolioFiles.forEach((file) => {
        formData.append(backendFieldMapping.portfolioFiles, file);
      });
    }

    // Identification files (Front/Back)
    if (request.identificationPictureFront) {
      formData.append(
        backendFieldMapping.identificationPictureFront,
        request.identificationPictureFront as File
      );
    }
    if (request.identificationPictureBack) {
      formData.append(
        backendFieldMapping.identificationPictureBack,
        request.identificationPictureBack as File
      );
    }

    // Text fields - match backend field names exactly
    if (request.portfolioUrl)
      formData.append(backendFieldMapping.portfolioUrl, request.portfolioUrl);
    if (request.specializationUrl)
      formData.append(
        backendFieldMapping.specializationUrl,
        request.specializationUrl
      );
    if (request.bio) formData.append(backendFieldMapping.bio, request.bio);
    if (request.socialLinks)
      formData.append(backendFieldMapping.socialLinks, request.socialLinks);
    if (request.identificationNumber)
      formData.append(
        backendFieldMapping.identificationNumber,
        request.identificationNumber
      );
    if (request.note) formData.append(backendFieldMapping.note, request.note);
    if (request.phoneNumber)
      formData.append(backendFieldMapping.phoneNumber, request.phoneNumber);
    if (request.address)
      formData.append(backendFieldMapping.address, request.address);
    if (request.taxNumber)
      formData.append(backendFieldMapping.taxNumber, request.taxNumber);
    if (request.certificates)
      formData.append(backendFieldMapping.certificates, request.certificates);

    // Checkbox: agreedToTerms (nếu có)
    if (typeof (request as any).agreedToTerms !== "undefined") {
      formData.append(
        "agreedToTerms",
        (request as any).agreedToTerms ? "true" : "false"
      );
    }

    return formData;
  }

  // User đăng ký làm Designer
  async applyAsDesigner(
    request: ApplyApplicationFormValues
  ): Promise<ApplicationModelResponse> {
    const formData = this.createFormData(request);

    const response = await apiClient.post<any>(
      `${this.API_BASE}/ApplyDesigner`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        timeout: 300000, // 5 minutes for file upload
      }
    );
    const result = handleApiResponse<ApplicationModelResponse>(response);
    return applicationModelResponseSchema.parse(result);
  }

  // User đăng ký làm Supplier
  async applyAsSupplier(
    request: ApplyApplicationFormValues
  ): Promise<ApplicationModelResponse> {
    const formData = this.createFormData(request);

    const response = await apiClient.post<any>(
      `${this.API_BASE}/ApplySupplier`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        timeout: 300000, // 5 minutes for file upload
      }
    );
    const result = handleApiResponse<ApplicationModelResponse>(response);
    return applicationModelResponseSchema.parse(result);
  }

  // User xem đơn đăng ký của mình
  async getMyApplications(): Promise<ApplicationModelResponse[]> {
    const response = await apiClient.get<any>(
      `${this.API_BASE}/MyApplications`
    );
    const result = handleApiResponse<ApplicationModelResponse[]>(response);
    return result.map((item) => applicationModelResponseSchema.parse(item));
  }

  // Xem chi tiết đơn đăng ký
  async getApplicationById(id: number): Promise<ApplicationModelResponse> {
    const response = await apiClient.get<any>(`${this.API_BASE}/${id}`);
    const result = handleApiResponse<ApplicationModelResponse>(response);
    return applicationModelResponseSchema.parse(result);
  }

  // Admin - Xem tất cả đơn đăng ký
  async getAllApplications(): Promise<ApplicationModelResponse[]> {
    const response = await apiClient.get<any>(`${this.API_BASE}`);
    const result = handleApiResponse<{
      applications: ApplicationModelResponse[];
    }>(response);
    return result.applications.map((item) => applicationModelResponseSchema.parse(item));
  }

  // Admin - Lọc đơn đăng ký
  async filterApplications(params: {
    status?: string;
    targetRoleId?: number;
    createdFrom?: string;
    createdTo?: string;
  }): Promise<ApplicationModelResponse[]> {
    const queryParams = new URLSearchParams();

    if (params.status) queryParams.append("status", params.status);
    if (params.targetRoleId)
      queryParams.append("targetRoleId", params.targetRoleId.toString());
    if (params.createdFrom)
      queryParams.append("createdFrom", params.createdFrom);
    if (params.createdTo) queryParams.append("createdTo", params.createdTo);

    const response = await apiClient.get<any>(
      `${this.API_BASE}/Filter?${queryParams.toString()}`
    );

    const result = handleApiResponse<{
      applications: ApplicationModelResponse[];
    }>(response);
    return result.applications.map((item) => applicationModelResponseSchema.parse(item));
  }

  // Admin - Tìm kiếm đơn đăng ký
  async searchApplications(
    keyword?: string
  ): Promise<ApplicationModelResponse[]> {
    const queryParams = new URLSearchParams();
    if (keyword) queryParams.append("keyword", keyword);

    const response = await apiClient.get<any>(
      `${this.API_BASE}/Search?${queryParams.toString()}`
    );

    const result = handleApiResponse<{
      applications: ApplicationModelResponse[];
    }>(response);
    return result.applications.map((item) => applicationModelResponseSchema.parse(item));
  }

  // Admin - Phê duyệt Designer
  async approveDesignerApplication(applicationId: number): Promise<void> {
    const response = await apiClient.put<any>(
      `${this.API_BASE}/${applicationId}/ApproveDesigner`
    );

    handleApiResponse<string>(response);
  }

  // Admin - Phê duyệt Supplier
  async approveSupplierApplication(applicationId: number): Promise<void> {
    const response = await apiClient.put<any>(
      `${this.API_BASE}/${applicationId}/ApproveSupplier`
    );

    handleApiResponse<string>(response);
  }

  // Admin - Từ chối đơn đăng ký
  async rejectApplication(
    applicationId: number,
    rejectionReason: string
  ): Promise<void> {
    const response = await apiClient.put<any>(
      `${this.API_BASE}/${applicationId}/Reject`,
      { rejectionReason }
    );

    handleApiResponse<string>(response);
  }
}

export const applicationService = new ApplicationService();
