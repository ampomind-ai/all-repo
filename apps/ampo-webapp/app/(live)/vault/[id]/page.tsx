"use client";

import React, { useState } from "react";
import WorkspaceLayout from "../../components/workspace-layout";
import { Funnel_Display, Geist_Mono } from "next/font/google";
import { ArrowLeft, Search, Grid3X3, List, FileText, CheckCircle2, ChevronRight, PenTool, Folder, BrainCircuit } from "lucide-react";
import { Button, Input } from "ui";
import Link from "next/link";
import { useParams } from "next/navigation";

const funnelDisplay = Funnel_Display({ subsets: ["latin"], weight: ["400", "500", "600", "700", "800"] });
const geistMono = Geist_Mono({ subsets: ["latin"] });

// Mock data to match the vault index page
const ITEMS = [
    { id: "1", title: "RAG vs Fine-tuning Analysis", type: "Research", date: "2 hours ago", tags: ["NLP", "RAG", "LLM"], views: 12 },
    { id: "2", title: "Transformer architecture notes", type: "Notes", date: "Feb 18", tags: ["deep-learning", "attention"], views: 45 },
    { id: "3", title: "Neural Networks History", type: "Article", date: "Feb 15", tags: ["history", "ai"], views: 8 },
    { id: "4", title: "LLM Hallucination Mitigation Methods", type: "Research", date: "Feb 10", tags: ["safety", "LLM"], views: 24 },
];

