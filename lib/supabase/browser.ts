"use client";

import { createBrowserClient } from "@supabase/ssr";
import { getSupabaseBrowserConfig } from "@/lib/env";

/** Browser Supabase client for real Auth sessions (magic link). Returns null if env is unconfigured — callers must handle that, never assume it exists. */
export function createSupabaseBrowserClient() {
  const config = getSupabaseBrowserConfig();
  if (!config.ok) return null;
  return createBrowserClient(config.value.url, config.value.anonKey);
}
