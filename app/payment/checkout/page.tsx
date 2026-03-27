"use client"

import { useEffect, useState, Suspense } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { CreditCard } from "lucide-react"

function CheckoutContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const invitationId = searchParams.get("invitationId")
  const [loading, setLoading] = useState(false)
  const [card, setCard] = useState({ number: "", expiry: "", cvc: "" })

  useEffect(() => {
    if (!invitationId) router.push("/create")
  }, [invitationId, router])

  const handlePay = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!invitationId) return
    setLoading(true)
    try {
      const res = await fetch("/api/payment/complete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ invitationId }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || "Failed")
      router.push(`/payment/complete?invitationId=${invitationId}`)
    } catch (e) {
      alert(e instanceof Error ? e.message : "Payment failed")
    } finally {
      setLoading(false)
    }
  }

  if (!invitationId) return null

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-secondary/20 to-background px-4">
      <div className="w-full max-w-md">
        <div className="glass rounded-2xl p-8 shadow-xl border border-primary/10">
          <div className="flex items-center gap-2 mb-6">
            <CreditCard className="w-8 h-8 text-primary" />
            <h1 className="text-2xl font-serif font-bold">Complete Payment</h1>
          </div>
          <p className="text-muted-foreground mb-6">
            Premium invitation — $9.99 (UI demo)
          </p>
          <form onSubmit={handlePay} className="space-y-4">
            <div>
              <Label>Card Number</Label>
              <Input
                value={card.number}
                onChange={(e) =>
                  setCard((p) => ({ ...p, number: e.target.value }))
                }
                placeholder="4242 4242 4242 4242"
                maxLength={19}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Expiry</Label>
                <Input
                  value={card.expiry}
                  onChange={(e) =>
                    setCard((p) => ({ ...p, expiry: e.target.value }))
                  }
                  placeholder="MM/YY"
                />
              </div>
              <div>
                <Label>CVC</Label>
                <Input
                  value={card.cvc}
                  onChange={(e) =>
                    setCard((p) => ({ ...p, cvc: e.target.value }))
                  }
                  placeholder="123"
                />
              </div>
            </div>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Processing..." : "Pay Now"}
            </Button>
          </form>
          <p className="mt-4 text-xs text-muted-foreground text-center">
            Payment UI only — no real charges. Click Pay to simulate success.
          </p>
          <Link
            href="/create"
            className="block mt-4 text-center text-sm text-primary hover:underline"
          >
            Cancel
          </Link>
        </div>
      </div>
    </div>
  )
}

export default function CheckoutPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
      <CheckoutContent />
    </Suspense>
  )
}
