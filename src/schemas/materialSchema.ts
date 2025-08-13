import { z } from "zod";

// Helper function để tạo nullable string schema
const nullableString = () => z.string().nullable().optional();

// Helper: chuyển các giá trị rỗng/NaN thành undefined cho số optional
const optionalNonNegativeNumber = () =>
  z.preprocess((val) => {
    if (val === '' || val === null || typeof val === 'undefined') return undefined;
    if (typeof val === 'string' && val.trim() === '') return undefined;
    if (typeof val === 'number' && Number.isNaN(val)) return undefined;
    return val;
  }, z.number().min(0, { message: 'Giá trị phải >= 0' }));

// Helper: phần trăm 0-100 (optional)
const optionalPercentNumber = () =>
  z.preprocess((val) => {
    if (val === '' || val === null || typeof val === 'undefined') return undefined;
    if (typeof val === 'string' && val.trim() === '') return undefined;
    if (typeof val === 'number' && Number.isNaN(val)) return undefined;
    return val;
  }, z.number().min(0, { message: 'Tối thiểu 0%' }).max(100, { message: 'Tối đa 100%' }));

// Schema cho Sustainability Criterion (theo MaterialSustainabilityCriterionDto)
export const sustainabilityCriterionSchema = z.object({
  criterionId: z.union([z.number(), z.string()]).transform((val) => typeof val === 'string' ? parseInt(val) : val),
  name: nullableString(),
  description: nullableString(),
  unit: nullableString(),
  value: z.union([z.number(), z.string()]).transform((val) => typeof val === 'string' ? parseFloat(val) : val),
});

// Schema cho Material Type Benchmark (theo MaterialTypeBenchmarkModel)
export const materialTypeBenchmarkSchema = z.object({
  benchmarkId: z.union([z.number(), z.string()]).transform((val) => typeof val === 'string' ? parseInt(val) : val),
  typeId: z.union([z.number(), z.string()]).transform((val) => typeof val === 'string' ? parseInt(val) : val),
  criteriaId: z.union([z.number(), z.string()]).transform((val) => typeof val === 'string' ? parseInt(val) : val),
  value: z.union([z.number(), z.string()]).transform((val) => typeof val === 'string' ? parseFloat(val) : val), // Giá trị chuẩn (benchmark)
  materialType: z.object({
    typeId: z.union([z.number(), z.string()]).transform((val) => typeof val === 'string' ? parseInt(val) : val),
    typeName: nullableString(),
    description: nullableString(),
    category: nullableString(),
    isOrganic: z.boolean(),
    isRecycled: z.boolean(),
    sustainabilityNotes: nullableString(),
    displayOrder: z.union([z.number(), z.string()]).transform((val) => typeof val === 'string' ? parseInt(val) : val),
    isActive: z.boolean(),
  }).optional(),
  sustainabilityCriteria: z.object({
    criterionId: z.union([z.number(), z.string()]).transform((val) => typeof val === 'string' ? parseInt(val) : val),
    name: nullableString(),
    description: nullableString(),
    unit: nullableString(),
    weight: z.union([z.number(), z.string()]).transform((val) => typeof val === 'string' ? parseFloat(val) : val),
    thresholds: nullableString(),
    isActive: z.boolean(),
    displayOrder: z.union([z.number(), z.string()]).transform((val) => typeof val === 'string' ? parseInt(val) : val),
  }).optional(),
  // Thêm các trường so sánh
  actualValue: z.union([z.number(), z.string()]).transform((val) => typeof val === 'string' ? parseFloat(val) : val).nullable().optional(), // Giá trị thực tế của material
  improvementPercentage: z.union([z.number(), z.string()]).transform((val) => typeof val === 'string' ? parseFloat(val) : val).nullable().optional(), // Phần trăm cải thiện
  improvementStatus: nullableString(), // Trạng thái: "Tốt hơn", "Kém hơn", "Bằng"
  improvementColor: nullableString(), // Màu sắc: "success", "error", "warning"
});

export type MaterialTypeBenchmarkModel = z.infer<typeof materialTypeBenchmarkSchema>;

