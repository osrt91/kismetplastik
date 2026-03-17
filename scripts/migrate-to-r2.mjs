#!/usr/bin/env node
/**
 * Migrate files from Supabase Storage to Cloudflare R2
 *
 * Usage:
 *   node scripts/migrate-to-r2.mjs                    # Migrate all buckets
 *   node scripts/migrate-to-r2.mjs --bucket gallery    # Migrate single bucket
 *   node scripts/migrate-to-r2.mjs --dry-run           # Preview without uploading
 *
 * Requires .env.local with:
 *   NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY
 *   R2_ACCESS_KEY_ID, R2_SECRET_ACCESS_KEY, R2_ENDPOINT, R2_BUCKET_NAME, R2_PUBLIC_URL
 */

import { createClient } from "@supabase/supabase-js";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { readFileSync } from "fs";
import { resolve } from "path";

// Load env
const envPath = resolve(process.cwd(), ".env.local");
const envContent = readFileSync(envPath, "utf-8");
const env = {};
for (const line of envContent.split(/\r?\n/)) {
  const match = line.match(/^([^#=]+?)=(.*)$/);
  if (match) env[match[1].trim()] = match[2].trim();
}

// Supabase client
const supabase = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY);

// R2 client
const r2 = new S3Client({
  region: "auto",
  endpoint: env.R2_ENDPOINT,
  credentials: {
    accessKeyId: env.R2_ACCESS_KEY_ID,
    secretAccessKey: env.R2_SECRET_ACCESS_KEY,
  },
});

const R2_BUCKET = env.R2_BUCKET_NAME || "kismetplastik-assets";
const R2_PUBLIC_URL = env.R2_PUBLIC_URL || "https://cdn.kismetplastik.com";

const BUCKETS = ["gallery", "products", "blog", "certificates", "references", "resources", "settings"];

// Parse args
const args = process.argv.slice(2);
const dryRun = args.includes("--dry-run");
const bucketFilter = args.includes("--bucket") ? args[args.indexOf("--bucket") + 1] : null;

const bucketsToMigrate = bucketFilter ? [bucketFilter] : BUCKETS;

let totalFiles = 0;
let totalMigrated = 0;
let totalErrors = 0;
let totalSkipped = 0;

async function listAllFiles(bucket, prefix = "") {
  const files = [];
  const { data, error } = await supabase.storage.from(bucket).list(prefix, { limit: 1000 });
  if (error) {
    console.error(`  Error listing ${bucket}/${prefix}:`, error.message);
    return files;
  }
  for (const item of data || []) {
    if (item.id) {
      // It's a file
      files.push(prefix ? `${prefix}/${item.name}` : item.name);
    } else {
      // It's a folder
      const subPath = prefix ? `${prefix}/${item.name}` : item.name;
      const subFiles = await listAllFiles(bucket, subPath);
      files.push(...subFiles);
    }
  }
  return files;
}

async function migrateFile(bucket, filePath) {
  const r2Key = `${bucket}/${filePath}`;

  try {
    // Download from Supabase
    const { data, error } = await supabase.storage.from(bucket).download(filePath);
    if (error) {
      console.error(`  FAIL ${r2Key}: download error - ${error.message}`);
      totalErrors++;
      return null;
    }

    const buffer = Buffer.from(await data.arrayBuffer());
    const contentType = data.type || "application/octet-stream";

    if (dryRun) {
      console.log(`  DRY-RUN ${r2Key} (${(buffer.length / 1024).toFixed(1)} KB, ${contentType})`);
      totalSkipped++;
      return r2Key;
    }

    // Upload to R2
    await r2.send(new PutObjectCommand({
      Bucket: R2_BUCKET,
      Key: r2Key,
      Body: buffer,
      ContentType: contentType,
      CacheControl: "public, max-age=31536000, immutable",
    }));

    console.log(`  OK ${r2Key} (${(buffer.length / 1024).toFixed(1)} KB)`);
    totalMigrated++;
    return r2Key;
  } catch (err) {
    console.error(`  FAIL ${r2Key}: ${err.message}`);
    totalErrors++;
    return null;
  }
}

async function migrateBucket(bucket) {
  console.log(`\n--- Migrating bucket: ${bucket} ---`);
  const files = await listAllFiles(bucket);
  totalFiles += files.length;
  console.log(`  Found ${files.length} files`);

  const results = [];
  for (const file of files) {
    const result = await migrateFile(bucket, file);
    if (result) results.push(result);
  }
  return results;
}

async function updateDatabaseUrls(migratedFiles) {
  if (dryRun) {
    console.log("\n--- DRY-RUN: Skipping database URL updates ---");
    return;
  }

  console.log("\n--- Updating database URLs ---");

  const supabaseUrl = env.NEXT_PUBLIC_SUPABASE_URL;

  // Tables and their URL/path columns
  const updates = [
    { table: "gallery_images", urlCol: "image_url", pathCol: "storage_path", bucket: "gallery" },
    { table: "products", urlCol: "image_url", pathCol: null, bucket: "products" },
    { table: "blog_posts", urlCol: "cover_image", pathCol: null, bucket: "blog" },
    { table: "certificates", urlCol: "pdf_url", pathCol: "storage_path", bucket: "certificates" },
    { table: "references", urlCol: "logo_url", pathCol: "storage_path", bucket: "references" },
    { table: "resources", urlCol: "file_url", pathCol: "storage_path", bucket: "resources" },
  ];

  for (const { table, urlCol, pathCol, bucket } of updates) {
    try {
      const { data: rows, error } = await supabase.from(table).select(`id, ${urlCol}${pathCol ? `, ${pathCol}` : ""}`);
      if (error) {
        console.error(`  Error reading ${table}:`, error.message);
        continue;
      }

      let updated = 0;
      for (const row of rows || []) {
        const oldUrl = row[urlCol];
        if (!oldUrl || !oldUrl.includes(supabaseUrl)) continue;

        // Extract the storage path from the Supabase URL
        const pathMatch = oldUrl.match(/\/storage\/v1\/object\/public\/[^/]+\/(.+)$/);
        if (!pathMatch) continue;

        const filePath = pathMatch[1];
        const newUrl = `${R2_PUBLIC_URL}/${bucket}/${filePath}`;
        const newPath = `${bucket}/${filePath}`;

        const updateData = { [urlCol]: newUrl };
        if (pathCol) updateData[pathCol] = newPath;

        const { error: updateError } = await supabase.from(table).update(updateData).eq("id", row.id);
        if (updateError) {
          console.error(`  Error updating ${table}#${row.id}:`, updateError.message);
        } else {
          updated++;
        }
      }
      console.log(`  ${table}: ${updated} URLs updated`);
    } catch (err) {
      console.error(`  Error processing ${table}:`, err.message);
    }
  }
}

async function main() {
  console.log("=== Supabase → R2 Migration ===");
  console.log(`Mode: ${dryRun ? "DRY-RUN" : "LIVE"}`);
  console.log(`Buckets: ${bucketsToMigrate.join(", ")}`);
  console.log(`R2 Bucket: ${R2_BUCKET}`);
  console.log(`CDN URL: ${R2_PUBLIC_URL}`);

  const allMigrated = [];
  for (const bucket of bucketsToMigrate) {
    const results = await migrateBucket(bucket);
    allMigrated.push(...results);
  }

  // Update database URLs to point to CDN
  await updateDatabaseUrls(allMigrated);

  console.log("\n=== Migration Summary ===");
  console.log(`Total files found: ${totalFiles}`);
  console.log(`Migrated: ${totalMigrated}`);
  console.log(`Skipped (dry-run): ${totalSkipped}`);
  console.log(`Errors: ${totalErrors}`);
  console.log(`DB URLs updated: ${dryRun ? "skipped" : "done"}`);
}

main().catch(console.error);
