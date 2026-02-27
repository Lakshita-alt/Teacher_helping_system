import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from "@google/generative-ai";

export async function POST(request) {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return NextResponse.json({ error: 'Gemini API Key not found' }, { status: 500 });

  try {
    const { type, content, rubric } = await request.json();
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

    let prompt = "";
    if (type === 'essay') {
      prompt = `
        You are an expert academic grader. Grade the following essay based on this rubric: ${rubric || 'Grammar, Structure, Arguments, Evidence'}.
        
        Essay Content:
        ${content}
        
        Format your response as a clean JSON object:
        {
          "score": number (0-100),
          "feedback": "A short paragraph of constructive feedback",
          "strengths": ["string", "string"],
          "improvements": ["string", "string"]
        }
      `;
    } else if (type === 'short-answer') {
      prompt = `
        Grade this short answer response. 
        Question/Context: ${rubric}
        Student Answer: ${content}
        
        Format your response as a clean JSON object:
        {
          "score": number (0-10),
          "feedback": "Concise feedback"
        }
      `;
    } else {
        return NextResponse.json({ error: 'Unsupported grading type' }, { status: 400 });
    }

    const result = await model.generateContent(prompt);
    const text = result.response.text();
    // Extract JSON from potential markdown blocks
    const jsonStr = text.replace(/```json/g, "").replace(/```/g, "").trim();
    const grading = JSON.parse(jsonStr);

    return NextResponse.json(grading);
  } catch (error) {
    console.error("Grading Error:", error);
    if (error.message?.includes("429") || error.message?.includes("Quota")) {
        return NextResponse.json({ error: 'AI Rate Limit Reached. Please wait a minute before grading again.' }, { status: 429 });
    }
    return NextResponse.json({ error: 'Failed to auto-grade. The AI might be busy.' }, { status: 500 });
  }
}
