
"use client";

import { useEffect, useState, type FormEvent } from "react";
import {
  BookOpen,
  Pencil,
  Trash2,
  X,
  Loader2,
  Plus,
  Image as ImageIcon,
} from "lucide-react";
import { toast } from "sonner";

import { authClient } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

interface Book {
  _id: string;
  title: string;
  author: string;
  category: string;
  description: string;
  imageUrl: string;
  totalCopies: number;
  copies?: number;
  availableCopies?: number;
  userEmail: string;
}

interface BookFormData {
  title: string;
  author: string;
  category: string;
  description: string;
  imageUrl: string;
  totalCopies: string;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL;

const emptyForm: BookFormData = {
  title: "",
  author: "",
  category: "Fiction",
  description: "",
  imageUrl: "",
  totalCopies: "1",
};

export default function MyBooksPage() {
  const { data: session, isPending } = authClient.useSession();

  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);

  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const [formData, setFormData] = useState<BookFormData>(emptyForm);

  const [isSaving, setIsSaving] = useState(false);
  const [deletingBook, setDeletingBook] = useState<Book | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const user = session?.user;

  // Fetch logged-in user's books
  useEffect(() => {
    if (isPending) return;

    if (!user) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setBooks([]);
      setLoading(false);
      return;
    }

    const fetchMyBooks = async () => {
      try {
        setLoading(true);

        const res = await fetch(`${API_URL}/my-books`, {
          credentials: "include",
        });

        const result = await res.json();

        if (!res.ok) {
          throw new Error(result.message || "Failed to load books");
        }

        setBooks(result);
      } catch (error) {
        toast.error(
          error instanceof Error
            ? error.message
            : "Failed to load your books"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchMyBooks();
  }, [user?.email, isPending]);

  // Open edit modal with existing data
  const handleEdit = (book: Book) => {
    setSelectedBook(book);

    setFormData({
      title: book.title,
      author: book.author,
      category: book.category,
      description: book.description,
      imageUrl: book.imageUrl,
      totalCopies: String(book.totalCopies),
    });
  };

  // Handle form input changes
  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Update book
  const handleUpdate = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!selectedBook) return;

    const totalCopies = Number(formData.totalCopies);

    if (
      !formData.title.trim() ||
      !formData.author.trim() ||
      !formData.description.trim() ||
      !formData.imageUrl.trim() ||
      !Number.isInteger(totalCopies) ||
      totalCopies < 1
    ) {
      toast.error("Please fill in all fields correctly.");
      return;
    }

    try {
      const imageUrl = new URL(formData.imageUrl);

      if (!["http:", "https:"].includes(imageUrl.protocol)) {
        toast.error("Please enter a valid image URL.");
        return;
      }
    } catch {
      toast.error("Please enter a valid image URL.");
      return;
    }

    try {
      setIsSaving(true);

      const res = await fetch(
        `${API_URL}/my-books/${selectedBook._id}`,
        {
          method: "PUT",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            title: formData.title.trim(),
            author: formData.author.trim(),
            category: formData.category,
            description: formData.description.trim(),
            imageUrl: formData.imageUrl.trim(),
            totalCopies,
          }),
        }
      );

      const result = await res.json();

      if (!res.ok) {
        throw new Error(result.message || "Failed to update book");
      }

      // Update UI without reloading the page
      setBooks((prev) =>
        prev.map((book) =>
          book._id === selectedBook._id
            ? {
                ...book,
                ...formData,
                totalCopies,
              }
            : book
        )
      );

      toast.success("Book updated successfully!");

