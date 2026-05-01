"use client"

import { Suspense } from "react"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { useSiteLanguage } from "@/contexts/SiteLanguageContext"
import { getCurrencyMeta, isSiteCurrency } from "@/lib/site-currencies"
import { AdminInvitations, type Invitation } from "./admin-invitations"
import { AdminDiscounts, type DiscountCode } from "./admin-discounts"
import { AdminNewsletter, type NewsletterSubscriber } from "./admin-newsletter"
import { AnalyticsButton } from "@/components/analytics-button"

type UserRow = {
  id: string
  name: string | null
  email: string | null
  role: string | null
  created_at: string
}

function AdminOrderBanner() {
  const { t } = useSiteLanguage()
  const params = useSearchParams()
  const code = params.get("orderCurrency")
  if (!code || !isSiteCurrency(code)) return null
  return (
    <div className="rounded-lg border border-primary/20 bg-primary/5 px-4 py-3 text-sm text-foreground mb-6">
      {t("admin.banner.lastOrderCurrency").replace(
        "{currency}",
        getCurrencyMeta(code).short,
      )}
    </div>
  )
}

export function AdminDashboard({
  users,
  invitations,
  discountCodes,
  subscribers,
}: {
  users: UserRow[]
  invitations: Invitation[]
  discountCodes: DiscountCode[]
  subscribers: NewsletterSubscriber[]
}) {
  const { t } = useSiteLanguage()

  return (
    <div className="space-y-8">
      <Suspense fallback={null}>
        <AdminOrderBanner />
      </Suspense>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-serif font-bold">{t("admin.title")}</h1>
        <div className="flex items-center gap-4">
          <AnalyticsButton propertyId="531410319" />
          <Link href="/" className="text-sm text-primary hover:underline">
            {t("admin.back")}
          </Link>
        </div>
      </div>

      <section>
        <h2 className="text-lg font-semibold mb-4">Discount Codes</h2>
        <AdminDiscounts initialCodes={discountCodes} />
      </section>

      <section>
        <h2 className="text-lg font-semibold mb-4">{t("admin.users")}</h2>
        <div className="rounded-lg border overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-muted/50">
              <tr>
                <th className="text-left p-3">{t("admin.th.name")}</th>
                <th className="text-left p-3">{t("admin.th.email")}</th>
                <th className="text-left p-3">{t("admin.th.role")}</th>
                <th className="text-left p-3">{t("admin.th.created")}</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u.id} className="border-t">
                  <td className="p-3">{u.name}</td>
                  <td className="p-3">{u.email}</td>
                  <td className="p-3">{u.role}</td>
                  <td className="p-3 text-muted-foreground">
                    <span suppressHydrationWarning>
                      {new Date(u.created_at).toLocaleDateString()}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section>
        <h2 className="text-lg font-semibold mb-4">{t("admin.invitations")}</h2>
        <AdminInvitations invitations={invitations} />
      </section>

      <section>
        <h2 className="text-lg font-semibold mb-4">Newsletter Subscribers (Leads)</h2>
        <AdminNewsletter subscribers={subscribers} />
      </section>
    </div>
  )
}
