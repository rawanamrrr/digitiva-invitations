"use client"

import { useEffect, useState, Suspense } from "react"
import { useSearchParams } from "next/navigation"
import Link from "next/link"
import { useSiteCurrency } from "@/contexts/SiteCurrencyContext"
import { useSiteLanguage } from "@/contexts/SiteLanguageContext"
import { Button } from "@/components/ui/button"

function PaymentCompleteContent() {
  const { t } = useSiteLanguage()
  const { currency } = useSiteCurrency()
  const searchParams = useSearchParams()
  const invitationId = searchParams.get("invitationId")
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading")
  const [slug, setSlug] = useState<string | null>(null)

  useEffect(() => {
    if (!invitationId) {
      setStatus("error")
      return
    }

    fetch("/api/payment/complete", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ invitationId, orderCurrency: currency }),
    })
      .then((r) => r.json())
      .then((data) => {
        if (data.slug) {
          setSlug(data.slug)
          setStatus("success")
        } else {
          setStatus("error")
        }
      })
      .catch(() => setStatus("error"))
  }, [invitationId, currency])

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-secondary/20 to-background px-4">
      <div className="w-full max-w-md glass rounded-2xl p-8 shadow-xl border border-primary/10 text-center">
        {status === "loading" && (
          <>
            <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-muted-foreground">{t("pay.complete.loading")}</p>
          </>
        )}
        {status === "success" && (
          <>
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg
                className="w-8 h-8 text-green-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            <h1 className="text-2xl font-serif font-bold mb-2">{t("pay.complete.title")}</h1>
            <p className="text-muted-foreground mb-6">
              {t("pay.complete.subtitle")}
            </p>
            {slug && (
              <div className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  {t("pay.complete.liveAt")}
                </p>
                <Link
                  href={`/invite/${slug}`}
                  className="block text-primary font-medium break-all"
                >
                  /invite/{slug}
                </Link>
                <div className="flex flex-wrap gap-4 justify-center">
                  <Link href={`/invite/${slug}`} target="_blank">
                    <Button>{t("pay.complete.view")}</Button>
                  </Link>
                  <Link href="/create">
                    <Button variant="outline">{t("pay.complete.createAnother")}</Button>
                  </Link>
                  <Link href="/">
                    <Button variant="outline">{t("pay.complete.home")}</Button>
                  </Link>
                </div>
              </div>
            )}
          </>
        )}
        {status === "error" && (
          <>
            <div className="w-16 h-16 bg-destructive/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg
                className="w-8 h-8 text-destructive"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </div>
            <h1 className="text-2xl font-serif font-bold mb-2">{t("pay.complete.errorTitle")}</h1>
            <p className="text-muted-foreground mb-6">
              {t("pay.complete.errorSub")}
            </p>
            <Link href="/create">
              <Button>{t("pay.complete.tryAgain")}</Button>
            </Link>
          </>
        )}
      </div>
    </div>
  )
}

function CompleteFallback() {
  const { t } = useSiteLanguage()
  return <div className="min-h-screen flex items-center justify-center">{t("common.loading")}</div>
}

export default function PaymentCompletePage() {
  return (
    <Suspense fallback={<CompleteFallback />}>
      <PaymentCompleteContent />
    </Suspense>
  )
}
