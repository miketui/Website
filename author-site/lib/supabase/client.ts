"use client";

import { createClient } from "@supabase/supabase-js";
import { getSupabaseBrowserConfig } from "@/lib/env";

export function createBrowserSupabaseClient() {
  const config = getSupabaseBrowserConfig();
  if (!config.ok) return null;
  return createClient(config.value.url, config.value.anonKey);
}
