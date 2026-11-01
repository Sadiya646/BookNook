
"use client";

import { useState, type FormEvent, type ChangeEvent } from "react";
import { toast } from "sonner";
import {
  BookOpen,
  User,
  Mail,
  Plus,
  Image,
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
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
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
        error instanceof Error
          ? error.message
          : "Something went wrong!"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="mx-auto w-full max-w-2xl rounded-2xl bg-white p-6 shadow-lg">

      {/* Header */}
      <div className="mb-6 flex items-center gap-3">
        <div className="rounded-lg bg-blue-100 p-3">
          <BookOpen className="h-6 w-6 text-blue-600" />
        </div>

        <div>
          <h2 className="text-2xl font-bold text-gray-900">
            Add New Book
          </h2>
          <p className="text-sm text-gray-500">
            Add a new book to your collection.
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">

        {/* Book Title */}
        <div className="space-y-2">
          <Label htmlFor="title">Book Title *</Label>
          <Input
            id="title"
            name="title"
            placeholder="Enter book title"
            value={formData.title}
            onChange={handleChange}
            required
          />
        </div>

        {/* Author */}
        <div className="space-y-2">
          <Label htmlFor="author">Author Name *</Label>

          <div className="relative">
            <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />

            <Input
              id="author"
              name="author"
              placeholder="Enter author name"
              value={formData.author}
              onChange={handleChange}
              className="pl-10"
              required
            />
          </div>
        </div>

        {/* Category */}
        <div className="space-y-2">
          <Label htmlFor="category">Category</Label>

          <select
            id="category"
            name="category"
            value={formData.category}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                category: e.target.value,
              }))
            }
            className="w-full rounded-lg border border-gray-300 px-4 py-2"
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

        {/* Total Copies */}
        <div className="space-y-2">
          <Label htmlFor="totalCopies">Total Copies *</Label>

          <Input
            id="totalCopies"
            name="totalCopies"
            type="number"
            min="1"
            step="1"
            placeholder="Enter total copies"
            value={formData.totalCopies}
            onChange={handleChange}
            required
          />
        </div>

        {/* Image URL */}
        <div className="space-y-2">
          <Label htmlFor="image">Book Cover Image URL *</Label>

          <div className="relative">
            <Image className="absolute left-3 top-3 h-4 w-4 text-gray-400" />

            <Input
              id="image"
              name="image"
              type="url"
              placeholder="https://example.com/book-cover.jpg"
              value={formData.image}
              onChange={handleChange}
              className="pl-10"
              required
            />
          </div>

          {formData.image && (
            <div className="mt-3">
              <p className="mb-2 text-sm text-gray-500">
                Image Preview
              </p>

              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={formData.image}
                alt="Book cover preview"
                className="h-40 w-32 rounded-lg border object-cover"
                onError={(e) => {
                  e.currentTarget.style.display = "none";
                }}
              />
            </div>
          )}
        </div>

        {/* Description */}
        <div className="space-y-2">
          <Label htmlFor="description">Description *</Label>

          <Textarea
            id="description"
            name="description"
            placeholder="Write a short description about the book..."
            value={formData.description}
            onChange={handleChange}
            rows={5}
            required
          />
        </div>

        {/* Added By */}
        <div className="rounded-lg bg-gray-50 p-4">
          <p className="mb-3 text-sm font-semibold text-gray-700">
            Added By
          </p>

          {isPending ? (
            <p className="text-sm text-gray-500">
              Loading user information...
            </p>
          ) : user ? (
            <>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <User className="h-4 w-4" />
                {user.name}
              </div>

              <div className="mt-2 flex items-center gap-2 text-sm text-gray-600">
                <Mail className="h-4 w-4" />
                {user.email}
              </div>
            </>
          ) : (
            <p className="text-sm text-red-500">
              Please login to add a book.
            </p>
          )}
        </div>

        {/* Submit */}
        <Button
          type="submit"
          disabled={isSubmitting || isPending || !user}
          className="w-full"
        >
          {isSubmitting ? (
            "Processing..."
          ) : (
            <>
              <Plus className="mr-2 h-4 w-4" />
              Add Book
            </>
          )}
        </Button>

      </form>
    </div>
  );
}
