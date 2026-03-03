import crypto from 'crypto';

/**
 * Verify HMAC SHA-256 signature for incoming webhook payloads.
 * Uses timing-safe comparison to prevent timing attacks.
 */
export function verifyHmacSignature(payload: string, signature: string, secret: string): boolean {
  const expected = crypto.createHmac('sha256', secret).update(payload).digest('hex');

  // Both buffers must be the same length for timingSafeEqual
  if (signature.length !== expected.length) return false;

  return crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expected));
}

/**
 * Send a webhook event to the configured n8n webhook URL.
 * Silently returns if N8N_WEBHOOK_URL is not set.
 * Signs the payload with HMAC SHA-256 if N8N_WEBHOOK_SECRET is configured.
 */
export async function sendWebhookEvent(event: string, data: Record<string, unknown>): Promise<void> {
  const webhookUrl = process.env.N8N_WEBHOOK_URL;
  if (!webhookUrl) return;

  const secret = process.env.N8N_WEBHOOK_SECRET;
  const payload = JSON.stringify({ event, data, timestamp: new Date().toISOString() });
  const signature = secret
    ? crypto.createHmac('sha256', secret).update(payload).digest('hex')
    : '';

  await fetch(webhookUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Webhook-Signature': signature,
    },
    body: payload,
  }).catch((err) => {
    console.error('[Webhook] Failed to send event:', event, err);
  });
}
