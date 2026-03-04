import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

const VISION_PROMPT = `You are a dental health AI assistant. Analyze this dental/oral image.

Describe what you observe about the teeth and gums in this image. Focus on:
1. Visible dental conditions (cavities, discoloration, swelling, etc.)
2. Condition of gums (healthy, inflamed, bleeding, etc.)
3. General oral hygiene assessment

Then convert your observations into a dental complaint description in Bahasa Indonesia, as if a patient is describing their symptoms based on what's visible.

RULES:
- Be observational, NOT diagnostic
- Use Bahasa Indonesia for the complaint description
- Be empathetic and non-alarming
- Include a disclaimer that visual analysis is limited

OUTPUT FORMAT:
OBSERVATIONS:
(your observations in English)

COMPLAINT_ID:
(patient-style complaint description in Bahasa Indonesia based on observations, 1-2 sentences)

DISCLAIMER:
Analisis visual AI memiliki keterbatasan. Foto tidak dapat menggantikan pemeriksaan langsung oleh dokter gigi.`;

export async function POST(req: NextRequest) {
    try {
        const formData = await req.formData();
        const imageFile = formData.get("image") as File | null;

        if (!imageFile) {
            return NextResponse.json({ error: "No image provided" }, { status: 400 });
        }

        // Convert to base64
        const bytes = await imageFile.arrayBuffer();
        const base64 = Buffer.from(bytes).toString("base64");
        const mimeType = imageFile.type || "image/jpeg";

        // Try Gemini Vision first
        try {
            const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");
            const model = genAI.getGenerativeModel({ model: "gemini-3-flash-preview" });

            const result = await model.generateContent([
                VISION_PROMPT,
                {
                    inlineData: {
                        mimeType,
                        data: base64,
                    },
                },
            ]);

            const text = result.response.text();

            // Extract complaint in Indonesian
            const complaintMatch = text.match(/COMPLAINT_ID:\s*([\s\S]*?)(?:DISCLAIMER:|$)/);
            const observationMatch = text.match(/OBSERVATIONS:\s*([\s\S]*?)(?:COMPLAINT_ID:|$)/);

            const complaint = complaintMatch?.[1]?.trim() || "Mohon analisis kondisi gigi saya berdasarkan foto.";
            const observation = observationMatch?.[1]?.trim() || "";

            return NextResponse.json({
                success: true,
                complaint,
                observation,
                aiModel: "gemini-3-flash-preview",
            });
        } catch (geminiError) {
            console.warn("[Vision] Gemini failed, trying OpenRouter...", geminiError);

            // Fallback to OpenRouter with vision model
            const apiKey = process.env.OPENROUTER_API_KEY;
            if (!apiKey) throw new Error("No fallback API key");

            const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${apiKey}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    model: "google/gemini-2.0-flash-exp:free",
                    messages: [
                        {
                            role: "user",
                            content: [
                                { type: "text", text: VISION_PROMPT },
                                { type: "image_url", image_url: { url: `data:${mimeType};base64,${base64}` } },
                            ],
                        },
                    ],
                }),
            });

            if (!res.ok) throw new Error(`OpenRouter vision failed: ${res.status}`);

            const data = await res.json();
            const text = data.choices?.[0]?.message?.content || "";

            const complaintMatch = text.match(/COMPLAINT_ID:\s*([\s\S]*?)(?:DISCLAIMER:|$)/);
            const complaint = complaintMatch?.[1]?.trim() || "Mohon analisis kondisi gigi saya berdasarkan foto.";

            return NextResponse.json({
                success: true,
                complaint,
                observation: "",
                aiModel: "openrouter-fallback",
            });
        }
    } catch (error) {
        console.error("Vision error:", error);
        return NextResponse.json(
            { error: "Gagal menganalisis gambar. Silakan coba lagi." },
            { status: 500 }
        );
    }
}
