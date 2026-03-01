"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "ui";
import { Funnel_Display, Geist_Mono } from "next/font/google";

const funnelDisplay = Funnel_Display({
    subsets: ["latin"],
    weight: ["300", "400", "500", "600", "700", "800"],
});

const geistMono = Geist_Mono({
    subsets: ["latin"],
});

const tiers = [
    {
        name: "Free",
        price: "$0",
        period: "forever",
        description: "Get started with essential research tools.",
        cta: "Get Started Free",
        highlight: false,
        features: [
            { text: "Smart Summaries", included: true, detail: "Up to 20 per day" },
            { text: "Article Extraction", included: true, detail: "Unlimited" },
            { text: "Video Summaries", included: true, detail: "Up to 5 per day" },
            { text: "Connected Notes", included: true, detail: "Up to 50 notes" },
            { text: "Export to Markdown", included: true, detail: "" },
            { text: "Browser Sidebar", included: true, detail: "" },
            { text: "Priority Support", included: false, detail: "" },
            { text: "Team Workspace", included: false, detail: "" },
            { text: "API Access", included: false, detail: "" },
            { text: "Custom AI Models", included: false, detail: "" },
        ],
    },
    {
        name: "Pro",
        price: "$9",
        period: "per month",
        description: "Unlimited power for serious researchers.",
        cta: "Start 14-Day Trial",
        highlight: true,
        features: [
            { text: "Smart Summaries", included: true, detail: "Unlimited" },
            { text: "Article Extraction", included: true, detail: "Unlimited" },
            { text: "Video Summaries", included: true, detail: "Unlimited" },
            { text: "Connected Notes", included: true, detail: "Unlimited" },
            { text: "Export to Markdown", included: true, detail: "" },
            { text: "Browser Sidebar", included: true, detail: "" },
            { text: "Priority Support", included: true, detail: "Email & Chat" },
            { text: "Advanced Analytics", included: true, detail: "Reading insights" },
            { text: "API Access", included: false, detail: "" },
            { text: "Custom AI Models", included: false, detail: "" },
        ],
    },
    {
        name: "Team",
        price: "$24",
        period: "per user / month",
        description: "Collaborate across your research group.",
        cta: "Contact Sales",
        highlight: false,
        features: [
            { text: "Smart Summaries", included: true, detail: "Unlimited" },
            { text: "Article Extraction", included: true, detail: "Unlimited" },
            { text: "Video Summaries", included: true, detail: "Unlimited" },
            { text: "Connected Notes", included: true, detail: "Unlimited" },
            { text: "Export to Markdown", included: true, detail: "" },
            { text: "Browser Sidebar", included: true, detail: "" },
            { text: "Priority Support", included: true, detail: "Dedicated Slack" },
            { text: "Team Workspace", included: true, detail: "Shared notes & insights" },
            { text: "API Access", included: true, detail: "Full REST API" },
            { text: "Custom AI Models", included: true, detail: "Bring your own key" },
        ],
    },
];

