"use client";
// src/app/(private)/maintenance/new/page.tsx  (TENANT APP)

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ChevronLeft, Wrench, AlertTriangle, Info } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

const CATEGORIES = [
  { value: "plumbing", label: "Plumbing" },
  { value: "electrical", label: "Electrical" },
  { value: "hvac", label: "HVAC" },
  { value: "appliance", label: "Appliance" },
  { value: "general", label: "General" },
  { value: "other", label: "Other" },
];

const PRIORITIES = [
  { value: "low", label: "Low", color: "bg-slate-100 text-slate-600" },
  { value: "normal", label: "Normal", color: "bg-blue-100 text-blue-600" },
  { value: "high", label: "High", color: "bg-orange-100 text-orange-600" },
  { value: "emergency", label: "Emergency", color: "bg-rose-100 text-rose-600" },
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

      toast.success("Maintenance request submitted successfully.");
      router.push("/maintenance");
      router.refresh();
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : "Something went wrong";
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="px-4 pt-6 pb-24 space-y-6">
      <header className="flex items-center gap-3">
        <Link href="/maintenance">
          <Button variant="ghost" size="icon" className="rounded-full h-10 w-10 bg-white shadow-sm border border-slate-100">
            <ChevronLeft className="w-5 h-5 text-[#1F3A5F]" />
          </Button>
        </Link>
        <div>
          <h1 className="text-xl font-bold text-[#1F3A5F]">New Request</h1>
          <p className="text-xs text-slate-500 text-nowrap">Tell us what needs fixing</p>
        </div>
      </header>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Category */}
        <section className="space-y-3">
          <div className="flex items-center gap-2">
             <Wrench className="w-4 h-4 text-[#1F3A5F]" />
             <h3 className="text-sm font-bold text-[#1F3A5F] uppercase tracking-wider">Category</h3>
          </div>
          <div className="grid grid-cols-3 gap-2">
            {CATEGORIES.map((cat) => (
              <button
                type="button"
                key={cat.value}
                onClick={() => setForm((f) => ({ ...f, category: cat.value }))}
                className={cn(
                  "py-3 px-2 rounded-xl text-xs font-bold transition-all border shadow-sm",
                  form.category === cat.value
                    ? "bg-[#1F3A5F] text-white border-[#1F3A5F] scale-[1.02]"
                    : "bg-white text-slate-500 border-slate-100 hover:border-slate-300"
                )}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </section>

        {/* Priority */}
        <section className="space-y-3">
          <div className="flex items-center gap-2">
             <AlertTriangle className="w-4 h-4 text-[#1F3A5F]" />
             <h3 className="text-sm font-bold text-[#1F3A5F] uppercase tracking-wider">Priority</h3>
          </div>
          <div className="grid grid-cols-2 gap-2">
            {PRIORITIES.map((p) => (
              <button
                type="button"
                key={p.value}
                onClick={() => setForm((f) => ({ ...f, priority: p.value }))}
                className={cn(
                  "py-3 px-4 rounded-xl text-xs font-bold transition-all border flex items-center justify-between",
                  form.priority === p.value
                    ? "ring-2 ring-[#2BBE9A] ring-offset-1 border-[#2BBE9A] bg-white"
                    : "bg-white text-slate-500 border-slate-100"
                )}
              >
                <span>{p.label}</span>
                <span className={cn("w-2 h-2 rounded-full", p.color.split(' ')[0])} />
              </button>
            ))}
          </div>
        </section>

        {/* Description */}
        <section className="space-y-3">
          <div className="flex items-center gap-2">
             <Info className="w-4 h-4 text-[#1F3A5F]" />
             <h3 className="text-sm font-bold text-[#1F3A5F] uppercase tracking-wider">Description</h3>
          </div>
          <Card className="border-none shadow-sm rounded-2xl overflow-hidden">
            <CardContent className="p-0">
              <textarea
                className="w-full min-h-[140px] text-sm bg-white p-4 resize-none focus:outline-none placeholder:text-slate-300"
                placeholder="Please provide details about the issue, location, and how we can access the unit..."
                value={form.description}
                onChange={(e) =>
                  setForm((f) => ({ ...f, description: e.target.value }))
                }
              />
            </CardContent>
          </Card>
        </section>

        <Button 
          type="submit" 
          className="w-full h-14 bg-[#2BBE9A] hover:bg-[#2BBE9A]/90 text-white font-bold rounded-2xl shadow-lg shadow-[#2BBE9A]/20 text-base" 
          disabled={loading}
        >
          {loading ? "Submitting..." : "Submit Request"}
        </Button>
      </form>
    </div>
  );
}
