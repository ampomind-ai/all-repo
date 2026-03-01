"use client";

import React, { useState } from "react";
import WorkspaceLayout from "../components/workspace-layout";
import { Funnel_Display, Geist_Mono } from "next/font/google";
import { Clock, MessageSquare, Zap, Film, BookOpen, Scale, Pen, Code, GraduationCap, Search, Trash2, Pin } from "lucide-react";
import { Button, Input } from "ui";

const funnelDisplay = Funnel_Display({ subsets: ["latin"], weight: ["400", "500", "600", "700", "800"] });
const geistMono = Geist_Mono({ subsets: ["latin"] });

const MODE_ICONS: Record<string, React.ElementType> = { general: MessageSquare, summarize: Zap, youtube: Film, research: BookOpen, compare: Scale, creator: Pen, code: Code, study: GraduationCap };

const SESSIONS = [
    { id: "1", title: "Understanding Transformer Architecture", mode: "research", preview: "Analyzed the core attention mechanism paper and extracted key frameworks...", time: "12 min ago", messages: 14 },
    { id: "2", title: "React Server Components Deep Dive", mode: "summarize", preview: "Summarized the official React docs on server components vs client...", time: "1 hour ago", messages: 8 },
    { id: "3", title: "LinkedIn post: AI in 2026", mode: "creator", preview: "Generated 3 hook variants and a full LinkedIn post about AI trends...", time: "3 hours ago", messages: 6 },
    { id: "4", title: "Python vs Rust performance comparison", mode: "compare", preview: "Compared 4 benchmark sources on Python and Rust for data pipelines...", time: "Yesterday", messages: 22 },
    { id: "5", title: "Build a Next.js auth system", mode: "code", preview: "Step-by-step implementation of JWT auth with middleware and refresh tokens...", time: "Yesterday", messages: 31 },
    { id: "6", title: "Attention Is All You Need — paper summary", mode: "research", preview: "Full breakdown: abstract, methodology, results, limitations, and follow-up ideas...", time: "Feb 17", messages: 9 },
    { id: "7", title: "Machine Learning course notes", mode: "study", preview: "Organized notes from Andrew Ng's ML specialization, week 3...", time: "Feb 16", messages: 15 },
    { id: "8", title: "X thread: Why builders should write", mode: "creator", preview: "7-tweet thread on building in public and the compounding effects of writing...", time: "Feb 15", messages: 5 },
];

export default function SessionsPage() {
    const [search, setSearch] = useState("");
    const filtered = SESSIONS.filter(s => s.title.toLowerCase().includes(search.toLowerCase()));

    return (
        <WorkspaceLayout>
            <div className="max-w-4xl mx-auto py-10 px-8">
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className={`${funnelDisplay.className} text-[28px] font-bold text-zinc-100`}>Recent Sessions</h1>
                        <p className="text-[14px] text-zinc-500 mt-1">Your conversation history</p>
                    </div>
                    <div className="flex items-center gap-2 border rounded-lg px-3 py-2" style={{ background: "var(--surface-2)", borderColor: "var(--surface-border)" }}>
                        <Search size={14} className="text-zinc-600" />
                        <Input
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Search sessions..."
                            className=""
                        />
                    </div>
                </div>

                <div className="space-y-2">
                    {filtered.map(session => {
                        const ModeIcon = MODE_ICONS[session.mode] || MessageSquare;
                        return (
                            <div key={session.id} className="group flex items-start gap-4 p-4 rounded-xl border transition-all cursor-pointer hover:border-zinc-700/40" style={{ background: "var(--surface-2)", borderColor: "var(--surface-border)" }}>
                                <div className="size-9 rounded-lg flex items-center justify-center shrink-0 mt-0.5" style={{ background: "var(--surface-3)" }}>
                                    <ModeIcon size={16} className="text-zinc-400" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2 mb-1">
                                        <h3 className="text-[14px] font-semibold text-zinc-200 truncate">{session.title}</h3>
                                        <span className={`${geistMono.className} text-[9px] text-zinc-600 uppercase px-1.5 py-0.5 rounded shrink-0`} style={{ background: "var(--surface-3)" }}>{session.mode}</span>
                                    </div>
                                    <p className="text-[13px] text-zinc-500 truncate">{session.preview}</p>
                                    <div className="flex items-center gap-3 mt-2">
                                        <span className={`${geistMono.className} text-[10px] text-zinc-600 flex items-center gap-1`}><Clock size={10} /> {session.time}</span>
                                        <span className={`${geistMono.className} text-[10px] text-zinc-600`}>{session.messages} messages</span>
                                    </div>
                                </div>
                                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                                    <Button variant="ghost" size="icon" className="h-7 w-7 rounded-md hover:bg-zinc-800/40 text-zinc-600 hover:text-zinc-300 transition-colors"><Pin size={13} /></Button>
                                    <Button variant="ghost" size="icon" className="h-7 w-7 rounded-md hover:bg-zinc-800/40 text-zinc-600 hover:text-red-400 transition-colors"><Trash2 size={13} /></Button>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </WorkspaceLayout>
    );
}
