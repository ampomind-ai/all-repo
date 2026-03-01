"use client";

import React from "react";
import WorkspaceLayout from "../../components/workspace-layout";
import { Funnel_Display, Geist_Mono } from "next/font/google";
import { ArrowLeft, BookOpen, CheckCircle2, Clock, PlayCircle, FileText, ChevronRight, PenTool } from "lucide-react";
import { Button } from "ui";
import Link from "next/link";
import { useParams } from "next/navigation";

const funnelDisplay = Funnel_Display({ subsets: ["latin"], weight: ["400", "500", "600", "700", "800"] });
const geistMono = Geist_Mono({ subsets: ["latin"] });

const PLATFORMS: Record<string, string> = {
    "Coursera": "text-blue-400 bg-blue-500/10 border-blue-500/20",
    "Udemy": "text-purple-400 bg-purple-500/10 border-purple-500/20",
    "YouTube": "text-red-400 bg-red-500/10 border-red-500/20",
    "edX": "text-emerald-400 bg-emerald-500/10 border-emerald-500/20",
};

// Mock data to match the courses index page
const COURSES: Record<string, any> = {
    "1": {
        title: "Deep Learning Specialization",
        instructor: "Andrew Ng",
        platform: "Coursera",
        progress: 68,
        totalModules: 5,
        completedModules: 3,
        currentModule: "Convolutional Neural Networks",
        notes: 24,
        highlights: 15,
        status: "In Progress",
        modules: [
            { title: "Neural Networks and Deep Learning", status: "completed", duration: "4h 15m" },
            { title: "Improving Deep Neural Networks", status: "completed", duration: "3h 45m" },
            { title: "Structuring Machine Learning Projects", status: "completed", duration: "2h 30m" },
            { title: "Convolutional Neural Networks", status: "in-progress", duration: "5h 10m" },
            { title: "Sequence Models", status: "locked", duration: "4h 50m" },
        ]
    },
    "2": {
        title: "The Complete Web Developer Bootcamp",
        instructor: "Colt Steele",
        platform: "Udemy",
        progress: 42,
        totalModules: 12,
        completedModules: 5,
        currentModule: "Advanced CSS & Sass",
        notes: 18,
        highlights: 9,
        status: "In Progress",
        modules: [
            { title: "HTML Basics", status: "completed", duration: "1h 20m" },
            { title: "CSS Fundamentals", status: "completed", duration: "2h 45m" },
            { title: "JavaScript Control Flow", status: "completed", duration: "3h 10m" },
            { title: "DOM Manipulation", status: "completed", duration: "4h 00m" },
            { title: "Async JS & APIs", status: "completed", duration: "2h 50m" },
            { title: "Advanced CSS & Sass", status: "in-progress", duration: "3h 30m" },
            { title: "React Basics", status: "locked", duration: "5h 00m" },
        ]
    }
};

