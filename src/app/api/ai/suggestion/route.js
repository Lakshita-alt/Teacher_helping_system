import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { getStudents } from "@/lib/data";

const apiKey = process.env.GEMINI_API_KEY;

if (!apiKey) {
  console.error("Missing GEMINI_API_KEY");
}

const genAI = new GoogleGenerativeAI(apiKey);
const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

let cache = null;

export async function POST() {
  // return cached suggestions if already generated
  if (cache) {
    return NextResponse.json({ suggestions: cache });
  }

  try {
    const students = getStudents();

    const prompt = `
You are an educational psychologist.

Generate short learning strategies for each student.

Return STRICT JSON like this:

[
 {"id":"S001","suggestion":"..."},
 {"id":"S002","suggestion":"..."}
]

Students:
${JSON.stringify(
  students.map((s) => ({
    id: s.id,
    persona: s.Persona,
    risk: s.Risk_Category,
    attendance: s.Attendance,
    motivation: s.Motivation_Level,
  })),
)}
`;

    const result = await model.generateContent(prompt);
    const text = result.response.text();

    const cleaned = text.replace(/```json|```/g, "").trim();

    let parsed;
    try {
      parsed = JSON.parse(cleaned);
    } catch {
      const match = cleaned.match(/\[[\s\S]*\]/);
      parsed = match ? JSON.parse(match[0]) : [];
    }

    cache = parsed;

    return NextResponse.json({
      suggestions: parsed,
    });
  } catch (error) {
    console.error("AI generation failed:", error);

    return NextResponse.json(
      {
        error: "AI generation failed",
        suggestions: [],
      },
      { status: 500 },
    );
  }
}
