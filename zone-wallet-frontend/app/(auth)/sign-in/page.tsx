"use client";

import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import AuthForm from "@/components/auth/AuthForm";
import { Loader2 } from "lucide-react";
import Image from "next/image";
import { useState } from "react";

export default function SignInPage() {
  const { login } = useAuth();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (data: { email: string; password: string }) => {
    setIsLoading(true);
    try {
      await login(data.email, data.password);
      router.push("/dashboard");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2">
      <div className="h-full lg:flex flex-col items-center justify-center px-4">
        <div className="text-center space-y-4 pt-16">
          <h1 className="font-bold text-3xl text-[#9D00FF]">Welcome Back!</h1>
          <p className="text-base text-[#7E8CA0]">
            Log in to get back to your dashboard!
          </p>
        </div>
        <div className="flex flex-col items-center justify-center mt-8 w-full max-w-md">
          {isLoading ? (
            <Loader2 className="animate-spin text-purple-600 w-8 h-8 my-8" />
          ) : (
            <>
              <AuthForm mode="login" onSubmit={handleLogin} />
              <div className="mt-4 text-center">
                <p className="text-sm">
                  Don&apos;t have an account?{" "}
                  <a
                    href="/sign-up"
                    className="text-purple-600 hover:text-purple-800"
                  >
                    Signup
                  </a>
                </p>
              </div>
            </>
          )}
        </div>
      </div>
      <div className="h-full bg-purple-600 hidden lg:flex items-center justify-center">
        <Image src="logo.svg" height={200} width={200} alt="Logo" />
      </div>
    </div>
  );
}
