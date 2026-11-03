
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  User,
  Mail,
  Lock,
  ArrowRight,
  BookOpen,
  Loader2,
} from "lucide-react";
import { authClient } from "@/lib/auth-client";

export default function RegisterPage() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [error, setError] = useState("");

  // Password Validation
  const hasUppercase = /[A-Z]/.test(password);
  const hasLowercase = /[a-z]/.test(password);
  const hasMinLength = password.length >= 6;

  const isPasswordValid =
    hasUppercase && hasLowercase && hasMinLength;

  // Email Registration
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!isPasswordValid) {
      setError("Please fulfill all password requirements.");
      return;
    }

    setLoading(true);

    try {
      const { error } = await authClient.signUp.email({
        name,
        email,
        password,
        callbackURL: "/",
      });

      if (error) {
        setError(error.message || "Registration failed.");
        return;
      }

      router.push("/");
      router.refresh();
    } catch (err) {
      console.error("Registration Error:", err);
      setError(
        err instanceof Error
          ? err.message
          : "Something went wrong. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  // Google Registration
 // Google Registration
const handleGoogleRegister = async () => {
  setGoogleLoading(true);
  setError("");

  try {
    const { error } = await authClient.signIn.social({
      provider: "google",
      callbackURL: "https://booknook-pied.vercel.app/",
    });

    if (error) {
      console.error("Google Registration Error:", error);
      setError(error.message || "Google registration failed.");
      setGoogleLoading(false);
    }
  } catch (err) {
    console.error("Google Registration Exception:", err);

    setError(
      err instanceof Error
        ? err.message
        : "Unable to register with Google. Please try again."
    );

    setGoogleLoading(false);
  }
};

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F4F8F8] px-4 py-10 dark:bg-[#031716]">
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

        {/* Error Message */}
        {error && (
          <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-3.5 text-center text-xs font-semibold text-red-500">
            {error}
          </div>
        )}

        {/* Google Registration */}
        <button
          type="button"
          onClick={handleGoogleRegister}
          disabled={googleLoading || loading}
          className="w-full flex items-center justify-center gap-3 rounded-2xl border border-[#CCE0E0] bg-white py-3.5 text-sm font-bold text-[#031716] shadow-sm transition-all hover:bg-gray-50 hover:border-[#0C969C] active:scale-95 disabled:opacity-50 dark:border-[#274D60] dark:bg-[#031716] dark:text-white dark:hover:bg-[#274D60]"
        >
          {googleLoading ? (
            <Loader2 size={19} className="animate-spin" />
          ) : (
            <svg
              viewBox="0 0 48 48"
              className="h-5 w-5"
              aria-hidden="true"
            >
              <path
                fill="#EA4335"
                d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 3.13 13.22l7.98 6.19C13 13.72 18.12 9.5 24 9.5z"
              />
              <path
                fill="#4285F4"
                d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.73 7.18l7.24 5.62c4.22-3.9 7.53-9.63 7.53-17.27z"
              />
              <path
                fill="#FBBC05"
                d="M10.53 28.59A14.5 14.5 0 0 1 9.75 24c0-1.59.27-3.13.78-4.59l-7.98-6.19A23.94 23.94 0 0 0 0 24c0 3.87.93 7.52 2.55 10.78l7.98-6.19z"
              />
              <path
                fill="#34A853"
                d="M24 48c6.48 0 11.93-2.13 15.9-6.18l-7.24-5.62c-2.01 1.35-4.6 2.15-8.66 2.15-5.88 0-10.87-3.97-12.66-9.31l-7.98 6.19C6.51 42.62 14.62 48 24 48z"
              />
            </svg>
          )}

          {googleLoading
            ? "Connecting to Google..."
            : "Continue with Google"}
        </button>

        {/* Divider */}
        <div className="relative flex items-center">
          <div className="flex-grow border-t border-[#CCE0E0] dark:border-[#274D60]" />

          <span className="mx-4 text-xs font-semibold uppercase tracking-wider text-gray-400">
            Or register with email
          </span>

          <div className="flex-grow border-t border-[#CCE0E0] dark:border-[#274D60]" />
        </div>

        <div className="space-y-4">
          {/* Full Name */}
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

          {/* Email Address */}
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

          {/* Password */}
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-[#274D60] dark:text-[#6BA3BE]">
              Password
            </label>

            <div className="relative flex items-center">
              <Lock className="absolute left-4 h-4 w-4 text-[#0C969C] pointer-events-none" />

              <input
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                minLength={6}
                required
                className="h-12 w-full pl-11 pr-4 rounded-2xl border border-[#CCE0E0] bg-white text-sm text-[#031716] shadow-sm outline-none transition-all focus:border-[#0C969C] focus:ring-2 focus:ring-[#0C969C]/20 dark:border-[#274D60] dark:bg-[#031716] dark:text-[#F4F8F8]"
              />
            </div>

            {/* Password Requirements */}
            <div className="space-y-1 pl-1 text-xs">
              <p className="font-semibold text-[#274D60] dark:text-[#A7C5CC]">
                Password must contain:
              </p>

              <p className={hasUppercase ? "text-green-500" : "text-gray-400"}>
                {hasUppercase ? "✓" : "○"} At least one uppercase letter (A-Z)
              </p>

              <p className={hasLowercase ? "text-green-500" : "text-gray-400"}>
                {hasLowercase ? "✓" : "○"} At least one lowercase letter (a-z)
              </p>

              <p className={hasMinLength ? "text-green-500" : "text-gray-400"}>
                {hasMinLength ? "✓" : "○"} Minimum 6 characters
              </p>
            </div>
          </div>
        </div>

        {/* Register Button */}
        <button
          type="submit"
          disabled={loading || googleLoading || !isPasswordValid}
          className="w-full flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-[#0C969C] to-[#0A7075] py-4 text-sm font-bold uppercase tracking-wider text-white shadow-xl shadow-[#0C969C]/30 transition-all hover:scale-[1.01] hover:shadow-2xl hover:shadow-[#0C969C]/40 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? (
            <>
              <Loader2 size={18} className="animate-spin" />
              Creating Account...
            </>
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
