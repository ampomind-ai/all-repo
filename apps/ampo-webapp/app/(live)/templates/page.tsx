"use client";

import React from "react";
import WorkspaceLayout from "../components/workspace-layout";
import { Funnel_Display, Geist_Mono } from "next/font/google";
import { ClipboardList, MessageSquare, Zap, BookOpen, Pen, Code, GraduationCap, Scale, Film, ArrowRight } from "lucide-react";

const funnelDisplay = Funnel_Display({ subsets: ["latin"], weight: ["400", "500", "600", "700", "800"] });
const geistMono = Geist_Mono({ subsets: ["latin"] });

const CATEGORIES = [
    {
        name: "Research", icon: BookOpen, color: "from-cyan-500/20 to-blue-500/20",
        templates: [
            { title: "Paper Analysis", description: "Extract abstract, methodology, results, limitations, and critique from a research paper" },
            { title: "Literature Review", description: "Compare multiple papers and synthesize findings into a structured review" },
            { title: "Hypothesis Generator", description: "Generate testable hypotheses from a research question or observation" },
        ]
    },
    {
        name: "Content Creation", icon: Pen, color: "from-purple-500/20 to-pink-500/20",
        templates: [
            { title: "X Thread Builder", description: "Turn any insight into a structured, engaging X thread with hooks and CTAs" },
            { title: "LinkedIn Post", description: "Professional storytelling post with hook, body, and call-to-action" },
            { title: "Newsletter Draft", description: "Weekly newsletter structure with intro, sections, and sign-off" },
            { title: "Blog Post Outline", description: "SEO-optimized blog post structure from a topic or summary" },
        ]
    },
    {
        name: "Video & Media", icon: Film, color: "from-amber-500/20 to-orange-500/20",
        templates: [
            { title: "YouTube Summary", description: "Full video breakdown: chapters, key insights, actionable takeaways" },
            { title: "Podcast Notes", description: "Extract key moments, quotes, and action items from a podcast episode" },
            { title: "Lecture Notes", description: "Structured notes with concepts, examples, and review questions" },
        ]
    },
    {
        name: "Coding", icon: Code, color: "from-emerald-500/20 to-teal-500/20",
        templates: [
            { title: "Code Review", description: "Analyze code for bugs, performance issues, and best practices" },
            { title: "Architecture Design", description: "Design system architecture from requirements with component diagrams" },
            { title: "Debug Assistant", description: "Step-by-step debugging workflow with hypothesis testing" },
        ]
    },
    {
        name: "Study", icon: GraduationCap, color: "from-rose-500/20 to-pink-500/20",
        templates: [
            { title: "Flashcard Generator", description: "Create spaced-repetition flashcards from any content or notes" },
            { title: "Concept Explainer", description: "Break down complex topics using analogies and layered explanations" },
            { title: "Exam Prep", description: "Generate practice questions and answers from study material" },
        ]
    },
    {
        name: "Comparison", icon: Scale, color: "from-sky-500/20 to-indigo-500/20",
        templates: [
            { title: "Source Comparison Matrix", description: "Compare multiple sources side-by-side with contradictions and patterns" },
            { title: "Pros & Cons Analysis", description: "Structured decision support with weighted criteria analysis" },
        ]
    },
];

export default function TemplatesPage() {
    return (
        <WorkspaceLayout>
            <div className="max-w-5xl mx-auto py-10 px-8">
                <div className="mb-8">
                    <h1 className={`${funnelDisplay.className} text-[28px] font-bold text-zinc-100`}>Templates</h1>
                    <p className="text-[14px] text-zinc-500 mt-1">Pre-built workflows to accelerate your thinking</p>
                </div>

                <div className="space-y-10">
                    {CATEGORIES.map(cat => (
                        <div key={cat.name}>
                            <div className="flex items-center gap-2.5 mb-4">
                                <div className={`size-7 rounded-lg bg-gradient-to-br ${cat.color} flex items-center justify-center`}>
                                    <cat.icon size={14} className="text-zinc-300" />
                                </div>
                                <h2 className="text-[16px] font-semibold text-zinc-200">{cat.name}</h2>
                                <span className={`${geistMono.className} text-[10px] text-zinc-700`}>{cat.templates.length}</span>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                                {cat.templates.map(tpl => (
                                    <button key={tpl.title} className="group text-left p-4 rounded-xl border transition-all hover:border-zinc-700/40" style={{ background: "var(--surface-2)", borderColor: "var(--surface-border)" }}>
                                        <h3 className="text-[14px] font-semibold text-zinc-200 mb-1 flex items-center justify-between">
                                            {tpl.title}
                                            <ArrowRight size={13} className="text-zinc-700 opacity-0 group-hover:opacity-100 transition-opacity" />
                                        </h3>
                                        <p className="text-[12px] text-zinc-500 leading-relaxed">{tpl.description}</p>
                                    </button>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </WorkspaceLayout>
    );
}
