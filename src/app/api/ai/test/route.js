import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from "@google/generative-ai";

export async function GET() {
  const apiKey = process.env.GEMINI_API_KEY;
  
  const status = {
    hasKey: !!apiKey,
    keyLength: apiKey ? apiKey.length : 0,
    keyPrefix: apiKey ? apiKey.substring(0, 4) : 'none',
    envKeys: Object.keys(process.env).filter(k => k.includes('GEMINI')),
    nodeVersion: process.version
  };

  if (!apiKey) {
    return NextResponse.json({ 
        error: "GEMINI_API_KEY is missing from process.env", 
        debug: status 
    }, { status: 500 });
  }

  try {
    const genAI = new GoogleGenerativeAI(apiKey);
    
    // Attempt to list models to see what is available
    let availableModels = [];
    try {
        const listResult = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`);
        const listData = await listResult.json();
        availableModels = listData.models || [];
    } catch (e) {
        console.error("Could not list models", e);
    }

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const result = await model.generateContent("Say 'System Online'");
    const text = result.response.text();
    
    return NextResponse.json({ 
        message: "Gemini Connection Successful!", 
        aiResponse: text,
        availableModels: availableModels.map(m => m.name),
        debug: status
    });
  } catch (error) {
    // If the above failed, let's still return the models we found
    let availableModels = [];
    try {
        const listResult = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`);
        const listData = await listResult.json();
        availableModels = listData.models || [];
    } catch (e) {}

    return NextResponse.json({ 
        error: "Gemini API Connection Failed", 
        errorMessage: error.message,
        availableModels: availableModels.map(m => m.name),
        debug: status
    }, { status: 500 });
  }
}
