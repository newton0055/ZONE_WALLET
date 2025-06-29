// app/(dashboard)/layout.tsx
"use client";

import { useAuth } from "@/contexts/AuthContext";
import { WalletProvider } from "@/contexts/WalletContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Link from "next/link";
import Image from "next/image";

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const { user, loading: authLoading, logout } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!authLoading && !user) {
            router.push("/sign-in");
        }
    }, [user, authLoading, router]);

    if (authLoading) {
        return (
            <div className="flex h-screen items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Loading...</p>
                </div>
            </div>
        );
    }

    if (!user) {
        return null; // Will redirect in useEffect
    }

    return (
        <WalletProvider>
            <div className="min-h-screen bg-gray-100">
                <nav className="bg-gradient-to-b from-purple-700 to-purple-500 px-4 py-8 lg:px-14 pb-12">
                    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                        <div className="flex h-16 justify-between">
                            <div className="flex">
                                <div className="flex flex-shrink-0 items-center">
                                    <Image src='logo.svg' alt="Logo" height={28} width={28}/>
                                    <Link href="/dashboard" className="text-xl font-bold text-white">
                                        Zone Wallet
                                    </Link>
                                </div>
                                <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
                                    <Link
                                        href="/dashboard"
                                        className="border-transparent text-black-500 hover:text-gray-700 hover:border-gray-300 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
                                    >
                                        Dashboard
                                    </Link>
                                    <Link
                                        href="/dashboard/wallets"
                                        className="border-transparent text-black-500 hover:text-gray-700 hover:border-gray-300 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
                                    >
                                        Wallets
                                    </Link>
                                    <Link
                                        href="/dashboard/transactions"
                                        className="border-transparent text-black-500 hover:text-gray-700 hover:border-gray-300 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
                                    >
                                        Transactions
                                    </Link>
                                    <Link
                                        href="/dashboard/profile"
                                        className="border-transparent text-black-500 hover:text-gray-700 hover:border-gray-300 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
                                    >
                                        Profile
                                    </Link>
                                </div>
                            </div>
                            <div className="flex items-center">
                                <span className="text-sm text-black-500 mr-4">
                                    {user.firstName} {user.lastName}
                                </span>
                                <button
                                    onClick={logout}
                                    className="rounded-md bg-purple-100 px-3 py-2 text-sm font-medium text-purple-700 hover:bg-purple-200"
                                >
                                    Logout
                                </button>
                            </div>
                        </div>
                    </div>
                </nav>

                {/* Welcome message immediately after the header */}
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mt-8">
                    <h1 className="text-2xl lg:text-3xl font-bold text-purple-700 mb-8">
                        Welcome, {user.firstName} 👋
                    </h1>
                </div>

                <main className="mx-auto max-w-7xl py-6 sm:px-6 lg:px-8">
                    {children}
                </main>
            </div>
        </WalletProvider>
    );
}
