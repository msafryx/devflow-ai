import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import cookieParser from "cookie-parser";

import recordsRouter from "./routes/records.js";
import authRouter from "./routes/auth.js";

dotenv.config();

const app = express();

// middlewares
app.use(cors({
  origin: process.env.FRONTEND_ORIGIN,
  credentials: true,
}));
app.use(express.json());
app.use(cookieParser());

// routes
app.use("/api/records", recordsRouter);
app.use("/auth", authRouter);

app.get("/", (req, res) => {
  res.send("DevFlow AI backend is running");
});

// connect DB & start
const PORT = process.env.PORT || 4000;

mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log("✅ Connected to MongoDB");
    app.listen(PORT, () => {
      console.log(`✅ Server listening on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("❌ MongoDB connection error:", err);
  });
