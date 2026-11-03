
"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Search, BookOpen, Loader2 } from "lucide-react";

interface Book {
  _id: string;
  title: string;
  author: string;
  category: string;
  description: string;
  imageUrl: string;
  totalCopies: number;
  copies?: number;
  availableCopies?: number;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export default function AllBooksPage() {
  const [books, setBooks] = useState<Book[]>([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const res = await fetch(`${API_URL}/books`, {
          cache: "no-store",
        });

        if (!res.ok) {
          throw new Error("Failed to load books");
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

  const categories = [
    "All",
    ...Array.from(new Set(books.map((book) => book.category))),
  ];

  const filteredBooks = books.filter((book) => {
    const matchesSearch =
      book.title.toLowerCase().includes(search.toLowerCase()) ||
      book.author.toLowerCase().includes(search.toLowerCase());

    const matchesCategory =
      category === "All" || book.category === category;

    return matchesSearch && matchesCategory;
  });

  return (
    <main className="min-h-screen bg-[#F4F8F8] px-4 py-12 dark:bg-[#031716] md:px-8">
      <div className="mx-auto max-w-7xl">

        <div className="mb-10 text-center">
          <p className="mb-2 text-sm font-bold uppercase tracking-widest text-[#0C969C]">
            Explore Our Collection
          </p>

          <h1 className="text-4xl font-black text-[#031716] dark:text-white">
            All Books
          </h1>

          <p className="mt-3 text-[#274D60] dark:text-[#A7C5CC]">
            Discover and explore all books available in BookNook.
          </p>
        </div>

        {/* Search */}
        <div className="mb-6 flex justify-center">
          <div className="relative w-full max-w-xl">
            <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-[#0C969C]" />

            <input
              type="text"
              placeholder="Search by book title or author..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="h-12 w-full rounded-xl border border-[#0C969C]/20 bg-white pl-12 pr-4 text-sm outline-none focus:border-[#0C969C] dark:bg-[#032F30] dark:text-white"
            />
          </div>
        </div>

        {/* Categories */}
        <div className="mb-10 flex flex-wrap justify-center gap-2">
          {categories.map((item) => (
            <button
              key={item}
              onClick={() => setCategory(item)}
              className={`rounded-full px-5 py-2 text-sm font-semibold transition ${
                category === item
                  ? "bg-[#0C969C] text-white"
                  : "border border-[#0C969C]/30 bg-white text-[#274D60] hover:bg-[#0C969C]/10 dark:bg-[#032F30] dark:text-white"
              }`}
            >
              {item}
            </button>
          ))}
        </div>

        {/* Loading */}
        {loading ? (
          <div className="flex min-h-60 items-center justify-center">
            <Loader2 className="h-10 w-10 animate-spin text-[#0C969C]" />
          </div>
        ) : filteredBooks.length === 0 ? (
          <div className="rounded-3xl bg-white py-16 text-center dark:bg-[#032F30]">
            <BookOpen className="mx-auto mb-4 h-12 w-12 text-[#0C969C]" />
            <h2 className="text-xl font-bold text-[#031716] dark:text-white">
              No Books Found
            </h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Try another search or category.
            </p>
          </div>
        ) : (
          <>
            <p className="mb-5 text-sm font-semibold text-[#274D60] dark:text-[#A7C5CC]">
              Showing {filteredBooks.length} books
            </p>

            <div className="grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
              {filteredBooks.map((book) => (
                <Link
                  href={`/books/${book._id}`}
                  key={book._id}
                  className="group overflow-hidden rounded-2xl border border-[#0C969C]/15 bg-white shadow-sm transition hover:-translate-y-2 hover:shadow-xl dark:border-[#274D60] dark:bg-[#032F30]"
                >
                  <div className="relative h-52 bg-[#0C969C]/5 p-3 sm:h-64">
                    <Image
                      src={book.imageUrl}
                      alt={book.title}
                      fill
                      unoptimized
                      sizes="(max-width: 640px) 50vw, 25vw"
                      className="object-contain p-3 transition duration-300 group-hover:scale-105"
                    />
                  </div>

                  <div className="p-4">
                    <p className="mb-2 text-xs font-bold text-[#0C969C]">
                      {book.category}
                    </p>

                    <h2 className="line-clamp-2 font-bold text-[#031716] dark:text-white">
                      {book.title}
                    </h2>

                    <p className="mt-2 text-sm text-[#274D60] dark:text-[#A7C5CC]">
                      By {book.author}
                    </p>

                    <div className="mt-4 border-t border-[#0C969C]/15 pt-3 text-sm">
                      <span className="text-muted-foreground">
                        Available:{" "}
                      </span>
                      <span className="font-bold text-[#0C969C]">
                        {book.copies ?? book.availableCopies ?? book.totalCopies}
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </>
        )}
      </div>
    </main>
  );
}
