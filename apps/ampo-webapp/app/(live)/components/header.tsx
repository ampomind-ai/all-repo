"use client";

import React, { useState, useRef, useEffect } from "react";
import { Menu, ChevronDown, Check, Sparkles, Zap, FlaskConical, Settings, LogOut, User } from "lucide-react";
import { ThemeSwitcher } from "./theme-switcher";

interface HeaderProps {
    sidebarOpen: boolean;
    setSidebarOpen: (open: boolean) => void;
    leftContent?: React.ReactNode;
}

const VERSIONS = [
    { id: "ampo-1", label: "AmpoMind", tag: "Standard", Icon: Sparkles, desc: "Fast, reliable for everyday tasks" },
    { id: "ampo-pro", label: "AmpoMind Pro", tag: "Pro", Icon: Zap, desc: "Extended context, deeper reasoning" },
    { id: "ampo-2-beta", label: "AmpoMind 2.0", tag: "Beta", Icon: FlaskConical, desc: "Next-gen. May be experimental" },
];

export default function Header({ sidebarOpen, setSidebarOpen, leftContent }: HeaderProps) {
    const [versionOpen, setVersionOpen] = useState(false);
    const [userOpen, setUserOpen] = useState(false);
    const [selected, setSelected] = useState(VERSIONS[0]!);
    const versionRef = useRef<HTMLDivElement>(null);
    const userRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handler = (e: MouseEvent) => {
            if (versionRef.current && !versionRef.current.contains(e.target as Node)) setVersionOpen(false);
            if (userRef.current && !userRef.current.contains(e.target as Node)) setUserOpen(false);
        };
        document.addEventListener("mousedown", handler);
        return () => document.removeEventListener("mousedown", handler);
    }, []);

    return (
        <header className="h-14 shrink-0 grid grid-cols-3 items-center px-5 relative z-40">
            {/* Left col */}
            <div className="flex items-center gap-2.5">
                {!sidebarOpen && (
                    <button
                        onClick={() => setSidebarOpen(true)}
                        className="size-8 rounded-xl bg-accent/60 hover:bg-accent border border-border/50 flex items-center justify-center text-muted-foreground hover:text-foreground transition-all"
                    >
                        <Menu size={15} />
                    </button>
                )}
                {leftContent}
            </div>

            {/* Center col — version switcher */}
            <div className="flex justify-center" ref={versionRef}>
                <div className="relative">
                    <button
                        onClick={() => setVersionOpen(!versionOpen)}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-accent/40 hover:bg-accent/70 border border-border/50 backdrop-blur-sm transition-all group"
                    >
                        <selected.Icon size={10} className="text-cyan-500 shrink-0" />
                        <span className="text-[12px] font-semibold text-foreground/70 group-hover:text-foreground/90 tracking-tight">{selected.label}</span>
                        <ChevronDown size={11} className={`text-muted-foreground/50 transition-transform duration-200 ${versionOpen ? "rotate-180" : ""}`} />
                    </button>

                    {versionOpen && (
                        <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-[240px] rounded-2xl border border-border/60 bg-card/90 backdrop-blur-xl shadow-2xl shadow-black/20 overflow-hidden z-[200] py-1.5">
                            {VERSIONS.map((v) => (
                                <button
                                    key={v.id}
                                    onClick={() => { setSelected(v); setVersionOpen(false); }}
                                    className={`w-full flex items-start gap-3 px-3.5 py-2.5 text-left transition-colors hover:bg-accent/60 ${selected.id === v.id ? "bg-accent/40" : ""}`}
                                >
                                    <div className={`size-7 rounded-lg flex items-center justify-center shrink-0 mt-0.5 ${selected.id === v.id ? "bg-cyan-500/15 text-cyan-500" : "bg-accent text-muted-foreground"}`}>
                                        <v.Icon size={13} />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2">
                                            <span className="text-[13px] font-semibold text-foreground/80">{v.label}</span>
                                            <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-md uppercase tracking-wider ${v.tag === "Beta" ? "bg-purple-500/10 text-purple-400" :
                                                v.tag === "Pro" ? "bg-cyan-500/10 text-cyan-500" :
                                                    "bg-accent text-muted-foreground"
                                                }`}>{v.tag}</span>
                                        </div>
                                        <p className="text-[11px] text-muted-foreground/60 mt-0.5 leading-snug">{v.desc}</p>
                                    </div>
                                    {selected.id === v.id && <Check size={13} className="text-cyan-500 shrink-0 mt-1" />}
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* Right col */}
            <div className="flex items-center gap-2 justify-end" ref={userRef}>
                <ThemeSwitcher />

                {/* User Avatar + Settings Dropdown */}
                <div className="relative">
                    <button
                        onClick={() => setUserOpen(!userOpen)}
                        className="size-8 rounded-full bg-gradient-to-br from-cyan-500/20 to-purple-500/20 border border-border/60 flex items-center justify-center text-muted-foreground hover:text-foreground hover:border-border transition-all shadow-sm"
                    >
                        <User size={14} />
                    </button>

                    {userOpen && (
                        <div className="absolute top-full right-0 mt-2 w-[180px] rounded-2xl border border-border/60 bg-card/90 backdrop-blur-xl shadow-2xl shadow-black/20 overflow-hidden z-[200] py-1.5">
                            <div className="px-3.5 py-2.5 border-b border-border/40 mb-1">
                                <div className="text-[12px] font-semibold text-foreground/70">Guest</div>
                                <div className="text-[10px] text-muted-foreground/50">Free Plan</div>
                            </div>
                            <button className="w-full flex items-center gap-2.5 px-3.5 py-2 text-[13px] text-foreground/60 hover:text-foreground hover:bg-accent/60 transition-colors">
                                <Settings size={13} />
                                Settings
                            </button>
                            <button className="w-full flex items-center gap-2.5 px-3.5 py-2 text-[13px] text-foreground/60 hover:text-foreground hover:bg-accent/60 transition-colors">
                                <LogOut size={13} />
                                Sign Out
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
}
