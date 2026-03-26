"use client"

import { useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function PaymentCompletePage() {
  const router = useRouter()
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
      body: JSON.stringify({ invitationId }),
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
  }, [invitationId])

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-secondary/20 to-background px-4">
      <div className="w-full max-w-md glass rounded-2xl p-8 shadow-xl border border-primary/10 text-center">
        {status === "loading" && (
          <>
            <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-muted-foreground">Completing payment...</p>
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
            <h1 className="text-2xl font-serif font-bold mb-2">Payment Complete</h1>
            <p className="text-muted-foreground mb-6">
              Your invitation is now live!
            </p>
            {slug && (
              <div className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  Your invitation is live at:
                </p>
                <Link
                  href={`/invite/${slug}`}
                  className="block text-primary font-medium break-all"
                >
                  /invite/{slug}
                </Link>
                <div className="flex flex-wrap gap-4 justify-center">
                  <Link href={`/invite/${slug}`} target="_blank">
                    <Button>View Invitation</Button>
                  </Link>
                  <Link href="/create">
                    <Button variant="outline">Create Another</Button>
                  </Link>
                  <Link href="/">
                    <Button variant="outline">Back Home</Button>
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
            <h1 className="text-2xl font-serif font-bold mb-2">Something went wrong</h1>
            <p className="text-muted-foreground mb-6">
              Please try again or contact support.
            </p>
            <Link href="/create">
              <Button>Try Again</Button>
            </Link>
          </>
        )}
      </div>
    </div>
  )
}
