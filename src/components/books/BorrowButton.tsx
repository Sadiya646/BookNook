"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import type { Book, Borrow } from "../../../types";

export default function BorrowButton({ book }: { book: Book }) {
  const router = useRouter();

  const [borrowed, setBorrowed] = useState(false);
  const [checking, setChecking] = useState(true);
  const [loading, setLoading] = useState(false);

  // চেক করা ইউজার অলরেডি বইটি বরো করেছে কিনা
  useEffect(() => {
    let cancelled = false;

    fetch(`${process.env.NEXT_PUBLIC_API_URL}/borrows`, {
      credentials: "include",
    })
      .then((res) => res.json())
      .then((list: Borrow[]) => {
        if (!cancelled && Array.isArray(list)) {
          setBorrowed(list.some((b) => b.bookId === book._id));
        }
      })
      .catch(() => {})
      .finally(() => {
        if (!cancelled) setChecking(false);
      });

    return () => {
      cancelled = true;
    };
  }, [book._id]);

  const handleBorrow = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/borrows`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ bookId: book._id }),
        credentials: "include",
      });

      if (!res.ok) throw new Error("Failed to borrow book");

      setBorrowed(true);
      router.refresh(); // পেজের ডেটা রিফ্রেশ করার জন্য যাতে কপি কমে যায়
    } catch (error) {
      console.error(error);
      alert("Something went wrong while borrowing the book.");
    } finally {
      setLoading(false);
    }
  };

  const soldOut = book.copies < 1;
  const label = borrowed ? "Already Borrowed" : soldOut ? "Not Available" : "Borrow This Book";

  return (
    <button
      disabled={checking || loading || soldOut || borrowed}
      onClick={handleBorrow}
      className={`w-full rounded-xl py-3 px-6 font-semibold text-white transition ${
        soldOut || borrowed || checking
          ? "cursor-not-allowed bg-gray-400"
          : "bg-blue-600 hover:bg-blue-700"
      }`}
    >
      {loading ? "Processing..." : label}
    </button>
  );
}