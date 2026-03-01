"use client";

import React, { useState } from "react";
import WorkspaceLayout from "../components/workspace-layout";
import { Funnel_Display, Geist_Mono } from "next/font/google";
import { Search, Folder, FileText, Tag, Clock, Star, Grid3X3, List, Plus, ChevronRight } from "lucide-react";
import Link from "next/link";
import { Button, Input, Sheet, SheetTrigger, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetFooter, SheetClose, Label } from "ui";

const funnelDisplay = Funnel_Display({ subsets: ["latin"], weight: ["400", "500", "600", "700", "800"] });
const geistMono = Geist_Mono({ subsets: ["latin"] });

const FOLDERS = [
    { name: "AI Research", items: 12, icon: "🧠" },
    { name: "Content Ideas", items: 8, icon: "✍️" },
    { name: "Course Notes", items: 15, icon: "📚" },
    { name: "Code Snippets", items: 6, icon: "💻" },
];

const RECENT_ITEMS = [
    { title: "RAG vs Fine-tuning Analysis", folder: "AI Research", type: "Research", date: "2 hours ago", tags: ["NLP", "RAG", "LLM"] },
    { title: "Hook formulas that convert", folder: "Content Ideas", type: "Highlight", date: "Yesterday", tags: ["writing", "hooks"] },
    { title: "Transformer architecture notes", folder: "Course Notes", type: "Notes", date: "Feb 18", tags: ["deep-learning", "attention"] },
    { title: "Next.js middleware patterns", folder: "Code Snippets", type: "Code", date: "Feb 17", tags: ["nextjs", "auth"] },
    { title: "Social media engagement study", folder: "Content Ideas", type: "Research", date: "Feb 16", tags: ["social", "growth"] },
];

