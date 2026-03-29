// src/app/(private)/home/page.tsx  (TENANT APP)

import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import {
  getCurrentTenant,
  getActiveLease,
  getInvoices,
  getTenantNotifications,
} from "@/lib/services/tenant-data.service";
import { format } from "date-fns";
import { 
  Bell, 
  CreditCard, 
  Wrench,
  ArrowUpRight,
  UserCheck,
  Copy
} from "lucide-react";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

function formatCurrency(n: number | null) {
  if (n === null) return "—";
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(n);
}

export default async function HomePage() {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");

  const [tenant, lease, notifications] = await Promise.all([
    getCurrentTenant(),
    getActiveLease(),
    getTenantNotifications(),
  ]);

  const invoices = lease ? await getInvoices(lease.id) : [];
  const nextInvoice = invoices
    .filter(inv => inv.status === 'sent' || inv.status === 'overdue')
    .sort((a, b) => new Date(a.due_date).getTime() - new Date(b.due_date).getTime())[0];

  const unreadCount = notifications.filter((n) => !n.is_read).length;

  return (
    <div className="px-4 pt-6 pb-24 space-y-6">
      {/* Greeting */}
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#1F3A5F]">
            Hi, {tenant?.first_name || "there"} 👋
          </h1>
          <p className="text-sm text-slate-500 font-medium">
             {(() => {
               const unit = Array.isArray(lease?.unit) ? lease.unit[0] : lease?.unit;
               const building = Array.isArray(unit?.building) ? unit.building[0] : unit?.building;
               return building?.name || "Welcome to MyFlow";
             })()} 
             {(() => {
               const unit = Array.isArray(lease?.unit) ? lease.unit[0] : lease?.unit;
               return unit?.unit_code && ` • Unit ${unit.unit_code}`;
             })()}
          </p>
        </div>
        <div className="relative">
          <Link href="/notifications">
            <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm border border-slate-100">
              <Bell className="w-5 h-5 text-[#1F3A5F]" />
              {unreadCount > 0 && (
                <span className="absolute top-0 right-0 w-3 h-3 bg-[#2BBE9A] border-2 border-white rounded-full" />
              )}
            </div>
          </Link>
        </div>
      </header>

      {/* Account Pending / Missing Tenant Record Warning */}
      {!tenant && (
        <Card className="border-none shadow-lg shadow-amber-900/5 bg-amber-50 rounded-2xl overflow-hidden border-l-4 border-l-amber-400">
          <CardContent className="p-5 space-y-4">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 bg-amber-100 rounded-xl flex items-center justify-center shrink-0">
                <UserCheck className="w-5 h-5 text-amber-600" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-amber-900 uppercase tracking-tight">Account Pending Assignment</h3>
                <p className="text-xs text-amber-700 leading-relaxed mt-1">
                  Your account isn&apos;t linked to a property yet. Share your ID with your property manager to get access.
                </p>
              </div>
            </div>
            
            <div className="bg-white/50 rounded-xl p-3 border border-amber-200/50 flex items-center justify-between gap-3">
               <div className="min-w-0">
                  <p className="text-[10px] font-bold text-amber-600 uppercase tracking-widest mb-0.5">Your System ID</p>
                  <p className="text-[11px] font-mono text-amber-900 truncate">{userId}</p>
               </div>
               <button className="p-2 hover:bg-amber-100 rounded-lg transition-colors shrink-0">
                  <Copy className="w-4 h-4 text-amber-600" />
               </button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Quick Actions / Summary Card */}
      <Link href="/lease">
        <div className={cn(
          "rounded-2xl p-6 text-white shadow-lg relative overflow-hidden group transition-all",
          lease ? "bg-[#1F3A5F] shadow-blue-900/10" : "bg-slate-400 opacity-60 grayscale cursor-not-allowed"
        )}>
          <div className="relative z-10 flex justify-between items-center">
            <div>
              <p className="text-blue-100/70 text-[10px] font-bold uppercase tracking-wider mb-1">Upcoming Rent</p>
              <h2 className="text-3xl font-bold mb-1">
                {lease ? formatCurrency(lease.rent_amount + (lease.service_charge ?? 0)) : "$0.00"}
              </h2>
              <p className="text-blue-100/70 text-xs font-medium">
                {lease ? (nextInvoice ? `Due on ${format(new Date(nextInvoice.due_date), "MMM dd")}` : "Rent is up to date") : "No active lease"}
              </p>
            </div>
            <div className="bg-white/10 p-3 rounded-xl backdrop-blur-md group-hover:bg-[#2BBE9A] transition-colors">
              <CreditCard className="w-6 h-6" />
            </div>
          </div>
          <div className="absolute top-[-20%] right-[-10%] w-40 h-40 bg-white/5 rounded-full blur-3xl" />
        </div>
      </Link>

      {/* Grid of actions */}
      <div className="grid grid-cols-2 gap-3">
        <Link href="/maintenance/new">
          <Card className="border-none shadow-sm hover:shadow-md transition-all active:scale-[0.98] bg-white rounded-2xl overflow-hidden h-32 flex flex-col justify-between p-4">
             <div className="w-10 h-10 bg-amber-50 rounded-xl flex items-center justify-center">
                <Wrench className="w-5 h-5 text-amber-500" />
             </div>
             <div>
                <p className="text-sm font-bold text-[#1F3A5F]">Request Fix</p>
                <p className="text-[10px] text-slate-400">Plumbing, HVAC, etc.</p>
             </div>
          </Card>
        </Link>
        <Link href="/lease">
          <Card className="border-none shadow-sm hover:shadow-md transition-all active:scale-[0.98] bg-white rounded-2xl overflow-hidden h-32 flex flex-col justify-between p-4">
             <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center">
                <CreditCard className="w-5 h-5 text-blue-500" />
             </div>
             <div>
                <p className="text-sm font-bold text-[#1F3A5F]">Lease Info</p>
                <p className="text-[10px] text-slate-400">Terms & Payments</p>
             </div>
          </Card>
        </Link>
      </div>

      {/* Notifications Preview */}
      {notifications.length > 0 && (
        <section className="space-y-3">
           <div className="flex items-center justify-between px-1">
              <h3 className="text-sm font-bold text-[#1F3A5F] uppercase tracking-wider">Recent Alerts</h3>
              <Link href="/notifications" className="text-xs font-bold text-[#2BBE9A] flex items-center gap-1">
                View all <ArrowUpRight className="w-3 h-3" />
              </Link>
           </div>
           <div className="space-y-2">
              {notifications.slice(0, 3).map(notif => (
                <Link key={notif.id} href="/notifications">
                  <div className={cn(
                    "p-3 rounded-xl border flex gap-3 transition-colors",
                    notif.is_read ? "bg-white border-slate-100 opacity-80" : "bg-white border-[#2BBE9A]/20"
                  )}>
                    <div className={cn(
                      "w-8 h-8 rounded-full flex items-center justify-center shrink-0",
                      notif.is_read ? "bg-slate-50" : "bg-[#2BBE9A]/10"
                    )}>
                       <Bell className={cn("w-4 h-4", notif.is_read ? "text-slate-400" : "text-[#2BBE9A]")} />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className={cn("text-xs leading-tight mb-1", notif.is_read ? "text-slate-500" : "text-[#1F3A5F] font-bold")}>
                        {notif.message}
                      </p>
                      <p className="text-[10px] text-slate-400">
                        {format(new Date(notif.created_at), "MMM dd, h:mm a")}
                      </p>
                    </div>
                  </div>
                </Link>
              ))}
           </div>
        </section>
      )}

      {/* Unit Detail Preview - Only show if lease exists */}
      {lease && (
        <section className="space-y-3">
          <div className="flex items-center justify-between px-1">
              <h3 className="text-sm font-bold text-[#1F3A5F] uppercase tracking-wider">Unit Details</h3>
          </div>
          <Card className="border-none shadow-sm bg-white rounded-2xl overflow-hidden">
              <CardContent className="p-4 grid grid-cols-3 gap-4">
                {(() => {
                  const unit = Array.isArray(lease.unit) ? lease.unit[0] : lease.unit;
                  return (
                    <>
                      <div className="text-center">
                          <p className="text-[10px] text-slate-400 uppercase tracking-widest mb-1">Type</p>
                          <p className="text-xs font-bold text-[#1F3A5F] truncate">{unit?.unit_type || "Unit"}</p>
                      </div>
                      <div className="text-center border-x border-slate-50">
                          <p className="text-[10px] text-slate-400 uppercase tracking-widest mb-1">Bedrooms</p>
                          <p className="text-xs font-bold text-[#1F3A5F]">{unit?.bedrooms || "0"}</p>
                      </div>
                      <div className="text-center">
                          <p className="text-[10px] text-slate-400 uppercase tracking-widest mb-1">Area</p>
                          <p className="text-xs font-bold text-[#1F3A5F]">{unit?.area_sqm ? `${unit.area_sqm}m²` : "—"}</p>
                      </div>
                    </>
                  );
                })()}
              </CardContent>
          </Card>
        </section>
      )}
    </div>
  );
}

//----------------------------------------testing snippets----------------------------------------