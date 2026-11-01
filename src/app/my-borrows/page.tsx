"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { BookOpen, CalendarDays, ArrowLeft, BookmarkCheck } from "lucide-react";
import Link from "next/link";
import PrivateRoute from "@/components/ui/PrivateRoute";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

type Borrowing = {
  _id: string;
  bookId: string;
  bookTitle: string;
  bookAuthor: string;
  bookImage: string;
  borrowerName: string;
  borrowerEmail: string;
  borrowDate: string;
  dueDate: string;
  status: string;
};

function formatDate(date: string) {
  return new Date(date).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export default function MyBorrowsPage() {
  const [borrowings, setBorrowings] = useState<Borrowing[]>([]);
  const [loading, setLoading] = useState(true);
  const [returningId, setReturningId] = useState<string | null>(null);

  async function fetchBorrowings() {
    try {
      const email = localStorage.getItem("borrowerEmail");

      if (!email) {
        setBorrowings([]);
        return;
      }

      const res = await fetch(
        `${API_URL}/my-borrows?email=${encodeURIComponent(email)}`,
        { cache: "no-store" }
      );

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to fetch borrowed books");
      }

      setBorrowings(data);
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Something went wrong"
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchBorrowings();
  }, []);

  async function handleReturn(id: string) {
    try {
      setReturningId(id);

      const email = localStorage.getItem("borrowerEmail");

      if (!email) {
        toast.error("Please borrow a book first");
        return;
      }

      const res = await fetch(`${API_URL}/return/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to return book");
      }

      setBorrowings((previous) =>
        previous.filter((book) => book._id !== id)
      );

      toast.success("Book returned successfully!");
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Something went wrong"
      );
    } finally {
      setReturningId(null);
    }
  }

  return (
    <PrivateRoute>
      <main className="mx-auto min-h-screen max-w-7xl px-6 py-12 bg-[#F4F8F8] dark:bg-[#031716]">
        
        {/* Header Section */}
        <div className="mb-12 text-center">
          <div className="mx-auto mb-4 flex size-16 items-center justify-center rounded-2xl bg-gradient-to-br from-[#0C969C] to-[#032F30] text-white shadow-xl shadow-[#0C969C]/30">
            <BookmarkCheck className="h-8 w-8 text-white" />
          </div>

          <h1 className="text-3xl font-black tracking-tight text-[#031716] md:text-5xl dark:text-[#F4F8F8]">
            My Borrowed Books
          </h1>
          <p className="mt-3 text-sm font-medium text-[#274D60] md:text-base dark:text-[#6BA3BE]">
            Manage your active library loans and return them before the due date.
          </p>
        </div>

        {loading ? (
          <div className="flex min-h-[40vh] items-center justify-center">
            <div className="flex flex-col items-center gap-3">
              <div className="size-10 animate-spin rounded-full border-4 border-[#0C969C] border-t-transparent" />
              <p className="text-sm font-bold uppercase tracking-wider text-[#0C969C]">Loading borrowings...</p>
            </div>
          </div>
        ) : borrowings.length === 0 ? (
          <div className="mx-auto max-w-xl rounded-3xl border border-dashed border-[#0C969C]/30 bg-white/60 p-16 text-center backdrop-blur-md dark:border-[#274D60] dark:bg-[#032F30]">
            <BookOpen className="mx-auto mb-4 h-14 w-14 text-[#0C969C]/50" />
            <h2 className="text-xl font-bold text-[#031716] dark:text-[#F4F8F8]">
              No borrowed books
            </h2>
            <p className="mt-2 text-sm text-[#274D60] dark:text-[#6BA3BE]">
              You have not borrowed any books yet. Explore our library to find your next read!
            </p>
            <Link
              href="/books"
              className="mt-6 inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-[#0C969C] to-[#0A7075] px-6 py-3 text-xs font-bold uppercase tracking-wider text-white shadow-lg shadow-[#0C969C]/25 transition-all hover:scale-105"
            >
              <ArrowLeft size={16} />
              Browse Books
            </Link>
          </div>
        ) : (
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {borrowings.map((borrowing) => (
              <div
                key={borrowing._id}
                className="group flex flex-col justify-between overflow-hidden rounded-3xl border border-[#0C969C]/25 bg-white shadow-xl transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl hover:shadow-[#0C969C]/20 dark:border-[#274D60] dark:bg-[#032F30]"
              >
                {/* Book Image */}
                <div className="relative flex h-64 items-center justify-center bg-gradient-to-b from-[#F4F8F8] to-[#CCE0E0]/30 p-6 dark:from-[#031716] dark:to-[#032F30]/80">
                  {borrowing.bookImage ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={borrowing.bookImage}
                      alt={borrowing.bookTitle}
                      className="h-full w-full object-contain drop-shadow-lg transition-transform duration-500 group-hover:scale-105"
                    />
                  ) : (
                    <div className="text-center font-heading text-xl font-black text-[#0C969C]">
                      {borrowing.bookTitle}
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="flex flex-col flex-grow p-6 space-y-4">
                  <div>
                    <h2 className="line-clamp-1 text-lg font-black text-[#031716] dark:text-[#F4F8F8]">
                      {borrowing.bookTitle}
                    </h2>
                    <p className="mt-1 text-xs font-semibold text-[#274D60] dark:text-[#6BA3BE]">
                      By {borrowing.bookAuthor}
                    </p>
                  </div>

                  <div className="space-y-2.5 rounded-2xl border border-[#CCE0E0]/60 bg-[#F4F8F8]/50 p-4 text-xs font-medium text-[#274D60] dark:border-[#274D60] dark:bg-[#031716]/50 dark:text-[#6BA3BE]">
                    <div className="flex items-center justify-between">
                      <span className="flex items-center gap-1.5">
                        <CalendarDays size={14} className="text-[#0C969C]" />
                        Borrow Date:
                      </span>
                      <span className="font-bold text-[#031716] dark:text-[#F4F8F8]">
                        {formatDate(borrowing.borrowDate)}
                      </span>
                    </div>

                    <div className="flex items-center justify-between border-t border-[#CCE0E0]/40 pt-2 dark:border-[#274D60]">
                      <span className="flex items-center gap-1.5">
                        <CalendarDays size={14} className="text-[#0C969C]" />
                        Due Date:
                      </span>
                      <span className="font-black text-[#0C969C] dark:text-[#6BA3BE]">
                        {formatDate(borrowing.dueDate)}
                      </span>
                    </div>
                  </div>

                  {/* Return Button */}
                  <button
                    onClick={() => handleReturn(borrowing._id)}
                    disabled={returningId === borrowing._id}
                    className="w-full rounded-2xl bg-gradient-to-r from-[#0C969C] to-[#0A7075] py-3.5 text-xs font-bold uppercase tracking-wider text-white shadow-md shadow-[#0C969C]/25 transition-all hover:shadow-lg hover:shadow-[#0C969C]/40 active:scale-95 disabled:opacity-50"
                  >
                    {returningId === borrowing._id
                      ? "Returning..."
                      : "Return Book"}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </PrivateRoute>
  );
}