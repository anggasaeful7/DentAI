import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(req: NextRequest) {
    try {
        const sessionId = req.nextUrl.searchParams.get("sessionId");

        if (!sessionId) {
            return NextResponse.json(
                { error: "sessionId is required" },
                { status: 400 }
            );
        }

        const user = await prisma.user.findUnique({
            where: { sessionId },
        });

        if (!user) {
            return NextResponse.json({ consultations: [] });
        }

        const consultations = await prisma.consultation.findMany({
            where: {
                userId: user.id,
                status: "completed",
            },
            orderBy: { createdAt: "desc" },
            select: {
                id: true,
                suspectedCondition: true,
                severityLevel: true,
                confidenceScore: true,
                createdAt: true,
                rawInput: true,
            },
        });

        return NextResponse.json({ consultations });
    } catch (error) {
        console.error("History error:", error);
        return NextResponse.json(
            { error: "Failed to get history" },
            { status: 500 }
        );
    }
}
