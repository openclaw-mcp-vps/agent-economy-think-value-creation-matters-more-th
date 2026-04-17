import Link from "next/link";
import { cookies } from "next/headers";
import { Lock, Sparkles, ArrowLeft } from "lucide-react";

import { MarketAnalyzer } from "@/components/MarketAnalyzer";
import { PaywallModal } from "@/components/PaywallModal";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default async function DashboardPage(): Promise<React.JSX.Element> {
  const cookieStore = await cookies();
  const hasAccess = cookieStore.get("ae_access")?.value === "granted";

  return (
    <main className="mx-auto max-w-7xl px-5 pb-16 pt-8 sm:px-6 lg:px-8">
      <header className="mb-8 flex flex-wrap items-center justify-between gap-3">
        <div>
          <Button asChild variant="ghost" size="sm" className="mb-2">
            <Link href="/">
              <ArrowLeft className="h-4 w-4" />
              Back to Overview
            </Link>
          </Button>
          <h1 className="text-3xl font-semibold text-zinc-100">Agent Economy Dashboard</h1>
          <p className="text-sm text-zinc-400">Find agent opportunities where value creation is obvious and defensible.</p>
        </div>
        <Badge variant={hasAccess ? "default" : "secondary"}>{hasAccess ? "Access Active" : "Locked"}</Badge>
      </header>

      {hasAccess ? (
        <MarketAnalyzer />
      ) : (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-2xl">
                <Lock className="h-5 w-5 text-amber-400" />
                Pro Dashboard Locked
              </CardTitle>
              <CardDescription>
                The full analyzer is behind a paywall so teams can act on serious value-creation signals, not vanity metrics.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-5">
              <div className="grid gap-4 md:grid-cols-3">
                <PreviewBlock
                  title="Opportunity Scoring"
                  description="Rank use cases by value density, demand strength, and capture difficulty."
                />
                <PreviewBlock
                  title="Economic Impact"
                  description="Estimate annual value unlocked, implementation cost, and customer payback windows."
                />
                <PreviewBlock
                  title="Market Signals"
                  description="Track momentum from GitHub, Hacker News, and Reddit to detect real pull."
                />
              </div>

              <div className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-zinc-800 bg-zinc-950/70 p-4">
                <div>
                  <p className="text-sm font-semibold text-zinc-100">Pro plan: $15/month</p>
                  <p className="text-xs text-zinc-400">For technical founders and PMs building agent products.</p>
                </div>
                <PaywallModal triggerText="Unlock Dashboard" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-emerald-400" />
                Why this gate exists
              </CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-zinc-300">
              Teams usually over-invest in polished agent demos and under-invest in outcome validation. The paid workflow forces a practical question:
              where can your product create economic value quickly enough that customers will fund expansion?
            </CardContent>
          </Card>
        </div>
      )}
    </main>
  );
}

function PreviewBlock({ title, description }: { title: string; description: string }): React.JSX.Element {
  return (
    <div className="rounded-lg border border-zinc-800 bg-zinc-950/70 p-4">
      <p className="font-semibold text-zinc-100">{title}</p>
      <p className="mt-2 text-sm text-zinc-400">{description}</p>
    </div>
  );
}
