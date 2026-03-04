export type Locale = "id" | "en";

export const translations = {
    id: {
        // Navbar
        nav_consult: "Konsultasi",
        nav_dashboard: "Dashboard",
        nav_history: "Riwayat",
        nav_about: "Tentang",
        nav_login: "Login",
        nav_logout: "Logout",

        // Landing
        hero_title: "Ketahui Kondisi Gigimu\ndengan Kecerdasan Buatan",
        hero_subtitle: "Sistem AI skrining awal kesehatan gigi dengan odontogram interaktif. Ceritakan keluhan Anda, dapatkan analisis cerdas.",
        hero_cta: "🔍 Mulai Konsultasi Gratis",
        hero_badge: "AI-Powered Dental Screening",

        // Features
        feat_ai: "AI Chat Cerdas",
        feat_ai_desc: "Jelaskan keluhan Anda dalam bahasa sehari-hari",
        feat_odonto: "Smart Odontogram",
        feat_odonto_desc: "Visualisasi gigi interaktif dengan severity coding",
        feat_edu: "Edukasi Kesehatan",
        feat_edu_desc: "Informasi penyebab, risiko, dan tindakan sementara",
        feat_voice: "Voice Input",
        feat_voice_desc: "Bicara langsung, AI yang mengetik",

        // Consult
        disclaimer_title: "Disclaimer Medis",
        disclaimer_text: "DentAI adalah sistem skrining awal berbasis AI dan bukan pengganti konsultasi dokter gigi.",
        disclaimer_agree: "Saya Mengerti & Setuju",
        chat_placeholder: "Ceritakan keluhan gigi Anda...",
        chat_recording: "Merekam suara...",
        chat_analyzing: "Menganalisis foto...",
        chat_new: "+ Konsultasi Baru",

        // Results
        result_suspect: "Dugaan Awal",
        result_confidence: "Confidence",
        result_severity: "Severity Score",
        result_urgency: "Urgency",
        result_odontogram: "Smart Odontogram",
        result_education: "Edukasi",
        result_download_pdf: "📄 Download PDF Report",
        result_login_pdf: "🔒 Login untuk PDF",
        result_unlock: "Unlock Hasil Lengkap",
        result_unlock_desc: "Login untuk melihat odontogram, edukasi lengkap, download PDF, dan tracking kesehatan gigi.",
        result_new: "🔍 Konsultasi Baru",
        result_history: "📋 Riwayat",

        // Severity
        severity_high: "🔴 Tinggi",
        severity_medium: "🟡 Sedang",
        severity_low: "🟢 Ringan",

        // Dashboard
        dash_title: "📊 Dashboard Kesehatan Gigi",
        dash_total: "Total Konsultasi",
        dash_conditions: "Kondisi Terdeteksi",
        dash_days: "Hari Sejak Cek",
        dash_reminder: "Reminder",
        dash_checkup: "⚠️ Waktunya checkup!",
        dash_soon: "🟡 Segera jadwalkan",
        dash_ok: "✅ Dalam jadwal",
        dash_condition_dist: "🦷 Distribusi Kondisi",
        dash_severity_dist: "📊 Distribusi Severity",
        dash_timeline: "📋 Timeline Konsultasi",
        dash_new: "🔍 Konsultasi Baru",

        // Feedback
        feedback_title: "⭐ Beri Rating",
        feedback_thanks: "✅ Terima kasih atas feedback Anda!",
        feedback_placeholder: "Komentar tambahan (opsional)...",
        feedback_submit: "Kirim Feedback",

        // Login gate
        login_required: "Login Diperlukan",
        login_desc_history: "Masuk untuk melihat riwayat konsultasi Anda.",
        login_desc_dashboard: "Masuk untuk melihat dashboard kesehatan gigi.",
        login_google: "Masuk dengan Google",
        login_back: "← Kembali ke Konsultasi",

        // Klinik referral
        referral_title: "🏥 Cari Dokter Gigi Terdekat",
        referral_desc: "Temukan klinik gigi di sekitar Anda untuk konsultasi langsung",
        referral_cta: "Buka di Google Maps",
        referral_note: "Hasil pencarian dari Google Maps",
    },
    en: {
        // Navbar
        nav_consult: "Consult",
        nav_dashboard: "Dashboard",
        nav_history: "History",
        nav_about: "About",
        nav_login: "Login",
        nav_logout: "Logout",

        // Landing
        hero_title: "Know Your Dental Health\nwith Artificial Intelligence",
        hero_subtitle: "AI-powered dental pre-screening system with interactive odontogram. Describe your symptoms, get smart analysis.",
        hero_cta: "🔍 Start Free Consultation",
        hero_badge: "AI-Powered Dental Screening",

        // Features
        feat_ai: "Smart AI Chat",
        feat_ai_desc: "Describe your symptoms in everyday language",
        feat_odonto: "Smart Odontogram",
        feat_odonto_desc: "Interactive tooth visualization with severity coding",
        feat_edu: "Health Education",
        feat_edu_desc: "Information on causes, risks, and temporary measures",
        feat_voice: "Voice Input",
        feat_voice_desc: "Speak directly, AI does the typing",

        // Consult
        disclaimer_title: "Medical Disclaimer",
        disclaimer_text: "DentAI is an AI-based pre-screening system and is not a substitute for dental consultation.",
        disclaimer_agree: "I Understand & Agree",
        chat_placeholder: "Describe your dental complaint...",
        chat_recording: "Recording voice...",
        chat_analyzing: "Analyzing photo...",
        chat_new: "+ New Consultation",

        // Results
        result_suspect: "Initial Suspicion",
        result_confidence: "Confidence",
        result_severity: "Severity Score",
        result_urgency: "Urgency",
        result_odontogram: "Smart Odontogram",
        result_education: "Education",
        result_download_pdf: "📄 Download PDF Report",
        result_login_pdf: "🔒 Login for PDF",
        result_unlock: "Unlock Full Results",
        result_unlock_desc: "Login to view odontogram, full education, PDF download, and dental health tracking.",
        result_new: "🔍 New Consultation",
        result_history: "📋 History",

        // Severity
        severity_high: "🔴 High",
        severity_medium: "🟡 Medium",
        severity_low: "🟢 Low",

        // Dashboard
        dash_title: "📊 Dental Health Dashboard",
        dash_total: "Total Consultations",
        dash_conditions: "Conditions Detected",
        dash_days: "Days Since Checkup",
        dash_reminder: "Reminder",
        dash_checkup: "⚠️ Time for a checkup!",
        dash_soon: "🟡 Schedule soon",
        dash_ok: "✅ On schedule",
        dash_condition_dist: "🦷 Condition Distribution",
        dash_severity_dist: "📊 Severity Distribution",
        dash_timeline: "📋 Consultation Timeline",
        dash_new: "🔍 New Consultation",

        // Feedback
        feedback_title: "⭐ Rate This",
        feedback_thanks: "✅ Thank you for your feedback!",
        feedback_placeholder: "Additional comments (optional)...",
        feedback_submit: "Submit Feedback",

        // Login gate
        login_required: "Login Required",
        login_desc_history: "Sign in to view your consultation history.",
        login_desc_dashboard: "Sign in to view your dental health dashboard.",
        login_google: "Sign in with Google",
        login_back: "← Back to Consultation",

        // Klinik referral
        referral_title: "🏥 Find Nearest Dentist",
        referral_desc: "Find dental clinics near you for in-person consultation",
        referral_cta: "Open in Google Maps",
        referral_note: "Search results from Google Maps",
    },
} as const;

export type TranslationKey = keyof typeof translations.id;

export function t(locale: Locale, key: TranslationKey): string {
    return translations[locale][key] || translations.id[key] || key;
}
