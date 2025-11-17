import mongoose from "mongoose";

let connected = false;

export const connectToDb = async () => {
  if (!connected) {
    if (!process.env.DB_URL) {
      throw new Error("DB_URL environment variable is not set");
    }
    await mongoose.connect(process.env.DB_URL);
    connected = true;
    console.log("Connected to MongoDB");
  }
};

