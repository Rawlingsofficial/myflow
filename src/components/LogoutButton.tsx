"use client";

import { SignOutButton } from "@clerk/nextjs";

export default function LogoutButton() {
  return (
    <SignOutButton>
      <button className="text-red-600 hover:text-red-800">Logout</button>
    </SignOutButton>
  );
}

