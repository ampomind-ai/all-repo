"use client";

import React from "react";
import WorkspaceLayout from "../components/workspace-layout";
import { Funnel_Display, Geist_Mono } from "next/font/google";
import { Scale, Clock, ArrowLeftRight, FileText, AlertTriangle, Lightbulb, Plus } from "lucide-react";
import { Button } from "ui";

const funnelDisplay = Funnel_Display({ subsets: ["latin"], weight: ["400", "500", "600", "700", "800"] });
const geistMono = Geist_Mono({ subsets: ["latin"] });

const COMPARISONS = [
    { id: "1", title: "RAG vs Fine-tuning for Domain QA", sources: 3, contradictions: 2, patterns: 4, date: "Yesterday", synthesis: "RAG is the default for broad domains; fine-tuning remains valuable for narrow, high-stakes verticals." },
    { id: "2", title: "React Server Components vs Client Components", sources: 4, contradictions: 1, patterns: 6, date: "Feb 18", synthesis: "Server components are ideal for data-fetching and static content; client components for interactivity." },
    { id: "3", title: "Supervised vs Reinforcement Learning for Robotics", sources: 5, contradictions: 3, patterns: 5, date: "Feb 16", synthesis: "Hybrid approaches combining imitation learning with RL fine-tuning show the most promise." },
];

export default function ComparisonsPage() {
    return (
        <WorkspaceLayout>
            <div className="max-w-4xl mx-auto py-10 px-8">
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className={`${funnelDisplay.className} text-[28px] font-bold text-zinc-100`}>Research Comparisons</h1>
                        <p className="text-[14px] text-zinc-500 mt-1">Cross-source analyses and synthesis</p>
                    </div>
                    <Button variant="outline" className="h-8 px-4 bg-zinc-800/20 hover:bg-zinc-800/40 border-zinc-700/50 text-[12px] font-medium text-zinc-200 transition-colors rounded-lg">
                        <Plus size={13} className="mr-1" /> New Comparison
                    </Button>
                </div>

                <div className="space-y-4">
                    {COMPARISONS.map(comp => (
                        <div key={comp.id} className="rounded-xl border p-5 transition-all cursor-pointer hover:border-zinc-700/40" style={{ background: "var(--surface-2)", borderColor: "var(--surface-border)" }}>
                            <div className="flex items-start justify-between mb-3">
                                <div className="flex items-center gap-3">
                                    <div className="size-10 rounded-lg flex items-center justify-center" style={{ background: "var(--surface-3)" }}>
                                        <Scale size={18} className="text-zinc-400" />
                                    </div>
                                    <div>
                                        <h3 className="text-[15px] font-semibold text-zinc-200">{comp.title}</h3>
                                        <span className={`${geistMono.className} text-[10px] text-zinc-600 flex items-center gap-1`}><Clock size={10} /> {comp.date}</span>
                                    </div>
                                </div>
                            </div>

                            <p className="text-[13px] text-zinc-400 leading-relaxed mb-4 pl-[52px]">{comp.synthesis}</p>

                            <div className="flex items-center gap-4 pl-[52px]">
                                <span className={`${geistMono.className} text-[10px] text-zinc-500 flex items-center gap-1.5 px-2.5 py-1 rounded-md`} style={{ background: "var(--surface-3)" }}>
                                    <FileText size={10} /> {comp.sources} sources
                                </span>
                                <span className={`${geistMono.className} text-[10px] text-amber-500/70 flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-amber-500/5`}>
                                    <AlertTriangle size={10} /> {comp.contradictions} contradictions
                                </span>
                                <span className={`${geistMono.className} text-[10px] text-cyan-500/70 flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-cyan-500/5`}>
                                    <Lightbulb size={10} /> {comp.patterns} patterns
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </WorkspaceLayout>
    );
}
