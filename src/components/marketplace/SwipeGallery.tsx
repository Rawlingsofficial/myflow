"use client";

import { useState } from "react";
import Image from "next/image";

interface SwipeGalleryProps {
  images: string[];
}

export default function SwipeGallery({ images }: SwipeGalleryProps) {
  const [current, setCurrent] = useState(0);

  const next = () => setCurrent((prev) => (prev + 1) % images.length);
  const prev = () => setCurrent((prev) => (prev - 1 + images.length) % images.length);

  if (!images.length) return <div className="bg-gray-200 h-64 flex items-center justify-center">No images</div>;

  return (
    <div className="relative">
      <Image
        src={images[current]}
        alt="Listing image"
        width={600}
        height={400}
        className="w-full h-64 object-cover rounded"
      />
      {images.length > 1 && (
        <>
          <button
            onClick={prev}
            className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-black/50 text-white p-2 rounded-full"
          >
            ‹
          </button>
          <button
            onClick={next}
            className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black/50 text-white p-2 rounded-full"
          >
            ›
          </button>
        </>
      )}
    </div>
  );
}

