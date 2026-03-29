'use client';

import { useState } from 'react';
import { Mail, Calendar, X, Send, Lock } from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '@clerk/nextjs';
import { useRouter, usePathname } from 'next/navigation';

interface ContactButtonsProps {
  listingId: string;
  title: string;
}

export default function ContactButtons({ listingId, title }: ContactButtonsProps) {
  const { isSignedIn, isLoaded } = useAuth();
  const router = useRouter();
  const pathname = usePathname(); // Gets the current listing URL

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleContactClick = () => {
    // 1. GATEKEEPER: If they aren't logged in, push them to sign-up first!
    if (isLoaded && !isSignedIn) {
      toast.info("Please create a free account to contact the landlord.");
      // We pass redirect_url so Clerk knows to send them back here after sign-in!
      router.push(`/sign-in?redirect_url=${pathname}`);
      return;
    }

    // 2. If they ARE logged in, open the secure inquiry modal
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate network request to send lead to Landlord's Dashboard
    setTimeout(() => {
      setIsSubmitting(false);
      setIsModalOpen(false);
      toast.success("Inquiry sent! The landlord will contact you through the platform.");
    }, 1500);
  };

  return (
    <>
      <div className="space-y-3">
        {/* Primary Action Button */}
        <button 
          onClick={handleContactClick}
          className="w-full bg-[#1F3A5F] hover:bg-[#152845] text-white h-14 rounded-2xl font-bold flex items-center justify-center gap-2 transition-all shadow-md hover:shadow-xl hover:-translate-y-0.5"
        >
          {isSignedIn ? (
            <>
              <Mail className="w-5 h-5" />
              Request Details
            </>
          ) : (
            <>
              <Lock className="w-5 h-5 opacity-70" />
              Sign in to Contact
            </>
          )}
        </button>

        {/* Secondary Action Button - Only show if they are already signed in */}
        {isSignedIn && (
          <button 
            onClick={() => setIsModalOpen(true)}
            className="w-full bg-white hover:bg-slate-50 text-[#1F3A5F] border-2 border-slate-200 h-14 rounded-2xl font-bold flex items-center justify-center gap-2 transition-all shadow-sm"
          >
            <Calendar className="w-5 h-5" />
            Request a Tour
          </button>
        )}
      </div>

      {/* Inquiry Modal Overlay (Only opens if signed in) */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#1F3A5F]/40 backdrop-blur-sm">
          <div className="bg-white w-full max-w-md rounded-[2rem] shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center p-6 border-b border-slate-100 bg-slate-50/50">
              <h3 className="font-extrabold text-xl text-[#1F3A5F]">Contact Landlord</h3>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="w-8 h-8 flex items-center justify-center rounded-full bg-slate-200/50 hover:bg-slate-200 text-slate-500 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <p className="text-sm font-medium text-slate-500 mb-2">
                Inquiring about: <span className="text-[#1F3A5F] font-bold">{title}</span>
              </p>

              <div>
                <label className="block text-xs font-bold text-[#1F3A5F] uppercase tracking-wider mb-2">Your Name</label>
                <input required type="text" className="w-full h-12 rounded-xl bg-slate-50 border border-slate-200 px-4 focus:outline-none focus:border-[#2BBE9A] focus:ring-1 focus:ring-[#2BBE9A]" placeholder="John Doe" />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[#1F3A5F] uppercase tracking-wider mb-2">Email</label>
                  <input required type="email" className="w-full h-12 rounded-xl bg-slate-50 border border-slate-200 px-4 focus:outline-none focus:border-[#2BBE9A] focus:ring-1 focus:ring-[#2BBE9A]" placeholder="john@example.com" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#1F3A5F] uppercase tracking-wider mb-2">Phone</label>
                  <input required type="tel" className="w-full h-12 rounded-xl bg-slate-50 border border-slate-200 px-4 focus:outline-none focus:border-[#2BBE9A] focus:ring-1 focus:ring-[#2BBE9A]" placeholder="(555) 123-4567" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#1F3A5F] uppercase tracking-wider mb-2">Message</label>
                <textarea required className="w-full h-24 rounded-xl bg-slate-50 border border-slate-200 p-4 focus:outline-none focus:border-[#2BBE9A] focus:ring-1 focus:ring-[#2BBE9A] resize-none" placeholder="I am interested in this property and would like to know more..."></textarea>
              </div>

              <button 
                type="submit" 
                disabled={isSubmitting}
                className="w-full bg-[#2BBE9A] hover:bg-[#25a586] text-white h-14 rounded-2xl font-bold flex items-center justify-center gap-2 mt-4 shadow-lg shadow-[#2BBE9A]/20 transition-all disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {isSubmitting ? 'Sending Inquiry...' : (
                  <>
                    <Send className="w-5 h-5" />
                    Send Inquiry
                  </>
                )}
              </button>
              <p className="text-center text-[10px] font-bold text-slate-400 mt-4 uppercase tracking-widest">
                Protected by Platform Security
              </p>
            </form>
          </div>
        </div>
      )}
    </>
  );
}

