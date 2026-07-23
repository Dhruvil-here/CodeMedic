import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

import { GoogleGenAI } from "@google/genai";
// Initialize OpenAI client

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
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
        setTimeout(resolve, delay * Math.pow(2, i - 1)),
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
You are CodeMedic AI, an expert Senior Software Engineer, Technical Lead, and Code Reviewer with 15+ years of experience.

Analyze the following ${language} code thoroughly.

Provide your response using EXACTLY the following format.

# Overall Rating
Give one of:
⭐ Bad
⭐⭐ Fair
⭐⭐⭐ Good
⭐⭐⭐⭐ Very Good
⭐⭐⭐⭐⭐ Excellent

Also give a score out of 10.

# Summary
Briefly explain what the code is trying to accomplish.

# Step-by-Step Explanation
Explain the code line-by-line or block-by-block in simple language suitable for beginner to intermediate developers.

# Strengths
List everything that is implemented correctly.

# Problems Found
Identify:
- Syntax errors
- Logical errors
- Runtime issues
- Edge cases
- Security issues
- Memory issues
- Performance bottlenecks

If none exist, explicitly state "No major issues found."

# Best Practices
Mention coding standards that should be improved.

Examples:
- Naming conventions
- Readability
- Modularization
- Reusability
- Error handling
- Input validation

# Time Complexity
Estimate Big-O complexity.

# Space Complexity
Estimate memory complexity.

# Optimized Version
Provide an improved version of the code.

Return ONLY markdown.

Code:

${code}
`;

    const run = () =>
      ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
      });

    const response = await withRetries(run, 3, 1200);

    const text = response.text || "No response received.";

    return res.status(200).json({ text });
  } catch (error) {
    console.error("REVIEW API ERROR:", error);
    return res.status(500).json({
      error: "Server error reviewing code.",
      details: error.message,
    });
  }
}
