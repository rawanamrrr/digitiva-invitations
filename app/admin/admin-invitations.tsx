"use client"

import { useState, useEffect } from "react"
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
  Music,
  Heart,
  Info,
  Layers,
  MessageSquare,
  Download,
} from "lucide-react"

export type Invitation = {
  id: string
  bride_name: string
  groom_name: string
  event_type?: string | null
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
  background_image?: string | null
  small_invitation_image?: string | null
  personal_images?: string[] | null
  color_palette_text?: string | null
  color_palette_image?: string | null
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
  transport: "admin.sec.transport",
  giftList: "admin.sec.giftList",
}

const SECTION_ICONS: Record<string, any> = {
  countdown: Clock,
  venueMap: MapPin,
  handwrittenMessage: Mail,
  rsvp: CheckCircle2,
  photoUpload: ImageIcon,
  song: Music,
  messages: MessageSquare,
  ourStory: Heart,
  timeline: Clock,
  guestNotes: Info,
  dressCode: Palette,
  transport: MapPin,
  giftList: Package,
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
  const [sectionsData, setSectionsData] = useState<Record<string, any>>({})
  const [loadingSections, setLoadingSections] = useState(false)
  const template = templates.find((tmpl) => tmpl.id === invitation.template_id)

  useEffect(() => {
    const fetchSections = async () => {
      setLoadingSections(true)
      try {
        const res = await fetch(`/api/invitations/${invitation.id}/sections`)
        const data = await res.json()
        if (data.success && data.sections) {
          const mapped = data.sections.reduce((acc: any, curr: any) => {
            acc[curr.section_key] = curr.content
            return acc
          }, {})
          setSectionsData(mapped)
        }
      } catch (error) {
        console.error("Failed to fetch sections:", error)
      } finally {
        setLoadingSections(false)
      }
    }
    fetchSections()
  }, [invitation.id])

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

  const resolveSectionId = (labelOrId: string) => {
    // If it's already an ID in our data, return it
    if (sectionsData[labelOrId]) return labelOrId

    // Try to find the ID by matching the translated label
    const foundId = Object.keys(SECTION_ADMIN_KEYS).find(id => {
      const label = t(SECTION_ADMIN_KEYS[id])
      return label === labelOrId
    })
    
    // Hardcoded fallback for common English labels if translation fails
    if (!foundId) {
      const fallbacks: Record<string, string> = {
        "Our Story": "ourStory",
        "Gallery": "photoUpload",
        "Timeline": "timeline",
        "Venue map section": "venueMap",
        "Guest Notes": "guestNotes",
        "Dress Code": "dressCode",
        "Transport": "transport",
        "Gift List": "giftList",
        "RSVP": "rsvp",
        "Background music": "song",
        "Countdown timer": "countdown"
      }
      return fallbacks[labelOrId] || labelOrId
    }

    return foundId
  }

  const payStatusLabel =
    invitation.payment_status === "paid" ? t("admin.inv.paid") : t("admin.inv.unpaid")

  const renderSectionDetails = (sectionKey: string) => {
    const sectionId = resolveSectionId(sectionKey)
    const data = sectionsData[sectionId]
    if (!data) return null

    const entries = Object.entries(data).filter(([key, value]) => {
      if (value == null || value === "") return false
      return true
    })

    if (entries.length === 0) return null

    return (
      <div className="space-y-4">
        {entries.map(([key, value]) => {
          // Handle timeline events specifically
          if (key === "timeline_events" && Array.isArray(value)) {
            return (
              <div key={key} className="space-y-3">
                <div className="relative pl-6 space-y-4 before:absolute before:left-[11px] before:top-2 before:bottom-2 before:w-0.5 before:bg-primary/10">
                  {value.map((event: any, idx: number) => (
                    <div key={idx} className="relative">
                      <div className="absolute -left-[23px] top-1.5 w-4 h-4 rounded-full bg-primary/20 border-2 border-primary flex items-center justify-center">
                        <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                      </div>
                      <div className="bg-muted/30 p-3 rounded-xl border border-border/50 hover:border-primary/20 transition-colors">
                        <div className="flex justify-between items-baseline gap-2">
                          <h5 className="font-bold text-sm text-foreground">{event.title}</h5>
                          <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-primary/10 text-primary">
                            {event.time}
                          </span>
                        </div>
                        {event.description && (
                          <p className="mt-1.5 text-xs text-muted-foreground leading-relaxed">
                            {event.description}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )
          }

          // Handle gallery images
          if (key === "gallery_images" && Array.isArray(value)) {
            return (
              <div key={key} className="space-y-2">
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {value.map((url: string, idx: number) => (
                    <a
                      key={idx}
                      href={url}
                      target="_blank"
                      rel="noreferrer"
                      className="group relative aspect-square rounded-xl border border-border overflow-hidden bg-muted hover:ring-2 hover:ring-primary/50 transition-all shadow-sm"
                    >
                      <img src={url} alt="" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                      <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <ExternalLink className="w-5 h-5 text-white" />
                      </div>
                    </a>
                  ))}
                </div>
              </div>
            )
          }

          // Handle single URLs (like map links or music files)
          if (typeof value === "string" && (value.startsWith("http") || value.startsWith("/"))) {
            const isMusic = value.toLowerCase().match(/\.(mp3|wav|ogg)$/) || key.toLowerCase().includes('song') || key.toLowerCase().includes('music')
            
            return (
              <div key={key} className="bg-muted/20 p-3 rounded-xl border border-border/40">
                <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-2 flex items-center gap-1.5">
                  {isMusic ? <Music className="w-3 h-3" /> : <ExternalLink className="w-3 h-3" />}
                  {key.replace(/_/g, " ")}
                </p>
                <div className="flex items-center gap-3">
                  <a
                    href={value}
                    target="_blank"
                    rel="noreferrer"
                    className="text-xs text-primary font-medium hover:underline flex items-center gap-2 bg-primary/5 px-3 py-2 rounded-lg border border-primary/10 truncate flex-1"
                  >
                    <span className="truncate">{value}</span>
                    <ExternalLink className="w-3 h-3 shrink-0" />
                  </a>
                  {isMusic && (
                    <audio src={value} controls className="h-8 max-w-[120px]" />
                  )}
                </div>
              </div>
            )
          }

          // Default text/boolean/number rendering
          const isLongText = typeof value === "string" && value.length > 50

          return (
            <div
              key={key}
              className={`p-3 rounded-xl border border-border/40 ${isLongText ? "bg-muted/20" : "bg-card shadow-sm"}`}
            >
              <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-1">
                {key.replace(/_/g, " ")}
              </p>
              <p className={`text-xs text-foreground leading-relaxed ${isLongText ? "whitespace-pre-wrap italic text-muted-foreground" : "font-medium"}`}>
                {typeof value === "boolean" ? (
                  <span className={`inline-flex items-center gap-1.5 ${value ? "text-emerald-600" : "text-amber-600"}`}>
                    {value ? <CheckCircle2 className="w-3 h-3" /> : <AlertCircle className="w-3 h-3" />}
                    {value ? "Yes" : "No"}
                  </span>
                ) : (
                  String(value)
                )}
              </p>
            </div>
          )
        })}
      </div>
    )
  }

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

        <div className="p-6 space-y-6">
          {/* Top Status Bar - Summary style */}
          <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-2xl bg-muted/30 border border-border/50">
            <div className="flex flex-wrap gap-2">
              <span
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-tight ${
                  invitation.is_published
                    ? "bg-emerald-500/10 text-emerald-600 border border-emerald-500/20"
                    : "bg-amber-500/10 text-amber-600 border border-amber-500/20"
                }`}
              >
                {invitation.is_published ? (
                  <CheckCircle2 className="w-3 h-3" />
                ) : (
                  <AlertCircle className="w-3 h-3" />
                )}
                {invitation.is_published ? t("admin.inv.published") : t("admin.inv.draft")}
              </span>
              <span
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-tight ${
                  invitation.payment_status === "paid"
                    ? "bg-emerald-500/10 text-emerald-600 border border-emerald-500/20"
                    : "bg-amber-500/10 text-amber-600 border border-amber-500/20"
                }`}
              >
                <CreditCard className="w-3 h-3" />
                {payStatusLabel}
              </span>
              <span
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-tight ${
                  invitation.is_finished
                    ? "bg-blue-500/10 text-blue-600 border border-blue-500/20"
                    : "bg-gray-500/10 text-gray-600 border border-gray-500/20"
                }`}
              >
                <CheckCircle2 className="w-3 h-3" />
                {invitation.is_finished ? t("admin.inv.finished") : t("admin.inv.notFinished")}
              </span>
            </div>
            <div className="flex items-center gap-4 text-xs font-medium text-muted-foreground">
              <div className="flex items-center gap-1.5">
                <Eye className="w-3.5 h-3.5" />
                <span>{invitation.view_count ?? 0} {t("admin.inv.views")}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5" />
                <span>{invitation.created_at ? new Date(invitation.created_at).toLocaleDateString() : t("admin.inv.na")}</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Left Column: Core Info */}
            <div className="space-y-6">
              {/* Event Details Card */}
              <section className="bg-card rounded-2xl border border-border shadow-sm overflow-hidden">
                <div className="p-4 border-b border-border/50 bg-muted/5 flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                    <Calendar className="w-4 h-4" />
                  </div>
                  <h3 className="text-xs font-bold uppercase tracking-widest text-foreground">
                    {t("admin.inv.eventDetails")}
                  </h3>
                </div>
                <div className="p-5 space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <p className="text-[10px] font-bold uppercase text-muted-foreground tracking-widest">{t("admin.inv.bride")}</p>
                      <p className="text-sm font-semibold text-foreground">{invitation.bride_name}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-[10px] font-bold uppercase text-muted-foreground tracking-widest">{t("admin.inv.groom")}</p>
                      <p className="text-sm font-semibold text-foreground">{invitation.groom_name}</p>
                    </div>
                  </div>
                  <div className="space-y-1 pt-2 border-t border-border/40">
                    <p className="text-[10px] font-bold uppercase text-muted-foreground tracking-widest">{t("create.label.eventType")}</p>
                    <p className="text-sm font-medium text-foreground capitalize">{invitation.event_type || t("admin.inv.na")}</p>
                  </div>
                  <div className="grid grid-cols-2 gap-4 pt-2 border-t border-border/40">
                    <div className="space-y-1">
                      <p className="text-[10px] font-bold uppercase text-muted-foreground tracking-widest">{t("admin.inv.date")}</p>
                      <p className="text-sm font-medium text-foreground">
                        {invitation.event_date ? new Date(invitation.event_date).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" }) : t("admin.inv.na")}
                      </p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-[10px] font-bold uppercase text-muted-foreground tracking-widest">{t("admin.inv.time")}</p>
                      <p className="text-sm font-medium text-foreground">{invitation.event_time || t("admin.inv.na")}</p>
                    </div>
                  </div>
                  {(invitation.venue || invitation.venue_address) && (
                    <div className="space-y-2 pt-2 border-t border-border/40">
                      <p className="text-[10px] font-bold uppercase text-muted-foreground tracking-widest flex items-center gap-1.5">
                        <MapPin className="w-3 h-3" /> {t("create.label.venue")}
                      </p>
                      <div>
                        <p className="text-sm font-semibold text-foreground">{invitation.venue}</p>
                        <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">{invitation.venue_address}</p>
                        {invitation.venue_map_url && (
                          <a
                            href={invitation.venue_map_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 text-[10px] font-bold text-primary hover:underline mt-2 bg-primary/5 px-2 py-1 rounded-md"
                          >
                            {t("admin.inv.viewMap")} <ExternalLink className="w-2.5 h-2.5" />
                          </a>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </section>

              {/* Design & Package Card */}
              <section className="bg-card rounded-2xl border border-border shadow-sm overflow-hidden">
                <div className="p-4 border-b border-border/50 bg-muted/5 flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-indigo-500/10 flex items-center justify-center text-indigo-600">
                    <Palette className="w-4 h-4" />
                  </div>
                  <h3 className="text-xs font-bold uppercase tracking-widest text-foreground">
                    {t("admin.inv.design")}
                  </h3>
                </div>
                <div className="p-5 space-y-5">
                  {template ? (
                    <div className="flex items-start gap-4 p-3 rounded-xl bg-muted/20 border border-border/50">
                      <div className="w-20 h-24 rounded-lg overflow-hidden border border-border shadow-sm shrink-0">
                        {template.image.endsWith(".mp4") ? (
                          <video src={template.image} className="w-full h-full object-cover" muted playsInline />
                        ) : (
                          <img src={template.image} alt={template.name} className="w-full h-full object-cover" />
                        )}
                      </div>
                      <div className="space-y-1 py-1">
                        <p className="text-[10px] font-bold text-primary uppercase tracking-tight">{template.category}</p>
                        <p className="text-sm font-bold text-foreground">{template.name}</p>
                        <p className="text-[11px] text-muted-foreground leading-relaxed line-clamp-2">{template.description}</p>
                      </div>
                    </div>
                  ) : (
                    <p className="text-xs text-muted-foreground italic">{t("admin.inv.templateId")} {invitation.template_id}</p>
                  )}

                  <div className="grid grid-cols-2 gap-4 pt-2">
                    <div className="space-y-1">
                      <p className="text-[10px] font-bold uppercase text-muted-foreground tracking-widest">{t("admin.inv.package")}</p>
                      <p className="text-xs font-bold text-indigo-600 bg-indigo-50 px-2 py-1 rounded inline-block uppercase tracking-tight">
                        {invitation.package_name || "Custom"}
                      </p>
                    </div>
                    {invitation.custom_theme_color && (
                      <div className="space-y-1">
                        <p className="text-[10px] font-bold uppercase text-muted-foreground tracking-widest">{t("admin.inv.customColor")}</p>
                        <div className="flex items-center gap-2">
                          <div className="w-4 h-4 rounded-full border border-black/10" style={{ backgroundColor: invitation.custom_theme_color }} />
                          <span className="text-[11px] font-mono font-medium">{invitation.custom_theme_color.toUpperCase()}</span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </section>
            </div>

            {/* Right Column: Payments & Multimedia */}
            <div className="space-y-6">
              {/* Contact Information Card */}
              <section className="bg-card rounded-2xl border border-border shadow-sm overflow-hidden">
                <div className="p-4 border-b border-border/50 bg-muted/5 flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-teal-500/10 flex items-center justify-center text-teal-600">
                    <User className="w-4 h-4" />
                  </div>
                  <h3 className="text-xs font-bold uppercase tracking-widest text-foreground">
                    {t("admin.inv.contact")}
                  </h3>
                </div>
                <div className="p-5 space-y-4">
                  <div className="space-y-3">
                    {invitation.email && (
                      <div className="flex items-center justify-between group">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center group-hover:bg-primary/5 transition-colors">
                            <Mail className="w-3.5 h-3.5 text-muted-foreground" />
                          </div>
                          <div>
                            <p className="text-[10px] font-bold uppercase text-muted-foreground tracking-widest leading-none mb-1">Email</p>
                            <p className="text-sm font-medium text-foreground break-all">{invitation.email}</p>
                          </div>
                        </div>
                        <a href={`mailto:${invitation.email}`} className="p-2 rounded-lg hover:bg-muted text-muted-foreground hover:text-primary transition-colors">
                          <ExternalLink className="w-4 h-4" />
                        </a>
                      </div>
                    )}
                    {invitation.whatsapp && (
                      <div className="flex items-center justify-between group">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center group-hover:bg-emerald-500/5 transition-colors">
                            <Phone className="w-3.5 h-3.5 text-muted-foreground" />
                          </div>
                          <div>
                            <p className="text-[10px] font-bold uppercase text-muted-foreground tracking-widest leading-none mb-1">WhatsApp</p>
                            <p className="text-sm font-medium text-foreground">{invitation.whatsapp}</p>
                          </div>
                        </div>
                        <a href={`https://wa.me/${invitation.whatsapp.replace(/\+/g, '')}`} target="_blank" rel="noreferrer" className="p-2 rounded-lg hover:bg-muted text-muted-foreground hover:text-emerald-600 transition-colors">
                          <MessageSquare className="w-4 h-4" />
                        </a>
                      </div>
                    )}
                  </div>
                </div>
              </section>

              {/* Payment Details Card */}
              <section className="bg-card rounded-2xl border border-border shadow-sm overflow-hidden">
                <div className="p-4 border-b border-border/50 bg-muted/5 flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-600">
                    <CreditCard className="w-4 h-4" />
                  </div>
                  <h3 className="text-xs font-bold uppercase tracking-widest text-foreground">
                    {t("admin.inv.paymentDetails")}
                  </h3>
                </div>
                <div className="p-5 space-y-5">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <p className="text-[10px] font-bold uppercase text-muted-foreground tracking-widest">{t("admin.inv.orderTotal")}</p>
                      <p className="text-lg font-bold text-foreground">
                        {orderTotalDisplay} <span className="text-[10px] text-muted-foreground uppercase">{invitation.order_currency}</span>
                      </p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-[10px] font-bold uppercase text-muted-foreground tracking-widest">{t("admin.inv.method")}</p>
                      <p className="text-sm font-semibold text-foreground capitalize">{invitation.payment_method || t("admin.inv.na")}</p>
                    </div>
                  </div>

                  {invitation.discount_code && (
                    <div className="p-3 rounded-xl bg-emerald-500/5 border border-emerald-500/10 flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <Package className="w-4 h-4 text-emerald-600" />
                        <div>
                          <p className="text-[9px] font-bold uppercase text-emerald-600 tracking-widest leading-none mb-0.5">Discount Applied</p>
                          <p className="text-xs font-bold font-mono text-emerald-700">{invitation.discount_code}</p>
                        </div>
                      </div>
                      <span className="text-sm font-black text-emerald-600">-{invitation.discount_percentage}%</span>
                    </div>
                  )}

                  {invitation.payment_screenshot && (
                    <div className="space-y-3 pt-2 border-t border-border/40">
                      <div className="flex items-center justify-between">
                        <p className="text-[10px] font-bold uppercase text-muted-foreground tracking-widest">{t("admin.inv.paymentScreenshot")}</p>
                        <a href={invitation.payment_screenshot} target="_blank" rel="noreferrer" className="text-[10px] font-bold text-primary flex items-center gap-1 hover:underline">
                          <ExternalLink className="w-3 h-3" /> {t("admin.table.view")}
                        </a>
                      </div>
                      <div className="aspect-video rounded-xl border border-border/50 overflow-hidden bg-muted group relative">
                        <img src={invitation.payment_screenshot} alt="Payment" className="w-full h-full object-cover transition-transform group-hover:scale-105" />
                        <a 
                          href={invitation.payment_screenshot} 
                          download={`payment-${invitation.id.slice(0,8)}.jpg`}
                          className="absolute bottom-2 right-2 p-2 rounded-lg bg-black/60 text-white hover:bg-black transition-colors opacity-0 group-hover:opacity-100"
                        >
                          <Download className="w-4 h-4" />
                        </a>
                      </div>
                    </div>
                  )}
                </div>
              </section>
            </div>
          </div>

          {/* Sections & Multimedia - Full Width Sections */}
          <div className="space-y-8 pt-4">
            {/* Custom Media Section (If any exist) */}
            {(invitation.background_image || invitation.small_invitation_image || (invitation.personal_images && invitation.personal_images.length > 0)) && (
              <section className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="h-px flex-1 bg-border/60" />
                  <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/60">{t("admin.inv.multimedia")}</h3>
                  <div className="h-px flex-1 bg-border/60" />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Background Image Preview */}
                  {invitation.background_image && (
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <h4 className="text-xs font-bold text-foreground flex items-center gap-2">
                          <ImageIcon className="w-3.5 h-3.5 text-muted-foreground" />
                          {t("admin.inv.bgImage")}
                        </h4>
                        <div className="flex gap-2">
                          <a href={invitation.background_image} target="_blank" rel="noreferrer" className="p-1.5 rounded-md hover:bg-muted text-primary"><ExternalLink className="w-3.5 h-3.5" /></a>
                          <a href={invitation.background_image} download={`bg-${invitation.slug}.jpg`} className="p-1.5 rounded-md hover:bg-muted text-primary"><Download className="w-3.5 h-3.5" /></a>
                        </div>
                      </div>
                      <div className="rounded-2xl border border-border overflow-hidden bg-muted/30 shadow-sm aspect-[16/9] md:aspect-auto md:h-60 relative group">
                        <img src={invitation.background_image} alt="Background" className="w-full h-full object-contain" />
                        <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity" />
                      </div>
                    </div>
                  )}

                  {/* Small Image Preview */}
                  {invitation.small_invitation_image && (
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <h4 className="text-xs font-bold text-foreground flex items-center gap-2">
                          <ImageIcon className="w-3.5 h-3.5 text-muted-foreground" />
                          {t("admin.inv.smallImage")}
                        </h4>
                        <div className="flex gap-2">
                          <a href={invitation.small_invitation_image} target="_blank" rel="noreferrer" className="p-1.5 rounded-md hover:bg-muted text-primary"><ExternalLink className="w-3.5 h-3.5" /></a>
                          <a href={invitation.small_invitation_image} download={`small-${invitation.slug}.jpg`} className="p-1.5 rounded-md hover:bg-muted text-primary"><Download className="w-3.5 h-3.5" /></a>
                        </div>
                      </div>
                      <div className="rounded-2xl border border-border overflow-hidden bg-muted/30 shadow-sm aspect-square md:h-60 mx-auto group relative">
                        <img src={invitation.small_invitation_image} alt="Small" className="w-full h-full object-contain p-4" />
                        <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity" />
                      </div>
                    </div>
                  )}
                </div>

                {/* Personal Images Grid */}
                {invitation.personal_images && invitation.personal_images.length > 0 && (
                  <div className="space-y-3 pt-2">
                    <h4 className="text-xs font-bold text-foreground flex items-center gap-2">
                      <ImageIcon className="w-3.5 h-3.5 text-muted-foreground" />
                      {t("admin.inv.personalImages")}
                    </h4>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {invitation.personal_images.map((url, idx) => (
                        <div key={idx} className="group relative aspect-square rounded-2xl border border-border overflow-hidden shadow-sm hover:shadow-md transition-all">
                          <img src={url} alt={`Personal ${idx + 1}`} className="w-full h-full object-cover transition-transform group-hover:scale-110" />
                          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                            <a href={url} target="_blank" rel="noreferrer" className="p-2 rounded-full bg-white text-primary hover:scale-110 transition-transform"><ExternalLink className="w-4 h-4" /></a>
                            <a href={url} download={`personal-${invitation.slug}-${idx+1}.jpg`} className="p-2 rounded-full bg-white text-primary hover:scale-110 transition-transform"><Download className="w-4 h-4" /></a>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </section>
            )}

            {/* Color Palette Section */}
            {(invitation.color_palette_text || invitation.color_palette_image) && (
              <section className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="h-px flex-1 bg-border/60" />
                  <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/60">{t("admin.inv.colorPalette")}</h3>
                  <div className="h-px flex-1 bg-border/60" />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
                  {invitation.color_palette_text && (
                    <div className="p-5 rounded-2xl bg-card border border-border shadow-sm space-y-3">
                      <p className="text-[10px] font-bold uppercase text-muted-foreground tracking-widest">{t("admin.inv.colorPalette")}</p>
                      <p className="text-sm text-foreground leading-relaxed italic">"{invitation.color_palette_text}"</p>
                      <div className="flex flex-wrap gap-2 pt-2">
                        {invitation.color_palette_text.split(',').map((c, i) => {
                          const val = c.trim();
                          if (!val.startsWith('#')) return null;
                          return <div key={i} className="w-8 h-8 rounded-full border border-black/10 shadow-sm" style={{ backgroundColor: val }} title={val} />;
                        })}
                      </div>
                    </div>
                  )}
                  {invitation.color_palette_image && (
                    <div className="space-y-3">
                      <div className="flex items-center justify-between px-1">
                        <p className="text-[10px] font-bold uppercase text-muted-foreground tracking-widest">{t("admin.inv.colorPaletteImage")}</p>
                        <a href={invitation.color_palette_image} download={`palette-${invitation.slug}.jpg`} className="text-[10px] font-bold text-primary flex items-center gap-1 hover:underline">
                          <Download className="w-3 h-3" /> {t("common.download")}
                        </a>
                      </div>
                      <div className="rounded-2xl border border-border overflow-hidden bg-muted/30 shadow-sm h-40 group relative">
                        <img src={invitation.color_palette_image} alt="Palette" className="w-full h-full object-contain p-4" />
                        <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                           <ExternalLink className="w-5 h-5 text-white" />
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </section>
            )}

            {/* Event Sections (Countdown, RSVP, Story, etc.) */}
            {invitation.sections && invitation.sections.length > 0 && (
              <section className="space-y-6">
                <div className="flex items-center gap-3">
                  <div className="h-px flex-1 bg-border/60" />
                  <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/60">{t("create.sections.title")}</h3>
                  <div className="h-px flex-1 bg-border/60" />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {invitation.sections.map((section) => {
                    const sectionId = resolveSectionId(section)
                    const Icon = SECTION_ICONS[sectionId] || Package
                    const hasData = sectionsData[sectionId] && Object.entries(sectionsData[sectionId]).some(([k,v]) => v != null && v !== "")

                    return (
                      <div
                        key={section}
                        className={`rounded-2xl border transition-all duration-300 overflow-hidden ${
                          hasData 
                            ? "bg-card border-border shadow-sm hover:shadow-md hover:border-primary/20" 
                            : "bg-muted/20 border-dashed border-border/60 opacity-60"
                        }`}
                      >
                        <div className="flex items-center gap-3 p-3 border-b border-border/40 bg-muted/10">
                          <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${hasData ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"}`}>
                            <Icon className="w-4 h-4" />
                          </div>
                          <h4 className="text-[11px] font-bold text-foreground uppercase tracking-wider">
                            {sectionLabel(section)}
                          </h4>
                          {!hasData && !loadingSections && (
                            <span className="ml-auto text-[9px] font-medium text-muted-foreground bg-muted px-1.5 py-0.5 rounded italic">Empty</span>
                          )}
                        </div>
                        
                        <div className="p-4">
                          {loadingSections ? (
                            <div className="flex items-center gap-2 text-[10px] text-muted-foreground animate-pulse">
                              <Clock className="w-3 h-3" /> {t("common.loading")}...
                            </div>
                          ) : (
                            renderSectionDetails(section) || (
                              <p className="text-[10px] text-muted-foreground italic">No details provided.</p>
                            )
                          )}
                        </div>
                      </div>
                    )
                  })}
                </div>
              </section>
            )}

            {/* Extras Section */}
            {invitation.extras && invitation.extras.length > 0 && (
              <section className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="h-px flex-1 bg-border/60" />
                  <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/60">{t("admin.inv.selectedExtras")}</h3>
                  <div className="h-px flex-1 bg-border/60" />
                </div>
                <div className="flex flex-wrap gap-2 justify-center">
                  {invitation.extras.map((extra) => (
                    <span
                      key={extra}
                      className="px-4 py-2 rounded-2xl bg-orange-500/5 text-orange-600 text-[11px] font-bold border border-orange-500/20 shadow-sm flex items-center gap-2 group hover:bg-orange-500/10 transition-colors"
                    >
                      <Heart className="w-3 h-3 group-hover:scale-125 transition-transform" />
                      {extraLabel(extra)}
                    </span>
                  ))}
                </div>
              </section>
            )}
          </div>

          {/* Technical Meta Info Footer */}
          <footer className="mt-8 pt-6 border-t border-border/40">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-4 rounded-xl bg-muted/10 border border-border/30 text-[10px] font-mono text-muted-foreground/70 uppercase tracking-tighter">
              <div className="flex items-center gap-2">
                <Clock className="w-3 h-3" />
                {t("admin.inv.created")}: {invitation.created_at ? new Date(invitation.created_at).toLocaleString() : "N/A"}
              </div>
              <div className="flex items-center gap-2 truncate">
                <Info className="w-3 h-3 shrink-0" />
                {t("admin.inv.slug")}: <span className="text-foreground select-all">{invitation.slug}</span>
              </div>
              <div className="flex items-center gap-2">
                <X className="w-3 h-3 shrink-0" />
                {t("admin.inv.id")}: <span className="text-foreground select-all">{invitation.id}</span>
              </div>
            </div>
          </footer>
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
                    {inv.package_name === "standard" ? t("pkg.std.name") : 
                     inv.package_name === "premium" ? t("pkg.prem.name") : 
                     inv.package_name === "custom" ? t("pkg.cust.name") : 
                     (inv.package_name || "—")}
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
