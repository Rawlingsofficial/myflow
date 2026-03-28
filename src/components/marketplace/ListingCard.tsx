import Link from 'next/link';
import { MapPin, Bed, Bath, Maximize2 } from 'lucide-react';

interface ListingCardProps {
  listing: any;
}

export default function ListingCard({ listing }: ListingCardProps) {
  // Grab the first image based on display_order, or use a clean fallback
  const sortedImages = listing.images?.sort((a: any, b: any) => a.display_order - b.display_order) || [];
  const coverImage = sortedImages[0]?.url || 'https://placehold.co/600x400/f8fafc/94a3b8?text=No+Image';

  const isCommercial = listing.property_type === 'commercial';

  return (
    <Link href={`/listings/${listing.id}`} className="group block">
      <div className="bg-white rounded-[2rem] border border-slate-100 overflow-hidden shadow-sm hover:shadow-xl hover:shadow-[#1F3A5F]/5 transition-all duration-300 transform hover:-translate-y-1">
        {/* Image Container */}
        <div className="relative aspect-[4/3] overflow-hidden bg-slate-50">
          <img 
            src={coverImage} 
            alt={listing.title} 
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
          <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-full shadow-sm">
            <p className="text-sm font-black text-[#1F3A5F]">
              ${listing.price.toLocaleString()} <span className="text-[10px] font-bold text-slate-400 uppercase">/mo</span>
            </p>
          </div>
        </div>

        {/* Content Container */}
        <div className="p-6">
          <h3 className="font-extrabold text-lg text-[#1F3A5F] truncate mb-1 group-hover:text-[#2BBE9A] transition-colors">
            {listing.title}
          </h3>
          <p className="text-slate-500 text-sm flex items-center gap-1.5 font-medium mb-4">
            <MapPin className="w-3.5 h-3.5 text-slate-400" />
            {listing.city} {listing.area && `• ${listing.area}`}
          </p>

          {/* Specs Row */}
          <div className="flex items-center gap-4 text-sm font-semibold text-slate-600 border-t border-slate-50 pt-4">
            {!isCommercial && listing.bedrooms !== null && (
              <div className="flex items-center gap-1.5">
                <Bed className="w-4 h-4 text-slate-400" />
                <span>{listing.bedrooms}</span>
              </div>
            )}
            {!isCommercial && listing.bathrooms !== null && (
              <div className="flex items-center gap-1.5">
                <Bath className="w-4 h-4 text-slate-400" />
                <span>{listing.bathrooms}</span>
              </div>
            )}
            {listing.square_footage !== null && (
              <div className="flex items-center gap-1.5">
                <Maximize2 className="w-4 h-4 text-slate-400" />
                <span>{listing.square_footage} {isCommercial ? 'sqm' : 'sqft'}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}




