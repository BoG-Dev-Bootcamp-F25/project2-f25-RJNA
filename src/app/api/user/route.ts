import { NextRequest, NextResponse } from "next/server";
import argon2 from "argon2";
import { connectToDb } from "@/lib/db";
import User from "@/lib/models/User";
import jwt from "jsonwebtoken";

export async function POST(request: NextRequest) {
	try {
		await connectToDb();

		const { fullName, email, password, confirmPassword, admin } =
			await request.json();

		if (!fullName || !email || !password || !confirmPassword) {
			return NextResponse.json(
				{ error: "Missing required fields" },
				{ status: 400 }
			);
		}

		if (password !== confirmPassword) {
			return NextResponse.json(
				{ error: "Passwords do not match" },
				{ status: 400 }
			);
		}

		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		if (!emailRegex.test(email)) {
			return NextResponse.json({ error: "Invalid email" }, { status: 400 });
		}

		const hashedPassword = await argon2.hash(password);

		const user = new User({
			fullName,
			email,
			password: hashedPassword,
			admin: admin === true || admin === "true",
		});

		await user.save();

		// Create JWT
		const token = jwt.sign(
			{ userId: user._id.toString(), admin: user.admin },
			process.env.JWT_SECRET!,
			{ expiresIn: "7d" }
		);

		// Set cookie
		const response = NextResponse.json(
			{
				message: "User created successfully",
				userId: user._id.toString(),
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
	} catch (error: any) {
		console.error("Error creating user:", error);

		if (error.code === 11000) {
			return NextResponse.json(
				{ error: "Email already exists" },
				{ status: 400 }
			);
		}

		return NextResponse.json(
			{ error: "Internal server error" },
			{ status: 500 }
		);
	}
}
