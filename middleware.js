import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

const isProtectedRoute = createRouteMatcher([
  "/onboarding(.*)",
  "/organization(.*)",
  "/project(.*)",
  "/issue(.*)",
  "/sprint(.*)",
]);

export default clerkMiddleware((auth, req) => {
  const { userId, orgId, redirectToSignIn } = auth();

  if (!userId && isProtectedRoute(req)) {
    return redirectToSignIn();
  }

  // If user is logged in but hasn't selected an organization,
  // redirect to onboarding (except for home, onboarding, and organization pages)
  if (
    userId &&
    !orgId &&
    req.nextUrl.pathname !== "/onboarding" &&
    req.nextUrl.pathname !== "/" &&
    !req.nextUrl.pathname.startsWith("/organization") &&
    !req.nextUrl.pathname.startsWith("/project")
  ) {
    return NextResponse.redirect(new URL("/onboarding", req.url));
  }
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
  ],
};
