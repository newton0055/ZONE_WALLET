import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "next/navigation";

import { client } from "@/lib/hono";
import { convertAmountFromMiliunits } from "@/lib/utils";

export const useGetSummary = () => {
  const params = useSearchParams();
  const from = params.get("from") || "";
  const to = params.get("to") || "";
  const accountId = params.get("accountId") || "";

  const query = useQuery({
    queryKey: ["summary", { from, to, accountId }],
    queryFn: async () => {
      const response = await client.api.summary.$get({
        query: {
          from,
          to,
          accountId,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch summary");
      }

      const { data } = await response.json();
      return {
        ...data,
        creditAmount: convertAmountFromMiliunits(data.creditAmount),
        debitAmount: convertAmountFromMiliunits(data.debitAmount),
        remainingAmount: convertAmountFromMiliunits(data.remainingAmount),
        days: data.days.map((day) => ({
          ...day,
          credit: convertAmountFromMiliunits(day.credit),
          debit: convertAmountFromMiliunits(day.debit),
        })),
      };
    },
  });
  return query;
};
