"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

export function AnimatedHeroText({ roles, className = "" }: { roles: string[]; className?: string }) {
    const containerRef = useRef<HTMLDivElement>(null);

    useGSAP(() => {
        if (!containerRef.current) return;

        // Select all the role spans rendered by React
        const chars = containerRef.current.querySelectorAll('.role-span');

        const tl = gsap.timeline({ repeat: -1 });

        chars.forEach((char) => {
            tl.fromTo(char,
                { y: 40, opacity: 0, filter: "blur(12px)", scale: 0.95 },
                { y: 0, opacity: 1, filter: "blur(0px)", scale: 1, duration: 1.2, ease: "power3.out" }
            )
                .to({}, { duration: 2.5 }) // Hold text
                .to(char, { y: -40, opacity: 0, filter: "blur(12px)", scale: 1.05, duration: 0.8, ease: "power3.inOut" }, "+=0.1");
        });

    }, { scope: containerRef });

    return (
        <div
            ref={containerRef}
            className={`relative inline-flex items-baseline overflow-visible ${className}`}
        >
            {/* Hidden placeholder ensures the container matches the width of the longest role perfectly */}
            <span className="opacity-0 pointer-events-none select-none whitespace-nowrap">
                {roles.reduce((a, b) => a.length > b.length ? a : b)}
            </span>

            {/* Absolute container for the animated words */}
            <span className="absolute left-1/2 -translate-x-1/2 top-0 bottom-0 flex items-center justify-center pointer-events-none">
                {roles.map((role, idx) => (
                    <span
                        key={idx}
                        className="role-span absolute left-1/2 -translate-x-1/2 opacity-0 transform-gpu text-zinc-900 whitespace-nowrap will-change-transform"
                    >
                        {role}
                    </span>
                ))}
            </span>
        </div>
    );
}
