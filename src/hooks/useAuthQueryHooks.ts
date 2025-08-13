import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { SupplierService, DesignerService } from '../services/api/index';
import type { SupplierModel, UpdateSupplierRequest } from '../services/api/supplierService';
import type { DesignerProfile, UpdateDesignerRequest, FollowedSupplierResponse } from '../services/api/designerService';

// Supplier Profile Hooks
export const useSupplierProfile = (userId: number | null) => {
  return useQuery({
    queryKey: ['supplier', 'profile', userId],
    queryFn: () => SupplierService.getSupplierByUserId(userId!),
    enabled: !!userId,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes (cacheTime renamed to gcTime in v5)
  });
};

export const useUpdateSupplierProfile = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data: UpdateSupplierRequest) => SupplierService.updateSupplierProfile(data),
    onSuccess: (_, variables) => {
      // Invalidate and refetch supplier profile
      queryClient.invalidateQueries({ queryKey: ['supplier', 'profile'] });
    },
  });
};

// Designer Profile Hooks
export const useDesignerProfile = (userId: number | null) => {
  return useQuery({
    queryKey: ['designer', 'profile', userId],
    queryFn: () => DesignerService.getDesignerByUserId(userId!),
    enabled: !!userId,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes (cacheTime renamed to gcTime in v5)
  });
};

export const useUpdateDesignerProfile = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data: UpdateDesignerRequest) => DesignerService.updateDesignerProfile(data),
    onSuccess: (_, variables) => {
      // Invalidate and refetch designer profile
      queryClient.invalidateQueries({ queryKey: ['designer', 'profile'] });
    },
  });
};

// Designer-Supplier Connection Hooks
export const useFollowSupplier = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (supplierId: string) => DesignerService.followSupplier(supplierId),
    onSuccess: () => {
      // Invalidate followed suppliers list
      queryClient.invalidateQueries({ queryKey: ['designer', 'followed-suppliers'] });
    },
  });
};

export const useUnfollowSupplier = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (supplierId: string) => DesignerService.unfollowSupplier(supplierId),
    onSuccess: () => {
      // Invalidate followed suppliers list
      queryClient.invalidateQueries({ queryKey: ['designer', 'followed-suppliers'] });
    },
  });
};

export const useFollowedSuppliers = (userId: number | null) => {
  return useQuery({
    queryKey: ['designer', 'followed-suppliers', userId],
    queryFn: () => DesignerService.getFollowedSuppliers(),
    enabled: !!userId,
    staleTime: 2 * 60 * 1000, // 2 minutes
    gcTime: 5 * 60 * 1000, // 5 minutes (cacheTime renamed to gcTime in v5)
  });
};

// Public Profile Hooks (for landing pages)
export const useSupplierPublicProfile = (supplierId: string | null) => {
  return useQuery({
    queryKey: ['supplier', 'public', supplierId],
    queryFn: () => SupplierService.getSupplierPublicProfile(supplierId!),
    enabled: !!supplierId,
    staleTime: 10 * 60 * 1000, // 10 minutes
    gcTime: 30 * 60 * 1000, // 30 minutes (cacheTime renamed to gcTime in v5)
  });
};

export const useDesignerPublicProfile = (designerId: string | null) => {
  return useQuery({
    queryKey: ['designer', 'public', designerId],
    queryFn: () => DesignerService.getDesignerPublicProfile(designerId!),
    enabled: !!designerId,
    staleTime: 10 * 60 * 1000, // 10 minutes
    gcTime: 30 * 60 * 1000, // 30 minutes (cacheTime renamed to gcTime in v5)
  });
};

// Public Listing Hooks
export const usePublicSuppliers = (page: number = 1, pageSize: number = 12) => {
  return useQuery({
    queryKey: ['suppliers', 'public', page, pageSize],
    queryFn: () => SupplierService.getPublicSuppliers(page, pageSize),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 15 * 60 * 1000, // 15 minutes (cacheTime renamed to gcTime in v5)
  });
};

export const usePublicDesigners = (page: number = 1, pageSize: number = 12) => {
  return useQuery({
    queryKey: ['designers', 'public', page, pageSize],
    queryFn: () => DesignerService.getPublicDesigners(page, pageSize),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 15 * 60 * 1000, // 15 minutes (cacheTime renamed to gcTime in v5)
  });
};

export const useFeaturedSuppliers = (count: number = 6) => {
  return useQuery({
    queryKey: ['suppliers', 'featured', count],
    queryFn: () => SupplierService.getFeaturedSuppliers(count),
    staleTime: 10 * 60 * 1000, // 10 minutes
    gcTime: 30 * 60 * 1000, // 30 minutes (cacheTime renamed to gcTime in v5)
  });
};

export const useFeaturedDesigners = (count: number = 6) => {
  return useQuery({
    queryKey: ['designers', 'featured', count],
    queryFn: () => DesignerService.getFeaturedDesigners(count),
    staleTime: 10 * 60 * 1000, // 10 minutes
    gcTime: 30 * 60 * 1000, // 30 minutes (cacheTime renamed to gcTime in v5)
  });
}; 