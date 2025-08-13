// Designer service - specialized for designer operations
import {
  CreateDesignFormValues,
  CreateDesignModelResponse,
  createDesignModelResponseSchema,
} from "../../schemas/designSchema";
import { apiClient, handleApiResponse, handleApiError } from "./baseApi";
import type { BaseApiResponse } from "./baseApi";

// export interface DesignTypes {
//     type_id: string;
//     name: string;
// }

// Types for designer operations
// export interface Design {
//   designId: number;
//   designerId: string;
//   name?: string  ;
//   description?: string;
//   recycledPercentage: number ;
//   careInstructions?: string ;
//   price: number;
//   productScore: number;
//   status?: string;
//   createdAt: string;
//   designTypeId?: number;
// }

export interface SustainabilityCriterion {
  criterionId: number;
  name: string;
  description: string;
  unit: string;
  value: number;
}

export interface Material {
  materialId: number;
  persentageUsed: number;
  meterUsed: number;
  materialName: string;
  materialTypeName: string;
  sustainabilityCriteria: SustainabilityCriterion[];
  description: string;
  sustainabilityScore: number;
  carbonFootprint: number;
  carbonFootprintUnit: string;
  waterUsage: number;
  waterUsageUnit: string;
  wasteDiverted: number;
  wasteDivertedUnit: string;
  certificates: string;
  supplierName: string;
  pricePerUnit: number;
  createdAt: string;
}

export interface TypeMaterial {
  materialId: number;
  name: string;
  pricePerUnit: string;
  quantityAvailable: number;
  carbonFootprint: number;
  carbonFootprintUnit: string;
  waterUsage: number;
  waterUsageUnit: string;
  wasteDiverted: number;
  wasteDivertedUnit: string;
  productionCountry: string;
  productionRegion: string;
  transportDistance: number;
  transportMethod: string;
  supplierName: string;
  sustainabilityScore: number;
  sustainabilityColor: string;
  certificationDetails: string;
}

export interface MaterialInStored {
  materialId: number;
  persentageUsed: number;
  meterUsed: number;
  name: string;
  materialTypeName: string;
  sustainabilityCriteria: SustainabilityCriterion[];
  materialDescription: string;
  sustainabilityScore: number;
  carbonFootprint: number;
  carbonFootprintUnit: string;
  waterUsage: number;
  waterUsageUnit: string;
  wasteDiverted: number;
  wasteDivertedUnit: string;
  certificationDetails: string;
  supplierName: string;
  pricePerUnit: number;
  createdAt: string;
}

export interface StoredMaterial {
  inventoryId: number;
  designerId: number;
  material: MaterialInStored;
  materialId: number;
  quantity: number;
  cost: number;
  lastBuyDate: string;
}

export interface Designer {
  designerId: string;
  designerName: string;
  avatarUrl: string;
  bio: string;
  specializationUrl: string;
  portfolioUrl: string;
  bannerUrl: string;
  rating: number | null;
  reviewCount: number | null;
  certificates: string; // or string[] if you parse JSON
  createAt: string;
}

export interface DesignType {
  designTypeId: number;
  designName: string;
}

export interface MaterialType {
  typeId: number;
  typeName: string;
}

export interface Feature {
  reduceWaste?: boolean;
  lowImpactDyes?: boolean;
  durable?: boolean;
  ethicallyManufactured?: boolean;
}
export interface Design {
  designId: number;
  name: string;
  recycledPercentage: number;
  itemTypeName: string;
  salePrice: number;
  designImageUrls: string[];
  materials: Material[];
  productCount: number;
  designer: Designer;
  createAt: string;
}

export interface Products {
  productId: number;
  sku: string;
  price: number;
  colorCode: string;
  sizeId: number;
  quantityAvailable: number;
  sizeName: string;
}

export interface DesignDetails {
  designId: number;
  name: string;
  recycledPercentage: number;
  itemTypeName: string;
  salePrice: number;
  designImages: string[];
  materials: Material[];
  productCount: number;
  designer: Designer;
  createAt: string;
  description: string;
  feature: Feature;
  careInstruction: string;
  carbonFootprint: number;
  waterUsage: number;
  wasteDiverted: number;
  products: Products[];
}

export interface DesignResponse {
  design: Design;
}

export const designFieldMapping = {
  name: "Name",
  description: "Description",
  recycledPercentage: "RecycledPercentage",
  careInstructions: "CareInstructions",
  price: "Price",
  productScore: "ProductScore",
  status: "Status",
  designTypeId: "DesignTypeId",

  // Feature (flattened in request)
  reduceWaste: "Feature.ReduceWaste",
  lowImpactDyes: "Feature.LowImpactDyes",
  durable: "Feature.Durable",
  ethicallyManufactured: "Feature.EthicallyManufactured",

  materialsJson: "MaterialsJson",
  imageFiles: "ImageFiles", // multi-file upload
};

/**
 * Design Service
 * Handles all designer-related API calls
 */
export class DesignService {
  private static readonly API_BASE = "Design";

  /**
   * Get all design
   */
  static async getAllDesign(): Promise<Design[]> {
    try {
      const response = await apiClient.get<BaseApiResponse<Design[]>>(
        `/${this.API_BASE}/designs-with-products`
      );
      return handleApiResponse(response);
    } catch (error) {
      return handleApiError(error);
    }
  }

  /**
   * Get all design
   */
  static async getAllDesignByDesigner(designerId: string): Promise<Design[]> {
    try {
      const response = await apiClient.get<BaseApiResponse<Design[]>>(
        `/${this.API_BASE}/designer/${designerId}`
      );
      return handleApiResponse(response);
    } catch (error) {
      return handleApiError(error);
    }
  }

