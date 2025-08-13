import { apiClient, handleApiResponse } from "./baseApi";

// Interface để match với backend SupplierModel
export interface SupplierModel {
  supplierId: string;
  userId: number;
  supplierName?: string;
  avatarUrl?: string;
  bio?: string;
  specializationUrl?: string;
  portfolioUrl?: string;
  portfolioFiles?: string;
  bannerUrl?: string;
  email?: string;
  phoneNumber?: string;
  address?: string;
  taxNumber?: string;
  identificationNumber?: string;
  identificationPictureFront?: string;
  identificationPictureBack?: string;
  status?: string;
  createdAt: string;
  updatedAt?: string;
  rating?: number;
  reviewCount?: number;
  certificates?: string;
  user?: {
    userId: number;
    fullName?: string;
    email?: string;
  };
}

// Interface cho public profile
export interface SupplierPublic {
  supplierId: string;
  supplierName?: string;
  avatarUrl?: string;
  bio?: string;
  specializationUrl?: string;
  portfolioUrl?: string;
  portfolioFiles?: string;
  bannerUrl?: string;
  email?: string;
  phoneNumber?: string;
  address?: string;
  rating?: number;
  reviewCount?: number;
  certificates?: string;
  taxNumber?: string;
  identificationPictureOwner?: string;
  createdAt: string;
  userFullName?: string;
}

// Interface cho listing/summary
export interface SupplierSummary {
  supplierId: string;
  supplierName?: string;
  avatarUrl?: string;
  bio?: string;
  bannerUrl?: string;
  rating?: number;
  reviewCount?: number;
  createdAt: string;
}

// Interface cho update request
export interface UpdateSupplierRequest {
  supplierName?: string;
  avatarUrl?: string;
  portfolioUrl?: string;
  portfolioFiles?: string;
  bannerUrl?: string;
  specializationUrl?: string;
  email?: string;
  phoneNumber?: string;
  address?: string;
  taxNumber?: string;
  identificationNumber?: string;
  identificationPictureFront?: string;
  identificationPictureBack?: string;
  certificates?: string;
}

class SupplierService {
  private static readonly API_BASE = "supplier";

  // Public APIs
  static async getPublicSuppliers(
    page: number = 1,
    pageSize: number = 12
  ): Promise<SupplierSummary[]> {
    const response = await apiClient.get<any>(
      `${this.API_BASE}/public?page=${page}&pageSize=${pageSize}`
    );
    return handleApiResponse<SupplierSummary[]>(response);
  }

  static async getSupplierPublicProfile(id: string): Promise<SupplierPublic> {
    const response = await apiClient.get<any>(`${this.API_BASE}/public/${id}`);
    return handleApiResponse<SupplierPublic>(response);
  }

  static async searchPublicSuppliers(
    keyword?: string,
    page: number = 1,
    pageSize: number = 12
  ): Promise<SupplierSummary[]> {
    const params = new URLSearchParams({
      page: page.toString(),
      pageSize: pageSize.toString(),
    });

    if (keyword) {
      params.append("keyword", keyword);
    }

    const response = await apiClient.get<any>(
      `${this.API_BASE}/public/search?${params}`
    );
    return handleApiResponse<SupplierSummary[]>(response);
  }

  static async getFeaturedSuppliers(
    count: number = 6
  ): Promise<SupplierSummary[]> {
    const response = await apiClient.get<any>(
      `${this.API_BASE}/public/featured?count=${count}`
    );
    return handleApiResponse<SupplierSummary[]>(response);
  }

  // Authenticated APIs
  static async getSupplierProfile(): Promise<SupplierModel> {
    const response = await apiClient.get<any>(`${this.API_BASE}/profile`);
    return handleApiResponse<SupplierModel>(response);
  }

  static async getSupplierByUserId(userId: number): Promise<SupplierModel> {
    const response = await apiClient.get<any>(`${this.API_BASE}/user/${userId}`);
    return handleApiResponse<SupplierModel>(response);
  }

  static async updateSupplierProfile(request: UpdateSupplierRequest): Promise<void> {
    const response = await apiClient.put<any>(
      `${this.API_BASE}/profile`,
      request
    );
    handleApiResponse<void>(response);
  }
}

export { SupplierService };
export default SupplierService;
