import { NextResponse } from "next/server";

export async function GET() {
  // Fetch listings from Supabase here
  const mockListings = [
    { id: "1", title: "Cozy 1BR", price: 1200 },
    { id: "2", title: "Spacious 2BR", price: 1800 },
  ];
  return NextResponse.json(mockListings);
}

