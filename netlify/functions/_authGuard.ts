import type { HandlerEvent } from "@netlify/functions";
import { createClient } from "@supabase/supabase-js";

const url = process.env.SUPABASE_URL!;
const anon = process.env.VITE_SUPABASE_ANON_KEY!; // okay for token verification

function isLocal() {
  return (process.env.ALLOW_LOCALHOST ?? "true") === "true";
}

export function corsHeaders() {
  const origins = [
    "https://www.brightforgehub.com",
    isLocal() ? "http://localhost:5173" : ""
  ].filter(Boolean);

  // For simplicity, echo first allowed origin or self
  const origin = origins[0] ?? "https://www.brightforgehub.com";
  return {
    "Access-Control-Allow-Origin": origin,
    "Access-Control-Allow-Headers": "authorization, content-type",
    "Access-Control-Allow-Methods": "GET,POST,OPTIONS,DELETE",
  };
}

export function preflight(event: HandlerEvent) {
  if (event.httpMethod === "OPTIONS") {
    return { statusCode: 200, headers: corsHeaders(), body: "" };
  }
  return null;
}

export async function getUserFromEvent(event: HandlerEvent) {
  const auth = event.headers.authorization || "";
  const token = auth.startsWith("Bearer ") ? auth.slice(7) : null;
  if (!token) return { error: "missing Bearer token" as const };

  const supabase = createClient(url, anon);
  return supabase.auth.getUser(token);
}
