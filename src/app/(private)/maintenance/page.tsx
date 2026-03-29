// src/app/(private)/maintenance/page.tsx  (TENANT APP)

import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { getMaintenanceRequests, getActiveLease } from "@/lib/services/tenant-data.service";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import MaintenanceStatusBadge from "@/components/portal/MaintenanceStatusBadge";
import { format } from "date-fns";
import { Plus, ChevronRight, Wrench, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { MaintenancePriority } from "@/types";

const PRIORITY_STYLES: Record<MaintenancePriority, string> = {
  low: "text-slate-500",
  normal: "text-slate-600",
  high: "text-orange-600 font-semibold",
  emergency: "text-rose-600 font-bold animate-pulse",
};

export default async function MaintenancePage() {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");

  const [requests, lease] = await Promise.all([
    getMaintenanceRequests(),
    getActiveLease(),
  ]);

  return (
    <div className="px-4 pt-6 pb-24 space-y-6">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#1F3A5F]">Fix & Repair</h1>
          <p className="text-sm text-slate-500">Manage maintenance requests</p>
        </div>
        {lease && (
          <Link href="/maintenance/new">
            <Button className="bg-[#2BBE9A] hover:bg-[#2BBE9A]/90 text-white rounded-full px-4 h-10 shadow-lg shadow-[#2BBE9A]/20">
              <Plus className="w-5 h-5 mr-1" />
              New
            </Button>
          </Link>
        )}
      </header>

      {!lease ? (
        <div className="bg-amber-50 border border-amber-100 rounded-xl p-4 flex gap-3">
          <AlertCircle className="w-5 h-5 text-amber-500 shrink-0" />
          <p className="text-xs text-amber-700 leading-relaxed">
            You need an active lease to submit maintenance requests. Please contact your property manager.
          </p>
        </div>
      ) : requests.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center bg-white rounded-2xl border border-dashed border-slate-200">
          <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-4">
            <Wrench className="w-8 h-8 text-slate-300" />
          </div>
          <h3 className="text-lg font-bold text-[#1F3A5F] mb-1">No requests yet</h3>
          <p className="text-sm text-slate-500 max-w-[200px]">
            When you need something fixed, submit a request here.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {requests.map((req) => (
            <Link key={req.id} href={`/maintenance/${req.id}`}>
              <Card className="border-none shadow-sm hover:shadow-md transition-all active:scale-[0.98] bg-white rounded-xl overflow-hidden group">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="space-y-2 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400 bg-slate-50 px-2 py-0.5 rounded border border-slate-100">
                          {req.category}
                        </span>
                        <MaintenanceStatusBadge status={req.status} />
                      </div>
                      
                      <p className="text-sm font-semibold text-[#1F3A5F] line-clamp-1 group-hover:text-[#2BBE9A] transition-colors">
                        {req.description}
                      </p>
                      
                      <div className="flex items-center justify-between text-[10px] text-slate-400 pt-1">
                        <span className="flex items-center gap-1">
                          <span className={cn("w-1.5 h-1.5 rounded-full", req.priority === 'emergency' ? 'bg-rose-500' : 'bg-slate-300')} />
                          <span className={PRIORITY_STYLES[req.priority as MaintenancePriority]}>{req.priority} priority</span>
                        </span>
                        <span>{format(new Date(req.created_at), "MMM dd, yyyy")}</span>
                      </div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-slate-300 mt-1 shrink-0" />
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

