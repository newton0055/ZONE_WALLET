import { useQuery } from "@tanstack/react-query";
import { api } from "@/services/api";

export const useGetRecentTransactions = (walletId: string, limit = 5) => {
  return useQuery({
    queryKey: ["recent-transactions", walletId, limit],
    enabled: !!walletId,
    queryFn: async () => {
      const response = await api.get(`/wallet/${walletId}/transactions`);
      // If you want to limit, slice here:
      return response.data.slice(0, limit);
    },
  });
};
