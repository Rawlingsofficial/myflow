"use client";

import { MaintenanceStatus } from "@/types";
import { cn } from "@/lib/utils";

interface MaintenanceStatusBadgeProps {
  status: MaintenanceStatus;
}

const STATUS_CONFIG: Record<MaintenanceStatus, { label: string; className: string }> = {
  open: { 
    label: "Open", 
    className: "bg-blue-50 text-blue-700 border-blue-100" 
  },
  in_progress: { 
    label: "In Progress", 
    className: "bg-amber-50 text-amber-700 border-amber-100" 
  },
  resolved: { 
    label: "Resolved", 
    className: "bg-emerald-50 text-emerald-700 border-emerald-100" 
  },
};

export default function MaintenanceStatusBadge({ status }: MaintenanceStatusBadgeProps) {
  const config = STATUS_CONFIG[status] || { label: status, className: "bg-slate-50 text-slate-500 border-slate-100" };

  return (
    <span className={cn(
      "px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-tight border",
      config.className
    )}>
      {config.label}
    </span>
  );
}
