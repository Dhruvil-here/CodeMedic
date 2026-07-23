import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

import { GoogleGenAI } from "@google/genai";

// Initialize OpenAI client
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

// Retry helper
async function withRetries(fn, attempts = 3, delay = 1000) {
  for (let i = 1; i <= attempts; i++) {
    try {
      return await fn();
    } catch (err) {
      if (i === attempts) throw err;
      await new Promise((resolve) => setTimeout(resolve, delay * i));
    }
  }
}

export default async function handler(req, res) {
  try {
    if (req.method !== "POST") {
      return res.status(405).json({ error: "Method not allowed" });
    }

    const { code, language } = req.body;

    if (!code || !language) {
      return res.status(400).json({ error: "Code or language is missing." });
    }

    const prompt = `
You are CodeMedic AI, an expert software engineer.

Fix the following ${language} code.

Rules:

- Fix ALL syntax errors.
- Fix ALL logical errors.
- Fix ALL runtime errors.
- Improve performance whenever possible.
- Preserve the original functionality.
- Use modern language features.
- Follow clean code principles.
- Add meaningful comments only where necessary.
- Keep formatting consistent.
- Do NOT remove functionality unless it is incorrect.

Return ONLY the corrected code.

Do NOT explain anything.

Do NOT wrap the response in markdown.

Code:

${code}
`;

    const run = () =>
      ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
      });

    const response = await withRetries(run);

    const text = response.text;

    return res.status(200).json({ text });
  } catch (error) {
    console.error("FIX API ERROR:", error);

    return res.status(500).json({
      error: "Fix API crashed.",
      details: error.message,
    });
  }
}
