import { NextResponse } from "next/server";
import { connectToDb } from "@/lib/db";
import Training from "@/lib/models/Training";
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

		const trainingLogs = await Training.find();
		return NextResponse.json(trainingLogs, { status: 200 });
	} catch (error) {
		console.error("Error fetching training logs:", error);
		return NextResponse.json(
			{ error: "Failed to fetch training logs" },
			{ status: 500 }
		);
	}
}
