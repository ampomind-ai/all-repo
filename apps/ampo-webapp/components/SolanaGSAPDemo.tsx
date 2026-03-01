"use client";

import React, { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { Play, Pause, RotateCcw } from "lucide-react";

export function SolanaGSAPDemo() {
    const containerRef = useRef<HTMLDivElement>(null);
    const hashNodesRef = useRef<(SVGCircleElement | null)[]>([]);
    const pathsRef = useRef<(SVGPathElement | null)[]>([]);
    const timelineRef = useRef<gsap.core.Timeline | null>(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentHash, setCurrentHash] = useState("0000000000000000");

    const colors = {
        ring: "rgba(168, 85, 247, 0.4)", // Purple
        activeRing: "rgba(6, 182, 212, 1)", // Cyan
        node: "rgba(9, 9, 11, 1)", // Zinc 950
        text: "rgba(228, 228, 231, 1)", // Zinc 200
    };

    useEffect(() => {
        // Generate SVG path for a circular layout
        pathsRef.current.forEach((path, i) => {
            if (!path) return;
            const radius = 120;
            const cx = 200;
            const cy = 200;
            const segments = 12;
            const angle1 = (i / segments) * 2 * Math.PI - Math.PI / 2;
            const angle2 = ((i + 1) / segments) * 2 * Math.PI - Math.PI / 2;

            const x1 = cx + radius * Math.cos(angle1);
            const y1 = cy + radius * Math.sin(angle1);
            const x2 = cx + radius * Math.cos(angle2);
            const y2 = cy + radius * Math.sin(angle2);

            // Sweep flag for outer curve
            path.setAttribute("d", `M ${x1} ${y1} A ${radius} ${radius} 0 0 1 ${x2} ${y2}`);
        });

        // Create the GSAP animation timeline
        const ctx = gsap.context(() => {
            const tl = gsap.timeline({ paused: true, repeat: -1 });

            const nodes = hashNodesRef.current.filter(Boolean);
            const paths = pathsRef.current.filter(Boolean);

            // Function to generate fake SHA-256 hashes
            const generateHash = () => Math.random().toString(16).substring(2, 18).toUpperCase();

            nodes.forEach((node, i) => {
                const nextNode = nodes[(i + 1) % nodes.length];
                const path = paths[i];

                // Animate the path stroke drawing
                if (path) {
                    const length = path.getTotalLength();
                    gsap.set(path, { strokeDasharray: length, strokeDashoffset: length });
                    tl.to(path, {
                        strokeDashoffset: 0,
                        stroke: colors.activeRing,
                        duration: 0.4,
                        ease: "power1.inOut",
                        onStart: () => setCurrentHash(generateHash()),
                    });
                }

                // Pulse the next node
                if (nextNode) {
                    tl.to(nextNode, {
                        fill: colors.activeRing,
                        attr: { r: 18 },
                        duration: 0.1,
                        yoyo: true,
                        repeat: 1
                    }, "-=0.1");
                }
            });

            timelineRef.current = tl;
        }, containerRef);

        return () => ctx.revert();
    }, []);

    const togglePlay = () => {
        if (timelineRef.current) {
            if (isPlaying) {
                timelineRef.current.pause();
            } else {
                timelineRef.current.play();
            }
            setIsPlaying(!isPlaying);
        }
    };

    const reset = () => {
        if (timelineRef.current) {
            timelineRef.current.pause();
            timelineRef.current.progress(0);
            setIsPlaying(false);
            setCurrentHash("0000000000000000");
        }
    };

    return (
        <div className="w-full mx-auto bg-zinc-950/50 backdrop-blur-xl flex flex-col">

            {/* Simulation Box */}
            <div className="w-full p-6 flex flex-col items-center justify-center relative" ref={containerRef}>
                <div className="absolute top-4 left-4 text-[10px] font-mono text-zinc-500 uppercase tracking-widest">
                    PoH Generator
                </div>

                <svg width="240" height="240" viewBox="0 0 400 400" className="w-full h-auto max-w-[220px] mb-6 mt-4">
                    {/* Base Ring */}
                    <circle cx="200" cy="200" r="120" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="4" />

                    {/* Animated Paths */}
                    {Array.from({ length: 12 }).map((_, i) => (
                        <path
                            key={`path-${i}`}
                            ref={(el) => { pathsRef.current[i] = el; }}
                            fill="none"
                            stroke={colors.ring}
                            strokeWidth="4"
                            strokeLinecap="round"
                        />
                    ))}

                    {/* Nodes */}
                    {Array.from({ length: 12 }).map((_, i) => {
                        const angle = (i / 12) * 2 * Math.PI - Math.PI / 2;
                        const x = 200 + 120 * Math.cos(angle);
                        const y = 200 + 120 * Math.sin(angle);
                        return (
                            <g key={`node-${i}`}>
                                <circle
                                    ref={(el) => { hashNodesRef.current[i] = el; }}
                                    cx={x}
                                    cy={y}
                                    r="12"
                                    fill={colors.node}
                                    stroke={colors.ring}
                                    strokeWidth="3"
                                />
                                {/* Node labels (1, 2, 3...) */}
                                {i % 3 === 0 && (
                                    <text x={x} y={y} dy="4" textAnchor="middle" fontSize="10" fill={colors.text} className="font-mono">
                                        T{i}
                                    </text>
                                )}
                            </g>
                        );
                    })}
                </svg>

                {/* Status & Controls Row */}
                <div className="w-full flex flex-col sm:flex-row items-center justify-between gap-4 bg-zinc-900/50 p-3 rounded-xl border border-zinc-800/80">

                    {/* Hash Display */}
                    <div className="flex-1 flex flex-col text-left">
                        <div className="text-[10px] uppercase font-mono text-zinc-500 mb-1 flex items-center gap-2">
                            Current Hash
                            {isPlaying && <div className="size-1.5 rounded-full bg-emerald-500 animate-pulse" />}
                        </div>
                        <div className="font-mono text-xs text-cyan-400 font-bold overflow-hidden text-ellipsis whitespace-nowrap max-w-[130px]" title={currentHash}>
                            {currentHash}
                        </div>
                    </div>

                    {/* Controls */}
                    <div className="flex gap-2 shrink-0">
                        <button
                            onClick={reset}
                            className="size-9 rounded-lg bg-zinc-800 border border-zinc-700 flex items-center justify-center text-zinc-400 hover:text-white hover:border-zinc-600 transition-colors"
                        >
                            <RotateCcw size={14} />
                        </button>
                        <button
                            onClick={togglePlay}
                            className="h-9 px-4 rounded-lg bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 hover:bg-cyan-500/20 transition-colors text-xs font-bold tracking-wide"
                        >
                            {isPlaying ? <Pause size={14} className="mr-1.5" /> : <Play size={14} className="mr-1.5" />}
                            {isPlaying ? "PAUSE" : "RUN"}
                        </button>
                    </div>

                </div>

            </div>
        </div>
    );
}
