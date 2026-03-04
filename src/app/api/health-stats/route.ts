import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(req: NextRequest) {
    const sessionId = req.nextUrl.searchParams.get("sessionId");
    const userId = req.nextUrl.searchParams.get("userId");

    let targetUserId: string | null = null;

    if (userId) {
        targetUserId = userId;
    } else if (sessionId) {
        const user = await prisma.user.findUnique({ where: { sessionId } });
        targetUserId = user?.id || null;
    }

    if (!targetUserId) {
        return NextResponse.json({
            totalConsultations: 0,
            conditionBreakdown: {},
            severityBreakdown: {},
            lastConsultation: null,
            consultations: [],
        });
    }

    try {
        const consultations = await prisma.consultation.findMany({
            where: { userId: targetUserId, status: "completed" },
            orderBy: { createdAt: "desc" },
            select: {
                id: true,
                suspectedCondition: true,
                severityLevel: true,
                confidenceScore: true,
                createdAt: true,
            },
        });

        const conditionBreakdown: Record<string, number> = {};
        const severityBreakdown: Record<string, number> = { low: 0, medium: 0, high: 0 };

        for (const c of consultations) {
            if (c.suspectedCondition) {
                conditionBreakdown[c.suspectedCondition] = (conditionBreakdown[c.suspectedCondition] || 0) + 1;
            }
            if (c.severityLevel) {
                severityBreakdown[c.severityLevel] = (severityBreakdown[c.severityLevel] || 0) + 1;
            }
        }

        return NextResponse.json({
            totalConsultations: consultations.length,
            conditionBreakdown,
            severityBreakdown,
            lastConsultation: consultations[0]?.createdAt || null,
            consultations,
        });
    } catch (error) {
        console.error("Health stats error:", error);
        return NextResponse.json({ error: "Failed to fetch stats" }, { status: 500 });
    }
}
