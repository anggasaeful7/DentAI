import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { consultationId, rating, comment } = body;

        if (!consultationId || !rating || rating < 1 || rating > 5) {
            return NextResponse.json(
                { error: "Valid consultationId and rating (1-5) required" },
                { status: 400 }
            );
        }

        const consultation = await prisma.consultation.findUnique({
            where: { id: consultationId },
        });

        if (!consultation) {
            return NextResponse.json(
                { error: "Consultation not found" },
                { status: 404 }
            );
        }

        const feedback = await prisma.feedback.create({
            data: {
                consultationId,
                rating,
                comment: comment || null,
            },
        });

        return NextResponse.json({ success: true, feedback });
    } catch (error) {
        console.error("Feedback error:", error);
        return NextResponse.json(
            { error: "Failed to save feedback" },
            { status: 500 }
        );
    }
}
