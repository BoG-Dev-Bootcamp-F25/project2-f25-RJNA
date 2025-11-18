import { NextRequest, NextResponse } from "next/server";
import argon2 from "argon2";
import { connectToDb } from "@/lib/db";
import User from "@/lib/models/User";

export async function POST(request: NextRequest) {
  try {
    await connectToDb();

    const body = await request.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 500 }
      );
    }

    const user = await User.findOne({ email });
    if (!user) {
      return NextResponse.json(
        { error: "Invalid email or password" },
        { status: 500 }
      );
    }

    const isPasswordValid = await argon2.verify(user.password, password);
    if (!isPasswordValid) {
      return NextResponse.json(
        { error: "Invalid email or password" },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        userId: user._id.toString(),
        admin: user.admin,
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Error verifying user:", error);
    return NextResponse.json(
      { error: "Invalid email or password" },
      { status: 500 }
    );
  }
}
