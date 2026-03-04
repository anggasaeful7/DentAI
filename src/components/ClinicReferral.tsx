"use client";

import { useI18n } from "@/components/I18nProvider";

interface ClinicReferralProps {
    condition?: string;
}

export default function ClinicReferral({ condition }: ClinicReferralProps) {
    const { t } = useI18n();

    const searchQuery = condition
        ? `dokter gigi ${condition} terdekat`
        : "dokter gigi terdekat";

    const mapsUrl = `https://www.google.com/maps/search/${encodeURIComponent(searchQuery)}`;

    return (
        <div className="glass rounded-2xl p-6 mt-6 animate-slideUp">
            <h3 className="text-sm font-bold mb-2">{t("referral_title")}</h3>
            <p className="text-xs text-slate-400 mb-4">{t("referral_desc")}</p>

            <a
                href={mapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 w-full py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold rounded-xl transition-all hover:-translate-y-0.5"
            >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                {t("referral_cta")}
            </a>

            <p className="text-[10px] text-slate-600 text-center mt-2">{t("referral_note")}</p>
        </div>
    );
}
