
"use client";

import { useState, type FormEvent, type ChangeEvent } from "react";
import { toast } from "react-hot-toast";
import { BookOpen, ImagePlus, User, Mail, Plus } from "lucide-react";

import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const LOGGED_IN_USER = {
  name: "Aisha Rahman",
  email: "aisha@booknook.example",
};

export default function AddBookForm() {
  const [formData, setFormData] = useState({
    title: "",
    author: "",
    category: "Fiction",
    totalCopies: "1",
    description: "",
  });

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (file) {
      setImageFile(file);
    }
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (
      !formData.title.trim() ||
      !formData.author.trim() ||
      !formData.description.trim() ||
      Number(formData.totalCopies) < 1
    ) {
      toast.error("Please fill in all mandatory fields.");
      return;
    }

    setIsSubmitting(true);

    try {
      // Connect your Add Book API here.

      toast.success("Book successfully added to the catalog!");

      setFormData({
        title: "",
        author: "",
        category: "Fiction",
        totalCopies: "1",
        description: "",
      });

      setImageFile(null);
    } catch {
      toast.error("An error occurred. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const fieldClass =
    "h-11 rounded-xl border border-[#E7DED5] bg-[#FAF7F1] px-4 text-sm text-[#292A40] shadow-[inset_3px_3px_6px_#e9e4dc,inset_-3px_-3px_6px_#ffffff] placeholder:text-[#9998A0] focus-visible:border-[#A83238] focus-visible:ring-2 focus-visible:ring-[#A83238]/30 focus-visible:ring-offset-2 focus-visible:ring-offset-[#FAF7F1]";

  return (
    <main className="min-h-screen bg-[#FAF7F1] px-4 py-12 sm:px-6">
      <div className="mx-auto max-w-2xl">

        {/* Heading */}
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#FAF7F1] text-[#A83238] shadow-[6px_6px_12px_#e5e1db,-6px_-6px_12px_#ffffff]">
            <BookOpen size={27} />
          </div>

          <p className="mb-2 text-xs font-semibold uppercase tracking-[0.25em] text-[#A83238]">
            Share Your Collection
          </p>

          <h1 className="font-serif text-3xl font-bold text-[#292A40] sm:text-4xl">
            Add a <span className="text-[#A83238]">Book</span>
          </h1>

          <p className="mt-3 text-sm text-[#777783]">
            Share your favorite books with the BookNook community.
          </p>
        </div>

        {/* Form Card */}
        <div className="rounded-3xl border border-white/80 bg-[#FAF7F1] p-5 shadow-[12px_12px_28px_#e5e1db,-12px_-12px_28px_#ffffff] sm:p-8">

          <form onSubmit={handleSubmit} className="space-y-5">

            {/* Book Title */}
            <div className="space-y-2">
              <Label htmlFor="title" className="text-sm font-semibold text-[#292A40]">
                Book Title
              </Label>

              <Input
                id="title"
                placeholder="Enter the book title"
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
                className={fieldClass}
                required
              />
            </div>

            {/* Author */}
            <div className="space-y-2">
              <Label htmlFor="author" className="text-sm font-semibold text-[#292A40]">
                Author Name
              </Label>

              <Input
                id="author"
                placeholder="Enter the author"
                value={formData.author}
                onChange={(e) =>
                  setFormData({ ...formData, author: e.target.value })
                }
                className={fieldClass}
                required
              />
            </div>

            {/* Category and Copies */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">

              <div className="space-y-2">
                <Label className="text-sm font-semibold text-[#292A40]">
                  Category
                </Label>

                <Select
                  value={formData.category}
                  onValueChange={(value) =>
                    setFormData({ ...formData, category: value })
                  }
                >
                  <SelectTrigger className={`${fieldClass} w-full`}>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>

                  <SelectContent className="border-[#E7DED5] bg-[#FAF7F1] text-[#292A40]">
                    <SelectItem value="Fiction">Fiction</SelectItem>
                    <SelectItem value="Science">Science</SelectItem>
                    <SelectItem value="History">History</SelectItem>
                    <SelectItem value="Kids">Kids</SelectItem>
                    <SelectItem value="Non-Fiction">Non-Fiction</SelectItem>
                    <SelectItem value="Technology">Technology</SelectItem>
                    <SelectItem value="Others">Others</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="copies" className="text-sm font-semibold text-[#292A40]">
                  Total Copies
                </Label>

                <Input
                  id="copies"
                  type="number"
                  min="1"
                  value={formData.totalCopies}
                  onChange={(e) =>
                    setFormData({ ...formData, totalCopies: e.target.value })
                  }
                  className={fieldClass}
                  required
                />
              </div>
            </div>

            {/* Book Image */}
            <div className="space-y-2">
              <Label className="text-sm font-semibold text-[#292A40]">
                Book Image
              </Label>

              <label
                htmlFor="book-image"
                className="group flex min-h-28 cursor-pointer flex-col items-center justify-center rounded-xl border border-dashed border-[#D8C9C0] bg-[#FAF7F1] px-4 py-5 shadow-[inset_3px_3px_6px_#e9e4dc,inset_-3px_-3px_6px_#ffffff] transition hover:border-[#A83238] hover:bg-[#F8F3ED]"
              >
                <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-xl bg-[#FAF7F1] text-[#A83238] shadow-[4px_4px_8px_#e5e1db,-4px_-4px_8px_#ffffff] transition group-hover:scale-105">
                  <ImagePlus size={21} />
                </div>

                <p className="text-sm font-medium text-[#292A40]">
                  {imageFile ? imageFile.name : "Upload a cover image"}
                </p>

                <p className="mt-1 text-xs text-[#9998A0]">
                  PNG, JPG or WEBP
                </p>

                <input
                  id="book-image"
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />
              </label>
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Label htmlFor="description" className="text-sm font-semibold text-[#292A40]">
                Short Description
              </Label>

              <Textarea
                id="description"
                rows={4}
                placeholder="Write a few lines about the book..."
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                className={`${fieldClass} min-h-28 resize-none py-3`}
                required
              />
            </div>

            {/* User Information */}
            <div className="grid grid-cols-1 gap-4 pt-1 sm:grid-cols-2">

              <div className="flex h-11 items-center gap-2 rounded-xl border border-[#E7DED5] bg-[#F3EEE5] px-3 text-xs font-medium text-[#62636D] shadow-[inset_2px_2px_5px_#e6e0d7,inset_-2px_-2px_5px_#ffffff]">
                <User size={15} className="shrink-0 text-[#A83238]" />
                <span className="truncate">{LOGGED_IN_USER.name}</span>
              </div>

              <div className="flex h-11 items-center gap-2 rounded-xl border border-[#E7DED5] bg-[#F3EEE5] px-3 text-xs font-medium text-[#62636D] shadow-[inset_2px_2px_5px_#e6e0d7,inset_-2px_-2px_5px_#ffffff]">
                <Mail size={15} className="shrink-0 text-[#A83238]" />
                <span className="truncate">{LOGGED_IN_USER.email}</span>
              </div>
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={isSubmitting}
              className="h-12 w-full rounded-xl bg-[#A83238] text-sm font-bold tracking-wide text-white shadow-[5px_5px_12px_#e5d8d2,-5px_-5px_12px_#ffffff] transition-all hover:bg-[#85272D] active:scale-[0.98] disabled:opacity-50"
            >
              <Plus size={18} className="mr-2" />
              {isSubmitting ? "Processing..." : "Add Book"}
            </Button>

            <p className="text-center text-xs text-[#9998A0]">
              Every book has a story. Share yours with BookNook.
            </p>

          </form>
        </div>
      </div>
    </main>
  );
}
