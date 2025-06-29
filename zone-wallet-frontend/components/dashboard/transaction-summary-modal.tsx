"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { CheckCircle, XCircle, Clock } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { useRouter } from "next/navigation"

interface TransactionData {
  from: string
  to: string
  amount: string
  status: "pending" | "success" | "failed"
  transactionHash?: string
}

interface TransactionSummaryModalProps {
  isOpen: boolean
  onClose: () => void
  transaction: TransactionData | null
  extraActions?: React.ReactNode
}

export default function TransactionSummaryModal({
  isOpen,
  onClose,
  transaction,
  extraActions,
}: TransactionSummaryModalProps) {
  const router = useRouter()

  if (!transaction) return null

  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`
  }

  const getStatusIcon = () => {
    switch (transaction.status) {
      case "success":
        return <CheckCircle className="h-8 w-8 text-green-500" />
      case "failed":
        return <XCircle className="h-8 w-8 text-red-500" />
      case "pending":
        return <Clock className="h-8 w-8 text-yellow-500 animate-pulse" />
      default:
        return null
    }
  }

  const getStatusColor = () => {
    switch (transaction.status) {
      case "success":
        return "text-green-600 bg-green-50"
      case "failed":
        return "text-red-600 bg-red-50"
      case "pending":
        return "text-yellow-600 bg-yellow-50"
      default:
        return "text-gray-600 bg-gray-50"
    }
  }

  const getStatusMessage = () => {
    switch (transaction.status) {
      case "success":
        return "Transaction Successful!"
      case "failed":
        return "Transaction Failed"
      case "pending":
        return "Transaction Pending..."
      default:
        return "Transaction Status Unknown"
    }
  }

  // Handler for Done button
  const handleDone = () => {
    onClose()
    if (transaction.status !== "pending") {
      router.refresh()
    }
  }

  // Handler for View on Explorer button
  const handleViewExplorer = () => {
    if (transaction.transactionHash) {
      window.open(`https://sepolia.etherscan.io/tx/${transaction.transactionHash}`, "_blank")
    }
    onClose()
    router.push("/dashboard")
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Transaction Summary</DialogTitle>
        </DialogHeader>
        <div className="space-y-6">
          {/* Status Section */}
          <div className="flex flex-col items-center text-center space-y-3">
            {getStatusIcon()}
            <div>
              <h3 className="text-lg font-semibold">{getStatusMessage()}</h3>
              <Badge variant="secondary" className={getStatusColor()}>
                {transaction.status.toUpperCase()}
              </Badge>
            </div>
          </div>

          {/* Transaction Details */}
          <div className="space-y-4 border-t pt-4">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-gray-600">From:</span>
              <span className="font-mono text-sm">{formatAddress(transaction.from)}</span>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-gray-600">To:</span>
              <span className="font-mono text-sm">{formatAddress(transaction.to)}</span>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-gray-600">Amount:</span>
              <span className="font-semibold text-lg">{transaction.amount} ETH</span>
            </div>

            {transaction.transactionHash && (
              <div className="flex justify-between items-start">
                <span className="text-sm font-medium text-gray-600">Transaction Hash:</span>
                <span className="font-mono text-xs text-right max-w-32 break-all">
                  {formatAddress(transaction.transactionHash)}
                </span>
              </div>
            )}

            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-gray-600">Timestamp:</span>
              <span className="text-sm">{new Date().toLocaleString()}</span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2 pt-4">
            {transaction.status === "success" && (
              <Button
                variant="outline"
                className="flex-1 bg-transparent"
                onClick={handleViewExplorer}
              >
                View on Explorer
              </Button>
            )}
            <Button onClick={handleDone} className="flex-1">
              {transaction.status === "pending" ? "Close" : "Done"}
            </Button>
          </div>

          {transaction.status === "pending" && (
            <div className="text-center">
              <p className="text-xs text-gray-500">Your transaction is being processed. This may take a few minutes.</p>
            </div>
          )}

          {extraActions}
        </div>
      </DialogContent>
    </Dialog>
  )
}
