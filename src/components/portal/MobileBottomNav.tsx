"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, FileText, Wrench, Bell, User } from "lucide-react";
import { cn } from "@/lib/utils";

const links = [
  { href: "/home", label: "Home", icon: Home },
  { href: "/lease", label: "Lease", icon: FileText },
  { href: "/maintenance", label: "Fix", icon: Wrench },
  { href: "/notifications", label: "Alerts", icon: Bell },
  { href: "/profile", label: "Profile", icon: User },
];

export default function MobileBottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-md bg-white border-t border-slate-200 flex justify-around items-center h-16 z-50 px-4">
      {links.map((link) => {
        const Icon = link.icon;
        const isActive = pathname === link.href || (link.href !== "/home" && pathname.startsWith(link.href));
        
        return (
          <Link
            key={link.href}
            href={link.href}
            className={cn(
              "flex flex-col items-center justify-center space-y-1 transition-colors w-full h-full",
              isActive ? "text-[#2BBE9A]" : "text-[#1F3A5F]/60 hover:text-[#1F3A5F]"
            )}
          >
            <Icon className={cn("w-5 h-5", isActive && "stroke-[2.5px]")} />
            <span className="text-[10px] font-medium uppercase tracking-wider">
              {link.label}
            </span>
          </Link>
        );
      })}
    </nav>
  );
}

