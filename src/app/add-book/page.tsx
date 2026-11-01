
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

import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

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
    image: "",
  });

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

  const handleSubmit = async (
    e: FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    if (
      !formData.title.trim() ||
      !formData.author.trim() ||
      !formData.description.trim() ||
      !formData.image.trim() ||
      Number(formData.totalCopies) < 1
    ) {
      toast.error("Please fill in all required fields.");
      return;
    }

    try {
      new URL(formData.image);
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
            ...formData,
            totalCopies: Number(formData.totalCopies),
            availableCopies: Number(formData.totalCopies),
            addedBy: LOGGED_IN_USER,
          }),
        }
      );

      const result = await res.json();

      if (!res.ok) {
        throw new Error(
          result.message || "Failed to add book"
        );
      }

      toast.success("Book successfully added!");

      setFormData({
        title: "",
        author: "",
        category: "Fiction",
        totalCopies: "1",
        description: "",
        image: "",
      });
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

          {/* Image Preview */}
          {formData.image && (
            <div className="mt-3">
              <p className="mb-2 text-sm text-gray-500">
                Image Preview
              </p>

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

          <div className="flex items-center gap-2 text-sm text-gray-600">
            <User className="h-4 w-4" />
            {LOGGED_IN_USER.name}
          </div>

          <div className="mt-2 flex items-center gap-2 text-sm text-gray-600">
            <Mail className="h-4 w-4" />
            {LOGGED_IN_USER.email}
          </div>
        </div>

        {/* Submit */}
        <Button
          type="submit"
          disabled={isSubmitting}
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
