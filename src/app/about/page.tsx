import Link from "next/link";

export default function AboutPage() {
    return (
        <div className="min-h-screen p-4 sm:p-8">
            <div className="max-w-3xl mx-auto">
                <div className="mb-10 animate-slideUp">
                    <div className="text-5xl mb-4">🦷</div>
                    <h1 className="text-3xl font-bold mb-2">Tentang DentAI</h1>
                    <p className="text-slate-400">AI Dental Pre-Screening & Smart Odontogram</p>
                </div>

                <div className="space-y-6">
                    {/* What is DentAI */}
                    <div className="glass rounded-2xl p-6 animate-slideUp stagger-1">
                        <h2 className="text-lg font-bold mb-3">Apa itu DentAI?</h2>
                        <p className="text-sm text-slate-300 leading-relaxed">
                            DentAI adalah aplikasi web berbasis AI yang membantu pengguna
                            melakukan skrining awal keluhan gigi, memberikan edukasi kesehatan,
                            serta memvisualisasikan dugaan lokasi kerusakan melalui odontogram
                            digital interaktif.
                        </p>
                    </div>

                    {/* How it works */}
                    <div className="glass rounded-2xl p-6 animate-slideUp stagger-2">
                        <h2 className="text-lg font-bold mb-3">Bagaimana Cara Kerjanya?</h2>
                        <ol className="text-sm text-slate-300 space-y-3">
                            <li className="flex gap-3">
                                <span className="text-blue-400 font-bold">1.</span>
                                <span>Anda menceritakan keluhan gigi dalam bahasa sehari-hari</span>
                            </li>
                            <li className="flex gap-3">
                                <span className="text-blue-400 font-bold">2.</span>
                                <span>AI mengekstrak gejala dan menjalankan analisis berbasis rule + scoring</span>
                            </li>
                            <li className="flex gap-3">
                                <span className="text-blue-400 font-bold">3.</span>
                                <span>Sistem menampilkan dugaan kondisi, tingkat keparahan, dan lokasi pada odontogram</span>
                            </li>
                            <li className="flex gap-3">
                                <span className="text-blue-400 font-bold">4.</span>
                                <span>AI menghasilkan konten edukasi tentang kondisi tersebut dalam bahasa awam</span>
                            </li>
                        </ol>
                    </div>

                    {/* Tech Stack */}
                    <div className="glass rounded-2xl p-6 animate-slideUp stagger-3">
                        <h2 className="text-lg font-bold mb-3">Teknologi</h2>
                        <div className="grid grid-cols-2 gap-3">
                            {[
                                { label: "Frontend", value: "Next.js (App Router)" },
                                { label: "AI Engine", value: "Google Gemini" },
                                { label: "Database", value: "Neon PostgreSQL" },
                                { label: "Hosting", value: "Vercel" },
                                { label: "ORM", value: "Prisma" },
                                { label: "Styling", value: "Tailwind CSS" },
                            ].map((t) => (
                                <div key={t.label} className="bg-slate-800/50 rounded-lg p-3">
                                    <p className="text-[10px] text-slate-500 mb-0.5">{t.label}</p>
                                    <p className="text-xs font-medium">{t.value}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Disclaimer */}
                    <div className="bg-amber-500/10 border border-amber-500/20 rounded-2xl p-6 animate-slideUp stagger-4">
                        <h2 className="text-lg font-bold mb-3 text-amber-400">⚠️ Disclaimer Medis</h2>
                        <div className="text-sm text-slate-300 space-y-3 leading-relaxed">
                            <p>
                                DentAI <strong>bukan pengganti dokter gigi</strong> dan{" "}
                                <strong>bukan alat diagnosis medis</strong>. Semua hasil yang
                                ditampilkan merupakan <strong>dugaan awal</strong> berbasis AI
                                untuk tujuan edukasi semata.
                            </p>
                            <p>
                                Hasil skrining ini tidak boleh dijadikan dasar pengambilan
                                keputusan medis tanpa konsultasi dengan tenaga kesehatan
                                profesional. Selalu kunjungi dokter gigi untuk pemeriksaan dan
                                diagnosis yang akurat.
                            </p>
                            <p>
                                DentAI tidak menyimpan data medis sensitif dan tidak membagikan
                                data pengguna kepada pihak ketiga.
                            </p>
                        </div>
                    </div>

                    {/* CTA */}
                    <div className="text-center py-8">
                        <Link
                            href="/consult"
                            className="inline-flex items-center gap-2 px-8 py-3 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-xl transition-all hover:-translate-y-0.5"
                        >
                            🔍 Mulai Konsultasi
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
