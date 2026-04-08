import express from "express";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

import authRoutes from "./routes/auth.routes.js";
import userRoutes from "./routes/user.routes.js";
import applicationRoutes from "./routes/application.routes.js";
import aiRoutes from "./routes/ai.routes.js";
import errorHandler from "./middleware/error.middleware.js";

const app = express();

// Middleware
app.use(cors());
app.use(express.json({ limit: "10mb" })); // Allow larger payloads for JD text

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/applications", applicationRoutes);
app.use("/api/ai", aiRoutes);

// Health check
app.get("/", (req, res) => {
  res.json({ success: true, message: "API Running 🚀" });
});

// Global error handler (must be after routes)
app.use(errorHandler);

export default app;