import { useQuery } from '@tanstack/react-query';
import { studentFeesService } from '../services/apiService';

export const useStudentFees = (studentId) => {
  return useQuery({
    queryKey: ['studentFees', studentId],
    queryFn: async () => {
      if (!studentId) {
        throw new Error('Student ID is required');
      }
      const result = await studentFeesService.getFeesByStudent(studentId);
      return result;
    },
    enabled: !!studentId,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    retry: 1,
    retryDelay: 1000,
  });
};
