import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { feeDiscountService } from '../services/apiService';

export const useFeeDiscounts = (params = {}) => {
  return useQuery({
    queryKey: ['feeDiscounts', params],
    queryFn: async () => {
      const result = await feeDiscountService.getDiscounts(params);
      return result;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
    retry: 1,
    retryDelay: 1000,
  });
};

export const useFeeDiscount = (id) => {
  return useQuery({
    queryKey: ['feeDiscount', id],
    queryFn: async () => {
      const result = await feeDiscountService.getDiscountById(id);
      return result;
    },
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    retry: 1,
    retryDelay: 1000,
  });
};

export const useCreateFeeDiscount = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (discountData) => {
      const result = await feeDiscountService.createDiscount(discountData);
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['feeDiscounts'] });
    },
  });
};

export const useUpdateFeeDiscount = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, discountData }) => {
      const result = await feeDiscountService.updateDiscount(id, discountData);
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['feeDiscounts'] });
    },
  });
};

export const useDeleteFeeDiscount = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (id) => {
      const result = await feeDiscountService.deleteDiscount(id);
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['feeDiscounts'] });
    },
  });
};
