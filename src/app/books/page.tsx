"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Search, BookOpen, Layers } from "lucide-react";

interface Book {
  _id: string;
  title: string;
  author: string;
  category: string;
  totalCopies: number;
  availableCopies: number;
  description: string;
  imageUrl?: string;
}

export default function BooksPage() {
  const [books, setBooks] = useState<Book[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
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
        setError(
          error instanceof Error
            ? error.message
            : "Something went wrong"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchBooks();
  }, []);

  const filteredBooks = books.filter((book) => {
    const searchText = search.toLowerCase();

    return (
      book.title.toLowerCase().includes(searchText) ||
      book.author.toLowerCase().includes(searchText) ||
      book.category.toLowerCase().includes(searchText)
    );
  });

  if (loading) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center bg-[#F4F8F8] dark:bg-[#031716]">
        <div className="flex flex-col items-center gap-3">
          <div className="size-10 animate-spin rounded-full border-4 border-[#0C969C] border-t-transparent" />
          <p className="text-sm font-bold uppercase tracking-wider text-[#0C969C]">Loading books...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center bg-[#F4F8F8] px-4 dark:bg-[#031716]">
        <div className="rounded-2xl border border-red-500/30 bg-red-500/10 p-6 text-center">
          <p className="text-sm font-semibold text-red-500">{error}</p>
        </div>
      </div>
    );
  }

  return (
    /* pt-32 ba pt-36 add kora holo jate nav-er sathe content overlap na kore */
    <main className="min-h-screen bg-[#F4F8F8] px-6 pt-32 pb-12 dark:bg-[#031716]">
      <div className="mx-auto max-w-7xl">

        {/* Header */}
        <div className="mb-12 text-center">
          <div className="mx-auto mb-4 flex size-16 items-center justify-center rounded-2xl bg-gradient-to-br from-[#0C969C] to-[#032F30] text-white shadow-xl shadow-[#0C969C]/30">
            <BookOpen className="h-8 w-8 text-white" />
          </div>

          <h1 className="text-3xl font-black tracking-tight text-[#031716] md:text-5xl dark:text-[#F4F8F8]">
            Explore Our Library
          </h1>

          <p className="mt-3 text-sm font-medium text-[#274D60] md:text-base dark:text-[#6BA3BE]">
            Discover your next favorite book from our luxury curated collection.
          </p>
        </div>

        {/* Search Bar */}
        <div className="mx-auto mb-10 max-w-xl">
          <div className="relative flex items-center">
            <Search className="absolute left-4 h-5 w-5 text-[#0C969C] pointer-events-none" />

            <input
              type="text"
              placeholder="Search by title, author or category..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="h-14 w-full rounded-2xl border border-[#CCE0E0] bg-white pl-12 pr-4 text-sm text-[#031716] shadow-md outline-none transition-all focus:border-[#0C969C] focus:ring-2 focus:ring-[#0C969C]/20 dark:border-[#274D60] dark:bg-[#032F30] dark:text-[#F4F8F8]"
            />
          </div>
        </div>

        {/* Book Count */}
        <div className="mb-6 flex items-center justify-between">
          <p className="text-xs font-bold uppercase tracking-wider text-[#274D60] dark:text-[#6BA3BE]">
            Showing <span className="text-[#031716] dark:text-[#F4F8F8]">{filteredBooks.length}</span> Books
          </p>
        </div>

        {/* Books Grid */}
        {filteredBooks.length === 0 ? (
          <div className="rounded-3xl border border-[#0C969C]/20 bg-white/70 py-20 text-center shadow-xl backdrop-blur-md dark:border-[#274D60] dark:bg-[#032F30]">
            <BookOpen className="mx-auto mb-4 h-14 w-14 text-[#0C969C]/50" />
            <h2 className="text-xl font-bold text-[#031716] dark:text-[#F4F8F8]">
              No Books Found
            </h2>
            <p className="mt-2 text-sm text-[#274D60] dark:text-[#6BA3BE]">
              Try searching with another title, author, or category.
            </p>
          </div>
        ) : (
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filteredBooks.map((book) => (
              <div
                key={book._id}
                className="group flex flex-col justify-between overflow-hidden rounded-3xl border border-[#0C969C]/25 bg-white shadow-xl transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl hover:shadow-[#0C969C]/20 dark:border-[#274D60] dark:bg-[#032F30]"
              >
                {/* Book Image Container */}
                <div className="relative flex h-72 items-center justify-center bg-gradient-to-b from-[#F4F8F8] to-[#CCE0E0]/30 p-6 dark:from-[#031716] dark:to-[#032F30]/80">
                  {book.imageUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={book.imageUrl}
                      alt={book.title}
                      className="h-full w-full object-contain drop-shadow-lg transition-transform duration-500 group-hover:scale-105"
                      onError={(e) => {
                        e.currentTarget.style.display = "none";
                      }}
                    />
                  ) : (
                    <BookOpen className="h-16 w-16 text-[#0C969C]/40" />
                  )}
                </div>

                {/* Book Information */}
                <div className="flex flex-col flex-grow p-6">
                  
                  {/* Category Badge */}
                  <span className="inline-flex w-fit items-center gap-1.5 rounded-full border border-[#0C969C]/30 bg-[#0C969C]/10 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-[#0A7075] dark:border-[#6BA3BE]/30 dark:bg-[#031716]/60 dark:text-[#6BA3BE]">
                    <Layers className="size-3" />
                    {book.category}
                  </span>

                  <h2 className="mt-3.5 line-clamp-1 text-lg font-black text-[#031716] dark:text-[#F4F8F8]">
                    {book.title}
                  </h2>

                  <p className="mt-1 text-xs font-semibold text-[#274D60] dark:text-[#6BA3BE]">
                    By {book.author}
                  </p>

                  <div className="mt-4 flex items-center justify-between border-t border-[#CCE0E0]/50 pt-4 text-xs font-medium text-[#274D60] dark:border-[#274D60] dark:text-[#6BA3BE]">
                    <span>Available Copies:</span>
                    <span className="font-black text-[#0C969C] dark:text-[#6BA3BE]">
                      {book.availableCopies ?? book.totalCopies}
                    </span>
                  </div>

                  {/* View Details Button */}
                  <Link
                    href={`/books/${book._id}`}
                    className="mt-6 block w-full rounded-2xl bg-gradient-to-r from-[#0C969C] to-[#0A7075] py-3 text-center text-xs font-bold uppercase tracking-wider text-white shadow-md shadow-[#0C969C]/25 transition-all hover:shadow-lg hover:shadow-[#0C969C]/40 active:scale-95"
                  >
                    View Details
                  </Link>

                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}