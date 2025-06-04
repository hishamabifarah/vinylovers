//Trusts x-vercel-forwarded-for (used by Vercel).
//Falls back to x-forwarded-for or 'unknown'.

/**
 * Your code is production-ready for Vercel/Next.js API routes behind a trusted proxy.
    If you deploy elsewhere, review and adapt as needed.
    Always document the trust assumptions for future maintainers.
 */

export function getClientIP(req: Request): string {
  // Prefer Vercel's trusted header
  const ip =
    req.headers.get('x-vercel-forwarded-for') ||
    req.headers.get('x-forwarded-for')?.split(',')[0] ||
    'unknown';

  return ip;
}