"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Copy, Check } from "lucide-react";
import { toast } from "react-hot-toast";

interface ReceiveModalProps {
  isOpen: boolean;
  onClose: () => void;
  walletAddress?: string;
}

export default function ReceiveModal({
  isOpen,
  onClose,
  walletAddress = "0x742d35Cc6634C0532925a3b8D4C0532925a3b8D4",
}: ReceiveModalProps) {
  const [qrCodeUrl, setQrCodeUrl] = useState("");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (isOpen && walletAddress) {
      // Generate QR code URL using a QR code service
      const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(
        walletAddress
      )}`;
      setQrCodeUrl(qrUrl);
    }
  }, [isOpen, walletAddress]);

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(walletAddress);
      setCopied(true);
      toast.success("Address copied to clipboard!");

      setTimeout(() => {
        setCopied(false);
      }, 2000);
    } catch (error) {
      toast.error("Failed to copy address");
      console.error("Copy failed:", error);
    }
  };

  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Receive Ethereum</DialogTitle>
        </DialogHeader>

        <div className="flex flex-col items-center space-y-6">
          <div className="text-center">
            <p className="text-sm text-gray-600 mb-4">
              Share this QR code or address to receive ETH
            </p>

            {qrCodeUrl && (
              <div className="bg-white p-4 rounded-lg border-2 border-gray-200 inline-block">
                <img
                  src={qrCodeUrl || "/placeholder.svg"}
                  alt="Wallet QR Code"
                  width={192}
                  height={192}
                  className="w-48 h-48"
                />
              </div>
            )}
          </div>

          <div className="w-full space-y-2">
            <div className="text-center">
              <p className="text-xs text-gray-500 mb-2">Your Wallet Address</p>
              <div className="bg-gray-50 p-3 rounded-lg border">
                <p className="font-mono text-sm break-all">{walletAddress}</p>
              </div>
            </div>

            <Button
              onClick={copyToClipboard}
              variant="outline"
              className="w-full bg-transparent"
              disabled={copied}
            >
              {copied ? (
                <>
                  <Check className="h-4 w-4 mr-2 text-green-600" />
                  Copied!
                </>
              ) : (
                <>
                  <Copy className="h-4 w-4 mr-2" />
                  Copy Address
                </>
              )}
            </Button>
          </div>

          <Button onClick={onClose} className="w-full">
            Done
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
