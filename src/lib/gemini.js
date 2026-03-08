import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = process.env.GEMINI_API_KEY;

if (!apiKey) {
  console.error(
    "❌ GEMINI_API_KEY missing. Add it to .env.local and restart server.",
  );
}

const genAI = apiKey ? new GoogleGenerativeAI(apiKey) : null;
const model = genAI?.getGenerativeModel({ model: "gemini-2.0-flash" });

// simple in-memory cache to prevent repeated AI calls
const cache = new Map();

// delay helper to avoid hitting rate limits
function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function runPrompt(prompt, cacheKey) {
  if (cacheKey && cache.has(cacheKey)) {
    return cache.get(cacheKey);
  }

  if (!model) {
    return "Configuration Error: GEMINI_API_KEY missing. Add it to .env.local.";
  }

  try {
    // small delay to prevent API spikes
    await delay(350);

    const result = await model.generateContent(prompt);
    const text = result.response.text();

    if (cacheKey) {
      cache.set(cacheKey, text);
    }

    return text;
  } catch (error) {
    console.error("Gemini Error:", error.message);

    if (error.message?.includes("429") || error.message?.includes("Quota")) {
      return "AI temporarily busy (quota reached). Please retry in a moment.";
    }

    return "AI service currently unavailable.";
  }
}

export async function getStudentSuggestion(student) {
  const prompt = `
You are an expert pedagogical consultant.

Analyze this student profile and provide short actionable guidance.

Student Data:
${JSON.stringify({
  persona: student.Persona,
  risk: student.Risk_Category,
  attendance: student.Attendance,
  studyHours: student.Hours_Studied,
  motivation: student.Motivation_Level,
  tutoring: student.Tutoring_Sessions,
  peerInfluence: student.Peer_Influence,
})}

Provide:
• short diagnosis
• 2 instructional strategies

Max 80 words.
`;

  return runPrompt(prompt, `student-${student.id}`);
}

export async function getClassSuggestion(classData) {
  const prompt = `
Analyze this class dynamic.

Class: ${classData.className}

Persona Distribution:
${JSON.stringify(classData.personas)}

Provide ONE teaching adjustment to improve engagement.

Max 60 words.
`;

  return runPrompt(prompt, `class-${classData.className}`);
}

export async function getLessonPlan(classData, topic) {
  const prompt = `
Design a short pedagogical scaffold.

Topic: ${topic}

Class: ${classData.className}

Personas:
${JSON.stringify(classData.personas)}

Provide:
1. Concept anchor
2. Adjustment for dominant persona
3. Engagement method for at-risk students

Max 120 words.
`;

  return runPrompt(prompt);
}
