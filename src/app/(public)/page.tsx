// src/app/(public)/page.tsx
import Link from 'next/link';
import { ArrowRight, Search, Home, Shield, Zap, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function PublicLandingPage() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative pt-16 md:pt-24 pb-20 md:pb-32 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 md:px-8 relative z-10">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 bg-[#2BBE9A]/10 text-[#2BBE9A] px-4 py-2 rounded-full text-xs md:text-sm font-bold mb-6 animate-fade-in">
              <Sparkles className="w-4 h-4" />
              <span>The future of rental management is here</span>
            </div>
            <h1 className="text-5xl md:text-7xl font-black text-[#1F3A5F] tracking-tight leading-[1.1] mb-6">
              Find your next home <br />
              <span className="text-[#2BBE9A]">with confidence.</span>
            </h1>
            <p className="text-lg md:text-xl text-slate-500 font-medium mb-10 leading-relaxed max-w-2xl">
              Browse verified listings, manage your lease, and handle maintenance all in one seamless flow. Rental living has never been this simple.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/listings">
                <Button className="h-14 px-8 bg-[#1F3A5F] hover:bg-[#152845] text-white rounded-2xl font-bold text-lg shadow-xl shadow-blue-900/20 group">
                  Browse Listings
                  <ArrowRight className="ml-2 w-5 h-5 transition-transform group-hover:translate-x-1" />
                </Button>
              </Link>
              <Link href="/sign-up">
                <Button variant="outline" className="h-14 px-8 border-slate-200 text-[#1F3A5F] hover:bg-slate-50 rounded-2xl font-bold text-lg shadow-sm">
                  Join as Tenant
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Decorative background elements */}
        <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-[#2BBE9A]/5 to-transparent -z-10" />
        <div className="absolute top-[-10%] right-[-5%] w-96 h-96 bg-[#2BBE9A]/10 rounded-full blur-3xl opacity-50" />
        <div className="absolute bottom-0 right-[10%] w-64 h-64 bg-[#1F3A5F]/5 rounded-full blur-2xl opacity-30" />
      </section>

      {/* Search Preview Section */}
      <section className="bg-white py-12 border-y border-slate-100">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="bg-slate-50 rounded-[2.5rem] p-4 md:p-6 shadow-inner border border-slate-100 max-w-4xl mx-auto flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
              <input 
                type="text" 
                placeholder="Search by city, neighborhood, or address..." 
                className="w-full h-14 bg-white rounded-2xl pl-12 pr-4 font-medium text-[#1F3A5F] focus:outline-none focus:ring-2 focus:ring-[#2BBE9A]/20 transition-all border border-slate-100 shadow-sm"
              />
            </div>
            <Link href="/listings">
              <Button className="h-14 px-8 bg-[#2BBE9A] hover:bg-[#23a889] text-white rounded-2xl font-bold shadow-lg shadow-[#2BBE9A]/20">
                Search Properties
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-24 md:py-32">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16 md:mb-20">
            <h2 className="text-sm font-bold text-[#2BBE9A] uppercase tracking-widest mb-4">How it works</h2>
            <p className="text-3xl md:text-4xl font-black text-[#1F3A5F] tracking-tight">Everything you need for a better rental experience</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <FeatureCard 
              icon={<Home className="w-6 h-6 text-[#2BBE9A]" />}
              title="Verified Listings"
              description="Every property on MyFlow is verified to ensure you find a safe and reliable place to call home."
            />
            <FeatureCard 
              icon={<Shield className="w-6 h-6 text-[#2BBE9A]" />}
              title="Secure Payments"
              description="Pay your rent securely online and keep track of your full payment history in one place."
            />
            <FeatureCard 
              icon={<Zap className="w-6 h-6 text-[#2BBE9A]" />}
              title="Fast Maintenance"
              description="Submit maintenance requests in seconds and track their progress in real-time until resolved."
            />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-[#1F3A5F] py-20 overflow-hidden relative">
        <div className="max-w-7xl mx-auto px-4 md:px-8 relative z-10 text-center">
          <h2 className="text-3xl md:text-5xl font-black text-white mb-8 tracking-tight">Ready to start your flow?</h2>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link href="/sign-up">
              <Button className="h-14 px-10 bg-[#2BBE9A] hover:bg-[#23a889] text-white rounded-2xl font-bold text-lg shadow-xl shadow-black/20">
                Create Free Account
              </Button>
            </Link>
            <Link href="/listings">
              <Button variant="ghost" className="h-14 px-10 text-white hover:bg-white/10 rounded-2xl font-bold text-lg">
                View All Listings
              </Button>
            </Link>
          </div>
        </div>
        <div className="absolute top-[-50%] left-[-10%] w-96 h-96 bg-[#2BBE9A]/20 rounded-full blur-[100px]" />
        <div className="absolute bottom-[-50%] right-[-10%] w-96 h-96 bg-blue-400/10 rounded-full blur-[100px]" />
      </section>

      {/* Footer */}
      <footer className="bg-white py-12 border-t border-slate-100">
        <div className="max-w-7xl mx-auto px-4 md:px-8 flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-[#1F3A5F] rounded-lg flex items-center justify-center">
               <div className="w-4 h-4 border-2 border-[#2BBE9A] rounded-full" />
            </div>
            <span className="text-xl font-black text-[#1F3A5F] tracking-tighter">MyFlow</span>
          </div>
          <p className="text-slate-400 text-sm font-medium">© 2026 MyFlow. All rights reserved.</p>
          <div className="flex gap-6 text-sm font-bold text-slate-500">
            <Link href="#" className="hover:text-[#1F3A5F]">Privacy</Link>
            <Link href="#" className="hover:text-[#1F3A5F]">Terms</Link>
            <Link href="#" className="hover:text-[#1F3A5F]">Contact</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) {
  return (
    <div className="p-8 bg-white rounded-[2rem] border border-slate-100 shadow-xl shadow-[#1F3A5F]/5 transition-all hover:-translate-y-1 hover:shadow-[#1F3A5F]/10">
      <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center mb-6 shadow-inner">
        {icon}
      </div>
      <h3 className="text-xl font-bold text-[#1F3A5F] mb-4">{title}</h3>
      <p className="text-slate-500 font-medium leading-relaxed">{description}</p>
    </div>
  );
}
