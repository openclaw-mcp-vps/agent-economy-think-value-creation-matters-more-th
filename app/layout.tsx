import type { Metadata } from "next";
import { Space_Grotesk, IBM_Plex_Mono } from "next/font/google";

import "@/app/globals.css";

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk"
});

const ibmPlexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  variable: "--font-ibm-plex-mono",
  weight: ["400", "500", "600"]
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://agent-economy.ai";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: "The Agent Economy Is Not What You Think | Value-Creation Analyzer",
  description:
    "Research platform for technical founders building AI agents. Analyze market signals, user behavior, and economic impact to prioritize real value creation over hype.",
  keywords: [
    "ai agents",
    "value creation",
    "market analysis",
    "startup validation",
    "agent economy",
    "product strategy"
  ],
  openGraph: {
    title: "The Agent Economy Is Not What You Think",
    description:
      "A research and analysis tool that helps AI agent builders identify high-value creation opportunities before market hype corrects.",
    url: siteUrl,
    siteName: "Agent Economy Analyzer",
    type: "website",
    images: [
      {
        url: "/og-image.svg",
        width: 1200,
        height: 630,
        alt: "Agent Economy Value Creation Analyzer"
      }
    ]
  },
  twitter: {
    card: "summary_large_image",
    title: "The Agent Economy Is Not What You Think",
    description: "Validate AI agent opportunities using market signals and economic impact data.",
    images: ["/og-image.svg"]
  },
  alternates: {
    canonical: "/"
  }
};

export default function RootLayout({ children }: { children: React.ReactNode }): React.JSX.Element {
  return (
    <html lang="en" className="dark">
      <body className={`${spaceGrotesk.variable} ${ibmPlexMono.variable} bg-[#0d1117] text-zinc-100 antialiased`}>
        {children}
      </body>
    </html>
  );
}
