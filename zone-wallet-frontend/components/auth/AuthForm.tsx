"use client";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";

interface AuthFormProps {
  mode: "login" | "register";
  onSubmit: (data: AuthFormValues) => Promise<void>;
}

const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

const registerSchema = loginSchema
  .extend({
    confirmPassword: z
      .string()
      .min(8, "Password must be at least 8 characters"),
    firstName: z.string().min(1, "First name is required"),
    lastName: z.string().min(1, "Last name is required"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

export type AuthFormValues =
  | z.infer<typeof loginSchema>
  | z.infer<typeof registerSchema>;

const AuthForm = ({ mode, onSubmit }: AuthFormProps) => {
  const schema = mode === "register" ? registerSchema : loginSchema;
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<AuthFormValues>({
    resolver: zodResolver(schema),
  });

  const [error, setError] = useState<string | null>(null);

  const handleFormSubmit = async (data: AuthFormValues) => {
    try {
      await onSubmit(data);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message || "An error occurred");
      } else {
        setError("An error occurred");
      }
    }
  };

  return (
    <div className="max-w-md mx-auto mt-12">
      <div className="bg-white/90 dark:bg-zinc-900/80 rounded-2xl shadow-lg border border-zinc-200 dark:border-zinc-800 p-8">
        <h2 className="text-2xl font-bold text-center mb-6 text-purple-700 dark:text-purple-400">
          {mode === "register" ? "Create an Account" : "Sign In"}
        </h2>
        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-5">
          {error && (
            <div className="mb-4 rounded bg-red-100 p-3 text-red-700 text-center text-sm">
              {error}
            </div>
          )}

          {mode === "register" && (
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="firstName"
                  className="block text-xs font-medium text-zinc-700 dark:text-zinc-200"
                >
                  First Name
                </label>
                <input
                  id="firstName"
                  type="text"
                  {...register("firstName")}
                  className="mt-1 block w-full rounded-lg border border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 px-3 py-2 shadow-sm focus:border-purple-500 focus:ring-2 focus:ring-purple-200 dark:focus:ring-purple-700 focus:outline-none text-zinc-900 dark:text-zinc-100"
                />
                {"firstName" in errors && errors.firstName && (
                  <p className="mt-1 text-xs text-red-600">
                    {errors.firstName.message}
                  </p>
                )}
              </div>
              <div>
                <label
                  htmlFor="lastName"
                  className="block text-xs font-medium text-zinc-700 dark:text-zinc-200"
                >
                  Last Name
                </label>
                <input
                  id="lastName"
                  type="text"
                  {...register("lastName")}
                  className="mt-1 block w-full rounded-lg border border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 px-3 py-2 shadow-sm focus:border-purple-500 focus:ring-2 focus:ring-purple-200 dark:focus:ring-purple-700 focus:outline-none text-zinc-900 dark:text-zinc-100"
                />
                {"lastName" in errors && errors.lastName && (
                  <p className="mt-1 text-xs text-red-600">
                    {errors.lastName.message}
                  </p>
                )}
              </div>
            </div>
          )}

          <div>
            <label
              htmlFor="email"
              className="block text-xs font-medium text-zinc-700 dark:text-zinc-200"
            >
              Email
            </label>
            <input
              id="email"
              type="email"
              {...register("email")}
              className="mt-1 block w-full rounded-lg border border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 px-3 py-2 shadow-sm focus:border-purple-500 focus:ring-2 focus:ring-purple-200 dark:focus:ring-purple-700 focus:outline-none text-zinc-900 dark:text-zinc-100"
            />
            {errors.email && (
              <p className="mt-1 text-xs text-red-600">
                {errors.email.message}
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-xs font-medium text-zinc-700 dark:text-zinc-200"
            >
              Password
            </label>
            <input
              id="password"
              type="password"
              {...register("password")}
              className="mt-1 block w-full rounded-lg border border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 px-3 py-2 shadow-sm focus:border-purple-500 focus:ring-2 focus:ring-purple-200 dark:focus:ring-purple-700 focus:outline-none text-zinc-900 dark:text-zinc-100"
            />
            {errors.password && (
              <p className="mt-1 text-xs text-red-600">
                {errors.password.message}
              </p>
            )}
          </div>

          {mode === "register" && (
            <div>
              <label
                htmlFor="confirmPassword"
                className="block text-xs font-medium text-zinc-700 dark:text-zinc-200"
              >
                Confirm Password
              </label>
              <input
                id="confirmPassword"
                type="password"
                {...register("confirmPassword")}
                className="mt-1 block w-full rounded-lg border border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 px-3 py-2 shadow-sm focus:border-purple-500 focus:ring-2 focus:ring-indigo-200 dark:focus:ring-purple-700 focus:outline-none text-zinc-900 dark:text-zinc-100"
              />
              {"confirmPassword" in errors && errors.confirmPassword && (
                <p className="mt-1 text-xs text-red-600">
                  {errors.confirmPassword.message}
                </p>
              )}
            </div>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full rounded-lg bg-purple-600 hover:bg-purple-700 focus:ring-2 focus:ring-purple-400 focus:outline-none px-4 py-2 text-white font-semibold transition disabled:opacity-50"
          >
            {isSubmitting
              ? mode === "register"
                ? "Creating Account..."
                : "Signing in..."
              : mode === "register"
              ? "Sign Up"
              : "Sign In"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AuthForm;
