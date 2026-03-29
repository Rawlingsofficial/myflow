'use client';

import { useState, useMemo } from 'react';
import ListingCard from '@/components/marketplace/ListingCard';
import { Search, MapPin, SlidersHorizontal, ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';

interface MarketplaceClientProps {
  listings: any[];
}

export default function MarketplaceClient({ listings }: MarketplaceClientProps) {
  const [search, setSearch] = useState('');
  const [region, setRegion] = useState('');
  const [division, setDivision] = useState('');
  const [city, setCity] = useState('');
  const [maxPrice, setMaxPrice] = useState('');

  // Extract unique locations dynamically from available listings
  const availableRegions = Array.from(new Set(listings.map(l => l.region).filter(Boolean)));
  const availableDivisions = Array.from(new Set(listings.map(l => l.division).filter(Boolean)));
  const availableCities = Array.from(new Set(listings.map(l => l.city).filter(Boolean)));

  const filteredListings = useMemo(() => {
    return listings.filter(listing => {
      const s = search.toLowerCase();
      const matchesSearch = !search || 
        (listing.title?.toLowerCase() || '').includes(s) ||
        (listing.area?.toLowerCase() || '').includes(s);

      const matchesRegion = !region || listing.region === region;
      const matchesDivision = !division || listing.division === division;
      const matchesCity = !city || listing.city === city;
      const matchesPrice = !maxPrice || listing.price <= Number(maxPrice);

      return matchesSearch && matchesRegion && matchesDivision && matchesCity && matchesPrice;
    });
  }, [listings, search, region, division, city, maxPrice]);

  return (
    <div className="min-h-screen bg-slate-50 pb-24">
      {/* Premium Header */}
      <div className="bg-white border-b border-slate-100 pt-8 pb-8 px-4 md:px-8 relative overflow-hidden">
        {/* Decorative background */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-[#2BBE9A]/5 rounded-full blur-3xl -z-10" />
        
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center md:text-left mb-8">
            <h1 className="text-3xl md:text-5xl font-black text-[#1F3A5F] mb-3 tracking-tight">
              Marketplace
            </h1>
            <p className="text-slate-500 font-medium">Discover your perfect home from our verified listings</p>
          </div>
          
          <div className="bg-slate-50 p-4 md:p-6 rounded-[2rem] border border-slate-100 shadow-inner flex flex-col gap-4">
            {/* Search Input */}
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
              <input 
                type="text" 
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by neighborhood, title, or area..." 
                className="w-full bg-white h-14 pl-12 pr-4 rounded-2xl outline-none text-[#1F3A5F] font-semibold text-sm shadow-sm border border-slate-100 focus:ring-2 focus:ring-[#2BBE9A]/20 transition-all"
              />
            </div>

            {/* Filters Row */}
            <div className="flex gap-3 overflow-x-auto hide-scrollbar pb-1">
              <div className="flex items-center bg-[#1F3A5F] px-4 rounded-xl shrink-0 shadow-md shadow-blue-900/10">
                <SlidersHorizontal className="w-4 h-4 text-white" />
                <span className="ml-2 text-xs font-bold text-white uppercase tracking-wider">Filters</span>
              </div>
              
              <SelectFilter 
                value={region} 
                onChange={(e) => setRegion(e.target.value)}
                placeholder="All Regions"
                options={availableRegions}
              />
              
              <SelectFilter 
                value={division} 
                onChange={(e) => setDivision(e.target.value)}
                placeholder="All Divisions"
                options={availableDivisions}
              />

              <SelectFilter 
                value={city} 
                onChange={(e) => setCity(e.target.value)}
                placeholder="All Cities"
                options={availableCities}
              />

              <div className="relative shrink-0">
                <select 
                  value={maxPrice} onChange={(e) => setMaxPrice(e.target.value)}
                  className="h-12 bg-white text-[#1F3A5F] text-xs font-bold rounded-xl pl-4 pr-10 outline-none cursor-pointer shadow-sm border border-slate-100 hover:border-slate-200 appearance-none min-w-[140px]"
                >
                  <option value="">Max Price</option>
                  <option value="100000">Under $100k</option>
                  <option value="250000">Under $250k</option>
                  <option value="500000">Under $500k</option>
                  <option value="1000000">Under $1M</option>
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Grid Section */}
      <div className="max-w-7xl mx-auto px-4 md:px-8 pt-10">
        <div className="flex items-center justify-between mb-6 px-1">
          <h2 className="text-sm font-bold text-slate-400 uppercase tracking-widest">
            {filteredListings.length} Property Found
          </h2>
        </div>

        {filteredListings.length === 0 ? (
          <div className="text-center py-24 bg-white rounded-[3rem] border border-slate-100 shadow-xl shadow-[#1F3A5F]/5 mx-1">
            <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6">
              <MapPin className="w-10 h-10 text-slate-200" />
            </div>
            <h3 className="text-xl font-bold text-[#1F3A5F]">No matches found</h3>
            <p className="text-slate-400 font-medium mt-2 max-w-xs mx-auto text-sm leading-relaxed">
              We couldn&apos;t find any properties matching your current filters.
            </p>
            <button 
              onClick={() => {setSearch(''); setRegion(''); setDivision(''); setCity(''); setMaxPrice('');}} 
              className="mt-8 text-sm font-bold text-white bg-[#2BBE9A] px-8 py-3 rounded-xl shadow-lg shadow-[#2BBE9A]/20 transition-transform active:scale-95"
            >
              Clear All Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8">
            {filteredListings.map((listing) => (
              <ListingCard key={listing.id} listing={listing} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function SelectFilter({ value, onChange, placeholder, options }: { value: string, onChange: (e: any) => void, placeholder: string, options: any[] }) {
  return (
    <div className="relative shrink-0">
      <select 
        value={value} 
        onChange={onChange}
        className={cn(
          "h-12 bg-white text-xs font-bold rounded-xl pl-4 pr-10 outline-none cursor-pointer shadow-sm border border-slate-100 hover:border-slate-200 appearance-none min-w-[140px] transition-colors",
          value ? "text-[#2BBE9A] border-[#2BBE9A]/30 bg-[#2BBE9A]/5" : "text-[#1F3A5F]"
        )}
      >
        <option value="">{placeholder}</option>
        {options.map(opt => <option key={opt} value={opt}>{opt}</option>)}
      </select>
      <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
    </div>
  );
}