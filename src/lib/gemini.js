import { GoogleGenerativeAI } from "@google/generative-ai";

export async function getStudentSuggestion(student) {
  const apiKey = process.env.GEMINI_API_KEY;
  
  if (!apiKey || apiKey === "your_actual_key_here" || apiKey.trim() === "") {
    console.error("GEMINI_API_KEY is missing or invalid in .env");
    return "Configuration Error: GEMINI_API_KEY not found in .env file. Please add your key and restart the server.";
  }

  try {
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

    const prompt = `
      You are an expert pedagogical consultant and educational psychologist. 
      Analyze this student data and provide 2-3 qualitative, actionable instructional scaffolding strategies.
      Use pedagogical terminology (e.g., 'Metacognitive Scaffolding', 'Affective Support', 'Cognitive Load Management').
      
      Student Persona: ${student.Persona}
      Current Dynamic: ${student.Risk_Category} (Risk Weight: ${student.Risk_Score})
      Attendance: ${student.Attendance}%
      Study: ${student.Hours_Studied} hrs/week
      Motivation: ${student.Motivation_Level} (0=Low, 1=Med, 2=High)
      Tutoring: ${student.Tutoring_Sessions} sessions
      Peer Influence: ${student.Peer_Influence} (0=Negative, 1=Neutral, 2=Positive)
      
      Format: Provide a qualitative narrative of the student's current learning state, followed by specific scaffolding steps. Max 100 words.
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error("Gemini API Error details:", error.message);
    if (error.message?.includes("429") || error.message?.includes("Quota")) {
        return "AI is temporarily busy (Quota Reached). Please wait a minute and try again.";
    }
    return `AI Error: ${error.message || "Failed to generate insights."}`;
  }
}

export async function getClassSuggestion(classData) {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return "API Key not found.";

  try {
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

    const prompt = `
      Analyze this class-level learning persona distribution:
      Class: ${classData.className}
      Total Students: ${classData.total}
      Persona Data: ${JSON.stringify(classData.personas)}
      
      Provide one qualitative high-level pedagogical shift for this class to optimize collective engagement. Focus on 'Classroom Climate' and 'Differentiated Instruction'. Max 60 words.
    `;

    const result = await model.generateContent(prompt);
    return result.response.text();
  } catch (error) {
    return "Class analytics currently unavailable.";
  }
}

export async function getLessonPlan(classData, topic) {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return "API Key not found.";

  try {
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

    const prompt = `
      As a Pedagogical Architect, design a qualitative lesson plan scaffolding for:
      Topic: ${topic}
      Class Dynamic: ${classData.className}
      Persona Breakdown: ${JSON.stringify(classData.personas)}
      
      Focus on 'Differentiated Scaffolding'. Provide:
      1. One 'Conceptual Anchor' for the whole class.
      2. Specific qualitative adjustments for the dominant persona.
      3. A 'Participation Catalyst' to engage at-risk students.
      Max 150 words.
    `;

    const result = await model.generateContent(prompt);
    return result.response.text();
  } catch (error) {
    return "Scaffolding generation currently unavailable.";
  }
}
