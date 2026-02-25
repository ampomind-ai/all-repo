"use client";

import React, { useState, useRef, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "ui";
import { Funnel_Display, Geist_Mono } from "next/font/google";
import {
  Plus, Clock, Pin, FolderOpen, Sparkles, Video, Scale, Send as SendIcon,
  ChevronDown, ChevronRight, Paperclip, ImageIcon, X, PanelLeftClose,
  Menu, Home, Star, ClipboardList, Search, Zap, FileText, Pen, Code,
  GraduationCap, Film, BookOpen, Copy, Share2, Download, MessageSquare,
  Settings, User, LogIn,
} from "lucide-react";

const funnelDisplay = Funnel_Display({ subsets: ["latin"], weight: ["300", "400", "500", "600", "700", "800"] });
const geistMono = Geist_Mono({ subsets: ["latin"] });

/* ────── TYPES ────── */
interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  blocks?: OutputBlock[];
}
interface OutputBlock {
  type: "text" | "table" | "outline" | "code" | "timestamps";
  title?: string;
  content: string;
}

/* ────── MODES ────── */
const MODES = [
  { id: "general", label: "General Chat", Icon: MessageSquare },
  { id: "summarize", label: "Summarize URL", Icon: Zap },
  { id: "youtube", label: "Analyze YouTube", Icon: Film },
  { id: "research", label: "Research Mode", Icon: BookOpen },
  { id: "compare", label: "Compare Sources", Icon: Scale },
  { id: "creator", label: "Creator Mode", Icon: Pen },
  { id: "code", label: "Code Mode", Icon: Code },
  { id: "study", label: "Study Mode", Icon: GraduationCap },
];

const REFINE_CHIPS = ["Simplify", "Expand", "Add examples", "Add citations", "Make persuasive", "Make technical", "Turn into checklist", "Turn into thread"];

import Sidebar from "./components/sidebar";
import Header from "./components/header";

