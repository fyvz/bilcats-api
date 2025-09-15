import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import connectDB from "./config/db.js";
import { errorHandler } from "./middleware/errorHandler.js";
// Routes
import chatPageRouter from "./routes/chatPageRoutes.js";
import messageRouter from "./routes/chatRoutes.js";
import authRouter from "./routes/authRoutes.js";

const app = express(); //init app
const PORT = process.env.PORT || 8000;

//Connect to the database
connectDB();

//Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use("/api/chatpages", chatPageRouter);
app.use("/api/messages", messageRouter);
app.use("/api/auth", authRouter);

// 404 Fallback
app.use((req, res, next) => {
  const error = new Error(`Not found - ${req.originalUrl}`);
  res.status(404);
  next(error);
});
app.use(errorHandler);

//Start Server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
