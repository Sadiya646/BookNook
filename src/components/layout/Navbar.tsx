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
    <header className="sticky top-0 z-50 w-full px-4 pt-3 pb-1 transition-all duration-300">
      {/* Floating Premium Glass Container */}
      <nav className="mx-auto flex h-[70px] max-w-7xl items-center justify-between rounded-2xl border border-[#0C969C]/20 bg-[#F4F8F8]/80 px-6 backdrop-blur-xl shadow-lg shadow-[#031716]/5 transition-all dark:border-[#274D60]/40 dark:bg-[#031716]/80 dark:shadow-[#031716]/50 lg:px-10">
        
        {/* Logo Section */}
        <Link href="/" className="group flex items-center gap-3.5">
          <div className="relative flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-[#0C969C] to-[#032F30] text-white shadow-md shadow-[#0C969C]/30 transition-all duration-500 group-hover:scale-105 group-hover:rotate-[-6deg] group-hover:shadow-[#0C969C]/50">
            <BookOpen size={22} className="transition-transform duration-300 group-hover:scale-110" />
            <span className="absolute -top-1 -right-1 flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#6BA3BE] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-[#0C969C]"></span>
            </span>
          </div>

          <div className="flex flex-col">
            <span className="text-2xl font-black tracking-tight text-[#031716] dark:text-[#F4F8F8]">
              Book<span className="bg-gradient-to-r from-[#0C969C] to-[#6BA3BE] bg-clip-text text-transparent">Nook</span>
            </span>
            <span className="text-[10px] font-semibold uppercase tracking-widest text-[#0A7075] dark:text-[#6BA3BE]">
              Premium Library
            </span>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <div className="hidden items-center gap-1 rounded-full border border-[#0C969C]/10 bg-[#032F30]/5 p-1.5 dark:border-[#274D60]/30 dark:bg-[#032F30]/40 md:flex">
          {links.map((link) => {
            const active = isActive(link.href);

            return (
              <Link
                key={link.href}
                href={link.href}
                className={`relative px-5 py-2 text-xs font-bold uppercase tracking-wider transition-all duration-300 rounded-full ${
                  active
                    ? "bg-gradient-to-r from-[#0C969C] to-[#0A7075] text-white shadow-md shadow-[#0C969C]/25"
                    : "text-[#274D60] hover:text-[#0C969C] dark:text-[#6BA3BE] dark:hover:text-white"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </div>

        {/* Desktop Actions */}
        <div className="hidden items-center gap-4 md:flex">
          <div className="rounded-xl border border-[#0C969C]/20 bg-white/50 p-1 backdrop-blur-sm dark:border-[#274D60]/40 dark:bg-[#032F30]/50">
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
                className="relative inline-flex items-center justify-center overflow-hidden rounded-full bg-gradient-to-r from-[#0C969C] to-[#0A7075] px-6 py-2.5 text-xs font-bold uppercase tracking-wider text-white shadow-md shadow-[#0C969C]/20 transition-all duration-300 hover:scale-[1.03] hover:shadow-lg hover:shadow-[#0C969C]/40 active:scale-95"
              >
                Sign In
              </Link>

              <Link
                href="/register"
                className="rounded-full border-2 border-[#0C969C] px-6 py-2 text-xs font-bold uppercase tracking-wider text-[#0C969C] transition-all duration-300 hover:bg-[#0C969C] hover:text-white dark:text-[#6BA3BE] dark:border-[#0C969C] dark:hover:bg-[#0C969C] dark:hover:text-white"
              >
                Register
              </Link>
            </div>
          )}
        </div>

        {/* Mobile Navigation Button & Sheet */}
        <div className="flex items-center gap-3 md:hidden">
          <ThemeToggle />

          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger
              render={
                <Button
                  variant="outline"
                  size="icon"
                  aria-label="Open menu"
                  className="rounded-xl border-[#0C969C]/30 bg-transparent text-[#031716] dark:border-[#274D60] dark:text-[#F4F8F8]"
                >
                  {open ? <X size={22} /> : <Menu size={22} />}
                </Button>
              }
            />

            <SheetContent
              side="right"
              className="w-[310px] border-l border-[#0C969C]/20 bg-[#F4F8F8]/95 backdrop-blur-2xl dark:border-[#274D60]/50 dark:bg-[#031716]/95"
            >
              <SheetTitle className="mb-8 flex items-center gap-3 pt-2 text-2xl font-black text-[#031716] dark:text-white">
                <div className="flex size-10 items-center justify-center rounded-xl bg-gradient-to-br from-[#0C969C] to-[#032F30] text-white shadow-md shadow-[#0C969C]/30">
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
                      className={`flex items-center gap-3.5 rounded-xl px-4 py-3.5 text-sm font-semibold transition-all duration-200 ${
                        active
                          ? "bg-gradient-to-r from-[#0C969C] to-[#0A7075] text-white shadow-md shadow-[#0C969C]/20"
                          : "text-[#274D60] hover:bg-[#0C969C]/10 hover:text-[#0C969C] dark:text-[#6BA3BE] dark:hover:bg-[#032F30] dark:hover:text-white"
                      }`}
                    >
                      <Icon size={20} />
                      {link.label}
                    </Link>
                  );
                })}
              </div>

              <div className="my-6 border-t border-[#0C969C]/15 dark:border-[#274D60]/40" />

              {isPending ? (
                <Skeleton className="h-12 w-full rounded-xl bg-[#0C969C]/20" />
              ) : session?.user ? (
                <UserMenu user={session.user} />
              ) : (
                <div className="flex flex-col gap-3">
                  <Link
                    href="/login"
                    onClick={closeMenu}
                    className="rounded-xl bg-gradient-to-r from-[#0C969C] to-[#0A7075] py-3.5 text-center text-sm font-bold uppercase tracking-wider text-white shadow-md shadow-[#0C969C]/20 transition active:scale-95"
                  >
                    Sign In
                  </Link>

                  <Link
                    href="/register"
                    onClick={closeMenu}
                    className="rounded-xl border-2 border-[#0C969C] py-3 text-center text-sm font-bold uppercase tracking-wider text-[#0C969C] transition hover:bg-[#0C969C] hover:text-white dark:text-[#6BA3BE]"
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