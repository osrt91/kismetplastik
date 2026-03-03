#!/usr/bin/env node
/**
 * Apply B2B Platform Migration to Supabase
 *
 * Usage:
 *   npm run migrate                          # Direct Supabase API
 *   npm run migrate -- --via-dev-server      # Via Next.js dev server (localhost:3000)
 *   npm run migrate -- --migration 20260301000000_initial_schema
 *
 * Requirements:
 *   - .env.local must have NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY
 */

import { readFileSync, readdirSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const rootDir = resolve(__dirname, "..");
const migrationsDir = resolve(rootDir, "supabase/migrations");

// Parse CLI args
const args = process.argv.slice(2);
const viaDevServer = args.includes("--via-dev-server");
const migrationArg = args.find((_, i, a) => a[i - 1] === "--migration") ||
  "20260301000001_b2b_platform";
const devServerUrl = args.find((_, i, a) => a[i - 1] === "--url") ||
  "http://localhost:3000";

// Load .env.local
function loadEnv() {
  try {
    const envContent = readFileSync(resolve(rootDir, ".env.local"), "utf-8");
    for (const line of envContent.split("\n")) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith("#")) continue;
      const eqIdx = trimmed.indexOf("=");
      if (eqIdx === -1) continue;
      const key = trimmed.slice(0, eqIdx);
      const value = trimmed.slice(eqIdx + 1);
      if (!process.env[key]) {
        process.env[key] = value;
      }
    }
  } catch {
    // .env.local not found, rely on env vars
  }
}

loadEnv();

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const ADMIN_SECRET = process.env.ADMIN_SECRET;

function getMigrationFilename(name) {
  const filename = name.endsWith(".sql") ? name : `${name}.sql`;
  const pattern = /^\d{14}_[\w-]+\.sql$/;
  if (!pattern.test(filename)) {
    throw new Error(`Geçersiz migration adı: ${filename}`);
  }
  return filename;
}

function listMigrations() {
  return readdirSync(migrationsDir)
    .filter((f) => /^\d{14}_[\w-]+\.sql$/.test(f))
    .sort();
}

// ── Direct Supabase API approach ──

async function applyDirect(migrationName) {
  if (!SUPABASE_URL || !SERVICE_ROLE_KEY) {
    console.error("Error: NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are required.");
    console.error("Set them in .env.local or as environment variables.");
    process.exit(1);
  }

  const filename = getMigrationFilename(migrationName);
  const filePath = resolve(migrationsDir, filename);
  const sql = readFileSync(filePath, "utf-8");

  console.log(`Supabase URL: ${SUPABASE_URL}`);
  console.log(`Migration: ${filename} (${sql.length} bytes)\n`);

  // Test connectivity
  console.log("Testing connection...");
  const testRes = await fetch(`${SUPABASE_URL}/rest/v1/`, {
    headers: {
      apikey: SERVICE_ROLE_KEY,
      Authorization: `Bearer ${SERVICE_ROLE_KEY}`,
    },
  });
  if (!testRes.ok) {
    throw new Error(`Connection failed: HTTP ${testRes.status}`);
  }
  console.log("Connection OK\n");

  // Execute via pg-meta
  console.log("Applying migration via pg-meta...");
  const response = await fetch(`${SUPABASE_URL}/pg/query`, {
    method: "POST",
    headers: {
      apikey: SERVICE_ROLE_KEY,
      Authorization: `Bearer ${SERVICE_ROLE_KEY}`,
      "Content-Type": "application/json",
      "X-Connection-Encrypted": "true",
    },
    body: JSON.stringify({ query: sql }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`pg-meta failed (${response.status}): ${errorText}`);
  }

  const result = await response.json();
  console.log("Migration applied successfully!");
  console.log("Result:", JSON.stringify(result, null, 2).substring(0, 500));

  // Verify tables
  await verifyTables();
}

// ── Dev server approach ──

async function applyViaDevServer(migrationName) {
  if (!ADMIN_SECRET) {
    console.error("Error: ADMIN_SECRET is required for dev server mode.");
    process.exit(1);
  }

  const filename = getMigrationFilename(migrationName);
  const migrationKey = filename.replace(".sql", "");

  console.log(`Dev server: ${devServerUrl}`);
  console.log(`Migration: ${filename}\n`);

  // Test dev server is running
  console.log("Checking dev server...");
  try {
    const testRes = await fetch(`${devServerUrl}/api/admin/migrate`, {
      headers: { Cookie: `admin-token=${ADMIN_SECRET}` },
    });
    if (!testRes.ok) {
      throw new Error(`HTTP ${testRes.status}`);
    }
    const data = await testRes.json();
    console.log(`Available migrations: ${data.migrations?.join(", ")}\n`);
  } catch (err) {
    console.error(`Dev server not reachable: ${err.message}`);
    console.error("\nMake sure the dev server is running: npm run dev");
    process.exit(1);
  }

  // Apply migration
  console.log("Applying migration via dev server...");
  const response = await fetch(`${devServerUrl}/api/admin/migrate`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Cookie: `admin-token=${ADMIN_SECRET}`,
    },
    body: JSON.stringify({ migration: migrationKey }),
  });

  const result = await response.json();
  if (!response.ok || !result.success) {
    throw new Error(result.error || `HTTP ${response.status}`);
  }

  console.log(`Migration applied: ${result.message}`);
}

// ── Verify tables ──

async function verifyTables() {
  if (!SUPABASE_URL || !SERVICE_ROLE_KEY) return;

  console.log("\nVerifying tables...");
  const tables = [
    "companies",
    "b2b_profiles",
    "price_tiers",
    "b2b_orders",
    "b2b_order_items",
    "b2b_quote_requests",
    "saved_designs",
  ];

  for (const table of tables) {
    const res = await fetch(
      `${SUPABASE_URL}/rest/v1/${table}?select=id&limit=0`,
      {
        headers: {
          apikey: SERVICE_ROLE_KEY,
          Authorization: `Bearer ${SERVICE_ROLE_KEY}`,
        },
      }
    );
    const status = res.ok ? "OK" : `MISSING (${res.status})`;
    console.log(`  ${table}: ${status}`);
  }
}

// ── Main ──

async function main() {
  console.log("=== Kısmet Plastik B2B Migration ===\n");

  const available = listMigrations();
  console.log(`Available migrations: ${available.join(", ")}`);
  console.log(`Mode: ${viaDevServer ? "dev-server" : "direct"}\n`);

  if (viaDevServer) {
    await applyViaDevServer(migrationArg);
  } else {
    await applyDirect(migrationArg);
  }

  console.log("\n=== Migration Complete ===");
}

main().catch((err) => {
  console.error(`\nFatal error: ${err.message}`);
  console.error("\nAlternatifler:");
  console.error("  1. Dev server üzerinden: npm run migrate -- --via-dev-server");
  console.error("  2. SQL Editor: Supabase Dashboard > SQL Editor > New Query > Run");
  console.error("  3. Supabase CLI: npx supabase db push");
  process.exit(1);
});