      setSelectedBook(null);
      setFormData(emptyForm);
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Something went wrong!"
      );
    } finally {
      setIsSaving(false);
    }
  };

  // Delete book
  const handleDelete = async () => {
    if (!deletingBook) return;

    try {
      setIsDeleting(true);

      const res = await fetch(
        `${API_URL}/my-books/${deletingBook._id}`,
        {
          method: "DELETE",
          credentials: "include",
        }
      );

      const result = await res.json();

      if (!res.ok) {
        throw new Error(result.message || "Failed to delete book");
      }

      // Remove deleted book from UI
      setBooks((prev) =>
        prev.filter((book) => book._id !== deletingBook._id)
      );

      toast.success("Book deleted successfully!");

      setDeletingBook(null);
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Failed to delete book"
      );
    } finally {
      setIsDeleting(false);
    }
  };

  // Loading
  if (isPending || loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Loader2 className="h-10 w-10 animate-spin text-[#0C969C]" />
      </div>
    );
  }

  // Login required
  if (!user) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 px-4 text-center">
        <BookOpen className="h-16 w-16 text-[#0C969C]" />

        <h2 className="text-2xl font-bold">
          Please Login First
        </h2>

        <p className="text-muted-foreground">
          You need to login to manage your books.
        </p>

        <Button
          onClick={() => {
            window.location.href = "/login";
          }}
          className="bg-[#0C969C] hover:bg-[#0A7075]"
        >
          Login Now
        </Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F4F8F8] px-4 py-12 dark:bg-[#031716] md:px-8">

      <div className="mx-auto max-w-7xl">

        {/* Page Header */}
        <div className="mb-10 flex flex-col justify-between gap-5 sm:flex-row sm:items-center">
          <div>
            <p className="mb-2 text-sm font-bold uppercase tracking-widest text-[#0C969C]">
              Personal Library
            </p>

            <h1 className="text-3xl font-black text-[#031716] dark:text-[#F4F8F8] md:text-4xl">
              My Books
            </h1>

            <p className="mt-2 text-sm text-[#274D60] dark:text-[#6BA3BE]">
              Manage the books you have added to BookNook.
            </p>
          </div>

          <Button
            onClick={() => {
              window.location.href = "/add-book";
            }}
            className="rounded-xl bg-[#0C969C] text-white hover:bg-[#0A7075]"
          >
            <Plus className="mr-2 h-4 w-4" />
            Add New Book
          </Button>
        </div>

        {/* Book Count */}
        <div className="mb-6 flex items-center gap-3">
          <div className="rounded-xl bg-[#0C969C]/10 p-3 text-[#0C969C]">
            <BookOpen className="h-6 w-6" />
          </div>

          <div>
            <p className="text-2xl font-black text-[#031716] dark:text-white">
              {books.length}
            </p>
            <p className="text-sm text-muted-foreground">
              Books Added By You
            </p>
          </div>
        </div>

        {/* Empty State */}
        {books.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-[#0C969C]/30 bg-white p-12 text-center dark:bg-[#032F30]">
            <BookOpen className="mx-auto mb-4 h-14 w-14 text-[#0C969C]" />

            <h2 className="text-xl font-bold text-[#031716] dark:text-white">
              No Books Found
            </h2>

            <p className="mt-2 text-sm text-muted-foreground">
              You have not added any books yet.
            </p>

            <Button
              onClick={() => {
                window.location.href = "/add-book";
              }}
              className="mt-6 bg-[#0C969C] hover:bg-[#0A7075]"
            >
              Add Your First Book
            </Button>
          </div>
        ) : (

          /* Books Grid */
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {books.map((book) => (
              <div
                key={book._id}
                className="overflow-hidden rounded-3xl border border-[#0C969C]/15 bg-white shadow-lg transition hover:-translate-y-1 hover:shadow-xl dark:border-[#274D60] dark:bg-[#032F30]"
              >
                <div className="relative h-64 bg-[#0C969C]/5">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={book.imageUrl}
                    alt={book.title}
                    className="h-full w-full object-contain p-4"
                  />

                  <span className="absolute right-4 top-4 rounded-full bg-[#0C969C] px-3 py-1 text-xs font-bold text-white">
                    {book.category}
                  </span>
                </div>

                <div className="p-5">
                  <h2 className="line-clamp-1 text-xl font-bold text-[#031716] dark:text-white">
                    {book.title}
                  </h2>

                  <p className="mt-1 text-sm text-[#0C969C]">
                    By {book.author}
                  </p>

                  <p className="mt-3 line-clamp-2 text-sm leading-relaxed text-[#274D60] dark:text-[#A7C5CC]">
                    {book.description}
                  </p>

                  <div className="mt-4 flex justify-between border-t border-[#0C969C]/15 pt-4 text-sm">
                    <span className="text-muted-foreground">
                      Total Copies
                    </span>

                    <span className="font-bold text-[#031716] dark:text-white">
                      {book.totalCopies}
                    </span>
                  </div>

                  <div className="mt-2 flex justify-between text-sm">
                    <span className="text-muted-foreground">
                      Available Copies
                    </span>

                    <span className="font-bold text-[#0C969C]">
                      {book.copies ?? book.availableCopies ?? book.totalCopies}
                    </span>
                  </div>

                  {/* Action Buttons */}
                  <div className="mt-5 grid grid-cols-2 gap-3">
                    <Button
                      onClick={() => handleEdit(book)}
                      variant="outline"
                      className="rounded-xl border-[#0C969C] text-[#0C969C] hover:bg-[#0C969C] hover:text-white"
                    >
                      <Pencil className="mr-2 h-4 w-4" />
                      Edit
                    </Button>

                    <Button
                      onClick={() => setDeletingBook(book)}
                      variant="destructive"
                      className="rounded-xl"
                    >
                      <Trash2 className="mr-2 h-4 w-4" />
                      Delete
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ================= EDIT MODAL ================= */}
      {selectedBook && (
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/60 p-4 backdrop-blur-sm">
          <div className="my-8 w-full max-w-2xl rounded-3xl bg-white p-6 shadow-2xl dark:bg-[#032F30] md:p-8">

            <div className="mb-6 flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-black text-[#031716] dark:text-white">
                  Edit Book
                </h2>

                <p className="mt-1 text-sm text-muted-foreground">
                  Update your book information.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setSelectedBook(null)}
                className="rounded-full p-2 transition hover:bg-red-100 hover:text-red-500"
                aria-label="Close edit modal"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleUpdate} className="space-y-4">

              <div className="space-y-2">
                <Label htmlFor="edit-title">Book Title</Label>
                <Input
                  id="edit-title"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-author">Author Name</Label>
                <Input
                  id="edit-author"
                  name="author"
                  value={formData.author}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="edit-category">Category</Label>

                  <select
                    id="edit-category"
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
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

                <div className="space-y-2">
                  <Label htmlFor="edit-copies">Total Copies</Label>
                  <Input
                    id="edit-copies"
                    name="totalCopies"
                    type="number"
                    min="1"
                    step="1"
                    value={formData.totalCopies}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-image">Book Cover Image URL</Label>

                <Input
                  id="edit-image"
                  name="imageUrl"
                  type="url"
                  value={formData.imageUrl}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-description">Description</Label>

                <Textarea
                  id="edit-description"
                  name="description"
                  rows={4}
                  value={formData.description}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="flex flex-col-reverse gap-3 pt-4 sm:flex-row sm:justify-end">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setSelectedBook(null)}
                  disabled={isSaving}
                >
                  Cancel
                </Button>

                <Button
                  type="submit"
                  disabled={isSaving}
                  className="bg-[#0C969C] text-white hover:bg-[#0A7075]"
                >
                  {isSaving ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    "Save Changes"
                  )}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================= DELETE CONFIRMATION MODAL ================= */}
      {deletingBook && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-3xl bg-white p-7 shadow-2xl dark:bg-[#032F30]">

            <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-red-100 text-red-600">
              <Trash2 className="h-8 w-8" />
            </div>

            <h2 className="text-center text-2xl font-black text-[#031716] dark:text-white">
              Delete Book?
            </h2>

            <p className="mt-3 text-center text-sm leading-relaxed text-muted-foreground">
              Are you sure you want to delete{" "}
              <span className="font-bold text-[#0C969C]">
                {deletingBook.title}
              </span>
              ? This action cannot be undone.
            </p>

            <div className="mt-7 flex flex-col-reverse gap-3 sm:flex-row">
              <Button
                type="button"
                variant="outline"
                className="flex-1 rounded-xl"
                onClick={() => setDeletingBook(null)}
                disabled={isDeleting}
              >
                Cancel
              </Button>

              <Button
                type="button"
                variant="destructive"
                className="flex-1 rounded-xl"
                onClick={handleDelete}
                disabled={isDeleting}
              >
                {isDeleting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Deleting...
                  </>
                ) : (
                  <>
                    <Trash2 className="mr-2 h-4 w-4" />
                    Yes, Delete
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
