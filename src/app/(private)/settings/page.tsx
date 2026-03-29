// src/app/(private)/settings/page.tsx (TENANT APP)

import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { 
  ChevronLeft, 
  Bell, 
  Moon, 
  Globe, 
  Shield, 
  HelpCircle,
  Smartphone,
  Eye
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default async function SettingsPage() {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");

  return (
    <div className="px-4 pt-6 pb-24 space-y-6">
      <header className="flex items-center gap-3">
        <Link href="/profile">
          <Button variant="ghost" size="icon" className="rounded-full h-10 w-10 bg-white shadow-sm border border-slate-100">
            <ChevronLeft className="w-5 h-5 text-[#1F3A5F]" />
          </Button>
        </Link>
        <div>
          <h1 className="text-xl font-bold text-[#1F3A5F]">Settings</h1>
          <p className="text-xs text-slate-500 text-nowrap">App preferences & help</p>
        </div>
      </header>

      <div className="space-y-6">
        {/* App Preferences */}
        <section className="space-y-3">
          <h3 className="text-sm font-bold text-[#1F3A5F] uppercase tracking-wider px-1">Preferences</h3>
          <Card className="border-none shadow-sm bg-white rounded-2xl overflow-hidden">
            <CardContent className="p-0 divide-y divide-slate-50">
              <SettingsToggleRow 
                icon={<Bell className="w-4 h-4 text-blue-500" />} 
                label="Push Notifications" 
                description="Receive alerts for payments & maintenance"
                enabled
              />
              <SettingsToggleRow 
                icon={<Moon className="w-4 h-4 text-purple-500" />} 
                label="Dark Mode" 
                description="Switch to dark interface"
              />
              <SettingsLinkRow 
                icon={<Globe className="w-4 h-4 text-emerald-500" />} 
                label="Language" 
                value="English (US)"
              />
            </CardContent>
          </Card>
        </section>

        {/* Support & Legal */}
        <section className="space-y-3">
          <h3 className="text-sm font-bold text-[#1F3A5F] uppercase tracking-wider px-1">Support</h3>
          <Card className="border-none shadow-sm bg-white rounded-2xl overflow-hidden">
            <CardContent className="p-0 divide-y divide-slate-50">
              <SettingsLinkRow 
                icon={<HelpCircle className="w-4 h-4 text-orange-500" />} 
                label="Help Center" 
              />
              <SettingsLinkRow 
                icon={<Shield className="w-4 h-4 text-slate-500" />} 
                label="Privacy Policy" 
              />
              <SettingsLinkRow 
                icon={<Eye className="w-4 h-4 text-blue-400" />} 
                label="Terms of Service" 
              />
            </CardContent>
          </Card>
        </section>

        {/* Device Info */}
        <div className="text-center px-6 py-4">
           <div className="inline-flex items-center gap-2 text-slate-300 mb-1">
              <Smartphone className="w-3 h-3" />
              <span className="text-[10px] font-bold uppercase tracking-widest">MyFlow Tenant v1.0.4</span>
           </div>
           <p className="text-[10px] text-slate-300">Your connection is encrypted</p>
        </div>
      </div>
    </div>
  );
}

function SettingsToggleRow({ 
  icon, 
  label, 
  description,
  enabled = false 
}: { 
  icon: React.ReactNode; 
  label: string; 
  description?: string;
  enabled?: boolean;
}) {
  return (
    <div className="flex items-center justify-between p-4">
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center shrink-0">
          {icon}
        </div>
        <div>
          <p className="text-sm font-bold text-[#1F3A5F]">{label}</p>
          {description && <p className="text-[10px] text-slate-400 font-medium">{description}</p>}
        </div>
      </div>
      <div className={`w-10 h-6 rounded-full transition-colors relative cursor-pointer ${enabled ? 'bg-[#2BBE9A]' : 'bg-slate-200'}`}>
         <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${enabled ? 'right-1' : 'left-1 shadow-sm'}`} />
      </div>
    </div>
  );
}

function SettingsLinkRow({ 
  icon, 
  label, 
  value 
}: { 
  icon: React.ReactNode; 
  label: string; 
  value?: string;
}) {
  return (
    <div className="flex items-center justify-between p-4 cursor-pointer hover:bg-slate-50/50 transition-colors">
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center shrink-0">
          {icon}
        </div>
        <span className="text-sm font-bold text-[#1F3A5F]">{label}</span>
      </div>
      <div className="flex items-center gap-2">
        {value && <span className="text-xs font-medium text-slate-400">{value}</span>}
        <ChevronLeft className="w-4 h-4 text-slate-300 rotate-180" />
      </div>
    </div>
  );
}
