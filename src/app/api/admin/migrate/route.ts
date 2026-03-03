import { NextRequest, NextResponse } from "next/server";
import { checkAuth } from "@/lib/auth";
import { readFileSync, readdirSync } from "fs";
import { resolve } from "path";

// Allowed migration file pattern: YYYYMMDDHHMMSS_name.sql
const MIGRATION_PATTERN = /^\d{14}_[\w-]+\.sql$/;

function getMigrationsDir(): string {
  return resolve(process.cwd(), "supabase/migrations");
}

function listMigrations(): string[] {
  const dir = getMigrationsDir();
  return readdirSync(dir)
    .filter((f) => MIGRATION_PATTERN.test(f))
    .sort();
}

function readMigrationSql(filename: string): string {
  if (!MIGRATION_PATTERN.test(filename)) {
    throw new Error("Geçersiz migration dosya adı");
  }
  const filePath = resolve(getMigrationsDir(), filename);
  return readFileSync(filePath, "utf-8");
}

async function executeSqlOnSupabase(sql: string): Promise<{ ok: boolean; data?: unknown; error?: string }> {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !key) {
    return { ok: false, error: "Missing SUPABASE_URL or SERVICE_ROLE_KEY" };
  }

  // Supabase pg-meta endpoint for raw SQL execution
  const response = await fetch(`${url}/pg/query`, {
    method: "POST",
    headers: {
      apikey: key,
      Authorization: `Bearer ${key}`,
      "Content-Type": "application/json",
      "X-Connection-Encrypted": "true",
    },
    body: JSON.stringify({ query: sql }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    return { ok: false, error: `pg-meta failed (${response.status}): ${errorText}` };
  }

  const data = await response.json();
  return { ok: true, data };
}

// GET: List available migrations
export async function GET(request: NextRequest) {
  const authError = checkAuth(request);
  if (authError) return authError;

  try {
    const migrations = listMigrations();
    return NextResponse.json({ success: true, migrations });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}

// POST: Apply a migration
export async function POST(request: NextRequest) {
  const authError = checkAuth(request);
  if (authError) return authError;

  try {
    const body = await request.json();
    const { migration } = body;

    if (!migration || typeof migration !== "string") {
      return NextResponse.json(
        { success: false, error: "migration parametresi gerekli (örn: '20260301000001_b2b_platform')" },
        { status: 400 }
      );
    }

    // Add .sql extension if not present
    const filename = migration.endsWith(".sql") ? migration : `${migration}.sql`;

    // Validate filename
    if (!MIGRATION_PATTERN.test(filename)) {
      return NextResponse.json(
        { success: false, error: `Geçersiz migration adı: ${filename}` },
        { status: 400 }
      );
    }

    // Check file exists
    const available = listMigrations();
    if (!available.includes(filename)) {
      return NextResponse.json(
        { success: false, error: `Migration bulunamadı: ${filename}`, available },
        { status: 404 }
      );
    }

    // Read SQL
    const sql = readMigrationSql(filename);

    // Execute on Supabase
    const result = await executeSqlOnSupabase(sql);

    if (!result.ok) {
      return NextResponse.json(
        { success: false, error: result.error },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: `Migration uygulandı: ${filename}`,
      migration: filename,
      sqlSize: sql.length,
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
