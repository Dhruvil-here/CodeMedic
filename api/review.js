// api/review.js
import OpenAI from "openai";

// Initialize OpenAI client
const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Retry helper for stability
async function withRetries(fn, attempts = 3, delay = 1000) {
  let i = 0;
  while (i < attempts) {
    try {
      return await fn();
    } catch (err) {
      i++;
      if (i >= attempts) throw err;
      await new Promise((r) => setTimeout(r, delay * 2 ** (i - 1)));
    }
  }
}

export default async function handler(req, res) {
  try {
    if (req.method !== "POST") {
      return res.status(405).json({ error: "Method not allowed" });
    }

    const { code, language } = req.body;

    if (!code) {
      return res.status(400).json({ error: "Code is missing." });
    }

    const prompt = `
You are an expert-level software developer.

Review the following ${language} code and provide:

1. Code quality rating (Bad, Good, Better, Best)
2. Improvement suggestions using best practices
3. Step-by-step explanation of what the code does
4. List of potential bugs or logical issues
5. Syntax or runtime errors
6. Correct solutions with improved formatted code

Code:
${code}
`;

    const run = () =>
      client.chat.completions.create({
        model: "o4-mini",
        temperature: 0.2,
        messages: [{ role: "user", content: prompt }],
        max_tokens: 2000,
      });

    const completion = await withRetries(run, 3, 1200);

    const text = completion?.choices?.[0]?.message?.content || "No response.";

    res.status(200).json({ text });
  } catch (error) {
    console.error("REVIEW API ERROR:", error);
    res.status(500).json({
      error: "Server error reviewing code.",
      details: error.message,
    });
  }
}
