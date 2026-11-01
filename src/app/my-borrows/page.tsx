
"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
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
      <main className="mx-auto min-h-screen max-w-6xl px-6 py-12">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            My Borrows
          </h1>
          <p className="mt-2 text-gray-600">
            Manage your borrowed books and return them on time.
          </p>
        </div>

        {loading ? (
          <p className="py-12 text-center text-gray-500">
            Loading borrowed books...
          </p>
        ) : borrowings.length === 0 ? (
          <div className="rounded-xl border border-dashed p-12 text-center">
            <h2 className="text-xl font-semibold text-gray-800">
              No borrowed books
            </h2>
            <p className="mt-2 text-gray-500">
              You have not borrowed any books yet.
            </p>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {borrowings.map((borrowing) => (
              <div
                key={borrowing._id}
                className="overflow-hidden rounded-xl border bg-white shadow-sm"
              >
                <div className="flex h-56 items-center justify-center bg-gray-100 p-4">
                  {borrowing.bookImage ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={borrowing.bookImage}
                      alt={borrowing.bookTitle}
                      className="h-full max-w-full object-contain"
                    />
                  ) : (
                    <p className="text-center text-xl font-semibold text-blue-600">
                      {borrowing.bookTitle}
                    </p>
                  )}
                </div>

                <div className="space-y-3 p-5">
                  <h2 className="text-xl font-bold text-gray-900">
                    {borrowing.bookTitle}
                  </h2>

                  <p className="text-sm text-gray-600">
                    By {borrowing.bookAuthor}
                  </p>

                  <div className="space-y-2 border-t pt-3 text-sm text-gray-600">
                    <p>
                      <strong>Borrow Date:</strong>{" "}
                      {formatDate(borrowing.borrowDate)}
                    </p>

                    <p>
                      <strong>Due Date:</strong>{" "}
                      <span className="font-semibold text-blue-600">
                        {formatDate(borrowing.dueDate)}
                      </span>
                    </p>
                  </div>

                  <button
                    onClick={() => handleReturn(borrowing._id)}
                    disabled={returningId === borrowing._id}
                    className="w-full rounded-lg bg-green-600 px-4 py-3 font-semibold text-white transition hover:bg-green-700 disabled:opacity-50"
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
