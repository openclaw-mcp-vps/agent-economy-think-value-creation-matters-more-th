"use client";

import { useMemo, useState } from "react";
import Script from "next/script";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface PaywallModalProps {
  triggerText?: string;
}

export function PaywallModal({ triggerText = "Unlock Full Analysis" }: PaywallModalProps): React.JSX.Element {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const checkoutUrl = useMemo(() => {
    const configured = process.env.NEXT_PUBLIC_LEMON_SQUEEZY_CHECKOUT_URL;
    if (configured) {
      return configured.includes("?") ? `${configured}&embed=1` : `${configured}?embed=1`;
    }

    const productId = process.env.NEXT_PUBLIC_LEMON_SQUEEZY_PRODUCT_ID;
    return `https://checkout.lemonsqueezy.com/buy/${productId}?embed=1`;
  }, []);

  const handleClaimAccess = async (): Promise<void> => {
    setLoading(true);
    setMessage(null);

    try {
      const response = await fetch("/api/access/claim", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ email })
      });

      const payload = (await response.json()) as { ok?: boolean; message?: string };

      if (response.ok && payload.ok) {
        setMessage("Access granted. Reloading dashboard...");
        window.location.reload();
        return;
      }

      setMessage(payload.message ?? "We could not find a completed purchase for that email yet.");
    } catch {
      setMessage("Unable to verify purchase right now. Try again in a minute.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Script src="https://app.lemonsqueezy.com/js/lemon.js" strategy="afterInteractive" />
      <Dialog>
        <DialogTrigger asChild>
          <Button size="lg">{triggerText}</Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Unlock Agent Economy Pro</DialogTitle>
            <DialogDescription>
              Get full opportunity scoring, market-signal analysis, and value-impact forecasts for $15/month.
            </DialogDescription>
          </DialogHeader>

          <div className="rounded-lg border border-zinc-800 bg-zinc-900/80 p-4 text-sm text-zinc-300">
            <p className="font-semibold text-zinc-100">What you unlock:</p>
            <ul className="mt-3 space-y-2">
              <li>• Full 5-opportunity ranking with weighted value-creation logic.</li>
              <li>• Real-time market intelligence from GitHub, Hacker News, and Reddit.</li>
              <li>• Economic impact forecast with payback modeling and execution guidance.</li>
            </ul>
          </div>

          <a
            href={checkoutUrl}
            className="lemonsqueezy-button inline-flex h-11 items-center justify-center rounded-md bg-emerald-500 px-4 text-sm font-semibold text-zinc-950 transition hover:bg-emerald-400"
          >
            Start Pro Plan - $15/mo
          </a>

          <div className="space-y-3 rounded-lg border border-zinc-800 bg-zinc-900/70 p-4">
            <p className="text-sm font-semibold text-zinc-100">Already purchased?</p>
            <Label htmlFor="claim-email">Checkout email</Label>
            <Input
              id="claim-email"
              type="email"
              placeholder="founder@company.com"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
            />
            <Button variant="outline" onClick={handleClaimAccess} disabled={loading || email.length < 5}>
              {loading ? "Checking..." : "Claim Access"}
            </Button>
            {message ? <p className="text-xs text-zinc-400">{message}</p> : null}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
