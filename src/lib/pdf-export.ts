"use client";

import { jsPDF } from "jspdf";
import type { DiagnosisResult, OdontogramMapping } from "@/lib/ai/types";

interface ExportData {
    diagnosis: DiagnosisResult;
    education: string;
    odontogramMapping: OdontogramMapping[];
    rawInput?: string;
    createdAt?: string;
}

export function generatePDF(data: ExportData) {
    const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
    const pageWidth = doc.internal.pageSize.getWidth();
    let y = 20;

    // Colors
    const blue = [59, 130, 246] as const;
    const dark = [15, 23, 42] as const;
    const gray = [148, 163, 184] as const;
    const severityColor =
        data.diagnosis.severityLevel === "high" ? ([239, 68, 68] as const)
            : data.diagnosis.severityLevel === "medium" ? ([245, 158, 11] as const)
                : ([16, 185, 129] as const);

    // Header
    doc.setFillColor(...dark);
    doc.rect(0, 0, pageWidth, 45, "F");

    doc.setTextColor(255, 255, 255);
    doc.setFontSize(24);
    doc.setFont("helvetica", "bold");
    doc.text("DentAI", 15, 18);

    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.text("AI Dental Pre-Screening Report", 15, 26);

    doc.setFontSize(8);
    doc.setTextColor(...gray);
    const date = data.createdAt
        ? new Date(data.createdAt).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric", hour: "2-digit", minute: "2-digit" })
        : new Date().toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric", hour: "2-digit", minute: "2-digit" });
    doc.text(`Tanggal: ${date}`, 15, 35);

    y = 55;

    // Diagnosis Box
    doc.setFillColor(severityColor[0], severityColor[1], severityColor[2]);
    doc.roundedRect(15, y, pageWidth - 30, 8, 2, 2, "F");
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(10);
    doc.setFont("helvetica", "bold");
    const severityLabel = data.diagnosis.severityLevel === "high" ? "TINGGI" : data.diagnosis.severityLevel === "medium" ? "SEDANG" : "RINGAN";
    doc.text(`Severity: ${severityLabel}`, 20, y + 5.5);
    doc.text(`Confidence: ${Math.round(data.diagnosis.confidenceScore * 100)}%`, pageWidth - 60, y + 5.5);

    y += 14;

    // Suspected Condition
    doc.setTextColor(...dark);
    doc.setFontSize(8);
    doc.setFont("helvetica", "normal");
    doc.text("Dugaan Awal:", 15, y);
    y += 6;
    doc.setFontSize(16);
    doc.setFont("helvetica", "bold");
    doc.text(data.diagnosis.conditionNameId, 15, y);
    y += 10;

    // Recommendation
    doc.setFontSize(9);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(100, 116, 139);
    const recLines = doc.splitTextToSize(data.diagnosis.recommendation, pageWidth - 30);
    doc.text(recLines, 15, y);
    y += recLines.length * 5 + 5;

    // Original Complaint
    if (data.rawInput) {
        doc.setDrawColor(226, 232, 240);
        doc.setFillColor(241, 245, 249);
        doc.roundedRect(15, y, pageWidth - 30, 18, 2, 2, "FD");

        doc.setFontSize(8);
        doc.setFont("helvetica", "bold");
        doc.setTextColor(...dark);
        doc.text("Keluhan Asli:", 20, y + 5);

        doc.setFont("helvetica", "italic");
        doc.setFontSize(8);
        doc.setTextColor(100, 116, 139);
        const inputLines = doc.splitTextToSize(`"${data.rawInput}"`, pageWidth - 40);
        doc.text(inputLines, 20, y + 11);
        y += 24;
    }

    // Odontogram Table
    y += 3;
    doc.setTextColor(...blue);
    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.text("Gigi Terdampak", 15, y);
    y += 7;

    // Table header
    doc.setFillColor(241, 245, 249);
    doc.rect(15, y, pageWidth - 30, 7, "F");
    doc.setFontSize(8);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(...dark);
    doc.text("No. Gigi", 20, y + 5);
    doc.text("Kondisi", 55, y + 5);
    doc.text("Severity", 130, y + 5);
    y += 9;

    // Table rows
    doc.setFont("helvetica", "normal");
    doc.setTextColor(71, 85, 105);
    const uniqueTeeth = data.odontogramMapping.slice(0, 10);
    for (const tooth of uniqueTeeth) {
        if (y > 260) {
            doc.addPage();
            y = 20;
        }
        doc.setFontSize(8);
        doc.text(String(tooth.toothNumber), 20, y);
        doc.text(tooth.condition, 55, y);
        doc.setTextColor(severityColor[0], severityColor[1], severityColor[2]);
        doc.text(tooth.severity.toUpperCase(), 130, y);
        doc.setTextColor(71, 85, 105);
        y += 6;
    }

    y += 8;

    // Education section
    if (y > 220) {
        doc.addPage();
        y = 20;
    }

    doc.setTextColor(...blue);
    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.text("Informasi Edukasi", 15, y);
    y += 7;

    doc.setFontSize(8);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(71, 85, 105);

    const eduLines = data.education
        .replace(/## /g, "\n")
        .replace(/\*\*/g, "")
        .split("\n")
        .filter((l) => l.trim());

    for (const line of eduLines) {
        if (y > 275) {
            doc.addPage();
            y = 20;
        }
        const wrapped = doc.splitTextToSize(line.startsWith("- ") ? `  • ${line.slice(2)}` : line, pageWidth - 30);
        doc.text(wrapped, 15, y);
        y += wrapped.length * 4 + 2;
    }

    // Disclaimer
    y += 5;
    if (y > 250) {
        doc.addPage();
        y = 20;
    }

    doc.setFillColor(254, 243, 199);
    doc.roundedRect(15, y, pageWidth - 30, 25, 2, 2, "F");
    doc.setFontSize(7);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(180, 83, 9);
    doc.text("DISCLAIMER MEDIS", 20, y + 6);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(6.5);
    doc.setTextColor(120, 53, 15);
    const disclaimerText = "Hasil ini adalah skrining awal berbasis AI dan BUKAN diagnosis medis. Segera konsultasikan ke dokter gigi untuk pemeriksaan dan penanganan yang akurat. DentAI tidak bertanggung jawab atas keputusan medis berdasarkan hasil ini.";
    const discLines = doc.splitTextToSize(disclaimerText, pageWidth - 40);
    doc.text(discLines, 20, y + 12);

    // Footer
    const pageCount = doc.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        doc.setFontSize(7);
        doc.setTextColor(...gray);
        doc.text(`DentAI — AI Dental Pre-Screening Report | Halaman ${i}/${pageCount}`, pageWidth / 2, 290, { align: "center" });
    }

    // Save
    const fileName = `DentAI_Report_${data.diagnosis.conditionNameId.replace(/\s+/g, "_")}_${new Date().toISOString().slice(0, 10)}.pdf`;
    doc.save(fileName);
}
