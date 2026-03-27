// src/app/(private)/notifications/page.tsx  (TENANT APP)

import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { getTenantNotifications } from "@/lib/services/tenant-data.service";
import { NotificationsPageClient } from "@/components/portal/NotificationsPageClient";

export default async function NotificationsPage() {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");

  const notifications = await getTenantNotifications();

  return <NotificationsPageClient initialNotifications={notifications} />;
}
