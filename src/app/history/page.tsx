"use client";

import { useEffect, useState } from "react";
import { useSession, signIn } from "next-auth/react";
import Link from "next/link";

interface HistoryItem {
    id: string;
    suspectedCondition: string | null;
    severityLevel: string | null;
    confidenceScore: number | null;
    createdAt: string;
    rawInput: string;
}

export default function HistoryPage() {
    const { data: session, status } = useSession();
    const isLoggedIn = !!session?.user;
    const [consultations, setConsultations] = useState<HistoryItem[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!isLoggedIn) {
            setLoading(false);
            return;
        }

        const fetchHistory = async () => {
            try {
                const res = await fetch(`/api/history?userId=${session.user?.id}`);
                if (res.ok) {
                    const data = await res.json();
                    setConsultations(data.consultations || []);
                }
            } catch {
                // silently fail
            } finally {
                setLoading(false);
            }
        };
        fetchHistory();
    }, [isLoggedIn, session]);

    // Not logged in → login prompt
    if (status !== "loading" && !isLoggedIn) {
        return (
            <div className="min-h-screen flex items-center justify-center p-4">
                <div className="glass rounded-2xl p-10 text-center max-w-md animate-slideUp">
                    <div className="text-5xl mb-4">🔒</div>
                    <h2 className="text-xl font-bold mb-2">Login Diperlukan</h2>
                    <p className="text-sm text-slate-400 mb-6">
                        Masuk untuk melihat riwayat konsultasi Anda. Data tersimpan aman di akun Google Anda.
                    </p>
                    <button
                        onClick={() => signIn("google", { callbackUrl: "/history" })}
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
                    <Link href="/consult" className="text-xs text-slate-500 hover:text-blue-400 transition-colors">
                        ← Kembali ke Konsultasi
                    </Link>
                </div>
            </div>
        );
    }

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-pulse text-center">
                    <div className="text-4xl mb-4">📋</div>
                    <p className="text-slate-400">Memuat riwayat...</p>
                </div>
            </div>
        );
    }

    if (consultations.length === 0) {
        return (
            <div className="min-h-screen flex items-center justify-center p-4">
                <div className="glass rounded-2xl p-12 text-center max-w-md animate-fadeIn">
                    <div className="text-5xl mb-4">📋</div>
                    <h2 className="text-xl font-bold mb-2">Belum Ada Riwayat</h2>
                    <p className="text-slate-400 text-sm mb-6">
                        Anda belum pernah melakukan konsultasi. Mulai konsultasi pertama Anda!
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

    return (
        <div className="min-h-screen p-4 sm:p-8">
            <div className="max-w-3xl mx-auto">
                <div className="mb-8 animate-slideUp">
                    <h1 className="text-2xl font-bold mb-2">📋 Riwayat Konsultasi</h1>
                    <p className="text-slate-400 text-sm">
                        {consultations.length} konsultasi tersimpan • {session?.user?.name}
                    </p>
                </div>

                <div className="space-y-4">
                    {consultations.map((c, i) => (
                        <Link
                            key={c.id}
                            href={`/result/${c.id}`}
                            className={`block glass rounded-xl p-5 hover:bg-slate-800/60 transition-all animate-slideUp`}
                            style={{ animationDelay: `${i * 0.05}s` }}
                        >
                            <div className="flex items-start justify-between mb-2">
                                <div className="flex-1 min-w-0">
                                    <h3 className="font-semibold truncate">
                                        {c.suspectedCondition || "Konsultasi"}
                                    </h3>
                                    <p className="text-xs text-slate-500 mt-1 line-clamp-2">
                                        {c.rawInput}
                                    </p>
                                </div>
                                <div className="ml-3 flex flex-col items-end gap-1">
                                    <span
                                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${c.severityLevel === "high"
                                                ? "bg-red-500/20 text-red-400"
                                                : c.severityLevel === "medium"
                                                    ? "bg-amber-500/20 text-amber-400"
                                                    : "bg-green-500/20 text-green-400"
                                            }`}
                                    >
                                        {c.severityLevel === "high" ? "🔴 Tinggi" : c.severityLevel === "medium" ? "🟡 Sedang" : "🟢 Ringan"}
                                    </span>
                                    {c.confidenceScore && (
                                        <span className="text-[10px] text-slate-500">
                                            {Math.round(c.confidenceScore * 100)}% confidence
                                        </span>
                                    )}
                                </div>
                            </div>
                            <p className="text-[10px] text-slate-600">
                                {new Date(c.createdAt).toLocaleDateString("id-ID", {
                                    day: "numeric",
                                    month: "long",
                                    year: "numeric",
                                    hour: "2-digit",
                                    minute: "2-digit",
                                })}
                            </p>
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    );
}
