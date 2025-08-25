import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { centerService } from '../services/apiService';

export const useCenters = (params = {}) => {
  const queryClient = useQueryClient();

  // Get all centers
  const centersQuery = useQuery({
    queryKey: ['centers', params],
    queryFn: () => centerService.getCenters(params),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });

  // Create center mutation
  const createCenterMutation = useMutation({
    mutationFn: centerService.createCenter,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['centers'] });
    },
  });

  // Update center mutation
  const updateCenterMutation = useMutation({
    mutationFn: ({ id, data }) => centerService.updateCenter(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['centers'] });
    },
  });

  // Delete center mutation
  const deleteCenterMutation = useMutation({
    mutationFn: centerService.deleteCenter,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['centers'] });
    },
  });

  return {
    // Query data
    data: centersQuery.data?.data,
    centers: centersQuery.data?.data?.data || [],
    pagination: centersQuery.data?.data?.pagination,
    isLoading: centersQuery.isLoading,
    isError: centersQuery.isError,
    error: centersQuery.error,
    
    // Mutations
    createCenter: createCenterMutation.mutate,
    createCenterAsync: createCenterMutation.mutateAsync,
    isCreatingCenter: createCenterMutation.isPending,
    
    updateCenter: updateCenterMutation.mutate,
    updateCenterAsync: updateCenterMutation.mutateAsync,
    isUpdatingCenter: updateCenterMutation.isPending,
    
    deleteCenter: deleteCenterMutation.mutate,
    deleteCenterAsync: deleteCenterMutation.mutateAsync,
    isDeletingCenter: deleteCenterMutation.isPending,
  };
};

// Hook for getting a single center by ID
export const useCenter = (id) => {
  const queryClient = useQueryClient();

  const centerQuery = useQuery({
    queryKey: ['center', id],
    queryFn: () => centerService.getCenterById(id),
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });

  return {
    center: centerQuery.data?.data,
    isLoading: centerQuery.isLoading,
    isError: centerQuery.isError,
    error: centerQuery.error,
  };
};

// Export individual mutation hooks for direct use
export const useCreateCenter = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: centerService.createCenter,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['centers'] });
    },
  });
};

export const useUpdateCenter = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, data }) => centerService.updateCenter(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['centers'] });
    },
  });
};

export const useDeleteCenter = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: centerService.deleteCenter,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['centers'] });
    },
  });
};
