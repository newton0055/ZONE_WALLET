"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowUpRight, ArrowDownLeft } from "lucide-react";
import { useState } from "react";
import SendModal from "./send-modal";
import ReceiveModal from "./receive-modal";
import { useWallet } from "@/contexts/WalletContext";

export default function BalanceCard() {
  const { selectedWallet, balance } = useWallet();
  const [showSendModal, setShowSendModal] = useState(false);
  const [showReceiveModal, setShowReceiveModal] = useState(false);

  const handleSend = () => setShowSendModal(true);
  const handleReceive = () => setShowReceiveModal(true);

  // Fallbacks for demo if wallet not loaded
  const walletAddress = selectedWallet?.publicAddress || "0x742d35Cc6634C0532925a3b8D4C0532925a3b8D4";
  const ethBalance = balance ?? "0.00";

  return (
    <Card className="w-full">
      <CardHeader className="text-center">
        <CardTitle className="text-lg font-medium text-indigo-600">Current Balance</CardTitle>
        <div className="text-4xl font-bold text-indigo-900 mt-2">
          {ethBalance} <span className="text-2xl text-indigo-500">ETH</span>
        </div>
      </CardHeader>
      <CardContent className="flex gap-4 justify-center">
        <Button className="flex-1 max-w-32" variant="default" onClick={handleSend}>
          <ArrowUpRight className="w-4 h-4 mr-2" />
          Send
        </Button>
        <Button className="flex-1 max-w-32 bg-transparent" variant="outline" onClick={handleReceive}>
          <ArrowDownLeft className="w-4 h-4 mr-2" />
          Receive
        </Button>
      </CardContent>
      <SendModal
        isOpen={showSendModal}
        onClose={() => setShowSendModal(false)}
        fromAddress={walletAddress}
        walletId={selectedWallet?.id}
      />
      <ReceiveModal
        isOpen={showReceiveModal}
        onClose={() => setShowReceiveModal(false)}
        walletAddress={walletAddress}
      />
    </Card>
  );
}