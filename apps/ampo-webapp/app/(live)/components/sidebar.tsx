"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Geist_Mono } from "next/font/google";
import {
    Plus, Clock, Pin, FolderOpen, Sparkles, Video, Scale,
    PanelLeftClose, Star, ClipboardList, Share2, GraduationCap, Globe
} from "lucide-react";

const geistMono = Geist_Mono({ subsets: ["latin"] });

const SIDEBAR_SECTIONS: { heading: string; items: { Icon: React.ElementType; label: string; href?: string; count?: number }[] }[] = [
    {
        heading: "", items: [
            { Icon: Plus, label: "New Session" },
        ]
    },
    {
        heading: "WORKSPACE", items: [
            { Icon: Clock, label: "Recent Sessions", href: "/sessions", count: 12 },
            { Icon: Pin, label: "Pinned Projects", href: "/projects", count: 3 },
            { Icon: FolderOpen, label: "Knowledge Vault", href: "/vault" },
            { Icon: Sparkles, label: "Saved Highlights", href: "/highlights", count: 8 },
        ]
    },
    {
        heading: "TOOLS", items: [
            { Icon: Video, label: "Video Analyses", href: "/videos", count: 4 },
            { Icon: Scale, label: "Research Comparisons", href: "/comparisons" },
            { Icon: Share2, label: "Social Drafts", href: "/drafts", count: 2 },
            { Icon: ClipboardList, label: "Templates", href: "/templates" },
            { Icon: GraduationCap, label: "Online Courses", href: "/courses" },
            { Icon: Globe, label: "World Simulate", href: "/world-simulate" },
        ]
    },
];

interface SidebarProps {
    isOpen: boolean;
    setIsOpen: (open: boolean) => void;
    onNewSession?: () => void;
}

export default function Sidebar({ isOpen, setIsOpen, onNewSession }: SidebarProps) {
    const pathname = usePathname();

    return (
        <div className={`${isOpen ? "w-[260px]" : "w-0"} shrink-0 transition-all duration-300 overflow-hidden`}>
            <aside className="m-3 h-[calc(100vh-1.5rem)] flex flex-col rounded-2xl border border-border/60 bg-card/70 backdrop-blur-xl shadow-xl shadow-black/10 overflow-hidden">

                {/* Top: Logo + Collapse */}
                <div className="h-14 flex items-center justify-between px-4 shrink-0">
                    <Link href="/landing" className="flex items-center gap-2.5 group">
                        <div className="size-7 bg-background rounded-[7px] flex items-center justify-center shadow-sm border border-border/50">
                            <Image src="/ampo-icon-logo.png" alt="A" width={20} height={20} />
                        </div>
                        <span className="text-[13px] font-bold tracking-tight text-foreground/80">AmpoMind</span>
                    </Link>
                    <button
                        onClick={() => setIsOpen(false)}
                        className="size-7 rounded-lg hover:bg-accent flex items-center justify-center text-muted-foreground/60 hover:text-muted-foreground transition-colors"
                    >
                        <PanelLeftClose size={15} />
                    </button>
                </div>

                <div className="h-px bg-border/40 mx-4" />

                {/* Navigation */}
                <div className="flex-1 overflow-y-auto py-3 px-3 space-y-0.5">
                    {SIDEBAR_SECTIONS.map((section, si) => (
                        <div key={si} className={si > 0 ? "pt-4" : ""}>
                            {section.heading && (
                                <div className={`${geistMono.className} text-[9px] text-muted-foreground/50 uppercase tracking-[0.15em] px-2 mb-2`}>
                                    {section.heading}
                                </div>
                            )}
                            {section.items.map((item, ii) => {
                                if (item.href) {
                                    const isActive = pathname === item.href;
                                    return (
                                        <Link
                                            key={ii}
                                            href={item.href}
                                            className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-xl text-[13px] font-medium transition-all duration-150 group ${isActive
                                                    ? "text-foreground bg-accent"
                                                    : "text-muted-foreground hover:text-foreground hover:bg-accent/50"
                                                }`}
                                        >
                                            <span className="flex items-center gap-2.5 truncate">
                                                <item.Icon
                                                    size={14}
                                                    className={`shrink-0 ${isActive ? "text-cyan-500" : "opacity-70 group-hover:opacity-100"}`}
                                                />
                                                {item.label}
                                            </span>
                                            {item.count !== undefined && (
                                                <span className={`${geistMono.className} text-[10px] text-muted-foreground/50`}>{item.count}</span>
                                            )}
                                        </Link>
                                    );
                                }
                                return (
                                    <button
                                        key={ii}
                                        onClick={onNewSession}
                                        className="w-full flex items-center justify-between px-2.5 py-1.5 rounded-xl text-[13px] font-medium transition-all text-foreground/70 hover:text-foreground bg-accent/40 hover:bg-accent mb-2 border border-border/40"
                                    >
                                        <span className="flex items-center gap-2.5 truncate">
                                            <item.Icon size={14} className="shrink-0 text-cyan-500/70" />
                                            {item.label}
                                        </span>
                                    </button>
                                );
                            })}
                        </div>
                    ))}
                </div>

                {/* Bottom: Usage + Upgrade + Profile */}
                <div className="shrink-0 p-3 space-y-1">
                    <div className="h-px bg-border/40 mb-3" />

                    <div className="px-2 mb-3">
                        <div className="flex items-center justify-between mb-1.5">
                            <span className={`${geistMono.className} text-[9px] text-muted-foreground/50 uppercase tracking-[0.12em]`}>Usage</span>
                            <span className={`${geistMono.className} text-[10px] text-muted-foreground/50`}>18 / 50</span>
                        </div>
                        <div className="h-[3px] bg-accent rounded-full overflow-hidden">
                            <div className="h-full w-[36%] bg-gradient-to-r from-cyan-500 to-purple-500 rounded-full" />
                        </div>
                    </div>

                    <Link
                        href="/pricing"
                        className="flex items-center gap-2.5 px-2.5 py-1.5 rounded-xl text-[12px] text-muted-foreground hover:text-foreground hover:bg-accent/50 transition-all font-medium"
                    >
                        <Star size={13} className="text-yellow-500/70" />
                        Upgrade to Pro
                    </Link>

                    <div className="flex items-center gap-2.5 px-2.5 py-2 rounded-xl mt-1">
                        <div className="size-7 rounded-full bg-gradient-to-br from-cyan-500 to-purple-500 shrink-0 shadow-sm" />
                        <div className="flex-1 min-w-0">
                            <div className="text-[12px] font-medium text-foreground/70 truncate">Guest</div>
                            <div className={`${geistMono.className} text-[9px] text-muted-foreground/50 uppercase tracking-wider`}>Free Plan</div>
                        </div>
                    </div>
                </div>
            </aside>
        </div>
    );
}
