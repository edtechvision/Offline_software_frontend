import { useQuery } from '@tanstack/react-query';
import { feeHistoryService } from '../services/apiService';

export const useFeeHistory = (params = {}) => {
  return useQuery({
    queryKey: ['feeHistory', params],
    queryFn: async () => {
      const result = await feeHistoryService.getAllPayments(params);
      return result;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
    retry: 1,
    retryDelay: 1000,
  });
};
