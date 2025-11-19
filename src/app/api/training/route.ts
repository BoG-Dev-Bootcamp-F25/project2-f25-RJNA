import { NextRequest, NextResponse } from "next/server";
import { connectToDb } from "@/lib/db";
import Training from "@/lib/models/Training";
import Animal from "@/lib/models/Animal";
import { getUserIdFromToken } from "@/lib/auth";

// POST /api/training - create a training log
export async function POST(request: NextRequest) {
  try {
    await connectToDb();

    const body = await request.json();
    const { title, description, hours, animalId, date } = body;
    
    // Get userId from JWT token (if implemented) or request body
    const tokenUserId = await getUserIdFromToken();
    const userId = tokenUserId || body.userId;

    // Validate required fields
    if (!title || !description || hours === undefined || !userId || !animalId) {
      return NextResponse.json(
        { error: "Missing required fields: title, description, hours, userId, and animalId are required" },
        { status: 400 }
      );
    }

    // Validate userId and animalId are valid ObjectId formats
    if (!/^[0-9a-fA-F]{24}$/.test(userId)) {
      return NextResponse.json(
        { error: "Invalid userId format" },
        { status: 400 }
      );
    }

    if (!/^[0-9a-fA-F]{24}$/.test(animalId)) {
      return NextResponse.json(
        { error: "Invalid animalId format" },
        { status: 400 }
      );
    }

    // Validate hours is a number
    if (typeof hours !== "number" || hours < 0) {
      return NextResponse.json(
        { error: "hours must be a non-negative number" },
        { status: 400 }
      );
    }

    // Verify that the animal belongs to the user
    const animal = await Animal.findById(animalId);
    if (!animal) {
      return NextResponse.json(
        { error: "Animal not found" },
        { status: 400 }
      );
    }

    if (animal.userId.toString() !== userId) {
      return NextResponse.json(
        { error: "Animal does not belong to the specified user" },
        { status: 400 }
      );
    }

    // Create new training log
    const training = new Training({
      title,
      description,
      hours,
      userId,
      animalId,
      date: date ? new Date(date) : new Date(),
    });

    await training.save();

    // Update the animal's hoursTrained
    const newHoursTrained = (animal.hoursTrained || 0) + hours;
    await Animal.findByIdAndUpdate(animalId, { hoursTrained: newHoursTrained });

    return NextResponse.json(
      { message: "Training log created successfully", trainingId: training._id },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Error creating training log:", error);

    // Handle validation errors
    if (error.name === "ValidationError") {
      return NextResponse.json(
        { error: error.message },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// PATCH /api/training - edit training log (bonus)
export async function PATCH(request: NextRequest) {
  try {
    await connectToDb();

    const body = await request.json();
    const { trainingId, title, description, hours, date } = body;

    // Get userId from JWT token (if implemented) or request body
    const tokenUserId = await getUserIdFromToken();
    const userId = tokenUserId || body.userId;

    // Validate required fields
    if (!trainingId || !userId) {
      return NextResponse.json(
        { error: "Missing required fields: trainingId and userId are required" },
        { status: 400 }
      );
    }

    // Validate trainingId and userId are valid ObjectId formats
    if (!/^[0-9a-fA-F]{24}$/.test(trainingId)) {
      return NextResponse.json(
        { error: "Invalid trainingId format" },
        { status: 400 }
      );
    }

    if (!/^[0-9a-fA-F]{24}$/.test(userId)) {
      return NextResponse.json(
        { error: "Invalid userId format" },
        { status: 400 }
      );
    }

    // Find the training log
    const training = await Training.findById(trainingId);
    if (!training) {
      return NextResponse.json(
        { error: "Training log not found" },
        { status: 400 }
      );
    }

    // Ensure user matches
    if (training.userId.toString() !== userId) {
      return NextResponse.json(
        { error: "User does not match this training log" },
        { status: 400 }
      );
    }

    // Get the animal to update hoursTrained if hours changed
    const animal = await Animal.findById(training.animalId);
    if (!animal) {
      return NextResponse.json(
        { error: "Animal associated with training log not found" },
        { status: 400 }
      );
    }

    // Calculate the difference in hours if hours are being updated
    let hoursDifference = 0;
    if (hours !== undefined) {
      if (typeof hours !== "number" || hours < 0) {
        return NextResponse.json(
          { error: "hours must be a non-negative number" },
          { status: 400 }
        );
      }
      hoursDifference = hours - training.hours;
    }

    // Build update object
    const updateData: any = {};
    if (title !== undefined) updateData.title = title;
    if (description !== undefined) updateData.description = description;
    if (hours !== undefined) updateData.hours = hours;
    if (date !== undefined) updateData.date = new Date(date);

    // Update the training log
    const updatedTraining = await Training.findByIdAndUpdate(
      trainingId,
      updateData,
      { new: true }
    );

    // Update the animal's hoursTrained if hours changed
    if (hoursDifference !== 0) {
      const newHoursTrained = (animal.hoursTrained || 0) + hoursDifference;
      await Animal.findByIdAndUpdate(training.animalId, { hoursTrained: newHoursTrained });
    }

    return NextResponse.json(
      { message: "Training log updated successfully", training: updatedTraining },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Error updating training log:", error);

    // Handle validation errors
    if (error.name === "ValidationError") {
      return NextResponse.json(
        { error: error.message },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

