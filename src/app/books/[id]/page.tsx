
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

interface Book {
  _id: string;
  title: string;
  author: string;
  category: string;
  totalCopies: number;
  availableCopies: number;
  description: string;
  image?: string;
}

export default async function BookDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/books/${id}`,
    { cache: "no-store" }
  );

  if (res.status === 404) {
    notFound();
  }

  if (!res.ok) {
    throw new Error("Failed to fetch book details");
  }

  const book: Book = await res.json();

  return (
    <div className="mx-auto max-w-5xl px-6 py-12">
      <Link
        href="/books"
        className="mb-8 inline-block text-blue-600 hover:underline"
      >
        ← Back to Books
      </Link>

      <div className="grid gap-10 rounded-2xl bg-white p-6 shadow-lg md:grid-cols-2">
        <div className="flex items-center justify-center rounded-xl bg-gray-100 p-6">
          {book.image ? (
            <img
              src={book.image}
              alt={book.title}
              className="max-h-96 w-full object-contain"
            />
          ) : (
            <p>No Image Available</p>
          )}
        </div>

        <div className="flex flex-col justify-center">
          <p className="mb-3 text-sm font-semibold text-blue-600">
            {book.category}
          </p>

          <h1 className="mb-3 text-3xl font-bold text-gray-900">
            {book.title}
          </h1>

          <p className="mb-5 text-gray-600">
            By {book.author}
          </p>

          <p className="mb-6 leading-7 text-gray-700">
            {book.description}
          </p>

          <div className="space-y-2 text-gray-700">
            <p>
              <strong>Total Copies:</strong> {book.totalCopies}
            </p>

            <p>
              <strong>Available Copies:</strong>{" "}
              {book.availableCopies}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
