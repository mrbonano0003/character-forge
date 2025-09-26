import type { Handler } from "@netlify/functions";
import { createClient } from "@supabase/supabase-js";
import { z } from "zod";
import { corsHeaders, preflight, getUserFromEvent } from "./_authGuard";

const url = process.env.SUPABASE_URL!;
const service = process.env.SUPABASE_SERVICE_KEY!;

const schema = z.object({
  title: z.string().min(1).max(200),
  is_public: z.boolean().optional(),
  slug: z.string().min(3).max(60).regex(/^[a-z0-9-]+$/).optional(),
  data: z.any(),
});

export const handler: Handler = async (event) => {
  const pf = preflight(event);
  if (pf) return pf;

  if (event.httpMethod !== "POST")
    return { statusCode: 405, headers: corsHeaders(), body: "Method Not Allowed" };

  const ures = await getUserFromEvent(event);
  // @ts-ignore
  if (ures.error || !ures.data?.user) {
    return { statusCode: 401, headers: corsHeaders(), body: "Unauthorized" };
  }
  const user = ures.data.user;

  let body;
  try { body = schema.parse(JSON.parse(event.body || "{}")); }
  catch (e: any) {
    return { statusCode: 400, headers: corsHeaders(), body: e.message };
  }

  const admin = createClient(url, service, { auth: { persistSession: false } });

  const payload = {
    user_id: user.id,
    title: body.title,
    is_public: !!body.is_public,
    slug: body.slug || null,
    data: body.data,
    updated_at: new Date().toISOString(),
  };

  const { error } = await admin.from("characters").upsert(payload, { onConflict: "slug" });
  if (error) return { statusCode: 400, headers: corsHeaders(), body: error.message };

  return { statusCode: 200, headers: corsHeaders(), body: "ok" };
};
