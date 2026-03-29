// src/app/(private)/lease/page.tsx  (TENANT APP)

import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { getActiveLease, getInvoices } from "@/lib/services/tenant-data.service";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { FileText, Calendar, CreditCard } from "lucide-react";
import { cn } from "@/lib/utils";

function formatDate(d: string | null) {
  return d ? format(new Date(d), "MMM dd, yyyy") : "—";
}

function formatCurrency(n: number | null) {
  if (n === null) return "—";
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(n);
}

const STATUS_CONFIG: Record<string, { label: string; className: string }> = {
  paid: { label: "Paid", className: "bg-emerald-50 text-emerald-700 border-emerald-100" },
  sent: { label: "Pending", className: "bg-blue-50 text-blue-700 border-blue-100" },
  overdue: { label: "Overdue", className: "bg-rose-50 text-rose-700 border-rose-100" },
  draft: { label: "Draft", className: "bg-slate-50 text-slate-600 border-slate-100" },
  void: { label: "Void", className: "bg-slate-50 text-slate-400 border-slate-100 line-through" },
};

export default async function LeasePage() {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");

  const lease = await getActiveLease();

  if (!lease) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] px-6 text-center">
        <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4">
          <FileText className="w-8 h-8 text-slate-400" />
        </div>
        <h2 className="text-xl font-bold text-[#1F3A5F] mb-2">No Active Lease</h2>
        <p className="text-slate-500 text-sm">
          We couldn't find an active lease for your account. Please contact your property manager if this is an error.
        </p>
      </div>
    );
  }

  const invoices = await getInvoices(lease.id);
  
  // Find next payment date (earliest unpaid/overdue invoice)
  const nextInvoice = [...invoices]
    .filter(inv => inv.status === 'sent' || inv.status === 'overdue')
    .sort((a, b) => new Date(a.due_date).getTime() - new Date(b.due_date).getTime())[0];

  return (
    <div className="px-4 pt-6 pb-24 space-y-6">
      <header>
        <h1 className="text-2xl font-bold text-[#1F3A5F]">Lease & Payments</h1>
        <p className="text-sm text-slate-500">Manage your lease and track rent payments</p>
      </header>

      {/* Lease Summary Card */}
      <div className="relative overflow-hidden bg-[#1F3A5F] rounded-2xl p-6 text-white shadow-xl shadow-blue-900/10">
        <div className="relative z-10">
          <div className="flex justify-between items-start mb-6">
            <div>
              <p className="text-blue-200 text-xs font-medium uppercase tracking-wider mb-1">Monthly Rent</p>
              <h2 className="text-3xl font-bold">
                {formatCurrency(lease.rent_amount + (lease.service_charge ?? 0))}
              </h2>
            </div>
            <div className="bg-white/10 backdrop-blur-md rounded-xl p-2">
              <CreditCard className="w-6 h-6 text-blue-200" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 pt-4 border-t border-white/10">
            <div>
              <p className="text-blue-200 text-[10px] uppercase tracking-wider mb-1">Next Payment</p>
              <p className="text-sm font-semibold flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5" />
                {nextInvoice ? formatDate(nextInvoice.due_date) : "Up to date"}
              </p>
            </div>
            <div>
              <p className="text-blue-200 text-[10px] uppercase tracking-wider mb-1">Lease Ends</p>
              <p className="text-sm font-semibold flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5" />
                {formatDate(lease.lease_end)}
              </p>
            </div>
          </div>
        </div>
        
        {/* Decorative elements */}
        <div className="absolute top-[-20%] right-[-10%] w-48 h-48 bg-blue-400/10 rounded-full blur-3xl" />
        <div className="absolute bottom-[-10%] left-[-5%] w-32 h-32 bg-[#2BBE9A]/20 rounded-full blur-2xl" />
      </div>

      {/* Detailed Lease Info */}
      <Card className="border-none shadow-sm bg-white rounded-xl overflow-hidden">
        <CardContent className="p-0">
          <div className="divide-y divide-slate-50">
            <InfoRow label="Unit" value={lease.unit?.unit_code || "—"} />
            <InfoRow label="Building" value={lease.unit?.building?.name || "—"} />
            <InfoRow label="Start Date" value={formatDate(lease.lease_start)} />
            <InfoRow label="Base Rent" value={formatCurrency(lease.rent_amount)} />
            {lease.service_charge !== null && (
               <InfoRow label="Service Charge" value={formatCurrency(lease.service_charge)} />
            )}
          </div>
        </CardContent>
      </Card>

      {/* Invoices List */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-[#1F3A5F]">Payment History</h3>
          <span className="text-xs text-slate-500 font-medium">{invoices.length} invoices</span>
        </div>

        <div className="space-y-3">
          {invoices.length === 0 ? (
            <div className="bg-white rounded-xl p-8 text-center border border-dashed border-slate-200">
              <p className="text-sm text-slate-500">No invoices generated yet.</p>
            </div>
          ) : (
            invoices.map((inv) => (
              <div 
                key={inv.id}
                className="bg-white rounded-xl p-4 shadow-sm border border-slate-100 flex items-center justify-between hover:border-[#2BBE9A]/30 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className={cn(
                    "w-10 h-10 rounded-full flex items-center justify-center",
                    inv.status === 'paid' ? "bg-emerald-50" : "bg-slate-50"
                  )}>
                    <FileText className={cn(
                      "w-5 h-5",
                      inv.status === 'paid' ? "text-emerald-500" : "text-slate-400"
                    )} />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-[#1F3A5F]">{inv.invoice_number}</p>
                    <p className="text-xs text-slate-500">Due {formatDate(inv.due_date)}</p>
                  </div>
                </div>
                
                <div className="text-right">
                  <p className="text-sm font-bold text-[#1F3A5F] mb-1">{formatCurrency(inv.total_amount)}</p>
                  <Badge className={cn(
                    "text-[10px] px-2 py-0 h-5 font-bold uppercase tracking-tight border shadow-none",
                    STATUS_CONFIG[inv.status]?.className || "bg-slate-50 text-slate-500 border-slate-100"
                  )}>
                    {STATUS_CONFIG[inv.status]?.label || inv.status}
                  </Badge>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between items-center p-4">
      <span className="text-sm text-slate-500">{label}</span>
      <span className="text-sm font-semibold text-[#1F3A5F]">{value}</span>
    </div>
  );
}
