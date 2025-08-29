import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { inchargeService } from '../services/apiService';

export const useIncharges = (params = {}) => {
  return useQuery({
    queryKey: ['incharges', params],
    queryFn: () => inchargeService.getIncharges(params),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
};

export const useIncharge = (id) => {
  return useQuery({
    queryKey: ['incharge', id],
    queryFn: () => inchargeService.getInchargeById(id),
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
};

export const useCreateIncharge = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: inchargeService.createIncharge,
    onSuccess: () => {
      // Invalidate and refetch incharges
      queryClient.invalidateQueries({ queryKey: ['incharges'] });
    },
  });
};

export const useUpdateIncharge = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, data }) => inchargeService.updateIncharge(id, data),
    onSuccess: (_, { id }) => {
      // Invalidate and refetch specific incharge and incharges list
      queryClient.invalidateQueries({ queryKey: ['incharge', id] });
      queryClient.invalidateQueries({ queryKey: ['incharges'] });
    },
  });
};

export const useDeleteIncharge = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: inchargeService.deleteIncharge,
    onSuccess: () => {
      // Invalidate and refetch incharges
      queryClient.invalidateQueries({ queryKey: ['incharges'] });
    },
  });
};

// Hook for checking incharge by code
export const useCheckInchargeByCode = (inchargeCode, enabled = false) => {
  return useQuery({
    queryKey: ['checkIncharge', inchargeCode],
    queryFn: () => inchargeService.checkInchargeByCode(inchargeCode),
    enabled: enabled && !!inchargeCode,
    staleTime: 1 * 60 * 1000, // 1 minute for quick checks
    gcTime: 5 * 60 * 1000, // 5 minutes
  });
};

// Hook for blocking/unblocking admission incharge
export const useBlockIncharge = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, block }) => inchargeService.blockIncharge(id, block),
    onSuccess: () => {
      // Invalidate and refetch incharges
      queryClient.invalidateQueries({ queryKey: ['incharges'] });
    },
  });
};
