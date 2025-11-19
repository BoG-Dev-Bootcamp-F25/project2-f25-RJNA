import { NextRequest, NextResponse } from "next/server";
import argon2 from "argon2";
import { connectToDb } from "@/lib/db";
import User from "@/lib/models/User";
import jwt from "jsonwebtoken";

export async function POST(request: NextRequest) {
  try {
    await connectToDb();

    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 }
      );
    }

    const user = await User.findOne({ email });
    if (!user) {
      return NextResponse.json(
        { error: "Invalid email or password" },
        { status: 400 }
      );
    }

    const isPasswordValid = await argon2.verify(user.password, password);
    if (!isPasswordValid) {
      return NextResponse.json(
        { error: "Invalid email or password" },
        { status: 400 }
      );
    }

    // 🔥 Create JWT
    const token = jwt.sign(
      { userId: user._id.toString(), admin: user.admin },
      process.env.JWT_SECRET!,
      { expiresIn: "7d" }
    );

    // 🔥 Set cookie
    const response = NextResponse.json(
      {
        message: "Login successful",
        userId: user._id.toString(),
        fullName: user.fullName,
        admin: user.admin,
      },
      { status: 200 }
    );

    response.cookies.set("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60,
      path: "/",
    });

    return response;
  } catch (error) {
    console.error("Error verifying user:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
