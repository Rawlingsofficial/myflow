// middleware.ts  (TENANT APP)
import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

const isPublicRoute = createRouteMatcher([
  "/",
  "/listings(.*)",
  "/sign-in(.*)",
  "/sign-up(.*)",
  "/api/webhooks(.*)",
  "/api/listings(.*)",
]);

const isAuthRoute = createRouteMatcher([
  "/sign-in(.*)",
  "/sign-up(.*)",
]);

export default clerkMiddleware(async (auth, req) => {
  const { pathname } = req.nextUrl;
  console.log(`[Proxy] Request: ${pathname}`);

  const { userId, sessionClaims } = await auth();
  console.log(`[Proxy] Auth State: User=${userId}, Path=${pathname}`);

  // 1. If user is signed in and hits sign-in/sign-up, send them to home
  if (userId && isAuthRoute(req)) {
    console.log(`[Proxy] Signed-in user on auth route, redirecting to /home`);
    return NextResponse.redirect(new URL("/home", req.url));
  }

  // 2. Allow public routes
  if (isPublicRoute(req)) {
    console.log(`[Proxy] Public route allowed: ${pathname}`);
    return NextResponse.next();
  }

  // 3. Protect private routes
  if (!userId) {
    console.log(`[Proxy] No user on private route, redirecting to /sign-in`);
    return NextResponse.redirect(new URL("/sign-in", req.url));
  }

  const role = (sessionClaims?.metadata as { role?: string })?.role;
  console.log(`[Proxy] Role: ${role}`);

  // 4. Handle landlord redirection safely
  if (role === "landlord") {
    const landlordUrl = process.env.LANDLORD_APP_URL;
    if (landlordUrl) {
      console.log(`[Proxy] Redirecting landlord to: ${landlordUrl}`);
      return NextResponse.redirect(new URL(landlordUrl, req.url));
    }
    console.log(`[Proxy] Landlord detected but LANDLORD_APP_URL not set`);
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/((?!_next|.*\\..*).*)"],
};
