
"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";

import {
  BookOpen,
  CalendarDays,
  Clock,
  RotateCcw,
  Loader2,
  Library,
  AlertCircle,
} from "lucide-react";

import { toast } from "sonner";

import { authClient } from "@/lib/auth-client";
import { getToken } from "@/lib/get-token";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface BorrowedBook {
  _id: string;
  bookId: string;
  bookTitle: string;
  bookAuthor: string;
  bookImage: string;
  borrowDate: string;
  dueDate: string;
  status: string;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export default function MyBorrowsPage() {
  const { data: session, isPending } = authClient.useSession();

  const [borrowedBooks, setBorrowedBooks] = useState<BorrowedBook[]>([]);
  const [loading, setLoading] = useState(true);
  const [returningId, setReturningId] = useState<string | null>(null);
  const [selectedBookId, setSelectedBookId] = useState<string | null>(null);
  const [error, setError] = useState("");

  const user = session?.user;

  // Fetch borrowed books
  const fetchBorrowedBooks = useCallback(async () => {
    if (isPending) return;

    if (!user) {
      setBorrowedBooks([]);
      setLoading(false);
      setError("Please login to view your borrowed books.");
      return;
    }

    try {
      setLoading(true);
      setError("");

      if (!API_URL) {
        throw new Error("API URL is not configured.");
      }

      const token = await getToken();

      const response = await fetch(`${API_URL}/borrows`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        cache: "no-store",
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to load borrowed books.");
      }

      setBorrowedBooks(
        Array.isArray(data) ? data : data.borrowings || []
      );
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Something went wrong.";

      setError(message);
    } finally {
      setLoading(false);
    }
  }, [user, isPending]);

  useEffect(() => {
    if (isPending) return;

    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchBorrowedBooks();
  }, [fetchBorrowedBooks, isPending]);

  // Return book
  const handleReturn = async () => {
    if (!selectedBookId) return;

    const id = selectedBookId;

    try {
      setReturningId(id);

      if (!API_URL) {
        throw new Error("API URL is not configured.");
      }

      const token = await getToken();

      const response = await fetch(`${API_URL}/borrows/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to return book.");
      }

      // Remove returned book from the current list
      setBorrowedBooks((previous) =>
        previous.filter((book) => book._id !== id)
      );

      setSelectedBookId(null);

      toast.success("Book returned successfully!");
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Something went wrong."
      );
    } finally {
      setReturningId(null);
    }
  };

  // Format date
  const formatDate = (date: string) => {
    if (!date) return "Not available";

    return new Date(date).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  // Loading
  if (isPending || loading) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 pt-28">
        <Loader2 className="h-10 w-10 animate-spin text-[#0C969C]" />

        <p className="text-sm text-[#537579]">
          Loading your borrowed books...
        </p>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-[#F4F8F8] px-4 pt-28 pb-12 dark:bg-[#031716] sm:px-6 lg:px-8 md:pt-32">
      <div className="mx-auto max-w-7xl">

        {/* Header */}
        <div className="mb-10 flex flex-col justify-between gap-5 sm:flex-row sm:items-center">
          <div>
            <div className="mb-3 flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.2em] text-[#0C969C]">
              <Library size={18} />
              Your Reading Collection
            </div>

            <h1 className="text-3xl font-black tracking-tight text-[#031716] dark:text-[#F4F8F8] sm:text-4xl">
              My <span className="text-[#0C969C]">Borrows</span>
            </h1>

            <p className="mt-3 max-w-xl text-sm leading-7 text-[#537579] dark:text-[#A7C5C5]">
              Keep track of the books you have borrowed and return them on time.
            </p>
          </div>

          <Link
            href="/books"
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#0C969C] px-6 py-3 text-sm font-bold text-white shadow-lg shadow-[#0C969C]/20 transition hover:bg-[#087A80]"
          >
            <BookOpen size={18} />
            Explore Books
          </Link>
        </div>

        {/* Stats */}
        <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="rounded-2xl border border-[#0C969C]/15 bg-white p-5 shadow-sm dark:bg-[#032F30]">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-[#537579] dark:text-[#A7C5C5]">
                  Currently Borrowed
                </p>

                <h2 className="mt-2 text-3xl font-black text-[#031716] dark:text-white">
                  {borrowedBooks.length}
                </h2>
              </div>

              <div className="flex size-12 items-center justify-center rounded-xl bg-[#0C969C]/10 text-[#0C969C]">
                <BookOpen size={24} />
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-[#0C969C]/15 bg-white p-5 shadow-sm dark:bg-[#032F30]">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-[#537579] dark:text-[#A7C5C5]">
                  Active Borrowing
                </p>

                <h2 className="mt-2 text-3xl font-black text-[#031716] dark:text-white">
                  {borrowedBooks.length}
                </h2>
              </div>

              <div className="flex size-12 items-center justify-center rounded-xl bg-[#0C969C]/10 text-[#0C969C]">
                <Library size={24} />
              </div>
            </div>
          </div>
        </div>

        {/* Error */}
        {error && (
          <div className="rounded-2xl border border-red-200 bg-red-50 p-8 text-center dark:border-red-900 dark:bg-red-950/20">
            <AlertCircle className="mx-auto mb-3 h-10 w-10 text-red-500" />

            <h3 className="text-lg font-bold text-red-600">
              Unable to load borrowed books
            </h3>

            <p className="mt-2 text-sm text-red-500">{error}</p>

            <button
              onClick={fetchBorrowedBooks}
              className="mt-5 rounded-xl bg-[#0C969C] px-6 py-3 text-sm font-bold text-white transition hover:bg-[#087A80]"
            >
              Try Again
            </button>
          </div>
        )}

        {/* Empty State */}
        {!error && borrowedBooks.length === 0 && (
          <div className="rounded-3xl border border-dashed border-[#0C969C]/30 bg-white px-6 py-16 text-center dark:bg-[#032F30]">
            <div className="mx-auto mb-5 flex size-20 items-center justify-center rounded-full bg-[#0C969C]/10 text-[#0C969C]">
              <BookOpen size={36} />
            </div>

            <h2 className="text-2xl font-bold text-[#031716] dark:text-white">
              No Borrowed Books Yet
            </h2>

            <p className="mx-auto mt-3 max-w-md text-sm leading-7 text-[#537579] dark:text-[#A7C5C5]">
              You haven&apos;t borrowed any books yet. Explore our collection and
              find something interesting to read.
            </p>

            <Link
              href="/books"
              className="mt-7 inline-flex items-center gap-2 rounded-xl bg-[#0C969C] px-7 py-3 font-bold text-white transition hover:bg-[#087A80]"
            >
              <BookOpen size={18} />
              Browse Books
            </Link>
          </div>
        )}

        {/* Borrowed Books */}
        {!error && borrowedBooks.length > 0 && (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
            {borrowedBooks.map((book) => (
              <div
                key={book._id}
                className="group overflow-hidden rounded-2xl border border-[#0C969C]/15 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-[#0C969C]/10 dark:bg-[#032F30]"
              >
                {/* Book Image */}
                <div className="relative h-64 overflow-hidden bg-[#E4EEEE] dark:bg-[#031716]">
                  {book.bookImage ? (
                    <Image
                      src={book.bookImage}
                      alt={book.bookTitle || "Book cover"}
                      fill
                      unoptimized
                      sizes="(max-width: 768px) 100vw, 400px"
                      className="object-contain p-4 transition duration-500 group-hover:scale-105"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center text-[#0C969C]">
                      <BookOpen size={60} />
                    </div>
                  )}

                  <span className="absolute right-4 top-4 rounded-full bg-[#0C969C] px-4 py-1.5 text-xs font-bold text-white shadow-lg">
                    Borrowed
                  </span>
                </div>

                {/* Book Details */}
                <div className="p-6">
                  <h2 className="line-clamp-1 text-xl font-bold text-[#031716] dark:text-white">
                    {book.bookTitle}
                  </h2>

                  <p className="mt-2 text-sm text-[#537579] dark:text-[#A7C5C5]">
                    By {book.bookAuthor}
                  </p>

                  <div className="my-5 space-y-3 border-y border-[#0C969C]/10 py-5">
                    <div className="flex items-center justify-between gap-3 text-sm">
                      <span className="flex items-center gap-2 text-[#537579] dark:text-[#A7C5C5]">
                        <CalendarDays size={17} className="text-[#0C969C]" />
                        Borrow Date
                      </span>

                      <span className="font-semibold text-[#031716] dark:text-white">
                        {formatDate(book.borrowDate)}
                      </span>
                    </div>

                    <div className="flex items-center justify-between gap-3 text-sm">
                      <span className="flex items-center gap-2 text-[#537579] dark:text-[#A7C5C5]">
                        <Clock size={17} className="text-[#0C969C]" />
                        Due Date
                      </span>

                      <span className="font-semibold text-[#031716] dark:text-white">
                        {formatDate(book.dueDate)}
                      </span>
                    </div>
                  </div>

                  {/* Return Button */}
                  <button
                    type="button"
                    onClick={() => setSelectedBookId(book._id)}
                    disabled={returningId === book._id}
                    className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#0C969C] px-5 py-3.5 text-sm font-bold text-white shadow-lg shadow-[#0C969C]/20 transition hover:bg-[#087A80] disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    <RotateCcw size={18} />
                    Return Book
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Return Confirmation Dialog */}
        <AlertDialog
          open={!!selectedBookId}
          onOpenChange={(open) => {
            if (!open && !returningId) {
              setSelectedBookId(null);
            }
          }}
        >
          <AlertDialogContent className="bg-white border border-[#0C969C]/20 dark:bg-[#032F30] dark:border-[#0C969C]/30 text-[#031716] dark:text-[#F4F8F8]">
            <AlertDialogHeader>
              <AlertDialogTitle className="text-xl font-bold text-[#031716] dark:text-white">
                Return Book?
              </AlertDialogTitle>

              <AlertDialogDescription className="text-[#537579] dark:text-[#A7C5C5]">
                Are you sure you want to return this book?
                This action will update your borrowing record and make the book available again.
              </AlertDialogDescription>
            </AlertDialogHeader>

            <AlertDialogFooter>
              <AlertDialogCancel
                disabled={!!returningId}
                className="bg-gray-100 text-[#031716] hover:bg-gray-200 dark:bg-[#031716] dark:text-[#F4F8F8] dark:hover:bg-[#031716]/80"
              >
                Cancel
              </AlertDialogCancel>

              <AlertDialogAction
                onClick={(e) => {
                  e.preventDefault();
                  handleReturn();
                }}
                disabled={!!returningId}
                className="bg-[#0C969C] text-white hover:bg-[#087A80]"
              >
                {returningId ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Returning...
                  </>
                ) : (
                  "Yes, Return Book"
                )}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

      </div>
    </main>
  );
}
