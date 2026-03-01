"use client";

import React, { useRef, useEffect, useState, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { Geist_Mono, Funnel_Display } from "next/font/google";
import { ArrowLeft, RotateCcw, ChevronRight, CheckCircle2, XCircle, Sparkles, Plus, AlertCircle } from "lucide-react";
import { ScriblMotionPlayer } from "@scriblmotion/react";
import { SVGRenderer } from "@scriblmotion/svg";
import { blockchainLessonPayload } from "./blockchain-lesson";
import { summationLessonPayload } from "./summation-lesson";

const geistMono = Geist_Mono({ subsets: ["latin"] });
const funnelDisplay = Funnel_Display({ subsets: ["latin"], weight: ["700", "800"] });

/* ─────────────────────────────────────────────────────────────────────────────
   WIDGET 1 — UNIT CIRCLE (Trig lesson)
───────────────────────────────────────────────────────────────────────────── */
function UnitCircleWidget() {
    const svgRef = useRef<SVGSVGElement>(null);
    const [angle, setAngle] = useState(35);
    const [dragging, setDragging] = useState(false);

    const CX = 160, CY = 160, R = 110;
    const rad = (angle * Math.PI) / 180;
    const px = CX + R * Math.cos(rad);
    const py = CY - R * Math.sin(rad);
    const sinVal = Math.sin(rad);
    const cosVal = Math.cos(rad);
    const tanVal = Math.tan(rad);

    const onPointerMove = useCallback((e: PointerEvent) => {
        if (!dragging || !svgRef.current) return;
        const rect = svgRef.current.getBoundingClientRect();
        const mx = (e.clientX - rect.left) * (320 / rect.width) - CX;
        const my = CY - (e.clientY - rect.top) * (320 / rect.height);
        const a = Math.atan2(my, mx) * (180 / Math.PI);
        setAngle(((a % 360) + 360) % 360);
    }, [dragging]);

    const onPointerUp = useCallback(() => setDragging(false), []);

    useEffect(() => {
        window.addEventListener("pointermove", onPointerMove);
        window.addEventListener("pointerup", onPointerUp);
        return () => { window.removeEventListener("pointermove", onPointerMove); window.removeEventListener("pointerup", onPointerUp); };
    }, [onPointerMove, onPointerUp]);

    const cosX = CX + cosVal * R;
    const showTan = Math.abs(tanVal) < 4;

    return (
        <div className="flex flex-col md:flex-row items-start gap-6">
            <div className="relative shrink-0">
                <svg ref={svgRef} viewBox="0 0 320 320" width={280} height={280}
                    className="rounded-xl border border-zinc-800/60 bg-[#0d0d10] cursor-pointer select-none"
                    style={{ touchAction: "none" }}>
                    {[-R, -R / 2, 0, R / 2, R].map(o => (
                        <g key={o}>
                            <line x1={CX + o} y1={CY - R - 10} x2={CX + o} y2={CY + R + 10} stroke="#27272a" strokeWidth="0.5" />
                            <line x1={CX - R - 10} y1={CY + o} x2={CX + R + 10} y2={CY + o} stroke="#27272a" strokeWidth="0.5" />
                        </g>
                    ))}
                    <line x1={CX - R - 16} y1={CY} x2={CX + R + 16} y2={CY} stroke="#3f3f46" strokeWidth="1" />
                    <line x1={CX} y1={CY - R - 16} x2={CX} y2={CY + R + 16} stroke="#3f3f46" strokeWidth="1" />
                    <text x={CX + R + 18} y={CY + 4} fill="#52525b" fontSize="10" fontFamily="monospace">x</text>
                    <text x={CX - 4} y={CY - R - 18} fill="#52525b" fontSize="10" fontFamily="monospace">y</text>
                    <circle cx={CX} cy={CY} r={R} fill="none" stroke="#27272a" strokeWidth="1.5" />
                    {(() => {
                        const ar = Math.min(R * 0.35, 42); const ax = CX + ar * Math.cos(rad); const ay = CY - ar * Math.sin(rad);
                        return <path d={`M ${CX + ar} ${CY} A ${ar} ${ar} 0 ${angle > 180 ? 1 : 0} 0 ${ax} ${ay}`} fill="rgba(234,179,8,0.08)" stroke="rgba(234,179,8,0.5)" strokeWidth="1.5" />;
                    })()}
                    <text x={CX + 34 * Math.cos(rad / 2)} y={CY - 34 * Math.sin(rad / 2) + 4} fill="#eab308" fontSize="10" fontFamily="monospace">θ</text>
                    <line x1={CX} y1={CY} x2={cosX} y2={CY} stroke="#22d3ee" strokeWidth="2" strokeDasharray="4 3" />
                    <text x={(CX + cosX) / 2 - 6} y={CY + 14} fill="#22d3ee" fontSize="9" fontFamily="monospace">cos θ</text>
                    <line x1={px} y1={py} x2={px} y2={CY} stroke="#a78bfa" strokeWidth="2" strokeDasharray="4 3" />
                    <text x={px + 5} y={(py + CY) / 2 + 4} fill="#a78bfa" fontSize="9" fontFamily="monospace">sin θ</text>
                    <line x1={CX} y1={CY} x2={px} y2={py} stroke="#f4f4f5" strokeWidth="2" />
                    {showTan && <>
                        <line x1={CX + R} y1={CY} x2={CX + R} y2={CY - tanVal * R} stroke="#fb923c" strokeWidth="2" strokeDasharray="4 3" />
                        <text x={CX + R + 5} y={CY - tanVal * R / 2 + 3} fill="#fb923c" fontSize="9" fontFamily="monospace">tan θ</text>
                    </>}
                    <circle cx={px} cy={py} r={8} fill="#f4f4f5" stroke="#22d3ee" strokeWidth="2"
                        className="cursor-grab active:cursor-grabbing" onPointerDown={e => { e.preventDefault(); setDragging(true) }} />
                    <circle cx={px} cy={py} r={3} fill="#22d3ee" />
                    <circle cx={CX} cy={CY} r={3} fill="#52525b" />
                </svg>
                <p className="text-[10px] text-zinc-600 text-center mt-1.5 font-mono">Drag the white point to explore</p>
            </div>
            <div className="flex flex-col gap-3 min-w-[180px]">
                <div className={`${geistMono.className} text-[10px] text-zinc-500 uppercase tracking-widest mb-1`}>Live Values</div>
                {[
                    { label: "θ (angle)", value: `${angle.toFixed(1)}°`, color: "text-yellow-400", bg: "bg-yellow-400/5 border-yellow-400/20" },
                    { label: "cos θ (x)", value: cosVal.toFixed(4), color: "text-cyan-400", bg: "bg-cyan-400/5 border-cyan-400/20" },
                    { label: "sin θ (y)", value: sinVal.toFixed(4), color: "text-violet-400", bg: "bg-violet-400/5 border-violet-400/20" },
                    { label: "tan θ", value: showTan ? tanVal.toFixed(4) : "undefined", color: "text-orange-400", bg: "bg-orange-400/5 border-orange-400/20" },
                ].map(({ label, value, color, bg }) => (
                    <div key={label} className={`rounded-xl border px-4 py-3 ${bg}`}>
                        <div className={`${geistMono.className} text-[9px] text-zinc-500 uppercase tracking-wider mb-1`}>{label}</div>
                        <div className={`${geistMono.className} text-[18px] font-bold ${color}`}>{value}</div>
                    </div>
                ))}
                <div className={`${geistMono.className} text-[9px] text-zinc-600 leading-relaxed mt-2 border border-zinc-800/40 rounded-xl px-3 py-2`}>
                    sin²θ + cos²θ = {(sinVal ** 2 + cosVal ** 2).toFixed(4)}
                </div>
                <button onClick={() => setAngle(35)} className="flex items-center gap-1.5 text-[10px] text-zinc-500 hover:text-zinc-300 transition-colors mt-1">
                    <RotateCcw size={11} /> Reset
                </button>
            </div>
        </div>
    );
}

/* ─────────────────────────────────────────────────────────────────────────────
   WIDGET 2 — SUMMATION BUILDER (Summation lesson)
   Step-through and slider modes. Shows Σ(i=1 to N) of i with animated bars.
───────────────────────────────────────────────────────────────────────────── */
function SummationWidget() {
    return (
        <div className="w-full flex justify-center w-full">
            <ScriblMotionPlayer
                payload={summationLessonPayload}
                autoPlay={false} // Managed by slider input
                rendererFactory={() => new SVGRenderer()}
                svgClassName="w-full h-full min-h-[460px] rounded-xl border border-zinc-800/60 bg-[#09090b] shadow-xl overflow-hidden"
            />
        </div>
    );
}

/* ─────────────────────────────────────────────────────────────────────────────
   WIDGET 3 — SUMMATION QUIZ WITH TARGETED FEEDBACK
   Each wrong answer has a custom explanation — exactly how ScriblMotion
   will surface per-misconception feedback in production.
───────────────────────────────────────────────────────────────────────────── */
interface FeedbackQuizProps {
    question: string;
    notation: string;
    options: Array<{ value: string; feedback?: string; }>;
    correctIndex: number;
}

function FeedbackQuiz({ question, notation, options, correctIndex }: FeedbackQuizProps) {
    const [selected, setSelected] = useState<number | null>(null);
    const [shaking, setShaking] = useState<number | null>(null);
    const answered = selected !== null;
    const isCorrect = selected === correctIndex;

    const handleSelect = (i: number) => {
        if (answered) return;
        setSelected(i);
        if (i !== correctIndex) {
            setShaking(i);
            setTimeout(() => setShaking(null), 500);
        }
    };

    const retry = () => setSelected(null);

    return (
        <div className="rounded-2xl border border-zinc-800/60 bg-zinc-900/30 p-5 space-y-4 max-w-lg">
            {/* Header */}
            <div className="flex items-center gap-2">
                <div className="size-5 rounded-full bg-yellow-400/10 border border-yellow-400/30 flex items-center justify-center">
                    <span className="text-[10px] text-yellow-400">Σ</span>
                </div>
                <span className={`${geistMono.className} text-[10px] text-yellow-400/70 uppercase tracking-widest`}>Summation Check</span>
                {answered && !isCorrect && (
                    <button onClick={retry} className={`${geistMono.className} ml-auto flex items-center gap-1 text-[10px] text-zinc-500 hover:text-zinc-200 transition-colors`}>
                        <RotateCcw size={10} /> Try again
                    </button>
                )}
            </div>

            {/* Question */}
            <div>
                <p className="text-[14px] text-zinc-200 font-medium leading-relaxed">{question}</p>
                <div className={`${geistMono.className} mt-2 text-[18px] text-cyan-300 px-4 py-2 bg-cyan-500/5 border border-cyan-500/15 rounded-xl w-fit`}>
                    {notation}
                </div>
            </div>

            {/* Options */}
            <div className="grid grid-cols-2 gap-2">
                {options.map((opt, i) => {
                    const isOpt = i === selected;
                    const isRight = i === correctIndex;
                    const isWrong = isOpt && !isRight;
                    const isShaking = shaking === i;

                    const border = !answered
                        ? "border-zinc-800/60 hover:border-zinc-600/60 hover:bg-zinc-800/40 cursor-pointer"
                        : isRight
                            ? "border-green-500/50 bg-green-500/10"
                            : isOpt
                                ? "border-red-500/50 bg-red-500/10"
                                : "border-zinc-800/30 opacity-40";

                    const textColor = !answered
                        ? "text-zinc-300"
                        : isRight
                            ? "text-green-400"
                            : isOpt
                                ? "text-red-400"
                                : "text-zinc-500";

                    return (
                        <button
                            key={i}
                            onClick={() => handleSelect(i)}
                            className={`rounded-xl border px-4 py-3 text-left transition-all ${border} ${textColor} ${isShaking ? "animate-[shake_0.4s_ease]" : ""}`}
                            style={isShaking ? { animation: "shake 0.4s ease" } : {}}
                        >
                            <span className="flex items-center gap-2">
                                {answered && isRight && <CheckCircle2 size={13} className="text-green-400 shrink-0" />}
                                {answered && isWrong && <XCircle size={13} className="text-red-400 shrink-0" />}
                                <span className={`${geistMono.className} text-[15px] font-bold`}>{opt.value}</span>
                            </span>
                        </button>
                    );
                })}
            </div>

            {/* Targeted feedback panel — the ScriblMotion feedback engine */}
            {answered && (
                <div className={`rounded-xl border p-4 space-y-2 transition-all ${isCorrect ? "border-green-500/30 bg-green-500/5" : "border-amber-500/30 bg-amber-500/5"}`}>
                    <div className="flex items-start gap-2.5">
                        {isCorrect
                            ? <CheckCircle2 size={15} className="text-green-400 mt-0.5 shrink-0" />
                            : <AlertCircle size={15} className="text-amber-400 mt-0.5 shrink-0" />
                        }
                        <div className="space-y-1">
                            <p className={`text-[13px] font-semibold ${isCorrect ? "text-green-300" : "text-amber-300"}`}>
                                {isCorrect ? "Correct!" : "Not quite — here's why:"}
                            </p>
                            <p className="text-[12px] text-zinc-400 leading-relaxed">
                                {isCorrect
                                    ? `✓ ${options[correctIndex]?.feedback ?? "Well done!"}`
                                    : options[selected ?? 0]?.feedback ?? "Try again."}
                            </p>
                        </div>
                    </div>
                </div>
            )}
            <style>{`
        @keyframes shake {
          0%,100%{transform:translateX(0)}
          20%{transform:translateX(-6px)}
          40%{transform:translateX(6px)}
          60%{transform:translateX(-4px)}
          80%{transform:translateX(4px)}
        }
      `}</style>
        </div>
    );
}

function KeyFormulas() {
    return (
        <div className="rounded-2xl border border-zinc-800/60 bg-zinc-900/20 p-5 space-y-3 max-w-sm">
            <div className={`${geistMono.className} text-[10px] text-zinc-500 uppercase tracking-widest`}>Key Identities</div>
            {[
                { label: "Pythagorean", formula: "sin²θ + cos²θ = 1" },
                { label: "Tangent", formula: "tan θ = sin θ / cos θ" },
                { label: "Reciprocal", formula: "csc θ = 1 / sin θ" },
                { label: "Reciprocal", formula: "sec θ = 1 / cos θ" },
            ].map(({ label, formula }, i) => (
                <div key={i} className="flex items-center justify-between gap-4">
                    <span className={`${geistMono.className} text-[9px] text-zinc-600 uppercase tracking-wider w-20 shrink-0`}>{label}</span>
                    <span className={`${geistMono.className} text-[13px] text-cyan-300 bg-cyan-500/5 border border-cyan-500/10 rounded-lg px-3 py-1`}>{formula}</span>
                </div>
            ))}
        </div>
    );
}

/* ─────────────────────────────────────────────────────────────────────────────
   CHAT MESSAGE SYSTEM
───────────────────────────────────────────────────────────────────────────── */
type MsgContent =
    | { type: "text"; text: string }
    | { type: "unit-circle" }
    | { type: "summation-widget" }
    | { type: "summation-quiz" }
    | { type: "trig-quiz" }
    | { type: "keyformulas" }
    | { type: "blockchain-widget" };

interface ChatMessage { role: "user" | "assistant"; content: MsgContent[]; }

const TRIG_CONVERSATION: ChatMessage[] = [
    { role: "user", content: [{ type: "text", text: "I want to learn trigonometry. Start from the basics." }] },
    {
        role: "assistant",
        content: [
            { type: "text", text: "Great choice! Let's start with the **unit circle** — it's the foundation of all trigonometry.\n\nImagine a circle with a radius of exactly **1**, centered at the origin. Any point on this circle is **(cos θ, sin θ)**, where **θ** is the angle from the positive x-axis.\n\nTry **dragging the white point** around the circle →" },
            { type: "unit-circle" },
            { type: "text", text: "Notice:\n• **cos θ** is the x-coordinate — how far left or right.\n• **sin θ** is the y-coordinate — how far up or down.\n• Both are always between **−1** and **1**.\n• **tan θ** shoots to infinity near 90° — dividing by zero!" },
        ],
    },
    { role: "user", content: [{ type: "text", text: "Where does tan come from exactly?" }] },
    {
        role: "assistant",
        content: [
            { type: "text", text: "**tan(θ) = sin(θ) / cos(θ)**\n\nGeometrically it's the segment on the vertical tangent line at x=1, from the x-axis to where the extended radius meets it. When θ→90°, cos(θ)→0 so tan blows up — it's **undefined at 90° and 270°**." },
            { type: "keyformulas" },
        ],
    },
    { role: "user", content: [{ type: "text", text: "Quiz me!" }] },
    {
        role: "assistant",
        content: [
            { type: "text", text: "Here's a quick check:" },
            { type: "trig-quiz" },
            { type: "text", text: "Next we can explore **SOH-CAH-TOA** and right-triangle ratios." },
        ],
    },
];

const SUMMATION_CONVERSATION: ChatMessage[] = [
    { role: "user", content: [{ type: "text", text: "Teach me summation notation — Σ." }] },
    {
        role: "assistant",
        content: [
            { type: "text", text: "Summation notation is a compact way to write repeated addition. The Greek letter **Σ (sigma)** means \"add these up\".\n\nThe expression below the Σ says **where to start** (i=1), the number above says **where to stop** (N), and the expression to the right is **what to add** on each step:\n\n> **Σ(i=1 to N) of i = 1 + 2 + 3 + … + N**\n\nUse the widget below to build up the sum one term at a time. Click **Add i=2**, then **Add i=3**, and watch both the bars and the total grow →" },
            { type: "summation-widget" },
            { type: "text", text: "There's also a **closed-form formula** due to Gauss: **N(N+1)/2**. Try N=10 in slider mode — the formula gives 55 instantly, matching the step-by-step sum." },
        ],
    },
    { role: "user", content: [{ type: "text", text: "So Σ(i=1 to 5) of i should be 15?" }] },
    {
        role: "assistant",
        content: [
            { type: "text", text: "Exactly right! Let's verify:\n\n> 1 + 2 + 3 + 4 + 5 = **15**\n\nAnd via Gauss: **5 × 6 / 2 = 15** ✓\n\nNow, what if instead of adding **i** we add **i²** each time? That's a different, harder formula — Σ(i=1 to N) of i² = **N(N+1)(2N+1)/6**. For N=5: 5×6×11/6 = **55**.\n\nLet me quiz you on the basics first:" },
            { type: "summation-quiz" },
            { type: "text", text: "After this, we can move into **Σ of i²**, geometric series, and eventually calculus's integral as a continuous limit of sums." },
        ],
    },
];

const BLOCKCHAIN_CONVERSATION: ChatMessage[] = [
    { role: "user", content: [{ type: "text", text: "How does a blockchain actually work? What makes it secure?" }] },
    {
        role: "assistant",
        content: [
            { type: "text", text: "At its core, a blockchain is just a chain of **Blocks**. Each block contains **Data** (like transactions), its own unique fingerprint called a **Hash**, and the **Previous Hash**.\n\nBy including the previous block's hash, any change to an old block breaks the cryptographic link for all subsequent blocks. Try mining the next block below →" },
            { type: "blockchain-widget" },
            { type: "text", text: "When you click 'Mine Next Block', the new block calculates its hash based on the Genesis Block's hash. This mathematical linkage creates the immutability blockchains are famous for." },
        ],
    },
];

function TrigQuizWidget() {
    const [sel, setSel] = useState<number | null>(null);
    const correct = 1;
    const answered = sel !== null;
    return (
        <div className="rounded-2xl border border-zinc-800/60 bg-zinc-900/30 p-5 space-y-4 max-w-md">
            <div className="flex items-center gap-2">
                <div className="size-5 rounded-full bg-yellow-400/10 border border-yellow-400/30 flex items-center justify-center"><span className="text-[10px] text-yellow-400">?</span></div>
                <span className={`${geistMono.className} text-[10px] text-yellow-400/70 uppercase tracking-widest`}>Quick Check</span>
            </div>
            <p className="text-[14px] text-zinc-200 font-medium">What is the value of sin(90°)?</p>
            <div className="grid grid-cols-2 gap-2">
                {["0", "1", "−1", "Undefined"].map((opt, i) => {
                    const isRight = i === correct; const isSel = i === sel;
                    return (
                        <button key={i} onClick={() => !answered && setSel(i)} className={`rounded-xl border px-4 py-2.5 text-[13px] font-medium transition-all ${!answered ? "border-zinc-800/60 bg-zinc-800/20 hover:bg-zinc-800/40 hover:border-zinc-700/60 cursor-pointer text-zinc-300" : isRight ? "border-green-500/40 bg-green-500/10 text-green-400" : isSel ? "border-red-500/40 bg-red-500/10 text-red-400" : "border-zinc-800/40 bg-zinc-900/10 opacity-50 text-zinc-500"}`}>
                            <span className="flex items-center gap-2">
                                {answered && isRight && <CheckCircle2 size={13} className="text-green-400" />}
                                {answered && isSel && !isRight && <XCircle size={13} className="text-red-400" />}
                                {opt}
                            </span>
                        </button>
                    );
                })}
            </div>
            {answered && <p className={`text-[12px] leading-relaxed ${sel === correct ? "text-green-400" : "text-zinc-400"}`}>
                {sel === correct ? "✓ At 90° the point is at the top of the unit circle, so y = 1." : `Not quite. At 90° the point sits at (0,1) — the top of the circle — so sin = 1.`}
            </p>}
        </div>
    );
}

function BlockchainWidget() {
    return (
        <div className="flex flex-col md:flex-row items-start gap-6">
            <div className="relative">
                <ScriblMotionPlayer
                    payload={blockchainLessonPayload}
                    svgClassName="rounded-xl border border-zinc-800/60 bg-[#0d0d10] cursor-pointer select-none"
                    className="w-full h-full min-h-[500px]"
                />
            </div>
        </div>
    );
}

function MessageBubble({ msg }: { msg: ChatMessage }) {
    const isUser = msg.role === "user";
    const renderContent = (c: MsgContent, i: number) => {
        if (c.type === "unit-circle") return (
            <div key={i} className="my-4">
                <div className="rounded-2xl border border-cyan-500/20 bg-cyan-500/5 p-5">
                    <div className="flex items-center gap-2 mb-4">
                        <div className="size-5 rounded-full bg-cyan-500/15 flex items-center justify-center"><Sparkles size={11} className="text-cyan-400" /></div>
                        <span className={`${geistMono.className} text-[10px] text-cyan-400/70 uppercase tracking-widest`}>ScriblMotion — Interactive Widget</span>
                    </div>
                    <UnitCircleWidget />
                </div>
            </div>
        );
        if (c.type === "summation-widget") return (
            <div key={i} className="my-4">
                <div className="rounded-2xl border border-cyan-500/20 bg-cyan-500/5 p-5">
                    <div className="flex items-center gap-2 mb-4">
                        <div className="size-5 rounded-full bg-cyan-500/15 flex items-center justify-center"><Sparkles size={11} className="text-cyan-400" /></div>
                        <span className={`${geistMono.className} text-[10px] text-cyan-400/70 uppercase tracking-widest`}>ScriblMotion — Summation Builder</span>
                    </div>
                    <SummationWidget />
                </div>
            </div>
        );
        if (c.type === "summation-quiz") return (
            <div key={i} className="my-4">
                <FeedbackQuiz
                    question="What is the value of this sum?"
                    notation="Σ(i=1 to 5) of i"
                    options={[
                        { value: "10", feedback: "You summed 1+2+3+4 = 10 but stopped one term early. The upper limit is N=5, so you need to include i=5 as well: 1+2+3+4+5 = 15." },
                        { value: "15", feedback: "1+2+3+4+5 = 15. You can also verify with Gauss: 5×6/2 = 15. ✓" },
                        { value: "20", feedback: "20 would be the sum if each term were multiplied by 2 (i.e., Σ 2i = 2+4+6+8+10). Here we simply add i, giving 1+2+3+4+5 = 15." },
                        { value: "25", feedback: "25 = 5². You may be thinking of Σ i² for a single term, or confusing this with Σ(i=1 to 5) of i² = 55. The plain sum is just 1+2+3+4+5 = 15." },
                    ]}
                    correctIndex={1}
                />
            </div>
        );
        if (c.type === "trig-quiz") return <div key={i} className="my-4"><TrigQuizWidget /></div>;
        if (c.type === "keyformulas") return <div key={i} className="my-4"><KeyFormulas /></div>;
        if (c.type === "blockchain-widget") return (
            <div key={i} className="my-4">
                <div className="rounded-2xl border border-cyan-500/20 bg-cyan-500/5 p-5">
                    <div className="flex items-center gap-2 mb-4">
                        <div className="size-5 rounded-full bg-cyan-500/15 flex items-center justify-center"><Sparkles size={11} className="text-cyan-400" /></div>
                        <span className={`${geistMono.className} text-[10px] text-cyan-400/70 uppercase tracking-widest`}>ScriblMotion — Blockchain Explorer</span>
                    </div>
                    <BlockchainWidget />
                </div>
            </div>
        );

        const lines = c.text.split("\n");
        return (
            <div key={i} className="space-y-2">
                {lines.map((line, li) => {
                    if (!line.trim()) return <div key={li} className="h-1" />;
                    if (line.startsWith(">")) return (
                        <blockquote key={li} className={`${geistMono.className} border-l-2 border-cyan-500/40 pl-4 py-1 text-[13px] text-cyan-300 bg-cyan-500/5 rounded-r-xl`}>
                            {line.replace(/^>\s*/, "").replace(/\*\*(.*?)\*\*/g, "$1")}
                        </blockquote>
                    );
                    if (line.startsWith("•")) return (
                        <div key={li} className="flex gap-2 text-[14px] text-zinc-300 leading-relaxed">
                            <span className="text-cyan-500 shrink-0 mt-0.5">•</span>
                            <span>{line.replace(/^•\s*/, "").split(/(\*\*.*?\*\*)/).map((p, j) => p.startsWith("**") ? <strong key={j} className="text-zinc-100 font-semibold">{p.replace(/\*\*/g, "")}</strong> : p)}</span>
                        </div>
                    );
                    return (
                        <p key={li} className="text-[14px] text-zinc-300 leading-relaxed">
                            {line.split(/(\*\*.*?\*\*)/).map((p, j) => p.startsWith("**") ? <strong key={j} className="text-zinc-100 font-semibold">{p.replace(/\*\*/g, "")}</strong> : p)}
                        </p>
                    );
                })}
            </div>
        );
    };

    if (isUser) return (
        <div className="flex justify-end">
            <div className="max-w-[70%] px-4 py-3 rounded-2xl rounded-tr-md bg-zinc-800/60 border border-zinc-700/40 text-[14px] text-zinc-200 leading-relaxed">
                {msg.content[0]?.type === "text" ? msg.content[0].text : ""}
            </div>
        </div>
    );

    return (
        <div className="flex gap-3 items-start">
            <div className="size-8 rounded-xl bg-zinc-100 flex items-center justify-center shrink-0 mt-1 shadow-lg shadow-cyan-500/10">
                <Image src="/ampo-icon-logo.png" alt="AmpoMind" width={20} height={20} />
            </div>
            <div className="flex-1 space-y-1">
                <span className={`${geistMono.className} text-[10px] text-zinc-600 uppercase tracking-widest`}>AmpoMind · Study Mode</span>
                <div className="space-y-0">{msg.content.map((c, i) => renderContent(c, i))}</div>
            </div>
        </div>
    );
}

/* ─────────────────────────────────────────────────────────────────────────────
   LESSON THREAD (reusable drip-feed shell)
───────────────────────────────────────────────────────────────────────────── */
function LessonThread({ conversation, title, emoji, subtitle }: {
    conversation: ChatMessage[];
    title: string;
    emoji: string;
    subtitle: string;
}) {
    const bottomRef = useRef<HTMLDivElement>(null);
    const [visibleCount, setVisibleCount] = useState(2);
    const [typing, setTyping] = useState(false);
    const visibleMessages = conversation.slice(0, visibleCount);

    const continueLesson = () => {
        if (visibleCount >= conversation.length) return;
        setTyping(true);
        setTimeout(() => {
            setTyping(false);
            setVisibleCount(v => v + 2);
            setTimeout(() => bottomRef.current?.scrollIntoView({ behavior: "smooth" }), 100);
        }, 1100);
    };

    return (
        <div className="space-y-10">
            {/* Topic banner */}
            <div className="flex items-center gap-4 p-4 rounded-2xl border border-zinc-800/40 bg-zinc-900/20">
                <div className="size-10 rounded-xl bg-yellow-400/10 border border-yellow-400/20 flex items-center justify-center text-lg">{emoji}</div>
                <div>
                    <div className={`${funnelDisplay.className} text-[18px] font-bold text-zinc-100`}>{title}</div>
                    <div className={`${geistMono.className} text-[10px] text-zinc-500 uppercase tracking-widest`}>{subtitle}</div>
                </div>
            </div>

            {visibleMessages.map((msg, i) => <MessageBubble key={i} msg={msg} />)}

            {typing && (
                <div className="flex gap-3 items-start">
                    <div className="size-8 rounded-xl bg-zinc-100 flex items-center justify-center shrink-0 shadow-lg">
                        <Image src="/ampo-icon-logo.png" alt="AmpoMind" width={20} height={20} />
                    </div>
                    <div className="flex items-center gap-1 px-4 py-3 rounded-2xl bg-zinc-800/40 border border-zinc-700/30">
                        {[0, 1, 2].map(i => <div key={i} className="size-1.5 rounded-full bg-zinc-500 animate-bounce" style={{ animationDelay: `${i * 0.15}s` }} />)}
                    </div>
                </div>
            )}

            <div className="flex items-center gap-4 pt-2">
                {visibleCount < conversation.length ? (
                    <button onClick={continueLesson} disabled={typing}
                        className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-zinc-100 text-[#0c0c0e] text-[13px] font-bold hover:bg-white transition-all disabled:opacity-50">
                        Continue lesson <ChevronRight size={15} />
                    </button>
                ) : (
                    <div className="flex items-center gap-3">
                        <div className="size-2 rounded-full bg-emerald-400" />
                        <span className={`${geistMono.className} text-[11px] text-zinc-500`}>Sample lesson complete.</span>
                    </div>
                )}
                <div ref={bottomRef} />
                <div className={`${geistMono.className} text-[10px] text-zinc-700 ml-auto`}>{visibleCount}/{conversation.length} msgs</div>
            </div>
        </div>
    );
}

/* ─────────────────────────────────────────────────────────────────────────────
   PAGE
───────────────────────────────────────────────────────────────────────────── */
const LESSONS = [
    { id: "trig", label: "Trigonometry", emoji: "📐", subtitle: "The Unit Circle · Interactive Lesson" },
    { id: "summation", label: "Summation", emoji: "Σ", subtitle: "Σ Notation · Interactive Lesson" },
    { id: "blockchain", label: "Blockchain", emoji: "⛓️", subtitle: "Blocks & Hashes · Interactive Lesson" },
];

export default function DemoPage() {
    const [activeLesson, setActiveLesson] = useState("trig");

    return (
        <div className="min-h-screen bg-[#0c0c0e] text-zinc-100 flex flex-col">
            {/* Header */}
            <header className="sticky top-0 z-50 h-12 flex items-center px-5 border-b border-zinc-800/60 bg-[#0c0c0e]/80 backdrop-blur-xl justify-between">
                <div className="flex items-center gap-3">
                    <Link href="/" className="flex items-center gap-1.5 text-zinc-500 hover:text-zinc-200 transition-colors">
                        <ArrowLeft size={15} /><span className="text-[12px] font-medium">Back</span>
                    </Link>
                    <span className="text-zinc-800">|</span>
                    <div className="flex items-center gap-2">
                        <div className="size-6 bg-zinc-100 rounded-md flex items-center justify-center">
                            <Image src="/ampo-icon-logo.png" alt="AmpoMind" width={14} height={14} />
                        </div>
                        <span className="text-[13px] font-semibold text-zinc-300">AmpoMind</span>
                    </div>
                </div>

                {/* Lesson tab switcher */}
                <div className="flex items-center gap-1 p-1 rounded-xl border border-zinc-800/60 bg-zinc-900/40">
                    {LESSONS.map(l => (
                        <button key={l.id} onClick={() => setActiveLesson(l.id)}
                            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[12px] font-semibold transition-all ${activeLesson === l.id ? "bg-zinc-100 text-[#0c0c0e] shadow-sm" : "text-zinc-500 hover:text-zinc-200"}`}>
                            <span>{l.emoji}</span> {l.label}
                        </button>
                    ))}
                </div>

                <div className="flex items-center gap-2">
                    <div className="size-2 rounded-full bg-emerald-400 animate-pulse" />
                    <span className={`${geistMono.className} text-[10px] text-zinc-500 uppercase tracking-widest`}>Study Session</span>
                </div>
            </header>

            {/* Content */}
            <main className="flex-1 max-w-3xl w-full mx-auto px-6 py-10">
                {activeLesson === "trig" && (
                    <LessonThread
                        key="trig"
                        conversation={TRIG_CONVERSATION}
                        title="Trigonometry — The Unit Circle"
                        emoji="📐"
                        subtitle="Study Mode · Interactive Lesson"
                    />
                )}
                {activeLesson === "summation" && (
                    <LessonThread
                        key="summation"
                        conversation={SUMMATION_CONVERSATION}
                        title="Summation — Σ Notation"
                        emoji="Σ"
                        subtitle="Study Mode · Interactive Lesson"
                    />
                )}
                {activeLesson === "blockchain" && (
                    <LessonThread
                        key="blockchain"
                        conversation={BLOCKCHAIN_CONVERSATION}
                        title="Blockchain Basics"
                        emoji="⛓️"
                        subtitle="Study Mode · Interactive Lesson"
                    />
                )}
            </main>
        </div>
    );
}
