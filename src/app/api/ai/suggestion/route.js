import { NextResponse } from "next/server";
// import {
//   getStudentSuggestion as geminiStudentSuggestion,
//   getClassSuggestion as geminiClassSuggestion,
//   getLessonPlan as geminiLessonPlan,
// } from "@/lib/gemini";
import {
  getStudentSuggestion as anthropicStudentSuggestion,
  getClassSuggestion as anthropicClassSuggestion,
  getLessonPlan as anthropicLessonPlan,
  getBatchSuggestions as anthropicBatchSuggestions,
} from "@/lib/anthropic";
// import { GoogleGenerativeAI } from "@google/generative-ai";
import { getStudents } from "@/lib/data";

// ── Batch student suggestions cache ─────────────────────────────────────────

// const geminiApiKey = process.env.GEMINI_API_KEY;
// const genAI = geminiApiKey ? new GoogleGenerativeAI(geminiApiKey) : null;
// const batchModel = genAI?.getGenerativeModel({ model: "gemini-2.0-flash" });

// let geminiCache = null;
let anthropicCache = null;

// async function geminiBatchSuggestions(students) { ... }

// ── Route handler ────────────────────────────────────────────────────────────

export async function POST(request) {
  try {
    const body = await request.json().catch(() => ({}));
    const { type, id, classData, topic } = body;

    // ── Individual student suggestion ────────────────────────────────────────
    if (type === "student") {
      const students = getStudents();
      const student = students.find((s) => s.id === id);
      if (!student) {
        return NextResponse.json({ error: "Student not found" }, { status: 404 });
      }

      const suggestion = await anthropicStudentSuggestion(student);

      return NextResponse.json({ suggestion });
    }

    // ── Class cluster strategy ───────────────────────────────────────────────
    if (type === "class") {
      const suggestion = await anthropicClassSuggestion(classData);
      return NextResponse.json({ suggestion });
    }

    // ── Lesson plan ──────────────────────────────────────────────────────────
    if (type === "lesson-plan") {
      const suggestion = await anthropicLessonPlan(classData, topic);
      return NextResponse.json({ suggestion });
    }

    // ── Batch student suggestions (legacy / no type) ─────────────────────────
    if (anthropicCache) {
      return NextResponse.json({ suggestions: anthropicCache });
    }

    const students = getStudents();
    const suggestions = await anthropicBatchSuggestions(students);
    anthropicCache = suggestions ?? [];

    return NextResponse.json({ suggestions: anthropicCache });
  } catch (error) {
    console.error("AI generation failed:", error);
    return NextResponse.json(
      { error: "AI generation failed", suggestions: [] },
      { status: 500 },
    );
  }
}
