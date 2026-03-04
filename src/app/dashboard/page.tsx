"use client";

import { useEffect, useState } from "react";
import { getOrCreateSessionId } from "@/lib/session";
import Link from "next/link";

interface HealthStats {
    totalConsultations: number;
    conditionBreakdown: Record<string, number>;
    severityBreakdown: Record<string, number>;
    lastConsultation: string | null;
    consultations: Array<{
        id: string;
        suspectedCondition: string | null;
        severityLevel: string | null;
        confidenceScore: number | null;
        createdAt: string;
    }>;
}

export default function DashboardPage() {
    const [stats, setStats] = useState<HealthStats | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const sessionId = getOrCreateSessionId();
                const res = await fetch(`/api/health-stats?sessionId=${sessionId}`);
                if (res.ok) {
                    setStats(await res.json());
                }
            } catch {
                // silently fail
            } finally {
                setLoading(false);
            }
        };
        fetchStats();
    }, []);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-pulse text-center">
                    <div className="text-4xl mb-4">📊</div>
                    <p className="text-slate-400">Memuat dashboard...</p>
                </div>
            </div>
        );
    }

    if (!stats || stats.totalConsultations === 0) {
        return (
            <div className="min-h-screen flex items-center justify-center p-4">
                <div className="glass rounded-2xl p-12 text-center max-w-md animate-fadeIn">
                    <div className="text-5xl mb-4">📊</div>
                    <h2 className="text-xl font-bold mb-2">Belum Ada Data</h2>
                    <p className="text-slate-400 text-sm mb-6">
                        Mulai konsultasi untuk melihat tracking kesehatan gigi Anda.
                    </p>
                    <Link
                        href="/consult"
                        className="inline-flex items-center gap-2 px-6 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-xl transition-all"
                    >
                        🔍 Mulai Konsultasi
                    </Link>
                </div>
            </div>
        );
    }

    const severityColors: Record<string, string> = {
        low: "bg-green-500",
        medium: "bg-amber-500",
        high: "bg-red-500",
    };

    const lastCheckDate = stats.lastConsultation
        ? new Date(stats.lastConsultation)
        : null;
    const daysSinceCheck = lastCheckDate
        ? Math.floor((Date.now() - lastCheckDate.getTime()) / (1000 * 60 * 60 * 24))
        : null;

    return (
        <div className="min-h-screen p-4 sm:p-8">
            <div className="max-w-5xl mx-auto">
                <div className="mb-8 animate-slideUp">
                    <h1 className="text-2xl font-bold mb-2">📊 Dashboard Kesehatan Gigi</h1>
                    <p className="text-slate-400 text-sm">
                        Pantau kondisi kesehatan gigi Anda dari waktu ke waktu
                    </p>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                    <div className="glass rounded-xl p-5 animate-slideUp">
                        <p className="text-[10px] text-slate-500 mb-1">Total Konsultasi</p>
                        <p className="text-3xl font-bold text-blue-400">{stats.totalConsultations}</p>
                    </div>
                    <div className="glass rounded-xl p-5 animate-slideUp stagger-1">
                        <p className="text-[10px] text-slate-500 mb-1">Kondisi Terdeteksi</p>
                        <p className="text-3xl font-bold text-emerald-400">
                            {Object.keys(stats.conditionBreakdown).length}
                        </p>
                    </div>
                    <div className="glass rounded-xl p-5 animate-slideUp stagger-2">
                        <p className="text-[10px] text-slate-500 mb-1">Hari Sejak Cek</p>
                        <p className={`text-3xl font-bold ${daysSinceCheck !== null && daysSinceCheck > 180 ? "text-red-400" : daysSinceCheck !== null && daysSinceCheck > 90 ? "text-amber-400" : "text-green-400"}`}>
                            {daysSinceCheck ?? "—"}
                        </p>
                    </div>
                    <div className="glass rounded-xl p-5 animate-slideUp stagger-3">
                        <p className="text-[10px] text-slate-500 mb-1">Reminder</p>
                        {daysSinceCheck !== null && daysSinceCheck > 180 ? (
                            <p className="text-sm font-bold text-red-400">⚠️ Waktunya checkup!</p>
                        ) : daysSinceCheck !== null && daysSinceCheck > 90 ? (
                            <p className="text-sm font-bold text-amber-400">🟡 Segera jadwalkan</p>
                        ) : (
                            <p className="text-sm font-bold text-green-400">✅ Dalam jadwal</p>
                        )}
                    </div>
                </div>

                <div className="grid lg:grid-cols-2 gap-6">
                    {/* Condition Distribution */}
                    <div className="glass rounded-2xl p-6 animate-slideUp">
                        <h3 className="text-sm font-bold mb-4">🦷 Distribusi Kondisi</h3>
                        <div className="space-y-3">
                            {Object.entries(stats.conditionBreakdown).map(([condition, count]) => (
                                <div key={condition}>
                                    <div className="flex justify-between text-xs mb-1">
                                        <span className="text-slate-300">{condition}</span>
                                        <span className="text-slate-500">{count}x</span>
                                    </div>
                                    <div className="w-full bg-slate-700/50 rounded-full h-2">
                                        <div
                                            className="h-2 rounded-full bg-blue-500 transition-all duration-1000"
                                            style={{
                                                width: `${(count / stats.totalConsultations) * 100}%`,
                                            }}
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Severity Distribution */}
                    <div className="glass rounded-2xl p-6 animate-slideUp stagger-1">
                        <h3 className="text-sm font-bold mb-4">📊 Distribusi Severity</h3>
                        <div className="flex items-end gap-4 h-40">
                            {["low", "medium", "high"].map((level) => {
                                const count = stats.severityBreakdown[level] || 0;
                                const percentage = stats.totalConsultations > 0
                                    ? (count / stats.totalConsultations) * 100
                                    : 0;
                                return (
                                    <div key={level} className="flex-1 flex flex-col items-center gap-2">
                                        <span className="text-xs font-bold text-slate-300">{count}</span>
                                        <div className="w-full bg-slate-700/30 rounded-lg relative overflow-hidden" style={{ height: "100px" }}>
                                            <div
                                                className={`absolute bottom-0 w-full rounded-lg transition-all duration-1000 ${severityColors[level]}`}
                                                style={{ height: `${Math.max(percentage, 5)}%` }}
                                            />
                                        </div>
                                        <span className="text-[10px] text-slate-500 capitalize">{level === "low" ? "Ringan" : level === "medium" ? "Sedang" : "Tinggi"}</span>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>

                {/* Recent Timeline */}
                <div className="glass rounded-2xl p-6 mt-6 animate-slideUp stagger-2">
                    <h3 className="text-sm font-bold mb-4">📋 Timeline Konsultasi</h3>
                    <div className="space-y-4">
                        {stats.consultations.slice(0, 5).map((c, i) => (
                            <Link
                                key={c.id}
                                href={`/result/${c.id}`}
                                className="flex items-center gap-4 p-3 bg-slate-800/30 rounded-xl hover:bg-slate-800/60 transition-all group"
                            >
                                <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold bg-slate-700 text-slate-300 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                                    {i + 1}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium truncate">
                                        {c.suspectedCondition || "Konsultasi"}
                                    </p>
                                    <p className="text-[10px] text-slate-500">
                                        {new Date(c.createdAt).toLocaleDateString("id-ID", {
                                            day: "numeric",
                                            month: "short",
                                            year: "numeric",
                                        })}
                                    </p>
                                </div>
                                <div className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${c.severityLevel === "high" ? "bg-red-500/20 text-red-400"
                                        : c.severityLevel === "medium" ? "bg-amber-500/20 text-amber-400"
                                            : "bg-green-500/20 text-green-400"
                                    }`}>
                                    {c.severityLevel === "high" ? "Tinggi" : c.severityLevel === "medium" ? "Sedang" : "Ringan"}
                                </div>
                                {c.confidenceScore && (
                                    <span className="text-[10px] text-slate-500">{Math.round(c.confidenceScore * 100)}%</span>
                                )}
                            </Link>
                        ))}
                    </div>
                </div>

                {/* CTA */}
                <div className="text-center mt-8">
                    <Link
                        href="/consult"
                        className="inline-flex items-center gap-2 px-8 py-3 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-xl transition-all hover:-translate-y-0.5"
                    >
                        🔍 Konsultasi Baru
                    </Link>
                </div>
            </div>
        </div>
    );
}
