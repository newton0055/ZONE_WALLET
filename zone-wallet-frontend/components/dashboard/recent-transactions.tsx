import { useEffect, useState } from "react";
import { ArrowUpRight, ArrowDownLeft, CheckCircle, XCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { useGetWallets } from "@/hooks/use-get-wallet";
import { etherscanService } from "@/services/etherscan";
import { formatEther } from "ethers";

export default function RecentTransactions() {
  const { data: wallets = [], isLoading: walletsLoading, error: walletsError } = useGetWallets();
  const wallet = wallets.length > 0 ? wallets[0] : undefined;
  const [transactions, setTransactions] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!wallet?.publicAddress) {
      setIsLoading(false);
      return;
    }
    setIsLoading(true);
    setError(null);
    etherscanService
      .getTransactions(wallet.publicAddress)
      .then((data) => setTransactions(data.slice(0, 5)))
      .catch((err) => setError("Failed to fetch transactions"))
      .finally(() => setIsLoading(false));
  }, [wallet?.publicAddress]);

  const formatAddress = (address: string) => `${address.slice(0, 6)}...${address.slice(-4)}`;
  const formatDate = (timestamp: string) =>
    new Date(parseInt(timestamp) * 1000).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

  if (walletsLoading || isLoading) return <div>Loading...</div>;
  if (walletsError) return <div className="text-red-500">Failed to load wallets.</div>;
  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Recent Transactions</CardTitle>
        <CardDescription>Your latest Ethereum transactions</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {transactions.map((transaction: any) => (
            <div key={transaction.hash} className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex items-center space-x-4">
                <div
                  className={`p-2 rounded-full ${
                    transaction.from.toLowerCase() === wallet.publicAddress.toLowerCase()
                      ? "bg-red-100 text-red-600"
                      : "bg-green-100 text-green-600"
                  }`}
                >
                  {transaction.from.toLowerCase() === wallet.publicAddress.toLowerCase() ? (
                    <ArrowUpRight className="w-4 h-4" />
                  ) : (
                    <ArrowDownLeft className="w-4 h-4" />
                  )}
                </div>
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="font-medium capitalize">
                      {transaction.from.toLowerCase() === wallet.publicAddress.toLowerCase() ? "sent" : "received"}
                    </span>
                    <Badge variant={transaction.isError === "0" ? "default" : "destructive"}>
                      {transaction.isError === "0" ? (
                        <CheckCircle className="w-3 h-3 mr-1 text-green-600" />
                      ) : (
                        <XCircle className="w-3 h-3 mr-1 text-red-600" />
                      )}
                      <span className={transaction.isError === "0" ? "text-green-600" : "text-red-600"}>
                        {transaction.isError === "0" ? "Success" : "Failed"}
                      </span>
                    </Badge>
                  </div>
                  <div className="text-sm text-gray-500">
                    {transaction.from.toLowerCase() === wallet.publicAddress.toLowerCase() ? "To: " : "From: "}
                    <span className="font-mono">
                      {formatAddress(
                        transaction.from.toLowerCase() === wallet.publicAddress.toLowerCase()
                          ? transaction.to
                          : transaction.from
                      )}
                    </span>
                  </div>
                  <div className="text-xs text-gray-400">{formatDate(transaction.timeStamp)}</div>
                </div>
              </div>
              <div className="text-right">
                <div
                  className={`font-semibold ${
                    transaction.from.toLowerCase() === wallet.publicAddress.toLowerCase()
                      ? "text-red-600"
                      : "text-green-600"
                  }`}
                >
                  {transaction.from.toLowerCase() === wallet.publicAddress.toLowerCase() ? "-" : "+"}
                  {formatEther(transaction.value)} ETH
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}