"use client";

import React, { useState, useRef, useEffect } from "react";
import type { ChatMessage } from "@/lib/ai/types";
import { useSpeechToText } from "@/hooks/useSpeechToText";

interface ChatInterfaceProps {
    messages: ChatMessage[];
    isLoading: boolean;
    onSendMessage: (message: string) => void;
    onImageUpload?: (file: File) => void;
    disabled?: boolean;
}

export default function ChatInterface({
    messages,
    isLoading,
    onSendMessage,
    onImageUpload,
    disabled = false,
}: ChatInterfaceProps) {
    const [input, setInput] = useState("");
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLTextAreaElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const { isListening, isSupported, transcript, startListening, stopListening, resetTranscript } =
        useSpeechToText();

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages, isLoading]);

    // Sync voice transcript to input
    useEffect(() => {
        if (transcript) {
            setInput(transcript);
        }
    }, [transcript]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim() || isLoading || disabled) return;
        onSendMessage(input.trim());
        setInput("");
        resetTranscript();
        if (inputRef.current) inputRef.current.style.height = "auto";
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSubmit(e);
        }
    };

    const handleInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setInput(e.target.value);
        e.target.style.height = "auto";
        e.target.style.height = Math.min(e.target.scrollHeight, 120) + "px";
    };

    const handleVoiceToggle = () => {
        if (isListening) {
            stopListening();
        } else {
            startListening();
        }
    };

    const handleImageClick = () => {
        fileInputRef.current?.click();
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file && onImageUpload) {
            onImageUpload(file);
            e.target.value = "";
        }
    };

    return (
        <div className="flex flex-col h-full">
            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin">
                {messages.map((msg) => (
                    <div
                        key={msg.id}
                        className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"} animate-fadeIn`}
                    >
                        <div
                            className={`max-w-[85%] md:max-w-[75%] rounded-2xl px-4 py-3 ${msg.role === "user"
                                    ? "bg-blue-600 text-white rounded-br-md"
                                    : "bg-slate-800/80 text-slate-200 rounded-bl-md border border-slate-700/50"
                                }`}
                        >
                            {msg.role === "assistant" && (
                                <div className="flex items-center gap-2 mb-1.5">
                                    <span className="text-lg">🦷</span>
                                    <span className="text-xs font-semibold text-blue-400">DentAI</span>
                                </div>
                            )}
                            <div className="text-sm leading-relaxed whitespace-pre-wrap">{msg.content}</div>
                            <div className={`text-[10px] mt-1.5 ${msg.role === "user" ? "text-blue-200" : "text-slate-500"}`}>
                                {new Date(msg.timestamp).toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" })}
                            </div>
                        </div>
                    </div>
                ))}

                {/* Typing indicator */}
                {isLoading && (
                    <div className="flex justify-start animate-fadeIn">
                        <div className="bg-slate-800/80 rounded-2xl rounded-bl-md px-4 py-3 border border-slate-700/50">
                            <div className="flex items-center gap-2 mb-1">
                                <span className="text-lg">🦷</span>
                                <span className="text-xs font-semibold text-blue-400">DentAI</span>
                            </div>
                            <div className="flex items-center gap-1.5">
                                <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                                <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                                <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                                <span className="text-xs text-slate-500 ml-2">Sedang menganalisis...</span>
                            </div>
                        </div>
                    </div>
                )}
                <div ref={messagesEndRef} />
            </div>

            {/* Voice Recording Indicator */}
            {isListening && (
                <div className="mx-4 mb-2 flex items-center gap-3 px-4 py-2.5 bg-red-500/10 border border-red-500/30 rounded-xl animate-fadeIn">
                    <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse" />
                    <span className="text-sm text-red-400 font-medium">Merekam suara...</span>
                    <span className="text-xs text-slate-500 ml-auto">Klik 🎤 untuk berhenti</span>
                </div>
            )}

            {/* Input Area */}
            <form onSubmit={handleSubmit} className="p-4 border-t border-slate-700/50">
                <div className="flex items-end gap-2 bg-slate-800/50 rounded-xl border border-slate-700/50 p-2 focus-within:border-blue-500/50 transition-colors">
                    {/* Image Upload Button */}
                    {onImageUpload && (
                        <>
                            <button
                                type="button"
                                onClick={handleImageClick}
                                disabled={isLoading || disabled}
                                className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-700/50 disabled:opacity-40 transition-all shrink-0"
                                title="Upload foto gigi"
                            >
                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                            </button>
                            <input
                                ref={fileInputRef}
                                type="file"
                                accept="image/*"
                                capture="environment"
                                className="hidden"
                                onChange={handleFileChange}
                            />
                        </>
                    )}

                    {/* Text Input */}
                    <textarea
                        ref={inputRef}
                        value={input}
                        onChange={handleInput}
                        onKeyDown={handleKeyDown}
                        placeholder={isListening ? "Sedang mendengarkan..." : "Ceritakan keluhan gigi Anda..."}
                        rows={1}
                        disabled={isLoading || disabled}
                        className="flex-1 bg-transparent text-sm text-slate-200 placeholder-slate-500 resize-none focus:outline-none px-2 py-1.5 max-h-[120px]"
                    />

                    {/* Voice Button */}
                    {isSupported && (
                        <button
                            type="button"
                            onClick={handleVoiceToggle}
                            disabled={isLoading || disabled}
                            className={`p-2 rounded-lg transition-all duration-200 shrink-0 ${isListening
                                    ? "bg-red-500 text-white animate-pulse-glow"
                                    : "text-slate-400 hover:text-white hover:bg-slate-700/50"
                                } disabled:opacity-40 disabled:cursor-not-allowed`}
                            title={isListening ? "Berhenti merekam" : "Bicara untuk mengetik"}
                        >
                            {isListening ? (
                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 10a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1v-4z" />
                                </svg>
                            ) : (
                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                                </svg>
                            )}
                        </button>
                    )}

                    {/* Send Button */}
                    <button
                        type="submit"
                        disabled={!input.trim() || isLoading || disabled}
                        className="p-2 rounded-lg bg-blue-600 text-white hover:bg-blue-500 disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-200 shrink-0"
                    >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
                        </svg>
                    </button>
                </div>
            </form>
        </div>
    );
}
