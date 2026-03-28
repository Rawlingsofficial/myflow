import { createClient } from '@supabase/supabase-js';
import ListingCard from '@/components/marketplace/ListingCard';
import { Search } from 'lucide-react';

// Force Next.js to re-fetch this page regularly so new listings show up quickly
export const revalidate = 60; 

export default async function PublicListingsPage() {
  // Use the public Anon key since this is a public-facing page
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  // Fetch only PUBLISHED listings
  const { data: listings, error } = await supabase
    .from('listings')
    .select(`
      *,
      images:listing_images(url, display_order)
    `)
    .eq('status', 'published')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching public listings:', error);
  }

  return (
    <div className="min-h-screen bg-[#F8F9FB] pb-24">
      {/* Hero Section */}
      <div className="bg-[#1F3A5F] py-20 px-8 text-center rounded-b-[3rem] shadow-lg mb-12">
        <h1 className="text-4xl md:text-5xl font-black text-white mb-4 tracking-tight">
          Find Your Next Space
        </h1>
        <p className="text-[#2BBE9A] font-medium text-lg max-w-2xl mx-auto mb-8">
          Browse premium residential and commercial properties.
        </p>
        
        {/* Visual Search Bar Dummy */}
        <div className="max-w-xl mx-auto bg-white/10 backdrop-blur-md border border-white/20 p-2 rounded-2xl flex items-center shadow-2xl">
          <div className="bg-white rounded-xl flex items-center w-full px-4 py-3">
            <Search className="w-5 h-5 text-slate-400 mr-3" />
            <input 
              type="text" 
              placeholder="Search by city or neighborhood..." 
              className="w-full bg-transparent outline-none text-[#1F3A5F] font-medium placeholder:text-slate-400"
              disabled
            />
          </div>
        </div>
      </div>

      {/* Grid Section */}
      <div className="max-w-7xl mx-auto px-8">
        {!listings || listings.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-[3rem] border border-slate-100 shadow-sm">
            <h3 className="text-xl font-bold text-[#1F3A5F]">No properties available right now</h3>
            <p className="text-slate-500 mt-2">Please check back later for new listings.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {listings.map((listing) => (
              <ListingCard key={listing.id} listing={listing} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

//----------------------------------------testing snippets----------------------------------------