import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

import OpenAI from "openai";

// Initialize OpenAI client
const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
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
You are a highly skilled senior software engineer.

Fix and improve the following ${language} code:

- Correct ALL syntax, logical, and runtime errors
- Optimize readability, performance, and structure
- Use modern best practices
- Return ONLY the corrected code (no explanations)

Code:
${code}
`;

    // OpenAI Responses API call
    const run = () =>
      client.responses.create({
        model: "gpt-4o-mini",
        input: prompt,
        max_output_tokens: 2000,
      });

    const completion = await withRetries(run);

    // ---- Safe Output Extraction ----
    let text = "No response.";

    if (completion?.output_text) {
      text = completion.output_text;
    } else if (completion?.output?.length) {
      text = completion.output
        .map((block) =>
          block.content
            ?.map((item) => (item.text ? item.text : ""))
            .join("\n")
        )
        .join("\n");
    }

    return res.status(200).json({ text });
  } catch (error) {
    console.error("FIX API ERROR:", error);

    return res.status(500).json({
      error: "Fix API crashed.",
      details: error.message,
    });
  }
}
