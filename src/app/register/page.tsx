"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { User, Mail, Lock, ArrowRight, BookOpen } from "lucide-react";
import { authClient } from "@/lib/auth-client";

export default function RegisterPage() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const { error } = await authClient.signUp.email({
        name,
        email,
        password,
        callbackURL: "/",
      });

      if (error) {
        setError(error.message || "Registration failed");
        return;
      }

      router.push("/");
      router.refresh();
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F4F8F8] px-4 dark:bg-[#031716]">
      <form
        onSubmit={handleRegister}
        className="w-full max-w-md space-y-6 rounded-3xl border border-[#0C969C]/25 bg-[#F4F8F8] p-8 shadow-2xl backdrop-blur-xl dark:border-[#274D60]/50 dark:bg-[#032F30] md:p-10"
      >
        {/* Brand Icon & Heading */}
        <div className="text-center">
          <div className="mx-auto mb-4 flex size-14 items-center justify-center rounded-2xl bg-gradient-to-br from-[#0C969C] to-[#032F30] text-white shadow-lg shadow-[#0C969C]/30">
            <BookOpen className="h-7 w-7" />
          </div>
          <h1 className="text-3xl font-black tracking-tight text-[#031716] dark:text-[#F4F8F8]">
            Create Account
          </h1>
          <p className="mt-1 text-sm font-medium text-[#274D60] dark:text-[#6BA3BE]">
            Join BookNook to start exploring
          </p>
        </div>

        {error && (
          <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-3.5 text-center text-xs font-semibold text-red-500">
            {error}
          </div>
        )}

        <div className="space-y-4">
          {/* Full Name Field */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-[#274D60] dark:text-[#6BA3BE]">
              Full Name
            </label>
            <div className="relative flex items-center">
              <User className="absolute left-4 h-4 w-4 text-[#0C969C] pointer-events-none" />
              <input
                type="text"
                placeholder="John Doe"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="h-12 w-full pl-11 pr-4 rounded-2xl border border-[#CCE0E0] bg-white text-sm text-[#031716] shadow-sm outline-none transition-all focus:border-[#0C969C] focus:ring-2 focus:ring-[#0C969C]/20 dark:border-[#274D60] dark:bg-[#031716] dark:text-[#F4F8F8]"
              />
            </div>
          </div>

          {/* Email Address Field */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-[#274D60] dark:text-[#6BA3BE]">
              Email Address
            </label>
            <div className="relative flex items-center">
              <Mail className="absolute left-4 h-4 w-4 text-[#0C969C] pointer-events-none" />
              <input
                type="email"
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="h-12 w-full pl-11 pr-4 rounded-2xl border border-[#CCE0E0] bg-white text-sm text-[#031716] shadow-sm outline-none transition-all focus:border-[#0C969C] focus:ring-2 focus:ring-[#0C969C]/20 dark:border-[#274D60] dark:bg-[#031716] dark:text-[#F4F8F8]"
              />
            </div>
          </div>

          {/* Password Field */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-[#274D60] dark:text-[#6BA3BE]">
              Password
            </label>
            <div className="relative flex items-center">
              <Lock className="absolute left-4 h-4 w-4 text-[#0C969C] pointer-events-none" />
              <input
                type="password"
                placeholder="Minimum 8 characters"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                minLength={8}
                required
                className="h-12 w-full pl-11 pr-4 rounded-2xl border border-[#CCE0E0] bg-white text-sm text-[#031716] shadow-sm outline-none transition-all focus:border-[#0C969C] focus:ring-2 focus:ring-[#0C969C]/20 dark:border-[#274D60] dark:bg-[#031716] dark:text-[#F4F8F8]"
              />
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-[#0C969C] to-[#0A7075] py-4 text-sm font-bold uppercase tracking-wider text-white shadow-xl shadow-[#0C969C]/30 transition-all hover:scale-[1.01] hover:shadow-2xl hover:shadow-[#0C969C]/40 active:scale-95 disabled:opacity-50"
        >
          {loading ? (
            "Creating Account..."
          ) : (
            <>
              Register Account
              <ArrowRight size={18} />
            </>
          )}
        </button>

        {/* Login Link */}
        <p className="text-center text-sm font-medium text-[#274D60] dark:text-[#6BA3BE]">
          Already have an account?{" "}
          <Link
            href="/login"
            className="font-bold text-[#0C969C] hover:underline dark:text-[#6BA3BE]"
          >
            Login
          </Link>
        </p>
      </form>
    </div>
  );
}