import { useState, useEffect, useCallback, useMemo } from "react";
import type { Product, ProductFilter, ProductSort } from "../types/Product";

import {
  products as allProducts,
  filterProducts,
  searchProducts,
  sortProducts,
} from "../data/productsData";

export interface UseProductsOptions {
  initialFilter?: Partial<ProductFilter>;
  initialSort?: ProductSort;
  initialLimit?: number;
  enableAutoFilter?: boolean;
}

export interface UseProductsReturn {
  // Data
  products: Product[];
  allProducts: Product[];

  // State
  loading: boolean;
  error: string | null;

  // Filter & Search
  filter: Partial<ProductFilter>;
  searchQuery: string;
  sort: ProductSort;

  // Actions
  setFilter: (filter: Partial<ProductFilter>) => void;
  updateFilter: (partialFilter: Partial<ProductFilter>) => void;
  clearFilter: () => void;
  setSearchQuery: (query: string) => void;
  setSort: (sort: ProductSort) => void;

  // Utility
  totalCount: number;
  hasFilter: boolean;
  hasSearch: boolean;

  // Demo functions (simulation)
  refetch: () => Promise<void>;
  reset: () => void;
}

const DEFAULT_FILTER: Partial<ProductFilter> = {};
const DEFAULT_SORT: ProductSort = { field: "name", direction: "asc" };

export const useProducts = (
  options: UseProductsOptions = {}
): UseProductsReturn => {
  const {
    initialFilter = DEFAULT_FILTER,
    initialSort = DEFAULT_SORT,
    initialLimit,
    enableAutoFilter = true,
  } = options;

  // State
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<Partial<ProductFilter>>(initialFilter);
  const [searchQuery, setSearchQuery] = useState("");
  const [sort, setSort] = useState<ProductSort>(initialSort);

  // Computed products with filtering, searching, and sorting
  const products = useMemo(() => {
    let result = [...allProducts];

    // Apply search
    if (searchQuery.trim()) {
      result = searchProducts(result, searchQuery);
    }

    // Apply filters
    if (filter.category && filter.category.length > 0) {
      result = filterProducts.byCategory(result, filter.category);
    }

    if (filter.priceRange) {
      result = filterProducts.byPriceRange(
        result,
        filter.priceRange.min,
        filter.priceRange.max
      );
    }

    if (filter.availability && filter.availability.length > 0) {
      result = filterProducts.byAvailability(result, filter.availability);
    }

    if (filter.brands && filter.brands.length > 0) {
      result = filterProducts.byBrand(result, filter.brands);
    }

    if (filter.sustainability) {
      result = filterProducts.bySustainability(result, filter.sustainability);
    }

    if (filter.rating && filter.rating.min) {
      result = filterProducts.byRating(result, filter.rating.min);
    }

    // Apply sorting
    switch (sort.field) {
      case "name":
        result = sortProducts.byName(result, sort.direction);
        break;
      case "price":
        result = sortProducts.byPrice(result, sort.direction);
        break;
      case "rating":
        result = sortProducts.byRating(result, sort.direction);
        break;
      case "newest":
        result = sortProducts.byNewest(result);
        break;
      case "sustainability":
        result = sortProducts.bySustainability(result, sort.direction);
        break;
      default:
        break;
    }

    // Apply limit if specified
    if (initialLimit && initialLimit > 0) {
      result = result.slice(0, initialLimit);
    }

    return result;
  }, [filter, searchQuery, sort, initialLimit]);

  // Helper functions
  const hasFilter = useMemo(() => {
    return Object.keys(filter).some((key) => {
      const value = filter[key as keyof ProductFilter];
      if (Array.isArray(value)) {
        return value.length > 0;
      }
      return value !== undefined && value !== null;
    });
  }, [filter]);

  const hasSearch = useMemo(() => {
    return searchQuery.trim().length > 0;
  }, [searchQuery]);

  // Actions
  const updateFilter = useCallback((partialFilter: Partial<ProductFilter>) => {
    setFilter((prev) => ({ ...prev, ...partialFilter }));
  }, []);

  const clearFilter = useCallback(() => {
    setFilter(DEFAULT_FILTER);
    setSearchQuery("");
  }, []);

  const refetch = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 800));

      // In a real app, this would refetch from the API
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch products");
    } finally {
      setLoading(false);
    }
  }, []);

  const reset = useCallback(() => {
    setFilter(DEFAULT_FILTER);
    setSearchQuery("");
    setSort(DEFAULT_SORT);
    setError(null);
  }, []);

  // Auto-filter effect (if enabled)
  useEffect(() => {
    if (!enableAutoFilter) return;

    const timeoutId = setTimeout(() => {
      // This could trigger additional filtering logic
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [filter, searchQuery, sort, enableAutoFilter]);

  return {
    // Data
    products,
    allProducts,

    // State
    loading,
    error,

    // Filter & Search
    filter,
    searchQuery,
    sort,

    // Actions
    setFilter,
    updateFilter,
    clearFilter,
    setSearchQuery,
    setSort,

    // Utility
    totalCount: products.length,
    hasFilter,
    hasSearch,

    // Demo functions
    refetch,
    reset,
  };
};

export default useProducts;
