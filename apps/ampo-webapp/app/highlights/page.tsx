"use client";

import React from "react";
import WorkspaceLayout from "../components/workspace-layout";
import { Funnel_Display, Geist_Mono } from "next/font/google";
import { Highlighter, FileText, Quote, Clock, Copy, ExternalLink, Hash } from "lucide-react";
import { Button } from "ui";

const funnelDisplay = Funnel_Display({ subsets: ["latin"], weight: ["400", "500", "600", "700", "800"] });
const geistMono = Geist_Mono({ subsets: ["latin"] });

const HIGHLIGHTS = [
    { id: "1", text: "\"Attention is all you need\" — the key insight is that self-attention can completely replace recurrence for sequence modeling, achieving better parallelization.", source: "Transformer Architecture Research", type: "research", color: "border-l-cyan-500", date: "2 hours ago", tags: ["research"] },
    { id: "2", text: "RAG + GPT-4 achieved 89.3% accuracy vs 66.7% for vanilla GPT-4 on domain-specific QA. The improvement was most significant for factual queries.", source: "RAG vs Fine-tuning Comparison", type: "research", color: "border-l-blue-500", date: "Yesterday", tags: ["research"] },
    { id: "3", text: "The best hooks create a knowledge gap — they tell you there IS a secret without revealing it. Use patterns like: \"Most people do X wrong. Here's what actually works.\"", source: "Content Writing Frameworks", type: "creator", color: "border-l-purple-500", date: "Yesterday", tags: ["creator"] },
    { id: "4", text: "Pre-norm transformers train significantly faster than post-norm variants. This is because layer normalization before attention prevents gradient explosion in deep networks.", source: "Deep Learning Course Notes", type: "study", color: "border-l-emerald-500", date: "Feb 18", tags: ["study"] },
    { id: "5", text: "Flash Attention reduces memory usage from O(n²) to O(n) by tiling the attention computation and avoiding materializing the full attention matrix.", source: "Efficient Transformers Video", type: "youtube", color: "border-l-amber-500", date: "Feb 17", tags: ["youtube"] },
    { id: "6", text: "Writing forces clarity of thought. If you can't explain something in writing, you don't actually understand it. Build in public to compound your learning.", source: "X Thread: Builders Should Write", type: "creator", color: "border-l-pink-500", date: "Feb 16", tags: ["creator"] },
];

export default function HighlightsPage() {
    return (
        <WorkspaceLayout>
            <div className="max-w-4xl mx-auto py-10 px-8">
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className={`${funnelDisplay.className} text-[28px] font-bold text-zinc-100`}>Saved Highlights</h1>
                        <p className="text-[14px] text-zinc-500 mt-1">Key passages and insights you've bookmarked</p>
                    </div>
                    <span className={`${geistMono.className} text-[11px] text-zinc-600`}>{HIGHLIGHTS.length} highlights</span>
                </div>

                <div className="space-y-3">
                    {HIGHLIGHTS.map(h => (
                        <div key={h.id} className={`group p-5 rounded-xl border border-l-2 ${h.color} transition-all cursor-pointer hover:border-zinc-700/40`} style={{ background: "var(--surface-2)", borderRightColor: "var(--surface-border)", borderTopColor: "var(--surface-border)", borderBottomColor: "var(--surface-border)" }}>
                            <p className="text-[14px] text-zinc-300 leading-[1.7] mb-3">{h.text}</p>
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    <span className={`${geistMono.className} text-[10px] text-zinc-500 flex items-center gap-1`}><Clock size={10} /> {h.date}</span>
                                    {h.tags && h.tags.length > 0 && (
                                        <span className={`${geistMono.className} text-[10px] text-zinc-500 flex items-center gap-1`}><Hash size={10} /> {h.tags[0]}</span>
                                    )}
                                </div>
                                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <Button variant="ghost" size="icon" className="h-7 w-7 rounded-md hover:bg-zinc-800/30 text-zinc-600 hover:text-zinc-300 transition-colors"><Copy size={13} /></Button>
                                    <Button variant="ghost" size="icon" className="h-7 w-7 rounded-md hover:bg-zinc-800/30 text-zinc-600 hover:text-zinc-300 transition-colors"><ExternalLink size={13} /></Button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </WorkspaceLayout>
    );
}
