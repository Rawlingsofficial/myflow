'use client';

import { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface SwipeGalleryProps {
  images: { url: string; display_order: number }[];
  title: string;
}

export default function SwipeGallery({ images, title }: SwipeGalleryProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  if (!images || images.length === 0) {
    return (
      <img 
        src="https://placehold.co/1200x600/f8fafc/94a3b8?text=No+Image+Available" 
        alt="No images available" 
        className="w-full h-full object-cover"
      />
    );
  }

  const next = () => setCurrentIndex((i) => (i + 1) % images.length);
  const prev = () => setCurrentIndex((i) => (i - 1 + images.length) % images.length);

  return (
    <div className="relative w-full h-full group bg-slate-100">
      <img 
        src={images[currentIndex].url} 
        alt={`${title} - Image ${currentIndex + 1}`} 
        className="w-full h-full object-cover transition-opacity duration-300"
      />
      
      {images.length > 1 && (
        <>
          {/* Controls */}
          <button 
            onClick={prev} 
            className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/80 hover:bg-white rounded-full flex items-center justify-center text-[#1F3A5F] opacity-0 group-hover:opacity-100 transition-all shadow-md"
          >
            <ChevronLeft className="w-7 h-7 -ml-1" />
          </button>
          <button 
            onClick={next} 
            className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/80 hover:bg-white rounded-full flex items-center justify-center text-[#1F3A5F] opacity-0 group-hover:opacity-100 transition-all shadow-md"
          >
            <ChevronRight className="w-7 h-7 -mr-1" />
          </button>

          {/* Counter */}
          <div className="absolute bottom-6 right-6 bg-white/90 backdrop-blur-md px-4 py-2 rounded-xl text-sm font-bold text-[#1F3A5F] shadow-lg">
            {currentIndex + 1} / {images.length} Photos
          </div>
        </>
      )}
    </div>
  );
}

