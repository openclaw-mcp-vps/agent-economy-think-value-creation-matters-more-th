import { createClient, type SupabaseClient } from "@supabase/supabase-js";

import type { AnalysisResult } from "@/types/analysis";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

export const supabaseAdmin: SupabaseClient | null =
  supabaseUrl && supabaseServiceRoleKey
    ? createClient(supabaseUrl, supabaseServiceRoleKey, {
        auth: {
          persistSession: false,
          autoRefreshToken: false
        }
      })
    : null;

export async function persistAnalysis(result: AnalysisResult): Promise<void> {
  if (!supabaseAdmin) {
    return;
  }

  const { error } = await supabaseAdmin.from("analysis_runs").insert({
    analysis_id: result.id,
    market: result.market,
    agent_type: result.agentType,
    business_model: result.businessModel,
    time_horizon: result.timeHorizon,
    recommendation: result.recommendation,
    overall_score: result.opportunities[0]?.overallScore ?? 0,
    payload: result,
    created_at: result.createdAt
  });

  if (error) {
    console.error("Failed to persist analysis run:", error.message);
  }
}

interface PaidCustomerInput {
  email: string;
  orderId: string;
  status: string;
  customerName?: string | null;
  rawPayload: unknown;
}

export async function upsertPaidCustomer(input: PaidCustomerInput): Promise<void> {
  if (!supabaseAdmin) {
    return;
  }

  const { error } = await supabaseAdmin.from("paid_customers").upsert(
    {
      email: input.email.toLowerCase(),
      order_id: input.orderId,
      status: input.status,
      customer_name: input.customerName ?? null,
      payload: input.rawPayload,
      updated_at: new Date().toISOString()
    },
    {
      onConflict: "order_id"
    }
  );

  if (error) {
    console.error("Failed to upsert paid customer:", error.message);
  }
}

export async function hasActiveAccess(email: string): Promise<boolean> {
  if (!supabaseAdmin) {
    return false;
  }

  const { data, error } = await supabaseAdmin
    .from("paid_customers")
    .select("id")
    .eq("email", email.toLowerCase())
    .in("status", ["paid", "active", "on_trial"])
    .limit(1);

  if (error) {
    console.error("Failed to check paid access:", error.message);
    return false;
  }

  return (data?.length ?? 0) > 0;
}
