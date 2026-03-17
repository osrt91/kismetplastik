import {
  S3Client,
  PutObjectCommand,
  DeleteObjectCommand,
  ListObjectsV2Command,
} from "@aws-sdk/client-s3";

// ---------------------------------------------------------------------------
// Config
// ---------------------------------------------------------------------------

const R2_ACCOUNT_ID = process.env.R2_ACCOUNT_ID;
const R2_ACCESS_KEY_ID = process.env.R2_ACCESS_KEY_ID;
const R2_SECRET_ACCESS_KEY = process.env.R2_SECRET_ACCESS_KEY;
const R2_BUCKET_NAME = process.env.R2_BUCKET_NAME || "kismetplastik-assets";
const R2_PUBLIC_URL = process.env.R2_PUBLIC_URL || "https://cdn.kismetplastik.com";
const R2_ENDPOINT = process.env.R2_ENDPOINT;

// ---------------------------------------------------------------------------
// Lazy singleton S3-compatible client
// ---------------------------------------------------------------------------

let _client: S3Client | null = null;

function getR2Client(): S3Client {
  if (!_client) {
    if (!R2_ENDPOINT || !R2_ACCESS_KEY_ID || !R2_SECRET_ACCESS_KEY) {
      throw new Error("R2 credentials not configured");
    }
    _client = new S3Client({
      region: "auto",
      endpoint: R2_ENDPOINT,
      credentials: {
        accessKeyId: R2_ACCESS_KEY_ID,
        secretAccessKey: R2_SECRET_ACCESS_KEY,
      },
    });
  }
  return _client;
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/** Check whether R2 credentials are present in the environment. */
export function isR2Configured(): boolean {
  return !!(R2_ENDPOINT && R2_ACCESS_KEY_ID && R2_SECRET_ACCESS_KEY);
}

/**
 * Upload a file to R2.
 *
 * @param folder  Maps to the old Supabase bucket name: "gallery", "products",
 *                "blog", "certificates", "references", "resources", "settings".
 * @param fileName  The file name (e.g. "hero.webp").
 * @param body  File contents as Buffer or Uint8Array.
 * @param contentType  MIME type (e.g. "image/webp").
 * @returns The public CDN URL for the uploaded file.
 */
export async function uploadToR2(
  folder: string,
  fileName: string,
  body: Buffer | Uint8Array,
  contentType: string,
): Promise<string> {
  const key = `${folder}/${fileName}`;
  const client = getR2Client();

  await client.send(
    new PutObjectCommand({
      Bucket: R2_BUCKET_NAME,
      Key: key,
      Body: body,
      ContentType: contentType,
      CacheControl: "public, max-age=31536000, immutable",
    }),
  );

  return `${R2_PUBLIC_URL}/${key}`;
}

/** Delete a single file from R2. */
export async function deleteFromR2(key: string): Promise<void> {
  const client = getR2Client();
  await client.send(
    new DeleteObjectCommand({
      Bucket: R2_BUCKET_NAME,
      Key: key,
    }),
  );
}

/** Delete multiple files from R2 in parallel. */
export async function deleteMultipleFromR2(keys: string[]): Promise<void> {
  const client = getR2Client();
  await Promise.all(
    keys.map((key) =>
      client.send(
        new DeleteObjectCommand({
          Bucket: R2_BUCKET_NAME,
          Key: key,
        }),
      ),
    ),
  );
}

/** List all object keys under a given prefix (folder). */
export async function listR2Files(prefix: string): Promise<string[]> {
  const client = getR2Client();
  const result = await client.send(
    new ListObjectsV2Command({
      Bucket: R2_BUCKET_NAME,
      Prefix: prefix,
    }),
  );
  return (result.Contents || []).map((obj) => obj.Key!).filter(Boolean);
}

/** Get the public CDN URL for a given object key. */
export function getR2PublicUrl(key: string): string {
  return `${R2_PUBLIC_URL}/${key}`;
}

/**
 * Generate a unique storage path, matching the pattern used by the existing
 * Supabase storage uploads.
 *
 * @param folder  Top-level folder ("gallery", "products", etc.)
 * @param ext  File extension without dot ("webp", "jpg", "pdf").
 * @param subfolder  Optional subfolder within the folder.
 * @returns A unique key like "gallery/thumbnails/1710123456789-a1b2c3.webp"
 */
export function generateStoragePath(
  folder: string,
  ext: string,
  subfolder?: string,
): string {
  const name = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
  if (subfolder) return `${folder}/${subfolder}/${name}`;
  return `${folder}/${name}`;
}

// Re-export account ID for admin diagnostics if needed
export { R2_ACCOUNT_ID, R2_BUCKET_NAME, R2_PUBLIC_URL };
