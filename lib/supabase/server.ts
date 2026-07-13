import { createClient } from "@supabase/supabase-js";

/**
 * Server-only Supabase client - uses the secret (service_role) key.
 * This client bypasses RLS and can read all columns including admin_token and admin_password.
 * NEVER import this file from client components.
 */
export function createServiceClient() {
  const supabaseUrl =
    process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL || "";
  const supabaseSecretKey =
    process.env.SUPABASE_SECRET_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY!;

  return createClient(supabaseUrl, supabaseSecretKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}
