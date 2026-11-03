
import Link from "next/link";
import {
  BookOpen,
  Globe,
  Code2,
  BriefcaseBusiness,
  Mail,
  MapPin,
  Phone,
  ArrowUpRight,
} from "lucide-react";

const quickLinks = [
  { name: "Home", href: "/" },
  { name: "All Books", href: "/books" },
  { name: "Add Book", href: "/add-book" },
  { name: "My Books", href: "/my-books" },
  { name: "My Borrows", href: "/my-borrows" },
];

export default function Footer() {
  return (
    <footer className="mt-20 border-t border-[#0C969C]/20 bg-[#031716] text-[#F4F8F8]">
      <div className="mx-auto max-w-7xl px-6 py-14 lg:px-8">
        <div className="grid grid-cols-1 gap-12 sm:grid-cols-2 lg:grid-cols-4">

          {/* Brand */}
          <div>
            <Link href="/" className="mb-5 flex items-center gap-3">
              <div className="flex size-11 items-center justify-center rounded-xl bg-[#0C969C] shadow-lg shadow-[#0C969C]/20">
                <BookOpen className="h-6 w-6 text-white" />
              </div>

              <span className="text-2xl font-bold tracking-tight">
                Book<span className="text-[#0C969C]">Nook</span>
              </span>
            </Link>

            <p className="max-w-xs text-sm leading-7 text-[#A7C5C5]">
              Discover your next favorite book. Explore our collection,
              borrow books, and make reading a part of your everyday life.
            </p>

            {/* Social Links */}
            <div className="mt-6 flex items-center gap-3">
              {/* Facebook */}
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noreferrer"
                aria-label="Facebook"
                className="rounded-xl border border-[#274D60] p-2.5 text-[#A7C5C5] transition hover:border-[#0C969C] hover:bg-[#0C969C] hover:text-white"
              >
                <Globe size={18} />
              </a>

              {/* GitHub */}
              <a
                href="https://github.com"
                target="_blank"
                rel="noreferrer"
                aria-label="GitHub"
                className="rounded-xl border border-[#274D60] p-2.5 text-[#A7C5C5] transition hover:border-[#0C969C] hover:bg-[#0C969C] hover:text-white"
              >
                <Code2 size={18} />
              </a>

              {/* LinkedIn */}
              <a
                href="https://www.linkedin.com/in/sadiya-tasnim/"
                target="_blank"
                rel="noreferrer"
                aria-label="LinkedIn"
                className="rounded-xl border border-[#274D60] p-2.5 text-[#A7C5C5] transition hover:border-[#0C969C] hover:bg-[#0C969C] hover:text-white"
              >
                <BriefcaseBusiness size={18} />
              </a>

              {/* X (Twitter) */}
              <a
                href="https://x.com/sadiatasnim646"
                target="_blank"
                rel="noreferrer"
                aria-label="X"
                className="rounded-xl border border-[#274D60] p-2.5 text-[#A7C5C5] transition hover:border-[#0C969C] hover:bg-[#0C969C] hover:text-white"
              >
                <svg
                  viewBox="0 0 24 24"
                  width="18"
                  height="18"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path d="M18.9 2H22l-6.8 7.8L23.2 22h-6.3l-5-7.1L5.7 22H2.5l7.3-8.4L1.8 2h6.5l4.5 6.5L18.9 2Zm-1.1 18h1.7L7.3 3.9H5.5L17.8 20Z" />
                </svg>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="mb-6 text-lg font-bold text-white">
              Quick Links
            </h3>

            <ul className="space-y-4">
              {quickLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="group flex w-fit items-center gap-2 text-sm text-[#A7C5C5] transition hover:text-[#0C969C]"
                  >
                    {link.name}

                    <ArrowUpRight
                      size={14}
                      className="opacity-0 transition group-hover:translate-x-1 group-hover:opacity-100"
                    />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="mb-6 text-lg font-bold text-white">
              Contact Us
            </h3>

            <ul className="space-y-5">
              <li className="flex items-start gap-3">
                <Mail className="mt-1 h-5 w-5 shrink-0 text-[#0C969C]" />

                <a
                  href="mailto:booknook@example.com"
                  className="text-sm text-[#A7C5C5] transition hover:text-[#0C969C]"
                >
                  booknook@example.com
                </a>
              </li>

              <li className="flex items-start gap-3">
                <Phone className="mt-1 h-5 w-5 shrink-0 text-[#0C969C]" />

                <span className="text-sm text-[#A7C5C5]">
                  +880 1731372829
                </span>
              </li>

              <li className="flex items-start gap-3">
                <MapPin className="mt-1 h-5 w-5 shrink-0 text-[#0C969C]" />

                <span className="text-sm text-[#A7C5C5]">
                  Bangladesh
                </span>
              </li>
            </ul>
          </div>

          {/* Explore */}
          <div>
            <h3 className="mb-4 text-lg font-bold text-white">
              Stay Connected
            </h3>

            <p className="mb-5 text-sm leading-7 text-[#A7C5C5]">
              Keep exploring and discover something new to read every day.
            </p>

            <Link
              href="/books"
              className="inline-flex items-center gap-2 rounded-xl bg-[#0C969C] px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-[#0C969C]/20 transition hover:bg-[#087A80]"
            >
              Explore Books
              <ArrowUpRight size={16} />
            </Link>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-14 flex flex-col items-center justify-between gap-4 border-t border-[#274D60]/60 pt-7 text-center sm:flex-row">
          <p className="text-sm text-[#A7C5C5]">
            © 2026 BookNook. All rights reserved.
          </p>

          <p className="text-sm text-[#A7C5C5]">
            Made with <span className="text-red-400">♥</span> for book lovers.
          </p>
        </div>
      </div>
    </footer>
  );
}
