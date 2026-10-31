
"use client";

import Link from "next/link";
import { useState } from "react";

export default function Navbar() {
  const [dark, setDark] = useState(false);

  return (
    <nav className="sticky top-0 z-50 w-full bg-[#F5F0E6]/95 backdrop-blur-md border-b border-[#C9A961]/30">
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">

        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <svg
            width="34"
            height="34"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#0F3D2E"
            strokeWidth="2"
          >
            <path d="M4 5a2 2 0 0 1 2-2h13v16H6a2 2 0 0 0-2 2z" />
            <path d="M8 7h7" stroke="#C9A961" />
          </svg>

          <span className="text-2xl font-bold text-[#0F3D2E]">
            Book<span className="text-[#C9A961]">Nook</span>
          </span>
        </Link>

        {/* Navigation Links */}
        <div className="hidden md:flex items-center gap-2">

          <Link href="/" className="px-4 py-2 rounded-full bg-[#0F3D2E] text-white text-sm font-medium">
            Home
          </Link>

          <Link href="/books" className="px-4 py-2 rounded-full text-[#253B30] hover:bg-[#E8E2D5] transition text-sm">
            All Books
          </Link>

          <Link href="/add-book" className="px-4 py-2 rounded-full text-[#253B30] hover:bg-[#E8E2D5] transition text-sm">
            Add Book
          </Link>

          <Link href="/my-books" className="px-4 py-2 rounded-full text-[#253B30] hover:bg-[#E8E2D5] transition text-sm">
            My Books
          </Link>

          <Link href="/my-borrows" className="px-4 py-2 rounded-full text-[#253B30] hover:bg-[#E8E2D5] transition text-sm">
            My Borrows
          </Link>

          {/* Theme Toggle */}
          <button
            onClick={() => setDark(!dark)}
            className="ml-3 px-4 py-2 rounded-full border border-[#C9A961] text-[#0F3D2E] hover:bg-[#E8E2D5] transition text-sm"
          >
            {dark ? "Light" : "Dark"}
          </button>

          {/* User Avatar */}
          <button className="ml-2 w-10 h-10 rounded-full bg-[#0F3D2E] text-[#E9D39A] font-semibold flex items-center justify-center border-2 border-[#C9A961]">
            AR
          </button>

        </div>

        {/* Mobile Menu Button */}
        <button className="md:hidden text-[#0F3D2E] text-2xl">
          ☰
        </button>

      </div>
    </nav>
  );
}
