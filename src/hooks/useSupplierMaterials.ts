import { useQuery } from '@tanstack/react-query';
import { materialService } from '../services/api/materialService';
import { useAuthStore } from '../store/authStore';

export const useSupplierMaterials = (approvalStatus?: string) => {
  const supplierId = useAuthStore((s) => s.supplierProfile?.supplierId);

  return useQuery({
    queryKey: ['supplierMaterials', supplierId, approvalStatus],
    queryFn: async () => {
      const result = await materialService.getSupplierMaterials(supplierId!, approvalStatus);
      return result;
    },
    enabled: !!supplierId,
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 3,
  });
};
