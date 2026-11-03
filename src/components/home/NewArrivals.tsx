
"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, BookOpen, Loader2 } from "lucide-react";

interface Book {
  _id: string;
  title: string;
  author: string;
  category: string;
  imageUrl: string;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export default function NewArrivals() {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNewArrivals = async () => {
      try {
        const res = await fetch(`${API_URL}/books`, {
          cache: "no-store",
        });

        if (!res.ok) {
          throw new Error("Failed to fetch books");
        }

        const data: Book[] = await res.json();

        // Backend already sorts newest books first.
        setBooks(data.slice(0, 6));
      } catch (error) {
        console.error("New Arrivals Error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchNewArrivals();
  }, []);

  return (
    <section className="bg-[#F4F8F8] px-4 py-16 dark:bg-[#031716] md:px-8">
      <div className="mx-auto max-w-7xl">

        {/* Section Header */}
        <div className="mb-10 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <p className="mb-2 text-sm font-bold uppercase tracking-widest text-[#0C969C]">
              Fresh From Our Library
            </p>

            <h2 className="text-3xl font-black text-[#031716] dark:text-[#F4F8F8] md:text-4xl">
              New Arrivals
            </h2>

            <p className="mt-3 text-sm text-[#274D60] dark:text-[#A7C5CC]">
              Explore the latest books added to BookNook.
            </p>
          </div>

          <Link
            href="/all-books"
            className="inline-flex items-center gap-2 font-bold text-[#0C969C] transition hover:gap-3"
          >
            See All Books
            <ArrowRight size={18} />
          </Link>
        </div>

        {/* Loading */}
        {loading ? (
          <div className="flex min-h-48 items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-[#0C969C]" />
          </div>
        ) : books.length === 0 ? (
          <div className="rounded-2xl bg-white py-16 text-center dark:bg-[#032F30]">
            <BookOpen className="mx-auto mb-3 h-10 w-10 text-[#0C969C]" />
            <p className="text-[#274D60] dark:text-[#A7C5CC]">
              No books available yet.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-6">
            {books.map((book) => (
              <Link
                href={`/books/${book._id}`}
                key={book._id}
                className="group overflow-hidden rounded-2xl border border-[#0C969C]/15 bg-white shadow-sm transition duration-300 hover:-translate-y-2 hover:shadow-xl dark:border-[#274D60] dark:bg-[#032F30]"
              >
                <div className="relative h-48 bg-[#0C969C]/5 p-3 sm:h-60">
                  <Image
                    src={book.imageUrl}
                    alt={book.title}
                    fill
                    unoptimized
                    sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 16vw"
                    className="object-contain p-3 transition duration-300 group-hover:scale-105"
                  />

                  <span className="absolute left-3 top-3 rounded-full bg-[#0C969C] px-2.5 py-1 text-[10px] font-bold text-white">
                    NEW
                  </span>
                </div>

                <div className="p-4">
                  <p className="mb-2 text-xs font-semibold text-[#0C969C]">
                    {book.category}
                  </p>

                  <h3 className="line-clamp-2 font-bold text-[#031716] dark:text-white">
                    {book.title}
                  </h3>

                  <p className="mt-2 line-clamp-1 text-sm text-[#274D60] dark:text-[#A7C5CC]">
                    By {book.author}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        )}

        {/* Bottom Button */}
        <div className="mt-10 text-center">
          <Link
            href="/all-books"
            className="inline-flex items-center gap-2 rounded-xl bg-[#0C969C] px-7 py-3 font-bold text-white transition hover:bg-[#0A7075]"
          >
            See All Books
            <ArrowRight size={18} />
          </Link>
        </div>

      </div>
    </section>
  );
}
