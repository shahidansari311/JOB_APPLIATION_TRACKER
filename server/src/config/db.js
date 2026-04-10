import mongoose from "mongoose";

export const connectDB = async (retries = 5) => {
  for (let i = 0; i < retries; i++) {
    try {
      await mongoose.connect(process.env.MONGO_URI);
      console.log("MongoDB Connected ✅");
      return;
    } catch (error) {
      console.error(`DB Error (attempt ${i + 1}/${retries}):`, error.message);
      if (i < retries - 1) {
        const delay = Math.min(1000 * 2 ** i, 10000);
        console.log(`Retrying in ${delay / 1000}s...`);
        await new Promise((r) => setTimeout(r, delay));
      }
    }
  }
  console.error("Failed to connect to MongoDB after all retries. Server will continue running.");
};