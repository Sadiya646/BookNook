
"use client";

import { useEffect, useState, type FormEvent, type ChangeEvent } from "react";
import { useRouter } from "next/navigation";
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
  Loader2,
} from "lucide-react";

import { authClient } from "@/lib/auth-client";
import { getToken } from "@/lib/get-token";

import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

const CATEGORIES = ["Fiction", "Science", "History", "Kids", "Others"];
const MAX_IMAGE_SIZE = 5 * 1024 * 1024;

const initialFormData = {
  title: "",
  author: "",
  category: "Fiction",
  totalCopies: "1",
  description: "",
};

async function uploadToImgbb(file: File): Promise<string> {
  const apiKey = process.env.NEXT_PUBLIC_IMGBB_API_KEY;

  if (!apiKey) {
    throw new Error("Image upload key is not configured.");
  }

  const body = new FormData();
  body.append("image", file);

  const res = await fetch(`https://api.imgbb.com/1/upload?key=${apiKey}`, {
    method: "POST",
    body,
  });

  const data = await res.json();

  if (!res.ok || !data.success) {
    throw new Error("Image upload failed. Please try again.");
  }

  return data.data.url as string;
}

export default function AddBookForm() {
  const router = useRouter();

  const { data: session, isPending } = authClient.useSession();
  const user = session?.user;

  const [formData, setFormData] = useState(initialFormData);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (!file) {
      setImageFile(null);
      setPreviewUrl("");
      return;
    }

    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file.");
      e.target.value = "";
      return;
    }

    if (file.size > MAX_IMAGE_SIZE) {
      toast.error("Image must be smaller than 5MB.");
      e.target.value = "";
      return;
    }

    setImageFile(file);
    setPreviewUrl(URL.createObjectURL(file));
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
      !Number.isInteger(totalCopies) ||
      totalCopies < 1
    ) {
      toast.error("Please fill in all required fields correctly.");
      return;
    }

    if (!imageFile) {
      toast.error("Please select a book cover image.");
      return;
    }

    setIsSubmitting(true);

    try {
      // 1. Upload image to imgbb
      const imageUrl = await uploadToImgbb(imageFile);

      // 2. Get JWT token
      const token = await getToken();

      const API_URL = process.env.NEXT_PUBLIC_API_URL;

      if (!API_URL) {
        throw new Error("API URL is not configured.");
      }

      // 3. Send book data to backend
      // Updated API endpoint: POST /books
      const res = await fetch(`${API_URL}/books`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          title: formData.title.trim(),
          author: formData.author.trim(),
          category: formData.category,
          description: formData.description.trim(),
          imageUrl,
          totalCopies,
        }),
      });

      const result = await res.json();

      if (!res.ok) {
        throw new Error(result.message || "Failed to add book.");
      }

      toast.success("Book successfully added!");

      setFormData(initialFormData);
      setImageFile(null);
      setPreviewUrl("");

      router.push("/my-books");
    } catch (error) {
      console.error("Add book error:", error);

      toast.error(
        error instanceof Error ? error.message : "Something went wrong!"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const inputClass =
    "h-12 rounded-2xl border-[#CCE0E0] bg-white pl-11 text-sm text-[#031716] shadow-sm focus-visible:border-[#0C969C] focus-visible:ring-2 focus-visible:ring-[#0C969C]/20 dark:border-[#274D60] dark:bg-[#031716] dark:text-[#F4F8F8]";

  const labelClass =
    "text-xs font-bold uppercase tracking-wider text-[#274D60] dark:text-[#6BA3BE]";

  return (
    <main className="min-h-screen bg-[#F4F8F8] px-4 pt-28 pb-12 dark:bg-[#031716] sm:px-6 lg:px-8 md:pt-32">
      <div className="mx-auto w-full max-w-3xl rounded-3xl border border-[#0C969C]/25 bg-[#F4F8F8] p-8 shadow-2xl backdrop-blur-xl dark:border-[#274D60]/50 dark:bg-[#032F30]">

        {/* Header */}
        <div className="mb-8 flex items-center gap-4 border-b border-[#0C969C]/15 pb-6 dark:border-[#274D60]/40">
          <div className="flex size-14 items-center justify-center rounded-2xl bg-linear-to-br from-[#0C969C] to-[#032F30] text-white shadow-lg shadow-[#0C969C]/30">
            <BookOpen className="h-7 w-7 text-white" />
          </div>

          <div>
            <h1 className="text-3xl font-black tracking-tight text-[#031716] dark:text-[#F4F8F8]">
              Add New Book
            </h1>
            <p className="text-sm font-medium text-[#274D60] dark:text-[#6BA3BE]">
              Share a book with the BookNook community.
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">

          {/* Title & Author */}
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="title" className={labelClass}>
                Book Title *
              </Label>

              <div className="relative flex items-center">
                <BookOpen className="pointer-events-none absolute left-4 h-4 w-4 text-[#0C969C]" />
                <Input
                  id="title"
                  name="title"
                  placeholder="Enter book title"
                  value={formData.title}
                  onChange={handleChange}
                  required
                  className={inputClass}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="author" className={labelClass}>
                Author Name *
              </Label>

              <div className="relative flex items-center">
                <User className="pointer-events-none absolute left-4 h-4 w-4 text-[#0C969C]" />
                <Input
                  id="author"
                  name="author"
                  placeholder="Enter author name"
                  value={formData.author}
                  onChange={handleChange}
                  required
                  className={inputClass}
                />
              </div>
            </div>
          </div>

          {/* Category & Total Copies */}
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="category" className={labelClass}>
                Category *
              </Label>

              <div className="relative flex items-center">
                <Layers className="pointer-events-none absolute left-4 z-10 h-4 w-4 text-[#0C969C]" />

                <select
                  id="category"
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="h-12 w-full appearance-none rounded-2xl border border-[#CCE0E0] bg-white pl-11 pr-4 text-sm font-medium text-[#031716] shadow-sm outline-none transition-all focus:border-[#0C969C] focus:ring-2 focus:ring-[#0C969C]/20 dark:border-[#274D60] dark:bg-[#031716] dark:text-[#F4F8F8]"
                >
                  {CATEGORIES.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="totalCopies" className={labelClass}>
                Total Copies *
              </Label>

              <div className="relative flex items-center">
                <Hash className="pointer-events-none absolute left-4 h-4 w-4 text-[#0C969C]" />
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
                  className={inputClass}
                />
              </div>
            </div>
          </div>

          {/* Book Cover Image */}
          <div className="space-y-2">
            <Label htmlFor="image" className={labelClass}>
              Book Cover Image *
            </Label>

            <div className="relative flex items-center">
              <ImageIcon className="pointer-events-none absolute left-4 z-10 h-4 w-4 text-[#0C969C]" />
              <Input
                id="image"
                name="image"
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className={`${inputClass} cursor-pointer pt-3 file:mr-4 file:cursor-pointer file:rounded-lg file:border-0 file:bg-[#0C969C]/10 file:px-3 file:py-1 file:text-xs file:font-bold file:text-[#0C969C]`}
              />
            </div>

            <p className="text-xs text-[#274D60] dark:text-[#6BA3BE]">
              JPG, PNG or WebP. Maximum 5MB.
            </p>

            {previewUrl && (
              <div className="mt-4 flex items-center gap-4 rounded-2xl border border-[#0C969C]/20 bg-white/70 p-4 backdrop-blur-sm dark:border-[#274D60] dark:bg-[#031716]/60">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={previewUrl}
                  alt="Book cover preview"
                  className="h-24 w-18 rounded-xl border border-[#0C969C]/30 object-cover shadow-md"
                />

                <div className="min-w-0">
                  <p className="text-xs font-bold uppercase tracking-wider text-[#0C969C]">
                    Selected Cover
                  </p>
                  <p className="truncate text-xs text-[#274D60] dark:text-[#6BA3BE]">
                    {imageFile?.name}
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description" className={labelClass}>
              Short Description *
            </Label>

            <div className="relative">
              <FileText className="pointer-events-none absolute left-4 top-4 h-4 w-4 text-[#0C969C]" />
              <Textarea
                id="description"
                name="description"
                placeholder="Write a short description about the book..."
                value={formData.description}
                onChange={handleChange}
                rows={4}
                required
                className="rounded-2xl border-[#CCE0E0] bg-white pl-11 text-sm text-[#031716] shadow-sm focus-visible:border-[#0C969C] focus-visible:ring-2 focus-visible:ring-[#0C969C]/20 dark:border-[#274D60] dark:bg-[#031716] dark:text-[#F4F8F8]"
              />
            </div>
          </div>

          {/* User Name & Email */}
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="userName" className={labelClass}>
                Your Name
              </Label>

              <div className="relative flex items-center">
                <User className="pointer-events-none absolute left-4 h-4 w-4 text-[#0C969C]" />
                <Input
                  id="userName"
                  value={isPending ? "Loading..." : user?.name || ""}
                  readOnly
                  className={`${inputClass} cursor-not-allowed opacity-80`}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="userEmail" className={labelClass}>
                Your Email
              </Label>

              <div className="relative flex items-center">
                <Mail className="pointer-events-none absolute left-4 h-4 w-4 text-[#0C969C]" />
                <Input
                  id="userEmail"
                  value={isPending ? "Loading..." : user?.email || ""}
                  readOnly
                  className={`${inputClass} cursor-not-allowed opacity-80`}
                />
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            disabled={isSubmitting || isPending || !user}
            className="w-full rounded-2xl bg-linear-to-r from-[#0C969C] to-[#0A7075] py-7 text-sm font-bold uppercase tracking-wider text-white shadow-xl shadow-[#0C969C]/30 transition-all hover:scale-[1.01] hover:shadow-2xl hover:shadow-[#0C969C]/40 active:scale-95 disabled:opacity-50"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                Uploading & Saving...
              </>
            ) : (
              <>
                <Plus className="mr-2 h-5 w-5" />
                Add Book
              </>
            )}
          </Button>
        </form>
      </div>
    </main>
  );
}
