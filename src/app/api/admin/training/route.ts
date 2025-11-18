import { NextResponse } from "next/server";
import { connectToDb } from "@/lib/db";
import Training from "@/lib/models/Training";

export async function GET() {
	try {
		await connectToDb();

		const trainingLogs = await Training.find();

		return NextResponse.json(trainingLogs, { status: 200 });
	} catch (error) {
		console.error("Error fetching training logs:", Error);
		return NextResponse.json(
			{ error: "Failed to fetch training logs" },
			{ status: 500 }
		);
	}
}
