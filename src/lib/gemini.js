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
      You are an expert educational psychologist. 
      Analyze this student data and provide 2-3 concise, actionable teaching strategies for their future growth.
      
      Persona: ${student.Persona}
      Risk: ${student.Risk_Category} (Score: ${student.Risk_Score})
      Attendance: ${student.Attendance}%
      Study: ${student.Hours_Studied} hrs/week
      Sleep: ${student.Sleep_Hours} hrs/night
      Motivation: ${student.Motivation_Level}/2
      Tutoring: ${student.Tutoring_Sessions} sessions
      Resources: ${student.Access_to_Resources}/2
      Peer Influence: ${student.Peer_Influence}/2
      Extracurriculars: ${student.Extracurricular_Activities == 1 ? "Yes" : "No"}
      
      Format: Return ONLY the strategies in a single paragraph, max 100 words.
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error("Gemini API Error details:", error.message);
    if (error.message?.includes("429") || error.message?.includes("Quota")) {
        return "AI is temporarily busy (Quota Reached). Please wait a minute and try again. This is a limit of the Gemini free tier.";
    }
    if (error.message?.includes("API_KEY_INVALID")) {
        return "AI Error: The provided Gemini API Key is invalid. Please check your .env file.";
    }
    return `AI Error: ${error.message || "Failed to generate insights."}`;
  }
}

export async function getClassSuggestion(classData) {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return "API Key not found.";

  const prompt = `
    Analyze this class-level data for a school administrator:
    Class: ${classData.className}
    Total Students: ${classData.total}
    Persona Distribution: ${JSON.stringify(classData.personas)}
    
    Provide one high-level strategic recommendation for this entire class to improve overall engagement. Max 60 words.
  `;

  try {
    const result = await model.generateContent(prompt);
    return result.response.text();
  } catch (error) {
    return "Class analytics currently unavailable.";
  }
}
