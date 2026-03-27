"use client";
// src/components/portal/NotificationsPageClient.tsx  (TENANT APP)

import { useState } from "react";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { Bell, BellOff, Check } from "lucide-react";
import { useSupabaseWithAuth } from "@/lib/supabase/client";
import { toast } from "sonner";

type Notification = {
  id: string;
  type: string | null;
  message: string | null;
  is_read: boolean;
  created_at: string;
};

const TYPE_LABELS: Record<string, string> = {
  lease_assigned: "Lease",
  lease_ended: "Lease",
  maintenance_update: "Maintenance",
  invoice_created: "Invoice",
  payment_received: "Payment",
  general: "Notice",
};

const TYPE_COLORS: Record<string, string> = {
  lease_assigned: "bg-blue-100 text-blue-700",
  lease_ended: "bg-gray-100 text-gray-600",
  maintenance_update: "bg-orange-100 text-orange-700",
  invoice_created: "bg-purple-100 text-purple-700",
  payment_received: "bg-emerald-100 text-emerald-700",
  general: "bg-gray-100 text-gray-600",
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
    setItems((prev) =>
      prev.map((n) => (n.id === id ? { ...n, is_read: true } : n))
    );
    await supabase
      .from("notifications")
      .update({ is_read: true })
      .eq("id", id);
  }

  async function markAllRead() {
    setMarkingAll(true);
    try {
      await supabase
        .from("notifications")
        .update({ is_read: true })
        .eq("is_read", false);
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
    <div className="px-4 pt-4 pb-24 max-w-lg mx-auto space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Notifications</h1>
          {unreadCount > 0 && (
            <p className="text-sm text-muted-foreground">
              {unreadCount} unread
            </p>
          )}
        </div>
        {unreadCount > 0 && (
          <Button
            variant="outline"
            size="sm"
            onClick={markAllRead}
            disabled={markingAll}
          >
            <Check className="w-3.5 h-3.5 mr-1.5" />
            Mark all read
          </Button>
        )}
      </div>

      {items.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <BellOff className="w-8 h-8 text-muted-foreground mb-3" />
          <p className="font-medium">No notifications</p>
          <p className="text-sm text-muted-foreground mt-1">
            You're all caught up.
          </p>
        </div>
      ) : (
        <div className="space-y-2">
          {items.map((n) => (
            <div
              key={n.id}
              onClick={() => !n.is_read && markRead(n.id)}
              className={`relative rounded-xl border p-4 transition-colors cursor-pointer ${
                n.is_read
                  ? "bg-background border-border"
                  : "bg-primary/5 border-primary/20"
              }`}
            >
              {!n.is_read && (
                <span className="absolute top-3 right-3 w-2 h-2 rounded-full bg-primary" />
              )}
              <div className="flex items-start gap-3">
                <Bell className="w-4 h-4 mt-0.5 text-muted-foreground shrink-0" />
                <div className="min-w-0 space-y-1">
                  <div className="flex items-center gap-2">
                    <span
                      className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                        TYPE_COLORS[n.type ?? "general"] ??
                        "bg-gray-100 text-gray-600"
                      }`}
                    >
                      {TYPE_LABELS[n.type ?? "general"] ?? "Notice"}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {format(new Date(n.created_at), "dd MMM, h:mm a")}
                    </span>
                  </div>
                  <p className="text-sm">{n.message}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}