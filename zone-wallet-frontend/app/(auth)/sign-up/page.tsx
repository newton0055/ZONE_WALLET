"use client";

import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import AuthForm from "@/components/auth/AuthForm";
import { AuthFormValues } from "@/components/auth/AuthForm";
import { Loader2 } from "lucide-react";
import Image from "next/image";
import { useState } from "react";

export default function SignUpPage() {
  const { register: registerUser } = useAuth();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleRegister = async (data: AuthFormValues) => {
    setIsLoading(true);
    try {
      // Type guard to ensure we have register data
      if ("firstName" in data && "lastName" in data) {
        await registerUser(
          data.email,
          data.password,
          data.firstName,
          data.lastName
        );
        router.push("/(dashboard)");
      } else {
        // Handle the case where firstName/lastName are missing
        console.error("Missing required fields for registration");
      }
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
            Create account to get to your dashboard!
          </p>
        </div>
        <div className="flex flex-col items-center justify-center mt-8 w-full max-w-md">
          {isLoading ? (
            <Loader2 className="animate-spin text-purple-600 w-8 h-8 my-8" />
          ) : (
            <>
              <AuthForm mode="register" onSubmit={handleRegister} />
              <div className="mt-4 text-center">
                <p className="text-sm">
                  Already have an account?{" "}
                  <a
                    href="/sign-in"
                    className="text-indigo-600 hover:text-indigo-800"
                  >
                    Sign in
                  </a>
                </p>
              </div>
            </>
          )}
        </div>
      </div>
      <div className="h-full bg-purple-600 hidden lg:flex items-center justify-center">
        <Image src="/logo.svg" height={100} width={100} alt="Logo" />
      </div>
    </div>
  );
}
