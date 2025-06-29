import { useQuery } from "@tanstack/react-query";
import { api } from "@/services/api";

export const useGetWallets = () => {
  return useQuery({
    queryKey: ["wallets"],
    queryFn: async () => {
      const response = await api.get("/wallet");
      return response.data;
    },
  });
};