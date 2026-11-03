
"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import {
  UserRound,
  Mail,
  MapPin,
  BookOpen,
  Bookmark,
  Pencil,
  Camera,
  Loader2,
  X,
  Save,
} from "lucide-react";
import { authClient } from "@/lib/auth-client";
import { getToken } from "@/lib/get-token";
import { toast } from "sonner";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

type ProfileUser = {
  name: string;
  email: string;
  image?: string | null;
  location?: string;
  bio?: string;
};

type Book = {
  _id: string;
  title: string;
  author: string;
  imageUrl?: string;
};

type Borrow = {
  _id: string;
  bookTitle: string;
  bookAuthor: string;
  bookImage?: string;
  borrowDate: string;
  dueDate: string;
  status: string;
};

export default function ProfilePage() {
  const { data: session, isPending } = authClient.useSession();

  const [books, setBooks] = useState<Book[]>([]);
  const [borrows, setBorrows] = useState<Borrow[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);

  const user = session?.user as ProfileUser | undefined;

  const [formData, setFormData] = useState({
    name: "",
    image: "",
    location: "",
    bio: "",
  });

  useEffect(() => {
    if (!user) return;

    // eslint-disable-next-line react-hooks/set-state-in-effect
    setFormData({
      name: user.name || "",
      image: user.image || "",
      location: user.location || "",
      bio: user.bio || "",
    });
  }, [user]);

  useEffect(() => {
    if (!user) return;

    const fetchProfileData = async () => {
      try {
        const token = await getToken();

        const headers = {
          Authorization: `Bearer ${token}`,
        };

        const [booksRes, borrowsRes] = await Promise.all([
          fetch(`${API_URL}/my-books`, { headers, cache: "no-store" }),
          fetch(`${API_URL}/my-borrows`, { headers, cache: "no-store" }),
        ]);

        if (booksRes.ok) {
          const booksData = await booksRes.json();
          setBooks(Array.isArray(booksData) ? booksData : []);
        }

        if (borrowsRes.ok) {
          const borrowsData = await borrowsRes.json();
          setBorrows(Array.isArray(borrowsData) ? borrowsData : []);
        }
      } catch (error) {
        console.error("Profile data error:", error);
        toast.error("Could not load profile information.");
      } finally {
        setLoading(false);
      }
    };

    fetchProfileData();
  }, [user]);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      toast.error("Name is required.");
      return;
    }

    setSaving(true);

    try {
      const result = await authClient.updateUser({
        name: formData.name.trim(),
        image: formData.image.trim() || undefined,
        location: formData.location.trim(),
        bio: formData.bio.trim(),
      } as Parameters<typeof authClient.updateUser>[0]);

      if (result.error) {
        toast.error(result.error.message || "Profile update failed.");
        return;
      }

      toast.success("Profile updated successfully!");
      setOpenEdit(false);

      await authClient.getSession();
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong.");
    } finally {
      setSaving(false);
    }
  };

  if (isPending || (user && loading)) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <Loader2 className="animate-spin text-[#0C969C]" size={35} />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center gap-4">
        <UserRound size={45} className="text-[#0C969C]" />
        <h2 className="text-xl font-bold">Please login to view your profile</h2>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-[#F4F8F8] dark:bg-[#031716] py-12 px-4">
      <div className="max-w-6xl mx-auto space-y-8">

        {/* Profile Header */}
        <section className="bg-[#032F30] rounded-3xl p-7 md:p-10 text-white">
          <div className="flex flex-col md:flex-row items-center gap-6">
            <div className="relative w-28 h-28 rounded-full overflow-hidden bg-[#274D60] border-4 border-[#0C969C]">
              {user.image ? (
                <Image
                  src={user.image}
                  alt={user.name}
                  fill
                  unoptimized
                  className="object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <UserRound size={48} />
                </div>
              )}
            </div>

            <div className="flex-1 text-center md:text-left">
              <p className="text-[#A7C5CC] text-sm mb-1">
                Welcome to your profile
              </p>
              <h1 className="text-3xl font-bold">{user.name}</h1>
              <p className="text-[#A7C5CC] mt-2 flex items-center justify-center md:justify-start gap-2">
                <Mail size={16} /> {user.email}
              </p>
              <p className="text-[#E5CD82] text-sm mt-3">
                BookNook Member
              </p>
            </div>

            <button
              onClick={() => setOpenEdit(true)}
              className="flex items-center gap-2 bg-[#E5CD82] text-[#032F30] px-5 py-3 rounded-xl font-semibold hover:bg-[#FFF2B4] transition"
            >
              <Pencil size={17} />
              Edit Profile
            </button>
          </div>
        </section>

        {/* Statistics */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {[
            {
              label: "Books Added",
              value: books.length,
              icon: BookOpen,
            },
            {
              label: "Currently Borrowed",
              value: borrows.length,
              icon: Bookmark,
            },
            {
              label: "Member",
              value: "Active",
              icon: UserRound,
            },
          ].map((item) => {
            const Icon = item.icon;

            return (
              <div
                key={item.label}
                className="bg-white dark:bg-[#032F30] rounded-2xl p-6 border border-[#A7C5CC]/40 dark:border-[#274D60] shadow-sm"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {item.label}
                    </p>
                    <h2 className="text-3xl font-bold text-[#032F30] dark:text-white mt-2">
                      {item.value}
                    </h2>
                  </div>
                  <div className="w-12 h-12 rounded-xl bg-[#0C969C]/10 text-[#0C969C] flex items-center justify-center">
                    <Icon size={24} />
                  </div>
                </div>
              </div>
            );
          })}
        </section>

        {/* Personal Information */}
        <section className="bg-white dark:bg-[#032F30] rounded-2xl p-6 md:p-8 border border-[#A7C5CC]/40 dark:border-[#274D60]">
          <h2 className="text-xl font-bold text-[#032F30] dark:text-white mb-6">
            Personal Information
          </h2>

          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <p className="text-sm text-gray-500 mb-2">Full Name</p>
              <p className="font-semibold text-[#032F30] dark:text-white flex items-center gap-2">
                <UserRound size={17} className="text-[#0C969C]" />
                {user.name}
              </p>
            </div>

            <div>
              <p className="text-sm text-gray-500 mb-2">Email Address</p>
              <p className="font-semibold text-[#032F30] dark:text-white flex items-center gap-2">
                <Mail size={17} className="text-[#0C969C]" />
                {user.email}
              </p>
            </div>

            <div>
              <p className="text-sm text-gray-500 mb-2">Location</p>
              <p className="font-semibold text-[#032F30] dark:text-white flex items-center gap-2">
                <MapPin size={17} className="text-[#0C969C]" />
                {user.location || "Not added yet"}
              </p>
            </div>

            <div>
              <p className="text-sm text-gray-500 mb-2">About Me</p>
              <p className="font-semibold text-[#032F30] dark:text-white">
                {user.bio || "No bio added yet"}
              </p>
            </div>
          </div>
        </section>

        {/* Currently Borrowed Books */}
        <section className="bg-white dark:bg-[#032F30] rounded-2xl p-6 md:p-8 border border-[#A7C5CC]/40 dark:border-[#274D60]">
          <h2 className="text-xl font-bold text-[#032F30] dark:text-white mb-6">
            Currently Borrowed Books
          </h2>

          {borrows.length === 0 ? (
            <p className="text-gray-500 text-center py-8">
              You have not borrowed any books yet.
            </p>
          ) : (
            <div className="space-y-4">
              {borrows.map((borrow) => (
                <div
                  key={borrow._id}
                  className="flex items-center gap-4 p-4 rounded-xl bg-[#F4F8F8] dark:bg-[#031716]"
                >
                  {borrow.bookImage && (
                    <div className="relative w-14 h-20 shrink-0">
                      <Image
                        src={borrow.bookImage}
                        alt={borrow.bookTitle}
                        fill
                        unoptimized
                        className="object-cover rounded-md"
                      />
                    </div>
                  )}

                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-[#032F30] dark:text-white truncate">
                      {borrow.bookTitle}
                    </h3>
                    <p className="text-sm text-gray-500">
                      {borrow.bookAuthor}
                    </p>
                    <p className="text-xs text-[#0C969C] mt-2">
                      Due: {new Date(borrow.dueDate).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Edit Profile Modal */}
        {openEdit && (
          <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
            <div className="bg-white dark:bg-[#032F30] w-full max-w-lg rounded-2xl p-6 shadow-xl max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-[#032F30] dark:text-white">
                  Edit Profile
                </h2>
                <button
                  onClick={() => setOpenEdit(false)}
                  className="text-gray-500 hover:text-red-500"
                >
                  <X size={22} />
                </button>
              </div>

              <form onSubmit={handleUpdateProfile} className="space-y-5">
                <div>
                  <label className="text-sm font-medium block mb-2">
                    Profile Image URL
                  </label>
                  <div className="relative">
                    <Camera className="absolute left-3 top-3 text-gray-400" size={18} />
                    <input
                      type="url"
                      value={formData.image}
                      onChange={(e) =>
                        setFormData({ ...formData, image: e.target.value })
                      }
                      placeholder="https://example.com/photo.jpg"
                      className="w-full border rounded-xl pl-10 pr-4 py-3 bg-transparent outline-none focus:ring-2 focus:ring-[#0C969C]"
                    />
                  </div>
                  <p className="text-xs text-gray-500 mt-2">
                    Add an image URL to update your profile picture.
                  </p>
                </div>

                <div>
                  <label className="text-sm font-medium block mb-2">
                    Full Name
                  </label>
                  <input
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    required
                    className="w-full border rounded-xl px-4 py-3 bg-transparent outline-none focus:ring-2 focus:ring-[#0C969C]"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium block mb-2">
                    Location
                  </label>
                  <input
                    value={formData.location}
                    onChange={(e) =>
                      setFormData({ ...formData, location: e.target.value })
                    }
                    placeholder="City, Country"
                    className="w-full border rounded-xl px-4 py-3 bg-transparent outline-none focus:ring-2 focus:ring-[#0C969C]"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium block mb-2">
                    Bio
                  </label>
                  <textarea
                    value={formData.bio}
                    onChange={(e) =>
                      setFormData({ ...formData, bio: e.target.value })
                    }
                    placeholder="Write something about yourself..."
                    rows={3}
                    className="w-full border rounded-xl px-4 py-3 bg-transparent outline-none focus:ring-2 focus:ring-[#0C969C] resize-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={saving}
                  className="w-full flex items-center justify-center gap-2 bg-[#0C969C] text-white py-3 rounded-xl font-semibold hover:bg-[#087d82] disabled:opacity-60 transition"
                >
                  {saving ? (
                    <Loader2 className="animate-spin" size={18} />
                  ) : (
                    <Save size={18} />
                  )}
                  {saving ? "Saving..." : "Save Changes"}
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
