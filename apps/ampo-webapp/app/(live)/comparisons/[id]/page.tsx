"use client";

import React from "react";
import WorkspaceLayout from "../../components/workspace-layout";
import { Funnel_Display, Geist_Mono } from "next/font/google";
import { ArrowLeft, Scale, FileText, AlertTriangle, Lightbulb, Share2, Download, Table2 } from "lucide-react";
import { Button } from "ui";
import Link from "next/link";
import { useParams } from "next/navigation";

const funnelDisplay = Funnel_Display({ subsets: ["latin"], weight: ["400", "500", "600", "700", "800"] });
const geistMono = Geist_Mono({ subsets: ["latin"] });

// Mock data to match the comparisons index page
const COMPARISONS: Record<string, any> = {
    "1": {
        title: "RAG vs Fine-tuning for Domain QA",
        sources: 3,
        contradictions: 2,
        patterns: 4,
        date: "Yesterday",
        synthesis: "RAG is the default for broad domains; fine-tuning remains valuable for narrow, high-stakes verticals.",
        columns: ["Feature", "RAG", "Fine-Tuning", "Hybrid"],
        rows: [
            ["Knowledge Freshness", "Real-time (DB Update)", "Static (Retraining Needed)", "Real-time + Encoded Base"],
            ["Hallucination Risk", "Lower (Grounded in Context)", "Higher (Model Confidence)", "Medium"],
            ["Domain Adaptation", "Limited to Retrieval Quality", "Deep Stylistic & Factual Changes", "Excellent"],
            ["Upfront Cost", "Low-Medium (Vector DB)", "High (Compute & Data Prep)", "Very High"]
        ]
    },
    "2": {
        title: "React Server Components vs Client Components",
        sources: 4,
        contradictions: 1,
        patterns: 6,
        date: "Feb 18",
        synthesis: "Server components are ideal for data-fetching and static content; client components for interactivity.",
        columns: ["Trait", "Server Components", "Client Components"],
        rows: [
            ["Execution Environment", "Server-side only", "Browser"],
            ["State & Effects", "No (No useState/useEffect)", "Yes"],
            ["Bundle Size Impact", "Zero (Code stays on server)", "Adds to client bundle"],
            ["Direct DB Access", "Yes", "No (API needed)"]
        ]
    },
};

export default function ComparisonWorkspace() {
    const params = useParams();
    const id = params.id as string;
    const comparison = COMPARISONS[id] || {
        title: "Untitled Comparison",
        synthesis: "No synthesis available.",
        sources: 0, contradictions: 0, patterns: 0,
        columns: [], rows: []
    };

    return (
        <WorkspaceLayout>
            <div className="max-w-5xl mx-auto py-8 px-6">
                <div className="mb-8 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Link href="/comparisons">
                            <Button variant="ghost" size="icon-sm" className="h-8 w-8 text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/30">
                                <ArrowLeft size={16} />
                            </Button>
                        </Link>
                        <div className="flex items-center gap-3">
                            <div className="size-9 rounded-lg flex items-center justify-center bg-indigo-500/10 border border-indigo-500/20">
                                <Scale size={16} className="text-indigo-400" />
                            </div>
                            <div>
                                <h1 className={`${funnelDisplay.className} text-[22px] font-bold text-zinc-100`}>
                                    {comparison.title}
                                </h1>
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        <Button variant="outline" className="h-8 px-3 bg-zinc-800/20 hover:bg-zinc-800/40 border-zinc-700/50 text-[12px] font-medium text-zinc-200 transition-colors rounded-md">
                            <Share2 size={13} className="mr-1.5" /> Share
                        </Button>
                        <Button className="h-8 px-3 text-[12px] font-medium transition-colors rounded-md bg-zinc-100 text-zinc-900 hover:bg-white">
                            <Download size={13} className="mr-1.5" /> Export PDF
                        </Button>
                    </div>
                </div>

                {/* Synthesis Banner */}
                <div className="mb-8 p-5 rounded-xl border bg-gradient-to-br from-indigo-500/5 to-purple-500/5 border-indigo-500/20">
                    <h3 className="text-[14px] font-medium text-indigo-400 mb-2 flex items-center gap-1.5">
                        <Lightbulb size={14} /> AI Synthesis
                    </h3>
                    <p className="text-[15px] text-zinc-300 leading-relaxed">
                        {comparison.synthesis}
                    </p>
                </div>

                {/* Metrics */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                    <div className="p-4 rounded-xl border bg-zinc-900/50 border-zinc-800">
                        <div className="flex items-center gap-2 mb-1">
                            <FileText size={14} className="text-zinc-400" />
                            <h4 className="text-[12px] font-medium text-zinc-400">Sources Analyzed</h4>
                        </div>
                        <p className={`${geistMono.className} text-[24px] font-semibold text-zinc-100`}>{comparison.sources}</p>
                    </div>
                    <div className="p-4 rounded-xl border bg-amber-500/5 border-amber-500/20">
                        <div className="flex items-center gap-2 mb-1">
                            <AlertTriangle size={14} className="text-amber-500/70" />
                            <h4 className="text-[12px] font-medium text-amber-500/70">Key Contradictions</h4>
                        </div>
                        <p className={`${geistMono.className} text-[24px] font-semibold text-amber-400`}>{comparison.contradictions}</p>
                    </div>
                    <div className="p-4 rounded-xl border bg-cyan-500/5 border-cyan-500/20">
                        <div className="flex items-center gap-2 mb-1">
                            <Table2 size={14} className="text-cyan-500/70" />
                            <h4 className="text-[12px] font-medium text-cyan-500/70">Identified Patterns</h4>
                        </div>
                        <p className={`${geistMono.className} text-[24px] font-semibold text-cyan-400`}>{comparison.patterns}</p>
                    </div>
                </div>

                {/* Matrix Table */}
                {comparison.columns.length > 0 && (
                    <div className="rounded-xl border border-zinc-800 overflow-hidden bg-zinc-900/30">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-[13px] text-zinc-300">
                                <thead className="bg-zinc-900/80 text-zinc-400 border-b border-zinc-800 text-[12px] font-medium">
                                    <tr>
                                        {comparison.columns.map((col: string, i: number) => (
                                            <th key={i} className="px-5 py-3">{col}</th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody>
                                    {comparison.rows.map((row: string[], i: number) => (
                                        <tr key={i} className="border-b border-zinc-800/50 last:border-0 hover:bg-zinc-800/10 transition-colors">
                                            {row.map((cell: string, j: number) => (
                                                <td key={j} className={`px-5 py-4 ${j === 0 ? 'font-medium text-zinc-200 bg-zinc-900/30' : ''}`}>
                                                    {cell}
                                                </td>
                                            ))}
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </div>
        </WorkspaceLayout>
    );
}
