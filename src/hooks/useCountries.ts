import { useQuery } from '@tanstack/react-query';
import materialService from '../services/api/materialService';

export const useCountries = () => {
  return useQuery<string[]>({
    queryKey: ['countries'],
    queryFn: async () => {
      const countries = await materialService.getProductionCountries();
      return countries;
    },
    staleTime: 10 * 60 * 1000, // 10 minutes (countries don't change often)
    gcTime: 30 * 60 * 1000, // 30 minutes
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });
};
