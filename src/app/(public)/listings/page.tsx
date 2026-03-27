"use server";

import { createClient } from '@/lib/supabase/server';
import ListingCard from '@/components/marketplace/ListingCard';

export default async function ListingsPage() {
  const supabase = await createClient();

  const { data: listings, error } = await supabase
    .from('listings')
    .select(`
      id,
      title,
      price,
      city,
      area,
      listing_images (url, display_order)
    `)
    .eq('status', 'published')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching listings:', error);
    return <div>Failed to load listings.</div>;
  }

  // Get the first image for each listing (or a placeholder)
  const processedListings = listings.map((listing: any) => ({
    ...listing,
    image: listing.listing_images?.[0]?.url || '/images/placeholder.jpg',
  }));

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">Available Rentals</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {processedListings.map((listing) => (
          <ListingCard key={listing.id} listing={listing} />
        ))}
      </div>
    </div>
  );
}

