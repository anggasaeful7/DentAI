<div align="center">

# 🦷 DentAI

### AI-Powered Dental Pre-Screening & Smart Odontogram

[![Live Demo](https://img.shields.io/badge/🌐_Live_Demo-dent--ai.vercel.app-blue?style=for-the-badge)](https://dent-ai-32hg.vercel.app)
[![Next.js](https://img.shields.io/badge/Next.js_16-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![Gemini](https://img.shields.io/badge/Gemini_AI-4285F4?style=for-the-badge&logo=google&logoColor=white)](https://ai.google.dev/)
[![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)](LICENSE)

**93% masyarakat Indonesia memiliki masalah gigi, namun mayoritas baru ke dokter setelah kondisi sudah parah.**

DentAI adalah sistem AI triage yang membantu masyarakat memahami kondisi giginya — cukup ceritakan keluhan, bicara, atau foto gigi — dapatkan analisis cerdas + visualisasi odontogram interaktif.

[🔍 Coba Sekarang](https://dent-ai-32hg.vercel.app) · [📄 PRD](../PRD.md)

</div>

---

## ✨ Fitur Unggulan

| | Fitur | Detail |
|---|---|---|
| 🤖 | **AI Chat Cerdas** | Gemini 3 Flash + auto-fallback OpenRouter. Streaming typewriter effect. |
| 🦷 | **Smart Odontogram** | SVG interaktif 32 gigi, severity glow, sistem FDI internasional |
| 🎤 | **Voice Input** | Bicara langsung (Bahasa Indonesia) via Web Speech API |
| 📸 | **Image Upload** | Foto gigi → Gemini Vision analisis otomatis |
| 📊 | **Decision Engine** | 10 aturan dental rule-based + AI hybrid, confidence scoring |
| 📄 | **PDF Report** | Download hasil konsultasi sebagai laporan A4 profesional |
| 🔐 | **Google Auth** | NextAuth v5 — Google OAuth + mode tamu |
| 🔒 | **Freemium Gate** | Hasil blur untuk tamu, unlock setelah login |
| 📱 | **PWA** | Installable, offline support, app shortcuts |
| 📈 | **Health Dashboard** | Tracking kesehatan gigi per-user dengan charts & reminder |
| 🌍 | **Multi-language** | Bahasa Indonesia + English |
| 🌗 | **Dark/Light Mode** | Toggle tema dengan transisi smooth |
| 🏥 | **Klinik Referral** | "Cari Dokter Gigi Terdekat" via Google Maps |
| 🛡️ | **Rate Limiting** | 10 req/min per session, in-memory cache 30min |

---

## 🏗️ Arsitektur

```
User Input (Teks / Voice / Foto)
        ↓
   Rate Limiter (10 req/min)
        ↓
   Gemini 3 Flash ──fail──▶ OpenRouter (fallback)
        ↓
   Symptom Extraction (JSON)
        ↓
   Decision Engine (10 rules + severity scoring)
        ↓
   ┌────────────────────────────────────┐
   │  Odontogram SVG  │  Edukasi AI    │
   │  (32 gigi FDI)   │  (Bahasa ID)   │
   └────────────────────────────────────┘
        ↓
   Streaming Response → Frontend (typewriter 15ms/char)
```

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | Next.js 16 (Turbopack), React 19, Tailwind CSS v4 |
| **AI Primary** | Google Gemini 3 Flash (free tier) |
| **AI Fallback** | OpenRouter — Gemini 2.5 Flash |
| **Vision** | Gemini Vision API (multimodal) |
| **Database** | Neon PostgreSQL (serverless) |
| **ORM** | Prisma 7 + PrismaPg adapter |
| **Auth** | NextAuth.js v5 (Google OAuth) |
| **PDF** | jsPDF (client-side) |
| **Deploy** | Vercel (Edge Network) |

---

## 📁 Struktur Project

```
src/
├── app/                          # 7 pages, 7 API routes
│   ├── consult/                  # Chat + Results + Freemium Gate
│   ├── dashboard/                # 🔐 Health Tracking
│   ├── history/                  # 🔐 Riwayat Per-User
│   └── api/
│       ├── consult/              # AI consultation engine
│       ├── vision/               # Image analysis (Gemini Vision)
│       ├── auth/[...nextauth]/   # Google OAuth
│       └── health-stats/         # Dashboard API
├── components/
│   ├── odontogram/               # SVG 32 gigi interaktif
│   ├── chat/                     # Chat + Image Upload
│   ├── AuthProvider, UserNav     # Auth UI
│   ├── ThemeToggle, LanguageToggle
│   └── ClinicReferral            # Google Maps CTA
├── lib/
│   ├── ai/                       # Gemini + OpenRouter + prompts
│   ├── engine/                   # 10 dental rules + severity
│   ├── auth, cache, i18n         # Auth, caching, translations
│   └── pdf-export                # PDF generation
└── hooks/
    ├── useConsultation           # Chat + streaming
    └── useSpeechToText           # Voice input
```

---

## 🚀 Quick Start

```bash
# 1. Clone
git clone https://github.com/anggasaeful7/DentAI.git
cd DentAI

# 2. Install
npm install

# 3. Setup environment
cp .env.example .env.local
# Isi: GEMINI_API_KEY, DATABASE_URL, AUTH_SECRET, dll.

# 4. Setup database
npx prisma generate
npx prisma db push

# 5. Run
npm run dev
```

Buka [http://localhost:3000](http://localhost:3000) 🦷

---

## 🌐 Environment Variables

```env
# AI
GEMINI_API_KEY=            # Google AI Studio
OPENROUTER_API_KEY=        # OpenRouter.ai

# Database
DATABASE_URL=              # Neon PostgreSQL connection string

# Auth
AUTH_SECRET=               # Random string for NextAuth
GOOGLE_CLIENT_ID=          # Google Cloud Console
GOOGLE_CLIENT_SECRET=      # Google Cloud Console

# App
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

---

## 💡 Kenapa DentAI Berbeda?

| Aspek | DentAI | Chatbot Medis Biasa |
|-------|--------|-------------------|
| Odontogram | ✅ SVG 32 gigi interaktif | ❌ Text only |
| AI Model | ✅ Hybrid (LLM + 10 rules) | ❌ LLM only |
| Input | ✅ Teks + Voice + Foto | ❌ Teks saja |
| Output | ✅ Visual + PDF + Referral | ❌ Teks saja |
| Streaming | ✅ Typewriter realtime | ❌ Tunggu full response |
| Business Model | ✅ Freemium + B2B Referral | ❌ Tidak ada |
| Dental-specific | ✅ FDI system, 10 kondisi | ❌ Generic |

---

## 📊 Business Model

```
┌──────────────┐    ┌────────────────┐    ┌──────────────────┐
│   Freemium   │    │  B2B Referral  │    │  SaaS Dashboard  │
│              │    │                │    │    (Future)       │
│ Free screen  │    │ "Cari Dokter"  │    │ Klinik analytics │
│ Login = full │    │  → Google Maps │    │ Rp 299k/bulan    │
│ results+PDF  │    │  → Partner fee │    │                  │
└──────────────┘    └────────────────┘    └──────────────────┘
```

---

## 📈 Impact & Market

- **93%** masyarakat Indonesia punya masalah gigi (Riskesdas)
- **15,000+** klinik dental di Indonesia (potential B2B)
- **Rp 45B+** dental tech market Indonesia

---

<div align="center">

### ⚠️ Disclaimer

**DentAI bukan alat diagnosis medis.** Hasil yang ditampilkan merupakan dugaan awal berbasis AI untuk tujuan edukasi. Selalu konsultasikan ke dokter gigi untuk diagnosis yang akurat.

---

Built with 🦷 + 🤖 by **Angga Saeful**

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/anggasaeful7/DentAI)

</div>
