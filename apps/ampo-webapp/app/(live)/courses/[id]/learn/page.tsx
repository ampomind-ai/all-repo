"use client";

import React, { useRef, useEffect, useState } from "react";
import { Funnel_Display, Geist_Mono } from "next/font/google";
import { ArrowLeft, Mic, Settings2, Maximize2, X, MessageSquare, PlayCircle, PauseCircle, ChevronRight, PenTool } from "lucide-react";
import { Button } from "ui";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useScriblMotion } from "@scriblmotion/react";
import demoSceneData from "./demo-scene.json";

const funnelDisplay = Funnel_Display({ subsets: ["latin"], weight: ["400", "500", "600", "700", "800"] });
const geistMono = Geist_Mono({ subsets: ["latin"] });

// Mock course data to represent what's being learned
const COURSE_INFO = {
    title: "Deep Learning Specialization",
    module: "Convolutional Neural Networks",
    platform: "Coursera"
};

export default function CourseLearnWorkspace() {
    const params = useParams();
    const id = params.id as string;

    const [isPlayingVideo, setIsPlayingVideo] = useState(false);
    const [isListening, setIsListening] = useState(false);

    // Initialize ScriblMotion
    const { containerRef, loadScene, play, pause } = useScriblMotion({
        autoPlay: true,
    });

    useEffect(() => {
        // Type assertion needed because imported JSON doesn't exactly match the internal core types, 
        // but it is structurally valid for this demo scene.
        loadScene(demoSceneData as any);
    }, [loadScene]);

    // Mock voice chat history
    const chatHistory = [
        { role: "assistant", text: "Welcome back! Ready to continue with Convolutional Neural Networks? We left off at stride and padding." },
        { role: "user", text: "Can you remind me what padding does again?" },
        { role: "assistant", text: "Sure. Padding adds extra pixels—usually zeros—around the border of an image. This prevents the image from shrinking after a convolution operation, and preserves info at the edges." }
    ];

    return (
        <div className="flex h-screen w-full bg-[#0a0a0b] text-zinc-200 overflow-hidden font-sans">

            {/* 1. LEFT PANE: AI Voice Chat Tutor (25%) */}
            <div className="w-1/4 h-full border-r border-zinc-800/50 flex flex-col bg-[#0d0d0f] relative z-10 shadow-2xl">
                {/* Header */}
                <div className="h-14 flex items-center justify-between px-4 border-b border-zinc-800/50 shrink-0">
                    <div className="flex items-center gap-3">
                        <Link href={`/courses/${id}`}>
                            <Button variant="ghost" size="icon-sm" className="h-8 w-8 text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/50">
                                <ArrowLeft size={16} />
                            </Button>
                        </Link>
                        <h2 className="text-[13px] font-semibold text-zinc-200 flex items-center gap-2">
                            <div className="size-2 rounded-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)] animate-pulse" />
                            Tutor Active
                        </h2>
                    </div>
                    <Button variant="ghost" size="icon-sm" className="h-8 w-8 text-zinc-500 hover:text-zinc-300">
                        <Settings2 size={16} />
                    </Button>
                </div>

                {/* Chat Log */}
                <div className="flex-1 overflow-y-auto p-5 space-y-6">
                    {chatHistory.map((msg, i) => (
                        <div key={i} className={`flex flex-col gap-1.5 ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
                            <div className="flex items-center gap-2 mb-1">
                                {msg.role === 'assistant' && <div className="size-5 rounded-md bg-indigo-500/20 text-indigo-400 flex items-center justify-center text-[10px] border border-indigo-500/30">AI</div>}
                                <span className={`${geistMono.className} text-[10px] text-zinc-500 uppercase tracking-widest`}>{msg.role}</span>
                            </div>
                            <div className={`p-3.5 rounded-2xl text-[13.5px] leading-relaxed max-w-[90%] shadow-sm ${msg.role === 'user'
                                ? 'bg-zinc-800 text-zinc-200 rounded-tr-sm'
                                : 'bg-zinc-900 border border-zinc-800/50 text-zinc-300 rounded-tl-sm'
                                }`}>
                                {msg.text}
                            </div>
                        </div>
                    ))}
                    <div className="h-4" /> {/* Spacer */}
                </div>

                {/* Voice Interaction Bottom Bar */}
                <div className="p-5 border-t border-zinc-800/50 bg-[#0a0a0b]/80 backdrop-blur-md shrink-0">
                    {/* Animated Waveform Mock */}
                    <div className="h-12 flex items-center justify-center gap-1 mb-4">
                        {[...Array(24)].map((_, i) => (
                            <div
                                key={i}
                                className={`w-1 rounded-full ${isListening ? 'bg-indigo-400' : 'bg-zinc-700'}`}
                                style={{
                                    height: isListening ? `${10 + Math.random() * 24}px` : '4px',
                                    transition: isListening ? 'height 0.1s ease' : 'height 0.3s ease'
                                }}
                            />
                        ))}
                    </div>
                    <Button
                        onClick={() => setIsListening(!isListening)}
                        className={`w-full h-11 rounded-xl flex items-center justify-center gap-2 font-medium transition-all ${isListening
                            ? 'bg-red-500/10 text-red-500 hover:bg-red-500/20 border border-red-500/30 shadow-[0_0_20px_rgba(239,68,68,0.1)]'
                            : 'bg-indigo-500 hover:bg-indigo-600 text-white shadow-lg shadow-indigo-500/20'
                            }`}
                    >
                        {isListening ? (
                            <><PauseCircle size={18} /> Stop Listening</>
                        ) : (
                            <><Mic size={18} /> Hold to Speak</>
                        )}
                    </Button>
                </div>
            </div>

            {/* 2. CENTER PANE: Video Player (45%) */}
            <div className="w-[45%] h-full flex flex-col bg-black">
                {/* Header Overlay (Hover reveal in real app) */}
                <div className="h-14 flex items-center justify-between px-6 shrink-0 bg-gradient-to-b from-black/80 to-transparent">
                    <h1 className="text-[14px] font-medium text-white/90 truncate mr-4">
                        {COURSE_INFO.module}
                    </h1>
                    <span className={`${geistMono.className} text-[10px] text-white/50 uppercase tracking-wider shrink-0`}>
                        {COURSE_INFO.platform}
                    </span>
                </div>

                {/* Video Area Mock */}
                <div className="flex-1 relative flex items-center justify-center group cursor-pointer" onClick={() => setIsPlayingVideo(!isPlayingVideo)}>
                    {/* Placeholder content grid */}
                    <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '32px 32px' }} />

                    {/* Fake Video Thumbnail / Abstract Art */}
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-900/20 via-black to-purple-900/20 flex items-center justify-center">
                        <div className="size-64 rounded-full border border-white/5 opacity-50 flex items-center justify-center relative">
                            <div className="absolute inset-4 rounded-full border border-white/10" />
                            <div className="absolute inset-12 rounded-full border border-indigo-500/20 block" />
                        </div>
                    </div>

                    <div className={`size-16 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/20 transition-transform ${isPlayingVideo ? 'scale-0 opacity-0' : 'scale-100 opacity-100 group-hover:bg-white/20'}`}>
                        <PlayCircle size={32} className="text-white ml-1" />
                    </div>
                </div>

                {/* Video Controls Mock */}
                <div className="h-16 px-6 flex flex-col justify-center bg-gradient-to-t from-black/90 to-transparent">
                    {/* Scrub Bar */}
                    <div className="h-1 w-full bg-white/20 rounded-full mb-3 cursor-pointer relative group">
                        <div className="absolute left-0 top-0 h-full w-[28%] bg-indigo-500 rounded-full group-hover:bg-indigo-400">
                            <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 size-3 bg-white rounded-full scale-0 group-hover:scale-100 transition-transform shadow-lg" />
                        </div>
                    </div>
                    {/* Buttons */}
                    <div className="flex items-center justify-between text-white/70">
                        <div className="flex items-center gap-4">
                            <button onClick={() => setIsPlayingVideo(!isPlayingVideo)} className="hover:text-white transition-colors">
                                {isPlayingVideo ? <PauseCircle size={20} /> : <PlayCircle size={20} />}
                            </button>
                            <span className={`${geistMono.className} text-[11px]`}>14:23 / 52:10</span>
                        </div>
                        <div className="flex items-center gap-4">
                            <button className="hover:text-white transition-colors"><Settings2 size={16} /></button>
                            <button className="hover:text-white transition-colors"><Maximize2 size={16} /></button>
                        </div>
                    </div>
                </div>
            </div>

            {/* 3. RIGHT PANE: ScriblMotion Interactive Space (30%) */}
            <div className="w-[30%] h-full border-l border-zinc-800/50 flex flex-col bg-[#0a0a0b] relative">

                {/* Header */}
                <div className="h-14 px-5 border-b border-zinc-800/50 flex items-center justify-between bg-zinc-900/40">
                    <h3 className="text-[13px] font-semibold text-zinc-200 flex items-center gap-2">
                        <div className="size-5 rounded bg-pink-500/20 text-pink-400 flex items-center justify-center border border-pink-500/30">
                            <PenTool size={11} />
                        </div>
                        Interactive Sandbox
                    </h3>
                    <div className="flex items-center gap-1">
                        <Button variant="ghost" size="icon-sm" className="h-7 w-7 text-zinc-500 hover:text-zinc-300">
                            <ArrowLeft size={14} />
                        </Button>
                        <Button variant="ghost" size="icon-sm" className="h-7 w-7 text-zinc-500 hover:text-zinc-300">
                            <ChevronRight size={14} />
                        </Button>
                    </div>
                </div>

                {/* ScriblMotion Engine Container */}
                <div className="flex-1 relative overflow-hidden flex flex-col">
                    <div className="absolute inset-0 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at 10px 10px, rgba(255,255,255,0.03) 1px, transparent 0)', backgroundSize: '40px 40px' }} />

                    {/* Engine Mount Point */}
                    <div ref={containerRef} className="absolute inset-0 w-full h-full cursor-crosshair mix-blend-screen" />

                    {/* Overlay Instruction */}
                    <div className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-black/60 backdrop-blur-md px-4 py-2 rounded-full border border-white/10 shadow-xl pointer-events-none">
                        <p className={`${geistMono.className} text-[10px] text-zinc-400 uppercase tracking-widest text-center flex items-center gap-2`}>
                            <div className="size-1.5 rounded-full bg-pink-500 animate-pulse" /> Try dragging the vector head
                        </p>
                    </div>
                </div>

            </div>

        </div>
    );
}