  /**
   * Get all design with pagination
   */
  static async getAllDesignPagination(
    page: number,
    pageSize: number
  ): Promise<Design[]> {
    try {
      const response = await apiClient.get<BaseApiResponse<Design[]>>(
        `/${this.API_BASE}/GetDesignsWithProductsPagination?page=${page}&pageSize=${pageSize}`
      );
      return handleApiResponse(response);
    } catch (error) {
      return handleApiError(error);
    }
  }

  static async getAllDesignByDesignerPagination(
    uid: string,
    page: number = 1,
    pageSize: number = 12
  ): Promise<Design[]> {
    try {
      const response = await apiClient.get<BaseApiResponse<Design[]>>(
        `/${this.API_BASE}/GetAllPagination-by-designer/${uid}?page=${page}&pageSize=${pageSize}`
      );
      return handleApiResponse(response);
    } catch (error) {
      return handleApiError(error);
    }
  }

  /**
   * Get designer profile by designer ID
   */
  static async getDesignDetailById(
    id: number,
    designerId: string
  ): Promise<DesignDetails> {
    try {
      //   const response = await apiClient.get<BaseApiResponse<DesignerResponse>>(
      //     `/${this.API_BASE}/Detail/${designId}`
      //   );
      const response = await apiClient.get<BaseApiResponse<DesignDetails>>(
        `/${this.API_BASE}/${id}/designer/${designerId}`
      );
      return handleApiResponse(response);
    } catch (error) {
      return handleApiError(error);
    }
  }

  /**
   * Get material
   */
  static async getMaterial(): Promise<TypeMaterial[]> {
    try {
      const response = await apiClient.get<BaseApiResponse<TypeMaterial[]>>(
        `/Material`
      );
      return handleApiResponse(response);
    } catch (error) {
      return handleApiError(error);
    }
  }

  /**
   * Get stored material
   */
  static async getStoredMaterial(
    designerId: string
  ): Promise<StoredMaterial[]> {
    try {
      const response = await apiClient.get<BaseApiResponse<StoredMaterial[]>>(
        `/DesignerMaterialInventories/GetStoredMaterial/${designerId}`
      );
      return handleApiResponse(response);
    } catch (error) {
      return handleApiError(error);
    }
  }

  /**
   * Helper method to create FormData for file upload
   */
  private static createFormData(request: CreateDesignFormValues): FormData {
    const formData = new FormData();

    // Text/number fields
    if (request.name) formData.append(designFieldMapping.name, request.name);
    if (request.description)
      formData.append(designFieldMapping.description, request.description);
    formData.append(
      designFieldMapping.recycledPercentage,
      request.recycledPercentage.toString()
    );
    if (request.careInstructions)
      formData.append(
        designFieldMapping.careInstructions,
        request.careInstructions
      );
    formData.append(designFieldMapping.price, request.salePrice.toString());
    formData.append(
      designFieldMapping.productScore,
      request.productScore.toString()
    );
    if (request.status)
      formData.append(designFieldMapping.status, request.status);
    if (request.designTypeId)
      formData.append(
        designFieldMapping.designTypeId,
        request.designTypeId.toString()
      );

    // Feature
    formData.append(
      designFieldMapping.reduceWaste,
      request.feature.reduceWaste.toString()
    );
    formData.append(
      designFieldMapping.lowImpactDyes,
      request.feature.lowImpactDyes.toString()
    );
    formData.append(
      designFieldMapping.durable,
      request.feature.durable.toString()
    );
    formData.append(
      designFieldMapping.ethicallyManufactured,
      request.feature.ethicallyManufactured.toString()
    );

    // Materials (as JSON string)
    const materialsJson = JSON.stringify(request.materialsJson);
    formData.append(designFieldMapping.materialsJson, materialsJson);

    // Image files
    request.imageFiles.forEach((file) => {
      formData.append(designFieldMapping.imageFiles, file);
    });

    return formData;
  }

  /**
   * Create Design
   */
  static async createDesign(
    request: CreateDesignFormValues
  ): Promise<CreateDesignModelResponse> {
    const formData = this.createFormData(request);

    try {
      const response = await apiClient.post<any>(
        `/${this.API_BASE}/Create`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          timeout: 300000, // 5 minutes for file upload
        }
      );
      // const result = handleApiResponse<CreateDesignModelResponse>(response);
      // return createDesignModelResponseSchema.parse(result);
      return handleApiResponse(response);
    } catch (error) {
      return handleApiError(error);
    }
  }

  /**
   * Get Design Type
   */
  static async getDesignType(): Promise<DesignType[]> {
    try {
      const response = await apiClient.get<BaseApiResponse<DesignType[]>>(
        `/DesignTypes`
      );
      return handleApiResponse(response);
    } catch (error) {
      return handleApiError(error);
    }
  }

  /**
   * Get Material Type
   */
  static async getMaterialType(): Promise<MaterialType[]> {
    try {
      const response = await apiClient.get<BaseApiResponse<MaterialType[]>>(
        `/MaterialTypes`
      );
      return handleApiResponse(response);
    } catch (error) {
      return handleApiError(error);
    }
  }

  /**
   * Get material by Type
   */
  static async getMaterialByType(id: number): Promise<TypeMaterial[]> {
    try {
      const response = await apiClient.get<BaseApiResponse<TypeMaterial[]>>(
        `/Material/GetAllMaterialByType/${id}`
      );
      return handleApiResponse(response);
    } catch (error) {
      return handleApiError(error);
    }
  }
}
export default DesignService;
