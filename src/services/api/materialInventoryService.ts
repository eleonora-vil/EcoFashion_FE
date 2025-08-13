import apiClient, { handleApiResponse } from './baseApi';
import {
  materialStockDtoSchema,
  materialStockTransactionDtoSchema,
  receiveMaterialRequestSchema,
  type MaterialStockDto,
  type MaterialStockTransactionDto,
  type ReceiveMaterialRequest,
} from '../../schemas/inventorySchema';

class MaterialInventoryService {
  private readonly BASE = '/Inventory/materials';

  async getStocks(params?: { materialId?: number; warehouseId?: number }): Promise<MaterialStockDto[]> {
    const qs = new URLSearchParams();
    if (params?.materialId) qs.append('materialId', String(params.materialId));
    if (params?.warehouseId) qs.append('warehouseId', String(params.warehouseId));
    const response = await apiClient.get<any>(`${this.BASE}/stocks${qs.toString() ? `?${qs}` : ''}`);
    const data = handleApiResponse<any>(response);
    const arr: MaterialStockDto[] = (Array.isArray(data) ? data : data.result || data.data || [])
      .map((x: any) => materialStockDtoSchema.parse(x));
    return arr;
  }

  async getTransactions(params?: { materialId?: number; warehouseId?: number; type?: string; from?: string; to?: string }): Promise<MaterialStockTransactionDto[]> {
    const qs = new URLSearchParams();
    if (params?.materialId) qs.append('materialId', String(params.materialId));
    if (params?.warehouseId) qs.append('warehouseId', String(params.warehouseId));
    if (params?.type) qs.append('type', params.type);
    if (params?.from) qs.append('from', params.from);
    if (params?.to) qs.append('to', params.to);
    const response = await apiClient.get<any>(`${this.BASE}/transactions${qs.toString() ? `?${qs}` : ''}`);
    const data = handleApiResponse<any>(response);
    const arr: MaterialStockTransactionDto[] = (Array.isArray(data) ? data : data.result || data.data || [])
      .map((x: any) => materialStockTransactionDtoSchema.parse(x));
    return arr;
  }

  async receive(body: ReceiveMaterialRequest): Promise<boolean> {
    const validated = receiveMaterialRequestSchema.parse(body);
    const response = await apiClient.post<any>(`${this.BASE}/receive`, validated);
    // Backend returns a primitive boolean (Ok(true))
    // Fallback to direct data if handleApiResponse cannot parse
    try {
      const data = handleApiResponse<boolean>(response);
      return !!data;
    } catch {
      return response.data === true || response.data?.success === true;
    }
  }
}

export const materialInventoryService = new MaterialInventoryService();
export default materialInventoryService;


