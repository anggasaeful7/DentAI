// ==================== Extracted Symptoms ====================
export interface ExtractedSymptoms {
    region: string;
    pain_level: number;
    pain_type: string;
    bleeding: boolean;
    growth: boolean;
    swelling: boolean;
    sensitivity: {
        hot: boolean;
        cold: boolean;
        pressure: boolean;
    };
    duration_days: number;
    deep_cavity: boolean;
    bad_breath: boolean;
    loose_tooth: boolean;
    additional_notes: string;
    needs_followup: boolean;
    followup_question: string;
}

// ==================== Decision Engine ====================
export interface ConditionRule {
    id: string;
    name: string;
    nameId: string; // Indonesian name
    conditions: (symptoms: ExtractedSymptoms) => boolean;
    baseConfidence: number;
    severity: "low" | "medium" | "high";
    severityScore: number;
}

export interface DiagnosisResult {
    suspectedCondition: string;
    conditionNameId: string;
    severityLevel: "low" | "medium" | "high";
    severityScore: number;
    confidenceScore: number;
    recommendation: string;
    colorCode: string;
    urgency: string;
}

// ==================== Odontogram ====================
export interface OdontogramMapping {
    toothNumber: number;
    condition: string;
    severity: "low" | "medium" | "high";
    description: string;
    confidenceScore: number;
}

// ==================== Consultation ====================
export interface ConsultationResult {
    consultationId: string;
    status: "completed" | "needs_followup";
    followUpQuestion?: string;
    result?: {
        extractedSymptoms: ExtractedSymptoms;
        diagnosis: DiagnosisResult;
        education: string;
        odontogramMapping: OdontogramMapping[];
    };
}

// ==================== Chat ====================
export interface ChatMessage {
    id: string;
    role: "user" | "assistant";
    content: string;
    timestamp: Date;
}

// ==================== API ====================
export interface ConsultRequest {
    message: string;
    sessionId: string;
    consultationId?: string;
}

export interface FeedbackRequest {
    consultationId: string;
    rating: number;
    comment?: string;
}
