"use client"

import { useState, Suspense } from "react"
import { signIn } from "next-auth/react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import { useSiteLanguage } from "@/contexts/SiteLanguageContext"

function LoginContent() {
  const { t } = useSiteLanguage()
  const router = useRouter()
  const searchParams = useSearchParams()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    const res = await signIn("credentials", {
      email,
      password,
      redirect: false,
    })

    if (res?.error) {
      setError("Invalid email or password")
      return
    }

    const callbackUrl = searchParams.get("callbackUrl") || "/create"
    router.push(callbackUrl)
    router.refresh()
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-secondary/20 to-background px-4">
      <div className="w-full max-w-md">
        <div className="glass rounded-2xl p-8 shadow-xl border border-primary/10">
          <h1 className="text-2xl font-serif font-bold text-center mb-6">
            {t("auth.login.title")}
          </h1>
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <p className="text-sm text-destructive bg-destructive/10 rounded-lg p-3">
                {error}
              </p>
            )}
            <div>
              <label className="block text-sm font-medium mb-1">{t("auth.login.email")}</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border border-input bg-background focus:ring-2 focus:ring-ring"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">{t("auth.login.password")}</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border border-input bg-background focus:ring-2 focus:ring-ring"
                required
              />
            </div>
            <button
              type="submit"
              className="w-full py-3 bg-primary text-primary-foreground rounded-lg font-semibold hover:opacity-90 transition"
            >
              {t("auth.login.submit")}
            </button>
          </form>
          <p className="mt-4 text-center text-sm text-muted-foreground">
            {t("auth.login.noAccount")}{" "}
            <Link href="/register" className="text-primary font-medium hover:underline">
              {t("auth.login.register")}
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

function LoginFallback() {
  const { t } = useSiteLanguage()
  return (
    <div className="flex items-center justify-center min-h-screen">{t("common.loading")}</div>
  )
}

export default function LoginPage() {
  return (
    <Suspense fallback={<LoginFallback />}>
      <LoginContent />
    </Suspense>
  )
}
