"use client";
export default function MaintenanceDetailPage({ params }: { params: { id: string } }) {
  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold">Request #{params.id}</h1>
      <p>Details and status tracking go here.</p>
    </div>
  );
}

