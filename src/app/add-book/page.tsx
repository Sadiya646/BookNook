"use client";

import { useState, type FormEvent, type ChangeEvent } from "react";
import { toast } from "sonner";
import {
  BookOpen,
  User,
  Mail,
  Plus,
  Image as ImageIcon,
  Layers,
  FileText,
  Hash,
} from "lucide-react";

import { authClient } from "@/lib/auth-client";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

const initialFormData = {
  title: "",
  author: "",
  category: "Fiction",
  totalCopies: "1",
  description: "",
  image: "",
};

export default function AddBookForm() {
  const { data: session, isPending } = authClient.useSession();
  const user = session?.user;

  const [formData, setFormData] = useState(initialFormData);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!user) {
      toast.error("Please login first.");
      return;
    }

    const totalCopies = Number(formData.totalCopies);

    if (
      !formData.title.trim() ||
      !formData.author.trim() ||
      !formData.description.trim() ||
      !formData.image.trim() ||
      !Number.isInteger(totalCopies) ||
      totalCopies < 1
    ) {
      toast.error("Please fill in all required fields correctly.");
      return;
    }

    try {
      const imageUrl = new URL(formData.image);
      if (!["http:", "https:"].includes(imageUrl.protocol)) {
        toast.error("Please enter a valid image URL.");
        return;
      }
    } catch {
      toast.error("Please enter a valid image URL.");
      return;
    }

    setIsSubmitting(true);

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/add-book`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            title: formData.title.trim(),
            author: formData.author.trim(),
            category: formData.category,
            description: formData.description.trim(),
            imageUrl: formData.image.trim(),
            totalCopies,
            copies: totalCopies,
            userName: user.name,
            userEmail: user.email,
            createdAt: new Date().toISOString(),
          }),
        }
      );

      const result = await res.json();

      if (!res.ok) {
        throw new Error(result.message || "Failed to add book");
      }

      toast.success("Book successfully added!");
      setFormData(initialFormData);
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Something went wrong!"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="mx-auto w-full max-w-3xl rounded-3xl border border-[#0C969C]/25 bg-[#F4F8F8] p-8 shadow-2xl backdrop-blur-xl dark:border-[#274D60]/50 dark:bg-[#032F30] md:p-10">
      
      {/* Header */}
      <div className="mb-8 flex items-center gap-4 border-b border-[#0C969C]/15 pb-6 dark:border-[#274D60]/40">
        <div className="flex size-14 items-center justify-center rounded-2xl bg-gradient-to-br from-[#0C969C] to-[#032F30] text-white shadow-lg shadow-[#0C969C]/30">
          <BookOpen className="h-7 w-7 text-white" />
        </div>

        <div>
          <h2 className="text-3xl font-black tracking-tight text-[#031716] dark:text-[#F4F8F8]">
            Add New Book
          </h2>
          <p className="text-sm font-medium text-[#274D60] dark:text-[#6BA3BE]">
            Expand your library collection with luxury details.
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        
        {/* Row 1: Title & Author */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="title" className="text-xs font-bold uppercase tracking-wider text-[#274D60] dark:text-[#6BA3BE]">
              Book Title *
            </Label>
            <div className="relative flex items-center">
              <BookOpen className="absolute left-4 h-4 w-4 text-[#0C969C] pointer-events-none" />
              <Input
                id="title"
                name="title"
                placeholder="Enter book title"
                value={formData.title}
                onChange={handleChange}
                required
                className="h-12 pl-11 rounded-2xl border-[#CCE0E0] bg-white text-sm text-[#031716] shadow-sm focus-visible:border-[#0C969C] focus-visible:ring-2 focus-visible:ring-[#0C969C]/20 dark:border-[#274D60] dark:bg-[#031716] dark:text-[#F4F8F8]"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="author" className="text-xs font-bold uppercase tracking-wider text-[#274D60] dark:text-[#6BA3BE]">
              Author Name *
            </Label>
            <div className="relative flex items-center">
              <User className="absolute left-4 h-4 w-4 text-[#0C969C] pointer-events-none" />
              <Input
                id="author"
                name="author"
                placeholder="Enter author name"
                value={formData.author}
                onChange={handleChange}
                required
                className="h-12 pl-11 rounded-2xl border-[#CCE0E0] bg-white text-sm text-[#031716] shadow-sm focus-visible:border-[#0C969C] focus-visible:ring-2 focus-visible:ring-[#0C969C]/20 dark:border-[#274D60] dark:bg-[#031716] dark:text-[#F4F8F8]"
              />
            </div>
          </div>
        </div>

        {/* Row 2: Category & Total Copies */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="category" className="text-xs font-bold uppercase tracking-wider text-[#274D60] dark:text-[#6BA3BE]">
              Category *
            </Label>
            <div className="relative flex items-center">
              <Layers className="absolute left-4 h-4 w-4 text-[#0C969C] pointer-events-none z-10" />
              <select
                id="category"
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="h-12 w-full appearance-none rounded-2xl border border-[#CCE0E0] bg-white pl-11 pr-4 text-sm font-medium text-[#031716] shadow-sm outline-none transition-all focus:border-[#0C969C] focus:ring-2 focus:ring-[#0C969C]/20 dark:border-[#274D60] dark:bg-[#031716] dark:text-[#F4F8F8]"
              >
                <option value="Fiction">Fiction</option>
                <option value="Non-Fiction">Non-Fiction</option>
                <option value="Science">Science</option>
                <option value="Technology">Technology</option>
                <option value="Biography">Biography</option>
                <option value="Self-Help">Self-Help</option>
                <option value="Fantasy">Fantasy</option>
                <option value="History">History</option>
              </select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="totalCopies" className="text-xs font-bold uppercase tracking-wider text-[#274D60] dark:text-[#6BA3BE]">
              Total Copies *
            </Label>
            <div className="relative flex items-center">
              <Hash className="absolute left-4 h-4 w-4 text-[#0C969C] pointer-events-none" />
              <Input
                id="totalCopies"
                name="totalCopies"
                type="number"
                min="1"
                step="1"
                placeholder="1"
                value={formData.totalCopies}
                onChange={handleChange}
                required
                className="h-12 pl-11 rounded-2xl border-[#CCE0E0] bg-white text-sm text-[#031716] shadow-sm focus-visible:border-[#0C969C] focus-visible:ring-2 focus-visible:ring-[#0C969C]/20 dark:border-[#274D60] dark:bg-[#031716] dark:text-[#F4F8F8]"
              />
            </div>
          </div>
        </div>

        {/* Row 3: Book Cover Image URL */}
        <div className="space-y-2">
          <Label htmlFor="image" className="text-xs font-bold uppercase tracking-wider text-[#274D60] dark:text-[#6BA3BE]">
            Book Cover Image URL *
          </Label>
          <div className="relative flex items-center">
            <ImageIcon className="absolute left-4 h-4 w-4 text-[#0C969C] pointer-events-none" />
            <Input
              id="image"
              name="image"
              type="url"
              placeholder="https://example.com/book-cover.jpg"
              value={formData.image}
              onChange={handleChange}
              required
              className="h-12 pl-11 rounded-2xl border-[#CCE0E0] bg-white text-sm text-[#031716] shadow-sm focus-visible:border-[#0C969C] focus-visible:ring-2 focus-visible:ring-[#0C969C]/20 dark:border-[#274D60] dark:bg-[#031716] dark:text-[#F4F8F8]"
            />
          </div>

          {formData.image && (
            <div className="mt-4 flex items-center gap-4 rounded-2xl border border-[#0C969C]/20 bg-white/70 p-4 backdrop-blur-sm dark:border-[#274D60] dark:bg-[#031716]/60">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={formData.image}
                alt="Book cover preview"
                className="h-24 w-18 rounded-xl border border-[#0C969C]/30 object-cover shadow-md"
                onError={(e) => {
                  e.currentTarget.style.display = "none";
                }}
              />
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-[#0C969C]">Preview Active</p>
                <p className="text-xs text-[#274D60] dark:text-[#6BA3BE]">Cover loaded successfully.</p>
              </div>
            </div>
          )}
        </div>

        {/* Row 4: Description */}
        <div className="space-y-2">
          <Label htmlFor="description" className="text-xs font-bold uppercase tracking-wider text-[#274D60] dark:text-[#6BA3BE]">
            Description *
          </Label>
          <div className="relative">
            <FileText className="absolute left-4 top-4 h-4 w-4 text-[#0C969C] pointer-events-none" />
            <Textarea
              id="description"
              name="description"
              placeholder="Write a captivating description about the book..."
              value={formData.description}
              onChange={handleChange}
              rows={4}
              required
              className="pl-11 rounded-2xl border-[#CCE0E0] bg-white text-sm text-[#031716] shadow-sm focus-visible:border-[#0C969C] focus-visible:ring-2 focus-visible:ring-[#0C969C]/20 dark:border-[#274D60] dark:bg-[#031716] dark:text-[#F4F8F8]"
            />
          </div>
        </div>

        {/* Added By Section */}
        <div className="rounded-2xl border border-[#0C969C]/20 bg-white/80 p-5 backdrop-blur-md dark:border-[#274D60] dark:bg-[#031716]/70">
          <p className="mb-3 text-xs font-bold uppercase tracking-wider text-[#0C969C]">
            Logged-In Authorizer
          </p>

          {isPending ? (
            <p className="text-sm text-[#274D60] dark:text-[#6BA3BE]">
              Loading user information...
            </p>
          ) : user ? (
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
              <div className="flex items-center gap-2.5 text-sm font-semibold text-[#031716] dark:text-[#F4F8F8]">
                <User className="h-4 w-4 text-[#0C969C]" />
                {user.name}
              </div>

              <div className="flex items-center gap-2.5 text-sm font-medium text-[#274D60] dark:text-[#6BA3BE]">
                <Mail className="h-4 w-4 text-[#0C969C]" />
                {user.email}
              </div>
            </div>
          ) : (
            <p className="text-sm font-semibold text-red-500">
              Please login to add a book.
            </p>
          )}
        </div>

        {/* Submit Button */}
        <Button
          type="submit"
          disabled={isSubmitting || isPending || !user}
          className="w-full rounded-2xl bg-gradient-to-r from-[#0C969C] to-[#0A7075] py-7 text-sm font-bold uppercase tracking-wider text-white shadow-xl shadow-[#0C969C]/30 transition-all hover:scale-[1.01] hover:shadow-2xl hover:shadow-[#0C969C]/40 active:scale-95 disabled:opacity-50"
        >
          {isSubmitting ? (
            "Processing..."
          ) : (
            <>
              <Plus className="mr-2 h-5 w-5" />
              Publish Book to Library
            </>
          )}
        </Button>

      </form>
    </div>
  );
}