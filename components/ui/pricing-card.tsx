"use client";

import { CheckCircle2, Loader2, LockKeyhole } from "lucide-react";
import { FormEvent, useMemo, useState } from "react";
import { useRouter } from "next/navigation";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

type PricingCardProps = {
  paymentLink?: string;
};

export function PricingCard({ paymentLink }: PricingCardProps) {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "error">("idle");
  const [message, setMessage] = useState("");

  const hasPaymentLink = useMemo(() => Boolean(paymentLink && paymentLink.startsWith("http")), [paymentLink]);

  async function unlockDashboard(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("loading");
    setMessage("");

    try {
      const response = await fetch("/api/auth/unlock", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ email })
      });

      const payload = (await response.json()) as { message?: string };
      if (!response.ok) {
        throw new Error(payload.message || "Unable to unlock dashboard");
      }

      router.push("/dashboard");
      router.refresh();
    } catch (error) {
      setStatus("error");
      setMessage(error instanceof Error ? error.message : "Unable to unlock dashboard");
      return;
    }

    setStatus("idle");
  }

  return (
    <Card className="border-emerald-400/30 bg-gradient-to-b from-emerald-500/10 to-[#111926]">
      <CardHeader>
        <Badge className="w-fit" variant="default">
          $15/month
        </Badge>
        <CardTitle className="text-2xl">Value Creation Intelligence</CardTitle>
        <CardDescription>Built for technical founders and product managers shipping agent-based products.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <ul className="space-y-3 text-sm text-slate-300">
          <li className="flex items-center gap-2">
            <CheckCircle2 className="size-4 text-emerald-300" />
            Market signal dashboard across six proven agent segments
          </li>
          <li className="flex items-center gap-2">
            <CheckCircle2 className="size-4 text-emerald-300" />
            Economic impact model for your own use case assumptions
          </li>
          <li className="flex items-center gap-2">
            <CheckCircle2 className="size-4 text-emerald-300" />
            Risk alerts when hype is outrunning measurable customer value
          </li>
        </ul>

        <div className="rounded-lg border border-slate-700 bg-[#0f1520] p-4 text-sm text-slate-300">
          Purchase first through Stripe, then unlock access by entering the same billing email.
        </div>

        <form className="space-y-3" onSubmit={unlockDashboard}>
          <label htmlFor="unlock-email" className="text-sm font-medium text-slate-200">
            Already purchased?
          </label>
          <Input
            id="unlock-email"
            type="email"
            placeholder="you@company.com"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            required
          />
          <Button type="submit" variant="secondary" className="w-full" disabled={status === "loading"}>
            {status === "loading" ? <Loader2 className="size-4 animate-spin" /> : <LockKeyhole className="size-4" />} Unlock Dashboard
          </Button>
          {message ? <p className="text-sm text-rose-300">{message}</p> : null}
        </form>
      </CardContent>
      <CardFooter className="flex-col items-stretch gap-3">
        <a
          href={paymentLink}
          className="inline-flex h-11 items-center justify-center rounded-md bg-emerald-400 px-4 text-sm font-semibold text-[#0d1117] transition hover:bg-emerald-300 disabled:pointer-events-none disabled:opacity-50"
          target="_blank"
          rel="noreferrer"
          aria-disabled={!hasPaymentLink}
        >
          Buy on Stripe
        </a>
        {!hasPaymentLink ? (
          <p className="text-xs text-amber-300">Set NEXT_PUBLIC_STRIPE_PAYMENT_LINK to enable Stripe checkout.</p>
        ) : null}
      </CardFooter>
    </Card>
  );
}
