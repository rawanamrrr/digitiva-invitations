"use client"

import { useState } from "react"
import { useSiteLanguage } from "@/contexts/SiteLanguageContext"
import { getCurrencyMeta, isSiteCurrency } from "@/lib/site-currencies"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { templates } from "@/lib/templates"
import {
  X,
  User,
  Calendar,
  MapPin,
  Palette,
  Package,
  CreditCard,
  Eye,
  Clock,
  Mail,
  Phone,
  Image as ImageIcon,
  ExternalLink,
  CheckCircle2,
  AlertCircle,
} from "lucide-react"

export type Invitation = {
  id: string
  bride_name: string
  groom_name: string
  slug: string
  is_published: boolean
  is_finished?: boolean
  payment_status: string
  view_count?: number
  event_date?: string
  event_time?: string
  venue?: string
  venue_address?: string
  venue_map_url?: string
  template_id?: string
  couple_image?: string
  song_url?: string
  package_name?: string
  sections?: string[] | null
  extras?: string[] | null
  custom_theme_color?: string
  email?: string
  whatsapp?: string
  payment_method?: string
  payment_screenshot?: string
  order_currency?: string | null
  order_total?: number | string | null
  discount_code?: string | null
  discount_percentage?: number | null
  created_at?: string
}

const SECTION_ADMIN_KEYS: Record<string, string> = {
  countdown: "admin.sec.countdown",
  venueMap: "admin.sec.venueMap",
  handwrittenMessage: "admin.sec.handwrittenMessage",
  rsvp: "admin.sec.rsvp",
  photoUpload: "admin.sec.photoUpload",
  song: "admin.sec.song",
  messages: "admin.sec.messages",
  ourStory: "admin.sec.ourStory",
  timeline: "admin.sec.timeline",
  guestNotes: "admin.sec.guestNotes",
  dressCode: "admin.sec.dressCode",
}

const EXTRA_CREATE_KEYS: Record<string, string> = {
  extra_month: "create.extra.extra_month",
  custom_domain: "create.extra.custom_domain",
  express_delivery: "create.extra.express_delivery",
}

