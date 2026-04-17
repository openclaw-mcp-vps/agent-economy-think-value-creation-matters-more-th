import Link from "next/link";
import { ArrowRight, LineChart, ShieldCheck, Sparkles, TrendingUp } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const faqs = [
  {
    q: "How is this different from generic market research tools?",
    a: "This platform focuses on AI agent economics: demand momentum, competition saturation, activation friction, and quantified value-creation potential. It is designed for builders deciding what to ship next, not investors hunting headlines."
  },
  {
    q: "Who is this for?",
    a: "Technical founders and product managers at early-stage AI companies who need to validate whether an agent idea solves an expensive business problem before committing roadmap and GTM budget."
  },
  {
    q: "What data does the analyzer use?",
    a: "It combines market-intelligence signals from GitHub, Hacker News, and Reddit with your own customer profile inputs to estimate demand strength, pricing readiness, and expected payback period."
  },
  {
    q: "Why focus on value creation more than value capture?",
    a: "In early markets, teams that create measurable economic value win distribution, trust, and retention. Value capture follows once the product is tied to hard outcomes and switching costs."
  }
];

export default function HomePage(): React.JSX.Element {
  return (
    <main className="mx-auto max-w-6xl px-5 pb-16 pt-8 sm:px-6 lg:px-8">
      <header className="flex items-center justify-between py-3">
        <div className="flex items-center gap-3">
          <div className="grid h-10 w-10 place-items-center rounded-md border border-zinc-700 bg-zinc-900/70 text-emerald-400">
            <LineChart className="h-5 w-5" />
          </div>
          <div>
            <p className="text-sm font-semibold text-zinc-100">Agent Economy Analyzer</p>
            <p className="text-xs text-zinc-400">AI-agent value creation intelligence</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="secondary">$15/mo</Badge>
          <Button asChild variant="outline" size="sm">
            <Link href="/dashboard">Open Dashboard</Link>
          </Button>
        </div>
      </header>

      <section className="relative mt-8 overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-900/65 p-8 shadow-2xl shadow-emerald-950/20 sm:p-12">
        <div className="pointer-events-none absolute -right-20 -top-20 h-56 w-56 rounded-full bg-emerald-500/20 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-28 left-0 h-56 w-56 rounded-full bg-sky-500/15 blur-3xl" />

        <Badge>Research & Analysis Tool</Badge>
        <h1 className="mt-5 max-w-4xl text-3xl font-semibold leading-tight text-zinc-100 sm:text-5xl">
          The Agent Economy Is Not What You Think: Why Value Creation Matters More Than Value Capture
        </h1>
        <p className="mt-5 max-w-3xl text-base text-zinc-300 sm:text-lg">
          $50B+ is flooding into AI agents, but most products still optimize for demos instead of economic outcomes. This tool helps you identify where
          real value can be created, measured, and monetized before hype-driven positioning collapses.
        </p>

        <div className="mt-8 flex flex-wrap gap-3">
          <Button asChild size="lg">
            <Link href="/dashboard">
              Analyze My Opportunity
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
          <Button asChild size="lg" variant="outline">
            <a href="#pricing">See Pricing</a>
          </Button>
        </div>
      </section>

      <section className="mt-12 grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <TrendingUp className="h-4 w-4 text-emerald-400" />
              Problem
            </CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-zinc-300">
            Founders are shipping agent products against vanity demand signals, then discovering too late that customers won’t pay for workflow novelty.
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Sparkles className="h-4 w-4 text-emerald-400" />
              Solution
            </CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-zinc-300">
            Score opportunities using market momentum, behavior patterns, and value impact projections to prioritize use cases with clear economic gravity.
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <ShieldCheck className="h-4 w-4 text-emerald-400" />
              Who Pays
            </CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-zinc-300">
            Technical founders and product managers at early-stage AI companies validating value proposition against market demand, not investor excitement.
          </CardContent>
        </Card>
      </section>

      <section className="mt-12 grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>What the platform analyzes</CardTitle>
            <CardDescription>Built for the `ai-agents` niche and tuned for early-stage product decisions.</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3 text-sm text-zinc-300">
              <li>• Market-signal momentum from open technical and founder channels.</li>
              <li>• User behavior proxies that indicate urgency versus curiosity.</li>
              <li>• Economic impact metrics that estimate payback and implementation cost.</li>
              <li>• Opportunity ranking that weights value creation over feature surface area.</li>
              <li>• Actionable execution sequence to run experiments with measurable upside.</li>
            </ul>
          </CardContent>
        </Card>
        <Card id="pricing">
          <CardHeader>
            <CardTitle>Pricing</CardTitle>
            <CardDescription>One simple tier for teams validating agent opportunities.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="rounded-xl border border-emerald-700/40 bg-emerald-500/10 p-5">
              <p className="text-sm uppercase tracking-wide text-emerald-300">Pro</p>
              <p className="mt-2 text-4xl font-semibold text-zinc-100">
                $15<span className="text-base font-normal text-zinc-400">/month</span>
              </p>
              <ul className="mt-4 space-y-2 text-sm text-zinc-200">
                <li>• Full dashboard with five opportunity scores</li>
                <li>• Economic impact calculator and payback model</li>
                <li>• Market signal ingestion across multiple sources</li>
                <li>• Instant access via Lemon Squeezy checkout</li>
              </ul>
              <Button asChild className="mt-5 w-full">
                <Link href="/dashboard">Start Pro Analysis</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </section>

      <section className="mt-12">
        <h2 className="text-2xl font-semibold text-zinc-100">Frequently Asked Questions</h2>
        <div className="mt-5 grid gap-4 md:grid-cols-2">
          {faqs.map((item) => (
            <Card key={item.q}>
              <CardHeader>
                <CardTitle className="text-base">{item.q}</CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-zinc-300">{item.a}</CardContent>
            </Card>
          ))}
        </div>
      </section>
    </main>
  );
}
