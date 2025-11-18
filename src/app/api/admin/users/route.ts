import { NextResponse } from "next/server";
import { connectToDb } from "@/lib/db";
import User from "@/lib/models/User";

export async function GET() {
	try {
		await connectToDb();

		// get everything other than passwords
		const users = await User.find().select("-password");

		return NextResponse.json(users, { status: 200 });
	} catch (error) {
		console.error("Error fetching users:", error);
		return NextResponse.json(
			{ error: "Failed to fetch users" },
			{ status: 500 }
		);
	}
}
