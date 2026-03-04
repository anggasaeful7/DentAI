import type { ExtractedSymptoms, DiagnosisResult } from "../ai/types";
import { CONDITION_RULES } from "./rules";
import { getSeverityMeta } from "./severity";

export function evaluateSymptoms(symptoms: ExtractedSymptoms): DiagnosisResult {
    let bestMatch: DiagnosisResult | null = null;
    let highestConfidence = 0;

    for (const rule of CONDITION_RULES) {
        if (rule.conditions(symptoms)) {
            // Adjust confidence based on symptom details
            let confidence = rule.baseConfidence;

            // Duration modifier: longer duration = slightly higher confidence
            if (symptoms.duration_days > 14) confidence = Math.min(confidence + 0.05, 0.95);
            if (symptoms.duration_days > 30) confidence = Math.min(confidence + 0.03, 0.98);

            // Pain level modifier
            if (symptoms.pain_level >= 8) confidence = Math.min(confidence + 0.03, 0.95);

            // Multiple symptoms modifier
            const symptomCount = [
                symptoms.bleeding,
                symptoms.swelling,
                symptoms.growth,
                symptoms.sensitivity.cold,
                symptoms.sensitivity.hot,
                symptoms.sensitivity.pressure,
                symptoms.deep_cavity,
                symptoms.bad_breath,
                symptoms.loose_tooth,
            ].filter(Boolean).length;

            if (symptomCount >= 4) confidence = Math.min(confidence + 0.05, 0.95);

            if (confidence > highestConfidence) {
                highestConfidence = confidence;
                const severityMeta = getSeverityMeta(rule.severityScore);

                bestMatch = {
                    suspectedCondition: rule.name,
                    conditionNameId: rule.nameId,
                    severityLevel: rule.severity,
                    severityScore: rule.severityScore,
                    confidenceScore: Math.round(confidence * 100) / 100,
                    recommendation: severityMeta.recommendation,
                    colorCode: severityMeta.colorCode,
                    urgency: severityMeta.urgency,
                };
            }
        }
    }

    // Fallback if no rule matched
    if (!bestMatch) {
        return {
            suspectedCondition: "General Dental Issue",
            conditionNameId: "Masalah Gigi Umum",
            severityLevel: "low",
            severityScore: 3,
            confidenceScore: 0.5,
            recommendation: "Disarankan untuk melakukan pemeriksaan rutin ke dokter gigi.",
            colorCode: "#10B981",
            urgency: "Kontrol rutin",
        };
    }

    return bestMatch;
}
