"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function MobileBottomNav() {
  const pathname = usePathname();

  const links = [
    { href: "/home", label: "Home", icon: "🏠" },
    { href: "/lease", label: "Lease", icon: "📄" },
    { href: "/maintenance", label: "Maintenance", icon: "🔧" },
    { href: "/notifications", label: "Alerts", icon: "🔔" },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t flex justify-around py-2 z-10">
      {links.map((link) => (
        <Link
          key={link.href}
          href={link.href}
          className={`flex flex-col items-center text-sm ${
            pathname === link.href ? "text-blue-600" : "text-gray-500"
          }`}
        >
          <span className="text-xl">{link.icon}</span>
          <span>{link.label}</span>
        </Link>
      ))}
    </nav>
  );
}

