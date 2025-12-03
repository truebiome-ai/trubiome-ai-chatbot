import express from "express";
import cors from "cors";
import "dotenv/config";
import recommendRouter from "./api/recommend.js";

const app = express();
app.use(cors());
app.use(express.json());

// Test route
app.get("/", (req, res) => {
  res.send("TruBiome backend is running.");
});

// API route
app.use("/api/recommend", recommendRouter);

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`Backend server running on port ${PORT}`);
});
