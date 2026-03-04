import Link from "next/link";

const features = [
  { icon: "🤖", title: "AI Screening", desc: "Analisis keluhan gigi dengan kecerdasan buatan" },
  { icon: "🦷", title: "Smart Odontogram", desc: "Visualisasi interaktif lokasi masalah gigi" },
  { icon: "📊", title: "Severity Score", desc: "Tingkat urgensi dengan confidence score" },
  { icon: "📚", title: "Edukasi", desc: "Penjelasan lengkap dalam bahasa yang mudah" },
];

const steps = [
  { num: "01", title: "Ceritakan Keluhan", desc: "Ketik keluhan gigi Anda dalam bahasa sehari-hari", icon: "💬" },
  { num: "02", title: "AI Menganalisis", desc: "AI mengekstrak gejala dan menjalankan decision engine", icon: "⚡" },
  { num: "03", title: "Lihat Hasil Visual", desc: "Dapatkan hasil analisis lengkap dengan odontogram", icon: "🎯" },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden px-4 pt-20 pb-28 sm:pt-28 sm:pb-36">
        {/* Background gradient */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl" />
        </div>

        <div className="max-w-4xl mx-auto text-center">
          <div className="animate-slideUp">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-sm font-medium mb-6">
              <span className="w-2 h-2 bg-blue-400 rounded-full animate-pulse" />
              AI-Powered Dental Screening
            </div>
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold leading-tight mb-6 animate-slideUp stagger-1">
            Ketahui Kondisi
            <br />
            <span className="gradient-text">Gigimu dengan AI</span>
          </h1>

          <p className="text-lg sm:text-xl text-slate-400 max-w-2xl mx-auto mb-10 animate-slideUp stagger-2">
            Skrining awal kesehatan gigi berbasis AI. Ceritakan keluhan Anda dan
            dapatkan analisis cerdas dengan visualisasi odontogram interaktif.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-slideUp stagger-3">
            <Link
              href="/consult"
              className="inline-flex items-center justify-center gap-2 px-8 py-3.5 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-xl transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/25 hover:-translate-y-0.5"
            >
              🔍 Mulai Konsultasi Gratis
            </Link>
            <Link
              href="/about"
              className="inline-flex items-center justify-center gap-2 px-8 py-3.5 bg-slate-800/50 hover:bg-slate-700/50 text-slate-300 font-semibold rounded-xl border border-slate-700/50 transition-all duration-300"
            >
              Pelajari Lebih Lanjut
            </Link>
          </div>
        </div>
      </section>

      {/* How it Works */}
      <section className="px-4 py-20 bg-slate-900/50">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-4">
            ✨ Cara Kerja
          </h2>
          <p className="text-slate-400 text-center mb-12 max-w-xl mx-auto">
            Tiga langkah sederhana untuk mendapatkan analisis kesehatan gigi Anda
          </p>
          <div className="grid md:grid-cols-3 gap-8">
            {steps.map((step, i) => (
              <div
                key={step.num}
                className="relative glass rounded-2xl p-6 text-center hover:border-blue-500/30 transition-all duration-300 group hover:-translate-y-1"
              >
                <div className="text-4xl mb-4 group-hover:animate-float">{step.icon}</div>
                <div className="text-blue-400 text-xs font-bold tracking-widest mb-2">
                  STEP {step.num}
                </div>
                <h3 className="text-lg font-bold mb-2">{step.title}</h3>
                <p className="text-sm text-slate-400">{step.desc}</p>
                {i < 2 && (
                  <div className="hidden md:block absolute top-1/2 -right-4 text-slate-600 text-2xl">
                    →
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="px-4 py-20">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-4">
            🎯 Fitur Unggulan
          </h2>
          <p className="text-slate-400 text-center mb-12 max-w-xl mx-auto">
            Teknologi canggih untuk pemahaman kesehatan gigi yang lebih baik
          </p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((f) => (
              <div
                key={f.title}
                className="glass rounded-2xl p-6 hover:border-blue-500/30 transition-all duration-300 group hover:-translate-y-1"
              >
                <div className="text-3xl mb-3 group-hover:animate-float">{f.icon}</div>
                <h3 className="font-bold mb-1">{f.title}</h3>
                <p className="text-sm text-slate-400">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="px-4 py-20 bg-slate-900/50">
        <div className="max-w-3xl mx-auto text-center">
          <div className="glass rounded-3xl p-10 sm:p-14">
            <div className="text-5xl mb-6">🦷</div>
            <h2 className="text-3xl font-bold mb-4">
              Siap untuk <span className="gradient-text">Screening?</span>
            </h2>
            <p className="text-slate-400 mb-8 max-w-lg mx-auto">
              Gratis, tanpa registrasi, langsung pakai. Ceritakan keluhan gigi
              Anda dan dapatkan insight dalam hitungan detik.
            </p>
            <Link
              href="/consult"
              className="inline-flex items-center gap-2 px-8 py-3.5 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-xl transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/25 hover:-translate-y-0.5"
            >
              🔍 Mulai Sekarang
            </Link>
          </div>
        </div>
      </section>

      {/* Disclaimer Footer */}
      <footer className="px-4 py-8 border-t border-slate-800">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-xs text-slate-500 mb-2">
            ⚠️ <strong>Disclaimer:</strong> DentAI bukan pengganti dokter gigi.
            Hasil yang ditampilkan merupakan dugaan awal berbasis AI untuk tujuan
            edukasi. Selalu konsultasikan ke dokter gigi untuk diagnosis dan
            penanganan yang akurat.
          </p>
          <p className="text-xs text-slate-600">
            © 2026 DentAI — AI Dental Pre-Screening & Smart Odontogram
          </p>
        </div>
      </footer>
    </div>
  );
}
