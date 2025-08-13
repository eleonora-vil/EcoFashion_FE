import { useState, useEffect, useCallback, useMemo } from 'react';
import { materialService } from '../services/api/materialService';
import { MaterialDetailDto } from '../schemas/materialSchema';

interface UseMaterialState {
  materials: MaterialDetailDto[];
  loading: boolean;
  error: string | null;
}

interface UseMaterialFilters {
  type?: string;
  availability?: 'in-stock' | 'limited' | 'out-of-stock';
  sustainableOnly?: boolean;
  minRecycledPercentage?: number;
}

export const useMaterial = (initialFilters: UseMaterialFilters = {}) => {
  console.log('useMaterial hook initialized');
  
  const [state, setState] = useState<UseMaterialState>({
    materials: [],
    loading: false,
    error: null,
  });

  const [filters, setFilters] = useState<UseMaterialFilters>(initialFilters);

  // Apply filters to materials
  const filteredMaterials = useMemo(() => {
    let result = state.materials;

    // Filter by material type
    if (filters.type) {
      result = result.filter((material) => 
        material.materialTypeName?.toLowerCase().includes(filters.type!.toLowerCase())
      );
    }

    // Filter by availability
    if (filters.availability) {
      switch (filters.availability) {
        case 'in-stock':
          result = result.filter((material) => material.quantityAvailable > 0);
          break;
        case 'limited':
          result = result.filter((material) => material.quantityAvailable > 0 && material.quantityAvailable <= 10);
          break;
        case 'out-of-stock':
          result = result.filter((material) => material.quantityAvailable === 0);
          break;
      }
    }

    // Filter by minimum recycled percentage
    if (filters.minRecycledPercentage) {
      result = result.filter((material) => material.recycledPercentage >= filters.minRecycledPercentage!);
    }

    // Filter sustainable materials only
    if (filters.sustainableOnly) {
      result = result.filter((material) => material.recycledPercentage > 0);
    }

    return result;
  }, [state.materials, filters]);

  // Load materials from API
  const loadMaterials = useCallback(async () => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    try {
      // Sử dụng API để lấy materials với sustainability scores
      const materials = await materialService.getAllMaterialsWithSustainability();
      setState(prev => ({ 
        ...prev, 
        materials, 
        loading: false 
      }));
    } catch (error: any) {
      const errorMessage = error.message || 'Unknown error occurred';
      const statusCode = error.response?.status || 'Unknown';
      
      setState(prev => ({ 
        ...prev, 
        error: `Failed to load materials: ${statusCode} - ${errorMessage}`,
        loading: false 
      }));
    }
  }, []);

  // Load materials on mount with delay
  useEffect(() => {
    // Add small delay to ensure API is ready
    const timer = setTimeout(() => {
      loadMaterials();
    }, 1000);
    
    return () => clearTimeout(timer);
  }, [loadMaterials]);

  // Update filters
  const updateFilters = useCallback((newFilters: Partial<UseMaterialFilters>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  }, []);

  // Reset filters
  const resetFilters = useCallback(() => {
    setFilters(initialFilters);
  }, [initialFilters]);

  // Get material detail by ID
  const getMaterialDetail = useCallback(async (id: number) => {
    try {
      return await materialService.getMaterialDetail(id);
    } catch (error) {
      throw new Error(error instanceof Error ? error.message : 'Failed to get material detail');
    }
  }, []);

  // Helper methods for filtering
  const getOrganicMaterials = useCallback(() => {
    return filteredMaterials.filter((material) => 
      material.materialTypeName?.toLowerCase().includes('organic')
    );
  }, [filteredMaterials]);

  const getRecycledMaterials = useCallback(() => {
    return filteredMaterials.filter((material) => 
      material.materialTypeName?.toLowerCase().includes('recycled') ||
      material.recycledPercentage > 0
    );
  }, [filteredMaterials]);

  const getSustainableMaterials = useCallback(() => {
    return filteredMaterials.filter((material) => material.recycledPercentage > 0);
  }, [filteredMaterials]);

  const getAvailableMaterials = useCallback(() => {
    return filteredMaterials.filter((material) => material.quantityAvailable > 0);
  }, [filteredMaterials]);

  return {
    // State
    materials: state.materials,
    filteredMaterials,
    loading: state.loading,
    error: state.error,
    filters,

    // Actions
    loadMaterials,
    updateFilters,
    resetFilters,
    getMaterialDetail,

    // Helper methods
    getOrganicMaterials,
    getRecycledMaterials,
    getSustainableMaterials,
    getAvailableMaterials,

    // Stats
    totalCount: state.materials.length,
    filteredCount: filteredMaterials.length,
  };
};

export default useMaterial; 