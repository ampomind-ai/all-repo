"use client";

import React, { useState } from "react";
import { Funnel_Display, Geist_Mono } from "next/font/google";
import { Sparkles, Brain, Cpu, Globe, ArrowRight } from "lucide-react";
import { Button, Input } from "ui";

const funnelDisplay = Funnel_Display({ subsets: ["latin"], weight: ["300", "400", "500", "600", "700", "800"] });
const geistMono = Geist_Mono({ subsets: ["latin"] });

export default function ComingSoonPage() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setSubmitted(true);
      setTimeout(() => setSubmitted(false), 3000);
      setEmail("");
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground font-sans antialiased overflow-hidden relative flex flex-col items-center justify-center selection:bg-cyan-500/30">

      {/* Background Effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-cyan-500/10 rounded-full blur-[120px] opacity-60" />
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-purple-500/10 rounded-full blur-[100px] opacity-40" />

        {/* Grid */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,var(--border)_1px,transparent_1px),linear-gradient(to_bottom,var(--border)_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_80%_80%_at_50%_40%,black_10%,transparent_100%)] opacity-20" />
      </div>

      {/* Navigation / Header */}
      <header className="absolute top-0 left-0 right-0 p-8 flex justify-between items-center z-20">
        <div className="flex items-center gap-3">
          <div className="size-10 rounded-xl bg-zinc-100 flex items-center justify-center p-1.5 shadow-[0_0_20px_rgba(34,211,238,0.2)] border border-cyan-500/20">
            <img src="/ampo-icon-logo.png" alt="Ampomind" className="w-full h-full object-contain" />
          </div>
          <span className={`${funnelDisplay.className} text-xl font-bold tracking-tight text-zinc-100`}>Ampo<span className="text-zinc-500">Mind</span></span>
        </div>
        <div className="flex gap-4">
          <Button variant="ghost" className="text-muted-foreground hover:text-foreground hidden sm:flex">Investor Relations</Button>
          <Button variant="outline" className="border-zinc-700/50 hover:bg-zinc-800/50">Contact Us</Button>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 w-full max-w-5xl mx-auto px-6 py-20 flex flex-col items-center text-center mt-12">

        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-cyan-500/30 bg-cyan-500/10 backdrop-blur-md mb-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
          <Sparkles size={14} className="text-cyan-400" />
          <span className={`${geistMono.className} text-[11px] font-bold text-cyan-400 uppercase tracking-widest`}>Early Access Waitlist</span>
        </div>

        {/* Hero Title */}
        <h1 className={`${funnelDisplay.className} text-5xl md:text-7xl lg:text-8xl font-black tracking-tighter leading-[1.05] text-zinc-100 mb-6 drop-shadow-2xl animate-in fade-in slide-in-from-bottom-6 duration-1000 delay-150 fill-mode-both`}>
          The Future of <br className="hidden md:block" />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-500">Active Learning.</span>
        </h1>

        {/* Subtitle */}
        <p className="max-w-2xl text-lg md:text-xl text-zinc-400 leading-relaxed mb-12 font-medium animate-in fade-in slide-in-from-bottom-6 duration-1000 delay-300 fill-mode-both">
          Stop consuming. Start simulating. Ampomind is the category-defining platform blending AI course synthesis with autonomous research sandboxes.
        </p>

        {/* Waitlist Form */}
        <form onSubmit={handleSubmit} className="w-full max-w-md relative animate-in fade-in slide-in-from-bottom-6 duration-1000 delay-500 fill-mode-both mb-24">
          <div className="relative flex items-center p-1.5 rounded-2xl bg-zinc-900/50 border border-zinc-800 backdrop-blur-xl shadow-2xl focus-within:border-cyan-500/50 focus-within:ring-4 focus-within:ring-cyan-500/10 transition-all duration-300">
            <div className="pl-4 pr-2">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-zinc-500"><rect width="20" height="16" x="2" y="4" rx="2" /><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" /></svg>
            </div>
            <input
              type="email"
              placeholder="Enter your email address..."
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="flex-1 bg-transparent border-none text-[15px] text-zinc-100 placeholder:text-zinc-500 focus:outline-none h-12"
            />
            <Button
              type="submit"
              className="h-12 px-6 rounded-xl bg-zinc-100 text-zinc-900 hover:bg-white font-bold tracking-wide transition-all hover:scale-105 active:scale-95 group"
            >
              {submitted ? "Joined!" : "Request Access"}
              {!submitted && <ArrowRight size={16} className="ml-2 group-hover:translate-x-1 transition-transform" />}
            </Button>
          </div>
        </form>

        {/* Value Props Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-700 fill-mode-both">

          <div className="p-6 rounded-3xl border border-zinc-800/60 bg-zinc-900/20 backdrop-blur-md text-left transition-all hover:bg-zinc-900/40 hover:border-zinc-700">
            <div className="size-12 rounded-2xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center mb-5">
              <Brain className="text-purple-400" size={24} />
            </div>
            <h3 className="text-lg font-bold text-zinc-200 mb-2">Cognitive Workspaces</h3>
            <p className="text-[14px] text-zinc-500 leading-relaxed">Instantly synthesize vast video courses into highly-structured, searchable AI notes and specific insights.</p>
          </div>

          <div className="p-6 rounded-3xl border border-zinc-800/60 bg-zinc-900/20 backdrop-blur-md text-left transition-all hover:bg-zinc-900/40 hover:border-zinc-700">
            <div className="size-12 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center mb-5">
              <Cpu className="text-cyan-400" size={24} />
            </div>
            <h3 className="text-lg font-bold text-zinc-200 mb-2">ScriblMotion Engine</h3>
            <p className="text-[14px] text-zinc-500 leading-relaxed">Powered by our deterministic 60fps WebGL/Canvas interactive engine for unparalleled visualization.</p>
          </div>

          <div className="p-6 rounded-3xl border border-zinc-800/60 bg-zinc-900/20 backdrop-blur-md text-left transition-all hover:bg-zinc-900/40 hover:border-zinc-700">
            <div className="size-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mb-5">
              <Globe className="text-emerald-400" size={24} />
            </div>
            <h3 className="text-lg font-bold text-zinc-200 mb-2">World Simulate</h3>
            <p className="text-[14px] text-zinc-500 leading-relaxed">Deploy thousands of autonomous AI agents to validate markets, user-flows, and competition.</p>
          </div>

        </div>

      </main>

    </div>
  );
}
