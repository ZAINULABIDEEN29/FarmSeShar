import express from "express";
// import cors from "cors";
import cookieParser from "cookie-parser";
import helmet from "helmet";
import morgan from "morgan";
// import authRoutes from "./routes/auth.routes";

const app = express();

// Middleware
// app.use(cors({ origin: process.env.CLIENT_URL, credentials: true }));
app.use(cookieParser());
app.use(express.json());
app.use(helmet());
app.use(morgan("dev"));

// Routes
// app.use("/api/auth", authRoutes);

// Health check
app.get("/", (_req, res) => res.json({ status: "OK" }));

export default app;
