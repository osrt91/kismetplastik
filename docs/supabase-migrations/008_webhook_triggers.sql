-- =============================================================================
-- Migration 008: Webhook Event Log & Triggers
-- =============================================================================
-- Creates a webhook_events table to log outgoing webhook events and
-- sets up triggers on key tables (orders, quote_requests, sample_requests,
-- pre_orders) to automatically record events when new rows are inserted.
-- =============================================================================

-- Webhook event log table
CREATE TABLE IF NOT EXISTS webhook_events (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  event_type TEXT NOT NULL,
  payload JSONB NOT NULL,
  status TEXT DEFAULT 'pending',
  response JSONB,
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE webhook_events ENABLE ROW LEVEL SECURITY;

-- Indexes for efficient querying
CREATE INDEX idx_webhook_events_type ON webhook_events(event_type);
CREATE INDEX idx_webhook_events_created ON webhook_events(created_at DESC);

-- Function to notify on new records by inserting into webhook_events
CREATE OR REPLACE FUNCTION notify_webhook() RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO webhook_events (event_type, payload)
  VALUES (TG_ARGV[0], row_to_json(NEW));
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers for automatic webhook event logging
CREATE TRIGGER orders_webhook AFTER INSERT ON orders
  FOR EACH ROW EXECUTE FUNCTION notify_webhook('new_order');

CREATE TRIGGER quotes_webhook AFTER INSERT ON quote_requests
  FOR EACH ROW EXECUTE FUNCTION notify_webhook('new_quote');

CREATE TRIGGER sample_requests_webhook AFTER INSERT ON sample_requests
  FOR EACH ROW EXECUTE FUNCTION notify_webhook('new_sample_request');

CREATE TRIGGER pre_orders_webhook AFTER INSERT ON pre_orders
  FOR EACH ROW EXECUTE FUNCTION notify_webhook('new_pre_order');
