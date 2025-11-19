import { NextRequest, NextResponse } from "next/server";
import { connectToDb } from "@/lib/db";
import Animal from "@/lib/models/Animal";
import { getUserFromToken } from "@/lib/auth";

// POST /api/animal - create an animal
export async function POST(request: NextRequest) {
	try {
		await connectToDb();

		const body = await request.json();
		const { name, breed, hoursTrained, imageUrl } = body;

		const auth = await getUserFromToken();
		if (!auth) {
			return NextResponse.json(
				{ error: "Unauthorized: Login required" },
				{ status: 401 }
			);
		}
		const userId = auth.userId;

		if (!name || !breed) {
			return NextResponse.json(
				{ error: "Missing required fields: name and breed are required" },
				{ status: 400 }
			);
		}

		const animal = new Animal({
			name,
			breed,
			hoursTrained: hoursTrained ?? 0,
			userId,
			imageUrl: imageUrl || "",
		});

		await animal.save();

		return NextResponse.json(
			{ message: "Animal created successfully", animalId: animal._id },
			{ status: 200 }
		);
	} catch (error: any) {
		console.error("Error creating animal:", error);

		if (error.name === "ValidationError") {
			return NextResponse.json({ error: error.message }, { status: 400 });
		}

		return NextResponse.json(
			{ error: "Internal server error" },
			{ status: 500 }
		);
	}
}

export async function PATCH(request: NextRequest) {
	try {
		await connectToDb();

		const body = await request.json();
		const { animalId, hoursTrained } = body;

		const auth = await getUserFromToken();
		if (!auth) {
			return NextResponse.json(
				{ error: "Unauthorized: Login required" },
				{ status: 401 }
			);
		}
		const userId = auth.userId;

		if (!animalId || hoursTrained === undefined) {
			return NextResponse.json(
				{
					error:
						"Missing required fields: animalId and hoursTrained are required",
				},
				{ status: 400 }
			);
		}

		if (typeof hoursTrained !== "number" || hoursTrained < 0) {
			return NextResponse.json(
				{ error: "hoursTrained must be a non-negative number" },
				{ status: 400 }
			);
		}

		const animal = await Animal.findById(animalId);
		if (!animal) {
			return NextResponse.json({ error: "Animal not found" }, { status: 400 });
		}

		if (animal.userId.toString() !== userId) {
			return NextResponse.json(
				{ error: "Unauthorized: This animal does not belong to you" },
				{ status: 403 }
			);
		}

		animal.hoursTrained = hoursTrained;
		await animal.save();

		return NextResponse.json(
			{ message: "Animal updated successfully", animal },
			{ status: 200 }
		);
	} catch (error: any) {
		console.error("Error updating animal:", error);
		return NextResponse.json(
			{ error: "Internal server error" },
			{ status: 500 }
		);
	}
}
