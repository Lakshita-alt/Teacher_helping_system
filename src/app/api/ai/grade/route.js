import { NextResponse } from "next/server";
// import { GoogleGenerativeAI } from "@google/generative-ai";
import { gradeSingle as anthropicGradeSingle } from "@/lib/anthropic";

// const apiKey = process.env.GEMINI_API_KEY;
// const genAI = new GoogleGenerativeAI(apiKey);
// const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

const CONCURRENCY_LIMIT = 5;
const BATCH_SIZE = 20;

function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// async function geminiGradeSingle(item) { ... }

export async function POST(request) {
  try {
    const { submissions } = await request.json();

    const results = [];

    for (let i = 0; i < submissions.length; i += BATCH_SIZE) {
      const batch = submissions.slice(i, i + BATCH_SIZE);

      for (let j = 0; j < batch.length; j += CONCURRENCY_LIMIT) {
        const chunk = batch.slice(j, j + CONCURRENCY_LIMIT);

        const chunkResults = await Promise.all(
          chunk.map((item) => anthropicGradeSingle(item)),
        );

        results.push(...chunkResults);

        await delay(200);
      }
    }

    return NextResponse.json({ success: true, results });
  } catch (error) {
    console.error("Batch grading error:", error);
    return NextResponse.json(
      { error: "Batch grading failed" },
      { status: 500 },
    );
  }
}
