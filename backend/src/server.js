import express from "express";
import dotenv from "dotenv";
dotenv.config();
import cookieParser from "cookie-parser";
import cors from "cors";
import authRoutes from "./routes/auth.route.js";
import userRoutes from "./routes/user.route.js";
import chatRoutes from "./routes/chat.route.js";
import path from "path";
import { connectDB } from "./lib/db.js";

const app = express();
const PORT = process.env.PORT || 5001;
const __dirname = path.resolve();

app.use(express.json()); // Middleware to parse JSON bodies
app.use(express.urlencoded({ extended: true })); // Middleware to parse URL-encoded bodies
app.use(cookieParser()); // for parsing cookies if needed

app.use(cors({
  origin: process.env.CLIENT_URL || "http://localhost:5173", // Allow requests from the frontend
  credentials: true, // Allow cookies to be sent with requests
}));

app.use("/api/auth", authRoutes);
app.use("/api/auth", userRoutes);
app.use("/api/chat", chatRoutes);

if(process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../frontend/dist")));
  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "../frontend/dist/index.html"));
  });
}
  
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  connectDB();
});
