"use client";

import React from "react";
import WorkspaceLayout from "../../components/workspace-layout";
import { Funnel_Display, Geist_Mono } from "next/font/google";
import { ArrowLeft, BookOpen, Film, FileText, Settings, Plus, Sparkles, Folder, Clock, Activity, Target } from "lucide-react";
import { Button } from "ui";
import Link from "next/link";
import { useParams } from "next/navigation";

const funnelDisplay = Funnel_Display({ subsets: ["latin"], weight: ["400", "500", "600", "700", "800"] });
const geistMono = Geist_Mono({ subsets: ["latin"] });

// Mock data to match the projects index page
const PROJECTS: Record<string, any> = {
    "1": { title: "AI Research Thesis", description: "RAG vs Fine-tuning deep dive for domain-specific QA systems", icon: BookOpen, sessions: 14, highlights: 23, lastAccessed: "2 hours ago", color: "from-cyan-500/20 to-blue-500/20" },
    "2": { title: "YouTube Course Notes", description: "Consolidated notes from Andrej Karpathy's neural nets series", icon: Film, sessions: 8, highlights: 15, lastAccessed: "Yesterday", color: "from-purple-500/20 to-pink-500/20" },
    "3": { title: "Product Launch Content", description: "X threads, LinkedIn posts, and blog drafts for AmpoMind launch", icon: FileText, sessions: 6, highlights: 9, lastAccessed: "Feb 18", color: "from-emerald-500/20 to-teal-500/20" },
};

const RECENT_FILES = [
    { title: "RAG vs Fine-tuning Comparison", type: "Comparison", icon: Target, date: "2 hours ago" },
    { title: "Attention Is All You Need", type: "Video Summary", icon: Film, date: "Yesterday" },
    { title: "Draft: Why builders should write", type: "X Thread", icon: FileText, date: "Feb 18" },
];

export default function ProjectWorkspace() {
    const params = useParams();
    const id = params.id as string;
    const project = PROJECTS[id] || { title: "Untitled Project", description: "No description", icon: Folder, color: "from-zinc-500/20 to-zinc-500/20", sessions: 0, highlights: 0 };
    const Icon = project.icon;

    return (
        <WorkspaceLayout>
            <div className="max-w-5xl mx-auto py-8 px-6">
                <div className="mb-8 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Link href="/projects">
                            <Button variant="ghost" size="icon-sm" className="h-8 w-8 text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/30">
                                <ArrowLeft size={16} />
                            </Button>
                        </Link>
                        <div className="flex items-center gap-3">
                            <div className={`size-10 rounded-xl bg-gradient-to-br ${project.color} flex items-center justify-center border border-white/5`}>
                                <Icon size={18} className="text-zinc-200" />
                            </div>
                            <div>
                                <h1 className={`${funnelDisplay.className} text-[22px] font-bold text-zinc-100`}>
                                    {project.title}
                                </h1>
                                <p className="text-[13px] text-zinc-500 mt-0.5">{project.description}</p>
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        <Button variant="outline" className="h-8 px-3 bg-zinc-800/20 hover:bg-zinc-800/40 border-zinc-700/50 text-[12px] font-medium text-zinc-200 transition-colors rounded-md">
                            <Settings size={13} className="mr-1.5" /> Project Settings
                        </Button>
                        <Button className="h-8 px-3 text-[12px] font-medium transition-colors rounded-md bg-zinc-100 text-zinc-900 hover:bg-white">
                            <Sparkles size={13} className="mr-1.5" /> Analyze Project Hub
                        </Button>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    {/* Left/Main Column - Files & Activity */}
                    <div className="md:col-span-3 space-y-6">
                        {/* Quick Actions */}
                        <div className="flex gap-3">
                            <Button variant="outline" className="flex-1 h-16 rounded-xl border-dashed border-zinc-700/50 hover:border-zinc-500 hover:bg-zinc-800/20 bg-transparent flex flex-col items-center justify-center gap-1 text-zinc-400 hover:text-zinc-200 transition-all">
                                <Plus size={16} />
                                <span className={`${geistMono.className} text-[10px]`}>New Session</span>
                            </Button>
                            <Button variant="outline" className="flex-1 h-16 rounded-xl border-dashed border-zinc-700/50 hover:border-zinc-500 hover:bg-zinc-800/20 bg-transparent flex flex-col items-center justify-center gap-1 text-zinc-400 hover:text-zinc-200 transition-all">
                                <Plus size={16} />
                                <span className={`${geistMono.className} text-[10px]`}>Add Document</span>
                            </Button>
                        </div>

                        {/* Recent Files */}
                        <div className="rounded-xl border p-5" style={{ background: "var(--surface-2)", borderColor: "var(--surface-border)" }}>
                            <h2 className="text-[14px] font-semibold text-zinc-200 flex items-center gap-2 mb-4">
                                <Folder size={15} className="text-zinc-400" /> Project Files
                            </h2>
                            <div className="space-y-2">
                                {RECENT_FILES.map((file, i) => (
                                    <div key={i} className="flex items-center justify-between p-3 rounded-lg hover:bg-zinc-800/40 transition-colors border border-transparent hover:border-zinc-800 cursor-pointer">
                                        <div className="flex items-center gap-3">
                                            <div className="size-8 rounded-lg bg-zinc-900 border border-zinc-800 flex items-center justify-center">
                                                <file.icon size={14} className="text-zinc-400" />
                                            </div>
                                            <div>
                                                <h4 className="text-[13px] font-medium text-zinc-200">{file.title}</h4>
                                                <p className={`${geistMono.className} text-[10px] text-zinc-500`}>{file.type}</p>
                                            </div>
                                        </div>
                                        <span className={`${geistMono.className} text-[10px] text-zinc-600`}>{file.date}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Right Column - Stats & Info */}
                    <div className="space-y-4">
                        <div className="p-5 rounded-xl border flex flex-col items-center text-center" style={{ background: "var(--surface-2)", borderColor: "var(--surface-border)" }}>
                            <div className="size-12 rounded-full bg-blue-500/10 border border-blue-500/20 flex items-center justify-center mb-3">
                                <Activity size={20} className="text-blue-400" />
                            </div>
                            <h3 className={`${geistMono.className} text-[24px] font-bold text-zinc-100`}>{project.sessions}</h3>
                            <p className="text-[11px] text-zinc-500 uppercase tracking-wider mt-1 font-medium">Chat Sessions</p>
                        </div>

                        <div className="p-5 rounded-xl border flex flex-col items-center text-center" style={{ background: "var(--surface-2)", borderColor: "var(--surface-border)" }}>
                            <div className="size-12 rounded-full bg-amber-500/10 border border-amber-500/20 flex items-center justify-center mb-3">
                                <Sparkles size={20} className="text-amber-400" />
                            </div>
                            <h3 className={`${geistMono.className} text-[24px] font-bold text-zinc-100`}>{project.highlights}</h3>
                            <p className="text-[11px] text-zinc-500 uppercase tracking-wider mt-1 font-medium">Saved Highlights</p>
                        </div>

                        <div className="p-4 rounded-xl border flex items-center justify-center gap-2" style={{ background: "var(--surface-2)", borderColor: "var(--surface-border)" }}>
                            <Clock size={12} className="text-zinc-500" />
                            <span className={`${geistMono.className} text-[10px] text-zinc-400`}>Active {project.lastAccessed}</span>
                        </div>
                    </div>
                </div>
            </div>
        </WorkspaceLayout>
    );
}
