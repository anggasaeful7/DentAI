"use client";

import { useState, useEffect } from "react";
import { getOrCreateSessionId } from "@/lib/session";
import Link from "next/link";

interface HistoryItem {
    id: string;
    suspectedCondition: string | null;
    severityLevel: string | null;
    confidenceScore: number | null;
    rawInput: string;
    createdAt: string;
}

export default function HistoryPage() {
    const [consultations, setConsultations] = useState<HistoryItem[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchHistory = async () => {
            try {
                const sessionId = getOrCreateSessionId();
                const res = await fetch(`/api/history?sessionId=${sessionId}`);
                const data = await res.json();
                setConsultations(data.consultations || []);
            } catch {
                // silently fail
            } finally {
                setLoading(false);
            }
        };
        fetchHistory();
    }, []);

    const severityBadge = (level: string | null) => {
        switch (level) {
            case "high": return <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-red-500/20 text-red-400">🔴 Tinggi</span>;
            case "medium": return <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/20 text-amber-400">🟡 Sedang</span>;
            case "low": return <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-green-500/20 text-green-400">🟢 Ringan</span>;
            default: return null;
        }
    };

    return (
        <div className="min-h-screen p-4 sm:p-8">
            <div className="max-w-3xl mx-auto">
                <div className="mb-8 animate-slideUp">
                    <h1 className="text-2xl font-bold mb-2">📋 Riwayat Konsultasi</h1>
                    <p className="text-slate-400 text-sm">
                        Daftar konsultasi yang telah Anda lakukan
                    </p>
                </div>

                {loading ? (
                    <div className="space-y-4">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="glass rounded-xl p-6 animate-pulse">
                                <div className="h-4 bg-slate-700 rounded w-1/3 mb-3" />
                                <div className="h-3 bg-slate-700 rounded w-2/3" />
                            </div>
                        ))}
                    </div>
                ) : consultations.length === 0 ? (
                    <div className="glass rounded-2xl p-12 text-center animate-fadeIn">
                        <div className="text-5xl mb-4">🦷</div>
                        <h3 className="text-lg font-bold mb-2">Belum Ada Riwayat</h3>
                        <p className="text-slate-400 text-sm mb-6">
                            Anda belum melakukan konsultasi apapun.
                        </p>
                        <Link
                            href="/consult"
                            className="inline-flex items-center gap-2 px-6 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-xl transition-all"
                        >
                            🔍 Mulai Konsultasi
                        </Link>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {consultations.map((c, i) => (
                            <Link
                                key={c.id}
                                href={`/result/${c.id}`}
                                className="block glass rounded-xl p-5 hover:border-blue-500/30 transition-all duration-200 hover:-translate-y-0.5 animate-slideUp"
                                style={{ animationDelay: `${i * 0.05}s` }}
                            >
                                <div className="flex items-start justify-between mb-2">
                                    <h3 className="font-bold text-sm">
                                        {c.suspectedCondition || "Konsultasi"}
                                    </h3>
                                    {severityBadge(c.severityLevel)}
                                </div>
                                <p className="text-xs text-slate-400 line-clamp-2 mb-2">
                                    {c.rawInput}
                                </p>
                                <div className="flex items-center gap-4 text-[10px] text-slate-500">
                                    <span>
                                        {new Date(c.createdAt).toLocaleDateString("id-ID", {
                                            day: "numeric",
                                            month: "short",
                                            year: "numeric",
                                            hour: "2-digit",
                                            minute: "2-digit",
                                        })}
                                    </span>
                                    {c.confidenceScore && (
                                        <span>Confidence: {Math.round(c.confidenceScore * 100)}%</span>
                                    )}
                                </div>
                            </Link>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