export default function CourseWorkspace() {
    const params = useParams();
    const id = params.id as string;
    const course = COURSES[id] || {
        title: "Untitled Course",
        instructor: "Unknown",
        platform: "Unknown",
        progress: 0,
        totalModules: 0,
        completedModules: 0,
        status: "Not Started",
        modules: []
    };

    const platColor = PLATFORMS[course.platform] || "text-zinc-400 bg-zinc-500/10 border-zinc-500/20";

    return (
        <WorkspaceLayout>
            <div className="max-w-5xl mx-auto py-8 px-6">
                {/* Header */}
                <div className="mb-8 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Link href="/courses">
                            <Button variant="ghost" size="icon-sm" className="h-8 w-8 text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/30">
                                <ArrowLeft size={16} />
                            </Button>
                        </Link>
                        <div>
                            <div className="flex items-center gap-2 mb-1">
                                <h1 className={`${funnelDisplay.className} text-[22px] font-bold text-zinc-100`}>
                                    {course.title}
                                </h1>
                                <span className={`${geistMono.className} text-[10px] uppercase px-2 py-0.5 rounded-md border shrink-0 ${platColor}`}>{course.platform}</span>
                            </div>
                            <p className="text-[13px] text-zinc-500">by {course.instructor}</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        <Link href={`/courses/${id}/learn`}>
                            <Button className="h-8 px-4 text-[12px] font-medium transition-colors rounded-md bg-zinc-100 text-zinc-900 hover:bg-white delay-0">
                                <PlayCircle size={14} className="mr-1.5" /> Continue Learning
                            </Button>
                        </Link>
                    </div>
                </div>

                {/* Main Content Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Left Column: Progress & Modules */}
                    <div className="md:col-span-2 space-y-6">

                        {/* Progress Tracker */}
                        <div className="p-6 rounded-xl border bg-zinc-900/30 border-zinc-800/60">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-[15px] font-semibold text-zinc-200">Course Progress</h3>
                                <span className={`${geistMono.className} text-[18px] font-bold text-emerald-400`}>{course.progress}%</span>
                            </div>
                            <div className="h-2 bg-zinc-800 rounded-full overflow-hidden mb-3">
                                <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${course.progress}%` }} />
                            </div>
                            <p className={`${geistMono.className} text-[11px] text-zinc-500`}>
                                {course.completedModules} of {course.totalModules} modules completed
                            </p>
                        </div>

                        {/* Modules List */}
                        <div className="rounded-xl border flex flex-col overflow-hidden bg-zinc-900/10 border-zinc-800/60">
                            <div className="px-5 py-4 border-b border-zinc-800/50 bg-zinc-900/40">
                                <h3 className="text-[14px] font-semibold text-zinc-200 flex items-center gap-2">
                                    <BookOpen size={16} className="text-zinc-400" /> Syllabus Modules
                                </h3>
                            </div>
                            <div className="divide-y divide-zinc-800/40">
                                {course.modules.map((mod: any, i: number) => (
                                    <div key={i} className={`p-4 flex items-center gap-4 transition-colors ${mod.status === 'in-progress' ? 'bg-zinc-800/30' : 'hover:bg-zinc-800/20'}`}>
                                        <div className="shrink-0 flex items-center justify-center size-6">
                                            {mod.status === 'completed' ? (
                                                <CheckCircle2 size={18} className="text-emerald-500" />
                                            ) : mod.status === 'in-progress' ? (
                                                <PlayCircle size={18} className="text-indigo-400 drop-shadow-md" />
                                            ) : (
                                                <div className="size-2 rounded-full bg-zinc-700" />
                                            )}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <h4 className={`text-[14px] font-medium truncate ${mod.status === 'locked' ? 'text-zinc-600' : 'text-zinc-200'}`}>
                                                {i + 1}. {mod.title}
                                            </h4>
                                        </div>
                                        <div className="shrink-0 flex items-center gap-3">
                                            <span className={`${geistMono.className} text-[11px] text-zinc-600`}>{mod.duration}</span>
                                            {mod.status !== 'locked' && (
                                                <Button variant="ghost" size="icon-sm" className="h-6 w-6 text-zinc-500 hover:text-zinc-200">
                                                    <ChevronRight size={14} />
                                                </Button>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                    </div>

                    {/* Right Column: AI Notes & Resources */}
                    <div className="space-y-6">
                        <div className="p-5 rounded-xl border bg-gradient-to-br from-indigo-500/5 to-purple-500/5 border-indigo-500/20">
                            <h3 className="text-[14px] font-medium text-indigo-400 mb-3 flex items-center gap-1.5">
                                <PenTool size={14} /> AI Notes Generated
                            </h3>
                            <div className="flex flex-col gap-3">
                                <div className="flex items-center justify-between bg-black/20 p-3 rounded-lg border border-black/10">
                                    <span className={`${geistMono.className} text-[12px] text-zinc-400 flex items-center gap-2`}>
                                        <FileText size={12} className="text-zinc-500" /> Transcripts
                                    </span>
                                    <span className={`${geistMono.className} text-[12px] font-medium text-zinc-200`}>{course.notes}</span>
                                </div>
                                <div className="flex items-center justify-between bg-black/20 p-3 rounded-lg border border-black/10">
                                    <span className={`${geistMono.className} text-[12px] text-zinc-400 flex items-center gap-2`}>
                                        <BookOpen size={12} className="text-zinc-500" /> Concept Summaries
                                    </span>
                                    <span className={`${geistMono.className} text-[12px] font-medium text-zinc-200`}>{course.highlights}</span>
                                </div>
                            </div>
                            <Button className="w-full mt-4 h-8 bg-zinc-800/40 hover:bg-zinc-800/60 border border-zinc-700/50 text-zinc-300 text-[12px]">
                                Open Course Notebook
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </WorkspaceLayout>
    );
}
