import { NextRequest, NextResponse } from "next/server";
import argon2 from "argon2";
import { connectToDb } from "@/lib/db";
import User from "@/lib/models/User";

export async function POST(request: NextRequest) {
  try {
    await connectToDb();

    const body = await request.json();
    const { fullName, email, password, confirmPassword, admin } = body;

    // making sure all fields are inputed
    if (!fullName || !email || !password || !confirmPassword) {
      return NextResponse.json(
        {
          error:
            "Missing required fields: fullName, email, and password are required",
        },
        { status: 400 }
      );
    }
    if (password !== confirmPassword) {
      return NextResponse.json(
        { error: "Passwords do not match" },
        { status: 400 }
      );
    }

    // testing iif the email is actually an email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: "Invalid email format" },
        { status: 400 }
      );
    }

    // argon2 hash
    const hashedPassword = await argon2.hash(password);

    // creating new user
    const user = new User({
      fullName,
      email,
      password: hashedPassword,
      admin: admin === true || admin === "true",
    });

    await user.save();

    return NextResponse.json(
      { message: "User created successfully", userId: user._id },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Error creating user:", error);

    // Handle duplicate key error (MongoDB unique constraint)
    if (error.code === 11000) {
      return NextResponse.json(
        { error: "User with this email already exists" },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
