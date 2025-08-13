import { useQuery } from '@tanstack/react-query';
import materialService from '../services/api/materialService';

interface TransportDetails {
  distance: number;
  method: string;
  description: string;
}

export const useTransportDetails = (country: string | null) => {
  return useQuery<TransportDetails>({
    queryKey: ['transportDetails', country],
    queryFn: async () => {
      if (!country) throw new Error('Country is required');
      const details = await materialService.getTransportDetails(country);
      return details;
    },
    enabled: !!country, // Only run query when country is provided
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
    retry: 2,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 10000),
  });
};
