import { createClient } from '@supabase/supabase-js';
import MarketplaceClient from '@/components/marketplace/MarketplaceClient';

export const dynamic = 'force-dynamic';

export default async function PublicListingsPage() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
  const supabase = createClient(supabaseUrl, supabaseKey);

  const { data: listings, error } = await supabase
    .from('listings')
    .select(`*, images:listing_images(url, display_order)`)
    .eq('status', 'published')
    .order('created_at', { ascending: false });

  if (error) console.error('Error fetching public listings:', error);

  return <MarketplaceClient listings={listings || []} />;
}

