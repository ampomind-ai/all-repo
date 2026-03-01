"use client";

import React from "react";
import WorkspaceLayout from "../../components/workspace-layout";
import { Funnel_Display, Geist_Mono } from "next/font/google";
import { ArrowLeft, Send, Sparkles, Image as ImageIcon, Type, Link as LinkIcon, AlignLeft, Hash } from "lucide-react";
import { Button, Textarea } from "ui";
import Link from "next/link";
import { useParams } from "next/navigation";

const funnelDisplay = Funnel_Display({ subsets: ["latin"], weight: ["400", "500", "600", "700", "800"] });
const geistMono = Geist_Mono({ subsets: ["latin"] });

// Mock data to match the drafts index page
const DRAFTS: Record<string, any> = {
    "1": { title: "Why builders should write daily", platform: "twitter", type: "Thread (7 tweets)", content: "Most people consume AI. Few people create with it.\n\nHere's the workflow that changed everything for me...\n\n1. Capture raw thoughts in drafts\n2. Let AI extract the core insight\n3. Expand into a full thread\n\nWriting forces clarity." },
    "2": { title: "AI tools I actually use in 2026", platform: "linkedin", type: "Post", content: "I used to drown in tabs. 47 open. 12 bookmarked. 0 actually processed.\n\nThen I changed my workflow entirely...\n\nI stopped saving links and started saving extracted insights." },
    "3": { title: "5 frameworks from one YouTube lecture", platform: "twitter", type: "Thread (5 tweets)", content: "I watched one 24-minute video on transformers.\n\nExtracted 5 frameworks I use every day...\n\nHere is how attention mechanisms actually map to human cognition." },
    "4": { title: "My research synthesis workflow", platform: "linkedin", type: "Article Draft", content: "The gap between reading and understanding is called synthesis.\n\nHere's exactly how I turn 5 papers into one actionable insight...\n\nStep 1: Extract the contradictions.\nStep 2: Map the core patterns." },
};

export default function DraftWorkspace() {
    const params = useParams();
    const id = params.id as string;
    const draft = DRAFTS[id] || { title: "Untitled Draft", content: "", platform: "unknown", type: "Note" };

    return (
        <WorkspaceLayout>
            <div className="max-w-4xl mx-auto py-8 px-6">
                <div className="mb-6 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Link href="/drafts">
                            <Button variant="ghost" size="icon-sm" className="h-8 w-8 text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/30">
                                <ArrowLeft size={16} />
                            </Button>
                        </Link>
                        <div>
                            <h1 className={`${funnelDisplay.className} text-[22px] font-bold text-zinc-100 flex items-center gap-2`}>
                                {draft.title}
                            </h1>
                            <div className="flex items-center gap-2 mt-1">
                                <span className={`${geistMono.className} text-[10px] text-zinc-500 uppercase px-2 py-0.5 rounded-md border border-zinc-800 bg-zinc-900`}>{draft.platform}</span>
                                <span className={`${geistMono.className} text-[10px] text-zinc-600`}>• {draft.type}</span>
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        <Button variant="outline" className="h-8 px-4 bg-zinc-800/20 hover:bg-zinc-800/40 border-zinc-700/50 text-[12px] font-medium text-purple-400 hover:text-purple-300 transition-colors rounded-md">
                            <Sparkles size={13} className="mr-1.5" /> AI Polish
                        </Button>
                        <Button className="h-8 px-4 text-[12px] font-medium transition-colors rounded-md bg-zinc-100 text-zinc-900 hover:bg-white">
                            <Send size={13} className="mr-1.5" /> Publish Now
                        </Button>
                    </div>
                </div>

                <div className="rounded-xl border shadow-lg overflow-hidden flex flex-col h-[60vh]" style={{ background: "var(--surface-2)", borderColor: "var(--surface-border)" }}>
                    {/* Formatting Toolbar */}
                    <div className="h-12 border-b flex items-center px-4 gap-1" style={{ borderColor: "var(--surface-border)", background: "var(--surface-1)" }}>
                        <Button variant="ghost" size="icon-sm" className="h-8 w-8 text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/50"><Type size={14} /></Button>
                        <Button variant="ghost" size="icon-sm" className="h-8 w-8 text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/50"><AlignLeft size={14} /></Button>
                        <div className="w-px h-4 bg-zinc-800 mx-1" />
                        <Button variant="ghost" size="icon-sm" className="h-8 w-8 text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/50"><LinkIcon size={14} /></Button>
                        <Button variant="ghost" size="icon-sm" className="h-8 w-8 text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/50"><ImageIcon size={14} /></Button>
                        <Button variant="ghost" size="icon-sm" className="h-8 w-8 text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/50"><Hash size={14} /></Button>
                    </div>

                    {/* Editor Area */}
                    <Textarea
                        className="flex-1 w-full resize-none border-0 bg-transparent p-6 text-[15px] leading-relaxed text-zinc-200 focus-visible:ring-0 placeholder:text-zinc-600"
                        defaultValue={draft.content}
                        placeholder="Write your draft here..."
                    />
                </div>
            </div>
        </WorkspaceLayout>
    );
}
