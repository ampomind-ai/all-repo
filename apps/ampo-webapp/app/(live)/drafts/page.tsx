"use client";

import React from "react";
import WorkspaceLayout from "../components/workspace-layout";
import { Funnel_Display, Geist_Mono } from "next/font/google";
import { FileText, Clock, PenTool, Edit3, Eye, Copy, MoreHorizontal, Plus, Twitter, Linkedin, Instagram, Share2 } from "lucide-react";
import Link from "next/link";
import { Button, Drawer, DrawerTrigger, DrawerContent, DrawerHeader, DrawerTitle, DrawerDescription, DrawerFooter, DrawerClose, Textarea } from "ui";

const funnelDisplay = Funnel_Display({ subsets: ["latin"], weight: ["400", "500", "600", "700", "800"] });
const geistMono = Geist_Mono({ subsets: ["latin"] });

const PLATFORM_ICONS: Record<string, React.ElementType> = { twitter: Twitter, linkedin: Linkedin, instagram: Instagram };
const PLATFORM_COLORS: Record<string, string> = { twitter: "text-sky-400 bg-sky-500/10 border-sky-500/20", linkedin: "text-blue-400 bg-blue-500/10 border-blue-500/20", instagram: "text-pink-400 bg-pink-500/10 border-pink-500/20" };

const DRAFTS = [
    { id: "1", title: "Why builders should write daily", platform: "twitter", type: "Thread (7 tweets)", preview: "Most people consume AI. Few people create with it.\n\nHere's the workflow that changed everything for me...", status: "Ready", date: "1 hour ago", engagement: 78 },
    { id: "2", title: "AI tools I actually use in 2026", platform: "linkedin", type: "Post", preview: "I used to drown in tabs. 47 open. 12 bookmarked. 0 actually processed.\n\nThen I changed my workflow entirely...", status: "Draft", date: "Yesterday", engagement: 65 },
    { id: "3", title: "5 frameworks from one YouTube lecture", platform: "twitter", type: "Thread (5 tweets)", preview: "I watched one 24-minute video on transformers.\n\nExtracted 5 frameworks I use every day...", status: "Draft", date: "Feb 18", engagement: 72 },
    { id: "4", title: "My research synthesis workflow", platform: "linkedin", type: "Article Draft", preview: "The gap between reading and understanding is called synthesis.\n\nHere's exactly how I turn 5 papers into one actionable insight...", status: "Ready", date: "Feb 17", engagement: 81 },
];

