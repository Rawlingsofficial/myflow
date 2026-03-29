import { createClient } from '@supabase/supabase-js';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { 
  MapPin, 
  Bed, 
  Bath, 
  Maximize2, 
  CheckCircle2, 
  ArrowLeft, 
  Calendar,
  Info
} from 'lucide-react';
import SwipeGallery from '@/components/marketplace/SwipeGallery';
import ContactButtons from '@/components/marketplace/ContactButtons';

// 🔥 FIX: Prevents Vercel from crashing during build
export const dynamic = 'force-dynamic';

export default async function ListingDetailPage({ 
  params 
}: { 
  params: Promise<{ id: string }> 
}) {
  const { id: listingId } = await params;

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
  const supabase = createClient(supabaseUrl, supabaseKey);

  const { data: listing, error } = await supabase
    .from('listings')
    .select(`
      *,
      images:listing_images(url, display_order)
    `)
    .eq('id', listingId)
    .eq('status', 'published')
    .single();

  if (error || !listing) notFound();

  const isCommercial = listing.property_type === 'commercial';
  const sortedImages = listing.images?.sort((a: any, b: any) => a.display_order - b.display_order) || [];
  const amenities = listing.features_amenities?.items || [];

  return (
    <div className="min-h-screen bg-[#F8F9FB] pb-24 pt-8">
      <div className="max-w-6xl mx-auto px-6 lg:px-8">
        
        {/* Back Navigation */}
        <Link 
          href="/listings" 
          className="inline-flex items-center text-sm font-bold text-slate-400 hover:text-[#1F3A5F] transition-colors mb-8"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to all properties
        </Link>

        {/* Dynamic Image Gallery */}
        <div className="w-full h-[400px] md:h-[500px] rounded-[2.5rem] overflow-hidden mb-10 shadow-xl shadow-[#1F3A5F]/5 border border-slate-100 relative">
          <SwipeGallery images={sortedImages} title={listing.title} />
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          
          {/* Left Column: Details */}
          <div className="lg:col-span-2 space-y-10">
            <div>
              <div className="flex flex-wrap items-center gap-3 mb-4">
                <span className="px-3 py-1 bg-[#2BBE9A]/10 text-[#2BBE9A] text-xs font-extrabold uppercase tracking-wider rounded-lg">
                  {listing.property_type || 'Property'}
                </span>
                {listing.available_date && (
                  <span className="px-3 py-1 bg-slate-100 text-slate-500 text-xs font-bold rounded-lg flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5" /> Available {new Date(listing.available_date).toLocaleDateString()}
                  </span>
                )}
              </div>
              <h1 className="text-4xl font-black text-[#1F3A5F] mb-4 tracking-tight">
                {listing.title}
              </h1>
              <p className="text-lg text-slate-500 flex items-center gap-2 font-medium">
                <MapPin className="w-5 h-5 text-[#2BBE9A]" />
                {listing.full_address || `${listing.city} ${listing.area ? `• ${listing.area}` : ''}`}
              </p>
            </div>

            {/* Key Specs Bar */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 py-6 border-y border-slate-200/60">
              {!isCommercial && listing.bedrooms !== null && (
                <div className="flex flex-col items-center justify-center p-4 bg-white rounded-2xl border border-slate-100 shadow-sm">
                  <Bed className="w-6 h-6 text-slate-400 mb-2" />
                  <span className="font-extrabold text-[#1F3A5F]">{listing.bedrooms} Beds</span>
                </div>
              )}
              {!isCommercial && listing.bathrooms !== null && (
                <div className="flex flex-col items-center justify-center p-4 bg-white rounded-2xl border border-slate-100 shadow-sm">
                  <Bath className="w-6 h-6 text-slate-400 mb-2" />
                  <span className="font-extrabold text-[#1F3A5F]">{listing.bathrooms} Baths</span>
                </div>
              )}
              {listing.square_footage !== null && (
                <div className="flex flex-col items-center justify-center p-4 bg-white rounded-2xl border border-slate-100 shadow-sm">
                  <Maximize2 className="w-6 h-6 text-slate-400 mb-2" />
                  <span className="font-extrabold text-[#1F3A5F]">{listing.square_footage} {isCommercial ? 'Sqm' : 'Sq Ft'}</span>
                </div>
              )}
              {listing.pet_policy && (
                <div className="flex flex-col items-center justify-center p-4 bg-white rounded-2xl border border-slate-100 shadow-sm">
                  <Info className="w-6 h-6 text-slate-400 mb-2" />
                  <span className="font-extrabold text-[#1F3A5F] text-center capitalize text-xs">
                    {listing.pet_policy.replace('_', ' ')}
                  </span>
                </div>
              )}
            </div>

            {/* Description */}
            <div className="space-y-4">
              <h2 className="text-2xl font-extrabold text-[#1F3A5F]">About this property</h2>
              <p className="text-slate-600 leading-relaxed whitespace-pre-wrap text-lg">
                {listing.description || "No description provided."}
              </p>
            </div>

            {/* Amenities */}
            {amenities.length > 0 && (
              <div className="space-y-6 pt-6">
                <h2 className="text-2xl font-extrabold text-[#1F3A5F]">Amenities & Features</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {amenities.map((item: string, index: number) => (
                    <div key={index} className="flex items-center gap-3 bg-white p-4 rounded-2xl border border-slate-100 shadow-sm">
                      <CheckCircle2 className="w-5 h-5 text-[#2BBE9A]" />
                      <span className="font-semibold text-slate-700">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right Column: Sticky Contact/Pricing Card */}
          <div className="lg:col-span-1">
            <div className="sticky top-8 bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-xl shadow-[#1F3A5F]/5">
              <div className="mb-6">
                <p className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-1">Monthly Rent</p>
                <div className="flex items-end gap-1">
                  <span className="text-5xl font-black text-[#2BBE9A]">${listing.price.toLocaleString()}</span>
                </div>
              </div>

              {listing.deposit_amount > 0 && (
                <div className="flex justify-between items-center py-4 border-b border-slate-100 mb-6">
                  <span className="text-slate-500 font-medium">Security Deposit</span>
                  <span className="font-bold text-[#1F3A5F]">${listing.deposit_amount.toLocaleString()}</span>
                </div>
              )}

              <div className="space-y-4 mb-8">
                <p className="text-sm font-medium text-slate-500 text-center mb-6">
                  Interested in this property? Contact the landlord to schedule a tour or apply.
                </p>
                
                {/* Using our new ContactButtons component */}
                <ContactButtons phone={listing.contact_phone} title={listing.title} />
              </div>

              <div className="text-center text-xs text-slate-400 font-medium">
                Listed on {new Date(listing.created_at).toLocaleDateString()}
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}