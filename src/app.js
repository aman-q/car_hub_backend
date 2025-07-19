import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import connectDb from "./config/db.js";
import { globalRateLimiter } from "./middleware/rateLimiter.js";
import indexRouter from "./router/index.js";
// import { connectRabbitMQ } from './config/rabbitmq.js';

const app = express();
app.use(bodyParser.json());
// DB connection
connectDb();

// Global middlewares
app.use(cors({
  origin: "*",
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
}));
// connectRabbitMQ().catch((err) => {
//   console.error('RabbitMQ connection failed:', err);
//   process.exit(1); // Exit if critical
// });

// Global rate limiter (applies to all routes)
app.use(globalRateLimiter);

app.get("/", (req, res) => {
  res.send("Spyne.ai Backend is Running");
});



// Main API routes
app.use("/api", indexRouter);

export default app;
