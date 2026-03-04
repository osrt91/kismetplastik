import { NextRequest, NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase-admin";
import { checkAuth } from "@/lib/auth";

interface NotificationSettingInput {
  event_type: string;
  email_enabled: boolean;
  email_recipients: string[];
  webhook_enabled: boolean;
  webhook_url: string;
}

const VALID_EVENT_TYPES = [
  "new_order",
  "new_quote",
  "new_contact",
  "new_sample_request",
  "new_dealer",
  "order_status_change",
];

export async function GET(request: NextRequest) {
  const authError = checkAuth(request);
  if (authError) return authError;

  try {
    const supabase = getSupabaseAdmin();

    const { data, error } = await supabase
      .from("notification_settings")
      .select("*")
      .order("event_type");

    if (error) {
      console.error("[Admin Notifications GET]", error);
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, data: data ?? [] });
  } catch (err) {
    console.error("[Admin Notifications GET]", err);
    return NextResponse.json(
      { success: false, error: "Sunucu hatası" },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  const authError = checkAuth(request);
  if (authError) return authError;

  let body: { settings?: NotificationSettingInput[] };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { success: false, error: "Geçersiz JSON" },
      { status: 400 }
    );
  }

  if (!Array.isArray(body.settings) || body.settings.length === 0) {
    return NextResponse.json(
      { success: false, error: "Geçersiz ayar verisi" },
      { status: 400 }
    );
  }

  // Validate each setting entry
  for (const setting of body.settings) {
    if (!VALID_EVENT_TYPES.includes(setting.event_type)) {
      return NextResponse.json(
        {
          success: false,
          error: `Geçersiz olay türü: ${setting.event_type}`,
        },
        { status: 400 }
      );
    }

    if (!Array.isArray(setting.email_recipients)) {
      return NextResponse.json(
        { success: false, error: "email_recipients bir dizi olmalıdır" },
        { status: 400 }
      );
    }
  }

  try {
    const supabase = getSupabaseAdmin();
    const now = new Date().toISOString();

    // Upsert all settings by event_type
    const upsertData = body.settings.map((s) => ({
      event_type: s.event_type,
      email_enabled: Boolean(s.email_enabled),
      email_recipients: s.email_recipients,
      webhook_enabled: Boolean(s.webhook_enabled),
      webhook_url: s.webhook_url?.trim() || null,
      updated_at: now,
    }));

    const { data, error } = await supabase
      .from("notification_settings")
      .upsert(upsertData, { onConflict: "event_type" })
      .select();

    if (error) {
      console.error("[Admin Notifications PUT]", error);
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Bildirim ayarları kaydedildi",
      data: data ?? [],
    });
  } catch (err) {
    console.error("[Admin Notifications PUT]", err);
    return NextResponse.json(
      { success: false, error: "Sunucu hatası" },
      { status: 500 }
    );
  }
}
