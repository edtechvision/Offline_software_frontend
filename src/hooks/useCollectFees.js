import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { collectFeesService } from '../services/apiService';

export const useCollectFeeStudents = (params = {}) => {
  return useQuery({
    queryKey: ['collectFeeStudents', params],
    queryFn: async () => {
      try {
        const result = await collectFeesService.getStudentsForFeeCollection(params);
        return result;
      } catch (error) {
        throw error;
      }
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
    retry: 1, // Only retry once
    retryDelay: 1000, // Wait 1 second before retry
  });
};
