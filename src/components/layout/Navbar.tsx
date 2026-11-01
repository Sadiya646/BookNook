
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import {
  BookOpen,
  Menu,
  X,
  Home,
  Library,
  PlusCircle,
  BookMarked,
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

export default function Navbar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const { data: session, isPending } = authClient.useSession();

  const isLoggedIn = !!session?.user;

  const links = isLoggedIn
    ? [...publicLinks, ...privateLinks]
    : publicLinks;

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname === href || pathname.startsWith(`${href}/`);
  };

  const closeMenu = () => setOpen(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-[#e7e8ed] bg-white/95 backdrop-blur-md dark:border-[#343449] dark:bg-[#202132]/95">
      <nav className="mx-auto flex h-[76px] max-w-7xl items-center justify-between px-5 sm:px-8 lg:px-12">

        {/* Logo */}
        <Link
          href="/"
          className="group flex items-center gap-3"
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#292A40] text-white transition-transform duration-300 group-hover:rotate-[-8deg]">
            <BookOpen size={22} />
          </div>

          <span className="text-2xl font-bold tracking-tight text-[#292A40] dark:text-white">
            Book<span className="text-[#A83238]">Nook</span>
          </span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden items-center gap-7 md:flex">
          {links.map((link) => {
            const active = isActive(link.href);

            return (
              <Link
                key={link.href}
                href={link.href}
                className={`relative py-2 text-[14px] font-medium uppercase tracking-wide transition-colors duration-200 ${
                  active
                    ? "text-[#A83238]"
                    : "text-[#555762] hover:text-[#A83238] dark:text-gray-300"
                }`}
              >
                {link.label}

                {active && (
                  <span className="absolute -bottom-1 left-0 h-[2px] w-full rounded-full bg-[#A83238]" />
                )}
              </Link>
            );
          })}
        </div>

        {/* Desktop Actions */}
        <div className="hidden items-center gap-4 md:flex">
          <ThemeToggle />

          {isPending ? (
            <Skeleton className="h-10 w-24 rounded-full" />
          ) : session?.user ? (
            <UserMenu user={session.user} />
          ) : (
            <>
              <Link
                href="/login"
                className="rounded-full bg-[#A83238] px-7 py-2.5 text-sm font-medium uppercase tracking-wide text-white shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#85272D] hover:shadow-md"
              >
                Sign In
              </Link>

              <Link
                href="/register"
                className="rounded-full border border-[#A83238] px-6 py-2.5 text-sm font-medium text-[#A83238] transition-all duration-300 hover:bg-[#A83238] hover:text-white"
              >
                Register
              </Link>
            </>
          )}
        </div>

        {/* Mobile Navigation */}
        <div className="flex items-center gap-3 md:hidden">
          <ThemeToggle />

          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                aria-label="Open menu"
                className="border-[#292A40] text-[#292A40] dark:border-white dark:text-white"
              >
                {open ? <X size={21} /> : <Menu size={21} />}
              </Button>
            </SheetTrigger>

            <SheetContent
              side="right"
              className="w-[300px] border-l border-[#e7e8ed] bg-white dark:bg-[#202132]"
            >
              <SheetTitle className="mb-8 flex items-center gap-3 text-xl font-bold text-[#292A40] dark:text-white">
                <div className="flex size-9 items-center justify-center rounded-lg bg-[#292A40] text-white">
                  <BookOpen size={20} />
                </div>
                Book<span className="text-[#A83238]">Nook</span>
              </SheetTitle>

              <div className="flex flex-col gap-3">
                {links.map((link) => {
                  const Icon = link.icon;
                  const active = isActive(link.href);

                  return (
                    <Link
                      key={link.href}
                      href={link.href}
                      onClick={closeMenu}
                      className={`flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition-all ${
                        active
                          ? "bg-[#f8eeee] text-[#A83238] dark:bg-[#39272d]"
                          : "text-[#555762] hover:bg-[#f1f2f5] hover:text-[#A83238] dark:text-gray-300 dark:hover:bg-[#303044]"
                      }`}
                    >
                      <Icon size={19} />
                      {link.label}
                    </Link>
                  );
                })}
              </div>

              <div className="my-6 border-t border-[#e7e8ed] dark:border-[#343449]" />

              {isPending ? (
                <Skeleton className="h-10 w-full rounded-full" />
              ) : session?.user ? (
                <UserMenu user={session.user} />
              ) : (
                <div className="flex flex-col gap-3">
                  <Link
                    href="/login"
                    onClick={closeMenu}
                    className="rounded-full bg-[#A83238] px-6 py-3 text-center text-sm font-medium uppercase tracking-wide text-white transition hover:bg-[#85272D]"
                  >
                    Sign In
                  </Link>

                  <Link
                    href="/register"
                    onClick={closeMenu}
                    className="rounded-full border border-[#A83238] px-6 py-3 text-center text-sm font-medium text-[#A83238] transition hover:bg-[#A83238] hover:text-white"
                  >
                    Register
                  </Link>
                </div>
              )}
            </SheetContent>
          </Sheet>
        </div>
      </nav>
    </header>
  );
}
