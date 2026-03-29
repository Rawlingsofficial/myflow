import { createClient } from '@supabase/supabase-js';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { 
  MapPin, 
  Bed, 
  Bath, 
  Maximize2, 
  Phone, 
  CheckCircle2, 
  ArrowLeft, 
  Calendar,
  Info
} from 'lucide-react';

// Force Next.js to re-fetch this page regularly
export const revalidate = 60;

export default async function ListingDetailPage({ 
  params 
}: { 
  params: Promise<{ id: string }> 
}) {
  // 🔥 Next.js 15+ requires awaiting the params object
  const { id: listingId } = await params;

  // Use the public Anon key
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  // Fetch the specific published listing and its images
  const { data: listing, error } = await supabase
    .from('listings')
    .select(`
      *,
      images:listing_images(url, display_order)
    `)
    .eq('id', listingId)
    .eq('status', 'published') // Gatekeeper: Only show if published
    .single();

  if (error || !listing) {
    notFound(); // Shows Next.js default 404 page if listing doesn't exist or isn't published
  }

  const isCommercial = listing.property_type === 'commercial';
  const sortedImages = listing.images?.sort((a: any, b: any) => a.display_order - b.display_order) || [];
  const coverImage = sortedImages[0]?.url || 'https://placehold.co/1200x600/f8fafc/94a3b8?text=No+Image+Available';
  
  // Safely extract amenities
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

        {/* Image Gallery (Simplified Hero) */}
        <div className="w-full h-[400px] md:h-[500px] rounded-[2.5rem] overflow-hidden mb-10 shadow-xl shadow-[#1F3A5F]/5 border border-slate-100 relative group bg-slate-100">
          <img 
            src={coverImage} 
            alt={listing.title} 
            className="w-full h-full object-cover"
          />
          {sortedImages.length > 1 && (
            <div className="absolute bottom-6 right-6 bg-white/90 backdrop-blur-md px-4 py-2 rounded-xl text-sm font-bold text-[#1F3A5F] shadow-lg">
              1 / {sortedImages.length} Photos
            </div>
          )}
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          
          {/* Left Column: Details (Takes up 2/3 space) */}
          <div className="lg:col-span-2 space-y-10">
            
            {/* Header Info */}
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
                  <span className="font-extrabold text-[#1F3A5F]">
                    {listing.square_footage} {isCommercial ? 'Sqm' : 'Sq Ft'}
                  </span>
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
                <p className="text-sm font-medium text-slate-500 text-center">
                  Interested in this property? Contact the landlord to schedule a tour or apply.
                </p>
                
                <a 
                  href={`tel:${listing.contact_phone}`}
                  className="w-full bg-[#1F3A5F] hover:bg-[#152845] text-white h-14 rounded-2xl font-bold flex items-center justify-center gap-2 transition-all shadow-md hover:shadow-xl hover:-translate-y-0.5"
                >
                  <Phone className="w-5 h-5" />
                  Call {listing.contact_phone}
                </a>

                {/* Placeholder for future Application Flow */}
                <button className="w-full bg-slate-50 hover:bg-slate-100 text-[#1F3A5F] h-14 rounded-2xl font-bold transition-all border border-slate-200">
                  Apply Online (Coming Soon)
                </button>
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

//----------------------------------------testing snippets----------------------------------------