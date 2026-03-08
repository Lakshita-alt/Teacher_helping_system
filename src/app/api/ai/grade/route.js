import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = process.env.GEMINI_API_KEY;
if (!apiKey) {
  throw new Error("GEMINI_API_KEY not found");
}

const genAI = new GoogleGenerativeAI(apiKey);
const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

const CONCURRENCY_LIMIT = 5; // number of requests processed at once
const BATCH_SIZE = 20; // requests grouped together

// helper function
function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function gradeSingle(item) {
  const { type, content, rubric } = item;

  let prompt = "";

  if (type === "essay") {
    prompt = `
You are an expert academic grader.

Rubric: ${rubric || "Grammar, Structure, Arguments, Evidence"}

Essay:
${content}

Return JSON only:
{
"score": number (0-100),
"feedback": "short feedback",
"strengths": ["string"],
"improvements": ["string"]
}`;
  } else if (type === "short-answer") {
    prompt = `
Grade this answer.

Context: ${rubric}

Answer:
${content}

Return JSON:
{
"score": number (0-10),
"feedback": "short feedback"
}`;
  }

  const result = await model.generateContent(prompt);
  const text = result.response.text();

  const jsonMatch = text.match(/\{[\s\S]*\}/);
  return JSON.parse(jsonMatch[0]);
}

export async function POST(request) {
  try {
    const { submissions } = await request.json();

    const results = [];

    for (let i = 0; i < submissions.length; i += BATCH_SIZE) {
      const batch = submissions.slice(i, i + BATCH_SIZE);

      const promises = [];

      for (let j = 0; j < batch.length; j += CONCURRENCY_LIMIT) {
        const chunk = batch.slice(j, j + CONCURRENCY_LIMIT);

        const chunkResults = await Promise.all(
          chunk.map((item) => gradeSingle(item)),
        );

        results.push(...chunkResults);

        // small delay prevents rate limits
        await delay(200);
      }
    }

    return NextResponse.json({
      success: true,
      results,
    });
  } catch (error) {
    console.error("Batch grading error:", error);

    return NextResponse.json(
      { error: "Batch grading failed" },
      { status: 500 },
    );
  }
}
