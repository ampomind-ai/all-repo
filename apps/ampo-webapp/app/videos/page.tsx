"use client";

import React from "react";
import WorkspaceLayout from "../components/workspace-layout";
import { Funnel_Display, Geist_Mono } from "next/font/google";
import { Film, Clock, BookOpen, FileText, Share2, Sparkles, Play, MoreHorizontal } from "lucide-react";
import { Button } from "ui";

const funnelDisplay = Funnel_Display({ subsets: ["latin"], weight: ["400", "500", "600", "700", "800"] });
const geistMono = Geist_Mono({ subsets: ["latin"] });

const VIDEOS = [
    { id: "1", title: "Attention Is All You Need — Explained", channel: "Andrej Karpathy", duration: "24:12", chapters: 6, insights: 5, highlights: 8, date: "2 hours ago", status: "Analyzed" },
    { id: "2", title: "How Diffusion Models Work", channel: "3Blue1Brown", duration: "18:45", chapters: 4, insights: 3, highlights: 6, date: "Yesterday", status: "Analyzed" },
    { id: "3", title: "Building RAG from Scratch in Python", channel: "Fireship", duration: "12:30", chapters: 5, insights: 4, highlights: 3, date: "Feb 18", status: "Analyzed" },
    { id: "4", title: "The Future of AI Agents — 2026", channel: "Lex Fridman", duration: "2:14:33", chapters: 12, insights: 9, highlights: 15, date: "Feb 17", status: "Analyzed" },
];

export default function VideosPage() {
    return (
        <WorkspaceLayout>
            <div className="max-w-5xl mx-auto py-10 px-8">
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className={`${funnelDisplay.className} text-[28px] font-bold text-zinc-100`}>Video Analyses</h1>
                        <p className="text-[14px] text-zinc-500 mt-1">Videos you've analyzed with AI intelligence</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {VIDEOS.map(video => (
                        <div key={video.id} className="group rounded-xl border overflow-hidden transition-all cursor-pointer hover:border-zinc-700/40" style={{ background: "var(--surface-2)", borderColor: "var(--surface-border)" }}>
                            {/* Thumbnail placeholder */}
                            <div className="aspect-video flex items-center justify-center relative" style={{ background: "var(--surface-3)" }}>
                                <Film size={32} className="text-zinc-700" />
                                <div className="absolute bottom-2 right-2 px-2 py-0.5 rounded-md text-[10px] font-bold text-zinc-300" style={{ background: "rgba(0,0,0,0.7)" }}>{video.duration}</div>
                                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                    <div className="size-12 rounded-full bg-zinc-100/10 backdrop-blur-sm flex items-center justify-center"><Play size={20} className="text-zinc-200 ml-0.5" /></div>
                                </div>
                            </div>

                            <div className="p-4">
                                <div className="flex items-start justify-between mb-2">
                                    <div>
                                        <h3 className="text-[14px] font-semibold text-zinc-200 mb-0.5 line-clamp-1">{video.title}</h3>
                                        <p className="text-[11px] text-zinc-600">{video.channel}</p>
                                    </div>
                                    <span className={`${geistMono.className} text-[9px] text-emerald-400 uppercase px-2 py-0.5 rounded-md bg-emerald-500/10 border border-emerald-500/20 shrink-0`}>{video.status}</span>
                                </div>

                                <div className="flex items-center gap-4 mb-3">
                                    <span className={`${geistMono.className} text-[10px] text-zinc-600 flex items-center gap-1`}><BookOpen size={10} /> {video.chapters} chapters</span>
                                    <span className={`${geistMono.className} text-[10px] text-zinc-600 flex items-center gap-1`}><Sparkles size={10} /> {video.insights} insights</span>
                                    <span className={`${geistMono.className} text-[10px] text-zinc-600`}>{video.highlights} highlights</span>
                                </div>

                                <div className="flex items-center justify-between pt-3 border-t border-zinc-800/50">
                                    <div className="flex items-center gap-2">
                                        <Button variant="ghost" size="sm" className="h-7 px-3 text-[11px] font-medium text-zinc-500 hover:text-zinc-200 hover:bg-zinc-800/20 transition-colors"><FileText size={12} className="mr-1.5" /> Blog Post</Button>
                                        <Button variant="ghost" size="sm" className="h-7 px-3 text-[11px] font-medium text-zinc-500 hover:text-zinc-200 hover:bg-zinc-800/20 transition-colors"><Share2 size={12} className="mr-1.5" /> Thread</Button>
                                    </div>
                                    <Button variant="ghost" size="icon" className="h-7 w-7 text-zinc-600 hover:text-zinc-300 hover:bg-zinc-800/20 transition-colors rounded-md"><MoreHorizontal size={14} /></Button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </WorkspaceLayout>
    );
}
