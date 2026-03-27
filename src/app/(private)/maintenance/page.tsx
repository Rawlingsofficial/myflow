// src/app/(private)/maintenance/page.tsx  (TENANT APP)

import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { getMaintenanceRequests, getActiveLease } from "@/lib/services/tenant-data.service";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import MaintenanceStatusBadge from "@/components/portal/MaintenanceStatusBadge";
import { format } from "date-fns";
import { Plus, ChevronRight, Wrench } from "lucide-react";

export default async function MaintenancePage() {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");

  const [requests, lease] = await Promise.all([
    getMaintenanceRequests(),
    getActiveLease(),
  ]);

  return (
    <div className="space-y-4 pb-24 px-4 pt-4 max-w-lg mx-auto">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Maintenance</h1>
        {lease && (
          <Link href="/maintenance/new">
            <Button size="sm">
              <Plus className="w-4 h-4 mr-1.5" />
              New Request
            </Button>
          </Link>
        )}
      </div>

      {!lease && (
        <p className="text-sm text-muted-foreground">
          You need an active lease to submit maintenance requests.
        </p>
      )}

      {requests.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <Wrench className="w-8 h-8 text-muted-foreground mb-3" />
          <p className="font-medium">No requests yet</p>
          <p className="text-sm text-muted-foreground mt-1">
            Submit a request when something needs fixing.
          </p>
        </div>
      ) : (
        <div className="space-y-2">
          {requests.map((req) => (
            <Link key={req.id} href={`/maintenance/${req.id}`}>
              <Card className="hover:bg-muted/30 transition-colors cursor-pointer">
                <CardContent className="py-3 px-4">
                  <div className="flex items-center justify-between gap-2">
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-medium capitalize bg-muted px-2 py-0.5 rounded-full">
                          {req.category}
                        </span>
                        <MaintenanceStatusBadge status={req.status} />
                      </div>
                      <p className="text-sm truncate">{req.description}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {format(new Date(req.created_at), "dd MMM yyyy")}
                      </p>
                    </div>
                    <ChevronRight className="w-4 h-4 text-muted-foreground shrink-0" />
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

