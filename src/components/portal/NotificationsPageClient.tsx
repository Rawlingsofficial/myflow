"use client";
// src/components/portal/NotificationsPageClient.tsx  (TENANT APP)

import { useState } from "react";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { Bell, MailOpen, Inbox } from "lucide-react";
import { useSupabaseWithAuth } from "@/lib/supabase/client";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

type Notification = {
  id: string;
  type: string | null;
  message: string | null;
  is_read: boolean;
  created_at: string;
};

const TYPE_CONFIG: Record<string, { label: string; className: string }> = {
  lease_assigned: { label: "Lease", className: "bg-blue-50 text-blue-700 border-blue-100" },
  lease_ended: { label: "Lease", className: "bg-slate-50 text-slate-600 border-slate-100" },
  maintenance_update: { label: "Fix", className: "bg-amber-50 text-amber-700 border-amber-100" },
  invoice_created: { label: "Billing", className: "bg-purple-50 text-purple-700 border-purple-100" },
  payment_received: { label: "Payment", className: "bg-emerald-50 text-emerald-700 border-emerald-100" },
  general: { label: "Notice", className: "bg-slate-50 text-slate-600 border-slate-100" },
};

export function NotificationsPageClient({
  initialNotifications,
}: {
  initialNotifications: Notification[];
}) {
  const [items, setItems] = useState<Notification[]>(initialNotifications);
  const [markingAll, setMarkingAll] = useState(false);
  const supabase = useSupabaseWithAuth();

  async function markRead(id: string) {
    const originalItems = [...items];
    setItems((prev) =>
      prev.map((n) => (n.id === id ? { ...n, is_read: true } : n))
    );

    const { error } = await supabase
      .from("notifications")
      .update({ is_read: true })
      .eq("id", id);

    if (error) {
       setItems(originalItems);
       toast.error("Failed to update notification.");
    }
  }

  async function markAllRead() {
    if (markingAll) return;
    setMarkingAll(true);
    try {
      const { error } = await supabase
        .from("notifications")
        .update({ is_read: true })
        .eq("is_read", false);

      if (error) throw error;

      setItems((prev) => prev.map((n) => ({ ...n, is_read: true })));
      toast.success("All notifications marked as read.");
    } catch {
      toast.error("Failed to update notifications.");
    } finally {
      setMarkingAll(false);
    }
  }

  const unreadCount = items.filter((n) => !n.is_read).length;

  return (
    <div className="px-4 pt-6 pb-24 space-y-6">
      <header className="flex items-end justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#1F3A5F]">Alerts</h1>
          <p className="text-sm text-slate-500">
            {unreadCount > 0 ? `You have ${unreadCount} unread messages` : "You're all caught up"}
          </p>
        </div>
        {unreadCount > 0 && (
          <Button
            variant="ghost"
            size="sm"
            onClick={markAllRead}
            disabled={markingAll}
            className="text-[#2BBE9A] hover:text-[#2BBE9A] hover:bg-[#2BBE9A]/5 font-bold text-xs gap-1.5 h-8 px-2"
          >
            <MailOpen className="w-3.5 h-3.5" />
            Mark all read
          </Button>
        )}
      </header>

      {items.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 text-center bg-white rounded-2xl border border-dashed border-slate-200">
          <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-4">
            <Inbox className="w-8 h-8 text-slate-300" />
          </div>
          <h3 className="text-lg font-bold text-[#1F3A5F] mb-1">No alerts</h3>
          <p className="text-sm text-slate-500 max-w-[200px]">
            You&apos;ll receive notifications about your lease and payments here.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {items.map((n) => (
            <div
              key={n.id}
              onClick={() => !n.is_read && markRead(n.id)}
              className={cn(
                "relative rounded-2xl border p-4 transition-all cursor-pointer group",
                n.is_read
                  ? "bg-white border-slate-100 opacity-75"
                  : "bg-white border-[#2BBE9A]/20 shadow-sm shadow-[#2BBE9A]/5"
              )}
            >
              {!n.is_read && (
                <span className="absolute top-4 right-4 w-2 h-2 rounded-full bg-[#2BBE9A]" />
              )}
              <div className="flex items-start gap-4">
                <div className={cn(
                  "w-10 h-10 rounded-full flex items-center justify-center shrink-0",
                  n.is_read ? "bg-slate-50" : "bg-[#2BBE9A]/10"
                )}>
                  <Bell className={cn(
                    "w-5 h-5",
                    n.is_read ? "text-slate-400" : "text-[#2BBE9A]"
                  )} />
                </div>
                <div className="min-w-0 flex-1 space-y-2">
                  <div className="flex items-center gap-2">
                    <span
                      className={cn(
                        "text-[10px] px-2 py-0.5 rounded font-bold uppercase tracking-tight border",
                        TYPE_CONFIG[n.type ?? "general"]?.className || "bg-slate-50 text-slate-600 border-slate-100"
                      )}
                    >
                      {TYPE_CONFIG[n.type ?? "general"]?.label || "Notice"}
                    </span>
                    <span className="text-[10px] font-medium text-slate-400 uppercase tracking-wider">
                      {format(new Date(n.created_at), "MMM dd, h:mm a")}
                    </span>
                  </div>
                  <p className={cn(
                    "text-sm leading-relaxed",
                    n.is_read ? "text-slate-500 font-medium" : "text-[#1F3A5F] font-bold"
                  )}>
                    {n.message}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}