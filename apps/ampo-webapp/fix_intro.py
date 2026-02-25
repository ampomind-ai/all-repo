import re

with open("app/world-simulate/page.tsx", "r") as f:
    content = f.read()

# I want to replace everything from "                {/* Global Background Elements */}"
# to "                )}", right above "                {/* =========================================" for CONFIG WIZARD.

pattern = re.compile(r'(\s+\{\/\* Global Background Elements \*\/\}\n\s+<div className="absolute inset-x-0 bg-\[\#030712\].*?)\n\s+\{\/\* \={41}\n\s+STATE: CONFIG WIZARD', re.DOTALL | re.MULTILINE)

new_code = """                {/* Global Background Elements */}
                <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
                    <div className="absolute inset-0 bg-background" />
                    {/* Gradient Glow Orbs */}
                    <div className="absolute top-[-10%] left-[20%] w-[800px] h-[800px] rounded-full bg-cyan-500/[0.08] blur-[120px] pointer-events-none" />
                    <div className="absolute bottom-[-10%] right-[10%] w-[600px] h-[600px] rounded-full bg-purple-500/[0.08] blur-[100px] pointer-events-none" />
                    {/* Noise Texture Overlay */}
                    <div className="absolute inset-0 z-[2] opacity-[0.03]" aria-hidden>
                        <svg width="100%" height="100%">
                            <filter id="noiseFilter">
                                <feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="3" stitchTiles="stitch" />
                            </filter>
                            <rect width="100%" height="100%" filter="url(#noiseFilter)" />
                        </svg>
                    </div>
                    {/* Tech Perspective Grid */}
                    <div className="absolute inset-x-0 bottom-0 h-[60vh] [perspective:1000px] flex items-end justify-center opacity-30">
                        <div className="w-[300vw] h-[150vh] origin-bottom [transform:rotateX(75deg)] bg-[linear-gradient(to_right,var(--border)_1px,transparent_1px),linear-gradient(to_bottom,var(--border)_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:linear-gradient(to_top,black_10%,transparent_100%)]" />
                    </div>
                </div>

                {/* =========================================
            STATE: INTRO (Premium Gateway)
            ========================================= */}
                {step === "intro" && (
                    <div className="relative z-10 flex-1 flex flex-col items-center justify-center p-4 w-full max-w-5xl mx-auto min-h-[600px] animate-in fade-in duration-1000">
                        
                        {/* Header Content */}
                        <div className="flex flex-col items-center text-center space-y-6 shrink-0 mt-8 mb-4">
                            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-md border border-cyan-500/20 bg-cyan-500/5 backdrop-blur-md shadow-sm">
                                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-cyan-400"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/></svg>
                                <span className={`$ {geistMono.className} text-[10px] font-bold text-cyan-400 uppercase tracking-[0.2em]`}>Revolutionary Feature</span>
                            </div>
                            <h1 className={`$ {funnelDisplay.className} text-[3rem] md:text-[5rem] font-black tracking-[-0.03em] leading-[1.05] text-foreground drop-shadow-sm`}>
                                Simulate the World. <br />
                                <span className="text-muted-foreground">Before you build it.</span>
                            </h1>
                            <p className="text-[16px] text-muted-foreground leading-relaxed font-medium tracking-tight max-w-2xl mx-auto">
                                Deploy autonomous subagents into a globally simulated environment. Test market fit, analyze competitor responses, and forecast trends prior to writing a single line of code.
                            </p>
                        </div>

                        {/* Tech Globe Visual */}
                        <div className="relative size-[260px] md:size-[340px] flex items-center justify-center my-6 shrink-0 pointer-events-none">
                            <div className="absolute size-[120%] rounded-full border border-dashed border-border/60 animate-[spin_40s_linear_infinite]" />
                            <div className="absolute size-[140%] rounded-full border border-border/40 animate-[spin_60s_linear_infinite_reverse]">
                                <div className="absolute top-1/2 right-0 translate-x-1/2 -translate-y-1/2 size-2 bg-purple-400 rounded-full shadow-[0_0_12px_#c084fc]" />
                            </div>
                            <div className="absolute size-[160%] rounded-full border border-border/20 animate-[spin_90s_linear_infinite]">
                                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 size-1.5 bg-cyan-400 rounded-full shadow-[0_0_12px_#22d3ee]" />
                            </div>
                            
                            <div className="relative size-full animate-[spin_60s_linear_infinite] drop-shadow-[0_0_30px_rgba(34,211,238,0.15)] z-20">
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

                        {/* Call to Action Container */}
                        <div className="mt-4 mb-8 z-30 shrink-0">
                             <button onClick={() => setStep("config")} className="flex items-center justify-center gap-3 h-14 px-10 rounded-md bg-foreground text-background hover:bg-foreground/90 hover:-translate-y-1 text-[15px] font-bold transition-all shadow-[0_0_30px_rgba(34,211,238,0.2)] border-none cursor-pointer">
                                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="6 3 20 12 6 21 6 3"/></svg>
                                Initialize Simulation
                            </button>
                        </div>
                    </div>
                )}

                {/* =========================================
            STATE: CONFIG WIZARD"""

# We need to replace $ { with ${ to fix python formatting issue with string templates
new_code = new_code.replace("$ {", "${")

# Use basic string split since regex might fail on exact formatting
parts = content.split("                {/* Global Background Elements */}")
if len(parts) > 1:
    pre = parts[0]
    post_parts = parts[1].split("                {/* =========================================\n            STATE: CONFIG WIZARD")
    if len(post_parts) > 1:
        post = post_parts[1]
        final = pre + new_code + post
        with open("app/world-simulate/page.tsx", "w") as f:
            f.write(final)
        print("SUCCESS")
    else:
        print("FAIL: Could not find STATE: CONFIG WIZARD")
else:
    print("FAIL: Could not find Global Background Elements")

