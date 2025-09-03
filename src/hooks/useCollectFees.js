import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { collectFeesService } from '../services/apiService';

export const useCollectFeeStudents = (params = {}) => {
  return useQuery({
    queryKey: ['collectFeeStudents', params],
    queryFn: async () => {
      const result = await collectFeesService.getStudentsForFeeCollection(params);
      return result;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
    retry: 1,
    retryDelay: 1000,
  });
};

export const useCollectPayment = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (paymentData) => {
      const result = await collectFeesService.collectPayment(paymentData);
      return result;
    },
    onSuccess: (data, variables) => {
      // Invalidate and refetch all fee-related data
      queryClient.invalidateQueries({ queryKey: ['studentFees'] });
      queryClient.invalidateQueries({ queryKey: ['feeHistory'] });
      queryClient.invalidateQueries({ queryKey: ['pendingFees'] });
      queryClient.invalidateQueries({ queryKey: ['collectFeeStudents'] });
    },
  });
};

export const useRevertPayment = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (revertData) => {
      const result = await collectFeesService.revertPayment(revertData);
      return result;
    },
    onSuccess: (data, variables) => {
      // Invalidate and refetch all fee-related data
      queryClient.invalidateQueries({ queryKey: ['studentFees'] });
      queryClient.invalidateQueries({ queryKey: ['feeHistory'] });
      queryClient.invalidateQueries({ queryKey: ['pendingFees'] });
      queryClient.invalidateQueries({ queryKey: ['collectFeeStudents'] });
    },
  });
};