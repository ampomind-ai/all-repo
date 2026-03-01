"use client";

import React, { useState, useEffect, useRef } from "react";
import WorkspaceLayout from "../components/workspace-layout";
import { Funnel_Display, Geist_Mono } from "next/font/google";
import {
    Globe, Cpu, Database, Network, Sparkles, Activity, Play, Settings,
    ChevronRight, ArrowLeft, Plus, Trash2, Users, Search, TrendingUp, BarChart2, DollarSign, Download
} from "lucide-react";
import { Button, Input, Select, SelectTrigger, SelectValue, SelectContent, SelectItem, Textarea, Slider, Label } from "ui";


const funnelDisplay = Funnel_Display({ subsets: ["latin"], weight: ["400", "500", "600", "700", "800"] });
const geistMono = Geist_Mono({ subsets: ["latin"] });

type FlowStep = "intro" | "config" | "active";

const SIM_TYPES = [
    { id: "market-research", label: "Market Research", icon: Search, desc: "Analyze target demographics and demand." },
    { id: "product-test", label: "Product Test", icon: Activity, desc: "Simulate user interactions with your product." },
    { id: "competitor", label: "Competitor Analysis", icon: BarChart2, desc: "Model competitor responses and strategy." },
    { id: "pricing", label: "Pricing Strategy", icon: DollarSign, desc: "Test willingness to pay across segments." },
    { id: "trends", label: "Trend Forecasting", icon: TrendingUp, desc: "Predict future market shifts." },
];

