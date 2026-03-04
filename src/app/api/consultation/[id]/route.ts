import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;

        const consultation = await prisma.consultation.findUnique({
            where: { id },
            include: {
                odontogramRecords: true,
                feedback: true,
                messages: { orderBy: { createdAt: "asc" } },
            },
        });

        if (!consultation) {
            return NextResponse.json(
                { error: "Consultation not found" },
                { status: 404 }
            );
        }

        return NextResponse.json(consultation);
    } catch (error) {
        console.error("Get consultation error:", error);
        return NextResponse.json(
            { error: "Failed to get consultation" },
            { status: 500 }
        );
    }
}
