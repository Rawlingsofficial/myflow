// src/app/(private)/home/page.tsx  (TENANT APP)

import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import {
  getCurrentTenant,
  getActiveLease,
  getPaymentHistory,
  getTenantNotifications,
} from "@/lib/services/tenant-data.service";
import RentSummaryCard from "@/components/portal/RentSummaryCard";
import { NotificationsList } from "@/components/portal/NotificationsList";
import { LeaseInfoCard } from "@/components/portal/LeaseInfoCard";
import { UnitCard } from "@/components/portal/UnitCard";
import { NoLeaseState } from "@/components/portal/NoLeaseState";

export default async function HomePage() {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");

  const [tenant, lease, notifications] = await Promise.all([
    getCurrentTenant(),
    getActiveLease(),
    getTenantNotifications(),
  ]);

  // Tenant not yet linked — waiting for landlord to assign them
  if (!tenant) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] px-4 text-center">
        <h2 className="text-xl font-semibold mb-2">Account Pending</h2>
        <p className="text-muted-foreground text-sm max-w-xs">
          Your account has been created. Your landlord will link you to a unit
          shortly.
        </p>
      </div>
    );
  }

  if (!lease) {
    return <NoLeaseState />;
  }

  const payments = await getPaymentHistory(lease.id);
  const unreadCount = notifications.filter((n) => !n.is_read).length;

  return (
    <div className="space-y-4 pb-24 px-4 pt-4 max-w-lg mx-auto">
      {/* Greeting */}
      <div>
        <h1 className="text-2xl font-bold">
          Hi, {tenant.first_name ?? tenant.company_name ?? "Tenant"} 👋
        </h1>
        <p className="text-sm text-muted-foreground">
          {lease.unit?.[0]?.building?.[0]?.name} — Unit {lease.unit?.[0]?.unit_code}
        </p>
      </div>

      {/* Unit card */}
      <UnitCard unit={lease.unit} />

      {/* Rent summary */}
      <RentSummaryCard
        rentData={{
          rentAmount: lease.rent_amount,
          service_charge: lease.service_charge,
          paymentTerms: lease.payment_terms,
          recentPayments: payments.slice(0, 3),
        }}
      />

      {/* Lease info */}
      <LeaseInfoCard
        leaseStart={lease.lease_start}
        leaseEnd={lease.lease_end}
        renewalDate={lease.renewal_date}
        escalationRate={lease.escalation_rate}
        breakClauseDate={lease.break_clause_date}
      />

      {/* Notifications preview */}
      {notifications.length > 0 && (
        <NotificationsList
          notifications={notifications.slice(0, 5)}
          unreadCount={unreadCount}
        />
      )}
    </div>
  );
}
