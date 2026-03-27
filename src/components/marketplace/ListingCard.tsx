"use client";
import Image from 'next/image';
import Link from 'next/link';

interface ListingCardProps {
  listing: {
    id: string;
    title: string;
    price: number;
    image: string;
    city: string;
    area?: string;
  };
}

export default function ListingCard({ listing }: ListingCardProps) {
  return (
    <Link href={`/listings/${listing.id}`} className="block border rounded-lg overflow-hidden shadow">
      <Image
        src={listing.image}
        alt={listing.title}
        width={400}
        height={200}
        className="w-full h-48 object-cover"
      />
      <div className="p-3">
        <h3 className="font-bold">{listing.title}</h3>
        <p className="text-gray-600">${listing.price}/month</p>
        <p className="text-sm text-gray-500">{listing.city}{listing.area ? `, ${listing.area}` : ''}</p>
      </div>
    </Link>
  );
}

