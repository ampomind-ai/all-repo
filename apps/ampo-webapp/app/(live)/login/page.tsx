"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Button, Input } from "ui";
import { Funnel_Display, Geist_Mono } from "next/font/google";

const funnelDisplay = Funnel_Display({
    subsets: ["latin"],
    weight: ["300", "400", "500", "600", "700", "800"],
});

const geistMono = Geist_Mono({
    subsets: ["latin"],
});

export default function LoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isSignUp, setIsSignUp] = useState(false);

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
                            <Link href="/pricing" className="hover:text-white transition-colors">Pricing</Link>
                            <a href="#" className="hover:text-white transition-colors">Docs</a>
                        </nav>
                    </div>
                </div>
            </header>

            <main className="flex-1 flex items-center justify-center px-4 py-20">
                <div className="w-full max-w-[400px]">
                    {/* Logo mark */}
                    <div className="flex flex-col items-center mb-10">
                        <div className="size-14 bg-zinc-100 rounded-md flex items-center justify-center mb-6">
                            <Image src="/ampo-icon-logo.png" alt="AmpoMind" width={36} height={36} />
                        </div>
                        <h1 className={`${funnelDisplay.className} text-[2rem] font-black tracking-tight text-center`}>
                            {isSignUp ? "Create your account" : "Welcome back"}
                        </h1>
                        <p className="text-[14px] text-zinc-500 font-medium mt-2 text-center">
                            {isSignUp
                                ? "Start organizing your research in seconds."
                                : "Sign in to continue to AmpoMind."}
                        </p>
                    </div>

                    {/* Social logins */}
                    <div className="space-y-2 mb-6">
                        <Button variant="outline" className="w-full h-10 border-zinc-800 bg-zinc-900/40 hover:bg-zinc-900/80 transition-colors flex items-center justify-center gap-3 text-[12px] font-medium text-zinc-300">
                            <svg width="16" height="16" viewBox="0 0 24 24" className="shrink-0">
                                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4" />
                                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                            </svg>
                            Continue with Google
                        </Button>
                        <Button variant="outline" className="w-full h-10 border-zinc-800 bg-zinc-900/40 hover:bg-zinc-900/80 transition-colors flex items-center justify-center gap-3 text-[12px] font-medium text-zinc-300">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" className="shrink-0">
                                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z" />
                            </svg>
                            Continue with GitHub
                        </Button>
                    </div>

                    {/* Divider */}
                    <div className="flex items-center gap-4 mb-6">
                        <div className="flex-1 h-px bg-zinc-800/60" />
                        <span className={`${geistMono.className} text-[9px] text-zinc-600 uppercase tracking-widest`}>
                            or
                        </span>
                        <div className="flex-1 h-px bg-zinc-800/60" />
                    </div>

                    {/* Email / Password form */}
                    <form
                        onSubmit={(e) => { e.preventDefault(); }}
                        className="space-y-4"
                    >
                        <div className="space-y-1.5">
                            <label className="text-[11px] font-medium text-zinc-500 uppercase tracking-wider">
                                Email
                            </label>
                            <Input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="you@university.edu"
                                className="w-full h-10 px-4 rounded-md bg-zinc-900/60 border-zinc-800 text-[13px] text-zinc-100 placeholder:text-zinc-600 focus-visible:border-cyan-500/40 focus-visible:ring-1 focus-visible:ring-cyan-500/20 transition-all"
                            />
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-[11px] font-medium text-zinc-500 uppercase tracking-wider">
                                Password
                            </label>
                            <Input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="••••••••"
                                className="w-full h-10 px-4 rounded-md bg-zinc-900/60 border-zinc-800 text-[13px] text-zinc-100 placeholder:text-zinc-600 focus-visible:border-cyan-500/40 focus-visible:ring-1 focus-visible:ring-cyan-500/20 transition-all"
                            />
                        </div>

                        {!isSignUp && (
                            <div className="flex justify-end">
                                <a href="#" className="text-[11px] text-cyan-500 hover:text-cyan-400 font-medium transition-colors">
                                    Forgot password?
                                </a>
                            </div>
                        )}

                        <Button
                            type="submit"
                            className="w-full h-10 rounded-md bg-zinc-100 text-[#0c0c0e] text-[12px] font-bold uppercase tracking-widest hover:bg-white transition-all shadow-lg shadow-cyan-500/5"
                        >
                            {isSignUp ? "Create Account" : "Sign In"}
                        </Button>
                    </form>

                    {/* Toggle sign up / sign in */}
                    <div className="mt-8 text-center">
                        <span className="text-[12px] text-zinc-500">
                            {isSignUp ? "Already have an account?" : "Don't have an account?"}
                        </span>
                        <Button
                            variant="link"
                            size="sm"
                            onClick={() => setIsSignUp(!isSignUp)}
                            className="ml-1 text-[12px] text-cyan-500 hover:text-cyan-400 font-medium transition-colors px-1"
                        >
                            {isSignUp ? "Sign In" : "Sign Up"}
                        </Button>
                    </div>

                    {/* Terms */}
                    <p className="mt-6 text-center text-[10px] text-zinc-700 leading-relaxed">
                        By continuing, you agree to our{" "}
                        <a href="#" className="text-zinc-500 hover:text-zinc-300 transition-colors">Terms of Service</a>{" "}
                        and{" "}
                        <a href="#" className="text-zinc-500 hover:text-zinc-300 transition-colors">Privacy Policy</a>.
                    </p>
                </div>
            </main>
        </div>
    );
}