export default function DraftsPage() {
    return (
        <WorkspaceLayout>
            <div className="max-w-4xl mx-auto py-10 px-8">
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className={`${funnelDisplay.className} text-[28px] font-bold text-zinc-100`}>Social Drafts</h1>
                        <p className="text-[14px] text-zinc-500 mt-1">Content ready to publish across platforms</p>
                    </div>
                    <Drawer>
                        <DrawerTrigger asChild>
                            <Button variant="outline" className="h-8 px-4 bg-zinc-800/20 hover:bg-zinc-800/40 border-zinc-700/50 text-[12px] font-medium text-zinc-200 transition-colors rounded-lg">
                                <Plus size={13} className="mr-1" /> New Draft
                            </Button>
                        </DrawerTrigger>
                        <DrawerContent>
                            <div className="mx-auto w-full max-w-lg">
                                <DrawerHeader>
                                    <DrawerTitle>Quick Idea</DrawerTitle>
                                    <DrawerDescription>
                                        Jot down a quick thought. AI will format it later.
                                    </DrawerDescription>
                                </DrawerHeader>
                                <div className="p-4 pb-0">
                                    <div className="flex items-center justify-center space-x-2 mb-4">
                                        <div className="flex gap-2 w-full">
                                            <Button variant="outline" className="flex-1 flex gap-2"><Twitter size={14} className="text-sky-400" /> Twitter</Button>
                                            <Button variant="outline" className="flex-1 flex gap-2"><Linkedin size={14} className="text-blue-400" /> LinkedIn</Button>
                                        </div>
                                    </div>
                                    <Textarea
                                        placeholder="What's on your mind?"
                                        className="min-h-[120px] resize-none bg-zinc-900 border-zinc-800"
                                    />
                                </div>
                                <DrawerFooter>
                                    <Button>Save Draft</Button>
                                    <DrawerClose asChild>
                                        <Button variant="outline">Cancel</Button>
                                    </DrawerClose>
                                </DrawerFooter>
                            </div>
                        </DrawerContent>
                    </Drawer>
                </div>

                <div className="space-y-3">
                    {DRAFTS.map(draft => {
                        const PlatIcon = PLATFORM_ICONS[draft.platform] || Share2;
                        const platColor = PLATFORM_COLORS[draft.platform] || "";
                        return (
                            <Link href={`/drafts/${draft.id}`} key={draft.id} className="block group rounded-xl border p-5 transition-all cursor-pointer hover:border-zinc-700/40" style={{ background: "var(--surface-2)", borderColor: "var(--surface-border)" }}>
                                <div className="flex items-start justify-between mb-3">
                                    <div className="flex items-center gap-3">
                                        <div className={`size-9 rounded-lg flex items-center justify-center border ${platColor}`}>
                                            <PlatIcon size={16} />
                                        </div>
                                        <div>
                                            <h3 className="text-[14px] font-semibold text-zinc-200">{draft.title}</h3>
                                            <div className="flex items-center gap-2 mt-0.5">
                                                <span className={`${geistMono.className} text-[9px] text-zinc-600 uppercase`}>{draft.type}</span>
                                                <span className="text-zinc-800">·</span>
                                                <span className={`${geistMono.className} text-[10px] ${draft.status === "Ready" ? "text-emerald-400" : "text-zinc-600"}`}>{draft.status}</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-2 shrink-0">
                                        {/* Engagement score */}
                                        <div className="flex items-center gap-1.5 px-2 py-1 rounded-md" style={{ background: "var(--surface-3)" }}>
                                            <div className="w-12 h-1 bg-zinc-900 rounded-full overflow-hidden">
                                                <div className="h-full bg-gradient-to-r from-cyan-500 to-green-400 rounded-full" style={{ width: `${draft.engagement}%` }} />
                                            </div>
                                            <span className={`${geistMono.className} text-[10px] text-zinc-500`}>{draft.engagement}</span>
                                        </div>
                                        <span className={`${geistMono.className} text-[10px] text-zinc-700 flex items-center gap-1`}><Clock size={10} /> {draft.date}</span>
                                    </div>
                                </div>

                                <p className="text-[13px] text-zinc-500 leading-relaxed mb-3 pl-12 whitespace-pre-line line-clamp-2">{draft.preview}</p>

                                <div className="flex items-center gap-2 pl-12 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <Button variant="ghost" size="sm" className="h-7 px-3 text-[11px] font-medium text-zinc-500 hover:text-zinc-200 hover:bg-zinc-800/20 transition-colors"><Edit3 size={12} className="mr-1.5" /> Edit</Button>
                                    <Button variant="ghost" size="sm" className="h-7 px-3 text-[11px] font-medium text-zinc-500 hover:text-zinc-200 hover:bg-zinc-800/20 transition-colors"><Eye size={12} className="mr-1.5" /> Preview</Button>
                                    <Button variant="ghost" size="sm" className="h-7 px-3 text-[11px] font-medium text-zinc-500 hover:text-zinc-200 hover:bg-zinc-800/20 transition-colors"><Copy size={12} className="mr-1.5" /> Copy</Button>
                                    <div className="flex-1" />
                                    <Button variant="ghost" size="icon" className="h-7 w-7 text-zinc-600 hover:text-zinc-300 hover:bg-zinc-800/20 transition-colors rounded-md" onClick={(e) => e.preventDefault()}><MoreHorizontal size={14} /></Button>
                                </div>
                            </Link>
                        );
                    })}
                </div>
            </div>
        </WorkspaceLayout>
    );
}