/* ────── MOCK RESPONSE ────── */
function getMockResponse(mode: string, query: string): Message {
  const base = { id: (Date.now() + 1).toString(), role: "assistant" as const, content: "" };

  if (mode === "youtube") {
    return {
      ...base, content: "Video analysis complete.", blocks: [
        { type: "text", title: "Summary", content: "This 24-minute lecture covers the transformer architecture, self-attention mechanisms, and how multi-head attention enables parallel processing of sequence data." },
        { type: "timestamps", title: "Key Timestamps", content: "0:00 — Introduction to Transformers\n3:42 — Self-Attention Mechanism\n8:15 — Multi-Head Attention\n12:30 — Positional Encoding\n17:45 — Training & Results\n22:10 — Practical Applications" },
        { type: "outline", title: "Key Frameworks", content: "1. Attention replaces recurrence entirely\n2. Queries, Keys, Values — the core abstraction\n3. Positional encoding preserves sequence order\n4. Layer normalization stabilizes deep networks\n5. The encoder-decoder architecture is optional" },
      ]
    };
  }
  if (mode === "research") {
    return {
      ...base, content: "Research analysis complete.", blocks: [
        { type: "text", title: "Abstract", content: "This study examines the effectiveness of retrieval-augmented generation (RAG) in domain-specific question answering. The authors demonstrate a 34% improvement in factual accuracy over baseline LLMs." },
        { type: "text", title: "Methodology", content: "• 500 domain-specific queries across 3 verticals\n• Compared: vanilla GPT-4, RAG + GPT-4, fine-tuned GPT-4\n• Evaluation: human judges + automated metrics (ROUGE, BERTScore)" },
        { type: "text", title: "Key Results", content: "RAG + GPT-4 achieved 89.3% accuracy vs 66.7% for vanilla GPT-4. Fine-tuned models scored 78.2% but degraded on out-of-domain queries." },
        { type: "text", title: "Limitations", content: "• Small sample size (500 queries)\n• Only English-language sources\n• Retrieval latency not measured" },
      ]
    };
  }
  if (mode === "creator") {
    return {
      ...base, content: "Content generated.", blocks: [
        { type: "text", title: "Hook Variants", content: "1. \"Most people use AI wrong. Here's the one workflow that changed everything.\"\n2. \"I replaced 6 tools with one AI workspace. Here's what happened.\"\n3. \"The gap between consuming and creating just disappeared.\"" },
        { type: "text", title: "X Thread Draft", content: "I've been testing a new way to learn online.\n\nInstead of bookmarking → forgetting → re-googling...\n\nI summarize → annotate → share in one flow.\n\nHere's the framework (5 tweets):" },
        { type: "text", title: "LinkedIn Version", content: "I used to drown in tabs. 47 open. 12 bookmarked. 0 actually processed.\n\nThen I started treating every article as raw material — not a destination.\n\nThe shift: Consume → Synthesize → Publish. Every time." },
      ]
    };
  }
  if (mode === "compare") {
    return {
      ...base, content: "Comparison complete.", blocks: [
        { type: "table", title: "Source Comparison", content: "Source|Main Thesis|Strength|Weakness\nSource A|RAG outperforms fine-tuning|Large-scale eval|No cost analysis\nSource B|Fine-tuning is underrated|Domain-specific gains|Small dataset\nSource C|Hybrid approach wins|Practical framing|Lacks rigor" },
        { type: "text", title: "Contradictions", content: "• Source A claims retrieval always wins; Source B shows fine-tuning superior in narrow domains.\n• Source C's \"hybrid\" approach conflates RAG with few-shot prompting." },
        { type: "text", title: "Unified Synthesis", content: "RAG is the default for broad-domain tasks. Fine-tuning remains valuable for narrow, high-stakes verticals. A hybrid approach appears optimal but needs more evaluation." },
      ]
    };
  }
  return {
    ...base, content: query, blocks: [
      { type: "text", title: "Answer", content: `Based on analysis across multiple sources:\n\n• ${query.slice(0, 50)} — a multifaceted topic with evolving perspectives.\n\n• Current consensus leans toward practical, iterative approaches over theoretical frameworks.\n\n• The most effective strategy combines structured note-taking with active synthesis and sharing.` },
    ]
  };
}

