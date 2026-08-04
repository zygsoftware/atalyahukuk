import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import type { Database } from "./types";

/**
 * Cookie/oturum kullanmayan, salt-okunur Supabase client.
 *
 * Herkese açık içerik okumaları (blog, duyuru, galeri, site ayarları) için
 * kullanılır. `@/lib/supabase/server`'daki client `cookies()` çağırdığından,
 * `generateStaticParams` ile statik üretilen sayfalarda (ör. blog/duyuru
 * detay sayfaları) runtime'da "Page changed from static to dynamic" hatasına
 * yol açar — bu client cookie'ye dokunmadığı için o soruna girmez.
 */
export function createStaticClient() {
  return createSupabaseClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { auth: { persistSession: false } },
  );
}
