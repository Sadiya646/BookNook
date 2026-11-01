"use client";

import { useState } from "react";
import { toast } from "sonner";
import type { Book } from "@/types";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

type Props = {
  book: Book;
};

export default function BorrowButton({ book }: Props) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const dueDate = new Date();
  dueDate.setDate(dueDate.getDate() + 7);

  const formattedDueDate = dueDate.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

  async function handleBorrow(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (!name.trim() || !email.trim()) {
      toast.error("Please fill in all fields");
      return;
    }

    try {
      setLoading(true);

      const res = await fetch(`${API_URL}/borrow`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          bookId: book._id,
          borrowerName: name,
          borrowerEmail: email,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to borrow book");
      }

      localStorage.setItem("borrowerName", name.trim());
      localStorage.setItem("borrowerEmail", email.trim().toLowerCase());

      toast.success("Book borrowed successfully!");

      setOpen(false);
      setName("");
      setEmail("");
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Something went wrong"
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      {/* Trigger Button */}
      <button
        onClick={() => setOpen(true)}
        disabled={book.copies < 1}
        className="w-full rounded-xl bg-gradient-to-r from-[#0C969C] to-[#0A7075] px-6 py-3.5 font-bold uppercase tracking-wider text-white shadow-md shadow-[#0C969C]/25 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-[#0C969C]/40 active:scale-95 disabled:cursor-not-allowed disabled:bg-none disabled:bg-[#274D60]/40 disabled:text-[#6BA3BE]/50 disabled:shadow-none"
      >
        {book.copies < 1 ? "Currently Unavailable" : "Borrow This Book"}
      </button>

      {/* Modal Overlay */}
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#031716]/60 p-4 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-md rounded-2xl border border-[#0C969C]/20 bg-[#F4F8F8] p-7 shadow-2xl dark:border-[#274D60] dark:bg-[#032F30]">
            
            <h2 className="text-2xl font-black text-[#031716] dark:text-[#F4F8F8]">
              Confirm Borrow
            </h2>

            <p className="mt-2 text-sm text-[#274D60] dark:text-[#6BA3BE]">
              You are borrowing{" "}
              <strong className="text-[#031716] dark:text-[#F4F8F8]">{book.title}</strong>.
            </p>

            <div className="mt-3 inline-flex items-center gap-2 rounded-xl border border-[#0C969C]/20 bg-[#0C969C]/10 px-3.5 py-2 text-xs font-semibold text-[#0A7075] dark:border-[#6BA3BE]/30 dark:bg-[#031716]/40 dark:text-[#6BA3BE]">
              <span>Return it by:</span>
              <strong className="text-[#031716] dark:text-[#F4F8F8]">{formattedDueDate}</strong>
            </div>

            <form onSubmit={handleBorrow} className="mt-6 space-y-4">
              <div>
                <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-[#274D60] dark:text-[#6BA3BE]">
                  Name
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter your name"
                  required
                  className="w-full rounded-xl border border-[#CCE0E0] bg-white px-4 py-3 text-sm text-[#031716] outline-none transition-all focus:border-[#0C969C] focus:ring-2 focus:ring-[#0C969C]/20 dark:border-[#274D60] dark:bg-[#031716] dark:text-[#F4F8F8]"
                />
              </div>

              <div>
                <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-[#274D60] dark:text-[#6BA3BE]">
                  Email
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  required
                  className="w-full rounded-xl border border-[#CCE0E0] bg-white px-4 py-3 text-sm text-[#031716] outline-none transition-all focus:border-[#0C969C] focus:ring-2 focus:ring-[#0C969C]/20 dark:border-[#274D60] dark:bg-[#031716] dark:text-[#F4F8F8]"
                />
              </div>

              <div className="flex gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="w-full rounded-xl border border-[#CCE0E0] bg-white px-4 py-3 text-xs font-bold uppercase tracking-wider text-[#274D60] transition-all hover:bg-[#E6EEEE] dark:border-[#274D60] dark:bg-[#031716] dark:text-[#6BA3BE] dark:hover:bg-[#0A7075]/20"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={loading || book.copies < 1}
                  className="w-full rounded-xl bg-gradient-to-r from-[#0C969C] to-[#0A7075] px-4 py-3 text-xs font-bold uppercase tracking-wider text-white shadow-md shadow-[#0C969C]/20 transition-all hover:shadow-lg hover:shadow-[#0C969C]/40 disabled:opacity-50"
                >
                  {loading ? "Processing..." : "Confirm Borrow"}
                </button>
              </div>
            </form>

          </div>
        </div>
      )}
    </>
  );
}