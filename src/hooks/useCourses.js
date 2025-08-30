import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { courseService } from '../services/apiService';

export const useCourses = (params = {}) => {
  return useQuery({
    queryKey: ['courses', params],
    queryFn: async () => {
      try {
        const result = await courseService.getCourses(params);
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

export const useCourse = (id) => {
  return useQuery({
    queryKey: ['course', id],
    queryFn: () => courseService.getCourseById(id),
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
};

export const useCreateCourse = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: courseService.createCourse,
    onSuccess: (data) => {
      // Invalidate and refetch courses
      queryClient.invalidateQueries({ queryKey: ['courses'] });
    },
    onError: (error) => {
      // Handle error silently
    },
  });
};

export const useUpdateCourse = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, data }) => courseService.updateCourse(id, data),
    onSuccess: (_, { id }) => {
      // Invalidate and refetch specific course and courses list
      queryClient.invalidateQueries({ queryKey: ['course', id] });
      queryClient.invalidateQueries({ queryKey: ['courses'] });
    },
  });
};

export const useDeleteCourse = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: courseService.deleteCourse,
    onSuccess: () => {
      // Invalidate and refetch courses
      queryClient.invalidateQueries({ queryKey: ['courses'] });
    },
  });
};

export const useToggleCourseActive = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, active }) => courseService.toggleActive(id, active),
    onSuccess: () => {
      // Invalidate and refetch courses
      queryClient.invalidateQueries({ queryKey: ['courses'] });
    },
  });
};
