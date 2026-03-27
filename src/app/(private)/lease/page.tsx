// src/app/(private)/lease/page.tsx  (TENANT APP)

import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { getActiveLease, getInvoices } from "@/lib/services/tenant-data.service";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";

function formatDate(d: string | null) {
  return d ? format(new Date(d), "dd MMM yyyy") : "—";
}

function formatCurrency(n: number | null) {
  if (!n) return "—";
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(n);
}

const INVOICE_STATUS_STYLES: Record<string, string> = {
  paid: "bg-emerald-100 text-emerald-800",
  sent: "bg-blue-100 text-blue-800",
  overdue: "bg-red-100 text-red-800",
  draft: "bg-gray-100 text-gray-600",
  void: "bg-gray-100 text-gray-400 line-through",
};

export default async function LeasePage() {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");

  const lease = await getActiveLease();

  if (!lease) {
    return (
      <div className="px-4 pt-8 text-center">
        <p className="text-muted-foreground text-sm">
          No active lease found. Please contact your landlord.
        </p>
      </div>
    );
  }

  const invoices = await getInvoices(lease.id);

  return (
    <div className="space-y-4 pb-24 px-4 pt-4 max-w-lg mx-auto">
      <h1 className="text-2xl font-bold">My Lease</h1>

      {/* Lease overview */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Lease Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <Row label="Unit" value={`${lease.unit?.[0]?.building?.[0]?.name} — ${lease.unit?.[0]?.unit_code}`} />
          <Row label="Rent" value={formatCurrency(lease.rent_amount)} />
          {lease.service_charge && (
            <Row label="Service Charge" value={formatCurrency(lease.service_charge)} />
          )}
          <Row
            label="Total Monthly"
            value={formatCurrency(
              lease.rent_amount + (lease.service_charge ?? 0)
            )}
            bold
          />
          <Row label="Lease Start" value={formatDate(lease.lease_start)} />
          <Row label="Lease End" value={formatDate(lease.lease_end)} />
          {lease.renewal_date && (
            <Row label="Renewal Date" value={formatDate(lease.renewal_date)} />
          )}
          {lease.escalation_rate && (
            <Row
              label="Escalation Rate"
              value={`${lease.escalation_rate}% p.a.`}
            />
          )}
          {lease.break_clause_date && (
            <Row
              label="Break Clause"
              value={formatDate(lease.break_clause_date)}
            />
          )}
          <Row
            label="Payment Terms"
            value={`${lease.payment_terms ?? 30} days`}
          />
        </CardContent>
      </Card>

      {/* Invoices */}
      <div>
        <h2 className="text-lg font-semibold mb-3">Invoices</h2>
        {invoices.length === 0 ? (
          <p className="text-sm text-muted-foreground">No invoices yet.</p>
        ) : (
          <div className="space-y-2">
            {invoices.map((inv) => (
              <Card key={inv.id}>
                <CardContent className="py-3 px-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium">{inv.invoice_number}</p>
                      <p className="text-xs text-muted-foreground">
                        Due {formatDate(inv.due_date)}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-semibold">
                        {formatCurrency(inv.total_amount)}
                      </p>
                      <span
                        className={`text-xs px-2 py-0.5 rounded-full ${
                          INVOICE_STATUS_STYLES[inv.status] ??
                          "bg-gray-100 text-gray-600"
                        }`}
                      >
                        {inv.status}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function Row({
  label,
  value,
  bold,
}: {
  label: string;
  value: string;
  bold?: boolean;
}) {
  return (
    <div className="flex justify-between items-center text-sm">
      <span className="text-muted-foreground">{label}</span>
      <span className={bold ? "font-semibold" : ""}>{value}</span>
    </div>
  );
}
