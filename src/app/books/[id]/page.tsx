import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import {
  ArrowLeft,
  CalendarDays,
  Mail,
  User,
  BookOpen,
  Layers,
  Hash,
} from "lucide-react";

import type { Book } from "../../../types";
import PrivateRoute from "@/components/ui/PrivateRoute";
import BorrowButton from "@/components/books/BorrowButton";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

type Props = {
  params: { id: string };
};

async function getBook(id: string): Promise<Book | null> {
  if (!API_URL) {
    throw new Error("API URL is not configured");
  }

  const res = await fetch(`${API_URL}/books/${id}`, {
    cache: "no-store",
  });

  if (res.status === 404 || res.status === 400) {
    return null;
  }

  if (!res.ok) {
    throw new Error("Failed to fetch book details");
  }

  return res.json();
}

function formatDate(date: string) {
  return new Date(date).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

// ১. মূল পেজ কম্পোনেন্ট (Suspense দিয়ে মোড়ানো)
export default function BookDetailsPage({ params }: Props) {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-[60vh] items-center justify-center text-lg font-medium text-[#0C969C]">
          Loading book details...
        </div>
      }
    >
      <BookContent id={params.id} />
    </Suspense>
  );
}

// ২. আসল ডেটা ও ইউআই রেন্ডার করার সাব-কম্পোনেন্ট
async function BookContent({ id }: { id: string }) {
  const book = await getBook(id);

  if (!book) {
    notFound();
  }

  const soldOut = book.copies < 1;

  return (
    <PrivateRoute>
      <div className="mx-auto max-w-6xl px-6 py-12">

        {/* Back Link */}
        <Link
          href="/books"
          className="group mb-8 inline-flex items-center gap-2.5 text-xs font-bold uppercase tracking-wider text-[#274D60] transition-colors hover:text-[#0C969C] dark:text-[#6BA3BE]"
        >
          <ArrowLeft className="size-4 transition-transform group-hover:-translate-x-1" />
          Back to All Books
        </Link>

        <div className="grid gap-12 rounded-3xl border border-[#0C969C]/25 bg-[#F4F8F8] p-8 shadow-2xl backdrop-blur-xl dark:border-[#274D60]/50 dark:bg-[#032F30] md:grid-cols-2 md:p-12">

          {/* Cover Image */}
          <div className="relative flex items-center justify-center overflow-hidden rounded-2xl border border-[#0C969C]/20 bg-white/60 p-8 shadow-inner backdrop-blur-md dark:border-[#274D60] dark:bg-[#031716]/60">
            {book.imageUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={book.imageUrl}
                alt={book.title}
                className="max-h-[420px] w-full rounded-xl object-contain drop-shadow-xl transition-transform duration-500 hover:scale-105"
              />
            ) : (
              <div className="flex aspect-3/4 w-full items-center justify-center rounded-xl bg-gradient-to-br from-[#0C969C]/10 to-[#032F30]/20 p-8 text-center font-heading text-3xl font-black text-[#0C969C]">
                {book.title}
              </div>
            )}
          </div>

          {/* Book Information */}
          <div className="flex flex-col justify-center space-y-6">
            <div className="space-y-4">

              {/* Category */}
              <span className="inline-flex items-center gap-1.5 rounded-full border border-[#0C969C]/30 bg-[#0C969C]/10 px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-[#0A7075] dark:border-[#6BA3BE]/30 dark:bg-[#031716]/50 dark:text-[#6BA3BE]">
                <Layers className="size-3.5" />
                {book.category}
              </span>

              {/* Title */}
              <h1 className="text-3xl font-black tracking-tight text-[#031716] md:text-4xl dark:text-[#F4F8F8]">
                {book.title}
              </h1>

              {/* Author */}
              <p className="text-lg font-semibold text-[#274D60] dark:text-[#6BA3BE]">
                By{" "}
                <span className="text-[#031716] dark:text-[#F4F8F8]">
                  {book.author}
                </span>
              </p>
            </div>

            {/* Description */}
            <p className="text-sm leading-relaxed text-[#274D60] dark:text-[#6BA3BE]/90 md:text-base">
              {book.description}
            </p>

            {/* Contributor Details */}
            <div className="rounded-2xl border border-[#0C969C]/20 bg-white/70 p-5 backdrop-blur-sm dark:border-[#274D60] dark:bg-[#031716]/60">
              <p className="mb-3 text-xs font-bold uppercase tracking-widest text-[#0C969C]">
                Contributor Details
              </p>

              <ul className="space-y-2.5 text-sm font-medium text-[#274D60] dark:text-[#6BA3BE]">
                <li className="flex items-center gap-3">
                  <User className="size-4 text-[#0C969C]" />
                  <span className="text-[#031716] dark:text-[#F4F8F8]">
                    {book.userName}
                  </span>
                </li>

                <li className="flex items-center gap-3">
                  <Mail className="size-4 text-[#0C969C]" />
                  <span>{book.userEmail}</span>
                </li>

                {book.createdAt && (
                  <li className="flex items-center gap-3">
                    <CalendarDays className="size-4 text-[#0C969C]" />
                    <span>{formatDate(book.createdAt)}</span>
                  </li>
                )}
              </ul>
            </div>

            {/* Copies Information */}
            <div className="grid grid-cols-2 gap-4 rounded-2xl border border-[#0C969C]/20 bg-[#032F30]/5 p-4 dark:border-[#274D60] dark:bg-[#032F30]/40">

              <div className="flex items-center gap-3">
                <div className="flex size-10 items-center justify-center rounded-xl bg-[#0C969C]/10 text-[#0C969C]">
                  <BookOpen className="size-5" />
                </div>

                <div>
                  <p className="text-[11px] font-bold uppercase tracking-wider text-[#274D60] dark:text-[#6BA3BE]">
                    Total Copies
                  </p>
                  <p className="text-lg font-black text-[#050a0a] dark:text-[#F4F8F8]">
                    {book.totalCopies}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="flex size-10 items-center justify-center rounded-xl bg-[#0C969C]/10 text-[#0C969C]">
                  <Hash className="size-5" />
                </div>

                <div>
                  <p className="text-[11px] font-bold uppercase tracking-wider text-[#274D60] dark:text-[#6BA3BE]">
                    Available
                  </p>

                  <p
                    className={`text-lg font-black ${
                      soldOut ? "text-red-500" : "text-[#0C969C]"
                    }`}
                  >
                    {book.copies}
                  </p>
                </div>
              </div>
            </div>

            {/* Borrow Button */}
            <div className="pt-2">
              <BorrowButton book={book} />
            </div>

          </div>
        </div>
      </div>
    </PrivateRoute>
  );
}