
"use client";

import { useEffect, useState } from "react";
import { BookOpen, Search, Library } from "lucide-react";

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
  const [searchTerm, setSearchTerm] = useState("");
  const [error, setError] = useState("");

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
        setError("Unable to load books. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchBooks();
  }, []);

  const filteredBooks = books.filter((book) => {
    const search = searchTerm.toLowerCase();

    return (
      book.title.toLowerCase().includes(search) ||
      book.author.toLowerCase().includes(search) ||
      book.category.toLowerCase().includes(search)
    );
  });

  return (
    <main className="min-h-screen bg-gray-50 px-4 py-10 sm:px-8">
      <div className="mx-auto max-w-7xl">

        {/* Header */}
        <div className="mb-8">
          <div className="mb-3 flex items-center gap-2 text-blue-600">
            <Library size={22} />
            <span className="font-semibold">BookNook Library</span>
          </div>

          <h1 className="text-3xl font-bold text-gray-900 sm:text-4xl">
            Explore Our Books
          </h1>

          <p className="mt-2 text-gray-500">
            Discover your next favorite book from our collection.
          </p>
        </div>

        {/* Search */}
        <div className="relative mb-8 max-w-md">
          <Search
            className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
            size={20}
          />

          <input
            type="text"
            placeholder="Search by title, author or category..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full rounded-xl border border-gray-200 bg-white py-3 pl-12 pr-4 outline-none focus:border-blue-500"
          />
        </div>

        {/* Book Count */}
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-800">
            All Books
          </h2>

          <span className="text-sm text-gray-500">
            {filteredBooks.length} Books Found
          </span>
        </div>

        {/* Loading */}
        {loading && (
          <div className="py-20 text-center">
            <p className="text-gray-500">Loading books...</p>
          </div>
        )}

        {/* Error */}
        {!loading && error && (
          <div className="rounded-xl bg-red-50 p-6 text-center text-red-600">
            {error}
          </div>
        )}

        {/* Empty */}
        {!loading && !error && filteredBooks.length === 0 && (
          <div className="rounded-xl bg-white py-20 text-center shadow-sm">
            <BookOpen
              size={45}
              className="mx-auto mb-4 text-gray-300"
            />

            <h3 className="text-xl font-semibold text-gray-700">
              No Books Found
            </h3>

            <p className="mt-2 text-gray-500">
              Try searching with another keyword.
            </p>
          </div>
        )}

        {/* Books Grid */}
        {!loading && !error && filteredBooks.length > 0 && (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filteredBooks.map((book) => (
              <div
                key={book._id}
                className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
              >
                {/* Book Image */}
                <div className="flex h-64 items-center justify-center bg-gray-100 p-4">
                  {book.image ? (
                    <img
                      src={book.image}
                      alt={book.title}
                      className="h-full w-full rounded-lg object-contain"
                      onError={(e) => {
                        e.currentTarget.style.display = "none";
                      }}
                    />
                  ) : (
                    <div className="flex flex-col items-center text-gray-400">
                      <BookOpen size={50} />
                      <span className="mt-2 text-sm">
                        No Image Available
                      </span>
                    </div>
                  )}
                </div>

                {/* Book Details */}
                <div className="p-5">
                  <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-600">
                    {book.category}
                  </span>

                  <h3 className="mt-4 line-clamp-1 text-lg font-bold text-gray-900">
                    {book.title}
                  </h3>

                  <p className="mt-1 text-sm text-gray-500">
                    By {book.author}
                  </p>

                  <p className="mt-3 line-clamp-3 text-sm leading-6 text-gray-600">
                    {book.description}
                  </p>

                  <div className="mt-5 flex items-center justify-between border-t border-gray-100 pt-4">
                    <div>
                      <p className="text-xs text-gray-400">
                        Total Copies
                      </p>
                      <p className="font-semibold text-gray-800">
                        {book.totalCopies}
                      </p>
                    </div>

                    <div className="text-right">
                      <p className="text-xs text-gray-400">
                        Available
                      </p>

                      <p
                        className={`font-semibold ${
                          book.availableCopies > 0
                            ? "text-green-600"
                            : "text-red-500"
                        }`}
                      >
                        {book.availableCopies}
                      </p>
                    </div>
                  </div>

                  <div className="mt-4">
                    {book.availableCopies > 0 ? (
                      <span className="rounded-full bg-green-50 px-3 py-1 text-xs font-medium text-green-700">
                        Available
                      </span>
                    ) : (
                      <span className="rounded-full bg-red-50 px-3 py-1 text-xs font-medium text-red-600">
                        Out of Stock
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
