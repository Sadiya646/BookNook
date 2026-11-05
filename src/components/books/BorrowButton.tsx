
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import type { Book } from "@/types";
import { getToken } from "@/lib/get-token";
import { authClient } from "@/lib/auth-client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type Props = {
  book: Book;
};

export default function BorrowButton({ book }: Props) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formattedDueDate, setFormattedDueDate] = useState("");

  const router = useRouter();

  const { data: session } = authClient.useSession();
  const user = session?.user;

  // Available copies check
  const availableCopies =
    book.copies ?? book.availableCopies ?? 0;

  const notAvailable = availableCopies <= 0;

  // Open borrow modal
  function openModal() {
    if (notAvailable) {
      toast.error("This book is currently unavailable.");
      return;
    }

    if (!user) {
      toast.error("Please login first.");
      return;
    }

    const dueDate = new Date();
    dueDate.setDate(dueDate.getDate() + 7);

    setFormattedDueDate(
      dueDate.toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "long",
        year: "numeric",
      })
    );

    setOpen(true);
  }

  // Confirm borrow
  async function handleBorrow(
    e: React.FormEvent<HTMLFormElement>
  ) {
    e.preventDefault();

    if (!user) {
      toast.error("Please login first.");
      return;
    }

    if (notAvailable) {
      toast.error("This book is currently unavailable.");
      setOpen(false);
      return;
    }

    try {
      setLoading(true);

      const token = await getToken();
      const API_URL = process.env.NEXT_PUBLIC_API_URL;

      if (!API_URL) {
        throw new Error("API URL is not configured.");
      }

      if (!token) {
        throw new Error(
          "Authentication token not found. Please login again."
        );
      }

      // Updated API endpoint: POST /borrows
      const res = await fetch(`${API_URL}/borrows`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          bookId: book._id,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(
          data.message || "Failed to borrow book."
        );
      }

      toast.success("Book borrowed successfully!");

      setOpen(false);
      router.refresh();

    } catch (error) {
      console.error("Borrow error:", error);

      toast.error(
        error instanceof Error
          ? error.message
          : "Something went wrong."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      {/* Borrow Button */}
      <div className="space-y-2">
        <Button
          type="button"
          onClick={openModal}
          disabled={!user || notAvailable}
          className="w-full bg-[#0C969C] text-white hover:bg-[#087b80] disabled:cursor-not-allowed disabled:bg-gray-400 disabled:text-white disabled:opacity-70"
        >
          {notAvailable
            ? "Not Available"
            : "Borrow This Book"}
        </Button>

        {/* Available Copies */}
        <p
          className={`text-center text-sm font-semibold ${
            notAvailable
              ? "text-red-500"
              : "text-[#0C969C]"
          }`}
        >
          {notAvailable
            ? "Currently out of stock"
            : `${availableCopies} ${
                availableCopies === 1 ? "copy" : "copies"
              } available`}
        </p>
      </div>

      {/* Borrow Confirmation Modal */}
      <Dialog
        open={open}
        onOpenChange={(value) => {
          if (!loading) {
            setOpen(value);
          }
        }}
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold">
              Confirm Borrow
            </DialogTitle>

            <DialogDescription>
              Please review your borrowing information.
            </DialogDescription>
          </DialogHeader>

          <form
            onSubmit={handleBorrow}
            className="space-y-4"
          >
            <div className="space-y-2">
              <Label>Book Title</Label>
              <Input value={book.title} readOnly />
            </div>

            <div className="space-y-2">
              <Label>Your Name</Label>
              <Input
                value={user?.name || ""}
                readOnly
              />
            </div>

            <div className="space-y-2">
              <Label>Your Email</Label>
              <Input
                value={user?.email || ""}
                readOnly
              />
            </div>

            <div className="space-y-2">
              <Label>Return Date</Label>
              <Input
                value={formattedDueDate}
                readOnly
              />
            </div>

            <p className="text-sm text-gray-500">
              You are borrowing this book for 7 days.
            </p>

            <DialogFooter className="gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpen(false)}
                disabled={loading}
              >
                Cancel
              </Button>

              <Button
                type="submit"
                disabled={loading || !user || notAvailable}
                className="bg-[#0C969C] text-white hover:bg-[#087b80] disabled:opacity-60"
              >
                {loading
                  ? "Borrowing..."
                  : "Confirm Borrow"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
