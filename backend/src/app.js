import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import ticketRoutes from "./routes/ticketRoutes.js";
dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());

connectDB();

// sample test route
app.get("/", (req, res) => {
  res.send("IT Support Backend Running 🚀");
});


app.use("/api/auth", authRoutes);
app.use("/api/tickets", ticketRoutes);

export default app;
