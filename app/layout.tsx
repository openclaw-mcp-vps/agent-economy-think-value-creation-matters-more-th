import type { Metadata } from "next";
import { Space_Grotesk, IBM_Plex_Sans, Geist } from "next/font/google";

import "./globals.css";
import { cn } from "@/lib/utils";

const geist = Geist({subsets:['latin'],variable:'--font-sans'});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-display"
});

const ibmPlexSans = IBM_Plex_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-body"
});

export const metadata: Metadata = {
  metadataBase: new URL("https://agent-value-creation.example.com"),
  title: {
    default: "The Agent Economy Is Not What You Think | Value Creation Intelligence",
    template: "%s | Value Creation Intelligence"
  },
  description:
    "Research and analysis platform for AI agent builders. Validate value propositions with market signals, user behavior patterns, and economic impact metrics before committing roadmap and capital.",
  keywords: [
    "AI agents",
    "value creation",
    "market validation",
    "agent startup",
    "product strategy",
    "SaaS analytics"
  ],
  openGraph: {
    title: "The Agent Economy Is Not What You Think",
    description:
      "Find high-value AI agent opportunities by separating durable customer outcomes from hype cycles.",
    type: "website",
    siteName: "Value Creation Intelligence"
  },
  twitter: {
    card: "summary_large_image",
    title: "The Agent Economy Is Not What You Think",
    description: "Analyze value creation potential before you build the next AI agent feature."
  }
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={cn("dark", "font-sans", geist.variable)}>
      <body className={`${spaceGrotesk.variable} ${ibmPlexSans.variable} font-[var(--font-body)] antialiased`}>
        {children}
      </body>
    </html>
  );
}
