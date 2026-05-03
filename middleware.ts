import { clerkMiddleware, createRouteMatcher, clerkClient } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

const isPrivateRoute = createRouteMatcher([
  "/jobs/verify-details(.*)"
]);
const isOnboardingRoute = createRouteMatcher(["/onboarding"]);

export default clerkMiddleware(async (auth, request: NextRequest) => {
  const { userId, redirectToSignIn } = await auth();

  if (!userId) {
    if (isPrivateRoute(request)) {
      return redirectToSignIn({ returnBackUrl: request.url });
    }
    return NextResponse.next();
  }

  // Get the user to check onboarding status
  // Note: This is necessary for security - cannot rely on client data
  const client = await clerkClient();
  const user = await client.users.getUser(userId);
  const completed = user.publicMetadata?.onboardingComplete === true;

  if (!completed && !isOnboardingRoute(request)) {
    return NextResponse.redirect(new URL("/onboarding", request.url));
  }

  if (completed && isOnboardingRoute(request)) {
    return NextResponse.redirect(new URL("/", request.url));
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