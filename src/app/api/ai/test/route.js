import { NextResponse } from 'next/server';
// import { GoogleGenerativeAI } from "@google/generative-ai";
import Anthropic from "@anthropic-ai/sdk";

// async function testGemini(apiKey) { ... }

async function testAnthropic(apiKey) {
  if (!apiKey) return { ok: false, error: "ANTHROPIC_API_KEY missing" };

  try {
    const client = new Anthropic({ apiKey });
    const message = await client.messages.create({
      model: "claude-haiku-4-5-20251001",
      max_tokens: 32,
      messages: [{ role: "user", content: "Say 'System Online'" }],
    });

    return { ok: true, response: message.content[0].text };
  } catch (error) {
    return { ok: false, error: error.message };
  }
}

export async function GET() {
  // const geminiKey = process.env.GEMINI_API_KEY;
  const anthropicKey = process.env.ANTHROPIC_API_KEY;

  const result = await testAnthropic(anthropicKey);

  return NextResponse.json(
    {
      anthropic: {
        status: result.ok ? "Connected" : "Failed",
        response: result.response,
        error: result.error,
        debug: {
          hasKey: !!anthropicKey,
          keyLength: anthropicKey?.length ?? 0,
          keyPrefix: anthropicKey?.substring(0, 4) ?? "none",
        },
      },
      summary: result.ok ? "Claude online" : "Claude unavailable",
    },
    { status: result.ok ? 200 : 500 },
  );
}
