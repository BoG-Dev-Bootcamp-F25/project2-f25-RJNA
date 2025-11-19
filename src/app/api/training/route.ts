import { NextRequest, NextResponse } from "next/server";
import { connectToDb } from "@/lib/db";
import Training from "@/lib/models/Training";
import Animal from "@/lib/models/Animal";
import { getUserFromToken } from "@/lib/auth";

export async function POST(request: NextRequest) {
	try {
		await connectToDb();

		const body = await request.json();
		const { title, description, hours, animalId, date } = body;

		// Require login
		const auth = await getUserFromToken();
		if (!auth) {
			return NextResponse.json(
				{ error: "Unauthorized: Login required" },
				{ status: 401 }
			);
		}
		const userId = auth.userId;

		// Validate fields
		if (!title || !description || hours === undefined || !animalId) {
			return NextResponse.json(
				{
					error:
						"Missing required fields: title, description, hours, and animalId",
				},
				{ status: 400 }
			);
		}

		if (typeof hours !== "number" || hours < 0) {
			return NextResponse.json(
				{ error: "hours must be a non-negative number" },
				{ status: 400 }
			);
		}

		// Check animal exists and belongs to the user
		const animal = await Animal.findById(animalId);
		if (!animal) {
			return NextResponse.json({ error: "Animal not found" }, { status: 400 });
		}

		if (animal.userId.toString() !== userId) {
			return NextResponse.json(
				{ error: "Unauthorized: Animal does not belong to you" },
				{ status: 403 }
			);
		}

		// Create training log
		const training = new Training({
			title,
			description,
			hours,
			userId,
			animalId,
			date: date ? new Date(date) : new Date(),
		});

		await training.save();

		// Update animal hours
		animal.hoursTrained = (animal.hoursTrained || 0) + hours;
		await animal.save();

		return NextResponse.json(
			{
				message: "Training log created successfully",
				trainingId: training._id,
			},
			{ status: 200 }
		);
	} catch (error: any) {
		console.error("Error creating training log:", error);

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
		const { trainingId, title, description, hours, date } = body;

		// Require login
		const auth = await getUserFromToken();
		if (!auth) {
			return NextResponse.json(
				{ error: "Unauthorized: Login required" },
				{ status: 401 }
			);
		}
		const userId = auth.userId;

		if (!trainingId) {
			return NextResponse.json(
				{ error: "Missing required field: trainingId" },
				{ status: 400 }
			);
		}

		// Fetch training log
		const training = await Training.findById(trainingId);
		if (!training) {
			return NextResponse.json(
				{ error: "Training log not found" },
				{ status: 400 }
			);
		}

		if (training.userId.toString() !== userId) {
			return NextResponse.json(
				{ error: "Unauthorized: You do not own this training log" },
				{ status: 403 }
			);
		}

		// Get animal
		const animal = await Animal.findById(training.animalId);
		if (!animal) {
			return NextResponse.json(
				{ error: "Animal associated with training log not found" },
				{ status: 400 }
			);
		}

		// Prepare update
		const updateData: any = {};
		let hoursDifference = 0;

		if (title !== undefined) updateData.title = title;
		if (description !== undefined) updateData.description = description;

		if (hours !== undefined) {
			if (typeof hours !== "number" || hours < 0) {
				return NextResponse.json(
					{ error: "hours must be a non-negative number" },
					{ status: 400 }
				);
			}
			hoursDifference = hours - training.hours;
			updateData.hours = hours;
		}

		if (date !== undefined) updateData.date = new Date(date);

		// Update training log
		const updatedTraining = await Training.findByIdAndUpdate(
			trainingId,
			updateData,
			{ new: true }
		);

		// Update animal hours
		if (hoursDifference !== 0) {
			animal.hoursTrained += hoursDifference;
			await animal.save();
		}

		return NextResponse.json(
			{
				message: "Training log updated successfully",
				training: updatedTraining,
			},
			{ status: 200 }
		);
	} catch (error: any) {
		console.error("Error updating training log:", error);

		if (error.name === "ValidationError") {
			return NextResponse.json({ error: error.message }, { status: 400 });
		}

		return NextResponse.json(
			{ error: "Internal server error" },
			{ status: 500 }
		);
	}
}

export async function GET(request: NextRequest) {
	try {
		await connectToDb();

		const user = await getUserFromToken();
		if (!user) {
			return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
		}

		const trainingLogs = await Training.find({ userId: user.userId });

		return NextResponse.json(trainingLogs, { status: 200 });
	} catch (error) {
		console.error("Error fetching Training Logs:", error);
		return NextResponse.json(
			{ error: "Failed to fetch training logs" },
			{ status: 500 }
		);
	}
}
