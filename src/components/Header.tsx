import { auth } from "@clerk/nextjs/server";
import Link from "next/link";
import { LogIn, LayoutDashboard } from "lucide-react";

export default async function Header() {
  const { userId } = await auth();
  const isSignedIn = !!userId;

  return (
    <header className="sticky top-0 z-50 w-full bg-white/80 backdrop-blur-md border-b border-slate-100 h-16 md:h-20 flex items-center shadow-sm shadow-slate-900/5">
      <div className="max-w-7xl mx-auto px-4 md:px-8 w-full flex justify-between items-center">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 group">
          <div className="w-8 h-8 md:w-10 md:h-10 bg-[#1F3A5F] rounded-xl flex items-center justify-center transition-transform group-hover:scale-105">
             <div className="w-4 h-4 md:w-5 md:h-5 border-2 border-[#2BBE9A] rounded-full" />
          </div>
          <span className="text-xl md:text-2xl font-black text-[#1F3A5F] tracking-tighter">
            My<span className="text-[#2BBE9A]">Flow</span>
          </span>
        </Link>

        {/* Navigation */}
        <nav className="flex items-center gap-3 md:gap-6">
          <Link 
            href="/listings" 
            className="text-sm font-bold text-slate-500 hover:text-[#1F3A5F] transition-colors"
          >
            Marketplace
          </Link>
          
          {isSignedIn ? (
            <Link 
              href="/home" 
              className="flex items-center gap-2 bg-[#1F3A5F] hover:bg-[#152845] text-white px-4 md:px-5 py-2 md:py-2.5 rounded-xl text-sm font-bold transition-all shadow-md shadow-[#1F3A5F]/10"
            >
              <LayoutDashboard className="w-4 h-4" />
              <span className="hidden sm:inline">My Portal</span>
            </Link>
          ) : (
            <Link 
              href="/sign-in" 
              className="flex items-center gap-2 bg-[#2BBE9A] hover:bg-[#23a889] text-white px-4 md:px-5 py-2 md:py-2.5 rounded-xl text-sm font-bold transition-all shadow-md shadow-[#2BBE9A]/10"
            >
              <LogIn className="w-4 h-4" />
              <span>Sign In</span>
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
}
