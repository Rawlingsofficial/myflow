import MobileBottomNav from "@/components/portal/MobileBottomNav";

export default function PrivateLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="max-w-md mx-auto bg-slate-50 min-h-screen relative pb-20">
      <main className="min-h-screen">{children}</main>
      <MobileBottomNav />
    </div>
  );
}