export default function VaultPage() {
    const [view, setView] = useState<"grid" | "list">("list");
    const [search, setSearch] = useState("");

    return (
        <WorkspaceLayout>
            <div className="max-w-5xl mx-auto py-10 px-8">
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className={`${funnelDisplay.className} text-[28px] font-bold text-zinc-100`}>Knowledge Vault</h1>
                        <p className="text-[14px] text-zinc-500 mt-1">Your searchable library of insights and saved content</p>
                    </div>
                    <div className="flex items-center gap-2">
                        <Button variant="ghost" size="icon" onClick={() => setView("grid")} className={`h-8 w-8 rounded-lg transition-colors ${view === "grid" ? "bg-zinc-800/40 text-zinc-200" : "text-zinc-600 hover:text-zinc-400"}`}><Grid3X3 size={16} /></Button>
                        <Button variant="ghost" size="icon" onClick={() => setView("list")} className={`h-8 w-8 rounded-lg transition-colors ${view === "list" ? "bg-zinc-800/40 text-zinc-200" : "text-zinc-600 hover:text-zinc-400"}`}><List size={16} /></Button>
                    </div>
                </div>

                {/* Search */}
                <div className="flex items-center gap-2 border rounded-xl px-4 py-3 mb-8" style={{ background: "var(--surface-2)", borderColor: "var(--surface-border)" }}>
                    <Search size={16} className="text-zinc-600" />
                    <Input
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Search across all saved content..."
                        className="flex-1"
                    />
                </div>

                {/* Folders */}
                <div className="mb-10">
                    <h2 className={`${geistMono.className} text-[10px] text-zinc-600 uppercase tracking-[0.12em] mb-3`}>Folders</h2>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                        {FOLDERS.map(folder => (
                            <Link href={`/vault/${folder.name.toLowerCase().replace(/\s+/g, '-')}`} key={folder.name} className="flex h-auto justify-start items-center gap-3 p-3 rounded-xl border transition-all hover:bg-zinc-800/40 text-left" style={{ background: "var(--surface-2)", borderColor: "var(--surface-border)" }}>
                                <div className="size-10 rounded-lg flex items-center justify-center text-lg" style={{ background: "var(--surface-3)" }}>{folder.icon}</div>
                                <div>
                                    <div className="text-[13px] font-semibold text-zinc-200">{folder.name}</div>
                                    <div className={`${geistMono.className} text-[10px] text-zinc-600`}>{folder.items} items</div>
                                </div>
                            </Link>
                        ))}
                        <Sheet>
                            <SheetTrigger asChild>
                                <Button variant="outline" className="flex h-auto items-center justify-center gap-2 p-3 rounded-xl border border-dashed transition-all hover:bg-zinc-800/20 text-[12px] text-zinc-600 hover:text-zinc-400 bg-transparent" style={{ borderColor: "var(--surface-border)" }}>
                                    <Plus size={14} className="mr-1" /> New Folder
                                </Button>
                            </SheetTrigger>
                            <SheetContent>
                                <SheetHeader>
                                    <SheetTitle>Create Folder</SheetTitle>
                                    <SheetDescription>
                                        Organize your vault by creating a new category folder.
                                    </SheetDescription>
                                </SheetHeader>
                                <div className="grid gap-6 py-4 px-2">
                                    <div className="grid gap-2">
                                        <Label htmlFor="folderName" className="text-zinc-400">
                                            Name
                                        </Label>
                                        <Input
                                            id="folderName"
                                            placeholder="e.g. Marketing"
                                            className="bg-zinc-900 border-zinc-800"
                                        />
                                    </div>
                                    <div className="grid gap-2">
                                        <Label htmlFor="folderIcon" className="text-zinc-400">
                                            Icon
                                        </Label>
                                        <Input
                                            id="folderIcon"
                                            placeholder="Emoji (e.g. 📊)"
                                            className="bg-zinc-900 border-zinc-800"
                                        />
                                    </div>
                                </div>
                                <SheetFooter>
                                    <SheetClose asChild>
                                        <Button variant="outline">Cancel</Button>
                                    </SheetClose>
                                    <SheetClose asChild>
                                        <Button>Create Folder</Button>
                                    </SheetClose>
                                </SheetFooter>
                            </SheetContent>
                        </Sheet>
                    </div>
                </div>

                {/* Items */}
                <div>
                    <h2 className={`${geistMono.className} text-[10px] text-zinc-600 uppercase tracking-[0.12em] mb-3`}>Recent Items</h2>
                    <div className="space-y-2">
                        {RECENT_ITEMS.map((item, i) => (
                            <div key={i} className="group flex items-center gap-4 p-4 rounded-xl border transition-all cursor-pointer hover:border-zinc-700/40" style={{ background: "var(--surface-2)", borderColor: "var(--surface-border)" }}>
                                <FileText size={16} className="text-zinc-500 shrink-0" />
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2 mb-0.5">
                                        <span className="text-[14px] font-medium text-zinc-200 truncate">{item.title}</span>
                                        <span className={`${geistMono.className} text-[9px] text-zinc-600 uppercase px-1.5 py-0.5 rounded shrink-0`} style={{ background: "var(--surface-3)" }}>{item.type}</span>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <span className="text-[11px] text-zinc-600 flex items-center gap-1"><Folder size={10} /> {item.folder}</span>
                                        <span className="text-[11px] text-zinc-700 flex items-center gap-1"><Clock size={10} /> {item.date}</span>
                                    </div>
                                </div>
                                <div className="flex items-center gap-1.5 shrink-0">
                                    {item.tags.map(tag => (
                                        <span key={tag} className={`${geistMono.className} text-[9px] text-zinc-600 px-2 py-0.5 rounded-md border`} style={{ borderColor: "var(--surface-border)" }}>{tag}</span>
                                    ))}
                                </div>
                                <ChevronRight size={14} className="text-zinc-700 opacity-0 group-hover:opacity-100 transition-opacity shrink-0" />
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </WorkspaceLayout>
    );
}
