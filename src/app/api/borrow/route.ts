
import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";

export async function POST(req: Request) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session) {
      return NextResponse.json(
        { message: "Please login first." },
        { status: 401 }
      );
    }

    const { bookId, name, email } = await req.json();

    if (!bookId || !name?.trim() || !email?.trim()) {
      return NextResponse.json(
        { message: "Name and email are required." },
        { status: 400 }
      );
    }

    // Borrow করা email অবশ্যই logged-in account-এর email হতে হবে
    if (
      email.trim().toLowerCase() !==
      session.user.email.toLowerCase()
    ) {
      return NextResponse.json(
        { message: "Please enter your logged-in account email." },
        { status: 400 }
      );
    }

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/borrow`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-internal-secret": process.env.INTERNAL_API_SECRET || "",
          "x-user-email": session.user.email,
          "x-user-name": name.trim(),
        },
        body: JSON.stringify({ bookId }),
        cache: "no-store",
      }
    );

    const data = await response.json();

    return NextResponse.json(data, {
      status: response.status,
    });
  } catch (error) {
    console.error("Borrow API error:", error);

    return NextResponse.json(
      { message: "Failed to borrow book." },
      { status: 500 }
    );
  }
}