/* ────── COMPONENT ────── */
export default function CognitiveWorkspace() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [mode, setMode] = useState("general");
  const [modeOpen, setModeOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [rightPanelOpen, setRightPanelOpen] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [inputFocused, setInputFocused] = useState(false);
  const [collapsedBlocks, setCollapsedBlocks] = useState<Set<string>>(new Set());
  const endRef = useRef<HTMLDivElement>(null);
  const modeRef = useRef<HTMLDivElement>(null);

  useEffect(() => { endRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages]);

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (modeRef.current && !modeRef.current.contains(e.target as Node)) setModeOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const activeMode = MODES.find(m => m.id === mode)!;
  const isEmpty = messages.length === 0;

  const toggleBlock = (id: string) => {
    setCollapsedBlocks(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const handleSubmit = (text?: string) => {
    const val = text || input.trim();
    if (!val) return;
    setMessages(p => [...p, { id: Date.now().toString(), role: "user", content: val }]);
    setInput("");
    setIsTyping(true);
    if (["youtube", "research", "creator", "compare"].includes(mode)) setRightPanelOpen(true);
    setTimeout(() => {
      setMessages(p => [...p, getMockResponse(mode, val)]);
      setIsTyping(false);
    }, 1200);
  };

  const placeholders: Record<string, string> = {
    general: "Ask anything...",
    summarize: "Paste a URL to summarize...",
    youtube: "Paste a YouTube link...",
    research: "Describe your research question...",
    compare: "Paste or describe sources to compare...",
    creator: "What do you want to create?",
    code: "Describe what you want to build...",
    study: "What topic are you studying?",
  };

  return (
    <div className="flex h-screen text-zinc-100 font-sans antialiased overflow-hidden bg-transparent">

      {/* ═══════════════════════════════════════
          LEFT SIDEBAR
          ═══════════════════════════════════════ */}
      <Sidebar
        isOpen={sidebarOpen}
        setIsOpen={setSidebarOpen}
        onNewSession={() => { setMessages([]); setRightPanelOpen(false); }}
      />

      {/* ═══════════════════════════════════════
          MAIN CANVAS
          ═══════════════════════════════════════ */}
      <div className="flex-1 flex flex-col min-w-0">

        {/* Header */}
        <Header
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
          leftContent={
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg border" style={{ background: 'var(--surface-2)', borderColor: 'var(--surface-border)' }}>
              <activeMode.Icon size={14} className="text-zinc-400" />
              <span className="text-[12px] font-medium text-zinc-400">{activeMode.label}</span>
            </div>
          }
        />

        {isEmpty ? (
          /* ═══ EMPTY STATE ═══ */
          <div className="flex-1 flex flex-col items-center justify-center px-6 relative">

            <style>{`
              @keyframes borderBeamSweep {
                0% { transform: translate(-50%, -50%) rotate(0deg); opacity: 0; }
                15% { opacity: 1; }
                50% { transform: translate(-50%, -50%) rotate(360deg); opacity: 1; }
                65% { opacity: 0; }
                100% { transform: translate(-50%, -50%) rotate(360deg); opacity: 0; }
              }
            `}</style>
            <div className="relative p-[2px] rounded-[1.25rem] mb-10 overflow-hidden shadow-xl shadow-cyan-500/10 bg-zinc-800/20">
              {/* Rotating conic gradient behind the inner box */}
              <div
                className="absolute top-1/2 left-1/2 w-[250%] h-[250%]"
                style={{
                  background: 'conic-gradient(from 180deg at 50% 50%, transparent 60%, rgba(34, 211, 238, 0) 75%, rgba(34, 211, 238, 1) 100%)',
                  animation: 'borderBeamSweep 5s cubic-bezier(0.4, 0, 0.2, 1) infinite'
                }}
              />
              {/* Solid inner box acts as a mask, revealing only the glowing border */}
              <div className="relative size-24 bg-zinc-100 rounded-[1.125rem] flex items-center justify-center z-10 w-full h-full p-1">
                <Image src="/ampo-icon-logo.png" alt="A" width={54} height={54} />
              </div>
            </div>

            <h1 className={`${funnelDisplay.className} text-[2rem] font-bold tracking-[-0.04em] text-center leading-none mb-14`}>
              What are you working on?
            </h1>

            {/* ═══ INPUT ═══ */}
            <div className="w-full max-w-2xl relative">
              {/* Light beam wrapper — activates on focus */}
              <div className={`relative rounded-2xl overflow-hidden transition-all duration-500 ${inputFocused ? 'p-[2px] shadow-lg shadow-cyan-500/10' : 'p-0'}`}>
                {/* Beam animation — only rendered when focused */}
                {inputFocused && (
                  <div
                    className="absolute top-1/2 left-1/2 w-[250%] h-[250%] pointer-events-none"
                    style={{
                      background: 'conic-gradient(from 180deg at 50% 50%, transparent 55%, rgba(34, 211, 238, 0) 70%, rgba(34, 211, 238, 0.9) 100%)',
                      animation: 'borderBeamSweep 3s cubic-bezier(0.4, 0, 0.2, 1) infinite'
                    }}
                  />
                )}
                <div className="relative border rounded-2xl focus-within:border-zinc-700/60 transition-all z-10" style={{ background: 'var(--surface-2)', borderColor: 'var(--surface-border)' }}>
                  <textarea
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSubmit(); } }}
                    onFocus={() => setInputFocused(true)}
                    onBlur={() => setInputFocused(false)}
                    placeholder={placeholders[mode]}
                    rows={3}
                    className="w-full bg-transparent text-[15px] text-zinc-100 placeholder:text-zinc-600 resize-none outline-none font-medium leading-relaxed p-5 pb-3"
                  />

                  <div className="flex items-center justify-between px-5 py-3 border-t border-zinc-800/20">
                    <div className="flex items-center gap-3">
                      {/* Mode switcher */}
                      <div className="relative" ref={modeRef}>
                        <button
                          onClick={() => setModeOpen(!modeOpen)}
                          className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-zinc-800/30 hover:bg-zinc-800/50 border border-zinc-800/30 text-[12px] font-medium text-zinc-400 transition-all"
                        >
                          <activeMode.Icon size={14} />
                          {activeMode.label}
                          <ChevronDown size={12} className="text-zinc-600" />
                        </button>
                        {modeOpen && (
                          <div className="absolute bottom-full left-0 mb-2 w-56 border rounded-xl py-2 shadow-2xl z-[100]" style={{ background: 'var(--surface-2)', borderColor: 'var(--surface-border)' }}>
                            {MODES.map(m => (
                              <button
                                key={m.id}
                                onClick={() => { setMode(m.id); setModeOpen(false); }}
                                className={`w-full flex items-center gap-3 px-4 py-2 text-[13px] font-medium transition-colors ${mode === m.id ? "text-zinc-100 bg-zinc-800/40" : "text-zinc-500 hover:text-zinc-200 hover:bg-zinc-800/20"
                                  }`}
                              >
                                <m.Icon size={15} />
                                {m.label}
                              </button>
                            ))}
                          </div>
                        )}
                      </div>

                      <div className="flex items-center gap-1">
                        <button className="size-8 rounded-lg hover:bg-zinc-800/30 flex items-center justify-center text-zinc-600 hover:text-zinc-400 transition-colors" title="Attach file">
                          <Paperclip size={16} />
                        </button>
                        <button className="size-8 rounded-lg hover:bg-zinc-800/30 flex items-center justify-center text-zinc-600 hover:text-zinc-400 transition-colors" title="Upload image">
                          <ImageIcon size={16} />
                        </button>
                      </div>
                    </div>

                    <button
                      onClick={() => handleSubmit()}
                      disabled={!input.trim()}
                      className="size-9 rounded-xl bg-zinc-100 hover:bg-white disabled:bg-zinc-800/40 disabled:text-zinc-700 text-zinc-900 flex items-center justify-center transition-all"
                    >
                      <SendIcon size={16} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* ═══ THREAD ═══ */
          <>
            <div className="flex-1 overflow-y-auto">
              <div className="max-w-3xl mx-auto py-10 px-8 space-y-10">
                {messages.map(msg => (
                  <div key={msg.id}>
                    {msg.role === "user" ? (
                      <div className="flex items-start gap-4">
                        <div className="size-8 rounded-full bg-gradient-to-br from-cyan-500 to-purple-500 shrink-0 mt-1" />
                        <p className="text-[16px] text-zinc-200 font-medium leading-relaxed pt-1">{msg.content}</p>
                      </div>
                    ) : (
                      <div className="pl-12 space-y-4">
                        {msg.blocks?.map((block, bi) => {
                          const blockId = `${msg.id}-${bi}`;
                          const isCollapsed = collapsedBlocks.has(blockId);
                          return (
                            <div key={bi} className="border border-zinc-800/30 rounded-xl overflow-hidden bg-zinc-900/10">
                              <button
                                onClick={() => toggleBlock(blockId)}
                                className="w-full flex items-center justify-between px-5 py-3 hover:bg-zinc-800/10 transition-colors"
                              >
                                <div className="flex items-center gap-2.5">
                                  <ChevronRight size={14} className={`text-zinc-600 transition-transform ${isCollapsed ? "" : "rotate-90"}`} />
                                  <span className="text-[14px] font-semibold text-zinc-200">{block.title}</span>
                                  <span className={`${geistMono.className} text-[10px] text-zinc-700 uppercase`}>{block.type}</span>
                                </div>
                                <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
                                  <button className="p-1.5 rounded-md hover:bg-zinc-800/30 text-zinc-700 hover:text-zinc-400 transition-colors"><Copy size={13} /></button>
                                  <button className="p-1.5 rounded-md hover:bg-zinc-800/30 text-zinc-700 hover:text-zinc-400 transition-colors"><Download size={13} /></button>
                                </div>
                              </button>
                              {!isCollapsed && (
                                <div className="px-5 pb-4 border-t border-zinc-800/15">
                                  {block.type === "table" ? (
                                    <div className="overflow-x-auto mt-3">
                                      <table className="w-full text-[13px]">
                                        <thead>
                                          <tr>{block.content.split("\n")[0].split("|").map((h, i) => <th key={i} className="text-left py-2 px-3 text-zinc-400 font-bold border-b border-zinc-800/25 text-[12px]">{h}</th>)}</tr>
                                        </thead>
                                        <tbody>
                                          {block.content.split("\n").slice(1).map((row, ri) => (
                                            <tr key={ri} className="border-b border-zinc-800/10 last:border-none">
                                              {row.split("|").map((cell, ci) => <td key={ci} className="py-2 px-3 text-zinc-400">{cell}</td>)}
                                            </tr>
                                          ))}
                                        </tbody>
                                      </table>
                                    </div>
                                  ) : block.type === "code" ? (
                                    <pre className={`${geistMono.className} text-[13px] text-zinc-400 bg-zinc-900/40 rounded-lg p-4 mt-3 overflow-x-auto`}>{block.content}</pre>
                                  ) : (
                                    <div className="text-[14px] text-zinc-400 leading-[1.75] whitespace-pre-line mt-3">{block.content}</div>
                                  )}
                                </div>
                              )}
                            </div>
                          );
                        })}

                        {/* Response actions */}
                        <div className="flex items-center gap-2 pt-1">
                          <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[12px] text-zinc-600 hover:text-zinc-300 hover:bg-zinc-800/20 transition-all font-medium"><Copy size={13} /> Copy</button>
                          <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[12px] text-zinc-600 hover:text-zinc-300 hover:bg-zinc-800/20 transition-all font-medium"><Share2 size={13} /> Share</button>
                          <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[12px] text-zinc-600 hover:text-zinc-300 hover:bg-zinc-800/20 transition-all font-medium"><Download size={13} /> Export</button>
                        </div>

                        {/* Refine chips */}
                        <div className="flex flex-wrap gap-1.5 pt-1">
                          {REFINE_CHIPS.map(chip => (
                            <button key={chip} className="px-3 py-1.5 rounded-lg border border-zinc-800/30 text-[11px] font-medium text-zinc-500 hover:text-zinc-200 hover:border-zinc-700/40 hover:bg-zinc-800/15 transition-all">
                              {chip}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ))}

                {isTyping && (
                  <div className="pl-12 flex gap-2 pt-3">
                    <div className="size-2 rounded-full bg-cyan-500/50 animate-pulse" />
                    <div className="size-2 rounded-full bg-cyan-500/50 animate-pulse" style={{ animationDelay: "150ms" }} />
                    <div className="size-2 rounded-full bg-cyan-500/50 animate-pulse" style={{ animationDelay: "300ms" }} />
                  </div>
                )}
                <div ref={endRef} />
              </div>
            </div>

            {/* Thread input */}
            <div className="border-t px-8 py-4 shrink-0" style={{ borderColor: 'var(--surface-border)' }}>
              <div className="max-w-3xl mx-auto flex items-center gap-3 border rounded-xl px-4 py-3 focus-within:border-zinc-700/50 transition-all" style={{ background: 'var(--surface-2)', borderColor: 'var(--surface-border)' }}>
                <input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); handleSubmit(); } }}
                  placeholder="Follow up..."
                  className="flex-1 bg-transparent text-[15px] text-zinc-100 placeholder:text-zinc-600 outline-none font-medium"
                />
                <button
                  onClick={() => handleSubmit()}
                  disabled={!input.trim()}
                  className="size-8 rounded-lg bg-zinc-100 hover:bg-white disabled:bg-zinc-800/40 disabled:text-zinc-700 text-zinc-900 flex items-center justify-center transition-all shrink-0"
                >
                  <SendIcon size={14} />
                </button>
              </div>
            </div>
          </>
        )}
      </div>

      {/* ═══════════════════════════════════════
          RIGHT PANEL — CONTEXTUAL
          ═══════════════════════════════════════ */}
      {rightPanelOpen && !isEmpty && (
        <aside className="w-[300px] shrink-0 border-l flex flex-col overflow-hidden" style={{ background: 'var(--surface-0)', borderColor: 'var(--surface-border)' }}>
          <div className="h-14 border-b flex items-center justify-between px-5 shrink-0" style={{ borderColor: 'var(--surface-border)' }}>
            <span className={`${geistMono.className} text-[11px] text-zinc-500 uppercase tracking-[0.1em]`}>
              {mode === "youtube" ? "Video Intel" : mode === "research" ? "Research Panel" : mode === "creator" ? "Creator Tools" : mode === "compare" ? "Comparison" : "Context"}
            </span>
            <button onClick={() => setRightPanelOpen(false)} className="size-8 rounded-lg hover:bg-zinc-800/30 flex items-center justify-center text-zinc-600 hover:text-zinc-400 transition-colors">
              <X size={16} />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-5 space-y-6">
            {mode === "youtube" && (
              <>
                <div className="w-full aspect-video bg-zinc-900/40 rounded-xl border border-zinc-800/25 flex items-center justify-center">
                  <Film size={36} className="text-zinc-700" />
                </div>
                <div>
                  <div className={`${geistMono.className} text-[10px] text-zinc-600 uppercase tracking-widest mb-3`}>Chapters</div>
                  {["Introduction", "Self-Attention", "Multi-Head Attention", "Positional Encoding", "Results", "Applications"].map((ch, i) => (
                    <button key={i} className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-zinc-800/25 transition-colors text-[13px] text-zinc-400 hover:text-zinc-200 font-medium">
                      <span className={`${geistMono.className} text-[11px] text-cyan-500/60 w-10 shrink-0`}>{`${i * 4}:${i === 0 ? "00" : String(i * 15 % 60).padStart(2, "0")}`}</span>
                      {ch}
                    </button>
                  ))}
                </div>
                <div>
                  <div className={`${geistMono.className} text-[10px] text-zinc-600 uppercase tracking-widest mb-3`}>Convert To</div>
                  {["Blog post", "X Thread", "LinkedIn post", "Course notes", "Flashcards"].map(a => (
                    <button key={a} className="w-full px-4 py-2 rounded-lg border border-zinc-800/25 hover:border-zinc-700/30 hover:bg-zinc-800/15 text-[12px] text-zinc-400 hover:text-zinc-200 font-medium transition-all mb-1.5 text-left">{a}</button>
                  ))}
                </div>
              </>
            )}

            {mode === "research" && (
              <>
                <div>
                  <div className={`${geistMono.className} text-[10px] text-zinc-600 uppercase tracking-widest mb-3`}>Structure</div>
                  {["Abstract", "Hypothesis", "Methodology", "Results", "Limitations", "Critique"].map(s => (
                    <button key={s} className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-zinc-800/25 transition-colors text-[13px] text-zinc-400 hover:text-zinc-200 font-medium">
                      <span className="size-1.5 rounded-full bg-cyan-500/40 shrink-0" />
                      {s}
                    </button>
                  ))}
                </div>
                <div>
                  <div className={`${geistMono.className} text-[10px] text-zinc-600 uppercase tracking-widest mb-3`}>Actions</div>
                  {["Export Citations (BibTeX)", "Compare with another study", "Generate follow-up questions"].map(a => (
                    <button key={a} className="w-full px-4 py-2 rounded-lg border border-zinc-800/25 hover:border-zinc-700/30 hover:bg-zinc-800/15 text-[12px] text-zinc-400 hover:text-zinc-200 font-medium transition-all mb-1.5 text-left">{a}</button>
                  ))}
                </div>
              </>
            )}

            {mode === "creator" && (
              <>
                <div>
                  <div className={`${geistMono.className} text-[10px] text-zinc-600 uppercase tracking-widest mb-3`}>Tone</div>
                  <div className="flex flex-wrap gap-2">
                    {["Professional", "Casual", "Persuasive", "Humorous", "Inspirational"].map(t => (
                      <button key={t} className="px-3 py-1.5 rounded-lg border border-zinc-800/30 text-[11px] text-zinc-400 hover:text-cyan-400 hover:border-cyan-500/25 font-medium transition-all">{t}</button>
                    ))}
                  </div>
                </div>
                <div>
                  <div className={`${geistMono.className} text-[10px] text-zinc-600 uppercase tracking-widest mb-3`}>Platform</div>
                  <div className="flex flex-wrap gap-2">
                    {["X / Twitter", "LinkedIn", "Instagram", "Newsletter"].map(p => (
                      <button key={p} className="px-3 py-1.5 rounded-lg border border-zinc-800/30 text-[11px] text-zinc-400 hover:text-zinc-200 hover:border-zinc-700/40 font-medium transition-all">{p}</button>
                    ))}
                  </div>
                </div>
                <div>
                  <div className={`${geistMono.className} text-[10px] text-zinc-600 uppercase tracking-widest mb-3`}>Engagement Score</div>
                  <div className="flex items-center gap-3">
                    <div className="flex-1 h-2 bg-zinc-900 rounded-full overflow-hidden">
                      <div className="h-full w-[72%] bg-gradient-to-r from-cyan-500 to-green-400 rounded-full" />
                    </div>
                    <span className={`${geistMono.className} text-[13px] text-green-400 font-bold`}>72</span>
                  </div>
                </div>
                <div>
                  <div className={`${geistMono.className} text-[10px] text-zinc-600 uppercase tracking-widest mb-3`}>Quick Generate</div>
                  {["Hook variants", "CTA options", "Headline alternatives", "Carousel outline"].map(a => (
                    <button key={a} className="w-full px-4 py-2 rounded-lg border border-zinc-800/25 hover:border-zinc-700/30 hover:bg-zinc-800/15 text-[12px] text-zinc-400 hover:text-zinc-200 font-medium transition-all mb-1.5 text-left">{a}</button>
                  ))}
                </div>
              </>
            )}

            {mode === "compare" && (
              <>
                <div>
                  <div className={`${geistMono.className} text-[10px] text-zinc-600 uppercase tracking-widest mb-3`}>Sources Analyzed</div>
                  {["Source A", "Source B", "Source C"].map((s, i) => (
                    <div key={i} className="flex items-center gap-3 px-3 py-2 text-[13px] text-zinc-400 font-medium">
                      <span className={`${geistMono.className} text-[11px] text-cyan-500/60`}>{i + 1}</span>
                      {s}
                    </div>
                  ))}
                </div>
                <div>
                  <div className={`${geistMono.className} text-[10px] text-zinc-600 uppercase tracking-widest mb-3`}>Analysis Tools</div>
                  {["Contradiction detector", "Pattern extraction", "Unified synthesis", "Add another source"].map(a => (
                    <button key={a} className="w-full px-4 py-2 rounded-lg border border-zinc-800/25 hover:border-zinc-700/30 hover:bg-zinc-800/15 text-[12px] text-zinc-400 hover:text-zinc-200 font-medium transition-all mb-1.5 text-left">{a}</button>
                  ))}
                </div>
              </>
            )}
          </div>
        </aside>
      )}
    </div>
  );
}
