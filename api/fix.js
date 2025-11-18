// api/fix.js
import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

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
You are a senior software engineer.
Fix all syntax, logical, and runtime errors in this ${language} code.
Optimize the code for readability and performance.
Return ONLY the corrected code with no explanation.

Code:
${code}
`;

    const run = () =>
      client.chat.completions.create({
        model: "o4-mini",
        temperature: 0.0,
        messages: [{ role: "user", content: prompt }],
        max_tokens: 2000,
      });

    const completion = await withRetries(run, 3, 1200);

    const text = completion?.choices?.[0]?.message?.content || "No response.";

    res.status(200).json({ text });
  } catch (error) {
    console.error("FIX API ERROR:", error);
    res.status(500).json({
      error: "Server error fixing code.",
      details: error.message,
    });
  }
}
