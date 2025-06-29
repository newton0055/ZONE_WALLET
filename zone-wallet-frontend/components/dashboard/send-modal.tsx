"use client"

import { useState, useRef, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { QrCode, X, Camera } from "lucide-react"
import { toast } from "react-hot-toast"
import TransactionSummaryModal from "@/components/dashboard/transaction-summary-modal"
import { api } from "@/services/api"
import { etherscanService } from "@/services/etherscan"

interface TransactionData {
  from: string
  to: string
  amount: string
  status: "pending" | "success" | "failed"
  transactionHash?: string
}

interface SendModalProps {
  isOpen: boolean
  onClose: () => void
  fromAddress?: string
  walletId?: string
}

export default function SendModal({
  isOpen,
  onClose,
  fromAddress = "0x742d35Cc6634C0532925a3b8D4C0532925a3b8D4",
  walletId,
}: SendModalProps) {
  const [toAddress, setToAddress] = useState("")
  const [amount, setAmount] = useState("")
  const [isScanning, setIsScanning] = useState(false)
  const [showSummary, setShowSummary] = useState(false)
  const [transactionData, setTransactionData] = useState<TransactionData | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [password, setPassword] = useState("")
  const [refreshing, setRefreshing] = useState(false)

  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const streamRef = useRef<MediaStream | null>(null)

  const startQRScanner = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment" },
      })
      streamRef.current = stream

      if (videoRef.current) {
        videoRef.current.srcObject = stream
        videoRef.current.play()
        setIsScanning(true)
      }
    } catch (error) {
      toast.error("Camera access denied or not available")
      console.error("Error accessing camera:", error)
    }
  }

  const stopQRScanner = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop())
      streamRef.current = null
    }
    setIsScanning(false)
  }

  const captureQRCode = () => {
    if (videoRef.current && canvasRef.current) {
      const canvas = canvasRef.current
      const video = videoRef.current
      const context = canvas.getContext("2d")

      if (context) {
        canvas.width = video.videoWidth
        canvas.height = video.videoHeight
        context.drawImage(video, 0, 0)

        // In a real implementation, you would use a QR code scanning library here
        // For demo purposes, we'll simulate a scanned address
        const mockScannedAddress = "0x8ba1f109551bD432803012645Hac189451b934"
        setToAddress(mockScannedAddress)
        toast.success("QR Code scanned successfully!")
        stopQRScanner()
      }
    }
  }

  // Poll Etherscan for the transaction status
  const pollEtherscanForStatus = async (txHash: string, fromAddress: string, maxAttempts = 20, interval = 5000) => {
    for (let attempt = 0; attempt < maxAttempts; attempt++) {
      try {
        const txs = await etherscanService.getTransactions(fromAddress)
        const tx = txs.find(t => t.hash.toLowerCase() === txHash.toLowerCase())
        if (tx) {
          return tx.isError === "0" ? "success" : "failed"
        }
      } catch (e) {
        // ignore and retry
      }
      await new Promise(res => setTimeout(res, interval))
    }
    return "pending"
  }

  // Replace simulateTransaction with a real transaction call using your backend API
  const sendTransaction = async (txData: TransactionData): Promise<TransactionData> => {
    if (!walletId) {
      toast.error("No wallet selected.")
      return { ...txData, status: "failed" }
    }
    try {
      const response = await api.post(`/wallet/${walletId}/send`, {
        toAddress: txData.to,
        amount: parseFloat(txData.amount),
        password: password,
      });
      const result = response.data;
      return {
        ...txData,
        status:
          result.status?.toLowerCase() === "completed"
            ? "success"
            : result.status?.toLowerCase() === "failed"
            ? "failed"
            : "pending",
        transactionHash: result.transactionHash,
      };
    } catch (error: any) {
      toast.error(error.response?.data?.error || "Transaction failed");
      return { ...txData, status: "failed" };
    }
  }

  const handleSend = async () => {
    if (!toAddress || !amount || !password) {
      toast.error("Please fill in all fields")
      return
    }

    setIsProcessing(true)

    const initialTxData: TransactionData = {
      from: fromAddress,
      to: toAddress,
      amount: amount,
      status: "pending",
    }

    setTransactionData(initialTxData)
    setShowSummary(true)

    try {
      // Use real transaction logic here
      const finalTxData = await sendTransaction(initialTxData)
      setTransactionData(finalTxData)

      // If we have a transaction hash, poll Etherscan for the real status
      if (finalTxData.transactionHash) {
        const status = await pollEtherscanForStatus(finalTxData.transactionHash, fromAddress)
        setTransactionData({ ...finalTxData, status })
        if (status === "success") {
          toast.success("Transaction completed successfully!")
        } else if (status === "failed") {
          toast.error("Transaction failed on-chain.")
        }
      } else {
        if (finalTxData.status === "success") {
          toast.success("Transaction completed successfully!")
        } else {
          toast.error("Transaction failed. Please try again.")
        }
      }
    } catch (error) {
      setTransactionData({
        ...initialTxData,
        status: "failed",
      })
      toast.error("Transaction failed due to an error")
    } finally {
      setIsProcessing(false)
    }
  }

  const handleCloseSummary = () => {
    setShowSummary(false)
    setTransactionData(null)
    onClose()
    setToAddress("")
    setAmount("")
    setPassword("")
  }

  // Add this function to allow manual refresh
  const refreshStatus = async () => {
    if (!transactionData?.transactionHash) return;
    setRefreshing(true);
    try {
      const status = await pollEtherscanForStatus(transactionData.transactionHash, fromAddress);
      setTransactionData((prev) =>
        prev ? { ...prev, status } : prev
      );
      if (status === "success") {
        toast.success("Transaction completed successfully!");
      } else if (status === "failed") {
        toast.error("Transaction failed on-chain.");
      } else {
        toast("Transaction is still pending.");
      }
    } catch (e) {
      toast.error("Failed to refresh status.");
    } finally {
      setRefreshing(false);
    }
  };

  useEffect(() => {
    return () => {
      stopQRScanner()
    }
  }, [])

  const handleClose = () => {
    if (!showSummary) {
      stopQRScanner()
      onClose()
      setToAddress("")
      setAmount("")
      setPassword("")
    }
  }

  return (
    <>
      <Dialog open={isOpen && !showSummary} onOpenChange={handleClose}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Send Ethereum</DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <Label htmlFor="from">From</Label>
              <Input id="from" value={fromAddress} disabled className="bg-gray-50" />
            </div>

            <div>
              <Label htmlFor="to">To</Label>
              <div className="flex gap-2">
                <Input
                  id="to"
                  placeholder="Recipient's wallet address"
                  value={toAddress}
                  onChange={(e) => setToAddress(e.target.value)}
                  className="flex-1"
                  disabled={isProcessing}
                />
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  onClick={startQRScanner}
                  disabled={isScanning || isProcessing}
                >
                  <QrCode className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div>
              <Label htmlFor="amount">Amount (ETH)</Label>
              <Input
                id="amount"
                type="number"
                step="0.001"
                placeholder="0.00"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                disabled={isProcessing}
              />
            </div>

            <div>
              <Label htmlFor="password">Wallet Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Enter your wallet password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isProcessing}
              />
            </div>

            {isScanning && (
              <div className="space-y-4">
                <div className="relative">
                  <video ref={videoRef} className="w-full h-48 bg-black rounded-lg" autoPlay playsInline />
                  <Button className="absolute top-2 right-2" variant="secondary" size="icon" onClick={stopQRScanner}>
                    <X className="h-4 w-4" />
                  </Button>
                </div>
                <Button onClick={captureQRCode} className="w-full">
                  <Camera className="h-4 w-4 mr-2" />
                  Capture QR Code
                </Button>
                <canvas ref={canvasRef} className="hidden" />
              </div>
            )}

            <div className="flex gap-2 pt-4">
              <Button variant="outline" onClick={handleClose} className="flex-1 bg-transparent" disabled={isProcessing}>
                Cancel
              </Button>
              <Button onClick={handleSend} className="flex-1" disabled={isProcessing}>
                {isProcessing ? "Processing..." : "Send"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <TransactionSummaryModal
        isOpen={showSummary}
        onClose={handleCloseSummary}
        transaction={transactionData}
        // Add a refresh button below the summary if pending and tx hash exists
        extraActions={
          transactionData?.status === "pending" && transactionData?.transactionHash ? (
            <Button
              onClick={refreshStatus}
              disabled={refreshing}
              className="w-full mt-4"
              variant="outline"
            >
              {refreshing ? "Refreshing..." : "Refresh Status"}
            </Button>
          ) : null
        }
      />
    </>
  )
}
