import MobileBottomNav from '@/components/portal/MobileBottomNav';

export default function PrivateLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="pb-16">
      {children}
      <MobileBottomNav />
    </div>
  );
}

