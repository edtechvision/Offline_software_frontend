import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { additionalCourseService } from '../services/apiService';

export const useAdditionalCourses = (params = {}) => {
  return useQuery({
    queryKey: ['additionalCourses', params],
    queryFn: async () => {
      try {
        const result = await additionalCourseService.getAdditionalCourses(params);
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

export const useAdditionalCourse = (id) => {
  return useQuery({
    queryKey: ['additionalCourse', id],
    queryFn: () => additionalCourseService.getAdditionalCourseById(id),
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
};

export const useCreateAdditionalCourse = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: additionalCourseService.createAdditionalCourse,
    onSuccess: () => {
      // Invalidate and refetch additional courses
      queryClient.invalidateQueries({ queryKey: ['additionalCourses'] });
    },
    onError: (error) => {
      // Handle error silently
    },
  });
};

export const useUpdateAdditionalCourse = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, data }) => additionalCourseService.updateAdditionalCourse(id, data),
    onSuccess: (_, { id }) => {
      // Invalidate and refetch specific additional course and additional courses list
      queryClient.invalidateQueries({ queryKey: ['additionalCourse', id] });
      queryClient.invalidateQueries({ queryKey: ['additionalCourses'] });
    },
  });
};

export const useDeleteAdditionalCourse = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: additionalCourseService.deleteAdditionalCourse,
    onSuccess: () => {
      // Invalidate and refetch additional courses
      queryClient.invalidateQueries({ queryKey: ['additionalCourses'] });
    },
  });
};

export const useToggleAdditionalCourseActive = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, active }) => additionalCourseService.toggleActive(id, active),
    onSuccess: () => {
      // Invalidate and refetch additional courses
      queryClient.invalidateQueries({ queryKey: ['additionalCourses'] });
    },
  });
};

export const useAdditionalCoursesByIncharge = (inchargeId, params = {}) => {
  return useQuery({
    queryKey: ['additionalCoursesByIncharge', inchargeId, params],
    queryFn: async () => {
      try {
        const result = await additionalCourseService.getAdditionalCoursesByIncharge(inchargeId, params);
        return result;
      } catch (error) {
        throw error;
      }
    },
    enabled: !!inchargeId,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    retry: 1,
    retryDelay: 1000,
  });
};
