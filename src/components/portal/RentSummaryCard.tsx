"use client";

interface RentData {
  unit: string;
  rentAmount: number;
  nextDueDate: string;
}

export default function RentSummaryCard({ rentData }: { rentData: RentData }) {
  return (
    <div className="bg-white p-4 rounded-lg shadow">
      <h2 className="text-xl font-semibold">Rent Summary</h2>
      <p>Unit: {rentData.unit}</p>
      <p>Monthly Rent: ${rentData.rentAmount}</p>
      <p>Next Due: {new Date(rentData.nextDueDate).toLocaleDateString()}</p>
    </div>
  );
}

