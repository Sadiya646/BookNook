"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Suspense, useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  BookOpen,
  Menu,
  X,
  Home,
  Library,
  PlusCircle,
  BookMarked,
  Sparkles,
} from "lucide-react";

import { authClient } from "@/lib/auth-client";
import ThemeToggle from "@/components/layout/ThemeToggle";
import UserMenu from "@/components/layout/UserMenu";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

const publicLinks = [
  { href: "/", label: "Home", icon: Home },
  { href: "/books", label: "Books", icon: Library },
  { href: "/all-books", label: "All Books", icon: BookOpen },
];

const privateLinks = [
  { href: "/add-book", label: "Add Book", icon: PlusCircle },
  { href: "/my-books", label: "My Books", icon: BookMarked },
  { href: "/my-borrows", label: "My Borrows", icon: BookOpen },
];

function NavbarContent() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const { data: session, isPending } = authClient.useSession();
  const isLoggedIn = !!session?.user;

  const links = isLoggedIn
    ? [...publicLinks, ...privateLinks]
    : publicLinks;

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname === href || pathname.startsWith(`${href}/`);
  };

  const closeMenu = () => setOpen(false);

  return (
    <header
      className={`sticky top-0 z-50 w-full transition-all duration-500 ease-in-out ${
        scrolled ? "py-2 sm:py-3" : "py-4 sm:py-5"
      }`}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <nav
          className={`relative flex items-center justify-between rounded-2xl border transition-all duration-500 ${
            scrolled
              ? "border-[#0C969C]/30 bg-[#F4F8F8]/85 shadow-2xl backdrop-blur-2xl dark:border-[#274D60]/60 dark:bg-[#031716]/85 dark:shadow-[#031716]/80 px-5 py-2.5"
              : "border-white/30 bg-[#F4F8F8]/60 shadow-lg backdrop-blur-xl dark:border-[#274D60]/40 dark:bg-[#031716]/50 px-6 py-3.5"
          }`}
        >
          {/* Logo Section */}
          <Link href="/" className="group flex items-center gap-3">
            <div className="relative flex size-10 items-center justify-center rounded-xl bg-linear-to-br from-[#0C969C] via-[#0A7075] to-[#032F30] text-white shadow-md shadow-[#0C969C]/30 transition-transform duration-300 group-hover:scale-105 group-hover:rotate-6">
              <BookOpen size={20} className="transition-transform duration-300 group-hover:scale-110" />
              <div className="absolute -top-1 -right-1">
                <Sparkles size={10} className="text-[#6BA3BE] opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
              </div>
            </div>

            <span className="font-heading text-2xl font-black tracking-tight text-[#031716] dark:text-[#F4F8F8]">
              Book<span className="bg-linear-to-r from-[#0C969C] to-[#6BA3BE] bg-clip-text text-transparent">Nook</span>
            </span>
          </Link>

          {/* Desktop Navigation Links */}
          <div className="hidden items-center gap-1.5 rounded-full border border-[#0C969C]/15 bg-white/50 p-1.5 shadow-inner backdrop-blur-md dark:border-[#274D60]/40 dark:bg-[#032F30]/40 md:flex">
            {links.map((link) => {
              const active = isActive(link.href);

              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`relative rounded-full px-4 py-2 text-xs font-bold uppercase tracking-wider transition-colors duration-300 ${
                    active
                      ? "text-white"
                      : "text-[#274D60] hover:text-[#0C969C] dark:text-[#6BA3BE] dark:hover:text-white"
                  }`}
                >
                  {active && (
                    <motion.div
                      layoutId="navbar-active"
                      className="absolute inset-0 rounded-full bg-linear-to-r from-[#0C969C] to-[#0A7075] shadow-md shadow-[#0C969C]/30"
                      transition={{ type: "spring", stiffness: 380, damping: 30 }}
                    />
                  )}
                  <span className="relative z-10 flex items-center gap-2">
                    {link.label}
                  </span>
                </Link>
              );
            })}
          </div>

          {/* Desktop Actions */}
          <div className="hidden items-center gap-4 md:flex">
            <div className="rounded-xl border border-[#0C969C]/20 bg-white/60 p-1 shadow-sm backdrop-blur-md transition-transform hover:scale-105 dark:border-[#274D60]/40 dark:bg-[#032F30]/50">
              <ThemeToggle />
            </div>

            {isPending ? (
              <Skeleton className="h-10 w-28 rounded-full bg-[#0C969C]/20" />
            ) : session?.user ? (
              <UserMenu user={session.user} />
            ) : (
              <div className="flex items-center gap-3">
                <Link
                  href="/login"
                  className="relative group overflow-hidden rounded-full bg-linear-to-r from-[#0C969C] to-[#0A7075] px-6 py-2.5 text-xs font-bold uppercase tracking-wider text-white shadow-lg shadow-[#0C969C]/25 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-[#0C969C]/40 active:scale-95"
                >
                  <span className="relative z-10">Sign In</span>
                  <div className="absolute inset-0 bg-white/20 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                </Link>

                <Link
                  href="/register"
                  className="rounded-full border-2 border-[#0C969C] px-6 py-2 text-xs font-bold uppercase tracking-wider text-[#0C969C] backdrop-blur-sm transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#0C969C] hover:text-white dark:text-[#6BA3BE] dark:hover:text-white"
                >
                  Register
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Navigation */}
          <div className="flex items-center gap-3 md:hidden">
            <div className="rounded-xl border border-[#0C969C]/20 bg-white/60 p-1 dark:border-[#274D60]/40 dark:bg-[#032F30]/50">
              <ThemeToggle />
            </div>

            <Sheet open={open} onOpenChange={setOpen}>
              <SheetTrigger
                render={
                  <Button
                    variant="outline"
                    size="icon"
                    aria-label="Open menu"
                    className="rounded-xl border-[#0C969C]/30 bg-white/60 text-[#031716] shadow-sm backdrop-blur-md dark:border-[#274D60] dark:bg-[#032F30]/60 dark:text-[#F4F8F8]"
                  >
                    {open ? <X size={20} /> : <Menu size={20} />}
                  </Button>
                }
              />

              <SheetContent
                side="right"
                className="w-80 border-l border-[#0C969C]/20 bg-[#F4F8F8]/95 p-6 backdrop-blur-2xl dark:border-[#274D60]/50 dark:bg-[#031716]/95"
              >
                <SheetTitle className="mb-8 flex items-center gap-3 pt-2 text-2xl font-black text-[#031716] dark:text-white">
                  <div className="flex size-10 items-center justify-center rounded-xl bg-gradient-to-br from-[#0C969C] to-[#032F30] text-white shadow-md">
                    <BookOpen size={20} />
                  </div>
                  Book<span className="text-[#0C969C]">Nook</span>
                </SheetTitle>

                <div className="flex flex-col gap-2">
                  {links.map((link) => {
                    const Icon = link.icon;
                    const active = isActive(link.href);

                    return (
                      <Link
                        key={link.href}
                        href={link.href}
                        onClick={closeMenu}
                        className={`flex items-center gap-3.5 rounded-2xl px-4 py-3.5 text-sm font-bold uppercase tracking-wider transition-all duration-300 ${
                          active
                            ? "bg-linear-to-r from-[#0C969C] to-[#0A7075] text-white shadow-lg shadow-[#0C969C]/25"
                            : "text-[#274D60] hover:bg-[#0C969C]/10 hover:text-[#0C969C] dark:text-[#6BA3BE] dark:hover:text-white"
                        }`}
                      >
                        <Icon size={18} />
                        {link.label}
                      </Link>
                    );
                  })}
                </div>

                <div className="my-6 border-t border-[#0C969C]/15 dark:border-[#274D60]/40" />

                {isPending ? (
                  <Skeleton className="h-12 w-full rounded-2xl bg-[#0C969C]/20" />
                ) : session?.user ? (
                  <UserMenu user={session.user} />
                ) : (
                  <div className="flex flex-col gap-3">
                    <Link
                      href="/login"
                      onClick={closeMenu}
                      className="rounded-2xl bg-linear-to-r from-[#0C969C] to-[#0A7075] py-3.5 text-center text-xs font-bold uppercase tracking-wider text-white shadow-md shadow-[#0C969C]/20"
                    >
                      Sign In
                    </Link>

                    <Link
                      href="/register"
                      onClick={closeMenu}
                      className="rounded-2xl border-2 border-[#0C969C] py-3 text-center text-xs font-bold uppercase tracking-wider text-[#0C969C] transition hover:bg-[#0C969C] hover:text-white dark:text-[#6BA3BE]"
                    >
                      Register
                    </Link>
                  </div>
                )}
              </SheetContent>
            </Sheet>
          </div>
        </nav>
      </div>
    </header>
  );
}

export default function Navbar() {
  return (
    <Suspense fallback={<div className="h-20 w-full" />}>
      <NavbarContent />
    </Suspense>
  );
}