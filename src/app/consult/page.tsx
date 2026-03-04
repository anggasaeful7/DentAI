"use client";

import { useState } from "react";
import ChatInterface from "@/components/chat/ChatInterface";
import OdontogramSVG from "@/components/odontogram/OdontogramSVG";
import { useConsultation } from "@/hooks/useConsultation";
import { generatePDF } from "@/lib/pdf-export";
import Link from "next/link";

export default function ConsultPage() {
    const { messages, isLoading, result, isComplete, consultationId, sendMessage, reset } =
        useConsultation();
    const [agreedDisclaimer, setAgreedDisclaimer] = useState(false);
    const [isAnalyzingImage, setIsAnalyzingImage] = useState(false);

    // Handle image upload → Vision API → auto-send complaint
    const handleImageUpload = async (file: File) => {
        setIsAnalyzingImage(true);
        try {
            const formData = new FormData();
            formData.append("image", file);

            const res = await fetch("/api/vision", {
                method: "POST",
                body: formData,
            });

            if (res.ok) {
                const data = await res.json();
                if (data.complaint) {
                    // Auto-send the image-derived complaint
                    sendMessage(`[📸 Dari foto gigi] ${data.complaint}`);
                }
            } else {
                sendMessage("Saya ingin mengupload foto gigi saya untuk dianalisis.");
            }
        } catch {
            sendMessage("Saya ingin mengupload foto gigi saya untuk dianalisis.");
        } finally {
            setIsAnalyzingImage(false);
        }
    };

    const handleDownloadPDF = () => {
        if (!result) return;
        generatePDF({
            diagnosis: result.diagnosis,
            education: result.education,
            odontogramMapping: result.odontogramMapping,
            rawInput: messages.find((m) => m.role === "user")?.content,
            createdAt: new Date().toISOString(),
        });
    };

    if (!agreedDisclaimer) {
        return (
            <div className="min-h-screen flex items-center justify-center p-4">
                <div className="glass rounded-2xl p-8 max-w-lg w-full animate-slideUp">
                    <div className="text-center mb-6">
                        <div className="text-5xl mb-4">⚠️</div>
                        <h2 className="text-xl font-bold mb-2">Disclaimer Medis</h2>
                    </div>
                    <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-4 mb-6">
                        <p className="text-sm text-slate-300 leading-relaxed">
                            DentAI adalah sistem skrining awal berbasis AI dan{" "}
                            <strong className="text-amber-400">bukan pengganti konsultasi dokter gigi</strong>.
                            Hasil yang ditampilkan merupakan{" "}
                            <strong className="text-amber-400">dugaan awal</strong> untuk tujuan edukasi.
                        </p>
                        <p className="text-sm text-slate-300 leading-relaxed mt-3">
                            Selalu konsultasikan ke dokter gigi untuk diagnosis dan penanganan yang akurat.
                        </p>
                    </div>
                    <div className="flex flex-col gap-3">
                        <button
                            onClick={() => setAgreedDisclaimer(true)}
                            className="w-full py-3 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-xl transition-all duration-200"
                        >
                            Saya Mengerti & Setuju
                        </button>
                        <div className="flex gap-2">
                            <div className="flex items-center gap-2 px-3 py-2 bg-slate-800/50 rounded-lg flex-1">
                                <span>🎤</span>
                                <span className="text-[10px] text-slate-400">Voice Input</span>
                            </div>
                            <div className="flex items-center gap-2 px-3 py-2 bg-slate-800/50 rounded-lg flex-1">
                                <span>📸</span>
                                <span className="text-[10px] text-slate-400">Foto Gigi</span>
                            </div>
                            <div className="flex items-center gap-2 px-3 py-2 bg-slate-800/50 rounded-lg flex-1">
                                <span>📄</span>
                                <span className="text-[10px] text-slate-400">PDF Export</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex flex-col lg:flex-row">
            {/* Chat Panel */}
            <div
                className={`flex flex-col ${isComplete ? "lg:w-1/2" : "w-full max-w-3xl mx-auto"
                    } h-[calc(100vh-4rem)] transition-all duration-500`}
            >
                <div className="flex items-center justify-between px-4 py-3 border-b border-slate-700/50">
                    <div className="flex items-center gap-2">
                        <span className="text-xl">🦷</span>
                        <div>
                            <h1 className="text-sm font-bold">DentAI Konsultasi</h1>
                            <p className="text-[10px] text-slate-500">AI Dental Pre-Screening</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        {isAnalyzingImage && (
                            <span className="text-[10px] text-blue-400 animate-pulse">📸 Menganalisis foto...</span>
                        )}
                        {isComplete && (
                            <button
                                onClick={reset}
                                className="px-3 py-1.5 text-xs font-medium bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors"
                            >
                                + Konsultasi Baru
                            </button>
                        )}
                    </div>
                </div>
                <ChatInterface
                    messages={messages}
                    isLoading={isLoading || isAnalyzingImage}
                    onSendMessage={sendMessage}
                    onImageUpload={handleImageUpload}
                    disabled={isComplete}
                />
            </div>

            {/* Result Panel */}
            {isComplete && result && (
                <div className="lg:w-1/2 border-l border-slate-700/50 overflow-y-auto h-[calc(100vh-4rem)] p-6 animate-slideInRight">
                    {/* Severity Header */}
                    <div
                        className={`rounded-2xl p-6 mb-6 ${result.diagnosis.severityLevel === "high"
                                ? "severity-bg-high border border-red-500/30"
                                : result.diagnosis.severityLevel === "medium"
                                    ? "severity-bg-medium border border-amber-500/30"
                                    : "severity-bg-low border border-green-500/30"
                            }`}
                    >
                        <div className="flex items-start justify-between mb-3">
                            <div>
                                <p className="text-xs text-slate-400 mb-1">Dugaan Awal</p>
                                <h2 className="text-xl font-bold">{result.diagnosis.conditionNameId}</h2>
                            </div>
                            <div
                                className={`px-3 py-1 rounded-full text-xs font-bold ${result.diagnosis.severityLevel === "high"
                                        ? "bg-red-500/20 text-red-400"
                                        : result.diagnosis.severityLevel === "medium"
                                            ? "bg-amber-500/20 text-amber-400"
                                            : "bg-green-500/20 text-green-400"
                                    }`}
                            >
                                {result.diagnosis.severityLevel === "high"
                                    ? "🔴 Tinggi"
                                    : result.diagnosis.severityLevel === "medium"
                                        ? "🟡 Sedang"
                                        : "🟢 Ringan"}
                            </div>
                        </div>

                        <div className="flex gap-6">
                            <div>
                                <p className="text-[10px] text-slate-400 mb-1">Confidence</p>
                                <p className="text-lg font-bold">
                                    {Math.round(result.diagnosis.confidenceScore * 100)}%
                                </p>
                            </div>
                            <div>
                                <p className="text-[10px] text-slate-400 mb-1">Severity Score</p>
                                <p className="text-lg font-bold">{result.diagnosis.severityScore}/10</p>
                            </div>
                            <div>
                                <p className="text-[10px] text-slate-400 mb-1">Urgency</p>
                                <p className="text-sm font-bold">{result.diagnosis.urgency}</p>
                            </div>
                        </div>

                        {/* Confidence bar */}
                        <div className="mt-3 w-full bg-slate-700/50 rounded-full h-2">
                            <div
                                className="h-2 rounded-full transition-all duration-1000"
                                style={{
                                    width: `${result.diagnosis.confidenceScore * 100}%`,
                                    backgroundColor: result.diagnosis.colorCode,
                                }}
                            />
                        </div>

                        <p className="text-sm text-slate-300 mt-3">{result.diagnosis.recommendation}</p>
                    </div>

                    {/* Odontogram */}
                    <div className="glass rounded-2xl p-6 mb-6">
                        <h3 className="text-sm font-bold mb-4 flex items-center gap-2">
                            🦷 Smart Odontogram
                        </h3>
                        <OdontogramSVG mappings={result.odontogramMapping} />
                    </div>

                    {/* Education */}
                    <div className="glass rounded-2xl p-6 mb-6">
                        <h3 className="text-sm font-bold mb-4 flex items-center gap-2">
                            📚 Edukasi
                        </h3>
                        <div className="text-slate-300 leading-relaxed">
                            {result.education.split("\n").map((line, i) => {
                                if (line.startsWith("## "))
                                    return (
                                        <h4 key={i} className="text-base font-bold text-slate-200 mt-4 mb-2">
                                            {line.replace("## ", "")}
                                        </h4>
                                    );
                                if (line.startsWith("- "))
                                    return (
                                        <p key={i} className="text-sm pl-3 mb-1">
                                            • {line.replace("- ", "")}
                                        </p>
                                    );
                                if (line.trim() === "") return <br key={i} />;
                                return (
                                    <p key={i} className="text-sm mb-1">
                                        {line}
                                    </p>
                                );
                            })}
                        </div>
                    </div>

                    {/* Feedback */}
                    <FeedbackSection consultationId={consultationId || ""} />

                    {/* Actions */}
                    <div className="flex flex-col sm:flex-row gap-3 mt-6">
                        <button
                            onClick={handleDownloadPDF}
                            className="flex-1 py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold rounded-xl transition-all flex items-center justify-center gap-2"
                        >
                            📄 Download PDF Report
                        </button>
                        <button
                            onClick={reset}
                            className="flex-1 py-3 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-xl transition-all flex items-center justify-center gap-2"
                        >
                            🔍 Konsultasi Baru
                        </button>
                        <Link
                            href="/history"
                            className="flex-1 py-3 bg-slate-800 hover:bg-slate-700 text-white font-semibold rounded-xl transition-all text-center flex items-center justify-center gap-2"
                        >
                            📋 Riwayat
                        </Link>
                    </div>
                </div>
            )}
        </div>
    );
}

function FeedbackSection({ consultationId }: { consultationId: string }) {
    const [rating, setRating] = useState(0);
    const [hover, setHover] = useState(0);
    const [comment, setComment] = useState("");
    const [submitted, setSubmitted] = useState(false);

    const submitFeedback = async () => {
        if (rating === 0) return;
        try {
            await fetch("/api/feedback", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ consultationId, rating, comment: comment || undefined }),
            });
            setSubmitted(true);
        } catch {
            // silently fail
        }
    };

    if (submitted) {
        return (
            <div className="glass rounded-2xl p-6 text-center">
                <p className="text-green-400 font-medium">✅ Terima kasih atas feedback Anda!</p>
            </div>
        );
    }

    return (
        <div className="glass rounded-2xl p-6">
            <h3 className="text-sm font-bold mb-3">⭐ Beri Rating</h3>
            <div className="flex items-center gap-2 mb-3">
                {[1, 2, 3, 4, 5].map((star) => (
                    <button
                        key={star}
                        onClick={() => setRating(star)}
                        onMouseEnter={() => setHover(star)}
                        onMouseLeave={() => setHover(0)}
                        className="text-2xl transition-transform hover:scale-125"
                    >
                        {star <= (hover || rating) ? "⭐" : "☆"}
                    </button>
                ))}
            </div>
            {rating > 0 && (
                <div className="space-y-3">
                    <textarea
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        placeholder="Komentar tambahan (opsional)..."
                        className="w-full bg-slate-800/50 rounded-lg p-3 text-sm text-slate-300 placeholder-slate-500 resize-none focus:outline-none focus:ring-1 focus:ring-blue-500/50"
                        rows={2}
                    />
                    <button
                        onClick={submitFeedback}
                        className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-sm font-medium rounded-lg transition-all"
                    >
                        Kirim Feedback
                    </button>
                </div>
            )}
        </div>
    );
}
