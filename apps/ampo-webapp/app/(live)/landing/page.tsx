"use client";

import React, { useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "ui";
import { Funnel_Display, Geist_Mono } from "next/font/google";
import gsap from "gsap";

const funnelDisplay = Funnel_Display({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
});

const geistMono = Geist_Mono({
  subsets: ["latin"],
});

export default function Home() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (containerRef.current) {
      gsap.fromTo(
        containerRef.current.querySelectorAll(".section-fade"),
        { opacity: 0, y: 10 },
        { opacity: 1, y: 0, duration: 0.6, stagger: 0.1, ease: "power1.out" }
      );
    }
  }, []);

  return (
    <div className="flex min-h-screen flex-col bg-[#0f0f11] text-zinc-100 selection:bg-cyan-500/30 selection:text-white font-sans antialiased relative">

      {/* ═══════════════ HEADER ═══════════════ */}
      <header className="sticky top-0 z-50 w-full bg-[#0f0f11]/80 border-b border-zinc-800/80 backdrop-blur-xl">
        <div className="w-[70%] max-w-[1400px] mx-auto h-12 flex items-center justify-between px-4 md:px-0">
          <div className="flex items-center gap-5">
            <div className="flex items-center gap-3 pr-5 border-r border-zinc-800/60">
              <div className="size-8 bg-zinc-100 rounded-md flex items-center justify-center">
                <Image src="/ampo-icon-logo.png" alt="Icon" width={20} height={20} />
              </div>
              <span className="text-[14px] font-bold tracking-tight text-white">AmpoMind</span>
            </div>
          </div>

          <div className="flex items-center gap-6">
            <nav className="hidden lg:flex gap-8 text-[11px] font-medium text-zinc-400">
              <a href="#features" className="hover:text-white transition-colors">Features</a>
              <Link href="/pricing" className="hover:text-white transition-colors">Pricing</Link>
              <a href="#" className="hover:text-white transition-colors">Docs</a>
            </nav>
            <div className="flex items-center gap-4 border-l border-zinc-800/60 pl-6 ml-2">
              <Link href="/login" className="text-[11px] font-medium text-zinc-400 hover:text-white transition-colors">Login</Link>
              <Button size="sm" variant="outline" className="h-7 text-[11px] font-medium rounded-md border-zinc-700 bg-zinc-800/50 hover:bg-zinc-800 text-zinc-100 px-4">
                Get Started
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* --- CONTENT COLUMN (70%) --- */}
      <main ref={containerRef} className="w-[70%] max-w-[1400px] mx-auto flex flex-col relative z-10 px-4 md:px-0">

        {/* ═══════════════════════════════════════════════
            01. HERO
            ═══════════════════════════════════════════════ */}
        <section className="section-fade w-full pt-16 pb-20 grid grid-cols-1 lg:grid-cols-12 gap-12 items-start border-l border-zinc-800/40 pl-8 md:pl-12 relative">
          <div className="absolute top-16 left-[-1px] w-[2px] h-32 bg-gradient-to-b from-cyan-500 to-transparent" />

          <div className="lg:col-span-12 flex flex-col items-start text-left mb-4">
            <div className="flex items-center gap-2 px-2 py-0.5 rounded-md border border-cyan-500/20 bg-cyan-500/5 text-[9px] font-bold text-cyan-400 uppercase tracking-[0.2em] mb-6">
              <span className="size-1 rounded-full bg-cyan-400 animate-pulse" />
              Web · Mobile · Browser Extension
            </div>

            <h1 className={`${funnelDisplay.className} text-[3rem] md:text-[4rem] font-black tracking-[-0.03em] leading-[1.1] text-zinc-100 mb-6 max-w-4xl`}>
              Think deeper. Decide faster. <br />
              <span className="text-zinc-500">Simulate anything.</span>
            </h1>
          </div>

          <div className="lg:col-span-6 space-y-8">
            <p className="text-[17px] text-zinc-400 leading-relaxed font-medium tracking-tight max-w-xl">
              AmpoMind is an AI intelligence platform that reasons with you, learns from anywhere you browse, and simulates entire markets — all from one unified workspace. Available on web, mobile, and as a browser extension.
            </p>

            <div className="flex items-center gap-3 border-l-2 border-cyan-500/40 pl-4">
              <p className={`${geistMono.className} text-[13px] text-zinc-500 italic`}>
                &ldquo;The only AI chat that&apos;s actually fun.&rdquo;
              </p>
            </div>

            <div className="flex flex-wrap gap-4 pt-4">
              <Button size="lg" className="h-11 px-8 bg-zinc-100 text-[#0c0c0e] rounded-md text-[13px] font-bold hover:bg-white transition-all shadow-xl shadow-cyan-500/5">
                Get Started Free
              </Button>
              <Button variant="outline" size="lg" className="h-11 px-8 rounded-md border-zinc-800 bg-transparent text-zinc-400 text-[13px] font-bold hover:text-white hover:bg-zinc-900 transition-all">
                Add Chrome Extension
              </Button>
            </div>

            <div className="grid grid-cols-3 gap-6 pt-12 border-t border-zinc-800/40">
              {[
                { label: "Platform", value: "Web + Mobile + Extension" },
                { label: "Simulation", value: "Agent-Powered" },
                { label: "AI Engine", value: "Multi-Mode" },
              ].map((spec, i) => (
                <div key={i} className="flex flex-col gap-1">
                  <span className="text-[9px] font-bold text-zinc-600 uppercase tracking-widest">{spec.label}</span>
                  <span className={`${geistMono.className} text-[13px] font-medium text-zinc-300`}>{spec.value}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="lg:col-span-6 hidden lg:block h-full">
            <div className="w-full aspect-[16/10] bg-zinc-900/10 border border-zinc-800/80 rounded-md overflow-hidden relative group shadow-2xl backdrop-blur-sm">
              <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 via-transparent to-purple-500/5 opacity-60" />

              {/* Workspace Preview */}
              <div className="size-full flex flex-col">
                <div className="h-8 border-b border-zinc-800/80 bg-zinc-900/40 flex items-center px-4 justify-between">
                  <div className="flex gap-1.5">
                    <div className="size-2 rounded-full bg-zinc-800" />
                    <div className="size-2 rounded-full bg-zinc-800" />
                    <div className="size-2 rounded-full bg-zinc-800" />
                  </div>
                  <div className={`${geistMono.className} text-[9px] text-zinc-500 uppercase`}>
                    AmpoMind Workspace
                  </div>
                  <div className="w-10" />
                </div>
                <div className="flex-1 flex overflow-hidden">
                  {/* Simulated AI chat content */}
                  <div className="flex-1 p-6 space-y-4 border-r border-zinc-800/40">
                    <div className="flex gap-3 items-start">
                      <div className="size-6 rounded-full bg-cyan-500/20 shrink-0 mt-0.5" />
                      <div className="space-y-1.5 flex-1">
                        <div className="h-2 w-3/4 bg-zinc-700/60 rounded-sm" />
                        <div className="h-2 w-full bg-zinc-800/40 rounded-sm" />
                        <div className="h-2 w-2/3 bg-zinc-800/40 rounded-sm" />
                      </div>
                    </div>
                    <div className="flex gap-3 items-start justify-end">
                      <div className="space-y-1.5 w-2/3">
                        <div className="h-2 w-full bg-cyan-500/20 rounded-sm" />
                        <div className="h-2 w-4/5 bg-cyan-500/10 rounded-sm" />
                      </div>
                    </div>
                    <div className="h-16 w-full bg-purple-500/5 border border-purple-500/20 rounded-md flex items-center justify-center gap-2">
                      <div className="size-3 rounded-full border border-purple-400/40 animate-spin" style={{ borderTopColor: "transparent" }} />
                      <span className={`${geistMono.className} text-[8px] text-purple-400/60 uppercase tracking-wider`}>Simulation Running</span>
                    </div>
                  </div>
                  {/* Nav sidebar */}
                  <div className="w-44 bg-[#0f0f11]/60 p-4 flex flex-col gap-4 backdrop-blur-md">
                    <div className="flex items-center gap-2 border-b border-zinc-800/60 pb-3">
                      <div className="size-5 bg-zinc-100 rounded-md flex items-center justify-center">
                        <Image src="/ampo-icon-logo.png" alt="Icon" width={12} height={12} />
                      </div>
                      <span className="text-[10px] font-bold text-zinc-100 uppercase tracking-tight">AmpoMind</span>
                    </div>
                    {["Research", "World Simulate", "Vault"].map(item => (
                      <div key={item} className="h-5 flex items-center gap-2">
                        <div className="size-1.5 rounded-full bg-zinc-700" />
                        <div className={`${geistMono.className} text-[8px] text-zinc-500`}>{item}</div>
                      </div>
                    ))}
                    <div className="mt-auto h-7 bg-zinc-100 rounded-sm flex items-center justify-center">
                      <span className="text-[8px] font-black text-[#0c0c0e] uppercase tracking-widest">New Session</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════════════════════
            02. FEATURE GRID (8 features)
            ═══════════════════════════════════════════════ */}
        <section id="features" className="section-fade w-full py-24 border-t border-zinc-800/40 relative">
          <div className="text-center mb-16">
            <h2 className={`${funnelDisplay.className} text-4xl font-extrabold text-zinc-100 mb-4`}>One platform. Infinite intelligence.</h2>
            <p className="text-zinc-400 text-[15px] font-medium max-w-lg mx-auto">Every tool you need to research, learn, simulate, and create — in one unified workspace.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-1">
            {[
              { title: "Multi-Mode AI Chat", icon: "✦", desc: "Switch between General, Research, YouTube, Code, Summarize, and Study modes — each tuned for a different kind of thinking.", tag: "Free" },
              { title: "World Simulate", icon: "◎", desc: "Deploy AI agents into a simulated global environment to analyze markets, model competitors, test pricing, and forecast trends.", tag: "Pro" },
              { title: "ScriblMotion", icon: "⬡", desc: "Interactive educational widgets — algebra, physics, data viz — embedded directly inside your AI conversations.", tag: "Pro" },
              { title: "Knowledge Vault", icon: "◈", desc: "Clip, save, and tag anything from the web. Build a second brain that grows with every session.", tag: "Free" },
              { title: "Video & Research Tools", icon: "▶", desc: "AI-powered video comprehension, note generation, and multi-source structured comparison reports.", tag: "Free" },
              { title: "Social Drafts", icon: "↗", desc: "Turn any insight, article, or research session into a ready-to-post draft for X, LinkedIn, or Threads.", tag: "Free" },
              { title: "Courses & Templates", icon: "▣", desc: "Follow structured online courses and use reusable research frameworks to supercharge your workflow.", tag: "Free" },
              { title: "Extension + Mobile Apps", icon: "⬛", desc: "Inline AI on every tab with the Chrome extension. Native iOS and Android apps keep your workspace in your pocket.", tag: "Free" },
            ].map((feat, i) => (
              <div key={i} className="p-8 border border-zinc-800/60 bg-zinc-900/10 hover:bg-zinc-900/20 transition-all flex flex-col gap-4 group backdrop-blur-sm relative">
                <div className="flex items-center justify-between">
                  <span className="text-[18px] text-zinc-500 group-hover:text-zinc-300 transition-colors">{feat.icon}</span>
                  <span className={`${geistMono.className} text-[9px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-md ${feat.tag === "Pro"
                    ? "text-purple-400 bg-purple-500/10 border border-purple-500/20"
                    : "text-cyan-400 bg-cyan-500/10 border border-cyan-500/20"
                    }`}>{feat.tag}</span>
                </div>
                <h3 className="text-[16px] font-bold text-zinc-100 tracking-tight">{feat.title}</h3>
                <p className="text-[13px] text-zinc-400 leading-relaxed font-medium">{feat.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ═══════════════════════════════════════════════
            03. HOW IT WORKS
            ═══════════════════════════════════════════════ */}
        <section id="how-it-works" className="section-fade w-full py-24 border-t border-zinc-800/40 flex flex-col items-center relative">
          <div className="absolute top-[50%] left-[50%] -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full bg-purple-500/[0.04] blur-[100px] pointer-events-none" />

          <div className="text-center mb-20">
            <h2 className={`${funnelDisplay.className} text-4xl font-extrabold text-zinc-100 mb-6`}>How it works</h2>
            <p className="max-w-xl text-zinc-400 text-[15px] font-medium leading-relaxed mx-auto">
              Start in the workspace, extend to every tab, and run intelligence at any scale.
            </p>
          </div>

          <div className="w-full max-w-4xl border border-zinc-800/80 rounded-md overflow-hidden bg-zinc-900/5 shadow-2xl relative">
            <div className="p-12 md:p-20 flex flex-col md:flex-row gap-16 items-start">
              <div className="w-[280px] shrink-0 bg-zinc-900/60 border border-zinc-800/80 rounded-md overflow-hidden flex flex-col shadow-xl backdrop-blur-md">
                <div className="h-10 border-b border-zinc-800 flex items-center px-5 gap-3">
                  <div className="size-4 bg-zinc-100 rounded-sm" />
                  <span className="text-[11px] font-bold text-zinc-100 uppercase tracking-tight">AmpoMind</span>
                </div>
                <div className="p-6 space-y-8">
                  <div className="space-y-3">
                    <div className="h-1.5 w-1/2 bg-zinc-800 rounded-full" />
                    <div className="h-24 w-full bg-zinc-800/20 border border-dotted border-zinc-800 rounded-sm" />
                  </div>
                  <div className="h-10 flex items-center justify-center bg-zinc-100 text-[#0c0c0e] rounded-md text-[11px] font-black uppercase tracking-widest">
                    Get Started
                  </div>
                </div>
              </div>

              <div className="flex-1 space-y-12">
                {[
                  { t: "Open the Workspace", d: "Choose your mode — research, simulate, study, or create. Ask anything, launch an agent simulation, or build your knowledge vault." },
                  { t: "Browse with the Extension", d: "Install the Chrome extension to unlock inline AI on any page: summarize articles, clip highlights, take course notes, and draft posts without leaving the tab." },
                  { t: "Take it Anywhere", d: "Continue on mobile. Your sessions, vault, and simulations sync across iOS, Android, and web — always up to date." },
                ].map((item, i) => (
                  <div key={i} className="flex gap-8 items-start pb-10 border-b border-zinc-800/40 last:border-none">
                    <div className={`${geistMono.className} text-cyan-500/60 text-[11px]`}>STEP 0{i + 1}</div>
                    <div className="space-y-3">
                      <h4 className="text-[16px] font-bold text-zinc-100">{item.t}</h4>
                      <p className="text-[14px] text-zinc-400 leading-relaxed">{item.d}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════════════════════
            04. USE CASES
            ═══════════════════════════════════════════════ */}
        <section className="section-fade w-full py-24 border-t border-zinc-800/40">
          <div className="text-center mb-16">
            <h2 className={`${funnelDisplay.className} text-3xl font-extrabold text-zinc-100 mb-4`}>Built for people who move fast</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { emoji: "🚀", title: "Founders & Operators", desc: "Run market simulations before you invest. Model competitor responses, test pricing strategies, and forecast demand with World Simulate." },
              { emoji: "🔬", title: "Researchers & Analysts", desc: "Multi-source structured comparisons, deep research reports, and a knowledge vault that remembers everything you've read." },
              { emoji: "🎓", title: "Students & Learners", desc: "Interactive ScriblMotion widgets, AI-powered course notes, video summaries, and structured study sessions — all in one workspace." },
            ].map((uc, i) => (
              <div key={i} className="p-8 rounded-md border border-zinc-800/40 bg-zinc-900/5 text-center flex flex-col items-center gap-4 hover:bg-zinc-900/20 transition-all">
                <span className="text-[32px]">{uc.emoji}</span>
                <h3 className="text-[16px] font-bold text-zinc-100">{uc.title}</h3>
                <p className="text-[13px] text-zinc-400 leading-relaxed font-medium">{uc.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* 05. FOOTER */}
        <footer className="section-fade w-full pt-32 pb-16 border-t border-zinc-800/40 flex flex-col md:flex-row justify-between items-start gap-20">
          <div className="flex flex-col gap-8">
            <div className="flex items-center gap-4 pr-6 border-r border-zinc-800/60 w-fit">
              <div className="size-10 bg-zinc-100 rounded-md flex items-center justify-center">
                <Image src="/ampo-icon-logo.png" alt="AmpoMind" width={28} height={28} />
              </div>
              <span className="text-[18px] font-bold text-zinc-100 tracking-tight">AmpoMind</span>
            </div>
            <p className="text-zinc-500 text-[14px] font-medium max-w-[280px] leading-relaxed">
              The AI intelligence platform for people who think seriously. Research, simulate, learn, and create — everywhere you go.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-16 lg:gap-24">
            {[
              { title: "Product", links: ["Features", "World Simulate", "Pricing", "Security"] },
              { title: "Resources", links: ["Docs", "Privacy Policy", "Support"] },
              { title: "Community", links: ["Twitter / X", "GitHub"] },
            ].map((group, i) => (
              <div key={i} className="space-y-6">
                <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">{group.title}</span>
                <div className="flex flex-col gap-3 text-[13px] font-medium text-zinc-400">
                  {group.links.map(link => (
                    <a key={link} href="#" className="hover:text-white transition-colors">{link}</a>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </footer>
      </main>

      {/* Bottom accent line */}
      <div className="fixed bottom-0 left-0 h-[1.5px] bg-gradient-to-r from-transparent via-cyan-500/60 to-transparent w-full z-[100]" />
    </div>
  );
}