// Schema cho Supplier Public Info (theo SupplierPublicModel từ backend)
export const supplierPublicSchema = z.object({
  supplierId: z.string(), // Guid được serialize thành string
  supplierName: nullableString(),
  avatarUrl: nullableString(),
  bio: nullableString(),
  specializationUrl: nullableString(),
  portfolioUrl: nullableString(),
  portfolioFiles: nullableString(),
  bannerUrl: nullableString(),
  email: nullableString(),
  phoneNumber: nullableString(),
  address: nullableString(),
  rating: z.union([z.number(), z.string()]).transform((val) => typeof val === 'string' ? parseFloat(val) : val).optional(),
  reviewCount: z.union([z.number(), z.string()]).transform((val) => typeof val === 'string' ? parseInt(val) : val).optional(),
  certificates: nullableString(),
  createdAt: z.union([z.string(), z.date()]), // DateTime được serialize thành string
  userFullName: nullableString(),
});

// Schema cho Material Detail DTO (theo MaterialDetailDto từ backend)
export const materialDetailDtoSchema = z.object({
  materialId: z.number(),
  name: nullableString(),
  description: nullableString(),
  materialTypeName: nullableString(),
  recycledPercentage: z.number().nullable().optional(),
  quantityAvailable: z.number(),
  pricePerUnit: z.number(),
  createdAt: nullableString(), // DateTime được serialize thành string
  lastUpdated: nullableString(), // DateTime được serialize thành string
  carbonFootprint: z.number().optional(),
  carbonFootprintUnit: nullableString(),
  waterUsage: z.number().optional(),
  waterUsageUnit: nullableString(),
  wasteDiverted: z.number().optional(),
  wasteDivertedUnit: nullableString(),
  productionCountry: nullableString(),
  productionRegion: nullableString(), // Thêm field mới
  manufacturingProcess: nullableString(),
  certificationDetails: nullableString(),
  certificationExpiryDate: nullableString(), // DateTime được serialize thành string
  transportDistance: z.number().nullable().optional(), // Thêm field mới
  transportMethod: nullableString(), // Thêm field mới
  approvalStatus: nullableString(),
  adminNote: nullableString(),
  isAvailable: z.boolean(),
  imageUrls: z.array(z.string()).optional(),
  supplierName: nullableString(),
  supplierId: nullableString(), // Guid được serialize thành string
  documentationUrl: nullableString(),
  
  // Sustainability fields
  sustainabilityScore: z.number().optional(),
  sustainabilityLevel: nullableString(),
  sustainabilityColor: nullableString(),
  
  // Supplier object
  supplier: supplierPublicSchema.optional(),
  
  // Sustainability criteria
  sustainabilityCriteria: z.array(sustainabilityCriterionSchema).optional(),
  
  // Benchmarks
  benchmarks: z.array(materialTypeBenchmarkSchema).optional(),
});

