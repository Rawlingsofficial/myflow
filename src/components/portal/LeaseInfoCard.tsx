import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { format } from "date-fns";

interface LeaseInfoCardProps {
  startDate?: Date;
  endDate?: Date;
  rentAmount?: number;
  securityDeposit?: number;
  propertyName?: string;
  unitNumber?: string;
}

export function LeaseInfoCard({
  startDate = new Date(),
  endDate = new Date(new Date().setFullYear(new Date().getFullYear() + 1)),
  rentAmount = 1250,
  securityDeposit = 1250,
  propertyName = "Main Street Apartments",
  unitNumber = "A101",
}: LeaseInfoCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Lease Information</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex justify-between">
          <span className="text-muted-foreground">Property</span>
          <span className="font-medium">
            {propertyName} - {unitNumber}
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">Lease Term</span>
          <span className="font-medium">
            {format(startDate, "MMM dd, yyyy")} -{" "}
            {format(endDate, "MMM dd, yyyy")}
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">Monthly Rent</span>
          <span className="font-medium">${rentAmount.toFixed(2)}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">Security Deposit</span>
          <span className="font-medium">${securityDeposit.toFixed(2)}</span>
        </div>
      </CardContent>
    </Card>
  );
}
