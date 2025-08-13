import { useMutation, useQueryClient } from '@tanstack/react-query';
import materialService from '../services/api/materialService';
import type { MaterialCreationFormRequest, MaterialCreationResponse } from '../schemas/materialSchema';

export const useCreateMaterial = () => {
  const queryClient = useQueryClient();

  return useMutation<MaterialCreationResponse, Error, MaterialCreationFormRequest>({
    mutationFn: async (data: MaterialCreationFormRequest) => {
      const result = await materialService.createMaterialWithSustainability(data);
      return result;
    },
    onSuccess: (data) => {
      // Invalidate and refetch materials list
      queryClient.invalidateQueries({ queryKey: ['materials'] });
      
      // Show success message (you can replace this with your preferred notification system)
      console.log('Material created successfully:', data);
    },
    onError: (error) => {
      // Show error message (you can replace this with your preferred notification system)
      console.error('Failed to create material:', error);
    },
  });
};
