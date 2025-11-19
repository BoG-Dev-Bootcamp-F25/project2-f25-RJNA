import { NextResponse } from "next/server";
import { connectToDb } from "@/lib/db";
import User from "@/lib/models/User";
import { getUserFromToken } from "@/lib/auth";

export async function GET() {
	try {
		await connectToDb();

		// --- JWT + Admin check ---
		const user = await getUserFromToken();
		if (!user || !user.admin) {
			return NextResponse.json(
				{ error: "Unauthorized: Admin access required" },
				{ status: 401 }
			);
		}

		// Fetch all users except passwords
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
