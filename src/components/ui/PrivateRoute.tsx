"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function PrivateRoute({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // এখানে আপনার BetterAuth বা সেশন চেক করার লজিক বসাতে পারেন।
    // সাময়িকভাবে লোকালস্টোরেজ বা সেশন চেক করা যেতে পারে:
    const checkAuth = async () => {
      // উদাহরণস্বরূপ সেশন চেক সিমুলেশন (প্রয়োজনে আপনার অ্যাথেন্টিকেশন হুক বসিয়ে নিন)
      const hasSession = true; // সত্য হলে ইউজার লগইন করা আছে
      
      if (!hasSession) {
        router.push("/login");
      } else {
        setIsAuthenticated(true);
      }
      setLoading(false);
    };

    checkAuth();
  }, [router]);

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="size-8 animate-spin rounded-full border-4 border-blue-600 border-t-transparent"></div>
      </div>
    );
  }

  if (!isAuthenticated) return null;

  return <>{children}</>;
}