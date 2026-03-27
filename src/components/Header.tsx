import { auth, currentUser } from "@clerk/nextjs/server";
import Link from "next/link";
import LogoutButton from "./LogoutButton";

export default async function Header() {
  const { userId } = await auth();
  const user = userId ? await currentUser() : null;

  return (
    <header className="bg-white shadow-sm p-4 flex justify-between items-center">
      <Link href="/" className="text-xl font-bold text-blue-600">
        Tenant App
      </Link>
      <nav className="flex gap-4 items-center">
        {user ? (
          <>
            <Link href="/home" className="text-gray-700 hover:text-blue-600">
              Dashboard
            </Link>
            <LogoutButton />
          </>
        ) : (
          <>
            <Link href="/sign-in" className="text-gray-700 hover:text-blue-600">
              Sign In
            </Link>
            <Link href="/sign-up" className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
              Sign Up
            </Link>
          </>
        )}
      </nav>
    </header>
  );
}