// Schema cho Material Detail Response (theo MaterialDetailResponse từ backend)
export const materialDetailResponseSchema = z.object({
  materialId: z.union([z.number(), z.string()]).transform((val) => typeof val === 'string' ? parseInt(val) : val),
  materialTypeName: nullableString(),
  name: nullableString(),
  description: nullableString(),
  recycledPercentage: z.union([z.number(), z.string()]).transform((val) => typeof val === 'string' ? parseFloat(val) : val).nullable().optional(),
  quantityAvailable: z.union([z.number(), z.string()]).transform((val) => typeof val === 'string' ? parseInt(val) : val),
  pricePerUnit: z.union([z.number(), z.string()]).transform((val) => typeof val === 'string' ? parseFloat(val) : val),
  documentationUrl: nullableString(),
  createdAt: z.union([z.string(), z.date()]),
  lastUpdated: z.union([z.string(), z.date()]),
  carbonFootprint: z.union([z.number(), z.string()]).transform((val) => typeof val === 'string' ? parseFloat(val) : val).optional(),
  carbonFootprintUnit: nullableString(),
  waterUsage: z.union([z.number(), z.string()]).transform((val) => typeof val === 'string' ? parseFloat(val) : val).optional(),
  waterUsageUnit: nullableString(),
  wasteDiverted: z.union([z.number(), z.string()]).transform((val) => typeof val === 'string' ? parseFloat(val) : val).optional(),
  wasteDivertedUnit: nullableString(),
  productionCountry: nullableString(),
  productionRegion: nullableString(), // Thêm field mới
  manufacturingProcess: nullableString(),
  certificationDetails: nullableString(),
  certificationExpiryDate: z.union([z.string(), z.date()]).nullable().optional(),
  transportDistance: z.union([z.number(), z.string()]).transform((val) => typeof val === 'string' ? parseFloat(val) : val).nullable().optional(), // Thêm field mới
  transportMethod: nullableString(), // Thêm field mới
  approvalStatus: nullableString(),
  adminNote: nullableString(),
  isAvailable: z.boolean(),
  imageUrls: z.array(z.string()).optional(),
  sustainabilityCriteria: z.array(sustainabilityCriterionSchema).optional(),
  benchmarks: z.array(materialTypeBenchmarkSchema).optional(),
  supplier: supplierPublicSchema.optional(), // Sử dụng schema mới
  sustainabilityScore: z.union([z.number(), z.string()]).transform((val) => typeof val === 'string' ? parseFloat(val) : val).optional(),
  sustainabilityLevel: nullableString(),
  sustainabilityColor: nullableString(),
});

// Schema cho Material Type Model (theo MaterialTypeModel từ backend)
export const materialTypeModelSchema = z.object({
  typeId: z.number(),
  typeName: nullableString(),
  description: nullableString(),
  category: nullableString(),
  isOrganic: z.boolean(),
  isRecycled: z.boolean(),
  sustainabilityNotes: nullableString(),
  displayOrder: z.number(),
  isActive: z.boolean(),
});

// Schema cho Material Model (theo MaterialModel từ backend)
export const materialModelSchema = z.object({
  materialId: z.number(),
  name: nullableString(),
  description: nullableString(),
  recycledPercentage: z.number(),
  quantityAvailable: z.number(),
  pricePerUnit: z.number(),
  documentationUrl: nullableString(),
  carbonFootprint: z.number().optional(),
  carbonFootprintUnit: nullableString(),
  waterUsage: z.number().optional(),
  waterUsageUnit: nullableString(),
  wasteDiverted: z.number().optional(),
  wasteDivertedUnit: nullableString(),
  productionCountry: nullableString(),
  productionRegion: nullableString(), // Thêm field mới
  manufacturingProcess: nullableString(),
  certificationDetails: nullableString(),
  certificationExpiryDate: nullableString(),
  transportDistance: z.number().nullable().optional(), // Thêm field mới
  transportMethod: nullableString(), // Thêm field mới
  approvalStatus: nullableString(),
  adminNote: nullableString(),
  isAvailable: z.boolean(),
  lastUpdated: z.string(),
  createdAt: z.string(),
  materialType: materialTypeModelSchema.optional(),
  supplier: supplierPublicSchema.optional(), // Sử dụng schema mới
});

