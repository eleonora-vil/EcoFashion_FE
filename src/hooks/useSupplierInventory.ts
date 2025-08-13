import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import materialInventoryService from '../services/api/materialInventoryService';
import type { ReceiveMaterialRequest, MaterialStockDto, MaterialStockTransactionDto } from '../schemas/inventorySchema';

export const useSupplierStocks = (params?: { materialId?: number; warehouseId?: number }) => {
  return useQuery<MaterialStockDto[]>({
    queryKey: ['supplierStocks', params?.materialId ?? 'all', params?.warehouseId ?? 'all'],
    queryFn: () => materialInventoryService.getStocks(params),
  });
};

export const useMaterialTransactions = (params?: { materialId?: number; warehouseId?: number; type?: string; from?: string; to?: string }) => {
  return useQuery<MaterialStockTransactionDto[]>({
    queryKey: ['materialTransactions', params?.materialId ?? 'all', params?.warehouseId ?? 'all', params?.type ?? 'all', params?.from ?? 'none', params?.to ?? 'none'],
    queryFn: () => materialInventoryService.getTransactions(params),
  });
};

export const useReceiveMaterial = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (body: ReceiveMaterialRequest) => materialInventoryService.receive(body),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['supplierStocks'] });
      qc.invalidateQueries({ queryKey: ['materialTransactions'] });
    },
  });
};


