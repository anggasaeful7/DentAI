import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { extractSymptoms, isDentalRelated, generateEducation, getLastProviderUsed } from "@/lib/ai/gemini";
import { evaluateSymptoms } from "@/lib/engine/decision-engine";
import { mapRegionToTeeth } from "@/lib/engine/odontogram-mapper";
import { NON_DENTAL_RESPONSE } from "@/lib/ai/prompts";
import { checkRateLimit } from "@/lib/cache";
import type { ConsultationResult } from "@/lib/ai/types";

export async function POST(req: NextRequest) {
    const startTime = Date.now();

    try {
        const body = await req.json();
        const { message, sessionId, consultationId } = body;

        if (!message || !sessionId) {
            return NextResponse.json(
                { error: "message and sessionId are required" },
                { status: 400 }
            );
        }

        // Rate limiting
        const rateCheck = checkRateLimit(sessionId);
        if (!rateCheck.allowed) {
            return NextResponse.json(
                { error: "Terlalu banyak request. Coba lagi dalam beberapa saat.", retryIn: rateCheck.resetIn },
                { status: 429 }
            );
        }

        // 1. Ensure user exists
        let user = await prisma.user.findUnique({
            where: { sessionId },
        });

        if (!user) {
            user = await prisma.user.create({
                data: { sessionId },
            });
        } else {
            await prisma.user.update({
                where: { id: user.id },
                data: { lastActiveAt: new Date() },
            });
        }

        // 2. Check if dental-related (only for NEW consultations, not follow-ups)
        if (!consultationId) {
            const isDental = await isDentalRelated(message);
            if (!isDental) {
                return NextResponse.json({
                    consultationId: null,
                    status: "not_dental",
                    message: NON_DENTAL_RESPONSE,
                });
            }
        }

        // 3. Build conversation history if continuing
        let conversationHistory = "";
        let consultation;

        if (consultationId) {
            consultation = await prisma.consultation.findUnique({
                where: { id: consultationId },
                include: { messages: { orderBy: { createdAt: "asc" } } },
            });

            if (consultation) {
                conversationHistory = consultation.messages
                    .map((m: { role: string; content: string }) => `${m.role}: ${m.content}`)
                    .join("\n");

                // Save user message
                await prisma.message.create({
                    data: {
                        consultationId: consultation.id,
                        role: "user",
                        content: message,
                    },
                });
            }
        }

        // 4. Extract symptoms with AI
        const fullInput = conversationHistory
            ? `${conversationHistory}\nuser: ${message}`
            : message;
        const symptoms = await extractSymptoms(message, conversationHistory || undefined);

        // 5. If follow-up needed
        if (symptoms.needs_followup && symptoms.followup_question) {
            // Create consultation if new
            if (!consultation) {
                consultation = await prisma.consultation.create({
                    data: {
                        userId: user.id,
                        rawInput: message,
                        status: "pending",
                    },
                });

                // Save initial user message
                await prisma.message.create({
                    data: {
                        consultationId: consultation.id,
                        role: "user",
                        content: message,
                    },
                });
            }

            // Save AI follow-up message
            await prisma.message.create({
                data: {
                    consultationId: consultation.id,
                    role: "assistant",
                    content: symptoms.followup_question,
                },
            });

            // Update follow-up count
            await prisma.consultation.update({
                where: { id: consultation.id },
                data: { followUpCount: { increment: 1 } },
            });

            const result: ConsultationResult = {
                consultationId: consultation.id,
                status: "needs_followup",
                followUpQuestion: symptoms.followup_question,
            };

            return NextResponse.json(result);
        }

        // 6. Run decision engine
        const diagnosis = evaluateSymptoms(symptoms);

        // 7. Map to odontogram
        const odontogramMapping = mapRegionToTeeth(
            symptoms.region,
            diagnosis.conditionNameId,
            diagnosis.severityLevel,
            diagnosis.confidenceScore
        );

        // 8. Generate education content
        const education = await generateEducation(
            diagnosis.conditionNameId,
            symptoms
        );

        const responseTimeMs = Date.now() - startTime;

        // 9. Save to database
        if (!consultation) {
            consultation = await prisma.consultation.create({
                data: {
                    userId: user.id,
                    rawInput: message,
                    extractedJson: JSON.parse(JSON.stringify(symptoms)),
                    suspectedCondition: diagnosis.conditionNameId,
                    severityLevel: diagnosis.severityLevel,
                    confidenceScore: diagnosis.confidenceScore,
                    educationOutput: education,
                    aiModelUsed: getLastProviderUsed(),
                    responseTimeMs,
                    status: "completed",
                },
            });

            await prisma.message.create({
                data: {
                    consultationId: consultation.id,
                    role: "user",
                    content: message,
                },
            });
        } else {
            await prisma.consultation.update({
                where: { id: consultation.id },
                data: {
                    extractedJson: JSON.parse(JSON.stringify(symptoms)),
                    suspectedCondition: diagnosis.conditionNameId,
                    severityLevel: diagnosis.severityLevel,
                    confidenceScore: diagnosis.confidenceScore,
                    educationOutput: education,
                    aiModelUsed: getLastProviderUsed(),
                    responseTimeMs,
                    status: "completed",
                },
            });
        }

        // Save odontogram records
        for (const mapping of odontogramMapping) {
            await prisma.odontogramRecord.create({
                data: {
                    consultationId: consultation.id,
                    toothNumber: mapping.toothNumber,
                    conditionLabel: mapping.condition,
                    severityLevel: mapping.severity,
                    confidenceScore: mapping.confidenceScore,
                    description: mapping.description,
                },
            });
        }

        // Save AI response message
        const summaryMessage = `Berdasarkan analisis, dugaan awal menunjukkan **${diagnosis.conditionNameId}** dengan tingkat keparahan **${diagnosis.severityLevel}** dan confidence **${Math.round(diagnosis.confidenceScore * 100)}%**.`;
        await prisma.message.create({
            data: {
                consultationId: consultation.id,
                role: "assistant",
                content: summaryMessage,
            },
        });

        // 10. Return result
        const result: ConsultationResult = {
            consultationId: consultation.id,
            status: "completed",
            result: {
                extractedSymptoms: symptoms,
                diagnosis,
                education,
                odontogramMapping,
            },
        };

        return NextResponse.json(result);
    } catch (error) {
        console.error("Consultation error:", error);
        return NextResponse.json(
            { error: "Terjadi kesalahan saat memproses konsultasi. Silakan coba lagi." },
            { status: 500 }
        );
    }
}
