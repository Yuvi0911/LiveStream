import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

// iski help se hum authentication kr rhe h jaise ki ye hume directly signin or signup page de dega aur hume signout ki functionality bhi de ga.
const isPublicRoute = createRouteMatcher([
  '/sign-in(.*)', 
  '/sign-up(.*)',
  '/api/webhooks/(.*)',
  '/api/uploadthing',
  "/",
  "/:username",
  "/search"
])

export default clerkMiddleware((auth, request) => {

    if (!isPublicRoute(request)) {
      auth().protect()
      // return NextResponse.redirect(new URL("/sign-in", request.url))
    }
    return NextResponse.next();
  });

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
};