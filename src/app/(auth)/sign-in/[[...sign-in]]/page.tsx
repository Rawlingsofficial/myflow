import { SignIn } from "@clerk/nextjs";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function SignInPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden bg-slate-50 px-4">
      {/* Decorative background */}
      <div className="absolute top-[-10%] right-[-5%] w-96 h-96 bg-[#2BBE9A]/10 rounded-full blur-3xl opacity-50 -z-10" />
      <div className="absolute bottom-[-10%] left-[-5%] w-96 h-96 bg-[#1F3A5F]/5 rounded-full blur-3xl opacity-50 -z-10" />

      <div className="mb-8 flex flex-col items-center">
        <Link href="/" className="flex items-center gap-2 group mb-4">
          <div className="w-10 h-10 bg-[#1F3A5F] rounded-xl flex items-center justify-center transition-transform group-hover:scale-105 shadow-lg shadow-blue-900/10">
             <div className="w-5 h-5 border-2 border-[#2BBE9A] rounded-full" />
          </div>
          <span className="text-2xl font-black text-[#1F3A5F] tracking-tighter">
            My<span className="text-[#2BBE9A]">Flow</span>
          </span>
        </Link>
        <Link href="/" className="inline-flex items-center text-sm font-bold text-slate-400 hover:text-[#1F3A5F] transition-colors">
          <ArrowLeft className="w-4 h-4 mr-2" /> Back to website
        </Link>
      </div>

      <SignIn 
        appearance={{
          elements: {
            formButtonPrimary: 'bg-[#1F3A5F] hover:bg-[#152845] transition-all rounded-xl font-bold',
            card: 'shadow-xl shadow-[#1F3A5F]/5 border border-slate-100 rounded-3xl',
            headerTitle: 'text-[#1F3A5F] font-black tracking-tight',
            headerSubtitle: 'text-slate-500 font-medium',
            socialButtonsBlockButton: 'rounded-xl border-slate-200 hover:bg-slate-50 transition-all font-bold text-slate-600',
            footerActionLink: 'text-[#2BBE9A] hover:text-[#23a889] font-bold'
          }
        }}
      />
    </div>
  );
}

