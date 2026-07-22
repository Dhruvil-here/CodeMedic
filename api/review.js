import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });
import OpenAI from "openai";

// Initialize OpenAI client
const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Retry helper
async function withRetries(fn, attempts = 3, delay = 1000) {
  let i = 0;
  while (i < attempts) {
    try {
      return await fn();
    } catch (err) {
      i++;
      if (i >= attempts) throw err;
      await new Promise((resolve) =>
        setTimeout(resolve, delay * Math.pow(2, i - 1))
      );
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
You are an expert-level senior software developer.

Review the following ${language} code and provide:

1. Code quality rating (Bad / Good / Better / Best)
2. Detailed suggestions for improving readability & performance
3. Explanation of what the code does (step-by-step)
4. List of potential bugs or logical errors
5. List of syntax or runtime errors
6. Provide corrected solutions with properly formatted code

Code:
${code}
`;

    // NEW OpenAI v4 syntax (Responses API)
    const run = () =>
      client.responses.create({
        model: "gpt-4o-mini",
        input: prompt,
      });

    const completion = await withRetries(run, 3, 1200);

    // UNIVERSAL response extractor (works for ALL OpenAI output formats)
    let text = "";

    // 1. Direct text (best case)
    if (completion?.output_text) {
      text = completion.output_text;
    }

    // 2. Modern content-block format
    else if (completion?.output && Array.isArray(completion.output)) {
      text = completion.output
        .map((block) =>
          block.content?.map((c) => c.text).join("\n")
        )
        .join("\n");
    }

    // 3. Fallback
    else {
      text = "No formatted response received.";
    }

    return res.status(200).json({ text });
  } catch (error) {
    console.error("REVIEW API ERROR:", error);
    return res.status(500).json({
      error: "Server error reviewing code.",
      details: error.message,
    });
  }
}
