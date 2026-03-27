import { auth } from "@/lib/auth"
import { createClient } from "@supabase/supabase-js"
import { NextResponse } from "next/server"

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

async function handleSubdomain(req: Request): Promise<NextResponse | null> {
  try {
    const url = new URL(req.url)
    const host = url.host
    const subdomain = getSubdomain(host)
    if (!subdomain) return null

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
    if (!supabaseUrl || !serviceKey) return null

    const supabase = createClient(supabaseUrl, serviceKey)
    const { data } = await supabase
      .from("invitations")
      .select("slug")
      .eq("subdomain", subdomain)
      .eq("is_published", true)
      .eq("payment_status", "paid")
      .single()

    if (!data?.slug) return null
    return NextResponse.rewrite(new URL(`/invite/${data.slug}`, req.url))
  } catch {
    return null
  }
}

export default auth(async (req) => {
  const subRewrite = await handleSubdomain(req)
  if (subRewrite) return subRewrite

  const { pathname } = req.nextUrl
  const isAuth = !!req.auth
  const isAdmin = (req.auth?.user as { role?: string })?.role === "admin"
  const authRoutes = ["/login", "/register"]
  const protectedRoutes = ["/admin", "/payment"]
  const isAuthRoute = authRoutes.some((r) => pathname.startsWith(r))
  const isProtected = protectedRoutes.some((r) => pathname.startsWith(r))
  const isAdminRoute = pathname.startsWith("/admin")

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

  return undefined
})

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|invite|public).*)"],
}
