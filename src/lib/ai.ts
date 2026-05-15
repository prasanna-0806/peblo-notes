import { GoogleGenerativeAI } from "@google/generative-ai";
import OpenAI from "openai";
import { prisma } from "./prisma";

export type AiNoteOutput = {
  summary: string;
  action_items: string[];
  suggested_title: string;
};

export type AiNoteResult = AiNoteOutput & {
  fallback?: boolean;
  warning?: string;
  provider?: "gemini" | "openai" | "mock";
};

const ANALYSIS_PROMPT = `Analyze the note and respond with ONLY valid JSON (no markdown) using these keys:
- summary: string, 2-3 sentences
- action_items: array of up to 5 concrete action strings
- suggested_title: short descriptive title`;

/** Free-tier models, ordered by reliability when quotas are tight */
const GEMINI_FALLBACK_MODELS = [
  "gemini-2.5-flash-lite",
  "gemini-flash-lite-latest",
  "gemini-2.5-flash",
  "gemini-flash-latest",
  "gemini-3.1-flash-lite",
];

function mockAiOutput(content: string): AiNoteOutput {
  const preview = content.trim().slice(0, 120) || "Empty note";
  return {
    summary: `This note covers: ${preview}${content.length > 120 ? "…" : ""}`,
    action_items: [
      "Review and refine key points",
      "Share with collaborators if needed",
    ],
    suggested_title:
      content.split("\n")[0]?.slice(0, 60).trim() || "Untitled Note",
  };
}

function parseAiJson(raw: string): AiNoteOutput {
  const cleaned = raw
    .replace(/^```(?:json)?\s*/i, "")
    .replace(/\s*```$/i, "")
    .trim();
  const parsed = JSON.parse(cleaned) as AiNoteOutput;
  return {
    summary: parsed.summary || "",
    action_items: Array.isArray(parsed.action_items) ? parsed.action_items : [],
    suggested_title: parsed.suggested_title || "Untitled",
  };
}

type Provider = "gemini" | "openai" | "mock";

function resolveProvider(): Provider {
  const setting = process.env.LLM_PROVIDER?.toLowerCase().trim();

  if (setting === "mock") return "mock";
  if (setting === "openai") {
    return process.env.LLM_API_KEY?.trim() ? "openai" : "mock";
  }
  if (setting === "gemini") {
    return process.env.GEMINI_API_KEY?.trim() ? "gemini" : "mock";
  }

  if (process.env.GEMINI_API_KEY?.trim()) return "gemini";
  if (process.env.LLM_API_KEY?.trim()) return "openai";
  return "mock";
}

function getGeminiModelCandidates(): string[] {
  const preferred = process.env.GEMINI_MODEL?.trim();
  const list = preferred
    ? [preferred, ...GEMINI_FALLBACK_MODELS]
    : GEMINI_FALLBACK_MODELS;
  return Array.from(new Set(list));
}

async function callGeminiWithModel(
  content: string,
  modelName: string
): Promise<AiNoteOutput> {
  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!.trim());
  const model = genAI.getGenerativeModel({
    model: modelName,
    generationConfig: {
      temperature: 0.3,
      responseMimeType: "application/json",
    },
  });

  const result = await model.generateContent(
    `${ANALYSIS_PROMPT}\n\nNote:\n${content.slice(0, 8000)}`
  );
  const text = result.response.text();
  if (!text) throw new Error("Empty AI response");
  return parseAiJson(text);
}

async function callGemini(content: string): Promise<AiNoteOutput> {
  const models = getGeminiModelCandidates();
  let lastError: unknown;

  for (const modelName of models) {
    try {
      return await callGeminiWithModel(content, modelName);
    } catch (error) {
      lastError = error;
      if (!isQuotaOrRateError(error)) throw error;
    }
  }

  throw lastError ?? new Error("All Gemini models exhausted");
}

async function callOpenAI(content: string): Promise<AiNoteOutput> {
  const client = new OpenAI({ apiKey: process.env.LLM_API_KEY!.trim() });
  const response = await client.chat.completions.create({
    model: process.env.OPENAI_MODEL || "gpt-4o-mini",
    temperature: 0.3,
    response_format: { type: "json_object" },
    messages: [
      { role: "system", content: ANALYSIS_PROMPT },
      {
        role: "user",
        content: `Analyze this note:\n\n${content.slice(0, 8000)}`,
      },
    ],
  });

  const raw = response.choices[0]?.message?.content;
  if (!raw) throw new Error("Empty AI response");
  return parseAiJson(raw);
}

function isQuotaOrRateError(error: unknown): boolean {
  if (error instanceof OpenAI.APIError) {
    const code = (error.error as { code?: string })?.code;
    return (
      error.status === 429 ||
      code === "insufficient_quota" ||
      code === "billing_not_active"
    );
  }
  if (error instanceof Error) {
    const msg = error.message.toLowerCase();
    return (
      msg.includes("quota") ||
      msg.includes("429") ||
      msg.includes("resource_exhausted") ||
      msg.includes("too many requests")
    );
  }
  return false;
}

export async function generateNoteInsights(
  content: string,
  userId: string,
  noteId?: string
): Promise<AiNoteResult> {
  const provider = resolveProvider();
  let result: AiNoteOutput;
  let fallback = false;
  let warning: string | undefined;
  let usedProvider: Provider = provider;

  if (provider === "mock") {
    result = mockAiOutput(content);
    fallback = true;
    warning =
      "Demo mode — no API key. Get a free Gemini key at aistudio.google.com/apikey";
  } else {
    try {
      result =
        provider === "gemini"
          ? await callGemini(content)
          : await callOpenAI(content);
    } catch (error) {
      if (isQuotaOrRateError(error)) {
        result = mockAiOutput(content);
        fallback = true;
        usedProvider = "mock";
        warning =
          provider === "openai"
            ? "OpenAI quota exceeded — showing demo output."
            : "All free Gemini models hit their daily limit. Demo output shown — try again tomorrow or create a new API key.";
      } else {
        throw error;
      }
    }
  }

  await prisma.aiUsageLog.create({
    data: {
      userId,
      noteId,
      feature: fallback
        ? "generate-summary-fallback"
        : `generate-summary-${usedProvider}`,
    },
  });

  return { ...result, fallback, warning, provider: usedProvider };
}
