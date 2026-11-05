import Link from "next/link";
import {
  BookOpen,
  Home,
  Search,
} from "lucide-react";

export default function NotFound() {
  return (
    <main className="flex min-h-screen items-center justify-center overflow-hidden bg-[#F4F8F8] px-6 py-16 dark:bg-[#031716]">
      <div className="w-full max-w-2xl text-center">

        {/* 404 Illustration */}
        <div className="relative mx-auto mb-8 flex h-52 w-52 items-center justify-center">
          <div className="absolute inset-0 rounded-full bg-[#0C969C]/10 blur-2xl" />

          <div className="relative flex h-40 w-40 items-center justify-center rounded-full border border-[#0C969C]/20 bg-white shadow-2xl shadow-[#0C969C]/10 dark:bg-[#032F30]">
            <BookOpen
              size={76}
              strokeWidth={1.3}
              className="text-[#0C969C]"
            />
          </div>

          <span className="absolute -right-1 top-5 rounded-full bg-[#E5CD82] px-4 py-2 text-sm font-black text-[#032F30] shadow-lg">
            404
          </span>
        </div>

        {/* Text */}
        <p className="mb-3 text-sm font-bold uppercase tracking-[4px] text-[#0C969C]">
          Page Not Found
        </p>

        <h1 className="font-heading text-4xl font-black text-[#032F30] dark:text-[#F4F8F8] sm:text-6xl">
          Lost in the
          <span className="mt-2 block text-[#0C969C]">
            wrong chapter?
          </span>
        </h1>

        <p className="mx-auto mt-6 max-w-md text-base leading-relaxed text-[#274D60] dark:text-[#A7C5CC]">
          Oops! The page you are looking for doesn't exist
          or may have been moved. Let's get you back to
          exploring your favorite books.
        </p>

        {/* Buttons */}
        <div className="mt-9 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded-full bg-[#0C969C] px-8 py-4 text-sm font-bold text-white shadow-lg shadow-[#0C969C]/25 transition-all duration-300 hover:-translate-y-1 hover:bg-[#0A7075]"
          >
            <Home size={18} />
            Back to Home
          </Link>

          <Link
            href="/books"
            className="inline-flex items-center gap-2 rounded-full border border-[#0C969C]/30 px-8 py-4 text-sm font-bold text-[#032F30] transition-all duration-300 hover:-translate-y-1 hover:bg-[#0C969C]/10 dark:text-[#F4F8F8]"
          >
            <Search size={18} />
            Explore Books
          </Link>
        </div>

        {/* Footer */}
        <div className="mt-16 flex items-center justify-center gap-2 text-sm text-[#274D60]/70 dark:text-[#A7C5CC]/70">
          <BookOpen size={16} />
          <span>BookNook — Every book has a story.</span>
        </div>

      </div>
    </main>
  );
}