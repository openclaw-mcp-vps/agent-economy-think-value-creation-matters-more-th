import { ArrowRight, ChartColumnBig, CircleDollarSign, Gauge, ScanSearch } from "lucide-react";
import type { Metadata } from "next";

import { PricingCard } from "@/components/ui/pricing-card";

const paymentLink = process.env.NEXT_PUBLIC_STRIPE_PAYMENT_LINK;

export const metadata: Metadata = {
  title: "The Agent Economy Is Not What You Think",
  description:
    "Most AI agent startups chase demos and burn runway. This tool helps founders validate real economic value creation before market hype resets."
};

export default function HomePage() {
  return (
    <main className="grid-bg min-h-screen px-6 pb-20 pt-10 md:px-12 lg:px-20">
      <div className="mx-auto max-w-6xl space-y-20">
        <section className="grid gap-10 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
          <div className="space-y-6">
            <p className="inline-flex rounded-full border border-slate-700 bg-slate-900/80 px-3 py-1 text-xs uppercase tracking-[0.18em] text-slate-300">
              ai-agents research and analysis tool
            </p>
            <h1 className="font-[var(--font-display)] text-4xl font-bold leading-tight text-slate-100 md:text-5xl xl:text-6xl">
              The Agent Economy Is Not What You Think: <span className="shine">Value Creation Beats Value Capture</span>
            </h1>
            <p className="max-w-2xl text-lg text-slate-300">
              $50B+ is flooding into AI agents, but most teams are still optimizing pitch decks instead of customer outcomes. This platform helps technical founders and product managers test where real economic value exists before they burn six months on the wrong workflow.
            </p>
            <div className="flex flex-wrap items-center gap-3 text-sm text-slate-300">
              <span className="rounded-full border border-emerald-400/30 bg-emerald-400/10 px-3 py-1">Market signal analytics</span>
              <span className="rounded-full border border-sky-400/30 bg-sky-400/10 px-3 py-1">Economic impact modeling</span>
              <span className="rounded-full border border-amber-400/30 bg-amber-400/10 px-3 py-1">Hype-risk detection</span>
            </div>
          </div>

          <PricingCard paymentLink={paymentLink} />
        </section>

        <section className="space-y-8">
          <h2 className="text-3xl font-semibold text-slate-100">The Problem Most Agent Founders Miss</h2>
          <div className="grid gap-4 md:grid-cols-3">
            <article className="rounded-xl border border-slate-800 bg-[#111926]/85 p-5">
              <Gauge className="mb-4 size-5 text-rose-300" />
              <h3 className="mb-2 text-lg font-semibold text-slate-100">Demo-First Roadmaps</h3>
              <p className="text-sm text-slate-300">
                Teams over-index on visible autonomy and under-invest in measurable customer outcomes like error reduction, cycle time compression, and margin lift.
              </p>
            </article>
            <article className="rounded-xl border border-slate-800 bg-[#111926]/85 p-5">
              <ScanSearch className="mb-4 size-5 text-amber-300" />
              <h3 className="mb-2 text-lg font-semibold text-slate-100">No Demand Validation</h3>
              <p className="text-sm text-slate-300">
                Investor enthusiasm masks weak buyer urgency. Without workflow-level demand signals, teams ship capabilities buyers never budget for.
              </p>
            </article>
            <article className="rounded-xl border border-slate-800 bg-[#111926]/85 p-5">
              <CircleDollarSign className="mb-4 size-5 text-sky-300" />
              <h3 className="mb-2 text-lg font-semibold text-slate-100">Capture Before Creation</h3>
              <p className="text-sm text-slate-300">
                Overpricing early destroys adoption. Winning products leave enough economic upside with the buyer so expansion happens naturally.
              </p>
            </article>
          </div>
        </section>

        <section className="space-y-8">
          <h2 className="text-3xl font-semibold text-slate-100">How This Tool Helps You Build the Right Agent</h2>
          <div className="grid gap-4 md:grid-cols-2">
            <article className="rounded-xl border border-slate-800 bg-[#111926]/85 p-6">
              <ChartColumnBig className="mb-4 size-6 text-emerald-300" />
              <h3 className="mb-2 text-xl font-semibold text-slate-100">Market Signal Dashboard</h3>
              <p className="text-sm leading-6 text-slate-300">
                Compare demand growth, retention strength, willingness to pay, and hype exposure across high-volume agent categories. Identify where durable value is likely to compound.
              </p>
            </article>
            <article className="rounded-xl border border-slate-800 bg-[#111926]/85 p-6">
              <ArrowRight className="mb-4 size-6 text-emerald-300" />
              <h3 className="mb-2 text-xl font-semibold text-slate-100">Economic Impact Analyzer</h3>
              <p className="text-sm leading-6 text-slate-300">
                Input your assumptions and immediately see opportunity score, value capture ratio, execution margin, and recommended next moves for product scope and pricing.
              </p>
            </article>
          </div>
        </section>

        <section className="space-y-8">
          <h2 className="text-3xl font-semibold text-slate-100">FAQ</h2>
          <div className="space-y-4">
            <article className="rounded-xl border border-slate-800 bg-[#111926]/85 p-5">
              <h3 className="text-lg font-semibold text-slate-100">Who is this for?</h3>
              <p className="mt-2 text-sm text-slate-300">
                Technical founders and product managers at early-stage AI companies who need to validate that their agent roadmap maps to real economic demand.
              </p>
            </article>
            <article className="rounded-xl border border-slate-800 bg-[#111926]/85 p-5">
              <h3 className="text-lg font-semibold text-slate-100">How does paywall access work?</h3>
              <p className="mt-2 text-sm text-slate-300">
                Pay through Stripe hosted checkout, then unlock dashboard access with the same billing email. A secure cookie grants access for 30 days.
              </p>
            </article>
            <article className="rounded-xl border border-slate-800 bg-[#111926]/85 p-5">
              <h3 className="text-lg font-semibold text-slate-100">What do I get for $15/month?</h3>
              <p className="mt-2 text-sm text-slate-300">
                Full access to market signal comparisons, use-case analysis, opportunity and risk scoring, and practical recommendations to improve product-market fit.
              </p>
            </article>
          </div>
        </section>
      </div>
    </main>
  );
}
