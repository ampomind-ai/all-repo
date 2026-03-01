"use client";

import React from "react";
import { Funnel_Display, Geist_Mono } from "next/font/google";
import { ArrowLeft, BookOpen, Layers, Zap, Code } from "lucide-react";
import Link from "next/link";
import { Button } from "ui";

const funnelDisplay = Funnel_Display({ subsets: ["latin"], weight: ["300", "400", "500", "600", "700", "800"] });
const geistMono = Geist_Mono({ subsets: ["latin"] });

export default function WhitepaperPage() {
    return (
        <div className="min-h-screen bg-background text-foreground font-sans antialiased overflow-hidden relative selection:bg-cyan-500/30">

            {/* Background Gradients */}
            <div className="fixed inset-0 pointer-events-none z-0">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-[500px] bg-cyan-900/10 rounded-full blur-[150px] opacity-50" />
            </div>

            {/* Navigation */}
            <header className="sticky top-0 z-40 w-full backdrop-blur-xl border-b border-zinc-900/50 bg-background/80 px-6 py-4">
                <div className="max-w-4xl mx-auto flex items-center justify-between">
                    <Link href="/coming-soon" className="group flex items-center gap-2 text-zinc-400 hover:text-cyan-400 transition-colors">
                        <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
                        <span className={`${geistMono.className} text-sm tracking-wide`}>Back</span>
                    </Link>
                    <div className="flex items-center gap-2">
                        <span className={`${funnelDisplay.className} text-lg font-bold tracking-tight text-white`}>Ampo<span className="text-zinc-500">Mind</span></span>
                        <span className="px-2 py-0.5 rounded text-[10px] uppercase font-bold bg-zinc-800 text-zinc-400 ml-2">Whitepaper v1.0</span>
                    </div>
                </div>
            </header>

            {/* Content */}
            <main className="relative z-10 w-full max-w-3xl mx-auto px-6 py-16 md:py-24">

                <header className="mb-16 border-b border-zinc-800/50 pb-12">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded border border-purple-500/20 bg-purple-500/10 text-purple-400 mb-6 font-mono text-xs uppercase tracking-widest">
                        <BookOpen size={14} /> Architecture Overview
                    </div>
                    <h1 className={`${funnelDisplay.className} text-4xl md:text-5xl font-black text-white mb-6 tracking-tight leading-tight`}>
                        Deconstructing Passive Intake. <br />
                        Engineered for <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-400">Active Intelligence.</span>
                    </h1>
                    <p className="text-xl text-zinc-400 leading-relaxed font-medium">
                        Ampomind is a deterministic, high-performance interactive synthesis engine. It bridges the gap between static media consumption and autonomous, sandbox-driven understanding for builders and researchers.
                    </p>
                </header>

                <article className="prose prose-invert prose-zinc max-w-none text-zinc-300">

                    <h2 className={`${funnelDisplay.className} text-2xl font-bold text-white flex items-center gap-3 mt-12 mb-6`}>
                        <Layers className="text-cyan-400" /> 1. The Core Architecture
                    </h2>
                    <p className="leading-relaxed text-lg">
                        Traditional learning systems (LMS) and informational platforms rely on passive video streams and static text documents.
                        Ampomind replaces this fragile paradigm with a robust three-tier architecture designed for immediate feedback and continuous validation.
                    </p>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 my-8">
                        <div className="p-5 rounded-2xl bg-zinc-900/30 border border-zinc-800/60">
                            <h4 className="text-white font-bold mb-2 flex items-center gap-2"><Zap size={16} className="text-purple-400" /> AI Course Synthesis</h4>
                            <p className="text-sm text-zinc-400">Multi-modal LLM pipelines ingest vast unindexed videos and map them into dense, searchable semantic vectors.</p>
                        </div>
                        <div className="p-5 rounded-2xl bg-zinc-900/30 border border-zinc-800/60">
                            <h4 className="text-white font-bold mb-2 flex items-center gap-2"><Code size={16} className="text-cyan-400" /> Interactive Sandboxes</h4>
                            <p className="text-sm text-zinc-400">WebAssembly-accelerated execution environments generated on the fly, tailoring interactive code and math puzzles to the immediate context.</p>
                        </div>
                    </div>

                    <h2 className={`${funnelDisplay.className} text-2xl font-bold text-white mt-16 mb-6`}>
                        2. The ScriblMotion Engine (v2.0)
                    </h2>
                    <p className="leading-relaxed text-lg mb-6">
                        At the heart of our interactive capability is **ScriblMotion**, a proprietary 2D Canvas/WebGL interactive engine originally conceptualized as an animation framework and evolved into a robust physics and interaction platform.
                    </p>

                    <ul className="space-y-4 mb-10">
                        <li className="flex gap-4">
                            <div className="size-2 bg-cyan-500 rounded-full mt-2 shrink-0 shadow-[0_0_10px_rgba(6,182,212,0.5)]" />
                            <div>
                                <strong className="text-white block mb-1">Deterministic Archetype System</strong>
                                <span className="text-zinc-400">Instead of hardcoding visualizations, ScriblMotion uses JSON-based Domain Specific Language (DSL) payloads to instantly instantiate rigorous interactive elements (gears, physics nodes, geometric proofs).</span>
                            </div>
                        </li>
                        <li className="flex gap-4">
                            <div className="size-2 bg-purple-500 rounded-full mt-2 shrink-0 shadow-[0_0_10px_rgba(168,85,247,0.5)]" />
                            <div>
                                <strong className="text-white block mb-1">State Machine Protocol</strong>
                                <span className="text-zinc-400">Every interactive element operates independently via an isolated State Machine, allowing complex parent-child rigging and real-time drag-and-drop feedback at 60fps.</span>
                            </div>
                        </li>
                    </ul>

                    <div className="p-6 rounded-2xl bg-black/40 border border-zinc-800/80 mb-16">
                        <span className="text-xs uppercase font-mono text-zinc-500 mb-4 block">ScriblScript Architecture Example</span>
                        <pre className="text-sm font-mono text-cyan-300/80 overflow-x-auto">
                            {`{
  "version": "2.0",
  "engine": "euler_verlet_hybrid",
  "archetypes": [
    {
      "id": "node_a",
      "type": "physics_body",
      "constraints": ["dragX", "dragY"],
      "reactivity": "onCollisionTriggerEvent"
    }
  ]
}`}
                        </pre>
                    </div>

                    <h2 className={`${funnelDisplay.className} text-2xl font-bold text-white mt-12 mb-6`}>
                        3. World Simulate: The Enterprise Horizon
                    </h2>
                    <p className="leading-relaxed text-lg">
                        Beyond individual skill acquisition, our top-tier enterprise layer introduces **World Simulate**. By deploying thousands of autonomous LLM-driven agents into sandboxed market constraints, enterprises can simulate complex user-flows, competition tactics, and ecosystem integrations before writing a single line of production code.
                    </p>

                </article>

                <div className="mt-24 text-center border-t border-zinc-800/50 pt-16">
                    <h3 className={`${funnelDisplay.className} text-3xl font-bold text-white mb-6`}>Join the Ecosystem</h3>
                    <p className="text-zinc-400 mb-8 max-w-lg mx-auto">
                        We are actively onboarding research partners, high-conviction early investors, and technical innovators.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link href="/coming-soon">
                            <Button className="bg-cyan-500 text-zinc-950 font-bold hover:bg-cyan-400 px-8 py-6 rounded-xl">
                                Go to Waiting List
                            </Button>
                        </Link>
                        <a href="mailto:invest@ampomind.com">
                            <Button variant="outline" className="border-zinc-700 font-bold px-8 py-6 rounded-xl hover:bg-zinc-800">
                                Contact Founders
                            </Button>
                        </a>
                    </div>
                </div>

            </main>
        </div>
    );
}
