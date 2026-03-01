"use client";

import React from "react";
import WorkspaceLayout from "../../components/workspace-layout";
import { Funnel_Display, Geist_Mono } from "next/font/google";
import { ArrowLeft, Film, Clock, BookOpen, Sparkles, Play, MoreHorizontal, MessageSquare, List } from "lucide-react";
import { Button } from "ui";
import Link from "next/link";
import { useParams } from "next/navigation";

const funnelDisplay = Funnel_Display({ subsets: ["latin"], weight: ["400", "500", "600", "700", "800"] });
const geistMono = Geist_Mono({ subsets: ["latin"] });

// Mock data to match the videos index page
const VIDEOS: Record<string, any> = {
    "1": {
        title: "Attention Is All You Need — Explained",
        channel: "Andrej Karpathy",
        duration: "24:12",
        chapters: 6,
        insights: 5,
        highlights: 8,
        date: "2 hours ago",
        status: "Analyzed",
        summary: "A deep dive into the Transformer architecture, explaining how self-attention mechanisms replace recurrence to allow for massive parallelization in sequence modeling.",
        videoChapters: [
            { time: "00:00", title: "Introduction to Sequence Modeling" },
            { time: "04:15", title: "The Problem with RNNs" },
            { time: "08:30", title: "Self-Attention Mechanism Explained" },
            { time: "14:20", title: "Multi-Head Attention" },
            { time: "19:45", title: "Positional Encoding" },
            { time: "22:10", title: "Results and Conclusion" }
        ]
    },
    "2": {
        title: "How Diffusion Models Work",
        channel: "3Blue1Brown",
        duration: "18:45",
        chapters: 4,
        insights: 3,
        highlights: 6,
        date: "Yesterday",
        status: "Analyzed",
        summary: "A visual explanation of the math behind diffusion models, showing how adding and removing noise from images allows neural networks to generate novel visuals.",
        videoChapters: [
            { time: "00:00", title: "What is Generative AI?" },
            { time: "03:20", title: "The Forward Diffusion Process" },
            { time: "09:15", title: "Training the U-Net" },
            { time: "14:30", title: "Reverse Diffusion (Generation)" }
        ]
    }
};

export default function VideoWorkspace() {
    const params = useParams();
    const id = params.id as string;
    const video = VIDEOS[id] || {
        title: "Untitled Video Analysis",
        channel: "Unknown",
        duration: "00:00",
        summary: "No summary available.",
        videoChapters: []
    };

    return (
        <WorkspaceLayout>
            <div className="max-w-6xl mx-auto py-8 px-6">
                <div className="mb-6 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Link href="/videos">
                            <Button variant="ghost" size="icon-sm" className="h-8 w-8 text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/30">
                                <ArrowLeft size={16} />
                            </Button>
                        </Link>
                        <div>
                            <h1 className={`${funnelDisplay.className} text-[22px] font-bold text-zinc-100 line-clamp-1`}>
                                {video.title}
                            </h1>
                            <div className="flex items-center gap-2 mt-1">
                                <span className={`${geistMono.className} text-[10px] text-zinc-400`}>{video.channel}</span>
                                <span className="text-zinc-700">•</span>
                                <span className={`${geistMono.className} text-[10px] text-zinc-500 flex items-center gap-1`}><Clock size={10} /> {video.duration}</span>
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        <Button variant="outline" className="h-8 px-3 bg-zinc-800/20 hover:bg-zinc-800/40 border-zinc-700/50 text-[12px] font-medium text-zinc-200 transition-colors rounded-md">
                            <MessageSquare size={13} className="mr-1.5" /> Chat with Video
                        </Button>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Left Column: Video & Summary */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Video Player Placeholder */}
                        <div className="aspect-video w-full rounded-xl border overflow-hidden relative flex items-center justify-center group" style={{ background: "var(--surface-2)", borderColor: "var(--surface-border)" }}>
                            <Film size={48} className="text-zinc-800" />
                            <div className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-black/40 transition-colors cursor-pointer">
                                <div className="size-16 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/20">
                                    <Play size={24} className="text-white ml-1" />
                                </div>
                            </div>
                        </div>

                        {/* AI Summary */}
                        <div className="p-6 rounded-xl border" style={{ background: "var(--surface-2)", borderColor: "var(--surface-border)" }}>
                            <h3 className="text-[15px] font-semibold text-zinc-200 mb-3 flex items-center gap-2">
                                <Sparkles size={16} className="text-purple-400" /> AI Executive Summary
                            </h3>
                            <p className="text-[14px] text-zinc-400 leading-relaxed">
                                {video.summary}
                            </p>
                        </div>
                    </div>

                    {/* Right Column: Chapters Sidebar */}
                    <div className="space-y-4">
                        <div className="p-5 rounded-xl border flex flex-col h-[calc(100vh-12rem)]" style={{ background: "var(--surface-2)", borderColor: "var(--surface-border)" }}>
                            <div className="flex items-center justify-between mb-4 pb-4 border-b border-zinc-800/50">
                                <h3 className="text-[14px] font-semibold text-zinc-200 flex items-center gap-2">
                                    <List size={16} className="text-zinc-400" /> Chapters & Transcript
                                </h3>
                                <span className={`${geistMono.className} text-[10px] text-zinc-500`}>{video.videoChapters.length} items</span>
                            </div>

                            <div className="flex-1 overflow-y-auto pr-2 space-y-1 nice-scrollbar">
                                {video.videoChapters.map((chapter: any, i: number) => (
                                    <button key={i} className="w-full text-left p-3 rounded-lg hover:bg-zinc-800/30 transition-colors group flex gap-3">
                                        <span className={`${geistMono.className} text-[11px] text-indigo-400 mt-0.5 shrink-0`}>{chapter.time}</span>
                                        <span className="text-[13px] text-zinc-300 group-hover:text-zinc-100 transition-colors leading-snug">{chapter.title}</span>
                                    </button>
                                ))}
                                {video.videoChapters.length === 0 && (
                                    <div className="text-center py-10 text-[13px] text-zinc-500">
                                        No chapters extracted yet.
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </WorkspaceLayout>
    );
}
