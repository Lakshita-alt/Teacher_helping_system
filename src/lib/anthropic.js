import Anthropic from "@anthropic-ai/sdk";

const apiKey = process.env.ANTHROPIC_API_KEY;

if (!apiKey) {
  console.error(
    "❌ ANTHROPIC_API_KEY missing. Add it to .env and restart server.",
  );
}

const client = apiKey ? new Anthropic({ apiKey }) : null;
const MODEL = "claude-haiku-4-5-20251001";

// simple in-memory cache to prevent repeated AI calls
const cache = new Map();

async function runPrompt(prompt, cacheKey) {
  if (cacheKey && cache.has(cacheKey)) {
    return cache.get(cacheKey);
  }

  if (!client) {
    return "Configuration Error: ANTHROPIC_API_KEY missing. Add it to .env.";
  }

  try {
    const message = await client.messages.create({
      model: MODEL,
      max_tokens: 512,
      system: "You are a helpful educational assistant. Never use markdown formatting, bullet symbols, bold, italics, headers, or any special characters. Write in plain sentences only.",
      messages: [{ role: "user", content: prompt }],
    });

    const text = message.content[0].text;

    if (cacheKey) {
      cache.set(cacheKey, text);
    }

    return text;
  } catch (error) {
    console.error("Anthropic Error:", error.message);

    if (error.status === 429 || error.message?.includes("rate_limit")) {
      return "AI temporarily busy (rate limit). Please retry in a moment.";
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

Provide a short diagnosis followed by 2 instructional strategies. Max 80 words. Plain text only, no bullet points or formatting.
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

export async function getBatchSuggestions(students) {
  if (!client) {
    return null;
  }

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

  try {
    const message = await client.messages.create({
      model: MODEL,
      max_tokens: 4096,
      system: "Return only valid JSON. No markdown, no code fences, no extra text.",
      messages: [{ role: "user", content: prompt }],
    });

    const text = message.content[0].text;
    const cleaned = text.replace(/```json|```/g, "").trim();

    try {
      return JSON.parse(cleaned);
    } catch {
      const match = cleaned.match(/\[[\s\S]*\]/);
      return match ? JSON.parse(match[0]) : null;
    }
  } catch (error) {
    console.error("Anthropic batch suggestions error:", error.message);
    return null;
  }
}

export async function gradeSingle(item) {
  if (!client) {
    return null;
  }

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

  try {
    const message = await client.messages.create({
      model: MODEL,
      max_tokens: 512,
      system: "Return only valid JSON. No markdown, no code fences, no extra text.",
      messages: [{ role: "user", content: prompt }],
    });

    const text = message.content[0].text;
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    return JSON.parse(jsonMatch[0]);
  } catch (error) {
    console.error("Anthropic grading error:", error.message);
    return null;
  }
}
