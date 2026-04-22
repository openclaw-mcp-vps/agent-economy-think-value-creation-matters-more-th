# Build Task: agent-economy-think-value-creation-matters-more-th

Build a complete, production-ready Next.js 15 App Router application.

PROJECT: agent-economy-think-value-creation-matters-more-th
HEADLINE: The Agent Economy Is Not What You Think: Why Value Creation Matters More Than Value Capture
WHAT: A research and analysis tool that helps AI agent builders identify high-value creation opportunities by analyzing market signals, user behavior patterns, and economic impact metrics across different agent use cases.
WHY: Most AI agent projects fail because founders focus on flashy demos instead of solving real economic problems. With $50B+ flowing into AI agents, builders need to distinguish between hype and genuine value creation before the market corrects.
WHO PAYS: Technical founders and product managers at early-stage AI companies who are building agent-based products and need to validate their value proposition against actual market demand rather than investor excitement.
NICHE: ai-agents
PRICE: $$15/mo

ARCHITECTURE SPEC:
A Next.js SaaS application that aggregates market data, user behavior analytics, and economic metrics to help AI agent builders validate their value propositions. The tool uses data visualization dashboards and automated analysis to distinguish between genuine market opportunities and hype-driven trends.

PLANNED FILES:
- app/page.tsx
- app/dashboard/page.tsx
- app/api/auth/[...nextauth]/route.ts
- app/api/webhooks/lemonsqueezy/route.ts
- app/api/market-data/route.ts
- app/api/analysis/route.ts
- components/ui/dashboard.tsx
- components/ui/market-signals-chart.tsx
- components/ui/value-creation-metrics.tsx
- components/ui/pricing-card.tsx
- lib/auth.ts
- lib/lemonsqueezy.ts
- lib/database.ts
- lib/market-analysis.ts
- prisma/schema.prisma

DEPENDENCIES: next, react, typescript, tailwindcss, prisma, @prisma/client, next-auth, @auth/prisma-adapter, @lemonsqueezy/lemonsqueezy.js, recharts, lucide-react, axios, zod, stripe

REQUIREMENTS:
- Next.js 15 with App Router (app/ directory)
- TypeScript
- Tailwind CSS v4
- shadcn/ui components (npx shadcn@latest init, then add needed components)
- Dark theme ONLY — background #0d1117, no light mode
- Stripe Payment Link for payments (hosted checkout — use the URL directly as the Buy button href)
- Landing page that converts: hero, problem, solution, pricing, FAQ
- The actual tool/feature behind a paywall (cookie-based access after purchase)
- Mobile responsive
- SEO meta tags, Open Graph tags
- /api/health endpoint that returns {"status":"ok"}
- NO HEAVY ORMs: Do NOT use Prisma, Drizzle, TypeORM, Sequelize, or Mongoose. If the tool needs persistence, use direct SQL via `pg` (Postgres) or `better-sqlite3` (local), or just filesystem JSON. Reason: these ORMs require schema files and codegen steps that fail on Vercel when misconfigured.
- INTERNAL FILE DISCIPLINE: Every internal import (paths starting with `@/`, `./`, or `../`) MUST refer to a file you actually create in this build. If you write `import { Card } from "@/components/ui/card"`, then `components/ui/card.tsx` MUST exist with a real `export const Card` (or `export default Card`). Before finishing, scan all internal imports and verify every target file exists. Do NOT use shadcn/ui patterns unless you create every component from scratch — easier path: write all UI inline in the page that uses it.
- DEPENDENCY DISCIPLINE: Every package imported in any .ts, .tsx, .js, or .jsx file MUST be
  listed in package.json dependencies (or devDependencies for build-only). Before finishing,
  scan all source files for `import` statements and verify every external package (anything
  not starting with `.` or `@/`) appears in package.json. Common shadcn/ui peers that MUST
  be added if used:
  - lucide-react, clsx, tailwind-merge, class-variance-authority
  - react-hook-form, zod, @hookform/resolvers
  - @radix-ui/* (for any shadcn component)
- After running `npm run build`, if you see "Module not found: Can't resolve 'X'", add 'X'
  to package.json dependencies and re-run npm install + npm run build until it passes.

ENVIRONMENT VARIABLES (create .env.example):
- NEXT_PUBLIC_STRIPE_PAYMENT_LINK  (full URL, e.g. https://buy.stripe.com/test_XXX)
- NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY  (pk_test_... or pk_live_...)
- STRIPE_WEBHOOK_SECRET  (set when webhook is wired)

BUY BUTTON RULE: the Buy button's href MUST be `process.env.NEXT_PUBLIC_STRIPE_PAYMENT_LINK`
used as-is — do NOT construct URLs from a product ID, do NOT prepend any base URL,
do NOT wrap it in an embed iframe. The link opens Stripe's hosted checkout directly.

After creating all files:
1. Run: npm install
2. Run: npm run build
3. Fix any build errors
4. Verify the build succeeds with exit code 0

Do NOT use placeholder text. Write real, helpful content for the landing page
and the tool itself. The tool should actually work and provide value.
