import { NextResponse } from "next/server";
import { connectToDb } from "@/lib/db";
import Animal from "@/lib/models/Animal";

export async function GET() {
	try {
		await connectToDb();

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
