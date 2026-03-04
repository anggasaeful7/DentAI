"use client";

import { useI18n } from "@/components/I18nProvider";

export default function LanguageToggle() {
    const { locale, setLocale } = useI18n();

    return (
        <button
            onClick={() => setLocale(locale === "id" ? "en" : "id")}
            className="px-2 py-1 rounded-lg text-[11px] font-bold border border-slate-700/50 hover:border-blue-500/50 transition-all"
            title={locale === "id" ? "Switch to English" : "Ganti ke Bahasa Indonesia"}
        >
            {locale === "id" ? "🇬🇧 EN" : "🇮🇩 ID"}
        </button>
    );
}
