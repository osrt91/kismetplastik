-- 009_rls_fixes.sql
-- RLS policies for pre_orders and webhook_events tables
-- These tables had RLS enabled but no policies, blocking all access.

-- =============================================================================
-- PRE_ORDERS
-- =============================================================================

-- Ensure RLS is enabled
ALTER TABLE IF EXISTS pre_orders ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if any (idempotent)
DROP POLICY IF EXISTS "pre_orders_insert_own" ON pre_orders;
DROP POLICY IF EXISTS "pre_orders_select_own" ON pre_orders;
DROP POLICY IF EXISTS "pre_orders_select_admin" ON pre_orders;

-- Authenticated users can INSERT their own rows
CREATE POLICY "pre_orders_insert_own"
  ON pre_orders
  FOR INSERT
  TO authenticated
  WITH CHECK (profile_id = auth.uid());

-- Authenticated users can SELECT their own rows
CREATE POLICY "pre_orders_select_own"
  ON pre_orders
  FOR SELECT
  TO authenticated
  USING (profile_id = auth.uid());

-- Admin role users can SELECT all rows
CREATE POLICY "pre_orders_select_admin"
  ON pre_orders
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
        AND profiles.role = 'admin'
    )
  );

-- =============================================================================
-- WEBHOOK_EVENTS
-- =============================================================================

-- Ensure RLS is enabled
ALTER TABLE IF EXISTS webhook_events ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if any (idempotent)
DROP POLICY IF EXISTS "webhook_events_insert_service" ON webhook_events;
DROP POLICY IF EXISTS "webhook_events_select_admin" ON webhook_events;
DROP POLICY IF EXISTS "webhook_events_no_public" ON webhook_events;

-- Only service_role can INSERT (triggers and backend functions)
-- Note: service_role bypasses RLS by default in Supabase,
-- so this policy restricts non-service-role users from inserting.
CREATE POLICY "webhook_events_insert_service"
  ON webhook_events
  FOR INSERT
  TO authenticated
  WITH CHECK (false);

-- Admin role users can SELECT all rows
CREATE POLICY "webhook_events_select_admin"
  ON webhook_events
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
        AND profiles.role = 'admin'
    )
  );

-- Explicitly deny anon access (SELECT)
-- With RLS enabled and no policy for anon, access is denied by default.
-- This policy is added for clarity and defense-in-depth.
CREATE POLICY "webhook_events_no_public"
  ON webhook_events
  FOR SELECT
  TO anon
  USING (false);
