import apiClient, { handleApiResponse } from './baseApi';

export type InventorySummaryDto = {
  totalDistinctMaterials: number;
  totalOnHand: number;
  totalInventoryValue: number;
  lowStockCount: number;
  stockoutCount: number;
};

export type MovementPointDto = {
  date: string;
  inQty: number;
  outQty: number;
  netQty: number;
};

export type LowStockItemDto = {
  materialId: number;
  materialName?: string | null;
  warehouseId: number;
  warehouseName?: string | null;
  quantityOnHand: number;
  minThreshold: number;
  difference: number;
  pricePerUnit: number;
  estimatedValue: number;
  lastUpdated: string;
};

export type SupplierReceiptPointDto = {
  date: string;
  quantity: number;
  supplierName?: string | null;
};

class InventoryAnalyticsService {
  private readonly base = 'analytics/inventory';

  async getSummary(params: { from?: string; to?: string; supplierId?: string; warehouseId?: number; materialId?: number; }): Promise<InventorySummaryDto> {
    const resp = await apiClient.get(`${this.base}/summary`, { params });
    return handleApiResponse<InventorySummaryDto>(resp as any);
  }

  async getMovements(params: { from: string; to: string; supplierId?: string; warehouseId?: number; materialId?: number; }): Promise<MovementPointDto[]> {
    const resp = await apiClient.get(`${this.base}/movements`, { params });
    return handleApiResponse<MovementPointDto[]>(resp as any);
  }

  async getLowStock(params: { supplierId?: string; warehouseId?: number; materialTypeId?: number; limit?: number; }): Promise<LowStockItemDto[]> {
    const resp = await apiClient.get(`${this.base}/low-stock`, { params });
    return handleApiResponse<LowStockItemDto[]>(resp as any);
  }

  async getReceiptsBySupplier(params: { from: string; to: string; materialId?: number; }): Promise<SupplierReceiptPointDto[]> {
    const resp = await apiClient.get(`${this.base}/receipts-by-supplier`, { params });
    return handleApiResponse<SupplierReceiptPointDto[]>(resp as any);
  }
}

export const inventoryAnalyticsService = new InventoryAnalyticsService();
export default inventoryAnalyticsService;


