"use client";
// src/app/(private)/maintenance/new/page.tsx  (TENANT APP)

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

const CATEGORIES = [
  { value: "plumbing", label: "Plumbing" },
  { value: "electrical", label: "Electrical" },
  { value: "hvac", label: "HVAC / Air Con" },
  { value: "appliance", label: "Appliance" },
  { value: "general", label: "General Repair" },
  { value: "other", label: "Other" },
];

const PRIORITIES = [
  { value: "low", label: "Low" },
  { value: "normal", label: "Normal" },
  { value: "high", label: "High" },
  { value: "emergency", label: "Emergency" },
];

export default function NewMaintenancePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    category: "general",
    priority: "normal",
    description: "",
  });

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.description.trim()) {
      toast.error("Please describe the issue.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/maintenance", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error ?? "Failed to submit");
      }

      toast.success("Maintenance request submitted. We'll be in touch soon.");
      router.push("/maintenance");
    } catch (err: any) {
      toast.error(err.message ?? "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="px-4 pt-4 pb-24 max-w-lg mx-auto space-y-4">
      <div className="flex items-center gap-3">
        <Link href="/maintenance">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="w-4 h-4" />
          </Button>
        </Link>
        <h1 className="text-xl font-bold">New Request</h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Category */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Category</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-2">
              {CATEGORIES.map((cat) => (
                <button
                  type="button"
                  key={cat.value}
                  onClick={() => setForm((f) => ({ ...f, category: cat.value }))}
                  className={`py-2 px-3 rounded-lg text-sm text-left transition-colors ${
                    form.category === cat.value
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted hover:bg-muted/70"
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Priority */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Priority</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-4 gap-2">
              {PRIORITIES.map((p) => (
                <button
                  type="button"
                  key={p.value}
                  onClick={() => setForm((f) => ({ ...f, priority: p.value }))}
                  className={`py-2 px-2 rounded-lg text-xs text-center transition-colors ${
                    form.priority === p.value
                      ? p.value === "emergency"
                        ? "bg-red-600 text-white"
                        : p.value === "high"
                        ? "bg-orange-500 text-white"
                        : "bg-primary text-primary-foreground"
                      : "bg-muted hover:bg-muted/70"
                  }`}
                >
                  {p.label}
                </button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Description */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Description</CardTitle>
          </CardHeader>
          <CardContent>
            <textarea
              className="w-full min-h-[120px] text-sm bg-muted/50 rounded-lg p-3 resize-none focus:outline-none focus:ring-2 focus:ring-ring"
              placeholder="Describe the issue in detail — what happened, where it is, how long it's been a problem..."
              value={form.description}
              onChange={(e) =>
                setForm((f) => ({ ...f, description: e.target.value }))
              }
            />
          </CardContent>
        </Card>

        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? "Submitting..." : "Submit Request"}
        </Button>
      </form>
    </div>
  );
}
