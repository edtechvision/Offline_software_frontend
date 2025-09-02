import { useQuery } from '@tanstack/react-query';
import { pendingFeesService } from '../services/apiService';

export const usePendingFees = (params = {}) => {
  return useQuery({
    queryKey: ['pendingFees', params],
    queryFn: async () => {
      const result = await pendingFeesService.getPendingFees(params);
      return result;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
    retry: 1,
    retryDelay: 1000,
  });
};
