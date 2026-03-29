import Link from 'next/link';
import { MapPin, Bed, Bath, Maximize2 } from 'lucide-react';

interface ListingCardProps {
  listing: any;
}

export default function ListingCard({ listing }: ListingCardProps) {
  const sortedImages = listing.images?.sort((a: any, b: any) => a.display_order - b.display_order) || [];
  const coverImage = sortedImages[0]?.url || 'https://placehold.co/600x400/f8fafc/94a3b8?text=No+Image';
  const isCommercial = listing.property_type === 'commercial';

  return (
    <Link href={`/listings/${listing.id}`} className="group block h-full">
      <div className="bg-white rounded-2xl md:rounded-[2rem] border border-slate-100 overflow-hidden shadow-sm hover:shadow-xl hover:shadow-[#1F3A5F]/5 transition-all duration-300 transform hover:-translate-y-1 h-full flex flex-col">
        {/* Image Container */}
        <div className="relative aspect-square md:aspect-[4/3] overflow-hidden bg-slate-50 shrink-0">
          <img 
            src={coverImage} 
            alt={listing.title} 
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
          <div className="absolute top-2 md:top-4 left-2 md:left-4 bg-white/95 backdrop-blur-md px-2 md:px-3 py-1 md:py-1.5 rounded-full shadow-sm">
            <p className="text-[10px] md:text-sm font-black text-[#1F3A5F]">
              ${listing.price.toLocaleString()} <span className="text-[8px] md:text-[10px] font-bold text-slate-400 uppercase">/mo</span>
            </p>
          </div>
        </div>

        {/* Content Container */}
        <div className="p-3 md:p-5 flex flex-col flex-1">
          <h3 className="font-extrabold text-sm md:text-lg text-[#1F3A5F] line-clamp-2 leading-tight mb-1 group-hover:text-[#2BBE9A] transition-colors flex-1">
            {listing.title}
          </h3>
          <p className="text-slate-500 text-[9px] md:text-sm flex items-center gap-1 font-medium mb-3 md:mb-4 truncate">
            <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
            <span className="truncate">{listing.city} {listing.area && `• ${listing.area}`}</span>
          </p>

          {/* Specs Row */}
          <div className="flex items-center gap-2 md:gap-4 text-[10px] md:text-sm font-semibold text-slate-600 border-t border-slate-100 pt-3 mt-auto">
            {!isCommercial && listing.bedrooms !== null && (
              <div className="flex items-center gap-1">
                <Bed className="w-3 h-3 md:w-4 md:h-4 text-slate-400" />
                <span>{listing.bedrooms}</span>
              </div>
            )}
            {!isCommercial && listing.bathrooms !== null && (
              <div className="flex items-center gap-1">
                <Bath className="w-3 h-3 md:w-4 md:h-4 text-slate-400" />
                <span>{listing.bathrooms}</span>
              </div>
            )}
            {listing.square_footage !== null && (
              <div className="flex items-center gap-1">
                <Maximize2 className="w-3 h-3 md:w-4 md:h-4 text-slate-400" />
                <span>{listing.square_footage} {isCommercial ? 'sqm' : 'sqft'}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}