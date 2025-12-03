import axios from "axios";
import type { Product } from "../../types/product";

const API_URL = "http://localhost:3000/products";

// Fetch products with optional pagination and search
export const fetchProducts = async (
  page: number = 1,
  limit: number = 9,
  search: string = ""
): Promise<{ data: Product[]; total: number }> => {
  const response = await axios.get(API_URL, {
    params: { page, limit, search },
  });
  return response.data;
};

export const createProduct = async (
  product: Omit<Product, "id" | "createdAt" | "updatedAt">
) => {
  const response = await axios.post(API_URL, product);
  return response.data;
};

export const updateProduct = async (id: string, product: Partial<Product>) => {
  const response = await axios.put(`${API_URL}/${id}`, product);
  return response.data;
};

export const deleteProduct = async (id: string) => {
  const response = await axios.delete(`${API_URL}/${id}`);
  return response.data;
};
