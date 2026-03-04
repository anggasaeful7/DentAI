"use client";

import React, { useState, useRef } from "react";

interface ImageUploadProps {
    onUpload: (file: File, preview: string) => void;
    disabled?: boolean;
}

export default function ImageUploadPreview({ onUpload, disabled }: ImageUploadProps) {
    const [preview, setPreview] = useState<string | null>(null);
    const [isDragging, setIsDragging] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFile = (file: File) => {
        if (!file.type.startsWith("image/")) return;
        const reader = new FileReader();
        reader.onload = (e) => {
            const dataUrl = e.target?.result as string;
            setPreview(dataUrl);
            onUpload(file, dataUrl);
        };
        reader.readAsDataURL(file);
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
        const file = e.dataTransfer.files[0];
        if (file) handleFile(file);
    };

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(true);
    };

    return (
        <div className="space-y-3">
            {!preview ? (
                <div
                    onDrop={handleDrop}
                    onDragOver={handleDragOver}
                    onDragLeave={() => setIsDragging(false)}
                    onClick={() => fileInputRef.current?.click()}
                    className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all duration-200 ${isDragging
                            ? "border-blue-500 bg-blue-500/10"
                            : "border-slate-600 hover:border-blue-500/50 hover:bg-slate-800/30"
                        } ${disabled ? "opacity-50 pointer-events-none" : ""}`}
                >
                    <div className="text-3xl mb-2">📸</div>
                    <p className="text-sm font-medium text-slate-300">
                        Upload foto gigi Anda
                    </p>
                    <p className="text-xs text-slate-500 mt-1">
                        Drag & drop atau klik untuk memilih
                    </p>
                    <p className="text-[10px] text-slate-600 mt-2">
                        JPG, PNG, WebP (Maks. 5MB)
                    </p>
                    <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        capture="environment"
                        className="hidden"
                        onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) handleFile(file);
                        }}
                    />
                </div>
            ) : (
                <div className="relative rounded-xl overflow-hidden border border-slate-700">
                    <img
                        src={preview}
                        alt="Foto gigi"
                        className="w-full max-h-48 object-cover"
                    />
                    <button
                        onClick={() => {
                            setPreview(null);
                        }}
                        className="absolute top-2 right-2 p-1.5 bg-black/60 rounded-lg text-white hover:bg-black/80 transition-colors"
                    >
                        <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>
            )}
        </div>
    );
}
