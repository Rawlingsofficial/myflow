import { Card, CardContent } from "@/components/ui/card";
import { Home } from "lucide-react";

export function NoLeaseState() {
  return (
    <Card className="bg-muted/50">
      <CardContent className="flex flex-col items-center justify-center py-12 text-center">
        <Home className="h-12 w-12 text-muted-foreground mb-4" />
        <h3 className="text-lg font-semibold">No Active Lease</h3>
        <p className="text-sm text-muted-foreground mt-2 max-w-md">
          You don't have an active lease at the moment. Please contact your
          property manager if you believe this is an error.
        </p>
      </CardContent>
    </Card>
  );
}

