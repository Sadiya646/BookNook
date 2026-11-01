
"use client";

import { useEffect, useState } from "react";

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

export default function BooksPage() {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/books`
        );

        if (!res.ok) {
          throw new Error("Failed to fetch books");
        }

        const data = await res.json();
        setBooks(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchBooks();
  }, []);

  if (loading) {
    return <p className="p-8">Loading books...</p>;
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <h1 className="mb-6 text-3xl font-bold">
        All Books
      </h1>

      {books.length === 0 ? (
        <p>No books found.</p>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {books.map((book) => (
            <div
              key={book._id}
              className="rounded-xl bg-white p-5 shadow"
            >
              {book.image && (
                <img
                  src={book.image}
                  alt={book.title}
                  className="mb-4 h-48 w-full rounded-lg object-cover"
                />
              )}

              <h2 className="text-xl font-bold">
                {book.title}
              </h2>

              <p className="mt-1 text-gray-600">
                Author: {book.author}
              </p>

              <p className="mt-2">
                Category: {book.category}
              </p>

              <p>
                Total Copies: {book.totalCopies}
              </p>

              <p>
                Available Copies: {book.availableCopies}
              </p>

              <p className="mt-3 text-sm text-gray-600">
                {book.description}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
