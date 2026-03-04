import type { OdontogramMapping } from "../ai/types";

// FDI Tooth Numbering System mapping
const REGION_TO_TEETH: Record<string, number[]> = {
    upper_right_molar: [16, 17, 18],
    upper_left_molar: [26, 27, 28],
    lower_left_molar: [36, 37, 38],
    lower_right_molar: [46, 47, 48],
    upper_right_premolar: [14, 15],
    upper_left_premolar: [24, 25],
    lower_left_premolar: [34, 35],
    lower_right_premolar: [44, 45],
    upper_right_canine: [13],
    upper_left_canine: [23],
    lower_left_canine: [33],
    lower_right_canine: [43],
    upper_front: [11, 12, 21, 22],
    lower_front: [31, 32, 41, 42],
    gums_upper: [11, 12, 13, 14, 15, 16, 17, 18, 21, 22, 23, 24, 25, 26, 27, 28],
    gums_lower: [31, 32, 33, 34, 35, 36, 37, 38, 41, 42, 43, 44, 45, 46, 47, 48],
    gums_all: [
        11, 12, 13, 14, 15, 16, 17, 18,
        21, 22, 23, 24, 25, 26, 27, 28,
        31, 32, 33, 34, 35, 36, 37, 38,
        41, 42, 43, 44, 45, 46, 47, 48,
    ],
    all: [
        11, 12, 13, 14, 15, 16, 17, 18,
        21, 22, 23, 24, 25, 26, 27, 28,
        31, 32, 33, 34, 35, 36, 37, 38,
        41, 42, 43, 44, 45, 46, 47, 48,
    ],
};

// Tooth name mapping (Indonesian)
const TOOTH_NAMES: Record<number, string> = {
    11: "Insisivus Sentral Kanan Atas",
    12: "Insisivus Lateral Kanan Atas",
    13: "Kaninus Kanan Atas",
    14: "Premolar Pertama Kanan Atas",
    15: "Premolar Kedua Kanan Atas",
    16: "Molar Pertama Kanan Atas",
    17: "Molar Kedua Kanan Atas",
    18: "Molar Ketiga Kanan Atas (Bungsu)",
    21: "Insisivus Sentral Kiri Atas",
    22: "Insisivus Lateral Kiri Atas",
    23: "Kaninus Kiri Atas",
    24: "Premolar Pertama Kiri Atas",
    25: "Premolar Kedua Kiri Atas",
    26: "Molar Pertama Kiri Atas",
    27: "Molar Kedua Kiri Atas",
    28: "Molar Ketiga Kiri Atas (Bungsu)",
    31: "Insisivus Sentral Kiri Bawah",
    32: "Insisivus Lateral Kiri Bawah",
    33: "Kaninus Kiri Bawah",
    34: "Premolar Pertama Kiri Bawah",
    35: "Premolar Kedua Kiri Bawah",
    36: "Molar Pertama Kiri Bawah",
    37: "Molar Kedua Kiri Bawah",
    38: "Molar Ketiga Kiri Bawah (Bungsu)",
    41: "Insisivus Sentral Kanan Bawah",
    42: "Insisivus Lateral Kanan Bawah",
    43: "Kaninus Kanan Bawah",
    44: "Premolar Pertama Kanan Bawah",
    45: "Premolar Kedua Kanan Bawah",
    46: "Molar Pertama Kanan Bawah",
    47: "Molar Kedua Kanan Bawah",
    48: "Molar Ketiga Kanan Bawah (Bungsu)",
};

export function getToothName(toothNumber: number): string {
    return TOOTH_NAMES[toothNumber] || `Gigi ${toothNumber}`;
}

export function mapRegionToTeeth(
    region: string,
    condition: string,
    severity: "low" | "medium" | "high",
    confidenceScore: number
): OdontogramMapping[] {
    const teeth = REGION_TO_TEETH[region] || REGION_TO_TEETH["unknown"] || [];

    if (teeth.length === 0) {
        // Default to lower left molar area if unknown
        return [36, 37].map((t) => ({
            toothNumber: t,
            condition,
            severity,
            description: `Kemungkinan ${condition} pada ${getToothName(t)}`,
            confidenceScore,
        }));
    }

    return teeth.map((toothNumber) => ({
        toothNumber,
        condition,
        severity,
        description: `Kemungkinan ${condition} pada ${getToothName(toothNumber)}`,
        confidenceScore,
    }));
}

export function getAllTeethNumbers(): number[] {
    return [
        18, 17, 16, 15, 14, 13, 12, 11,
        21, 22, 23, 24, 25, 26, 27, 28,
        48, 47, 46, 45, 44, 43, 42, 41,
        31, 32, 33, 34, 35, 36, 37, 38,
    ];
}