export default function PricingPage() {
    return (
        <div className="flex min-h-screen flex-col bg-[#0f0f11] text-zinc-100 font-sans antialiased">
            {/* Header */}
            <header className="sticky top-0 z-50 w-full bg-[#0f0f11]/80 border-b border-zinc-800/80 backdrop-blur-xl">
                <div className="w-[70%] max-w-[1400px] mx-auto h-12 flex items-center justify-between px-4 md:px-0">
                    <Link href="/landing" className="flex items-center gap-3">
                        <div className="size-8 bg-zinc-100 rounded-md flex items-center justify-center">
                            <Image src="/ampo-icon-logo.png" alt="Icon" width={20} height={20} />
                        </div>
                        <span className="text-[14px] font-bold tracking-tight text-white">AmpoMind</span>
                    </Link>
                    <div className="flex items-center gap-6">
                        <nav className="hidden lg:flex gap-8 text-[11px] font-medium text-zinc-400">
                            <Link href="/landing#features" className="hover:text-white transition-colors">Features</Link>
                            <Link href="/pricing" className="text-white">Pricing</Link>
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

            <main className="w-[70%] max-w-[1400px] mx-auto flex flex-col relative z-10 px-4 md:px-0 py-20">
                {/* Hero */}
                <div className="text-center mb-20">
                    <div className={`${geistMono.className} text-[10px] text-cyan-400 uppercase tracking-[0.25em] mb-4`}>
                        Pricing
                    </div>
                    <h1 className={`${funnelDisplay.className} text-[3rem] md:text-[4rem] font-black tracking-[-0.03em] leading-[1.1] text-zinc-100 mb-6`}>
                        Simple, transparent pricing.
                    </h1>
                    <p className="text-[17px] text-zinc-400 font-medium max-w-xl mx-auto leading-relaxed">
                        Start free. Upgrade when you need unlimited summaries, connected notes, and priority support.
                    </p>
                </div>

                {/* Pricing Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-1 mb-24">
                    {tiers.map((tier) => (
                        <div
                            key={tier.name}
                            className={`flex flex-col p-8 border transition-all ${tier.highlight
                                ? "border-cyan-500/40 bg-cyan-500/[0.03] shadow-lg shadow-cyan-500/5"
                                : "border-zinc-800/60 bg-zinc-900/10"
                                }`}
                        >
                            {/* Tier header */}
                            <div className="mb-8">
                                {tier.highlight && (
                                    <div className="flex items-center gap-2 mb-4">
                                        <span className="size-1 rounded-full bg-cyan-400 animate-pulse" />
                                        <span className={`${geistMono.className} text-[9px] text-cyan-400 uppercase tracking-[0.2em] font-bold`}>
                                            Most Popular
                                        </span>
                                    </div>
                                )}
                                <h3 className="text-[22px] font-bold text-zinc-100 tracking-tight mb-2">
                                    {tier.name}
                                </h3>
                                <div className="flex items-baseline gap-1.5 mb-3">
                                    <span className={`${funnelDisplay.className} text-[2.5rem] font-black text-zinc-100`}>
                                        {tier.price}
                                    </span>
                                    <span className="text-[13px] text-zinc-500 font-medium">
                                        {tier.period}
                                    </span>
                                </div>
                                <p className="text-[14px] text-zinc-400 font-medium leading-relaxed">
                                    {tier.description}
                                </p>
                            </div>

                            {/* CTA */}
                            <Button
                                className={`w-full h-10 rounded-md text-[12px] font-bold uppercase tracking-widest mb-8 transition-all ${tier.highlight
                                    ? "bg-zinc-100 text-[#0c0c0e] hover:bg-white shadow-lg shadow-cyan-500/10"
                                    : "bg-zinc-800/80 text-zinc-300 hover:bg-zinc-800 border border-zinc-700/60"
                                    }`}
                            >
                                {tier.cta}
                            </Button>

                            {/* Feature list */}
                            <div className="flex-1 space-y-0">
                                <div className={`${geistMono.className} text-[9px] text-zinc-600 uppercase tracking-widest mb-4 pb-3 border-b border-zinc-800/40`}>
                                    What's included
                                </div>
                                {tier.features.map((feature) => (
                                    <div
                                        key={feature.text}
                                        className="flex items-start gap-3 py-2.5 border-b border-zinc-800/20 last:border-none"
                                    >
                                        {/* Check / X icon */}
                                        {feature.included ? (
                                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="text-cyan-500 mt-0.5 shrink-0">
                                                <polyline points="20 6 9 17 4 12" />
                                            </svg>
                                        ) : (
                                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-zinc-700 mt-0.5 shrink-0">
                                                <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
                                            </svg>
                                        )}
                                        <div className="flex flex-col">
                                            <span className={`text-[13px] font-medium ${feature.included ? "text-zinc-300" : "text-zinc-600"}`}>
                                                {feature.text}
                                            </span>
                                            {feature.detail && (
                                                <span className={`${geistMono.className} text-[10px] ${feature.included ? "text-zinc-500" : "text-zinc-700"}`}>
                                                    {feature.detail}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>

                {/* FAQ / Bottom CTA */}
                <div className="text-center border-t border-zinc-800/40 pt-20">
                    <h2 className={`${funnelDisplay.className} text-2xl font-bold text-zinc-100 mb-4`}>
                        Questions?
                    </h2>
                    <p className="text-zinc-400 text-[15px] font-medium mb-8 max-w-md mx-auto">
                        We're here to help. Reach out to our team for any questions about pricing, features, or enterprise needs.
                    </p>
                    <div className="flex justify-center gap-4">
                        <Button variant="outline" className="h-10 px-6 rounded-md border-zinc-800 text-zinc-400 text-[12px] font-bold hover:text-white hover:bg-zinc-900">
                            Contact Support
                        </Button>
                        <Button className="h-10 px-6 rounded-md bg-zinc-100 text-[#0c0c0e] text-[12px] font-bold hover:bg-white">
                            Start Free
                        </Button>
                    </div>
                </div>
            </main>

            {/* Footer */}
            <footer className="w-[70%] max-w-[1400px] mx-auto pt-20 pb-12 border-t border-zinc-800/40 mt-auto">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="size-6 bg-zinc-100 rounded-sm flex items-center justify-center">
                            <Image src="/ampo-icon-logo.png" alt="AmpoMind" width={14} height={14} />
                        </div>
                        <span className="text-[13px] font-bold text-zinc-400">AmpoMind</span>
                    </div>
                    <div className={`${geistMono.className} text-[9px] text-zinc-700 uppercase tracking-[0.2em]`}>
                        © 2026 Ampomind Labs
                    </div>
                </div>
            </footer>
        </div>
    );
}
