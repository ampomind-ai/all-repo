"use client";

import React, { useState, useEffect, useRef } from "react";
import gsap from "gsap";

interface AnimatedHeroTextProps {
    roles: string[];
}

export const AnimatedHeroText: React.FC<AnimatedHeroTextProps> = ({ roles }) => {
    const [index, setIndex] = useState(0);
    const textRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const timer = setInterval(() => {
            // Step 1: Animation out
            gsap.to(textRef.current, {
                y: -40,
                opacity: 0,
                duration: 0.4,
                ease: "power2.in",
                onComplete: () => {
                    // Step 2: Change text
                    setIndex((prev) => (prev + 1) % roles.length);
                    // Step 3: Animation in
                    gsap.fromTo(textRef.current,
                        { y: 40, opacity: 0 },
                        { y: 0, opacity: 1, duration: 0.6, ease: "power3.out" }
                    );
                }
            });
        }, 3000);
        return () => clearInterval(timer);
    }, [roles.length]);

    return (
        <div className="relative h-full flex items-center justify-center overflow-hidden w-full">
            <div
                ref={textRef}
                className="whitespace-nowrap inline-block"
            >
                {roles[index]}
            </div>
        </div>
    );
};
