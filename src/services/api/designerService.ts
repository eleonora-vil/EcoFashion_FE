// Designer service - specialized for designer operations
import { apiClient, handleApiResponse, handleApiError } from "./baseApi";
import type { BaseApiResponse } from "./baseApi";

// Types for designer operations
export interface DesignerProfile {
  designerId: string;
  userId: number;
  designerName: string;
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

export interface UpdateDesignerRequest {
  designerName?: string;
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

export interface DesignerSummary {
  designerId: string;
  designerName?: string;
  avatarUrl?: string;
  bio?: string;
  bannerUrl?: string;
  rating?: number;
  reviewCount?: number;
  createdAt: string;
}

export interface DesignerPublic {
  designerId: string;
  designerName?: string;
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
  createdAt: string;
  userFullName?: string;
}

export interface FollowedSupplierResponse {
  supplierId: string;
  supplierName?: string;
  portfolioUrl?: string;
}

/**
 * Designer Service
 * Handles all designer-related API calls
 */
export class DesignerService {
  private static readonly API_BASE = "Designer";

  /**
   * Get current user's designer profile
   */
  static async getDesignerProfile(): Promise<DesignerProfile> {
    try {
      const response = await apiClient.get<BaseApiResponse<DesignerProfile>>(
        `${this.API_BASE}/profile`
      );
      return handleApiResponse(response);
    } catch (error) {
      return handleApiError(error);
    }
  }

  /**
   * Get designer profile by user ID
   */
  static async getDesignerByUserId(userId: number): Promise<DesignerProfile> {
    try {
      const response = await apiClient.get<BaseApiResponse<DesignerProfile>>(
        `${this.API_BASE}/user/${userId}`
      );
      return handleApiResponse(response);
    } catch (error) {
      return handleApiError(error);
    }
  }

  /**
   * Update current user's designer profile
   */
  static async updateDesignerProfile(
    profileData: UpdateDesignerRequest
  ): Promise<DesignerProfile> {
    try {
      const response = await apiClient.put<BaseApiResponse<string>>(
        `${this.API_BASE}/profile`,
        profileData
      );
      handleApiResponse(response);
    } catch (error) {
      return handleApiError(error);
    }
  }

  /**
   * Get public designers for directory listing (no auth required)
   */
  static async getPublicDesigners(
    page: number = 1,
    pageSize: number = 12
  ): Promise<DesignerSummary[]> {
    try {
      const response = await apiClient.get<BaseApiResponse<DesignerSummary[]>>(
        `${this.API_BASE}/public?page=${page}&pageSize=${pageSize}`
      );
      return handleApiResponse(response);
    } catch (error) {
      return handleApiError(error);
    }
  }

  /**
   * Get designer public profile for landing page (no auth required)
   */
  static async getDesignerPublicProfile(
    designerId: string
  ): Promise<DesignerPublic> {
    try {
      const response = await apiClient.get<BaseApiResponse<DesignerPublic>>(
        `${this.API_BASE}/public/${designerId}`
      );
      return handleApiResponse(response);
    } catch (error) {
      return handleApiError(error);
    }
  }

  /**
   * Search public designers (no auth required)
   */
  static async searchPublicDesigners(
    keyword?: string,
    page: number = 1,
    pageSize: number = 12
  ): Promise<DesignerSummary[]> {
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        pageSize: pageSize.toString(),
      });

      if (keyword) {
        params.append("keyword", keyword);
      }

      const response = await apiClient.get<BaseApiResponse<DesignerSummary[]>>(
        `${this.API_BASE}/public/search?${params.toString()}`
      );
      return handleApiResponse(response);
    } catch (error) {
      return handleApiError(error);
    }
  }

  /**
   * Get featured designers for homepage (no auth required)
   */
  static async getFeaturedDesigners(
    count: number = 6
  ): Promise<DesignerSummary[]> {
    try {
      const response = await apiClient.get<BaseApiResponse<DesignerSummary[]>>(
        `${this.API_BASE}/public/featured?count=${count}`
      );
      return handleApiResponse(response);
    } catch (error) {
      return handleApiError(error);
    }
  }

  /**
   * Follow a supplier
   */
  static async followSupplier(
    supplierId: string
  ): Promise<FollowedSupplierResponse> {
    try {
      const response = await apiClient.post<
        BaseApiResponse<FollowedSupplierResponse>
      >(`${this.API_BASE}/follow/${supplierId}`);
      return handleApiResponse(response);
    } catch (error) {
      return handleApiError(error);
    }
  }

  /**
   * Get followed suppliers
   */
  static async getFollowedSuppliers(): Promise<any[]> {
    try {
      const response = await apiClient.get<BaseApiResponse<any[]>>(
        `${this.API_BASE}/follow`
      );
      return handleApiResponse(response);
    } catch (error) {
      return handleApiError(error);
    }
  }

  /**
   * Unfollow a supplier
   */
  static async unfollowSupplier(supplierId: string): Promise<void> {
    try {
      const response = await apiClient.delete<BaseApiResponse<string>>(
        `${this.API_BASE}/follow/${supplierId}`
      );
      handleApiResponse(response);
    } catch (error) {
      return handleApiError(error);
    }
  }
}

export default DesignerService;
