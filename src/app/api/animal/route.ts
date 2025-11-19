import { NextRequest, NextResponse } from "next/server";
import { connectToDb } from "@/lib/db";
import Animal from "@/lib/models/Animal";
import { getUserIdFromToken } from "@/lib/auth";

// POST /api/animal - create an animal
export async function POST(request: NextRequest) {
  try {
    await connectToDb();

    const body = await request.json();
    const { name, breed, hoursTrained, imageUrl } = body;
    
    // Get userId from JWT token (if implemented) or request body
    const tokenUserId = await getUserIdFromToken();
    const userId = tokenUserId || body.userId;

    // Validate required fields
    if (!name || !breed || !userId) {
      return NextResponse.json(
        { error: "Missing required fields: name, breed, and userId are required" },
        { status: 400 }
      );
    }

    // Validate userId is a valid ObjectId format
    if (!/^[0-9a-fA-F]{24}$/.test(userId)) {
      return NextResponse.json(
        { error: "Invalid userId format" },
        { status: 400 }
      );
    }

    // Create new animal
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

// PATCH /api/animal - update hoursTrained
export async function PATCH(request: NextRequest) {
  try {
    await connectToDb();

    const body = await request.json();
    const { animalId, hoursTrained } = body;

    // Validate required fields
    if (!animalId || hoursTrained === undefined) {
      return NextResponse.json(
        { error: "Missing required fields: animalId and hoursTrained are required" },
        { status: 400 }
      );
    }

    // Validate animalId is a valid ObjectId format
    if (!/^[0-9a-fA-F]{24}$/.test(animalId)) {
      return NextResponse.json(
        { error: "Invalid animalId format" },
        { status: 400 }
      );
    }

    // Validate hoursTrained is a number
    if (typeof hoursTrained !== "number" || hoursTrained < 0) {
      return NextResponse.json(
        { error: "hoursTrained must be a non-negative number" },
        { status: 400 }
      );
    }

    // Find and update the animal
    const animal = await Animal.findByIdAndUpdate(
      animalId,
      { hoursTrained },
      { new: true }
    );

    if (!animal) {
      return NextResponse.json(
        { error: "Animal not found" },
        { status: 400 }
      );
    }

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

