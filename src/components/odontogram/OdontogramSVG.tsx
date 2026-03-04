"use client";

import React, { useState } from "react";
import { TEETH_DATA, getToothSize } from "./tooth-data";
import type { OdontogramMapping } from "@/lib/ai/types";

interface OdontogramSVGProps {
    mappings: OdontogramMapping[];
}

const severityColors: Record<string, { fill: string; stroke: string; glow: string }> = {
    high: { fill: "#EF444440", stroke: "#EF4444", glow: "#EF4444" },
    medium: { fill: "#F59E0B40", stroke: "#F59E0B", glow: "#F59E0B" },
    low: { fill: "#10B98140", stroke: "#10B981", glow: "#10B981" },
};

export default function OdontogramSVG({ mappings }: OdontogramSVGProps) {
    const [hoveredTooth, setHoveredTooth] = useState<number | null>(null);
    const [tooltip, setTooltip] = useState<{ x: number; y: number; mapping: OdontogramMapping } | null>(null);

    const affectedTeeth = new Map(mappings.map((m) => [m.toothNumber, m]));

    return (
        <div className="relative w-full">
            <svg viewBox="0 0 550 260" className="w-full h-auto" style={{ maxWidth: 550 }}>
                {/* Background */}
                <defs>
                    <filter id="glow-red">
                        <feGaussianBlur stdDeviation="3" result="coloredBlur" />
                        <feMerge><feMergeNode in="coloredBlur" /><feMergeNode in="SourceGraphic" /></feMerge>
                    </filter>
                    <filter id="glow-yellow">
                        <feGaussianBlur stdDeviation="2" result="coloredBlur" />
                        <feMerge><feMergeNode in="coloredBlur" /><feMergeNode in="SourceGraphic" /></feMerge>
                    </filter>
                    <filter id="glow-green">
                        <feGaussianBlur stdDeviation="2" result="coloredBlur" />
                        <feMerge><feMergeNode in="coloredBlur" /><feMergeNode in="SourceGraphic" /></feMerge>
                    </filter>
                </defs>

                {/* Jaw labels */}
                <text x="275" y="8" textAnchor="middle" fill="#94A3B8" fontSize="10" fontWeight="600">
                    RAHANG ATAS
                </text>
                <text x="275" y="250" textAnchor="middle" fill="#94A3B8" fontSize="10" fontWeight="600">
                    RAHANG BAWAH
                </text>

                {/* Center line */}
                <line x1="275" y1="12" x2="275" y2="65" stroke="#334155" strokeWidth="1" strokeDasharray="4 2" />
                <line x1="275" y1="155" x2="275" y2="235" stroke="#334155" strokeWidth="1" strokeDasharray="4 2" />

                {/* Right/Left labels */}
                <text x="10" y="120" fill="#64748B" fontSize="9" fontWeight="500">KANAN</text>
                <text x="510" y="120" fill="#64748B" fontSize="9" fontWeight="500">KIRI</text>

                {/* Teeth */}
                {TEETH_DATA.map((tooth) => {
                    const mapping = affectedTeeth.get(tooth.number);
                    const size = getToothSize(tooth.type);
                    const isHovered = hoveredTooth === tooth.number;
                    const isAffected = !!mapping;

                    const colors = mapping
                        ? severityColors[mapping.severity] || severityColors.low
                        : { fill: "#1E293B", stroke: "#475569", glow: "none" };

                    const glowFilter = mapping?.severity === "high" ? "url(#glow-red)"
                        : mapping?.severity === "medium" ? "url(#glow-yellow)"
                            : mapping?.severity === "low" ? "url(#glow-green)" : undefined;

                    return (
                        <g
                            key={tooth.number}
                            onMouseEnter={(e) => {
                                setHoveredTooth(tooth.number);
                                if (mapping) {
                                    const svg = e.currentTarget.ownerSVGElement;
                                    const pt = svg?.createSVGPoint();
                                    if (pt) {
                                        pt.x = tooth.x + size.width / 2;
                                        pt.y = tooth.quadrant <= 2 ? tooth.y - 15 : tooth.y + size.height + 15;
                                        setTooltip({ x: pt.x, y: pt.y, mapping });
                                    }
                                }
                            }}
                            onMouseLeave={() => {
                                setHoveredTooth(null);
                                setTooltip(null);
                            }}
                            className="cursor-pointer transition-all duration-200"
                        >
                            {/* Tooth shape */}
                            <rect
                                x={tooth.x}
                                y={tooth.y}
                                width={size.width}
                                height={size.height}
                                rx={tooth.type === "molar" ? 6 : tooth.type === "premolar" ? 5 : 4}
                                ry={tooth.type === "molar" ? 6 : tooth.type === "premolar" ? 5 : 4}
                                fill={isHovered ? (isAffected ? colors.fill.replace("40", "80") : "#334155") : colors.fill}
                                stroke={isHovered ? "#E2E8F0" : colors.stroke}
                                strokeWidth={isAffected ? 2.5 : 1}
                                filter={isAffected ? glowFilter : undefined}
                                style={isAffected && mapping?.severity === "high" ? {
                                    animation: "pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite",
                                } : undefined}
                            />

                            {/* Tooth number */}
                            <text
                                x={tooth.x + size.width / 2}
                                y={tooth.y + size.height / 2 + 4}
                                textAnchor="middle"
                                fill={isAffected ? "#FFFFFF" : "#94A3B8"}
                                fontSize="9"
                                fontWeight={isAffected ? "700" : "400"}
                            >
                                {tooth.number}
                            </text>
                        </g>
                    );
                })}

                {/* Tooltip */}
                {tooltip && (
                    <g>
                        <rect
                            x={Math.max(10, Math.min(tooltip.x - 80, 390))}
                            y={tooltip.y - 35}
                            width={160}
                            height={30}
                            rx={6}
                            fill="#0F172AEE"
                            stroke={severityColors[tooltip.mapping.severity]?.stroke || "#475569"}
                            strokeWidth={1.5}
                        />
                        <text
                            x={Math.max(10, Math.min(tooltip.x - 80, 390)) + 80}
                            y={tooltip.y - 22}
                            textAnchor="middle"
                            fill="#F8FAFC"
                            fontSize="8"
                            fontWeight="600"
                        >
                            Gigi {tooltip.mapping.toothNumber} — {tooltip.mapping.condition}
                        </text>
                        <text
                            x={Math.max(10, Math.min(tooltip.x - 80, 390)) + 80}
                            y={tooltip.y - 11}
                            textAnchor="middle"
                            fill={severityColors[tooltip.mapping.severity]?.stroke || "#94A3B8"}
                            fontSize="7"
                        >
                            Severity: {tooltip.mapping.severity.toUpperCase()}
                        </text>
                    </g>
                )}
            </svg>

            {/* Legend */}
            <div className="flex justify-center gap-6 mt-3">
                <div className="flex items-center gap-1.5">
                    <div className="w-3 h-3 rounded-sm bg-green-500/40 border border-green-500" />
                    <span className="text-xs text-slate-400">Ringan</span>
                </div>
                <div className="flex items-center gap-1.5">
                    <div className="w-3 h-3 rounded-sm bg-amber-500/40 border border-amber-500" />
                    <span className="text-xs text-slate-400">Sedang</span>
                </div>
                <div className="flex items-center gap-1.5">
                    <div className="w-3 h-3 rounded-sm bg-red-500/40 border border-red-500" />
                    <span className="text-xs text-slate-400">Tinggi</span>
                </div>
            </div>

            <style jsx>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.6; }
        }
      `}</style>
        </div>
    );
}
