import { createClient } from "@supabase/supabase-js";

export const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL ?? "http://localhost-placeholder",
  import.meta.env.VITE_SUPABASE_ANON_KEY ?? "anon-placeholder",
  { auth: { persistSession: true, autoRefreshToken: true } }
);
