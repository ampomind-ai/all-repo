"use client";

import React, { useState } from "react";
import WorkspaceLayout from "../components/workspace-layout";
import { Funnel_Display, Geist_Mono } from "next/font/google";
import { Pin, ExternalLink, Clock, FileText, Film, BookOpen, MoreHorizontal, LayoutTemplate, Code, PenTool } from "lucide-react";
import Link from "next/link";
import { Button, Input, Label, Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger, Textarea } from "ui";

const funnelDisplay = Funnel_Display({ subsets: ["latin"], weight: ["400", "500", "600", "700", "800"] });
const geistMono = Geist_Mono({ subsets: ["latin"] });

const PROJECTS = [
    { id: "1", title: "AI Research Thesis", description: "RAG vs Fine-tuning deep dive for domain-specific QA systems", icon: BookOpen, sessions: 14, highlights: 23, lastAccessed: "2 hours ago", color: "from-cyan-500/20 to-blue-500/20" },
    { id: "2", title: "YouTube Course Notes", description: "Consolidated notes from Andrej Karpathy's neural nets series", icon: Film, sessions: 8, highlights: 15, lastAccessed: "Yesterday", color: "from-purple-500/20 to-pink-500/20" },
    { id: "3", title: "Product Launch Content", description: "X threads, LinkedIn posts, and blog drafts for AmpoMind launch", icon: FileText, sessions: 6, highlights: 9, lastAccessed: "Feb 18", color: "from-emerald-500/20 to-teal-500/20" },
];

export default function ProjectsPage() {
    const [open, setOpen] = useState(false);

    return (
        <WorkspaceLayout>
            <div className="max-w-4xl mx-auto py-10 px-8">
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className={`${funnelDisplay.className} text-[28px] font-bold text-zinc-100`}>Pinned Projects</h1>
                        <p className="text-[14px] text-zinc-500 mt-1">Organized workspaces for focused research</p>
                    </div>
                    <Dialog open={open} onOpenChange={setOpen}>
                        <DialogTrigger asChild>
                            <Button variant="outline" className="h-8 px-4 border-zinc-700/50 bg-zinc-800/20 hover:bg-zinc-800/50 text-[12px] font-medium text-zinc-200 transition-colors rounded-lg">
                                <Pin size={13} className="mr-1" /> New Project
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[425px]">
                            <DialogHeader>
                                <DialogTitle>Create New Project</DialogTitle>
                                <DialogDescription>
                                    Set up a new workspace for your research and content.
                                </DialogDescription>
                            </DialogHeader>
                            <div className="grid gap-5 py-4">
                                <div className="grid gap-2">
                                    <Label htmlFor="name" className="text-zinc-400">
                                        Name
                                    </Label>
                                    <Input
                                        id="name"
                                        placeholder="Project title..."
                                        className="bg-zinc-900 border-zinc-800"
                                    />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="description" className="text-zinc-400">
                                        Description
                                    </Label>
                                    <Textarea
                                        id="description"
                                        placeholder="What is this project about?"
                                        className="resize-none min-h-[80px] bg-zinc-900 border-zinc-800"
                                    />
                                </div>
                                <div className="grid gap-2">
                                    <Label className="text-zinc-400">
                                        Icon
                                    </Label>
                                    <div className="flex gap-2">
                                        {/* A few dummy icon selectors */}
                                        {[BookOpen, Code, Film, PenTool, LayoutTemplate].map((Icon, i) => (
                                            <button key={i} className="size-10 rounded-lg flex items-center justify-center border border-zinc-800 bg-zinc-900 hover:bg-zinc-800 hover:border-zinc-700 transition-colors">
                                                <Icon size={16} className="text-zinc-400" />
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>
                            <DialogFooter>
                                <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
                                <Button onClick={() => setOpen(false)}>Create Project</Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {PROJECTS.map(project => (
                        <Link href={`/projects/${project.id}`} key={project.id} className="block group rounded-xl border p-5 transition-all cursor-pointer hover:border-zinc-700/40" style={{ background: "var(--surface-2)", borderColor: "var(--surface-border)" }}>
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
                                <Button variant="ghost" size="sm" className="flex-1 h-7 text-[11px] font-medium text-zinc-500 hover:text-zinc-200 rounded-md hover:bg-zinc-800/20 transition-colors" onClick={(e) => e.preventDefault()}>Open</Button>
                                <Button variant="ghost" size="icon" className="h-7 w-7 rounded-md hover:bg-zinc-800/20 text-zinc-600 hover:text-zinc-300 transition-colors" onClick={(e) => e.preventDefault()}><ExternalLink size={13} /></Button>
                                <Button variant="ghost" size="icon" className="h-7 w-7 rounded-md hover:bg-zinc-800/20 text-zinc-600 hover:text-zinc-300 transition-colors" onClick={(e) => e.preventDefault()}><MoreHorizontal size={13} /></Button>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </WorkspaceLayout>
    );
}
