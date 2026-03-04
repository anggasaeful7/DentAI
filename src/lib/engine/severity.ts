interface SeverityMeta {
    label: string;
    colorCode: string;
    urgency: string;
    recommendation: string;
}

export function getSeverityMeta(score: number): SeverityMeta {
    if (score >= 7) {
        return {
            label: "🔴 Tinggi",
            colorCode: "#EF4444",
            urgency: "Segera ke dokter gigi",
            recommendation:
                "Kondisi ini memerlukan penanganan segera. Jangan tunda kunjungan ke dokter gigi untuk mencegah komplikasi lebih lanjut.",
        };
    }
    if (score >= 4) {
        return {
            label: "🟡 Sedang",
            colorCode: "#F59E0B",
            urgency: "Perlu kontrol ke dokter gigi",
            recommendation:
                "Disarankan untuk menjadwalkan kunjungan ke dokter gigi dalam waktu dekat untuk pemeriksaan dan penanganan lebih lanjut.",
        };
    }
    return {
        label: "🟢 Ringan",
        colorCode: "#10B981",
        urgency: "Kontrol rutin",
        recommendation:
            "Kondisi masih tergolong ringan. Jaga kebersihan gigi dan lakukan kontrol rutin ke dokter gigi setiap 6 bulan.",
    };
}

export function getSeverityLabel(level: string): string {
    switch (level) {
        case "high":
            return "🔴 Tinggi";
        case "medium":
            return "🟡 Sedang";
        case "low":
            return "🟢 Ringan";
        default:
            return "🟢 Ringan";
    }
}

export function getSeverityColor(level: string): string {
    switch (level) {
        case "high":
            return "#EF4444";
        case "medium":
            return "#F59E0B";
        case "low":
            return "#10B981";
        default:
            return "#10B981";
    }
}
