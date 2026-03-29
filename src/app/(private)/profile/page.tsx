// src/app/(private)/profile/page.tsx (TENANT APP)

import { auth, currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { getCurrentTenant } from "@/lib/services/tenant-data.service";
import { Card, CardContent } from "@/components/ui/card";
import { User, Mail, Fingerprint, ShieldCheck, LogOut, Settings as SettingsIcon } from "lucide-react";
import { SignOutButton } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { cn } from "@/lib/utils";

export default async function ProfilePage() {
  const { userId } = await auth();
  const user = await currentUser();
  if (!userId || !user) redirect("/sign-in");

  const tenant = await getCurrentTenant();

  return (
    <div className="px-4 pt-6 pb-24 space-y-6">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#1F3A5F]">My Profile</h1>
          <p className="text-sm text-slate-500">Manage your account and personal details</p>
        </div>
        <Link href="/settings">
          <Button variant="ghost" size="icon" className="rounded-full bg-white shadow-sm border border-slate-100 h-10 w-10">
            <SettingsIcon className="w-5 h-5 text-[#1F3A5F]" />
          </Button>
        </Link>
      </header>

      {/* Profile Info */}
      <Card className="border-none shadow-sm bg-white rounded-2xl overflow-hidden">
        <CardContent className="p-6 flex flex-col items-center text-center space-y-3">
          <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center border-4 border-slate-50 shadow-inner">
            <User className="w-10 h-10 text-slate-400" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-[#1F3A5F]">
              {tenant?.first_name ? `${tenant.first_name} ${tenant.last_name}` : user.fullName || "User"}
            </h2>
            <p className="text-xs font-medium text-slate-400 uppercase tracking-widest">
              {tenant ? "Verified Tenant" : "Account Pending"}
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Account Details */}
      <section className="space-y-3">
        <h3 className="text-sm font-bold text-[#1F3A5F] uppercase tracking-wider px-1">Account Details</h3>
        <Card className="border-none shadow-sm bg-white rounded-2xl overflow-hidden">
          <CardContent className="p-0 divide-y divide-slate-50">
            <DetailRow 
              icon={<Mail className="w-4 h-4 text-slate-400" />} 
              label="Email" 
              value={user.emailAddresses[0]?.emailAddress || "—"} 
            />
            <DetailRow 
              icon={<Fingerprint className="w-4 h-4 text-slate-400" />} 
              label="System ID" 
              value={userId} 
              isMono
            />
            <DetailRow 
              icon={<ShieldCheck className="w-4 h-4 text-slate-400" />} 
              label="Status" 
              value={tenant ? "Active" : "Pending Assignment"} 
              valueClassName={tenant ? "text-[#2BBE9A]" : "text-amber-500"}
            />
          </CardContent>
        </Card>
      </section>

      {/* Quick Links */}
      <section className="space-y-3">
        <h3 className="text-sm font-bold text-[#1F3A5F] uppercase tracking-wider px-1">Quick Links</h3>
        <div className="grid grid-cols-1 gap-2">
          <Link href="/settings">
            <Button variant="outline" className="w-full justify-between h-14 bg-white rounded-2xl border-slate-100 px-4 group">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center">
                  <SettingsIcon className="w-4 h-4 text-[#1F3A5F]" />
                </div>
                <span className="text-sm font-bold text-[#1F3A5F]">App Settings</span>
              </div>
              <div className="w-6 h-6 rounded-full bg-slate-50 flex items-center justify-center group-hover:bg-[#2BBE9A]/10 group-hover:text-[#2BBE9A] transition-colors">
                <SettingsIcon className="w-3 h-3" />
              </div>
            </Button>
          </Link>
        </div>
      </section>

      {/* Logout Action */}
      <div className="pt-4">
        <SignOutButton redirectUrl="/">
          <Button variant="ghost" className="w-full h-14 bg-rose-50 hover:bg-rose-100 text-rose-600 font-bold rounded-2xl border border-rose-100 gap-2">
            <LogOut className="w-5 h-5" />
            Sign Out
          </Button>
        </SignOutButton>
      </div>
    </div>
  );
}

function DetailRow({ 
  icon, 
  label, 
  value, 
  isMono, 
  valueClassName 
}: { 
  icon: React.ReactNode; 
  label: string; 
  value: string; 
  isMono?: boolean;
  valueClassName?: string;
}) {
  return (
    <div className="flex items-center justify-between p-4">
      <div className="flex items-center gap-3 min-w-0">
        <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center shrink-0">
          {icon}
        </div>
        <span className="text-sm text-slate-500">{label}</span>
      </div>
      <span className={cn(
        "text-sm font-semibold truncate ml-4",
        isMono ? "font-mono text-[11px]" : "",
        valueClassName || "text-[#1F3A5F]"
      )}>
        {value}
      </span>
    </div>
  );
}
