import express from "express";
import OpenAI from "openai";
import { createClient } from "@supabase/supabase-js";

const router = express.Router();

// Supabase client
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

router.post("/", async (req, res) => {
  try {
    const apiKeyHeader = req.headers.authorization?.replace("Bearer ", "");
    const { message } = req.body;

    if (!apiKeyHeader) {
      return res.status(400).json({ error: "Missing Authorization header." });
    }

    // Validate client API key in Supabase
    const { data: client } = await supabase
      .from("clients")
      .select("*")
      .eq("api_key", apiKeyHeader)
      .single();

    if (!client || !client.active) {
      return res.status(401).json({ error: "Invalid or inactive API key." });
    }

    // OpenAI
    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });

    const response = await openai.responses.create({
      model: "gpt-4.1",
      input: `User symptoms: ${message}. Recommend supplements with clinical reasoning.`,
    });

    return res.json({
      reply: response.output[0].content[0].text,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Server error." });
  }
});

export default router;
