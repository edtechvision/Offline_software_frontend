import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { studentService } from '../services/apiService';

export const useStudents = (params = {}) => {
  return useQuery({
    queryKey: ['students', params],
    queryFn: () => studentService.getStudents(params),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
};

export const useStudent = (id) => {
  return useQuery({
    queryKey: ['student', id],
    queryFn: () => studentService.getStudentById(id),
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
};

export const useCreateStudent = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: studentService.createStudent,
    onSuccess: (data) => {
      // Invalidate and refetch students
      queryClient.invalidateQueries({ queryKey: ['students'] });
    },
    onError: (error) => {
      // Handle error silently
    },
  });
};

export const useUpdateStudent = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, data }) => studentService.updateStudent(id, data),
    onSuccess: (_, { id }) => {
      // Invalidate and refetch specific student and students list
      queryClient.invalidateQueries({ queryKey: ['student', id] });
      queryClient.invalidateQueries({ queryKey: ['students'] });
    },
  });
};

export const useDeleteStudent = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: studentService.deleteStudent,
    onSuccess: () => {
      // Invalidate and refetch students
      queryClient.invalidateQueries({ queryKey: ['students'] });
    },
  });
};

export const useActivateStudent = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (studentId) => 
      studentService.activateStudent(studentId),
    onSuccess: () => {
      queryClient.invalidateQueries(['students']);
    },
  });
};

export const useDeactivateStudent = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (studentId) => 
      studentService.deactivateStudent(studentId),
    onSuccess: () => {
      queryClient.invalidateQueries(['students']);
    },
  });
};
