// src/app/api/webhooks/clerk/route.ts  (TENANT APP)
// Identical structure to landlord webhook, but sets role = "tenant"
// and does NOT create an organization membership.

import { Webhook } from "svix";
import { headers } from "next/headers";
import { WebhookEvent } from "@clerk/nextjs/server";
import { clerkClient } from "@clerk/nextjs/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(req: Request) {
  const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET;
  if (!WEBHOOK_SECRET) throw new Error("CLERK_WEBHOOK_SECRET not set");

  const headerPayload = headers();
  const svix_id = headerPayload.get("svix-id");
  const svix_timestamp = headerPayload.get("svix-timestamp");
  const svix_signature = headerPayload.get("svix-signature");

  if (!svix_id || !svix_timestamp || !svix_signature) {
    return new Response("Missing svix headers", { status: 400 });
  }

  const payload = await req.json();
  const body = JSON.stringify(payload);

  const wh = new Webhook(WEBHOOK_SECRET);
  let evt: WebhookEvent;

  try {
    evt = wh.verify(body, {
      "svix-id": svix_id,
      "svix-timestamp": svix_timestamp,
      "svix-signature": svix_signature,
    }) as WebhookEvent;
  } catch {
    return new Response("Webhook verification failed", { status: 400 });
  }

  if (evt.type === "user.created") {
    const { id: clerkUserId, email_addresses, first_name, last_name } = evt.data;
    const email = email_addresses[0]?.email_address;

    // 1. Set role = "tenant" in Clerk metadata
    const clerk = await clerkClient();
    await clerk.users.updateUserMetadata(clerkUserId, {
      publicMetadata: { role: "tenant" },
    });

    // 2. Upsert user row in Supabase
    const supabase = await createClient();
    const { data: userRow } = await supabase
      .from("users")
      .upsert(
        {
          clerk_user_id: clerkUserId,
          email,
          full_name: [first_name, last_name].filter(Boolean).join(" "),
        },
        { onConflict: "clerk_user_id" }
      )
      .select("id")
      .single();

    // 3. Link user row to tenant record IF a tenant with this email exists
    //    (Landlord creates tenant record first with email; when tenant signs up
    //     their user_id gets linked automatically here.)
    if (userRow) {
      await supabase
        .from("tenants")
        .update({ user_id: userRow.id })
        .eq("email", email ?? "")
        .is("user_id", null); // only link if not already linked
    }
  }

  return new Response("OK", { status: 200 });
}
