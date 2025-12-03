import 'dotenv/config';
import express from "express";
import cors from "cors";

import recommendRouter from "./api/recommend.js";

const app = express();
app.use(cors());
app.use(express.json());

// All API endpoints here:
app.use("/api/recommend", recommendRouter);

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`Backend server running on port ${PORT}`);
});
