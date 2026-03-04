import { GoogleGenerativeAI } from "@google/generative-ai";
import {
    SYMPTOM_EXTRACTION_PROMPT,
    EDUCATION_PROMPT,
    FOLLOW_UP_PROMPT,
    DENTAL_CHECK_PROMPT,
} from "./prompts";
import type { ExtractedSymptoms } from "./types";

// ==================== Providers ====================

const GEMINI_MODEL = "gemini-3-flash-preview";
const OPENROUTER_MODEL = "google/gemini-2.5-flash";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

function getGeminiModel() {
    return genAI.getGenerativeModel({ model: GEMINI_MODEL });
}

// Fallback: OpenRouter API (compatible with OpenAI format)
async function callOpenRouter(prompt: string): Promise<string> {
    const apiKey = process.env.OPENROUTER_API_KEY;
    if (!apiKey) throw new Error("OpenRouter API key not configured");

    const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        headers: {
            Authorization: `Bearer ${apiKey}`,
            "Content-Type": "application/json",
            "HTTP-Referer": process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
            "X-Title": "DentAI",
        },
        body: JSON.stringify({
            model: OPENROUTER_MODEL,
            messages: [{ role: "user", content: prompt }],
            temperature: 0.3,
            max_tokens: 2048,
        }),
    });

    if (!res.ok) {
        const err = await res.text();
        throw new Error(`OpenRouter error: ${res.status} - ${err}`);
    }

    const data = await res.json();
    return data.choices?.[0]?.message?.content || "";
}

// ==================== Smart Call (Gemini → OpenRouter fallback) ====================

async function smartGenerate(prompt: string): Promise<string> {
    // Try Gemini first
    try {
        const model = getGeminiModel();
        const result = await model.generateContent(prompt);
        console.log("[AI] Used: Gemini 3 Flash");
        return result.response.text();
    } catch (error: unknown) {
        const errMsg = error instanceof Error ? error.message : String(error);
        console.warn(`[AI] Gemini failed: ${errMsg.slice(0, 100)}, falling back to OpenRouter...`);
    }

    // Fallback to OpenRouter
    try {
        const result = await callOpenRouter(prompt);
        console.log("[AI] Used: OpenRouter (fallback)");
        return result;
    } catch (error: unknown) {
        const errMsg = error instanceof Error ? error.message : String(error);
        throw new Error(`All AI providers failed. Last error: ${errMsg}`);
    }
}

// Track which provider was used (for logging in DB)
let lastProviderUsed = "gemini-3-flash";

export function getLastProviderUsed(): string {
    return lastProviderUsed;
}

async function smartGenerateTracked(prompt: string): Promise<string> {
    try {
        const model = getGeminiModel();
        const result = await model.generateContent(prompt);
        lastProviderUsed = "gemini-3-flash";
        console.log("[AI] Used: Gemini 3 Flash ✅");
        return result.response.text();
    } catch (error: unknown) {
        const errMsg = error instanceof Error ? error.message : String(error);
        console.warn(`[AI] Gemini failed: ${errMsg.slice(0, 100)}`);
    }

    const result = await callOpenRouter(prompt);
    lastProviderUsed = "openrouter-gemini-2.0-flash";
    console.log("[AI] Used: OpenRouter (fallback) ✅");
    return result;
}

// ==================== Exported Functions ====================

export async function isDentalRelated(input: string): Promise<boolean> {
    try {
        const response = await smartGenerate(DENTAL_CHECK_PROMPT + input);
        return response.trim().toLowerCase() === "yes";
    } catch {
        // If check fails, assume it's dental to not block user
        return true;
    }
}

export async function extractSymptoms(
    input: string,
    conversationHistory?: string
): Promise<ExtractedSymptoms> {
    let prompt = SYMPTOM_EXTRACTION_PROMPT;
    if (conversationHistory) {
        prompt += `\n\nPrevious conversation:\n${conversationHistory}`;
    }
    prompt += `\n\nPatient complaint: "${input}"`;

    const text = await smartGenerateTracked(prompt);

    // Extract JSON from response (handle markdown code blocks)
    const jsonMatch = text.match(/```(?:json)?\s*([\s\S]*?)```/) || [null, text];
    const jsonStr = (jsonMatch[1] || text).trim();

    try {
        const parsed = JSON.parse(jsonStr);
        return {
            region: parsed.region || "unknown",
            pain_level: parsed.pain_level || 0,
            pain_type: parsed.pain_type || "none",
            bleeding: Boolean(parsed.bleeding),
            growth: Boolean(parsed.growth),
            swelling: Boolean(parsed.swelling),
            sensitivity: {
                hot: Boolean(parsed.sensitivity?.hot),
                cold: Boolean(parsed.sensitivity?.cold),
                pressure: Boolean(parsed.sensitivity?.pressure),
            },
            duration_days: parsed.duration_days || 0,
            deep_cavity: Boolean(parsed.deep_cavity),
            bad_breath: Boolean(parsed.bad_breath),
            loose_tooth: Boolean(parsed.loose_tooth),
            additional_notes: parsed.additional_notes || "",
            needs_followup: Boolean(parsed.needs_followup),
            followup_question: parsed.followup_question || "",
        };
    } catch {
        throw new Error("Failed to parse AI symptom extraction response");
    }
}

export async function generateFollowUp(
    input: string,
    conversationHistory: string
): Promise<string> {
    const prompt = `${FOLLOW_UP_PROMPT}\n\nConversation history:\n${conversationHistory}\n\nLatest message: "${input}"`;
    const result = await smartGenerate(prompt);
    return result.trim();
}

export async function generateEducation(
    conditionName: string,
    symptoms: ExtractedSymptoms
): Promise<string> {
    const prompt = `${EDUCATION_PROMPT}\n\nSuspected condition: ${conditionName}\nSymptoms: ${JSON.stringify(symptoms, null, 2)}`;
    const result = await smartGenerate(prompt);
    return result.trim();
}
