import { type NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";
import createIntlMiddleware from "next-intl/middleware";
import { routing } from "@/lib/i18n/routing";

const intlMiddleware = createIntlMiddleware(routing);

export async function middleware(request: NextRequest) {
  // First, let the intl middleware process the request
  const intlResponse = intlMiddleware(request);

  // If intl middleware returns a redirect or modified response, respect it and don't override
  if (intlResponse.status !== 200) {
    return intlResponse;
  }

  // Otherwise, apply your session logic
  const sessionResponse = await updateSession(request);

  // Merge headers from intl middleware (like locale redirect headers) into the final response
  intlResponse.headers.forEach((value, key) => {
    sessionResponse.headers.set(key, value);
  });

  return sessionResponse;
}

export const config = {
  matcher: [
    "/((?!api|trpc|_next|_vercel|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