export default function VaultFolderWorkspace() {
    const params = useParams();
    const id = params.id as string;
    // For mock purposes, just decode the ID or use a fallback
    const folderName = decodeURIComponent(id) || "Knowledge Folder";
    const [view, setView] = useState<"grid" | "list">("list");
    const [search, setSearch] = useState("");

    return (
        <WorkspaceLayout>
            <div className="max-w-5xl mx-auto py-8 px-6">
                <div className="mb-8 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Link href="/vault">
                            <Button variant="ghost" size="icon-sm" className="h-8 w-8 text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/30">
                                <ArrowLeft size={16} />
                            </Button>
                        </Link>
                        <div className="flex items-center gap-3">
                            <div className="size-10 rounded-xl bg-gradient-to-br from-indigo-500/20 to-purple-500/20 flex items-center justify-center border border-white/5 text-xl">
                                🧠
                            </div>
                            <div>
                                <h1 className={`${funnelDisplay.className} text-[22px] font-bold text-zinc-100 capitalize`}>
                                    {folderName.replace("-", " ")}
                                </h1>
                                <p className="text-[13px] text-zinc-500 mt-0.5">{ITEMS.length} saved items</p>
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        <Button variant="ghost" size="icon" onClick={() => setView("grid")} className={`h-8 w-8 rounded-lg transition-colors ${view === "grid" ? "bg-zinc-800/40 text-zinc-200" : "text-zinc-600 hover:text-zinc-400"}`}><Grid3X3 size={16} /></Button>
                        <Button variant="ghost" size="icon" onClick={() => setView("list")} className={`h-8 w-8 rounded-lg transition-colors ${view === "list" ? "bg-zinc-800/40 text-zinc-200" : "text-zinc-600 hover:text-zinc-400"}`}><List size={16} /></Button>
                    </div>
                </div>

                {/* AI Folder Insights */}
                <div className="mb-8 p-5 rounded-xl border bg-gradient-to-br from-indigo-500/5 to-purple-500/5 border-indigo-500/20 flex gap-4">
                    <div className="shrink-0 mt-0.5">
                        <BrainCircuit size={18} className="text-indigo-400" />
                    </div>
                    <div>
                        <h3 className="text-[14px] font-medium text-indigo-400 mb-1.5 flex items-center gap-1.5">
                            Folder Intelligence
                        </h3>
                        <p className="text-[14px] text-zinc-300 leading-relaxed">
                            Based on the {ITEMS.length} items in this folder, the dominant themes are <strong className="text-zinc-200">LLM Architecture</strong> and <strong className="text-zinc-200">Retrieval Strategies</strong>. You have 2 contradictory research pieces regarding the cost-efficiency of Fine-tuning vs RAG.
                        </p>
                        <div className="mt-3 flex gap-2">
                            <Button variant="outline" className="h-7 px-3 bg-indigo-500/10 hover:bg-indigo-500/20 border-indigo-500/30 text-[11px] font-medium text-indigo-300 transition-colors rounded-md">
                                Generate Synthesis Report
                            </Button>
                        </div>
                    </div>
                </div>

                {/* Search */}
                <div className="flex items-center gap-2 border rounded-xl px-4 py-3 mb-6" style={{ background: "var(--surface-2)", borderColor: "var(--surface-border)" }}>
                    <Search size={16} className="text-zinc-600" />
                    <Input
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder={`Search within ${folderName.replace("-", " ")}...`}
                        className="flex-1"
                    />
                </div>

                {/* Content Grid/List */}
                {view === "list" ? (
                    <div className="rounded-xl border overflow-hidden" style={{ background: "var(--surface-2)", borderColor: "var(--surface-border)" }}>
                        <div className="divide-y divide-zinc-800/50">
                            {ITEMS.map((item) => (
                                <div key={item.id} className="p-4 flex items-center justify-between hover:bg-zinc-800/30 transition-colors cursor-pointer group">
                                    <div className="flex items-center gap-4">
                                        <div className="size-10 rounded-lg flex items-center justify-center bg-zinc-900 border border-zinc-800 shrink-0">
                                            <FileText size={16} className="text-zinc-400" />
                                        </div>
                                        <div>
                                            <h3 className="text-[14px] font-medium text-zinc-200 mb-1">{item.title}</h3>
                                            <div className="flex items-center gap-3">
                                                <span className={`${geistMono.className} text-[10px] text-zinc-500 border border-zinc-800 px-1.5 py-0.5 rounded-md`}>{item.type}</span>
                                                <span className={`${geistMono.className} text-[10px] text-zinc-600`}>{item.date}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <div className="hidden md:flex gap-1.5">
                                            {item.tags.map(t => (
                                                <span key={t} className={`${geistMono.className} text-[9px] text-zinc-500 bg-zinc-900 border border-zinc-800 px-2 py-0.5 rounded-full capitalize`}>
                                                    {t}
                                                </span>
                                            ))}
                                        </div>
                                        <ChevronRight size={16} className="text-zinc-600 group-hover:text-zinc-300 transition-colors" />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {ITEMS.map((item) => (
                            <div key={item.id} className="p-5 rounded-xl border hover:border-zinc-700/50 transition-colors cursor-pointer group" style={{ background: "var(--surface-2)", borderColor: "var(--surface-border)" }}>
                                <div className="flex justify-between items-start mb-4">
                                    <div className="size-10 rounded-lg flex items-center justify-center bg-zinc-900 border border-zinc-800 shrink-0">
                                        <FileText size={16} className="text-zinc-400" />
                                    </div>
                                    <span className={`${geistMono.className} text-[10px] text-zinc-500 border border-zinc-800 px-1.5 py-0.5 rounded-md`}>{item.type}</span>
                                </div>
                                <h3 className="text-[14px] font-medium text-zinc-200 mb-3 line-clamp-2">{item.title}</h3>
                                <div className="flex items-center justify-between mt-auto pt-4 border-t border-zinc-800/50">
                                    <div className="flex gap-1.5 overflow-hidden">
                                        {item.tags.map(t => (
                                            <span key={t} className={`${geistMono.className} text-[9px] text-zinc-500 bg-zinc-900 border border-zinc-800 px-2 py-0.5 rounded-full capitalize truncate max-w-[60px]`}>
                                                {t}
                                            </span>
                                        ))}
                                    </div>
                                    <span className={`${geistMono.className} text-[10px] text-zinc-600 shrink-0`}>{item.date}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </WorkspaceLayout>
    );
}
