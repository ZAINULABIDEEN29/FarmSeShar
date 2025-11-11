import dotenv from "dotenv";
dotenv.config();
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import helmet from "helmet";
import morgan from "morgan";
import connectDB from "./db/db.js";
import { errorHandler } from "./middlewares/errorHandler.middleware.js";
import userRoutes from "./routes/user.routes.js"
import type { Request, Response, NextFunction } from "express";

const app = express();

const PORT = process.env.PORT || 5000;

connectDB();

// Middleware
app.use(cors({ origin: process.env.CLIENT_URL, credentials: true }));
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(helmet());
app.use(morgan("dev"));
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
    if (err instanceof SyntaxError && "body" in err) {
        return res.status(400).json({ 
            success: false, 
            message: "Invalid JSON" 
        });
    }
    next(err);
});


app.use("/api/users", userRoutes);

app.get("/", (_req, res) => res.json({ status: "OK" }));

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
