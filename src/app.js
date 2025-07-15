import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import connectDb from "./config/db.js";
import { globalRateLimiter } from "./middleware/rateLimiter.js";
import indexRouter from "./router/index.js";

const app = express();

// DB connection
connectDb();

// Global middlewares
app.use(cors({
  origin: "*",
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
}));

// Global rate limiter (applies to all routes)
app.use(globalRateLimiter);

app.get("/", (req, res) => {
  res.send("Spyne.ai Backend is Running");
});

app.use(bodyParser.json());

// Main API routes
app.use("/api", indexRouter);

export default app;
