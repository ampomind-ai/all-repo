"use client";

import React from "react";
import WorkspaceLayout from "../components/workspace-layout";
import { Funnel_Display, Geist_Mono } from "next/font/google";
import { Pin, ExternalLink, Clock, FileText, Film, BookOpen, MoreHorizontal } from "lucide-react";
import { Button } from "ui";

const funnelDisplay = Funnel_Display({ subsets: ["latin"], weight: ["400", "500", "600", "700", "800"] });
const geistMono = Geist_Mono({ subsets: ["latin"] });

const PROJECTS = [
    { id: "1", title: "AI Research Thesis", description: "RAG vs Fine-tuning deep dive for domain-specific QA systems", icon: BookOpen, sessions: 14, highlights: 23, lastAccessed: "2 hours ago", color: "from-cyan-500/20 to-blue-500/20" },
    { id: "2", title: "YouTube Course Notes", description: "Consolidated notes from Andrej Karpathy's neural nets series", icon: Film, sessions: 8, highlights: 15, lastAccessed: "Yesterday", color: "from-purple-500/20 to-pink-500/20" },
    { id: "3", title: "Product Launch Content", description: "X threads, LinkedIn posts, and blog drafts for AmpoMind launch", icon: FileText, sessions: 6, highlights: 9, lastAccessed: "Feb 18", color: "from-emerald-500/20 to-teal-500/20" },
];

export default function ProjectsPage() {
    return (
        <WorkspaceLayout>
            <div className="max-w-4xl mx-auto py-10 px-8">
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className={`${funnelDisplay.className} text-[28px] font-bold text-zinc-100`}>Pinned Projects</h1>
                        <p className="text-[14px] text-zinc-500 mt-1">Organized workspaces for focused research</p>
                    </div>
                    <Button variant="outline" className="h-8 px-4 border-zinc-700/50 bg-zinc-800/20 hover:bg-zinc-800/50 text-[12px] font-medium text-zinc-200 transition-colors rounded-lg">
                        <Pin size={13} className="mr-1" /> New Project
                    </Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {PROJECTS.map(project => (
                        <div key={project.id} className="group rounded-xl border p-5 transition-all cursor-pointer hover:border-zinc-700/40" style={{ background: "var(--surface-2)", borderColor: "var(--surface-border)" }}>
                            <div className={`size-11 rounded-xl bg-gradient-to-br ${project.color} flex items-center justify-center mb-4`}>
                                <project.icon size={20} className="text-zinc-300" />
                            </div>
                            <h3 className="text-[15px] font-semibold text-zinc-200 mb-1">{project.title}</h3>
                            <p className="text-[12px] text-zinc-500 leading-relaxed mb-4">{project.description}</p>
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <span className={`${geistMono.className} text-[10px] text-zinc-600`}>{project.sessions} sessions</span>
                                    <span className={`${geistMono.className} text-[10px] text-zinc-600`}>{project.highlights} highlights</span>
                                </div>
                                <span className={`${geistMono.className} text-[10px] text-zinc-700 flex items-center gap-1`}><Clock size={10} /> {project.lastAccessed}</span>
                            </div>
                            <div className="flex items-center gap-2 mt-4 pt-3 border-t" style={{ borderColor: "var(--surface-border)" }}>
                                <Button variant="ghost" size="sm" className="flex-1 h-7 text-[11px] font-medium text-zinc-500 hover:text-zinc-200 rounded-md hover:bg-zinc-800/20 transition-colors">Open</Button>
                                <Button variant="ghost" size="icon" className="h-7 w-7 rounded-md hover:bg-zinc-800/20 text-zinc-600 hover:text-zinc-300 transition-colors"><ExternalLink size={13} /></Button>
                                <Button variant="ghost" size="icon" className="h-7 w-7 rounded-md hover:bg-zinc-800/20 text-zinc-600 hover:text-zinc-300 transition-colors"><MoreHorizontal size={13} /></Button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </WorkspaceLayout>
    );
}
