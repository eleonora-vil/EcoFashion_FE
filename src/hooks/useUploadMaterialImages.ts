import { useMutation, useQueryClient } from '@tanstack/react-query';
import materialService from '../services/api/materialService';

interface UploadImagesParams {
  materialId: number;
  files: File[];
}

export const useUploadMaterialImages = () => {
  const queryClient = useQueryClient();

  return useMutation<any, Error, UploadImagesParams>({
    mutationFn: async ({ materialId, files }: UploadImagesParams) => {
      const result = await materialService.uploadMaterialImages(materialId, files);
      return result;
    },
    onSuccess: (data, variables) => {
      // Invalidate material detail and images
      queryClient.invalidateQueries({ queryKey: ['material', variables.materialId] });
      queryClient.invalidateQueries({ queryKey: ['materials'] });
      
      console.log('Images uploaded successfully:', data);
    },
    onError: (error) => {
      console.error('Failed to upload images:', error);
    },
  });
};
