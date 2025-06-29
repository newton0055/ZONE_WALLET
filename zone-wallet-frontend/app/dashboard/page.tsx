// app/(dashboard)/dashboard/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useWallet } from "@/hooks/use-wallet";
import RecentTransactions from "@/components/dashboard/recent-transactions";
import { toast } from 'react-hot-toast';
import BalanceCard from "@/components/dashboard/balance-card";

export default function DashboardPage() {
    const { loading, error } = useWallet();

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-red-500">Error: {error}</div>
            </div>
        );
    }

    return (
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-0">
            <div className="mb-8">
                <BalanceCard />
            </div>
            <RecentTransactions />
        </div>
    );
}
