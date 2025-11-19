import { NextResponse } from "next/server";
import { connectToDb } from "@/lib/db";
import Animal from "@/lib/models/Animal";
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

		const animals = await Animal.find();
		return NextResponse.json(animals, { status: 200 });
	} catch (error) {
		console.error("Error fetching animals:", error);
		return NextResponse.json(
			{ error: "Failed to fetch animals" },
			{ status: 500 }
		);
	}
}
