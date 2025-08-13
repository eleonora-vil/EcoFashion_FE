import { z } from 'zod';

export const materialStockDtoSchema = z.object({
  stockId: z.number(),
  materialId: z.number(),
  warehouseId: z.number(),
  quantityOnHand: z.number(),
  minThreshold: z.number(),
  lastUpdated: z.union([z.string(), z.date()]),
  note: z.string().nullable().optional(),
  materialName: z.string().nullable().optional(),
  warehouseName: z.string().nullable().optional(),
  unit: z.string().nullable().optional(),
  imageUrl: z.string().nullable().optional(),
  warehouseType: z.string().nullable().optional(),
  quantityAvailable: z.number(),
  pricePerUnit: z.number(),
});

export const materialStockTransactionDtoSchema = z.object({
  transactionId: z.number(),
  materialId: z.number(),
  warehouseId: z.number(),
  transactionType: z.string(),
  quantityChange: z.number(),
  beforeQty: z.number(),
  afterQty: z.number(),
  unit: z.string().nullable().optional(),
  referenceType: z.string().nullable().optional(),
  referenceId: z.string().nullable().optional(),
  note: z.string().nullable().optional(),
  createdByUserId: z.number().nullable().optional(),
  createdAt: z.union([z.string(), z.date()]),
  materialName: z.string().nullable().optional(),
  warehouseName: z.string().nullable().optional(),
  supplierName: z.string().nullable().optional(),
  imageUrl: z.string().nullable().optional(),
  warehouseType: z.string().nullable().optional(),
});

export const receiveMaterialRequestSchema = z.object({
  materialId: z.number(),
  warehouseId: z.number(),
  quantity: z.number().min(0.000001, { message: 'Số lượng phải > 0' }),
  unit: z.string().optional(),
  note: z.string().optional(),
  referenceType: z.string().optional(),
  referenceId: z.string().optional(),
});

export type MaterialStockDto = z.infer<typeof materialStockDtoSchema>;
export type MaterialStockTransactionDto = z.infer<typeof materialStockTransactionDtoSchema>;
export type ReceiveMaterialRequest = z.infer<typeof receiveMaterialRequestSchema>;


