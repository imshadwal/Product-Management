import axios from "axios";
import type { Customer } from "../types/customer";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:3000";

export const customerService = {
  getAll: async (page: number = 1, limit: number = 100): Promise<{ data: Customer[]; total: number }> => {
    const response = await axios.get(`${API_BASE_URL}/customers?page=${page}&limit=${limit}`);
    return response.data;
  },
};
