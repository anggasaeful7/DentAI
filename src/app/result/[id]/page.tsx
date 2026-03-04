"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import OdontogramSVG from "@/components/odontogram/OdontogramSVG";
import Link from "next/link";

interface ConsultationDetail {
    id: string;
    rawInput: string;
    suspectedCondition: string;
    severityLevel: string;
    confidenceScore: number;
    educationOutput: string;
    createdAt: string;
    odontogramRecords: Array<{
        toothNumber: number;
        conditionLabel: string;
        severityLevel: string;
        confidenceScore: number;
        description: string;
    }>;
}

export default function ResultPage() {
    const params = useParams();
    const [data, setData] = useState<ConsultationDetail | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await fetch(`/api/consultation/${params.id}`);
                if (res.ok) {
                    setData(await res.json());
                }
            } catch {
                // silently fail
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [params.id]);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-pulse text-center">
                    <div className="text-4xl mb-4">🦷</div>
                    <p className="text-slate-400">Memuat hasil...</p>
                </div>
            </div>
        );
    }

    if (!data) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="text-4xl mb-4">❌</div>
                    <h2 className="text-xl font-bold mb-2">Tidak Ditemukan</h2>
                    <p className="text-slate-400 mb-6">Konsultasi dengan ID ini tidak ditemukan.</p>
                    <Link href="/consult" className="px-6 py-2.5 bg-blue-600 rounded-xl text-white font-medium">
                        Mulai Konsultasi Baru
                    </Link>
                </div>
            </div>
        );
    }

    const mappings = data.odontogramRecords.map((r) => ({
        toothNumber: r.toothNumber,
        condition: r.conditionLabel,
        severity: r.severityLevel as "low" | "medium" | "high",
        description: r.description || "",
        confidenceScore: r.confidenceScore || 0,
    }));

    return (
        <div className="min-h-screen p-4 sm:p-8">
            <div className="max-w-5xl mx-auto">
                <div className="mb-6 animate-slideUp">
                    <Link href="/history" className="text-xs text-slate-400 hover:text-blue-400 transition-colors">
                        ← Kembali ke Riwayat
                    </Link>
                </div>

                <div className="grid lg:grid-cols-2 gap-6">
                    {/* Left: Severity + Odontogram */}
                    <div className="space-y-6 animate-slideInLeft">
                        <div
                            className={`rounded-2xl p-6 ${data.severityLevel === "high"
                                    ? "severity-bg-high border border-red-500/30"
                                    : data.severityLevel === "medium"
                                        ? "severity-bg-medium border border-amber-500/30"
                                        : "severity-bg-low border border-green-500/30"
                                }`}
                        >
                            <p className="text-xs text-slate-400 mb-1">Dugaan Awal</p>
                            <h1 className="text-2xl font-bold mb-3">{data.suspectedCondition}</h1>
                            <div className="flex gap-6 mb-3">
                                <div>
                                    <p className="text-[10px] text-slate-400">Confidence</p>
                                    <p className="text-xl font-bold">{Math.round(data.confidenceScore * 100)}%</p>
                                </div>
                                <div>
                                    <p className="text-[10px] text-slate-400">Severity</p>
                                    <p className="text-xl font-bold capitalize">{data.severityLevel}</p>
                                </div>
                            </div>
                            <div className="w-full bg-slate-700/50 rounded-full h-2">
                                <div
                                    className="h-2 rounded-full"
                                    style={{
                                        width: `${data.confidenceScore * 100}%`,
                                        backgroundColor: data.severityLevel === "high" ? "#EF4444" : data.severityLevel === "medium" ? "#F59E0B" : "#10B981",
                                    }}
                                />
                            </div>
                        </div>

                        <div className="glass rounded-2xl p-6">
                            <h2 className="text-sm font-bold mb-4">🦷 Smart Odontogram</h2>
                            <OdontogramSVG mappings={mappings} />
                        </div>
                    </div>

                    {/* Right: Education */}
                    <div className="space-y-6 animate-slideInRight">
                        <div className="glass rounded-2xl p-6">
                            <h2 className="text-sm font-bold mb-2">💬 Keluhan Asli</h2>
                            <p className="text-sm text-slate-300 bg-slate-800/50 rounded-lg p-3 italic">
                                &quot;{data.rawInput}&quot;
                            </p>
                        </div>

                        <div className="glass rounded-2xl p-6">
                            <h2 className="text-sm font-bold mb-4">📚 Edukasi</h2>
                            <div className="text-sm text-slate-300 leading-relaxed space-y-1">
                                {(data.educationOutput || "").split("\n").map((line, i) => {
                                    if (line.startsWith("## "))
                                        return <h3 key={i} className="text-base font-bold text-slate-200 mt-4 mb-2">{line.replace("## ", "")}</h3>;
                                    if (line.startsWith("- "))
                                        return <p key={i} className="pl-3">• {line.replace("- ", "")}</p>;
                                    if (line.trim() === "") return <br key={i} />;
                                    return <p key={i}>{line}</p>;
                                })}
                            </div>
                        </div>

                        <div className="flex gap-3">
                            <Link href="/consult" className="flex-1 py-3 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-xl transition-all text-center text-sm">
                                🔍 Konsultasi Baru
                            </Link>
                            <Link href="/history" className="flex-1 py-3 bg-slate-800 hover:bg-slate-700 text-white font-semibold rounded-xl transition-all text-center text-sm">
                                📋 Riwayat
                            </Link>
                        </div>
                    </div>
                </div>

                <div className="mt-8 text-center text-xs text-slate-500">
                    Konsultasi pada{" "}
                    {new Date(data.createdAt).toLocaleDateString("id-ID", {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                    })}
                </div>
            </div>
        </div>
    );
}
