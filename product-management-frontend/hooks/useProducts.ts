import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchProducts, createProduct, updateProduct, deleteProduct } from '../src/api/product';
import type { Product } from '../components/product';

// Query key factory
export const productKeys = {
  all: ['products'] as const,
  lists: () => [...productKeys.all, 'list'] as const,
  list: (page: number, limit: number, search: string) => 
    [...productKeys.lists(), { page, limit, search }] as const,
};

// Fetch products with pagination and search
export const useProducts = (page: number, limit: number, search: string) => {
  return useQuery({
    queryKey: productKeys.list(page, limit, search),
    queryFn: () => fetchProducts(page, limit, search),
  });
};

// Create product mutation
export const useCreateProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (product: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>) => 
      createProduct(product),
    onSuccess: () => {
      // Invalidate and refetch all product queries
      queryClient.invalidateQueries({ queryKey: productKeys.lists() });
    },
  });
};

// Update product mutation
export const useUpdateProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Product> }) => 
      updateProduct(id, data),
    onSuccess: () => {
      // Invalidate and refetch all product queries
      queryClient.invalidateQueries({ queryKey: productKeys.lists() });
    },
  });
};

// Delete product mutation
export const useDeleteProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteProduct(id),
    onSuccess: () => {
      // Invalidate and refetch all product queries
      queryClient.invalidateQueries({ queryKey: productKeys.lists() });
    },
  });
};
