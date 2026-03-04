"use client";

import { useState } from "react";
import { useSession, signIn } from "next-auth/react";
import ChatInterface from "@/components/chat/ChatInterface";
import OdontogramSVG from "@/components/odontogram/OdontogramSVG";
import ClinicReferral from "@/components/ClinicReferral";
import { useConsultation } from "@/hooks/useConsultation";
import { generatePDF } from "@/lib/pdf-export";
import Link from "next/link";

export default function ConsultPage() {
    const { messages, isLoading, result, isComplete, consultationId, sendMessage, reset } =
        useConsultation();
    const { data: session } = useSession();
    const isLoggedIn = !!session?.user;
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
        if (!result || !isLoggedIn) return;
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
                    {/* Severity Header — Always visible */}
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

                    {/* ============= GATED CONTENT (blur for guests) ============= */}
                    <div className="relative">
                        {/* Blur overlay for guests */}
                        {!isLoggedIn && (
                            <div className="absolute inset-0 z-20 flex items-start justify-center pt-16">
                                <div className="glass rounded-2xl p-8 text-center max-w-sm mx-4 animate-slideUp shadow-2xl shadow-blue-500/10">
                                    <div className="text-4xl mb-4">🔒</div>
                                    <h3 className="text-lg font-bold mb-2">Unlock Hasil Lengkap</h3>
                                    <p className="text-sm text-slate-400 mb-6">
                                        Login untuk melihat odontogram, edukasi lengkap, download PDF, dan tracking kesehatan gigi.
                                    </p>
                                    <button
                                        onClick={() => signIn("google", { callbackUrl: "/consult" })}
                                        className="w-full flex items-center justify-center gap-3 py-3 bg-white text-slate-900 font-medium rounded-xl hover:bg-slate-100 transition-all mb-3"
                                    >
                                        <svg className="w-5 h-5" viewBox="0 0 24 24">
                                            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4" />
                                            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                                            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                                            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                                        </svg>
                                        Masuk dengan Google
                                    </button>
                                    <p className="text-[10px] text-slate-600">
                                        Gratis! Data Anda aman dan terenkripsi.
                                    </p>
                                </div>
                            </div>
                        )}

                        {/* Content that gets blurred */}
                        <div className={!isLoggedIn ? "blur-sm pointer-events-none select-none" : ""}>
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

                            {/* Clinic Referral */}
                            <ClinicReferral condition={result.diagnosis.conditionNameId} />
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="flex flex-col sm:flex-row gap-3 mt-6">
                        {isLoggedIn ? (
                            <button
                                onClick={handleDownloadPDF}
                                className="flex-1 py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold rounded-xl transition-all flex items-center justify-center gap-2"
                            >
                                📄 Download PDF Report
                            </button>
                        ) : (
                            <button
                                onClick={() => signIn("google", { callbackUrl: "/consult" })}
                                className="flex-1 py-3 bg-emerald-600/50 text-white font-semibold rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer"
                            >
                                🔒 Login untuk PDF
                            </button>
                        )}
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
