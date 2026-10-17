"use client";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";
const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
export const isBackendConfigured = Boolean(url && key);
let instance: SupabaseClient | null = null;
export function getSupabase(): SupabaseClient | null {
  if (!isBackendConfigured) return null;
  if (!instance) instance = createClient(url!, key!, {auth:{persistSession:true,autoRefreshToken:true,detectSessionInUrl:true}});
  return instance;
}
