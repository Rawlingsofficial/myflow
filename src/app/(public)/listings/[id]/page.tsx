import { createClient } from '@supabase/supabase-js';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { auth } from '@clerk/nextjs/server';
import { MapPin, Bed, Bath, Maximize2, Phone, CheckCircle2, ArrowLeft, Calendar, Info, Lock } from 'lucide-react';

export const revalidate = 60;

export default async function ListingDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id: listingId } = await params;
  
  // 🔥 AUTH CHECK: Is the user logged into the Tenant app?
  const { userId } = await auth();
  const isSignedIn = !!userId;

  const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!);

  const { data: listing, error } = await supabase
    .from('listings')
    .select(`*, images:listing_images(url, display_order)`)
    .eq('id', listingId)
    .eq('status', 'published')
    .single();

  if (error || !listing) notFound();

  const isCommercial = listing.property_type === 'commercial';
  const sortedImages = listing.images?.sort((a: any, b: any) => a.display_order - b.display_order) || [];
  const coverImage = sortedImages[0]?.url || 'https://placehold.co/1200x600/f8fafc/94a3b8?text=No+Image+Available';
  const amenities = listing.features_amenities?.items || [];

  return (
    <div className="min-h-screen bg-[#F8F9FB] pb-24 pt-4 md:pt-8">
      <div className="max-w-6xl mx-auto px-4 md:px-8">
        
        <Link href="/listings" className="inline-flex items-center text-xs md:text-sm font-bold text-slate-400 hover:text-[#1F3A5F] transition-colors mb-4 md:mb-8">
          <ArrowLeft className="w-4 h-4 mr-2" /> Back to listings
        </Link>

        {/* Image Gallery */}
        <div className="w-full h-[250px] md:h-[500px] rounded-[1.5rem] md:rounded-[2.5rem] overflow-hidden mb-8 shadow-xl shadow-[#1F3A5F]/5 border border-slate-100 relative group bg-slate-100">
          <img src={coverImage} alt={listing.title} className="w-full h-full object-cover" />
          {sortedImages.length > 1 && (
            <div className="absolute bottom-4 right-4 md:bottom-6 md:right-6 bg-white/90 backdrop-blur-md px-3 md:px-4 py-1.5 md:py-2 rounded-xl text-xs md:text-sm font-bold text-[#1F3A5F] shadow-lg">
              1 / {sortedImages.length} Photos
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 md:gap-12">
          
          <div className="lg:col-span-2 space-y-8 md:space-y-10">
            <div>
              <div className="flex flex-wrap items-center gap-2 md:gap-3 mb-3 md:mb-4">
                <span className="px-2 md:px-3 py-1 bg-[#2BBE9A]/10 text-[#2BBE9A] text-[10px] md:text-xs font-extrabold uppercase tracking-wider rounded-lg">
                  {listing.property_type || 'Property'}
                </span>
                {listing.available_date && (
                  <span className="px-2 md:px-3 py-1 bg-slate-100 text-slate-500 text-[10px] md:text-xs font-bold rounded-lg flex items-center gap-1.5">
                    <Calendar className="w-3 h-3" /> Available {new Date(listing.available_date).toLocaleDateString()}
                  </span>
                )}
              </div>
              <h1 className="text-3xl md:text-4xl font-black text-[#1F3A5F] mb-3 md:mb-4 tracking-tight leading-tight">
                {listing.title}
              </h1>
              
              {/* 🔥 SECURITY: Address Hiding Logic */}
              <div className="text-sm md:text-lg text-slate-500 flex items-start gap-2 font-medium">
                <MapPin className="w-4 h-4 md:w-5 md:h-5 text-[#2BBE9A] mt-0.5 shrink-0" />
                {isSignedIn ? (
                  <span>{listing.full_address || `${listing.city} ${listing.area ? `• ${listing.area}` : ''}`}</span>
                ) : (
                  <span className="flex flex-wrap items-center gap-2">
                    {listing.city} {listing.area && `• ${listing.area}`}
                    <span className="bg-slate-200 text-slate-600 px-2 py-0.5 rounded-full text-[10px] md:text-xs font-bold flex items-center gap-1 ml-1">
                      <Lock className="w-3 h-3" /> Street Address Hidden
                    </span>
                  </span>
                )}
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 py-6 border-y border-slate-200/60">
              {!isCommercial && listing.bedrooms !== null && (
                <div className="flex flex-col items-center justify-center p-3 md:p-4 bg-white rounded-2xl border border-slate-100 shadow-sm">
                  <Bed className="w-5 h-5 md:w-6 md:h-6 text-slate-400 mb-1 md:mb-2" />
                  <span className="font-extrabold text-sm md:text-base text-[#1F3A5F]">{listing.bedrooms} Beds</span>
                </div>
              )}
              {!isCommercial && listing.bathrooms !== null && (
                <div className="flex flex-col items-center justify-center p-3 md:p-4 bg-white rounded-2xl border border-slate-100 shadow-sm">
                  <Bath className="w-5 h-5 md:w-6 md:h-6 text-slate-400 mb-1 md:mb-2" />
                  <span className="font-extrabold text-sm md:text-base text-[#1F3A5F]">{listing.bathrooms} Baths</span>
                </div>
              )}
              {listing.square_footage !== null && (
                <div className="flex flex-col items-center justify-center p-3 md:p-4 bg-white rounded-2xl border border-slate-100 shadow-sm">
                  <Maximize2 className="w-5 h-5 md:w-6 md:h-6 text-slate-400 mb-1 md:mb-2" />
                  <span className="font-extrabold text-sm md:text-base text-[#1F3A5F]">{listing.square_footage} {isCommercial ? 'Sqm' : 'Sq Ft'}</span>
                </div>
              )}
              {listing.pet_policy && (
                <div className="flex flex-col items-center justify-center p-3 md:p-4 bg-white rounded-2xl border border-slate-100 shadow-sm">
                  <Info className="w-5 h-5 md:w-6 md:h-6 text-slate-400 mb-1 md:mb-2" />
                  <span className="font-extrabold text-[#1F3A5F] text-center capitalize text-[10px] md:text-xs">
                    {listing.pet_policy.replace('_', ' ')}
                  </span>
                </div>
              )}
            </div>

            <div className="space-y-3 md:space-y-4">
              <h2 className="text-xl md:text-2xl font-extrabold text-[#1F3A5F]">About this property</h2>
              <p className="text-slate-600 leading-relaxed whitespace-pre-wrap text-sm md:text-lg">
                {listing.description || "No description provided."}
              </p>
            </div>

            {amenities.length > 0 && (
              <div className="space-y-4 md:space-y-6 pt-4 md:pt-6 border-t border-slate-200/60">
                <h2 className="text-xl md:text-2xl font-extrabold text-[#1F3A5F]">Amenities & Features</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4">
                  {amenities.map((item: string, index: number) => (
                    <div key={index} className="flex items-center gap-3 bg-white p-3 md:p-4 rounded-2xl border border-slate-100 shadow-sm">
                      <CheckCircle2 className="w-4 h-4 md:w-5 md:h-5 text-[#2BBE9A]" />
                      <span className="font-semibold text-sm md:text-base text-slate-700">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="lg:col-span-1">
            <div className="sticky top-8 bg-white rounded-[2rem] md:rounded-[2.5rem] p-6 md:p-8 border border-slate-100 shadow-xl shadow-[#1F3A5F]/5">
              <div className="mb-6">
                <p className="text-xs md:text-sm font-bold text-slate-400 uppercase tracking-widest mb-1">Monthly Rent</p>
                <div className="flex items-end gap-1">
                  <span className="text-4xl md:text-5xl font-black text-[#2BBE9A]">${listing.price.toLocaleString()}</span>
                </div>
              </div>

              {listing.deposit_amount > 0 && (
                <div className="flex justify-between items-center py-4 border-b border-slate-100 mb-6">
                  <span className="text-sm md:text-base text-slate-500 font-medium">Security Deposit</span>
                  <span className="text-sm md:text-base font-bold text-[#1F3A5F]">${listing.deposit_amount.toLocaleString()}</span>
                </div>
              )}

              <div className="space-y-4 mb-6 md:mb-8">
                <p className="text-xs md:text-sm font-medium text-slate-500 text-center mb-4 md:mb-6">
                  Interested in this property? Contact the landlord to schedule a tour or apply.
                </p>
                
                {/* 🔥 SECURITY: Phone Hiding Logic */}
                {isSignedIn ? (
                  <a 
                    href={`tel:${listing.contact_phone}`}
                    className="w-full bg-[#1F3A5F] hover:bg-[#152845] text-white h-12 md:h-14 rounded-2xl font-bold flex items-center justify-center gap-2 transition-all shadow-md hover:-translate-y-0.5 text-sm md:text-base"
                  >
                    <Phone className="w-4 h-4 md:w-5 md:h-5" /> Call {listing.contact_phone}
                  </a>
                ) : (
                  <Link 
                    href={`/sign-in?redirect_url=/listings/${listing.id}`}
                    className="w-full bg-slate-100 hover:bg-slate-200 text-[#1F3A5F] h-12 md:h-14 rounded-2xl font-bold flex items-center justify-center gap-2 transition-all shadow-sm border border-slate-200 text-sm md:text-base"
                  >
                    <Lock className="w-4 h-4 md:w-5 md:h-5 text-slate-500" /> Sign in to view Contact
                  </Link>
                )}
              </div>

              <div className="text-center text-[10px] md:text-xs text-slate-400 font-medium">
                Listed on {new Date(listing.created_at).toLocaleDateString()}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}