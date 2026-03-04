import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(req: NextRequest) {
    try {
        const sessionId = req.nextUrl.searchParams.get("sessionId");
        const userId = req.nextUrl.searchParams.get("userId");

        let targetUserId: string | null = null;

        if (userId) {
            // Authenticated user — use userId directly
            targetUserId = userId;
        } else if (sessionId) {
            // Anonymous user — lookup by sessionId
            const user = await prisma.user.findUnique({ where: { sessionId } });
            targetUserId = user?.id || null;
        }

        if (!targetUserId) {
            return NextResponse.json({ consultations: [] });
        }

        const consultations = await prisma.consultation.findMany({
            where: {
                userId: targetUserId,
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
