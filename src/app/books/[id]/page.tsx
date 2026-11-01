import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ArrowLeft, CalendarDays, Mail, User } from "lucide-react";

import type { Book } from "../../../types";
import PrivateRoute from "@/components/ui/PrivateRoute";
import BorrowButton from "@/components/books/BorrowButton";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

type Props = {
  params: Promise<{ id: string }>;
};

async function getBook(id: string): Promise<Book | null> {
  const res = await fetch(`${API_URL}/books/${id}`, { cache: "no-store" });

  if (res.status === 404 || res.status === 400) return null;
  if (!res.ok) throw new Error("Failed to fetch book details");

  return res.json();
}

function formatDate(date: string) {
  return new Date(date).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const book = await getBook(id);

  return {
    title: book ? `BookNook | ${book.title}` : "BookNook | Book Not Found",
  };
}

export default async function BookDetailsPage({ params }: Props) {
  const { id } = await params;
  const book = await getBook(id);

  if (!book) notFound();

  const soldOut = book.copies < 1;

  return (
    <PrivateRoute>
      <div className="mx-auto max-w-5xl px-6 py-12">
        <Link
          href="/books"
          className="mb-8 inline-flex items-center gap-2 text-sm font-medium text-blue-600 hover:underline"
        >
          <ArrowLeft className="size-4" />
          Back to All Books
        </Link>

        <div className="grid gap-10 rounded-2xl bg-white p-6 shadow-lg md:grid-cols-2">
          {/* Cover Image */}
          <div className="flex items-center justify-center overflow-hidden rounded-xl bg-gray-100 p-6">
            {book.imageUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={book.imageUrl}
                alt={book.title}
                className="max-h-96 w-full object-contain"
              />
            ) : (
              <div className="flex aspect-3/4 w-full items-center justify-center bg-blue-50 p-8 text-center font-heading text-2xl text-blue-600">
                {book.title}
              </div>
            )}
          </div>

          {/* Book Info */}
          <div className="flex flex-col justify-center space-y-6">
            <div className="space-y-3">
              <span className="inline-block rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-600">
                {book.category}
              </span>

              <h1 className="text-3xl font-bold text-gray-900 md:text-4xl">
                {book.title}
              </h1>

              <p className="text-lg text-gray-600">By {book.author}</p>
            </div>

            <p className="leading-7 text-gray-700">{book.description}</p>

            {/* Added by info */}
            <div className="rounded-xl border bg-gray-50 p-4">
              <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-gray-500">
                Added by
              </p>
              <ul className="space-y-2 text-sm text-gray-700">
                <li className="flex items-center gap-2">
                  <User className="size-4 text-blue-600" />
                  <span className="font-medium">{book.userName}</span>
                </li>
                <li className="flex items-center gap-2">
                  <Mail className="size-4 text-blue-600" />
                  <span>{book.userEmail}</span>
                </li>
                {book.createdAt && (
                  <li className="flex items-center gap-2">
                    <CalendarDays className="size-4 text-blue-600" />
                    <span>{formatDate(book.createdAt)}</span>
                  </li>
                )}
              </ul>
            </div>

            {/* Copies Info */}
            <div className="space-y-1 text-sm text-gray-700">
              <p>
                <strong>Total Copies:</strong> {book.totalCopies}
              </p>
              <p>
                <strong>Available Copies:</strong>{" "}
                <span className={soldOut ? "font-bold text-red-600" : "font-bold text-blue-600"}>
                  {book.copies}
                </span>
              </p>
            </div>

            {/* Borrow Button Component */}
            <div className="pt-2">
              <BorrowButton book={book} />
            </div>
          </div>
        </div>
      </div>
    </PrivateRoute>
  );
}