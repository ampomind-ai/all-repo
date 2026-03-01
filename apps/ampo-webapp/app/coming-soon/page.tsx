"use client";

import React, { useState } from "react";
import { Funnel_Display, Geist_Mono } from "next/font/google";
import { Sparkles, ArrowRight, Menu, X, Brain, Cpu, Globe } from "lucide-react";
import Link from "next/link";
import { Button } from "ui";
import { SolanaGSAPDemo } from "../../components/SolanaGSAPDemo";

const funnelDisplay = Funnel_Display({ subsets: ["latin"], weight: ["300", "400", "500", "600", "700", "800"] });
const geistMono = Geist_Mono({ subsets: ["latin"] });

export default function ComingSoonPage() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setLoading(true);
    try {
      const res = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      if (res.ok) {
        setSubmitted(true);
        setTimeout(() => setSubmitted(false), 3000);
        setEmail("");
      }
    } catch (error) {
      console.error("Waitlist error", error);
    } finally {
      setLoading(false);
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
      <header className="absolute top-0 left-0 right-0 p-6 md:p-8 flex justify-between items-center z-50">
        <div className="flex items-center gap-3">
          <div className="size-10 rounded-xl bg-zinc-100 flex items-center justify-center p-1.5 shadow-[0_0_20px_rgba(34,211,238,0.2)] border border-cyan-500/20">
            <img src="/ampo-icon-logo.png" alt="Ampomind" className="w-full h-full object-contain" />
          </div>
          <span className={`${funnelDisplay.className} text-xl font-bold tracking-tight text-zinc-100`}>Ampo<span className="text-zinc-500">Mind</span></span>
        </div>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-4">
          <a href="https://www.oncrowdr.com/explore/c/early-support-for-ampomind-an-ai-platform-for-interactive-learning-research-and-simulation" target="_blank" rel="noopener noreferrer">
            <Button className="bg-cyan-500 hover:bg-cyan-400 text-zinc-950 font-bold tracking-wide shadow-[0_0_20px_rgba(6,182,212,0.4)] transition-all">Support on Crowdr</Button>
          </a>
          <Link href="/whitepaper">
            <Button variant="ghost" className="text-zinc-400 hover:text-cyan-400 font-bold tracking-wide">Read Whitepaper</Button>
          </Link>
          <a href="https://t.me/tis_david" target="_blank" rel="noopener noreferrer">
            <Button variant="ghost" className="text-muted-foreground hover:text-foreground">Developer Chat</Button>
          </a>
          <a href="https://x.com/CCrown_Orig" target="_blank" rel="noopener noreferrer">
            <Button variant="ghost" className="text-muted-foreground hover:text-foreground">Developer X</Button>
          </a>
          <a href="https://x.com/@ampomindai" target="_blank" rel="noopener noreferrer">
            <Button variant="outline" className="border-zinc-700/50 hover:bg-zinc-800/50">Ampomind X</Button>
          </a>
        </div>

        {/* Mobile Menu Toggle */}
        <div className="md:hidden">
          <Button
            variant="ghost"
            size="icon"
            className="text-zinc-400 hover:text-zinc-100"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </Button>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-40 bg-zinc-950/95 backdrop-blur-xl md:hidden pt-24 px-6 pb-6 flex flex-col gap-4 animate-in fade-in zoom-in-95 duration-200">
          <a href="https://www.oncrowdr.com/explore/c/early-support-for-ampomind-an-ai-platform-for-interactive-learning-research-and-simulation" target="_blank" rel="noopener noreferrer" onClick={() => setIsMobileMenuOpen(false)}>
            <Button className="w-full justify-start text-lg h-14 bg-cyan-500 hover:bg-cyan-400 text-zinc-950 font-bold tracking-wide shadow-[0_0_20px_rgba(6,182,212,0.4)] transition-all">Support Early Access on Crowdr</Button>
          </a>
          <Link href="/whitepaper" onClick={() => setIsMobileMenuOpen(false)}>
            <Button variant="ghost" className="w-full justify-start text-lg h-14 text-zinc-300 font-bold tracking-wide hover:text-cyan-400 hover:bg-zinc-900/50">Read Whitepaper</Button>
          </Link>
          <a href="https://t.me/tis_david" target="_blank" rel="noopener noreferrer" onClick={() => setIsMobileMenuOpen(false)}>
            <Button variant="ghost" className="w-full justify-start text-lg h-14 text-zinc-400 hover:text-zinc-100 hover:bg-zinc-900/50">Developer Chat (Telegram)</Button>
          </a>
          <a href="https://x.com/CCrown_Orig" target="_blank" rel="noopener noreferrer" onClick={() => setIsMobileMenuOpen(false)}>
            <Button variant="ghost" className="w-full justify-start text-lg h-14 text-zinc-400 hover:text-zinc-100 hover:bg-zinc-900/50">Developer X</Button>
          </a>
          <div className="mt-4 pt-4 border-t border-zinc-800">
            <a href="https://x.com/@ampomindai" target="_blank" rel="noopener noreferrer" onClick={() => setIsMobileMenuOpen(false)}>
              <Button variant="outline" className="w-full h-14 text-lg border-zinc-700/50 hover:bg-zinc-800/50 text-zinc-200">Follow Ampomind on X</Button>
            </a>
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="relative z-10 w-full max-w-5xl mx-auto px-6 pt-24 pb-20 flex flex-col items-center text-center mt-12">

        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-cyan-500/30 bg-cyan-500/10 backdrop-blur-md mb-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
          <Sparkles size={14} className="text-cyan-400" />
          <span className={`${geistMono.className} text-[11px] font-bold text-cyan-400 uppercase tracking-widest`}>Early Access Waitlist</span>
        </div>

        {/* Hero Title */}
        <h1 className={`${funnelDisplay.className} text-6xl md:text-7xl lg:text-[5.5rem] font-black tracking-tighter leading-[1.05] text-zinc-100 mb-6 drop-shadow-2xl animate-in fade-in slide-in-from-bottom-6 duration-1000 delay-150 fill-mode-both`}>
          The Engine for <br className="hidden md:block" />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-500">Active Intelligence.</span>
        </h1>

        {/* Subtitle */}
        <p className="max-w-2xl text-lg text-zinc-400 leading-relaxed mb-10 font-medium animate-in fade-in slide-in-from-bottom-6 duration-1000 delay-300 fill-mode-both">
          Stop passively consuming information. Start simulating it. Ampomind is the category-defining AI platform transforming complex knowledge into interactive sandboxes for creators, builders, and enterprises.
        </p>

        {/* Waitlist Form */}
        <form onSubmit={handleSubmit} className="w-full max-w-md relative animate-in fade-in slide-in-from-bottom-6 duration-1000 delay-500 fill-mode-both">
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
              className="flex-1 bg-transparent border-none text-[15px] text-zinc-100 placeholder:text-zinc-500 focus:outline-none h-11"
            />
            <Button
              type="submit"
              disabled={loading}
              className="h-11 px-6 rounded-xl bg-zinc-100 text-zinc-900 hover:bg-white font-bold tracking-wide transition-all hover:scale-105 active:scale-95 group disabled:opacity-50 disabled:hover:scale-100"
            >
              {loading ? "Joining..." : submitted ? "Joined!" : "Join"}
              {!submitted && !loading && <ArrowRight size={16} className="ml-2 group-hover:translate-x-1 transition-transform" />}
            </Button>
          </div>
        </form>

        {/* Interactive Demo Chat (Wide Horizontal Format) */}
        <div className="w-full max-w-4xl mt-32 mb-20 animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-700 fill-mode-both text-left">
          <div className="flex flex-col gap-6">

            {/* User Bubble */}
            <div className="self-end bg-zinc-800/80 p-5 rounded-3xl border border-zinc-700/50 max-w-md rounded-tr-sm text-[15px] shadow-xl text-zinc-200">
              Explain the math behind Solana's Proof of History (PoH). Make it interactive.
            </div>

            {/* AI Bubble (Horizontal Layout on Desktop) */}
            <div className="self-start bg-cyan-950/20 p-6 md:p-8 rounded-[2rem] border border-cyan-500/20 w-full rounded-tl-sm shadow-[0_0_30px_rgba(6,182,212,0.05)] border-l-2 border-l-cyan-500 flex flex-col md:flex-row gap-8 items-center">

              {/* Left Side: Explanatory Text */}
              <div className="flex-1 self-start w-full">
                <div className="font-bold text-cyan-400 flex items-center gap-3 mb-5">
                  <div className="size-8 rounded-lg bg-cyan-500 flex items-center justify-center shadow-lg shadow-cyan-500/20">
                    <Sparkles size={16} className="text-zinc-950" />
                  </div>
                  <span className={`${geistMono.className} tracking-tight text-lg`}>Ampomind Engine</span>
                </div>
                <p className="mb-4 text-[15px] leading-relaxed text-zinc-300">
                  Solana uses a high-frequency Verifiable Delay Function (VDF), specifically SHA-256 running in a continuous loop, to create a verifiable clock for the blockchain.
                </p>
                <p className="text-[15px] leading-relaxed text-zinc-300">
                  This removes the need for nodes to constantly poll each other for timestamps. Try running the embedded verification sequence below to see the continuous hashing in action.
                </p>
              </div>

              {/* Right Side: Embedded Interactive Widget */}
              <div className="w-full md:w-[320px] shrink-0 bg-zinc-950/80 border border-zinc-800/60 rounded-3xl overflow-hidden shadow-2xl relative">
                <div className="absolute inset-0 bg-gradient-to-b from-transparent to-cyan-500/5 pointer-events-none" />
                <SolanaGSAPDemo />
              </div>

            </div>
          </div>
        </div>

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

        {/* Early Supporters Campaign Section */}
        <div className="w-full mt-32 mb-12 animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-1000 fill-mode-both">
          <div className="relative rounded-[2.5rem] overflow-hidden bg-zinc-900/40 border border-zinc-800/80 p-10 md:p-16 text-center flex flex-col items-center justify-center gap-8 shadow-2xl">
            <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 via-transparent to-purple-500/10 pointer-events-none" />

            <div className="flex flex-col items-center max-w-3xl relative z-10 mx-auto">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-purple-500/30 bg-purple-500/10 backdrop-blur-md mb-6">
                <Sparkles size={16} className="text-purple-400" />
                <span className={`${geistMono.className} text-[12px] font-bold text-purple-400 uppercase tracking-widest`}>Crowdfunding Live</span>
              </div>

              <h2 className={`${funnelDisplay.className} text-4xl md:text-5xl lg:text-6xl font-black text-zinc-100 mb-6 tracking-tight leading-tight`}>
                Become an Early <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-400">Pre-Beta Supporter</span>
              </h2>

              <p className="text-zinc-400 text-lg md:text-xl leading-relaxed mb-10 max-w-2xl">
                We are opening doors to visionary individuals who see the future of interactive learning and simulation. Join our early supporters campaign on Crowdr and help us bring Ampomind to the world.
              </p>

              <a href="https://www.oncrowdr.com/explore/c/early-support-for-ampomind-an-ai-platform-for-interactive-learning-research-and-simulation" target="_blank" rel="noopener noreferrer">
                <Button className="h-16 px-10 rounded-2xl bg-cyan-500 hover:bg-cyan-400 text-zinc-950 font-black text-[17px] tracking-wide shadow-[0_0_30px_rgba(6,182,212,0.4)] transition-all hover:scale-105 active:scale-95 group">
                  Support Campaign on Crowdr
                  <ArrowRight size={20} className="ml-3 group-hover:translate-x-1 transition-transform" />
                </Button>
              </a>
            </div>
          </div>
        </div>

      </main>

    </div>
  );
}