export default function WorldSimulatePage() {
    const [step, setStep] = useState<FlowStep>("intro");

    // Config State
    const [simType, setSimType] = useState("product-test");
    const [agentCount, setAgentCount] = useState(1000);
    const [prompt, setPrompt] = useState("Test user onboarding, product discovery, and checkout flows on the new staging environment under heavy load.");
    const [personas, setPersonas] = useState<{ id: number, role: string, ratio: number }[]>([
        { id: 1, role: "Price-sensitive shopper looking for discounts on electronics", ratio: 40 },
        { id: 2, role: "High-intent buyer searching for specific brand-name items", ratio: 35 },
        { id: 3, role: "Browsing user abandoning cart after comparing shipping costs", ratio: 25 },
    ]);

    const handleSimTypeChange = (type: string) => {
        setSimType(type);
        if (type === "market-research") {
            setPrompt("Analyze target demographics and demand for a new productivity tool aimed at remote workers.");
            setPersonas([
                { id: 1, role: "Remote worker struggling with time management", ratio: 50 },
                { id: 2, role: "Team manager looking for collaboration tools", ratio: 30 },
                { id: 3, role: "Freelancer balancing multiple client projects", ratio: 20 },
            ]);
        } else if (type === "competitor") {
            setPrompt("Monitor and analyze feature updates, pricing changes, and customer sentiment across top 3 competitors.");
            setPersonas([
                { id: 1, role: "Feature matrix comparison scanner", ratio: 60 },
                { id: 2, role: "Pricing tier and discount tracker", ratio: 25 },
                { id: 3, role: "Social media sentiment analyzer", ratio: 15 },
            ]);
        } else if (type === "trends") {
            setPrompt("Forecast adoption rates and narrative shifts in AI-assisted developer tools over the next 12 months.");
            setPersonas([
                { id: 1, role: "Early adopter tracking new open-source releases", ratio: 40 },
                { id: 2, role: "Enterprise IT decision maker evaluating security", ratio: 40 },
                { id: 3, role: "Skeptic focusing on limitations and costs", ratio: 20 },
            ]);
        } else {
            // Default (Product Test / Pricing)
            setPrompt("Test user onboarding, product discovery, and checkout flows on the new staging environment under heavy load.");
            setPersonas([
                { id: 1, role: "Price-sensitive shopper looking for discounts on electronics", ratio: 40 },
                { id: 2, role: "High-intent buyer searching for specific brand-name items", ratio: 35 },
                { id: 3, role: "Browsing user abandoning cart after comparing shipping costs", ratio: 25 },
            ]);
        }
    };

    // Active State Logs
    const [logs, setLogs] = useState<{ time: string, text: string, type: 'info' | 'event' | 'alert' }[]>([]);
    const logEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (step === "active") {
            // Simulate incoming logs
            const startLog = { time: new Date().toLocaleTimeString(), text: "Simulation initialized. Deploying agents...", type: 'info' as const };
            setLogs([startLog]);

            const interval = setInterval(() => {
                const events = [
                    "[System] Initiated connection to target environment...",
                    "[Agent 042A] Successfully authenticated and began session.",
                    "[Agent 918B] Encountered latency spike during checkout flow (1.2s)",
                    "[Agent 331C] Scanned competitor feature matrix: 2 changes detected.",
                    "[Market Monitor] Sentiment analysis completed for keyword 'pricing'.",
                    "[Agent 772D] Abandoned cart due to mapped persona constraint (shipping).",
                    "[System] Anomaly detected: High bounce rate on mobile viewport simulation.",
                    "[Agent 115E] Forwarded demographic insight to aggregate node."
                ];
                const newLog = {
                    time: new Date().toLocaleTimeString(),
                    text: events[Math.floor(Math.random() * events.length)],
                    type: (Math.random() > 0.8 ? 'alert' : 'event') as 'info' | 'event' | 'alert'
                };
                setLogs(prev => [...prev.slice(-49), newLog]);
            }, 1800);
            return () => clearInterval(interval);
        }
    }, [step]);

    useEffect(() => {
        logEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [logs]);

    const addPersona = () => {
        setPersonas([...personas, { id: Date.now(), role: "New persona", ratio: 10 }]);
    };

    const removePersona = (id: number) => {
        setPersonas(personas.filter(p => p.id !== id));
    };

    const updatePersona = (id: number, field: string, value: string | number) => {
        setPersonas(personas.map(p => p.id === id ? { ...p, [field]: value } : p));
    };

    return (
        <WorkspaceLayout>
            <div className="relative min-h-full flex flex-col p-8 overflow-hidden">

                {/* Global Background Elements */}
                <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
                    {/* Tech Perspective Grid */}
                    <div className="absolute inset-x-0 bottom-0 h-[60vh] [perspective:1000px] flex items-end justify-center opacity-30">
                        <div className="w-[300vw] h-[150vh] origin-bottom [transform:rotateX(75deg)] bg-[linear-gradient(to_right,var(--border)_1px,transparent_1px),linear-gradient(to_bottom,var(--border)_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:linear-gradient(to_top,black_10%,transparent_100%)]" />
                    </div>
                </div>

                {/* =========================================
            STATE: INTRO (Premium Gateway)
            ========================================= */}
                {step === "intro" && (
                    <div className="relative z-10 flex-1 flex items-center justify-center p-6 w-full max-w-6xl mx-auto animate-in fade-in duration-1000">
                        <div className="flex flex-col md:flex-row items-center gap-12 md:gap-16 w-full">

                            {/* LEFT: Text & CTA */}
                            <div className="flex flex-col items-start text-left space-y-5 flex-1 min-w-0">
                                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-md border border-cyan-500/20 bg-cyan-500/5 backdrop-blur-md shadow-sm">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-cyan-400"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z" /></svg>
                                    <span className={`${geistMono.className} text-[10px] font-bold text-cyan-400 uppercase tracking-[0.2em]`}>AI Agent Simulation</span>
                                </div>

                                <h1 className={`${funnelDisplay.className} text-[2.4rem] md:text-[3rem] font-black tracking-[-0.03em] leading-[1.1] text-foreground`}>
                                    Run the World.
                                    <br />
                                    <span className="text-muted-foreground">Before You Enter It.</span>
                                </h1>

                                <p className="text-[14px] text-muted-foreground leading-relaxed font-medium max-w-md">
                                    Deploy autonomous AI agents into a globally simulated environment. Explore market dynamics, consumer behavior, brand reception, competitive responses, pricing sensitivities, and emerging trends — before committing real resources.
                                </p>

                                <button
                                    onClick={() => setStep("config")}
                                    className="flex items-center justify-center gap-2.5 h-11 px-8 rounded-lg bg-foreground text-background hover:bg-foreground/90 hover:-translate-y-0.5 text-[14px] font-bold transition-all shadow-lg border-none cursor-pointer mt-2"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="6 3 20 12 6 21 6 3" /></svg>
                                    Initialize Simulation
                                </button>
                            </div>

                            {/* RIGHT: Tech Globe */}
                            <div className="relative size-[240px] md:size-[320px] flex items-center justify-center shrink-0 pointer-events-none">
                                <div className="absolute size-[120%] rounded-full border border-dashed border-border/60 animate-[spin_40s_linear_infinite]" />
                                <div className="absolute size-[140%] rounded-full border border-border/40 animate-[spin_60s_linear_infinite_reverse]">
                                    <div className="absolute top-1/2 right-0 translate-x-1/2 -translate-y-1/2 size-2 bg-purple-400 rounded-full shadow-[0_0_12px_#c084fc]" />
                                </div>
                                <div className="absolute size-[160%] rounded-full border border-border/20 animate-[spin_90s_linear_infinite]">
                                    <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 size-1.5 bg-cyan-400 rounded-full shadow-[0_0_12px_#22d3ee]" />
                                </div>
                                <div className="relative size-full animate-[spin_60s_linear_infinite] drop-shadow-[0_0_30px_rgba(34,211,238,0.12)] z-20">
                                    <div className="absolute inset-0 bg-background rounded-full" />
                                    <div className="absolute inset-0 bg-cyan-500/10 rounded-full blur-[20px]" />
                                    <svg viewBox="0 0 100 100" className="w-full h-full text-foreground opacity-60">
                                        <circle cx="50" cy="50" r="48" fill="none" stroke="currentColor" strokeWidth="0.5" strokeDasharray="2 4" className="opacity-40" />
                                        <circle cx="50" cy="50" r="38" fill="none" stroke="currentColor" strokeWidth="0.4" className="opacity-30" />
                                        <ellipse cx="50" cy="50" rx="48" ry="15" fill="none" stroke="currentColor" strokeWidth="0.3" className="opacity-40" />
                                        <ellipse cx="50" cy="50" rx="48" ry="15" fill="none" stroke="currentColor" strokeWidth="0.3" className="opacity-40" transform="rotate(45 50 50)" />
                                        <ellipse cx="50" cy="50" rx="48" ry="15" fill="none" stroke="currentColor" strokeWidth="0.3" className="opacity-40" transform="rotate(90 50 50)" />
                                        <ellipse cx="50" cy="50" rx="48" ry="15" fill="none" stroke="currentColor" strokeWidth="0.3" className="opacity-40" transform="rotate(135 50 50)" />
                                    </svg>
                                </div>
                            </div>

                        </div>
                    </div>
                )}

                {/* =========================================
            STATE: CONFIG WIZARD
            ========================================= */}
                {
                    step === "config" && (
                        <div className="relative z-10 w-full max-w-4xl mx-auto flex flex-col flex-1 animate-in slide-in-from-bottom-8 fade-in duration-500">
                            <Button variant="ghost" onClick={() => setStep("intro")} className="self-start text-muted-foreground hover:text-foreground hover:bg-accent mb-6 text-sm font-medium">
                                <ArrowLeft size={16} className="mr-1" /> Back to Overview
                            </Button>

                            <div className="bg-card/80 backdrop-blur-xl border rounded-3xl p-8 shadow-2xl overflow-y-auto flex-1 mb-8" style={{ scrollbarWidth: "none" }}>
                                <div className="mb-8">
                                    <h2 className="text-2xl font-bold text-card-foreground mb-2">Configure Simulation Parameters</h2>
                                    <p className="text-muted-foreground">Define the goal, scale, and specific subagent personas for the simulated environment.</p>
                                </div>

                                {/* Step 1: Sim Type */}
                                <div className="mb-10">
                                    <h3 className="text-sm font-bold text-foreground uppercase tracking-wider mb-4 border-b pb-2">1. Simulation Type</h3>
                                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                                        {SIM_TYPES.map(type => (
                                            <button
                                                key={type.id}
                                                onClick={() => handleSimTypeChange(type.id)}
                                                className={`flex flex-col p-4 rounded-xl border text-left transition-all ${simType === type.id ? "bg-cyan-500/10 border-cyan-500/50" : "bg-card/40 hover:bg-accent"}`}
                                            >
                                                <type.icon size={20} className={`mb-3 ${simType === type.id ? "text-cyan-400" : "text-muted-foreground"}`} />
                                                <div className={`font-medium text-sm mb-1 ${simType === type.id ? "text-foreground" : "text-card-foreground"}`}>{type.label}</div>
                                                <div className="text-[11px] text-muted-foreground leading-snug">{type.desc}</div>
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Step 2: Dynamic Environment Settings */}
                                <div className="mb-10 animate-in fade-in slide-in-from-bottom-2 duration-300">
                                    <h3 className="text-sm font-bold text-foreground uppercase tracking-wider mb-4 border-b pb-2">2. Target Environment & Scope</h3>

                                    {/* PRODUCT TEST & PRICING */}
                                    {(simType === "product-test" || simType === "pricing") && (
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div>
                                                <Label className="block text-xs font-medium text-muted-foreground mb-2">Target Application URL</Label>
                                                <Input
                                                    type="url"
                                                    defaultValue="https://staging.example-app.com"
                                                    className="w-full"
                                                />
                                            </div>
                                            <div>
                                                <Label className="block text-xs font-medium text-muted-foreground mb-2">Authentication Strategy</Label>
                                                <Select defaultValue="dynamic">
                                                    <SelectTrigger className="w-full">
                                                        <SelectValue placeholder="Select Strategy..." />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="dynamic">Agents sign up dynamically (Create accounts)</SelectItem>
                                                        <SelectItem value="provided">Use provided test credentials list (CSV)</SelectItem>
                                                        <SelectItem value="none">No authentication required (Public pages)</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                        </div>
                                    )}

                                    {/* MARKET RESEARCH */}
                                    {simType === "market-research" && (
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div>
                                                <Label className="block text-xs font-medium text-muted-foreground mb-2">Target Demographics / Region</Label>
                                                <Input
                                                    type="text"
                                                    defaultValue="North America - Gen Z & Millennials"
                                                    className="w-full"
                                                />
                                            </div>
                                            <div>
                                                <Label className="block text-xs font-medium text-muted-foreground mb-2">Primary Data Sources</Label>
                                                <Select defaultValue="social">
                                                    <SelectTrigger className="w-full">
                                                        <SelectValue placeholder="Select Data Source..." />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="social">Social Media Scraping & Sentiment</SelectItem>
                                                        <SelectItem value="forums">Niche Forums & Communities (Reddit, etc.)</SelectItem>
                                                        <SelectItem value="broad">Broad Web Search & Aggregation</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                        </div>
                                    )}

                                    {/* COMPETITOR ANALYSIS */}
                                    {simType === "competitor" && (
                                        <div className="space-y-4">
                                            <div>
                                                <Label className="block text-xs font-medium text-muted-foreground mb-2">Target Competitor Domains (Comma separated)</Label>
                                                <Input
                                                    type="text"
                                                    defaultValue="stripe.com, paddle.com, lemonSqueezy.com"
                                                    className="w-full"
                                                />
                                            </div>
                                            <div className="flex items-center gap-3 bg-indigo-500/10 border border-indigo-500/20 p-3 rounded-xl">
                                                <Search size={16} className="text-indigo-400" />
                                                <span className="text-sm text-indigo-200">Agents will prioritize pricing page changes, feature matrix updates, and recent press releases.</span>
                                            </div>
                                        </div>
                                    )}

                                    {/* TREND FORECASTING */}
                                    {simType === "trends" && (
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div>
                                                <Label className="block text-xs font-medium text-muted-foreground mb-2">Industry Vertical</Label>
                                                <Input
                                                    type="text"
                                                    defaultValue="AI & Developer Tools"
                                                    className="w-full"
                                                />
                                            </div>
                                            <div>
                                                <Label className="block text-xs font-medium text-muted-foreground mb-2">Projection Horizon</Label>
                                                <Select defaultValue="6m">
                                                    <SelectTrigger className="w-full">
                                                        <SelectValue placeholder="Select Horizon..." />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="6m">Short-term (6 Months)</SelectItem>
                                                        <SelectItem value="1y">Mid-term (1 Year)</SelectItem>
                                                        <SelectItem value="5y">Long-term (5 Years)</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {/* Step 3: Scale & Scenario */}
                                <div className="mb-10">
                                    <h3 className="text-sm font-bold text-foreground uppercase tracking-wider mb-4 border-b pb-2">3. Core Scenario & Scale</h3>
                                    <div className="space-y-5">
                                        <div>
                                            <Label className="block text-xs font-medium text-muted-foreground mb-2">Simulation Prompt</Label>
                                            <Textarea
                                                value={prompt}
                                                onChange={(e) => setPrompt(e.target.value)}
                                                className="w-full resize-none min-h-[100px]"
                                                rows={3}
                                                placeholder="e.g. Test market fit for an AI coding assistant among junior developers..."
                                            />
                                        </div>
                                        <div>
                                            <div className="flex justify-between items-center mb-2">
                                                <Label className="text-xs font-medium text-muted-foreground">Initial Agent Population</Label>
                                                <span className={`${geistMono.className} text-sm text-cyan-400 font-bold`}>{agentCount.toLocaleString()} Agents</span>
                                            </div>
                                            <Slider
                                                min={100} max={10000} step={100}
                                                value={[agentCount]} onValueChange={(vals) => setAgentCount(vals[0])}
                                                className="w-full py-2 cursor-pointer"
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Step 4: Personas */}
                                <div>
                                    <div className="flex items-center justify-between mb-4 border-b pb-2">
                                        <h3 className="text-sm font-bold text-foreground uppercase tracking-wider">4. Define Subagent Personas</h3>
                                        <Button variant="ghost" size="sm" onClick={addPersona} className="text-cyan-400 hover:text-cyan-300 hover:bg-cyan-500/10 text-xs h-8">
                                            <Plus size={14} className="mr-1" /> Add Persona
                                        </Button>
                                    </div>

                                    <div className="space-y-3">
                                        {personas.map((persona, i) => (
                                            <div key={persona.id} className="flex items-start gap-4 p-4 rounded-xl bg-accent/40 border">
                                                <div className="pt-2 px-1 text-muted-foreground font-bold">{i + 1}</div>
                                                <div className="flex-1 space-y-3">
                                                    <Input
                                                        type="text" value={persona.role}
                                                        onChange={(e) => updatePersona(persona.id, "role", e.target.value)}
                                                        className="w-full"
                                                        placeholder="Describe the agent's specific role..."
                                                    />
                                                    <div className="flex items-center gap-3">
                                                        <Label className="text-xs text-muted-foreground">Allocation:</Label>
                                                        <Input
                                                            type="number" min={1} max={100} value={persona.ratio}
                                                            onChange={(e) => updatePersona(persona.id, "ratio", parseInt(e.target.value))}
                                                            className="w-16 h-8 text-center p-1"
                                                        />
                                                        <span className="text-xs text-muted-foreground">% of total ({Math.floor(agentCount * (persona.ratio / 100))} agents)</span>
                                                    </div>
                                                </div>
                                                <Button variant="ghost" size="icon" onClick={() => removePersona(persona.id)} className="text-muted-foreground hover:text-destructive hover:bg-destructive/10 h-8 w-8 ml-2">
                                                    <Trash2 size={16} />
                                                </Button>
                                            </div>
                                        ))}
                                    </div>
                                    {/* Ratio validation warning */}
                                    {personas.reduce((acc, p) => acc + p.ratio, 0) !== 100 && (
                                        <div className="mt-4 text-[12px] text-amber-500 bg-amber-500/10 px-3 py-2 rounded-lg border border-amber-500/20">
                                            Warning: Total allocation does not equal 100%. Current total: {personas.reduce((acc, p) => acc + p.ratio, 0)}%. Unallocated agents will act as neutral/randomized actors.
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Launch Action */}
                            <div className="flex justify-end shrink-0 mt-6 md:mt-0">
                                <Button onClick={() => setStep("active")} size="lg" className="h-12 px-8 rounded-xl bg-foreground text-background hover:bg-foreground/90 text-[15px] font-bold transition-all hover:-translate-y-0.5 shadow-md border-none">
                                    <Play size={18} className="fill-current mr-2" /> Deploy Simulation
                                </Button>
                            </div>
                        </div>
                    )
                }

                {/* =========================================
            STATE: ACTIVE DASHBOARD
            ========================================= */}
                {
                    step === "active" && (
                        <div className="relative z-10 w-full h-full flex flex-col animate-in fade-in duration-700">
                            <div className="flex items-center justify-between mb-6 shrink-0">
                                <div className="flex items-center gap-4">
                                    <div className="flex items-center gap-2">
                                        <span className="relative flex h-3 w-3">
                                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                                            <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
                                        </span>
                                        <h2 className="text-xl font-bold text-foreground">Simulation Active</h2>
                                    </div>
                                    <div className={`${geistMono.className} text-[10px] bg-accent/50 px-2 py-1 rounded text-muted-foreground border`}>
                                        MODE: {SIM_TYPES.find(t => t.id === simType)?.label.toUpperCase()}
                                    </div>
                                </div>
                                <Button variant="outline" onClick={() => setStep("config")} className="border-rose-500/30 text-rose-400 hover:bg-rose-500/10 hover:text-rose-300 text-[13px] font-medium transition-colors">
                                    Halt Simulation
                                </Button>
                            </div>

                            <div className="flex-1 flex gap-6 min-h-0">
                                {/* Left: Map & Metrics */}
                                <div className="flex-[2] flex flex-col gap-6 min-h-0">
                                    {/* Top Map/Visual */}
                                    <div className="flex-1 bg-card rounded-3xl border relative overflow-hidden flex items-center justify-center p-6">
                                        <div className="absolute inset-0 bg-background/50 pointer-events-none" />
                                        {/* Simplified Map representation */}
                                        <div className="relative size-full max-w-lg aspect-square border-2 border-border/50 rounded-full animate-[spin_120s_linear_infinite] flex items-center justify-center">
                                            <div className="absolute size-3/4 border border-border/50 rounded-full" />
                                            <div className="absolute size-1/2 border border-border/50 rounded-full" />
                                            <div className="size-16 rounded-full bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center z-10">
                                                <Globe className="text-cyan-400" size={24} />
                                            </div>
                                            {/* Dynamic Nodes */}
                                            {Array.from({ length: 12 }).map((_, i) => (
                                                <div key={i} className="absolute size-2 bg-indigo-500 rounded-full blur-[1px] animate-pulse"
                                                    style={{
                                                        top: `${Math.random() * 100}%`, left: `${Math.random() * 100}%`,
                                                        animationDelay: `${Math.random() * 2}s`
                                                    }}
                                                />
                                            ))}
                                        </div>
                                        <div className={`${geistMono.className} absolute bottom-4 left-6 text-[10px] text-emerald-400 flex items-center gap-2`}>
                                            <Activity size={12} /> {agentCount.toLocaleString()} AGENTS CONNECTED TO MAIN NODE
                                        </div>
                                    </div>

                                    {/* Bottom Stats Row */}
                                    <div className="h-28 shrink-0 grid grid-cols-3 gap-4">
                                        <div className="bg-card rounded-2xl border p-4 flex flex-col justify-center">
                                            <div className="text-muted-foreground text-xs font-medium mb-1 flex items-center gap-2"><DollarSign size={14} /> Total Transaction Vol.</div>
                                            <div className="text-2xl font-bold text-foreground">$48,290.55</div>
                                            <div className="text-[10px] text-emerald-400 mt-1">+12% vs expected</div>
                                        </div>
                                        <div className="bg-card rounded-2xl border p-4 flex flex-col justify-center">
                                            <div className="text-muted-foreground text-xs font-medium mb-1 flex items-center gap-2"><Users size={14} /> Interactions</div>
                                            <div className="text-2xl font-bold text-foreground">14,392</div>
                                            <div className="text-[10px] text-cyan-400 mt-1">~14 per agent</div>
                                        </div>
                                        <div className="bg-card rounded-2xl border p-4 flex flex-col justify-center">
                                            <div className="text-muted-foreground text-xs font-medium mb-1 flex items-center gap-2"><Activity size={14} /> Convergence Rate</div>
                                            <div className="text-2xl font-bold text-foreground">89.2%</div>
                                            <div className="text-[10px] text-muted-foreground mt-1">High confidence</div>
                                        </div>
                                    </div>
                                </div>

                                {/* Right: Live Terminal Log */}
                                <div className="flex-1 bg-background rounded-3xl border p-5 flex flex-col min-h-0 font-mono text-sm">
                                    <div className="flex items-center justify-between border-b pb-3 mb-4 shrink-0">
                                        <div className="flex items-center gap-2 text-muted-foreground text-xs uppercase tracking-widest font-bold">
                                            <Database size={14} /> Global Event Log
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <Button variant="outline" size="sm" className="h-7 text-[11px] text-muted-foreground hover:text-foreground hover:bg-accent border-border">
                                                <Download size={13} className="mr-1" /> Export Log
                                            </Button>
                                        </div>
                                    </div>

                                    <div className="flex-1 overflow-y-auto space-y-2 pr-2" style={{ scrollbarWidth: "thin", scrollbarColor: "rgba(113, 113, 122, 0.4) transparent" }}>
                                        {logs.map((log, i) => (
                                            <div key={i} className={`text-[12px] leading-relaxed flex gap-3 ${log.type === 'alert' ? 'text-amber-400' : log.type === 'info' ? 'text-cyan-400' : 'text-muted-foreground'}`}>
                                                <span className="opacity-50 shrink-0">[{log.time}]</span>
                                                <span>{log.text}</span>
                                            </div>
                                        ))}
                                        <div ref={logEndRef} />
                                    </div>

                                    <div className="mt-4 pt-4 border-t shrink-0 text-xs text-muted-foreground flex items-center gap-2">
                                        <span className="animate-pulse">_</span> Waiting for network events...
                                    </div>
                                </div>
                            </div>
                        </div>
                    )
                }

            </div >
        </WorkspaceLayout >
    );
}
