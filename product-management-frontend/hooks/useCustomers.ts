import { useQuery } from "@tanstack/react-query";
import { customerService } from "../services/customerService";

export const useCustomers = (page: number = 1, limit: number = 100) => {
  return useQuery({
    queryKey: ["customers", page, limit],
    queryFn: () => customerService.getAll(page, limit),
  });
};
