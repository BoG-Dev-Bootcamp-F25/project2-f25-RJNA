import mongoose from "mongoose";

export const connectToDb = async () => {
  // Check if already connected
  if (mongoose.connections[0].readyState) {
    return;
  }

  if (!process.env.DB_URL) {
    throw new Error("DB_URL environment variable is not set");
  }

  try {
    await mongoose.connect(process.env.DB_URL, {
      ...(process.env.DB_NAME && { dbName: process.env.DB_NAME }),
    });
    console.log("Connected to MongoDB");
  } catch (error) {
    console.error("Error connecting to database:", error);
    throw error;
  }
};