// Schema cho Material Creation Form Request (theo MaterialCreationFormRequest từ backend)
export const materialCreationFormRequestSchema = z.object({
  // Backend expects: SupplierId (Guid), TypeId (int)
  supplierId: z.string().uuid({ message: 'Supplier không hợp lệ' }),
  typeId: z.number().int({ message: 'Loại vật liệu không hợp lệ' }).min(1, { message: 'Vui lòng chọn loại vật liệu' }),

  name: z.string().trim().min(2, { message: 'Tên vật liệu quá ngắn' }),
  description: nullableString(),
  recycledPercentage: z.number().min(0, { message: 'Tối thiểu 0%' }).max(100, { message: 'Tối đa 100%' }),
  quantityAvailable: z.number().min(1, { message: 'Số lượng phải >= 1' }),
  pricePerUnit: z.number().min(0, { message: 'Giá phải >= 0' }),
  documentationUrl: z.union([z.string().url({ message: 'URL không hợp lệ' }), z.literal('')]).optional(),

  // Sustainability numeric fields (optional)
  carbonFootprint: optionalNonNegativeNumber(),
  waterUsage: optionalNonNegativeNumber(),
  wasteDiverted: optionalPercentNumber(),

  // Production info
  productionCountry: z.string().trim().min(1, { message: 'Vui lòng chọn quốc gia sản xuất' }),
  productionRegion: nullableString(),
  manufacturingProcess: nullableString(),

  // Certifications
  isCertified: z.boolean().optional(),
  hasOrganicCertification: z.boolean().optional(),
  organicCertificationType: nullableString(),
  certificationDetails: nullableString(),
  certificationExpiryDate: nullableString(),
  qualityStandards: nullableString(),

  // Transport
  transportDistance: z.number().nullable().optional(),
  transportMethod: nullableString(),

  // Criteria values (optional; server will also infer organic & transport)
  sustainabilityCriteria: z.array(z.object({
    criterionId: z.number(),
    value: z.number(),
  })).optional(),

  // Optional availability (server overrides to Pending/IsAvailable=false)
  isAvailable: z.boolean().optional(),
});

// Schema for MaterialCreationResponse from backend
export const materialCreationResponseSchema = z.object({
  materialId: z.number(),
  name: z.string().optional(),
  description: nullableString(),
  materialTypeName: nullableString(),
  recycledPercentage: z.number(),
  quantityAvailable: z.number(),
  pricePerUnit: z.number(),
  documentationUrl: nullableString(),
  createdAt: z.union([z.string(), z.date()]),
  lastUpdated: z.union([z.string(), z.date()]),

  carbonFootprint: z.number().optional(),
  waterUsage: z.number().optional(),
  wasteDiverted: z.number().optional(),

  productionCountry: nullableString(),
  manufacturingProcess: nullableString(),
  certificationDetails: nullableString(),

  sustainabilityScore: z.number(),
  sustainabilityLevel: z.string(),
  sustainabilityColor: z.string(),
  marketPosition: z.string().optional(),
  competitiveAdvantage: z.string().optional(),

  criterionScores: z.array(z.object({
    criterionName: z.string(),
    actualValue: z.number(),
    benchmarkValue: z.number(),
    unit: z.string(),
    score: z.number(),
    status: z.string(),
  })).optional(),

  summary: z.object({
    totalCriteria: z.number(),
    excellentCriteria: z.number(),
    goodCriteria: z.number(),
    averageCriteria: z.number(),
    needsImprovementCriteria: z.number(),
    recommendation: z.string(),
  }).optional(),
});

// Schema cho Material Filter Request
export const materialFilterSchema = z.object({
  materialTypeId: z.number().optional(),
  supplierId: nullableString(),
  minPrice: z.number().optional(),
  maxPrice: z.number().optional(),
  minRecycledPercentage: z.number().optional(),
  maxRecycledPercentage: z.number().optional(),
  isAvailable: z.boolean().optional(),
  approvalStatus: nullableString(),
});

// Schema cho Material Search Request
export const materialSearchSchema = z.object({
  keyword: nullableString(),
  supplierId: nullableString(),
});

// Schema cho Material API Response
export const materialApiResponseSchema = z.object({
  success: z.boolean(),
  message: nullableString(),
  data: z.union([
    materialDetailDtoSchema,
    z.array(materialDetailDtoSchema),
    materialTypeModelSchema,
    z.array(materialTypeModelSchema),
  ]).optional(),
  errorMessage: nullableString(),
});

// Schema cho CriterionCalculationDetail
export const criterionCalculationDetailSchema = z.object({
  criterionName: z.string(),
  actualValue: z.union([z.number(), z.string()]).transform((val) => typeof val === 'string' ? parseFloat(val) : val),
  benchmarkValue: z.union([z.number(), z.string()]).transform((val) => typeof val === 'string' ? parseFloat(val) : val),
  unit: z.string(),
  score: z.union([z.number(), z.string()]).transform((val) => typeof val === 'string' ? parseFloat(val) : val),
  status: z.string(),
  explanation: z.string()
});

