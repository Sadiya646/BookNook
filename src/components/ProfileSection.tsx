
"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";

export default function ProfileSection() {
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleLogout = async () => {
    setLoading(true);

    try {
      await authClient.signOut();
      setOpen(false);
      router.push("/");
      router.refresh();
    } catch (error) {
      console.error("Logout failed:", error);
    } finally {
      setLoading(false);
    }
  };

  if (isPending) {
    return <div className="text-sm text-gray-400">Loading...</div>;
  }

  if (!session?.user) {
    return (
      <div className="flex items-center gap-3">
        <Link href="/login" className="text-sm font-medium">
          Login
        </Link>

        <Link
          href="/register"
          className="rounded-lg bg-blue-600 px-4 py-2 text-white"
        >
          Register
        </Link>
      </div>
    );
  }

  const user = session.user;

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 rounded-full border px-3 py-2"
      >
        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-600 text-white font-bold">
          {user.name?.charAt(0).toUpperCase() || "U"}
        </div>

        <span className="text-sm font-medium">
          {user.name}
        </span>
      </button>

      {open && (
        <div className="absolute right-0 top-14 z-50 w-64 rounded-xl border bg-white p-4 shadow-lg text-gray-900">
          <h3 className="font-semibold">{user.name}</h3>

          <p className="mb-4 text-sm text-gray-500 break-all">
            {user.email}
          </p>

          <button
            onClick={handleLogout}
            disabled={loading}
            className="w-full rounded-lg bg-red-500 px-4 py-2 text-white hover:bg-red-600 disabled:opacity-50"
          >
            {loading ? "Logging out..." : "Logout"}
          </button>
        </div>
      )}
    </div>
  );
}
