"use client";

import React, { useState } from "react";
import WorkspaceLayout from "../components/workspace-layout";
import { Funnel_Display, Geist_Mono } from "next/font/google";
import { PlayCircle, Clock, CheckCircle2, BookOpen, ExternalLink, Sparkles, Plus } from "lucide-react";
import { Button } from "ui";

const funnelDisplay = Funnel_Display({ subsets: ["latin"], weight: ["400", "500", "600", "700", "800"] });
const geistMono = Geist_Mono({ subsets: ["latin"] });

const PLATFORMS = [
    { name: "Coursera", color: "text-blue-400 bg-blue-500/10 border-blue-500/20" },
    { name: "Udemy", color: "text-purple-400 bg-purple-500/10 border-purple-500/20" },
    { name: "YouTube", color: "text-red-400 bg-red-500/10 border-red-500/20" },
    { name: "edX", color: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20" },
];

const COURSES = [
    { id: "1", title: "Deep Learning Specialization", instructor: "Andrew Ng", platform: "Coursera", progress: 68, totalModules: 5, completedModules: 3, currentModule: "Convolutional Neural Networks", notes: 24, highlights: 15, lastStudied: "2 hours ago", status: "In Progress" },
    { id: "2", title: "The Complete Web Developer Bootcamp", instructor: "Colt Steele", platform: "Udemy", progress: 42, totalModules: 12, completedModules: 5, currentModule: "Advanced CSS & Sass", notes: 18, highlights: 9, lastStudied: "Yesterday", status: "In Progress" },
    { id: "3", title: "Neural Networks: Zero to Hero", instructor: "Andrej Karpathy", platform: "YouTube", progress: 85, totalModules: 8, completedModules: 7, currentModule: "Building GPT from Scratch", notes: 31, highlights: 22, lastStudied: "Feb 18", status: "In Progress" },
    { id: "4", title: "Machine Learning for Trading", instructor: "Georgia Tech", platform: "edX", progress: 100, totalModules: 4, completedModules: 4, currentModule: "Completed", notes: 12, highlights: 8, lastStudied: "Feb 15", status: "Completed" },
    { id: "5", title: "Stanford CS229: Machine Learning", instructor: "Andrew Ng", platform: "YouTube", progress: 25, totalModules: 20, completedModules: 5, currentModule: "Logistic Regression", notes: 8, highlights: 4, lastStudied: "Feb 14", status: "In Progress" },
];

export default function CoursesPage() {
    const [filter, setFilter] = useState<string>("all");
    const filtered = filter === "all" ? COURSES : COURSES.filter(c => c.platform === filter || (filter === "completed" ? c.status === "Completed" : false));

    const totalNotes = COURSES.reduce((a, c) => a + c.notes, 0);
    const avgProgress = Math.round(COURSES.reduce((a, c) => a + c.progress, 0) / COURSES.length);

    return (
        <WorkspaceLayout>
            <div className="max-w-5xl mx-auto py-10 px-8">
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className={`${funnelDisplay.className} text-[28px] font-bold text-zinc-100`}>Course Notes</h1>
                        <p className="text-[14px] text-zinc-500 mt-1">AI-generated summaries and highlights from video courses</p>
                    </div>
                    <Button variant="outline" className="h-8 px-4 bg-zinc-800/20 hover:bg-zinc-800/40 border-zinc-700/50 text-[12px] font-medium text-zinc-200 transition-colors rounded-lg">
                        <Plus size={13} className="mr-1" /> New Course
                    </Button>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-4 gap-3 mb-8">
                    {[
                        { label: "Active Courses", value: COURSES.filter(c => c.status !== "Completed").length, icon: BookOpen },
                        { label: "Avg Progress", value: `${avgProgress}%`, icon: PlayCircle }, // Changed icon from CircleDot to PlayCircle
                        { label: "Total Notes", value: totalNotes, icon: BookOpen }, // Changed icon from FileText to BookOpen
                        { label: "Completed", value: COURSES.filter(c => c.status === "Completed").length, icon: CheckCircle2 },
                    ].map(stat => (
                        <div key={stat.label} className="p-4 rounded-xl border" style={{ background: "var(--surface-2)", borderColor: "var(--surface-border)" }}>
                            <div className="flex items-center gap-2 mb-2">
                                <stat.icon size={14} className="text-zinc-500" />
                                <span className={`${geistMono.className} text-[10px] text-zinc-600 uppercase tracking-wider`}>{stat.label}</span>
                            </div>
                            <span className="text-[22px] font-bold text-zinc-200">{stat.value}</span>
                        </div>
                    ))}
                </div>

                {/* Filters */}
                <div className="flex items-center gap-2 mb-6">
                    <Button variant="ghost" size="sm" onClick={() => setFilter("all")} className={`h-7 px-3 text-[11px] font-medium transition-colors ${filter === "all" ? "bg-zinc-800/40 text-zinc-200" : "text-zinc-500 hover:text-zinc-300"} `}>All</Button>
                    {PLATFORMS.map(p => (
                        <Button variant="ghost" size="sm" key={p.name} onClick={() => setFilter(p.name)} className={`h-7 px-3 text-[11px] font-medium transition-colors ${filter === p.name ? "bg-zinc-800/40 text-zinc-200" : "text-zinc-500 hover:text-zinc-300"} `}>{p.name}</Button>
                    ))}
                    <Button variant="ghost" size="sm" onClick={() => setFilter("completed")} className={`h-7 px-3 text-[11px] font-medium transition-colors ${filter === "completed" ? "bg-zinc-800/40 text-zinc-200" : "text-zinc-500 hover:text-zinc-300"} `}>Completed</Button>
                </div>

                {/* Course cards */}
                <div className="space-y-3">
                    {filtered.map(course => {
                        const platInfo = PLATFORMS.find(p => p.name === course.platform);
                        return (
                            <div key={course.id} className="group rounded-xl border p-5 transition-all cursor-pointer hover:border-zinc-700/40" style={{ background: "var(--surface-2)", borderColor: "var(--surface-border)" }}>
                                <div className="flex items-start gap-4">
                                    {/* Icon */}
                                    <div className="size-12 rounded-xl flex items-center justify-center shrink-0" style={{ background: "var(--surface-3)" }}>
                                        <BookOpen size={22} className="text-zinc-400" /> {/* Changed icon from GraduationCap to BookOpen */}
                                    </div>

                                    <div className="flex-1 min-w-0">
                                        {/* Title row */}
                                        <div className="flex items-center gap-2 mb-1">
                                            <h3 className="text-[15px] font-semibold text-zinc-200 truncate">{course.title}</h3>
                                            <span className={`${geistMono.className} text-[9px] uppercase px-2 py-0.5 rounded-md border shrink-0 ${platInfo?.color} `}>{course.platform}</span>
                                            {course.status === "Completed" && (
                                                <span className={`${geistMono.className} text-[9px] text-emerald-400 uppercase px-2 py-0.5 rounded-md bg-emerald-500 / 10 border border-emerald-500 / 20 shrink-0 flex items-center gap-1`}><CheckCircle2 size={9} /> Done</span>
                                            )}
                                        </div>
                                        <p className="text-[12px] text-zinc-600 mb-3">by {course.instructor}</p>

                                        {/* Progress bar */}
                                        <div className="flex items-center gap-3 mb-3">
                                            <div className="flex-1 h-1.5 bg-zinc-900 rounded-full overflow-hidden">
                                                <div
                                                    className={`h-full rounded-full transition-all ${course.progress === 100 ? "bg-gradient-to-r from-emerald-500 to-green-400" : "bg-gradient-to-r from-cyan-500 to-purple-500"} `}
                                                    style={{ width: `${course.progress}%` }}
                                                />
                                            </div>
                                            <span className={`${geistMono.className} text-[11px] font-bold ${course.progress === 100 ? "text-emerald-400" : "text-zinc-400"} `}>{course.progress}%</span>
                                        </div>

                                        {/* Meta */}
                                        <div className="flex items-center gap-4 flex-wrap">
                                            <span className={`${geistMono.className} text-[10px] text-zinc-600 flex items-center gap-1`}><BookOpen size={10} /> {course.completedModules}/{course.totalModules} modules</span> {/* Changed icon from ListChecks to BookOpen */}
                                            {course.status !== "Completed" && (
                                                <span className="text-[10px] text-zinc-500 flex items-center gap-1"><PlayCircle size={9} /> {course.currentModule}</span>
                                            )}
                                            <span className={`${geistMono.className} text-[10px] text-zinc-600`}>{course.notes} notes</span>
                                            <span className={`${geistMono.className} text-[10px] text-zinc-600`}>{course.highlights} highlights</span>
                                            <span className={`${geistMono.className} text-[10px] text-zinc-700 flex items-center gap-1`}><Clock size={10} /> {course.lastStudied}</span>
                                        </div>
                                    </div>
                                </div>
                                {/* Actions */}
                                <div className="flex items-center justify-between mt-auto pt-4 border-t border-zinc-800/50">
                                    <Button variant="ghost" size="sm" className="h-7 px-3 text-[11px] font-medium text-zinc-500 hover:text-zinc-200 hover:bg-zinc-800/20 transition-colors"><Sparkles size={12} className="mr-1.5" /> AI Notes</Button>
                                    <Button variant="ghost" size="sm" className="h-7 px-3 text-[11px] font-medium text-zinc-500 hover:text-zinc-200 hover:bg-zinc-800/20 transition-colors"><ExternalLink size={12} className="mr-1.5" /> Open</Button>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </WorkspaceLayout>
    );
}
