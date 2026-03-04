import { NextRequest, NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase-admin";
import { checkAuth } from "@/lib/auth";
import type { WebhookEventStatus } from "@/types/database";

const VALID_STATUSES: WebhookEventStatus[] = [
  "pending",
  "processing",
  "success",
  "failed",
];

export async function GET(request: NextRequest) {
  const authError = checkAuth(request);
  if (authError) return authError;

  const { searchParams } = new URL(request.url);
  const page = Math.max(1, parseInt(searchParams.get("page") ?? "1", 10));
  const limit = Math.min(100, parseInt(searchParams.get("limit") ?? "20", 10));
  const status = searchParams.get("status");
  const eventType = searchParams.get("event_type");

  const supabase = getSupabaseAdmin();

  // Count query
  let countQuery = supabase
    .from("webhook_events")
    .select("id", { count: "exact", head: true });

  if (status && VALID_STATUSES.includes(status as WebhookEventStatus)) {
    countQuery = countQuery.eq("status", status);
  }
  if (eventType) {
    countQuery = countQuery.eq("event_type", eventType);
  }

  const { count } = await countQuery;

  // Data query
  let query = supabase
    .from("webhook_events")
    .select(
      "id, event_type, status, retry_count, created_at, processed_at, error_message"
    )
    .order("created_at", { ascending: false })
    .range((page - 1) * limit, page * limit - 1);

  if (status && VALID_STATUSES.includes(status as WebhookEventStatus)) {
    query = query.eq("status", status);
  }
  if (eventType) {
    query = query.eq("event_type", eventType);
  }

  const { data, error } = await query;

  if (error) {
    console.error("[Admin Webhooks GET]", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }

  return NextResponse.json({
    success: true,
    data: data ?? [],
    pagination: {
      page,
      limit,
      total: count ?? 0,
      totalPages: Math.ceil((count ?? 0) / limit),
    },
  });
}
