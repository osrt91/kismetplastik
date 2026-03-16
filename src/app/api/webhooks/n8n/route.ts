import { NextRequest, NextResponse } from 'next/server';
import { verifyHmacSignature } from '@/lib/webhook';

interface WebhookPayload {
  event: string;
  data: Record<string, unknown>;
  timestamp: string;
}

const SUPPORTED_EVENTS = [
  'new_order',
  'new_quote',
  'new_contact',
  'new_sample_request',
  'new_pre_order',
  'stock_alert',
  'new_lead',
] as const;

type WebhookEvent = (typeof SUPPORTED_EVENTS)[number];

function handleEvent(_event: WebhookEvent, _data: Record<string, unknown>, _timestamp: string): void {
  // TODO: Implement event handling (e.g., database insert, notification dispatch)
}

export async function POST(request: NextRequest) {
  try {
    const secret = process.env.N8N_WEBHOOK_SECRET;

    if (!secret) {
      return NextResponse.json(
        { success: false, error: 'Webhook secret is not configured.' },
        { status: 503 }
      );
    }

    const rawBody = await request.text();
    const signature = request.headers.get('x-webhook-signature') ?? '';

    if (!signature || !verifyHmacSignature(rawBody, signature, secret)) {
      return NextResponse.json(
        { success: false, error: 'Invalid webhook signature.' },
        { status: 401 }
      );
    }

    const body = JSON.parse(rawBody) as WebhookPayload;

    if (!body.event || !body.data) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields: event, data.' },
        { status: 400 }
      );
    }

    if (!SUPPORTED_EVENTS.includes(body.event as WebhookEvent)) {
      return NextResponse.json(
        { success: false, error: `Unsupported event type: ${body.event}` },
        { status: 400 }
      );
    }

    handleEvent(body.event as WebhookEvent, body.data, body.timestamp);

    return NextResponse.json({ success: true, event: body.event });
  } catch {
    return NextResponse.json(
      { success: false, error: 'Failed to process webhook.' },
      { status: 500 }
    );
  }
}
