import type { ExtractedSymptoms, ConditionRule } from "../ai/types";

export const CONDITION_RULES: ConditionRule[] = [
    {
        id: "pulp_polyp",
        name: "Pulp Polyp",
        nameId: "Polip Pulpa",
        conditions: (s: ExtractedSymptoms) => s.growth && s.deep_cavity,
        baseConfidence: 0.82,
        severity: "high",
        severityScore: 8,
    },
    {
        id: "dental_abscess",
        name: "Dental Abscess",
        nameId: "Abses Dental",
        conditions: (s: ExtractedSymptoms) =>
            s.pain_type === "berdenyut" && s.swelling && s.pain_level >= 7,
        baseConfidence: 0.85,
        severity: "high",
        severityScore: 9,
    },
    {
        id: "irreversible_pulpitis",
        name: "Irreversible Pulpitis",
        nameId: "Pulpitis Ireversibel",
        conditions: (s: ExtractedSymptoms) =>
            s.pain_level >= 7 &&
            s.pain_type === "berdenyut" &&
            s.deep_cavity &&
            !s.swelling,
        baseConfidence: 0.8,
        severity: "high",
        severityScore: 8,
    },
    {
        id: "reversible_pulpitis",
        name: "Reversible Pulpitis",
        nameId: "Pulpitis Reversibel",
        conditions: (s: ExtractedSymptoms) =>
            (s.sensitivity.cold || s.sensitivity.hot) &&
            s.pain_level >= 4 &&
            s.pain_level <= 7 &&
            s.deep_cavity,
        baseConfidence: 0.75,
        severity: "medium",
        severityScore: 6,
    },
    {
        id: "early_caries",
        name: "Early Caries",
        nameId: "Karies Awal",
        conditions: (s: ExtractedSymptoms) =>
            s.sensitivity.cold && s.pain_level <= 4 && !s.swelling && !s.growth,
        baseConfidence: 0.75,
        severity: "low",
        severityScore: 3,
    },
    {
        id: "moderate_caries",
        name: "Moderate Caries",
        nameId: "Karies Sedang",
        conditions: (s: ExtractedSymptoms) =>
            s.deep_cavity && s.pain_level >= 3 && s.pain_level <= 6 && !s.growth,
        baseConfidence: 0.78,
        severity: "medium",
        severityScore: 5,
    },
    {
        id: "gingivitis",
        name: "Gingivitis",
        nameId: "Gingivitis (Radang Gusi)",
        conditions: (s: ExtractedSymptoms) =>
            s.bleeding && s.bad_breath && s.pain_level <= 4,
        baseConfidence: 0.78,
        severity: "medium",
        severityScore: 4,
    },
    {
        id: "periodontitis",
        name: "Periodontitis",
        nameId: "Periodontitis",
        conditions: (s: ExtractedSymptoms) =>
            s.bleeding && s.loose_tooth && s.pain_level >= 3,
        baseConfidence: 0.72,
        severity: "high",
        severityScore: 7,
    },
    {
        id: "pericoronitis",
        name: "Pericoronitis",
        nameId: "Perikoronitis",
        conditions: (s: ExtractedSymptoms) =>
            s.swelling &&
            (s.region.includes("molar") || s.region === "unknown") &&
            s.pain_level >= 5 &&
            !s.deep_cavity,
        baseConfidence: 0.7,
        severity: "medium",
        severityScore: 6,
    },
    {
        id: "tooth_sensitivity",
        name: "Tooth Sensitivity",
        nameId: "Gigi Sensitif",
        conditions: (s: ExtractedSymptoms) =>
            (s.sensitivity.cold || s.sensitivity.hot) &&
            s.pain_level <= 3 &&
            !s.deep_cavity,
        baseConfidence: 0.8,
        severity: "low",
        severityScore: 2,
    },
];