function OrderDetailsModal({
  invitation,
  onClose,
}: {
  invitation: Invitation
  onClose: () => void
}) {
  const { t } = useSiteLanguage()
  const template = templates.find((tmpl) => tmpl.id === invitation.template_id)

  const orderTotalDisplay =
    invitation.order_total == null
      ? null
      : typeof invitation.order_total === "number"
        ? invitation.order_total
        : Number(invitation.order_total)

  const sectionLabel = (section: string) => {
    const key = SECTION_ADMIN_KEYS[section]
    return key ? t(key) : section
  }

  const extraLabel = (extra: string) => {
    const key = EXTRA_CREATE_KEYS[extra]
    return key ? t(key) : extra
  }

  const payStatusLabel =
    invitation.payment_status === "paid" ? t("admin.inv.paid") : t("admin.inv.unpaid")

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div
        className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl border border-primary/20 bg-card shadow-2xl"
        style={{
          scrollbarWidth: "thin",
        }}
      >
        {/* Header gradient bar */}
        <div className="sticky top-0 z-10 bg-card border-b border-border">
          <div className="h-1 bg-gradient-to-r from-primary via-teal-500 to-primary" />
          <div className="flex items-center justify-between p-5">
            <div>
              <h2 className="text-xl font-serif font-bold text-foreground">
                {t("admin.inv.orderDetails")}
              </h2>
              <p className="text-sm text-muted-foreground mt-0.5">
                {invitation.bride_name} & {invitation.groom_name}
              </p>
            </div>
            <button
              onClick={onClose}
              className="rounded-full p-2 hover:bg-muted transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="p-5 space-y-5">
          {/* Status badges row */}
          <div className="flex flex-wrap gap-2">
            <span
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold ${
                invitation.is_published
                  ? "bg-emerald-500/10 text-emerald-600 border border-emerald-500/20"
                  : "bg-amber-500/10 text-amber-600 border border-amber-500/20"
              }`}
            >
              {invitation.is_published ? (
                <CheckCircle2 className="w-3.5 h-3.5" />
              ) : (
                <AlertCircle className="w-3.5 h-3.5" />
              )}
              {invitation.is_published ? t("admin.inv.published") : t("admin.inv.draft")}
            </span>
            <span
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold ${
                invitation.payment_status === "paid"
                  ? "bg-emerald-500/10 text-emerald-600 border border-emerald-500/20"
                  : "bg-amber-500/10 text-amber-600 border border-amber-500/20"
              }`}
            >
              <CreditCard className="w-3.5 h-3.5" />
              {t("admin.table.payment")}: {payStatusLabel}
            </span>
            <span
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold ${
                invitation.is_finished
                  ? "bg-emerald-500/10 text-emerald-600 border border-emerald-500/20"
                  : "bg-gray-500/10 text-gray-600 border border-gray-500/20"
              }`}
            >
              {invitation.is_finished ? (
                <CheckCircle2 className="w-3.5 h-3.5" />
              ) : (
                <AlertCircle className="w-3.5 h-3.5" />
              )}
              {invitation.is_finished ? t("admin.inv.finished") : t("admin.inv.notFinished")}
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-blue-500/10 text-blue-600 border border-blue-500/20">
              <Eye className="w-3.5 h-3.5" />
              {invitation.view_count ?? 0} {t("admin.inv.views")}
            </span>
          </div>

          {/* Contact Information */}
          {(invitation.email || invitation.whatsapp) && (
            <section className="rounded-xl border border-border p-4 space-y-3">
              <h3 className="text-sm font-semibold uppercase tracking-wider text-primary flex items-center gap-2">
                <User className="w-4 h-4" />
                {t("admin.inv.contact")}
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {invitation.email && (
                  <div className="flex items-center gap-2.5 text-sm">
                    <Mail className="w-4 h-4 text-muted-foreground shrink-0" />
                    <span className="text-foreground break-all">{invitation.email}</span>
                  </div>
                )}
                {invitation.whatsapp && (
                  <div className="flex items-center gap-2.5 text-sm">
                    <Phone className="w-4 h-4 text-muted-foreground shrink-0" />
                    <span className="text-foreground">{invitation.whatsapp}</span>
                  </div>
                )}
              </div>
            </section>
          )}

          {/* Event Details */}
          <section className="rounded-xl border border-border p-4 space-y-3">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-primary flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              {t("admin.inv.eventDetails")}
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
              <div>
                <span className="text-muted-foreground">{t("admin.inv.bride")}</span>{" "}
                <span className="font-medium text-foreground">{invitation.bride_name}</span>
              </div>
              <div>
                <span className="text-muted-foreground">{t("admin.inv.groom")}</span>{" "}
                <span className="font-medium text-foreground">{invitation.groom_name}</span>
              </div>
              {invitation.event_date && (
                <div>
                  <span className="text-muted-foreground">{t("admin.inv.date")}</span>{" "}
                  <span className="font-medium text-foreground">
                    {new Date(invitation.event_date).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </span>
                </div>
              )}
              {invitation.event_time && (
                <div>
                  <span className="text-muted-foreground">{t("admin.inv.time")}</span>{" "}
                  <span className="font-medium text-foreground">{invitation.event_time}</span>
                </div>
              )}
            </div>
            {(invitation.venue || invitation.venue_address) && (
              <div className="flex items-start gap-2.5 text-sm pt-1">
                <MapPin className="w-4 h-4 text-muted-foreground shrink-0 mt-0.5" />
                <div>
                  {invitation.venue && (
                    <span className="font-medium text-foreground">{invitation.venue}</span>
                  )}
                  {invitation.venue_address && (
                    <p className="text-muted-foreground">{invitation.venue_address}</p>
                  )}
                  {invitation.venue_map_url && (
                    <a
                      href={invitation.venue_map_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-primary hover:underline mt-1"
                    >
                      {t("admin.inv.viewMap")} <ExternalLink className="w-3 h-3" />
                    </a>
                  )}
                </div>
              </div>
            )}
          </section>

          {/* Template */}
          <section className="rounded-xl border border-border p-4 space-y-3">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-primary flex items-center gap-2">
              <Palette className="w-4 h-4" />
              {t("admin.inv.design")}
            </h3>
            {template ? (
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-lg overflow-hidden border border-border bg-muted shrink-0">
                  {template.image.endsWith(".mp4") ? (
                    <video
                      src={template.image}
                      className="w-full h-full object-cover"
                      muted
                      playsInline
                    />
                  ) : (
                    <img
                      src={template.image}
                      alt={template.name}
                      className="w-full h-full object-cover"
                    />
                  )}
                </div>
                <div>
                  <p className="font-semibold text-foreground">{template.name}</p>
                  <p className="text-xs text-muted-foreground">{template.category}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{template.description}</p>
                </div>
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">
                {t("admin.inv.templateId")} <span className="font-mono">{invitation.template_id || t("admin.inv.na")}</span>
              </p>
            )}
            {invitation.custom_theme_color && (
              <div className="flex items-center gap-2 text-sm mt-2">
                <div
                  className="w-5 h-5 rounded-full border border-border"
                  style={{ backgroundColor: invitation.custom_theme_color }}
                />
                <span className="text-muted-foreground">{t("admin.inv.customColor")}</span>
                <span className="font-mono text-foreground text-xs">{invitation.custom_theme_color}</span>
              </div>
            )}
          </section>

          {/* Package & Sections */}
          <section className="rounded-xl border border-border p-4 space-y-3">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-primary flex items-center gap-2">
              <Package className="w-4 h-4" />
              {t("admin.table.package")} · {t("create.sections.title")}
            </h3>
            {invitation.package_name && (
              <div className="inline-flex items-center px-3 py-1.5 rounded-lg bg-primary/10 border border-primary/20 text-sm font-semibold text-primary capitalize">
                {invitation.package_name} · {t("admin.table.package")}
              </div>
            )}
            {invitation.sections && invitation.sections.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {invitation.sections.map((section) => (
                  <span
                    key={section}
                    className="px-2.5 py-1 rounded-full bg-muted text-xs font-medium text-foreground border border-border"
                  >
                    {sectionLabel(section)}
                  </span>
                ))}
              </div>
            )}
            {invitation.extras && invitation.extras.length > 0 && (
              <div className="space-y-2 mt-4">
                <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">{t("admin.inv.selectedExtras")}</h4>
                <div className="flex flex-wrap gap-2">
                  {invitation.extras.map((extra) => (
                    <span
                      key={extra}
                      className="px-2.5 py-1 rounded-full bg-orange-500/10 text-orange-600 text-xs font-medium border border-orange-500/20"
                    >
                      {extraLabel(extra)}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </section>

          {/* Payment Info */}
          <section className="rounded-xl border border-border p-4 space-y-3">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-primary flex items-center gap-2">
              <CreditCard className="w-4 h-4" />
              {t("admin.inv.paymentDetails")}
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
              {orderTotalDisplay != null &&
                Number.isFinite(orderTotalDisplay) &&
                invitation.order_currency &&
                isSiteCurrency(invitation.order_currency) && (
                <div>
                  <span className="text-muted-foreground">{t("admin.inv.orderTotal")}</span>{" "}
                  <span className="font-semibold text-foreground">
                    {orderTotalDisplay} {getCurrencyMeta(invitation.order_currency).short}
                  </span>
                </div>
              )}
              {invitation.order_currency &&
                isSiteCurrency(invitation.order_currency) && (
                  <div>
                    <span className="text-muted-foreground">
                      {t("admin.inv.orderCurrency")}
                    </span>{" "}
                    <span className="font-mono font-medium text-foreground">
                      {getCurrencyMeta(invitation.order_currency).short}
                    </span>
                  </div>
                )}
              {invitation.discount_code && (
                <div className="col-span-1 sm:col-span-2 bg-emerald-500/10 border border-emerald-500/20 p-3 rounded-lg flex justify-between items-center mt-1">
                  <div>
                    <span className="text-muted-foreground text-xs block mb-0.5">Discount Code</span>
                    <span className="font-mono font-bold text-emerald-700">{invitation.discount_code}</span>
                  </div>
                  <div className="text-right">
                    <span className="text-muted-foreground text-xs block mb-0.5">Amount</span>
                    <span className="font-bold text-emerald-700">-{invitation.discount_percentage}%</span>
                  </div>
                </div>
              )}
              <div>
                <span className="text-muted-foreground">{t("admin.inv.method")}</span>{" "}
                <span className="font-medium text-foreground capitalize">
                  {invitation.payment_method || t("admin.inv.na")}
                </span>
              </div>
              <div>
                <span className="text-muted-foreground">{t("admin.inv.status")}</span>{" "}
                <span
                  className={`font-medium capitalize ${
                    invitation.payment_status === "paid" ? "text-emerald-600" : "text-amber-600"
                  }`}
                >
                  {payStatusLabel}
                </span>
              </div>
            </div>

            {/* Payment Screenshot */}
            {invitation.payment_screenshot && (
              <div className="mt-3">
                <p className="text-sm font-medium text-foreground mb-2 flex items-center gap-1.5">
                  <ImageIcon className="w-4 h-4 text-muted-foreground" />
                  {t("admin.inv.paymentScreenshot")}
                </p>
                <div className="rounded-lg border border-border overflow-hidden bg-muted/30">
                  <img
                    src={invitation.payment_screenshot}
                    alt={t("admin.inv.screenshotAlt")}
                    className="w-full max-h-[400px] object-contain"
                  />
                </div>
              </div>
            )}
          </section>

          {/* Meta Info */}
          <section className="rounded-xl border border-border/50 p-4">
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs text-muted-foreground">
              <div className="flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5" />
                {t("admin.inv.created")}{" "}
                {invitation.created_at
                  ? new Date(invitation.created_at).toLocaleDateString()
                  : t("admin.inv.na")}
              </div>
              <div className="font-mono">
                {t("admin.inv.slug")} {invitation.slug}
              </div>
              <div>
                {t("admin.inv.id")} {invitation.id.slice(0, 8)}…
              </div>
            </div>
          </section>
        </div>

        {/* Footer actions */}
        <div className="sticky bottom-0 bg-card border-t border-border p-4 flex justify-end gap-3">
          {invitation.is_published && (
            <Link href={`/invite/${invitation.slug}`} target="_blank">
              <Button variant="outline" size="sm" className="gap-1.5">
                <ExternalLink className="w-3.5 h-3.5" />
                {t("admin.inv.viewInvitation")}
              </Button>
            </Link>
          )}
          <Button variant="outline" size="sm" onClick={onClose}>
            {t("admin.inv.close")}
          </Button>
        </div>
      </div>
    </div>
  )
}

export function AdminInvitations({ invitations }: { invitations: Invitation[] }) {
  const { t } = useSiteLanguage()
  const [list, setList] = useState(invitations)
  const [selectedInvitation, setSelectedInvitation] = useState<Invitation | null>(null)

  const paymentLabel = (status: string) =>
    status === "paid" ? t("admin.inv.paid") : t("admin.inv.unpaid")

  const toggleFinished = async (id: string, current: boolean) => {
    const res = await fetch(`/api/invitations/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        isFinished: !current,
      }),
    })
    if (res.ok) {
      setList((p) =>
        p.map((i) =>
          i.id === id ? { ...i, is_finished: !current } : i
        )
      )
      setSelectedInvitation((prev) =>
        prev && prev.id === id ? { ...prev, is_finished: !current } : prev
      )
    }
  }

  const deleteInv = async (id: string) => {
    if (!confirm(t("admin.table.deleteConfirm"))) return
    const res = await fetch(`/api/invitations/${id}`, { method: "DELETE" })
    if (res.ok) setList((p) => p.filter((i) => i.id !== id))
  }

  return (
    <>
      <div className="rounded-lg border overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-muted/50">
            <tr>
              <th className="text-left p-3">{t("admin.table.couple")}</th>
              <th className="text-left p-3">{t("admin.table.package")}</th>
              <th className="text-left p-3">{t("admin.th.currency")}</th>
              <th className="text-left p-3">{t("admin.table.status")}</th>
              <th className="text-left p-3">{t("admin.table.payment")}</th>
              <th className="text-left p-3">{t("admin.table.views")}</th>
              <th className="text-left p-3">{t("admin.table.actions")}</th>
            </tr>
          </thead>
          <tbody>
            {list.map((inv) => (
              <tr key={inv.id} className="border-t">
                <td className="p-3">
                  <div className="font-medium flex items-center gap-2">
                    <span>{inv.bride_name} & {inv.groom_name}</span>
                    {inv.is_finished && (
                      <CheckCircle2
                        className="w-10 h-10 text-emerald-600"
                        aria-label={t("admin.inv.finished")}
                      />
                    )}
                  </div>
                  <div className="text-xs text-muted-foreground font-mono">{inv.slug}</div>
                </td>
                <td className="p-3">
                  <span className="px-2 py-0.5 rounded text-xs bg-primary/10 text-primary font-medium capitalize">
                    {inv.package_name || "—"}
                  </span>
                </td>
                <td className="p-3 font-mono text-xs text-muted-foreground">
                  {inv.order_currency && isSiteCurrency(inv.order_currency)
                    ? getCurrencyMeta(inv.order_currency).short
                    : "—"}
                </td>
                <td className="p-3">
                  <span
                    className={`px-2 py-0.5 rounded text-xs ${
                      inv.is_published ? "bg-green-100 text-green-800" : "bg-gray-100"
                    }`}
                  >
                    {inv.is_published ? t("admin.inv.published") : t("admin.inv.draft")}
                  </span>
                </td>
                <td className="p-3">
                  <span
                    className={`px-2 py-0.5 rounded text-xs ${
                      inv.payment_status === "paid"
                        ? "bg-green-100 text-green-800"
                        : "bg-amber-100 text-amber-800"
                    }`}
                  >
                    {paymentLabel(inv.payment_status)}
                  </span>
                </td>
                <td className="p-3">{inv.view_count ?? 0}</td>
                <td className="p-3">
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-primary border-primary/30 hover:bg-primary/5"
                      onClick={() => setSelectedInvitation(inv)}
                    >
                      {t("admin.table.details")}
                    </Button>
                    {inv.is_published && (
                      <Link href={`/invite/${inv.slug}`} target="_blank">
                        <Button variant="outline" size="sm">
                          {t("admin.table.view")}
                        </Button>
                      </Link>
                    )}
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => toggleFinished(inv.id, Boolean(inv.is_finished))}
                    >
                      {inv.is_finished
                        ? t("admin.table.markNotFinished")
                        : t("admin.table.markFinished")}
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => deleteInv(inv.id)}
                    >
                      {t("admin.table.delete")}
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Details Modal */}
      {selectedInvitation && (
        <OrderDetailsModal
          invitation={selectedInvitation}
          onClose={() => setSelectedInvitation(null)}
        />
      )}
    </>
  )
}
