/**
 * Seed script: site_settings table
 * Upserts core site settings (stats, contact, company) into Supabase.
 *
 * Usage:  node scripts/seed-cms-settings.mjs
 */
import 'dotenv/config';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

const settings = [
  // Stats
  { key: "stats_experience_years", value: "57", group: "stats" },
  { key: "stats_products", value: "500", group: "stats" },
  { key: "stats_capacity", value: "50M", group: "stats" },
  { key: "stats_customers", value: "1000", group: "stats" },
  { key: "experience_badge", value: "57+", group: "stats" },

  // Contact
  { key: "working_hours", value: "Pzt-Cum 09:00 - 18:00", group: "contact" },
  { key: "working_hours_en", value: "Mon-Fri 09:00 - 18:00", group: "contact" },
  { key: "google_maps_url", value: "", group: "contact" },
  { key: "phone", value: "+90 212 549 87 03", group: "contact" },
  { key: "email", value: "bilgi@kismetplastik.com", group: "contact" },

  // Company
  { key: "company_name", value: "Kısmet Plastik Kozmetik Ambalaj ve Kalıp San. Tic. Ltd. Şti.", group: "company" },
  { key: "company_address", value: "İkitelli OSB Mah. İPKAS 4A Blok Sok. No:5 Başakşehir/İstanbul 34490", group: "company" },
  { key: "company_address_en", value: "İkitelli OSB Mah. İPKAS 4A Blok Sok. No:5 Başakşehir/İstanbul 34490", group: "company" },
  { key: "company_tax_info", value: "İkitelli VD - 5590057417", group: "company" },
];

async function main() {
  console.log("Seeding site_settings...");

  const { data, error } = await supabase
    .from("site_settings")
    .upsert(settings, { onConflict: "key" })
    .select();

  if (error) {
    console.error("Error seeding site_settings:", error.message);
    process.exit(1);
  }

  console.log(`Upserted ${data.length} settings.`);
  console.log("Done.");
}

main();
