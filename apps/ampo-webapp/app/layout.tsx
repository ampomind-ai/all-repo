import type { Metadata } from "next";
import { Geist, Funnel_Display } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "./(live)/components/theme-provider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const funnelDisplay = Funnel_Display({
  variable: "--font-funnel-display",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "AmpoMind",
  description: "The intelligent browser workspace.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${funnelDisplay.variable} font-sans antialiased relative min-h-screen`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          {/* Global Background Layer */}
          <div className="fixed inset-0 z-[-1] overflow-hidden pointer-events-none select-none">
            {/* Ambient Background Base */}
            <div className="absolute inset-0 bg-background" />

            {/* Cyan/Purple Glow Orbs (Responsive to Light/Dark mode) */}
            <div className="absolute top-[-10%] left-[10%] w-[600px] h-[600px] md:w-[800px] md:h-[800px] rounded-full bg-cyan-500/[0.04] dark:bg-cyan-500/[0.06] blur-[100px] md:blur-[120px]" />
            <div className="absolute bottom-[-10%] right-[10%] w-[500px] h-[500px] md:w-[700px] md:h-[700px] rounded-full bg-purple-500/[0.04] dark:bg-purple-500/[0.06] blur-[100px] md:blur-[120px]" />

            {/* Noise Texture Overlay */}
            <div className="absolute inset-0 opacity-[0.02] dark:opacity-[0.03]" aria-hidden>
              <svg width="100%" height="100%">
                <filter id="globalNoise">
                  <feTurbulence type="fractalNoise" baseFrequency="0.7" numOctaves="3" stitchTiles="stitch" />
                </filter>
                <rect width="100%" height="100%" filter="url(#globalNoise)" />
              </svg>
            </div>
          </div>

          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
