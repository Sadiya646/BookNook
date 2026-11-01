
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { authClient } from "@/lib/auth-client";

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuGroup,
} from "@/components/ui/dropdown-menu";

type Props = {
  user: {
    name: string;
    email: string;
    image?: string | null;
  };
};

export default function UserMenu({ user }: Props) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const initials = user.name
    ?.split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase() || "U";

  const handleLogout = async () => {
    if (loading) return;

    setLoading(true);

    try {
      const { error } = await authClient.signOut();

      if (error) {
        toast.error("Could not log out. Please try again.");
        return;
      }

      toast.success("You have been logged out.");

      router.push("/");
      router.refresh();
    } catch (error) {
      console.error("Logout error:", error);
      toast.error("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <DropdownMenu>
      {/* Profile Avatar */}
      <DropdownMenuTrigger
        className="flex h-10 w-10 items-center justify-center rounded-full outline-none"
        aria-label="Open profile menu"
      >
        <Avatar className="size-10 ring-2 ring-gold">
          <AvatarImage
            src={user.image ?? undefined}
            alt={user.name}
            referrerPolicy="no-referrer"
          />

          <AvatarFallback className="bg-gold font-bold text-gold-foreground">
            {initials}
          </AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-64">

        {/* User Information */}
        <DropdownMenuGroup>
          <DropdownMenuLabel className="font-normal">
            <span className="block font-semibold">
              {user.name}
            </span>

            <span className="block break-all text-sm text-muted-foreground">
              {user.email}
            </span>
          </DropdownMenuLabel>
        </DropdownMenuGroup>

        <DropdownMenuSeparator />

        {/* My Profile */}
        <DropdownMenuItem
          onClick={() => router.push("/profile")}
        >
          My Profile
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        {/* Logout */}
        <DropdownMenuItem
          onClick={handleLogout}
          disabled={loading}
          className="font-semibold text-destructive"
        >
          {loading ? "Logging out..." : "Logout"}
        </DropdownMenuItem>

      </DropdownMenuContent>
    </DropdownMenu>
  );
}
