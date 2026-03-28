"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { useSiteLanguage } from "@/contexts/SiteLanguageContext"

export default function RegisterPage() {
  const { t } = useSiteLanguage()
  const router = useRouter()
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password }),
    })

    const data = await res.json()
    if (!res.ok) {
      setError(data.error || t("auth.register.error"))
      return
    }

    router.push("/login")
    router.refresh()
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-secondary/20 to-background px-4">
      <div className="w-full max-w-md">
        <div className="glass rounded-2xl p-8 shadow-xl border border-primary/10">
          <h1 className="text-2xl font-serif font-bold text-center mb-6">
            {t("auth.register.title")}
          </h1>
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <p className="text-sm text-destructive bg-destructive/10 rounded-lg p-3">
                {error}
              </p>
            )}
            <div>
              <label className="block text-sm font-medium mb-1">{t("auth.register.name")}</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border border-input bg-background focus:ring-2 focus:ring-ring"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">{t("auth.register.email")}</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border border-input bg-background focus:ring-2 focus:ring-ring"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">{t("auth.register.password")}</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border border-input bg-background focus:ring-2 focus:ring-ring"
                required
                minLength={8}
              />
              <p className="text-xs text-muted-foreground mt-1">
                {t("auth.register.hint")}
              </p>
            </div>
            <button
              type="submit"
              className="w-full py-3 bg-primary text-primary-foreground rounded-lg font-semibold hover:opacity-90 transition"
            >
              {t("auth.register.submit")}
            </button>
          </form>
          <p className="mt-4 text-center text-sm text-muted-foreground">
            {t("auth.register.hasAccount")}{" "}
            <Link href="/login" className="text-primary font-medium hover:underline">
              {t("auth.register.signIn")}
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
