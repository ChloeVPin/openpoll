import { createClient } from "@supabase/supabase-js";

const supabaseUrl =
  process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL || "";
const supabasePublishableKey =
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!;

/**
 * Public Supabase client - uses the publishable (anon) key.
 * Safe for browser-side usage. Column-level grants prevent
 * this client from reading admin_token or admin_password.
 */
export const supabase = createClient(supabaseUrl, supabasePublishableKey);
