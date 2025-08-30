import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { batchService } from '../services/apiService';

export const useBatches = (params = {}) => {
  return useQuery({
    queryKey: ['batches', params],
    queryFn: async () => {
      try {
        const result = await batchService.getBatches(params);
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

export const useBatch = (id) => {
  return useQuery({
    queryKey: ['batch', id],
    queryFn: () => batchService.getBatchById(id),
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
};

export const useCreateBatch = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: batchService.createBatch,
    onSuccess: () => {
      // Invalidate and refetch batches
      queryClient.invalidateQueries({ queryKey: ['batches'] });
    },
  });
};

export const useUpdateBatch = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, data }) => batchService.updateBatch(id, data),
    onSuccess: (_, { id }) => {
      // Invalidate and refetch specific batch and batches list
      queryClient.invalidateQueries({ queryKey: ['batch', id] });
      queryClient.invalidateQueries({ queryKey: ['batches'] });
    },
  });
};

export const useDeleteBatch = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: batchService.deleteBatch,
    onSuccess: () => {
      // Invalidate and refetch batches
      queryClient.invalidateQueries({ queryKey: ['batches'] });
    },
  });
};

export const useToggleBatchStatus = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, isActive }) => batchService.toggleStatus(id, isActive),
    onSuccess: () => {
      // Invalidate and refetch batches
      queryClient.invalidateQueries({ queryKey: ['batches'] });
    },
  });
};
