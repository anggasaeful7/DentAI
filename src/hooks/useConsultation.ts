"use client";

import { useState, useCallback, useRef } from "react";
import { v4 as uuidv4 } from "uuid";
import type { ChatMessage, OdontogramMapping, DiagnosisResult } from "@/lib/ai/types";
import { WELCOME_MESSAGE } from "@/lib/ai/prompts";
import { getOrCreateSessionId } from "@/lib/session";

interface ConsultationState {
    messages: ChatMessage[];
    isLoading: boolean;
    consultationId: string | null;
    result: {
        diagnosis: DiagnosisResult;
        education: string;
        odontogramMapping: OdontogramMapping[];
    } | null;
    error: string | null;
    isComplete: boolean;
    isStreaming: boolean;
}

export function useConsultation() {
    const [state, setState] = useState<ConsultationState>({
        messages: [
            {
                id: uuidv4(),
                role: "assistant",
                content: WELCOME_MESSAGE,
                timestamp: new Date(),
            },
        ],
        isLoading: false,
        consultationId: null,
        result: null,
        error: null,
        isComplete: false,
        isStreaming: false,
    });

    const streamTimerRef = useRef<NodeJS.Timeout | null>(null);

    // Typewriter effect: progressively reveal text
    const streamMessage = useCallback((msgId: string, fullText: string, onComplete?: () => void) => {
        let charIndex = 0;
        const speed = 15; // ms per character

        setState((prev) => ({
            ...prev,
            isStreaming: true,
            isLoading: false,
            messages: [
                ...prev.messages,
                { id: msgId, role: "assistant", content: "", timestamp: new Date() },
            ],
        }));

        const tick = () => {
            charIndex += Math.floor(Math.random() * 3) + 1; // 1-3 chars at a time for natural feel
            if (charIndex >= fullText.length) {
                charIndex = fullText.length;
            }

            setState((prev) => ({
                ...prev,
                messages: prev.messages.map((m) =>
                    m.id === msgId ? { ...m, content: fullText.slice(0, charIndex) } : m
                ),
            }));

            if (charIndex < fullText.length) {
                streamTimerRef.current = setTimeout(tick, speed);
            } else {
                setState((prev) => ({ ...prev, isStreaming: false }));
                onComplete?.();
            }
        };

        streamTimerRef.current = setTimeout(tick, speed);
    }, []);

    const sendMessage = useCallback(async (message: string) => {
        const sessionId = getOrCreateSessionId();

        // Clear any ongoing stream
        if (streamTimerRef.current) {
            clearTimeout(streamTimerRef.current);
        }

        // Add user message
        const userMsg: ChatMessage = {
            id: uuidv4(),
            role: "user",
            content: message,
            timestamp: new Date(),
        };

        setState((prev) => ({
            ...prev,
            messages: [...prev.messages, userMsg],
            isLoading: true,
            error: null,
            isStreaming: false,
        }));

        try {
            const res = await fetch("/api/consult", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    message,
                    sessionId,
                    consultationId: state.consultationId,
                }),
            });

            if (!res.ok) {
                throw new Error("Gagal memproses konsultasi");
            }

            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const data: any = await res.json();

            if (data.status === "not_dental") {
                const msgId = uuidv4();
                const text = data.message || "Maaf, DentAI hanya untuk keluhan gigi.";
                streamMessage(msgId, text);
                return;
            }

            if (data.status === "needs_followup" && data.followUpQuestion) {
                const msgId = uuidv4();
                streamMessage(msgId, data.followUpQuestion, () => {
                    setState((prev) => ({
                        ...prev,
                        consultationId: data.consultationId,
                    }));
                });
                return;
            }

            if (data.status === "completed" && data.result) {
                const msgId = uuidv4();
                const summaryText = `✅ Analisis selesai!\n\n🔍 Dugaan: ${data.result.diagnosis.conditionNameId}\n📊 Confidence: ${Math.round(data.result.diagnosis.confidenceScore * 100)}%\n⚡ Severity: ${data.result.diagnosis.severityLevel === "high" ? "Tinggi 🔴" : data.result.diagnosis.severityLevel === "medium" ? "Sedang 🟡" : "Ringan 🟢"}\n\n👉 Lihat detail lengkap di panel sebelah kanan.`;

                streamMessage(msgId, summaryText, () => {
                    setState((prev) => ({
                        ...prev,
                        consultationId: data.consultationId,
                        result: data.result!,
                        isComplete: true,
                    }));
                });
                return;
            }
        } catch (err) {
            const errorMsg = err instanceof Error ? err.message : "Terjadi kesalahan";
            const msgId = uuidv4();
            setState((prev) => ({
                ...prev,
                isLoading: false,
                error: errorMsg,
            }));
            streamMessage(msgId, `⚠️ ${errorMsg}. Silakan coba lagi.`);
        }
    }, [state.consultationId, streamMessage]);

    const reset = useCallback(() => {
        if (streamTimerRef.current) {
            clearTimeout(streamTimerRef.current);
        }
        setState({
            messages: [
                {
                    id: uuidv4(),
                    role: "assistant",
                    content: WELCOME_MESSAGE,
                    timestamp: new Date(),
                },
            ],
            isLoading: false,
            consultationId: null,
            result: null,
            error: null,
            isComplete: false,
            isStreaming: false,
        });
    }, []);

    return { ...state, sendMessage, reset };
}
