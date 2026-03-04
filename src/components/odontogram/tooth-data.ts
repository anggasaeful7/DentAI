// SVG coordinates and metadata for 32 adult teeth (FDI numbering)
// Layout: Upper jaw on top, Lower jaw on bottom, right side is patient's right
export interface ToothData {
    number: number;
    name: string;
    type: "molar" | "premolar" | "canine" | "incisor";
    quadrant: 1 | 2 | 3 | 4; // 1=upper-right, 2=upper-left, 3=lower-left, 4=lower-right
    x: number;
    y: number;
}

// Upper jaw: right to left (18-11, 21-28)
// Lower jaw: left to right (38-31, 41-48)
export const TEETH_DATA: ToothData[] = [
    // Upper Right (Quadrant 1) - from right to center
    { number: 18, name: "Molar 3 (Bungsu)", type: "molar", quadrant: 1, x: 30, y: 40 },
    { number: 17, name: "Molar 2", type: "molar", quadrant: 1, x: 70, y: 35 },
    { number: 16, name: "Molar 1", type: "molar", quadrant: 1, x: 110, y: 30 },
    { number: 15, name: "Premolar 2", type: "premolar", quadrant: 1, x: 145, y: 25 },
    { number: 14, name: "Premolar 1", type: "premolar", quadrant: 1, x: 175, y: 22 },
    { number: 13, name: "Kaninus", type: "canine", quadrant: 1, x: 205, y: 18 },
    { number: 12, name: "Insisivus Lateral", type: "incisor", quadrant: 1, x: 232, y: 15 },
    { number: 11, name: "Insisivus Sentral", type: "incisor", quadrant: 1, x: 258, y: 13 },

    // Upper Left (Quadrant 2) - from center to left
    { number: 21, name: "Insisivus Sentral", type: "incisor", quadrant: 2, x: 292, y: 13 },
    { number: 22, name: "Insisivus Lateral", type: "incisor", quadrant: 2, x: 318, y: 15 },
    { number: 23, name: "Kaninus", type: "canine", quadrant: 2, x: 345, y: 18 },
    { number: 24, name: "Premolar 1", type: "premolar", quadrant: 2, x: 375, y: 22 },
    { number: 25, name: "Premolar 2", type: "premolar", quadrant: 2, x: 405, y: 25 },
    { number: 26, name: "Molar 1", type: "molar", quadrant: 2, x: 440, y: 30 },
    { number: 27, name: "Molar 2", type: "molar", quadrant: 2, x: 480, y: 35 },
    { number: 28, name: "Molar 3 (Bungsu)", type: "molar", quadrant: 2, x: 520, y: 40 },

    // Lower Left (Quadrant 3) - from left to center
    { number: 38, name: "Molar 3 (Bungsu)", type: "molar", quadrant: 3, x: 520, y: 180 },
    { number: 37, name: "Molar 2", type: "molar", quadrant: 3, x: 480, y: 185 },
    { number: 36, name: "Molar 1", type: "molar", quadrant: 3, x: 440, y: 190 },
    { number: 35, name: "Premolar 2", type: "premolar", quadrant: 3, x: 405, y: 195 },
    { number: 34, name: "Premolar 1", type: "premolar", quadrant: 3, x: 375, y: 198 },
    { number: 33, name: "Kaninus", type: "canine", quadrant: 3, x: 345, y: 202 },
    { number: 32, name: "Insisivus Lateral", type: "incisor", quadrant: 3, x: 318, y: 205 },
    { number: 31, name: "Insisivus Sentral", type: "incisor", quadrant: 3, x: 292, y: 207 },

    // Lower Right (Quadrant 4) - from center to right
    { number: 41, name: "Insisivus Sentral", type: "incisor", quadrant: 4, x: 258, y: 207 },
    { number: 42, name: "Insisivus Lateral", type: "incisor", quadrant: 4, x: 232, y: 205 },
    { number: 43, name: "Kaninus", type: "canine", quadrant: 4, x: 205, y: 202 },
    { number: 44, name: "Premolar 1", type: "premolar", quadrant: 4, x: 175, y: 198 },
    { number: 45, name: "Premolar 2", type: "premolar", quadrant: 4, x: 145, y: 195 },
    { number: 46, name: "Molar 1", type: "molar", quadrant: 4, x: 110, y: 190 },
    { number: 47, name: "Molar 2", type: "molar", quadrant: 4, x: 70, y: 185 },
    { number: 48, name: "Molar 3 (Bungsu)", type: "molar", quadrant: 4, x: 30, y: 180 },
];

export function getToothSize(type: string): { width: number; height: number } {
    switch (type) {
        case "molar": return { width: 32, height: 28 };
        case "premolar": return { width: 24, height: 24 };
        case "canine": return { width: 20, height: 26 };
        case "incisor": return { width: 18, height: 22 };
        default: return { width: 22, height: 22 };
    }
}
