
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
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
    <div className="min-h-screen flex items-center justify-center bg-gray-950 px-4">
      <form
        onSubmit={handleRegister}
        className="w-full max-w-md space-y-5 rounded-xl bg-gray-900 p-8"
      >
        <h1 className="text-3xl font-bold text-white text-center">
          Create Account
        </h1>

        {error && (
          <p className="text-red-400 text-sm">{error}</p>
        )}

        <input
          type="text"
          placeholder="Full Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          className="w-full rounded-lg p-3 bg-gray-800 text-white"
        />

        <input
          type="email"
          placeholder="Email Address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="w-full rounded-lg p-3 bg-gray-800 text-white"
        />

        <input
          type="password"
          placeholder="Password (minimum 8 characters)"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          minLength={8}
          required
          className="w-full rounded-lg p-3 bg-gray-800 text-white"
        />

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-lg bg-blue-600 p-3 text-white font-semibold disabled:opacity-50"
        >
          {loading ? "Creating Account..." : "Register"}
        </button>

        <p className="text-center text-gray-400">
          Already have an account?{" "}
          <a href="/login" className="text-blue-400">
            Login
          </a>
        </p>
      </form>
    </div>
  );
}