// Schema cho SustainabilitySummary
export const sustainabilitySummarySchema = z.object({
  totalCriteria: z.union([z.number(), z.string()]).transform((val) => typeof val === 'string' ? parseInt(val) : val),
  excellentCriteria: z.union([z.number(), z.string()]).transform((val) => typeof val === 'string' ? parseInt(val) : val),
  goodCriteria: z.union([z.number(), z.string()]).transform((val) => typeof val === 'string' ? parseInt(val) : val),
  averageCriteria: z.union([z.number(), z.string()]).transform((val) => typeof val === 'string' ? parseInt(val) : val),
  needsImprovementCriteria: z.union([z.number(), z.string()]).transform((val) => typeof val === 'string' ? parseInt(val) : val),
  recommendation: z.string()
});

// Schema cho MaterialSustainabilityReport
export const materialSustainabilityReportSchema = z.object({
  materialId: z.union([z.number(), z.string()]).transform((val) => typeof val === 'string' ? parseInt(val) : val),
  materialName: z.string(),
  materialTypeName: nullableString(),
  recycledPercentage: z.union([z.number(), z.string()]).transform((val) => typeof val === 'string' ? parseFloat(val) : val),
  overallSustainabilityScore: z.union([z.number(), z.string()]).transform((val) => typeof val === 'string' ? parseInt(val) : val),
  sustainabilityLevel: z.string(),
  levelColor: z.string(),
  criterionDetails: z.array(criterionCalculationDetailSchema),
  summary: sustainabilitySummarySchema
});

// Export types
export type SustainabilityCriterionDto = z.infer<typeof sustainabilityCriterionSchema>;
export type MaterialTypeBenchmarkDto = z.infer<typeof materialTypeBenchmarkSchema>;
export type SupplierPublicDto = z.infer<typeof supplierPublicSchema>;
export type MaterialDetailResponse = z.infer<typeof materialDetailResponseSchema>;
export type MaterialDetailDto = z.infer<typeof materialDetailDtoSchema>;
export type MaterialTypeModel = z.infer<typeof materialTypeModelSchema>;
export type MaterialModel = z.infer<typeof materialModelSchema>;
export type CriterionCalculationDetail = z.infer<typeof criterionCalculationDetailSchema>;
export type SustainabilitySummary = z.infer<typeof sustainabilitySummarySchema>;
export type MaterialSustainabilityReport = z.infer<typeof materialSustainabilityReportSchema>;
export type MaterialCreationFormRequest = z.infer<typeof materialCreationFormRequestSchema>;
export type MaterialCreationResponse = z.infer<typeof materialCreationResponseSchema>;
export type MaterialFilterRequest = z.infer<typeof materialFilterSchema>;
export type MaterialSearchRequest = z.infer<typeof materialSearchSchema>;
export type MaterialApiResponse = z.infer<typeof materialApiResponseSchema>; 

// Supplier Materials Response Schema
export const supplierMaterialSchema = z.object({
  materialId: z.string(),
  name: z.string(),
  description: z.string().optional(),
  typeId: z.number(),
  typeName: z.string(),
  category: z.string().optional(),
  quantityAvailable: z.number(),
  pricePerUnit: z.number(),
  recycledPercentage: z.number(),
  productionCountry: z.string().optional(),
  productionRegion: z.string().optional(),
  manufacturingProcess: z.string().optional(),
  certificationDetails: z.string().optional(),
  documentationUrl: z.string().optional(),
  approvalStatus: z.string(),
  isAvailable: z.boolean(),
  createdAt: z.string(),
  updatedAt: z.string(),
  sustainabilityScore: z.number().optional(),
  images: z.array(z.object({
    imageId: z.string(),
    imageUrl: z.string(),
    altText: z.string().optional()
  })).optional()
});

export const supplierMaterialsResponseSchema = z.object({
  data: z.array(supplierMaterialSchema)
});

export type SupplierMaterial = z.infer<typeof supplierMaterialSchema>;
export type SupplierMaterialsResponse = z.infer<typeof supplierMaterialsResponseSchema>; 