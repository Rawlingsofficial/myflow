import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface UnitCardProps {
  unitNumber?: string;
  propertyName?: string;
  bedrooms?: number;
  bathrooms?: number;
  squareFeet?: number;
}

export function UnitCard({
  unitNumber = "A101",
  propertyName = "Main Street Apartments",
  bedrooms = 2,
  bathrooms = 1,
  squareFeet = 850,
}: UnitCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>
          {propertyName} - Unit {unitNumber}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-muted-foreground">Bedrooms</span>
            <p className="font-medium">{bedrooms}</p>
          </div>
          <div>
            <span className="text-muted-foreground">Bathrooms</span>
            <p className="font-medium">{bathrooms}</p>
          </div>
          <div>
            <span className="text-muted-foreground">Square Feet</span>
            <p className="font-medium">{squareFeet} sq ft</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

