import { createClient } from '@/lib/supabase/server';
import SwipeGallery from '@/components/marketplace/SwipeGallery';
import ContactButtons from '@/components/marketplace/ContactButtons';
import { notFound } from 'next/navigation';

export default async function ListingDetailPage({ params }: { params: { id: string } }) {
  const supabase = await createClient();

  const { data: listing, error } = await supabase
    .from('listings')
    .select(`
      id,
      title,
      description,
      price,
      city,
      area,
      contact_phone,
      listing_images (url, display_order)
    `)
    .eq('id', params.id)
    .eq('status', 'published')
    .single();

  if (error || !listing) {
    notFound();
  }

  // Sort images by display_order
  const images = listing.listing_images?.sort((a: any, b: any) => a.display_order - b.display_order) || [];

  return (
    <div className="max-w-lg mx-auto p-4">
      <SwipeGallery images={images.map((img: any) => img.url)} />
      <h1 className="text-2xl font-bold mt-4">{listing.title}</h1>
      <p className="text-gray-600">${listing.price}/month</p>
      <p className="text-sm text-gray-500">{listing.city}{listing.area ? `, ${listing.area}` : ''}</p>
      <p className="mt-2">{listing.description}</p>
      <ContactButtons phone={listing.contact_phone} whatsapp={listing.contact_phone} />
    </div>
  );
}

