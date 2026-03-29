// src/app/(private)/maintenance/[id]/page.tsx
import { auth } from "@clerk/nextjs/server";
import { redirect, notFound } from "next/navigation";
import { getMaintenanceRequests } from "@/lib/services/tenant-data.service";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronLeft, Wrench, Calendar, AlertTriangle, Clock, MessageSquare } from "lucide-react";
import Link from "next/link";
import { format } from "date-fns";
import MaintenanceStatusBadge from "@/components/portal/MaintenanceStatusBadge";
import { cn } from "@/lib/utils";

export default async function MaintenanceDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");

  const requests = await getMaintenanceRequests();
  const request = requests.find(r => r.id === id);

  if (!request) notFound();

  return (
    <div className="px-4 pt-6 pb-24 space-y-6">
      <header className="flex items-center gap-3">
        <Link href="/maintenance">
          <Button variant="ghost" size="icon" className="rounded-full h-10 w-10 bg-white shadow-sm border border-slate-100">
            <ChevronLeft className="w-5 h-5 text-[#1F3A5F]" />
          </Button>
        </Link>
        <div>
          <h1 className="text-xl font-bold text-[#1F3A5F]">Request Details</h1>
          <p className="text-xs text-slate-500">#{id.slice(0, 8)}</p>
        </div>
      </header>

      <div className="space-y-4">
        {/* Status Card */}
        <Card className="border-none shadow-sm bg-white rounded-2xl overflow-hidden">
          <CardContent className="p-6">
            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center">
                  <Wrench className="w-5 h-5 text-[#1F3A5F]" />
                </div>
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Category</p>
                  <p className="text-sm font-bold text-[#1F3A5F] capitalize">{request.category}</p>
                </div>
              </div>
              <MaintenanceStatusBadge status={request.status} />
            </div>

            <div className="grid grid-cols-2 gap-4 pt-6 border-t border-slate-50">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-slate-400" />
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Submitted</p>
                  <p className="text-xs font-bold text-[#1F3A5F]">{format(new Date(request.created_at), "MMM dd, yyyy")}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-slate-400" />
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Priority</p>
                  <p className={cn(
                    "text-xs font-bold capitalize",
                    request.priority === 'emergency' ? "text-rose-600" : "text-[#1F3A5F]"
                  )}>{request.priority}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Description Card */}
        <section className="space-y-2">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest px-1">Issue Description</h3>
          <Card className="border-none shadow-sm bg-white rounded-2xl overflow-hidden">
            <CardContent className="p-6">
              <p className="text-sm text-slate-600 leading-relaxed italic">
                "{request.description}"
              </p>
            </CardContent>
          </Card>
        </section>

        {/* Timeline/Updates */}
        <section className="space-y-4 pt-4">
          <div className="flex items-center gap-2 px-1">
            <Clock className="w-4 h-4 text-[#1F3A5F]" />
            <h3 className="text-sm font-bold text-[#1F3A5F] uppercase tracking-wider">Activity Timeline</h3>
          </div>

          <div className="space-y-4 relative before:absolute before:left-[19px] before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-100">
            {/* Initial Request */}
            <div className="flex gap-4 relative">
              <div className="w-10 h-10 rounded-full bg-white border-4 border-slate-50 flex items-center justify-center shrink-0 z-10 shadow-sm text-[#2BBE9A]">
                <Clock className="w-4 h-4" />
              </div>
              <div className="pt-2">
                <p className="text-sm font-bold text-[#1F3A5F]">Request Received</p>
                <p className="text-xs text-slate-400">{format(new Date(request.created_at), "MMM dd, yyyy 'at' h:mm a")}</p>
              </div>
            </div>

            {/* Updates from DB */}
            {request.maintenance_updates?.map((update: any) => (
              <div key={update.id} className="flex gap-4 relative">
                <div className="w-10 h-10 rounded-full bg-white border-4 border-slate-50 flex items-center justify-center shrink-0 z-10 shadow-sm text-[#1F3A5F]">
                  <MessageSquare className="w-4 h-4" />
                </div>
                <div className="pt-2 flex-1">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-bold text-[#1F3A5F]">Status Update: <span className="capitalize">{update.status.replace('_', ' ')}</span></p>
                    <p className="text-[10px] font-medium text-slate-400">{format(new Date(update.created_at), "MMM dd")}</p>
                  </div>
                  {update.notes && <p className="text-xs text-slate-500 mt-1 leading-relaxed">{update.notes}</p>}
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}

