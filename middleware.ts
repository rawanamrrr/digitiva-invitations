import { auth } from "@/lib/auth"
import { createClient } from "@supabase/supabase-js"
import { NextResponse, type NextRequest } from "next/server"

function getSubdomain(host: string): string | null {
  const base = process.env.NEXT_PUBLIC_APP_DOMAIN || "localhost:3000"
  if (host === base || host.endsWith("." + base)) return null
  const parts = host.split(".")
  if (parts.length >= 2 && (host.includes("localhost") || parts.length >= 3)) {
    const sub = parts[0]
    if (sub && sub !== "www") return sub
  }
  return null
}

// Routes that require auth check — only run auth() for these
const AUTH_REQUIRED_PREFIXES = ["/admin", "/payment", "/login", "/register"]

function needsAuthCheck(pathname: string): boolean {
  return AUTH_REQUIRED_PREFIXES.some((r) => pathname.startsWith(r))
}

// Cached Supabase client for subdomain lookups (reuse across requests)
let _supabase: ReturnType<typeof createClient> | null = null
function getSubdomainSupabase() {
  if (!_supabase) {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL
    const key = process.env.SUPABASE_SERVICE_ROLE_KEY
    if (!url || !key) return null
    _supabase = createClient(url, key)
  }
  return _supabase
}

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl

  // 1. Subdomain rewrite — fast path, no auth needed
  try {
    const host = req.headers.get("host") || ""
    const subdomain = getSubdomain(host)
    if (subdomain) {
      const supabase = getSubdomainSupabase()
      if (supabase) {
        const { data } = await supabase
          .from("invitations")
          .select("slug")
          .eq("subdomain", subdomain)
          .eq("is_published", true)
          .eq("payment_status", "paid")
          .single() as { data: { slug: string } | null, error: any }

        if (data?.slug) {
          return NextResponse.rewrite(new URL(`/invite/${data.slug}`, req.url))
        }
      }
    }
  } catch {
    // Subdomain lookup failed — continue normally
  }

  // 2. Skip auth for public routes (home, create, etc.) — big speed win
  if (!needsAuthCheck(pathname)) {
    return NextResponse.next()
  }

  // 3. Auth check — only runs for /admin, /payment, /login, /register
  const session = await auth()
  const isAuth = !!session?.user
  const isAdmin = (session?.user as { role?: string })?.role === "admin"

  const authRoutes = ["/login", "/register"]
  const isAuthRoute = authRoutes.some((r) => pathname.startsWith(r))
  const isAdminRoute = pathname.startsWith("/admin")
  const isProtected = pathname.startsWith("/admin") || pathname.startsWith("/payment")

  if (isAuthRoute && isAuth) {
    return NextResponse.redirect(
      new URL(isAdmin ? "/admin" : "/create", req.url)
    )
  }
  if (isProtected && !isAuth) {
    const signIn = new URL("/login", req.url)
    signIn.searchParams.set("callbackUrl", pathname)
    return NextResponse.redirect(signIn)
  }
  if (isAdminRoute && !isAdmin) {
    return NextResponse.redirect(new URL("/", req.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|invite|public|.*\\.).*)"],
}
