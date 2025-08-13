import { useQuery } from '@tanstack/react-query';
import materialService from '../services/api/materialService';
import type { MaterialTypeModel } from '../schemas/materialSchema';

export const useMaterialTypes = () => {
  return useQuery<MaterialTypeModel[]>({
    queryKey: ['materialTypes'],
    queryFn: async () => {
      const types = await materialService.getAllMaterialTypes();
      return types;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes (formerly cacheTime)
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });
};
