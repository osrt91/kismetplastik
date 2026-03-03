# n8n Webhook Integration - Kismet Plastik

This document describes how to integrate the Kismet Plastik B2B platform with [n8n](https://n8n.io/) for workflow automation.

## Environment Variables

Add the following to your `.env.local` (or Vercel environment settings):

| Variable | Required | Description |
|----------|----------|-------------|
| `N8N_WEBHOOK_URL` | Yes | The n8n webhook trigger URL (e.g., `https://your-n8n.example.com/webhook/kismet`) |
| `N8N_WEBHOOK_SECRET` | Yes | A shared secret for HMAC SHA-256 signature verification (min 32 characters) |

## Webhook Endpoint

**URL:** `POST /api/webhooks/n8n`

All incoming webhook payloads are verified using HMAC SHA-256. The signature must be sent in the `X-Webhook-Signature` header.

### Request Format

```json
{
  "event": "new_order",
  "data": { ... },
  "timestamp": "2026-03-03T12:00:00.000Z"
}
```

### Response Format

**Success (200):**
```json
{
  "success": true,
  "event": "new_order"
}
```

**Error (4xx/5xx):**
```json
{
  "success": false,
  "error": "Error description"
}
```

## Supported Event Types

| Event | Description | Trigger Source |
|-------|-------------|----------------|
| `new_order` | A new order has been placed | `orders` table INSERT |
| `new_quote` | A new quote request has been submitted | `quote_requests` table INSERT |
| `new_contact` | A new contact form submission | Contact API route |
| `new_sample_request` | A new sample request has been submitted | `sample_requests` table INSERT |
| `new_pre_order` | A new pre-order has been placed | `pre_orders` table INSERT |
| `stock_alert` | Stock level has fallen below threshold | Manual / scheduled check |
| `new_lead` | A new sales lead has been captured | Lead capture forms |

## Event Payloads

### new_order
```json
{
  "event": "new_order",
  "data": {
    "id": "uuid",
    "user_id": "uuid",
    "status": "pending",
    "total_amount": 15000,
    "items": [...],
    "shipping_address": "..."
  },
  "timestamp": "2026-03-03T12:00:00.000Z"
}
```

### new_quote
```json
{
  "event": "new_quote",
  "data": {
    "id": "uuid",
    "company_name": "Acme Ltd",
    "contact_email": "info@acme.com",
    "products": [...],
    "quantity": 10000,
    "message": "..."
  },
  "timestamp": "2026-03-03T12:00:00.000Z"
}
```

### new_contact
```json
{
  "event": "new_contact",
  "data": {
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "+90...",
    "company": "Acme Ltd",
    "subject": "Product Inquiry",
    "message": "..."
  },
  "timestamp": "2026-03-03T12:00:00.000Z"
}
```

### new_sample_request
```json
{
  "event": "new_sample_request",
  "data": {
    "id": "uuid",
    "company_name": "Acme Ltd",
    "contact_email": "info@acme.com",
    "products": [...],
    "notes": "..."
  },
  "timestamp": "2026-03-03T12:00:00.000Z"
}
```

### new_pre_order
```json
{
  "event": "new_pre_order",
  "data": {
    "id": "uuid",
    "user_id": "uuid",
    "product_id": "uuid",
    "quantity": 5000,
    "expected_date": "2026-04-01"
  },
  "timestamp": "2026-03-03T12:00:00.000Z"
}
```

### stock_alert
```json
{
  "event": "stock_alert",
  "data": {
    "product_id": "uuid",
    "product_name": "PET 100ml Bottle",
    "current_stock": 50,
    "threshold": 100
  },
  "timestamp": "2026-03-03T12:00:00.000Z"
}
```

### new_lead
```json
{
  "event": "new_lead",
  "data": {
    "name": "Jane Doe",
    "email": "jane@company.com",
    "company": "Company XYZ",
    "source": "catalog_download",
    "interest": "PET Bottles"
  },
  "timestamp": "2026-03-03T12:00:00.000Z"
}
```

## Outbound Webhooks (App to n8n)

The application sends webhook events to n8n using the `sendWebhookEvent()` function from `src/lib/webhook.ts`. This function:

1. Reads `N8N_WEBHOOK_URL` from environment
2. Signs the payload with HMAC SHA-256 using `N8N_WEBHOOK_SECRET`
3. Sends a POST request with the `X-Webhook-Signature` header

### Usage in API Routes

```typescript
import { sendWebhookEvent } from '@/lib/webhook';

// Inside an API route handler:
await sendWebhookEvent('new_order', {
  id: order.id,
  user_id: order.user_id,
  total_amount: order.total_amount,
});
```

## Database Triggers

The SQL migration at `docs/supabase-migrations/008_webhook_triggers.sql` sets up:

1. A `webhook_events` table that logs all triggered events
2. A `notify_webhook()` PostgreSQL function
3. Triggers on `orders`, `quote_requests`, `sample_requests`, and `pre_orders` tables

These triggers automatically insert rows into `webhook_events` when new records are created. You can poll or use Supabase Realtime to push these events to n8n.

## Setting Up n8n Workflows

1. **Install n8n** (self-hosted or cloud)
2. **Create a Webhook node** as the trigger for each workflow
3. **Configure the webhook URL** and set it as `N8N_WEBHOOK_URL` in your environment
4. **Set a shared secret** and configure it as `N8N_WEBHOOK_SECRET`
5. **Import workflow templates** from `docs/n8n/workflows/` into your n8n instance

### Example n8n Workflow Setup

1. Open n8n and create a new workflow
2. Add a **Webhook** trigger node
3. Set Authentication to **Header Auth** with `X-Webhook-Signature`
4. Add processing nodes (e.g., send email, post to Slack, update CRM)
5. Copy the webhook URL and set it as `N8N_WEBHOOK_URL`

## Workflow Templates

Pre-built workflow templates are available in `docs/n8n/workflows/`:

| File | Purpose |
|------|---------|
| `new-order-notification.json` | Notify team on new orders |
| `new-quote-notification.json` | Notify team on new quote requests |
| `new-contact-notification.json` | Notify team on contact form submissions |
| `sample-request-notification.json` | Notify team on sample requests |
| `pre-order-notification.json` | Notify team on pre-orders |
| `stock-alert.json` | Alert team when stock is low |
| `lead-notification.json` | Notify sales on new leads |

Import these into n8n via **Settings > Import Workflow** and customize as needed.
