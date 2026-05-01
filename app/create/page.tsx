"use client"

import { useState, useEffect, Suspense, useMemo, useRef } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { countries } from "@/utils/countries"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Check,
  CreditCard,
  Upload,
  Smartphone,
  Landmark,
  ArrowLeft,
  ExternalLink,
  Clock,
  MapPin,
  MessageSquare,
  ClipboardList,
  Image as ImageIcon,
  Music,
  Heart,
  HelpCircle,
  ArrowRight,
  CheckCircle2,
  Globe,
  Zap,
  Video,
  PenTool,
  Calendar,
  NotebookPen,
  Shirt,
  Instagram,
  Mail,
  MessageCircle,
  Download,
  Plus,
  Bus,
  Gift,
  Crown,
  X,
  Palette,
  Trash2,
} from "lucide-react"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { templates } from "@/lib/templates"
import { useSiteCurrency } from "@/contexts/SiteCurrencyContext"
import { useSiteLanguage } from "@/contexts/SiteLanguageContext"
import { createClient } from "@/lib/supabase/client"
import { SITE_LOCALES, type SiteLocale } from "@/lib/site-locales"
import { PRICING_MAP, type PriceRates } from "@/lib/pricing"
import { DynamicFormContainer } from "@/components/dynamic-form/DynamicFormContainer"
import { useDynamicSections } from "@/hooks/use-dynamic-sections"

type PackageId = "standard" | "premium" | "custom"

const EXTRA_DEFS_BASE = [
  { id: "extra_month", priceKey: "extraMonth", icon: Clock },
  { id: "custom_domain", priceKey: "customDomain", icon: Globe },
  { id: "express_delivery", priceKey: "extraSection", icon: Zap },
] as const

const PACKAGE_LIMITS = {
  standard: 3,
  premium: 7,
  custom: 0,
}

const INCLUDED_LANGUAGES: Record<PackageId, number> = {
  standard: 1,
  premium: 2,
  custom: 0,
}

const SECTION_IDS = [
  "countdown",
  "venueMap",
  "messages",
  "ourStory",
  "timeline",
  "guestNotes",
  "dressCode",
  "rsvp",
  "photoUpload",
  "song",
  "transport",
  "giftList",
] as const

const PACKAGE_CORE_SECTIONS: Record<PackageId, string[]> = {
  standard: ["countdown", "venueMap", "messages"],
  premium: [
    "countdown",
    "venueMap",
    "messages",
    "ourStory",
    "timeline",
    "guestNotes",
    "dressCode",
  ],
  custom: [],
}

function CreateInvitationContent() {
  const { t } = useSiteLanguage()
  const { currencyShort, currency } = useSiteCurrency()
  const router = useRouter()
  const searchParams = useSearchParams()

  const pricingRates = PRICING_MAP[currency] || PRICING_MAP.egp

  const allSections = useMemo(
    () =>
      SECTION_IDS.map((id) => ({
        id,
        label: t(`create.sec.${id}`),
      })),
    [t],
  )

  const extras = useMemo(
    () =>
      EXTRA_DEFS_BASE.map((e) => ({
        ...e,
        price: pricingRates[e.priceKey as keyof PriceRates],
        label: t(`create.extra.${e.id}`),
        description: t(`create.extra.${e.id}.desc`),
      })),
    [t, pricingRates],
  )

  const packageSections = useMemo(
    (): Record<
      PackageId,
      { label: string; price: number; description: string; sections: string[] }
    > => ({
      standard: {
        label: t("pkg.std.name"),
        price: pricingRates.standard,
        description: t("create.pkg.standard.desc"),
        sections: PACKAGE_CORE_SECTIONS.standard,
      },
      premium: {
        label: t("pkg.prem.name"),
        price: pricingRates.premium,
        description: t("create.pkg.premium.desc"),
        sections: PACKAGE_CORE_SECTIONS.premium,
      },
      custom: {
        label: t("pkg.cust.name"),
        price: pricingRates.custom_package,
        description: t("create.pkg.custom.desc"),
        sections: PACKAGE_CORE_SECTIONS.custom,
      },
    }),
    [t, pricingRates],
  )

  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [selectedPackage, setSelectedPackage] = useState<PackageId>("standard")
  const [selectedSections, setSelectedSections] = useState<string[]>([])
  const [selectedExtras, setSelectedExtras] = useState<string[]>([])
  const [customSections, setCustomSections] = useState<{ id: string; label: string }[]>([])
  const [customBlockLabel, setCustomBlockLabel] = useState("")
  const [selectedLanguages, setSelectedLanguages] = useState<SiteLocale[]>(["en"])
  const [requestedLanguage, setRequestedLanguage] = useState("")
  const [customLanguages, setCustomLanguages] = useState<string[]>([])
  const [paymentMethod, setPaymentMethod] = useState<
    "bank" | "instapay" | "vodafone_cash"
  >("instapay")
  const [paymentScreenshot, setPaymentScreenshot] = useState<File | null>(null)
  const [bgImage, setBgImage] = useState<File | null>(null)
  const [smallImage, setSmallImage] = useState<File | null>(null)
  const [personalImages, setPersonalImages] = useState<File[]>([])
  const [colorPaletteImage, setColorPaletteImage] = useState<File | null>(null)
  const [colorPaletteText, setColorPaletteText] = useState("")
  const [tempColor, setTempColor] = useState("#000000")

  const [discountCodeInput, setDiscountCodeInput] = useState("")
  const [appliedDiscount, setAppliedDiscount] = useState<{ code: string; percentage: number } | null>(null)
  const [discountError, setDiscountError] = useState("")
  const [applyingDiscount, setApplyingDiscount] = useState(false)

  const whatsappNumbers = useMemo(() => ["201024285771", "201014924924", "201028807788"], [])
  const [randomWhatsapp, setRandomWhatsapp] = useState("")

  const {
    sectionsData,
    errors: sectionErrors,
    updateSectionData,
    validateSections,
    clearSectionData,
    hasErrors: hasSectionErrors,
  } = useDynamicSections()

  useEffect(() => {
    const randomIndex = Math.floor(Math.random() * whatsappNumbers.length)
    setRandomWhatsapp(whatsappNumbers[randomIndex])
  }, [whatsappNumbers])

  const [form, setForm] = useState({
    brideName: "",
    groomName: "",
    eventType: "",
    eventDate: "",
    eventTime: "",
    venue: "",
    email: "",
    whatsapp: "",
    countryCode: "+20",
    templateId: searchParams.get("template") || "",
  })

  const [errors, setErrors] = useState<{ email?: string; whatsapp?: string }>({})

  const todayStr = useMemo(() => {
    const d = new Date()
    return d.toISOString().split("T")[0]
  }, [])

  const validateStep2 = () => {
    const newErrors: { email?: string; whatsapp?: string } = {}

    // Email validation
    if (!form.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      newErrors.email = t("create.err.email")
    }

    if (!form.whatsapp || form.whatsapp.length < 6) {
      newErrors.whatsapp = t("create.err.whatsapp")
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const isStep2Valid =
    Boolean(form.email) &&
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email) &&
    Boolean(form.whatsapp) &&
    form.whatsapp.length >= 6

  const update = (k: keyof typeof form, v: string) => {
    setForm((p) => ({ ...p, [k]: v }))
    // Clear error when user types
    if (errors[k as keyof typeof errors]) {
      setErrors(prev => ({ ...prev, [k]: undefined }))
    }
  }

  const handlePackageChange = (pkg: PackageId) => {
    setSelectedPackage(pkg)
    setSelectedSections([])
    setSelectedLanguages((prev) => {
      const included = INCLUDED_LANGUAGES[pkg]
      if (included <= 0) return prev
      const next = prev.length ? prev : (["en"] as SiteLocale[])
      return next.slice(0, Math.max(1, included))
    })
  }

  const didInitPackageFromUrl = useRef(false)

  useEffect(() => {
    if (didInitPackageFromUrl.current) return
    const p = searchParams.get("package")
    if (p === "standard" || p === "premium" || p === "custom") {
      const next = p as PackageId
      if (next !== selectedPackage) {
        handlePackageChange(next)
      }
    }
    didInitPackageFromUrl.current = true
  }, [searchParams, selectedPackage])

  const toggleSection = (id: string) => {
    setSelectedSections((prev) => {
      const isRemoving = prev.includes(id)
      if (isRemoving) {
        clearSectionData(id)
      }
      return isRemoving ? prev.filter((s) => s !== id) : [...prev, id]
    })
  }

  const uploadSectionFiles = async (
    sectionsData: Record<string, Record<string, any>>
  ): Promise<Record<string, Record<string, any>>> => {
    const supabase = createClient()
    const prepared: Record<string, Record<string, any>> = {}

    for (const [sectionKey, content] of Object.entries(sectionsData)) {
      const preparedContent: Record<string, any> = {}

      for (const [key, value] of Object.entries(content)) {
        // Handle single file
        if (value instanceof File) {
          const path = `sections/${sectionKey}/${Date.now()}_${value.name}`
          const { data, error } = await supabase.storage
            .from("uploads")
            .upload(path, value)

          if (!error && data) {
            const { data: urlData } = supabase.storage
              .from("uploads")
              .getPublicUrl(path)
            preparedContent[key] = urlData.publicUrl
          } else {
            console.error(`Failed to upload ${key}:`, error)
            preparedContent[key] = null
          }
        }
        // Handle file array
        else if (Array.isArray(value) && value.length > 0 && value[0] instanceof File) {
          const urls = await Promise.all(
            value.map(async (file: File, idx: number) => {
              const path = `sections/${sectionKey}/${Date.now()}_${idx}_${file.name}`
              const { data, error } = await supabase.storage
                .from("uploads")
                .upload(path, file)

              if (!error && data) {
                const { data: urlData } = supabase.storage
                  .from("uploads")
                  .getPublicUrl(path)
                return urlData.publicUrl
              }
              return null
            })
          )
          preparedContent[key] = urls.filter(Boolean)
        }
        // Regular values
        else {
          preparedContent[key] = value
        }
      }

      prepared[sectionKey] = preparedContent
    }

    return prepared
  }

  const handlePublish = async () => {
    setLoading(true)
    try {
      // Validate dynamic sections
      if (!validateSections(selectedSections)) {
        alert(t("create.err.sections"))
        setLoading(false)
        return
      }

      // Upload section files
      const preparedSections = await uploadSectionFiles(sectionsData)

      // Prepare labels synchronously (instant)
      const sectionLabels = [...selectedSections]

      const extraLabels = selectedExtras.map((id) => {
        return extras.find((e) => e.id === id)?.label || id
      })

      const selectedLanguageLabels = selectedLanguages
        .map((code) => SITE_LOCALES.find((l) => l.code === code)?.label)
        .filter(Boolean)
        .map((label) => `${t("create.lang.labelPrefix")}: ${label}`)

      const customLanguageLabels = customLanguages.map(
        (l) => `${t("create.lang.customLabelPrefix")}: ${l}`,
      )

      const extraLabelsWithLanguageRequest = requestedLanguage.trim()
        ? [
          ...extraLabels,
          ...selectedLanguageLabels,
          ...customLanguageLabels,
          `${t("create.lang.requestedLabelPrefix")}: ${requestedLanguage.trim()}`,
        ]
        : [...extraLabels, ...selectedLanguageLabels, ...customLanguageLabels]

      // Step 1: Start the upload process (if screenshot or bgImage exists)
      const uploadPromise = paymentScreenshot
        ? (async () => {
          const uploadPrepRes = await fetch("/api/upload", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              filename: paymentScreenshot.name,
              contentType: paymentScreenshot.type
            })
          })
          const uploadPrepData = await uploadPrepRes.json()
          if (!uploadPrepRes.ok) throw new Error(uploadPrepData.error || t("create.publish.error.upload"))

          const supabase = createClient()
          const { error: uploadError } = await supabase.storage
            .from("uploads")
            .uploadToSignedUrl(uploadPrepData.path, uploadPrepData.token, paymentScreenshot)

          if (uploadError) throw new Error(uploadError.message || t("create.publish.error.upload"))
          return uploadPrepData.url as string
        })()
        : Promise.resolve("")

      const bgUploadPromise = bgImage
        ? (async () => {
          const uploadPrepRes = await fetch("/api/upload", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              filename: bgImage.name,
              contentType: bgImage.type
            })
          })
          const uploadPrepData = await uploadPrepRes.json()
          if (!uploadPrepRes.ok) throw new Error(uploadPrepData.error || t("create.publish.error.upload"))

          const supabase = createClient()
          const { error: uploadError } = await supabase.storage
            .from("uploads")
            .uploadToSignedUrl(uploadPrepData.path, uploadPrepData.token, bgImage)

          if (uploadError) throw new Error(uploadError.message || t("create.publish.error.upload"))
          return uploadPrepData.url as string
        })()
        : Promise.resolve("")

      const smallImageUploadPromise = smallImage
        ? (async () => {
          const uploadPrepRes = await fetch("/api/upload", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              filename: smallImage.name,
              contentType: smallImage.type
            })
          })
          const uploadPrepData = await uploadPrepRes.json()
          if (!uploadPrepRes.ok) throw new Error(uploadPrepData.error || t("create.publish.error.upload"))

          const supabase = createClient()
          const { error: uploadError } = await supabase.storage
            .from("uploads")
            .uploadToSignedUrl(uploadPrepData.path, uploadPrepData.token, smallImage)

          if (uploadError) throw new Error(uploadError.message || t("create.publish.error.upload"))
          return uploadPrepData.url as string
        })()
        : Promise.resolve("")

      const personalImagesUploadPromise = personalImages.length > 0
        ? Promise.all(personalImages.map(async (file) => {
          const uploadPrepRes = await fetch("/api/upload", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              filename: file.name,
              contentType: file.type
            })
          })
          const uploadPrepData = await uploadPrepRes.json()
          if (!uploadPrepRes.ok) throw new Error(uploadPrepData.error || t("create.publish.error.upload"))

          const supabase = createClient()
          const { error: uploadError } = await supabase.storage
            .from("uploads")
            .uploadToSignedUrl(uploadPrepData.path, uploadPrepData.token, file)

          if (uploadError) throw new Error(uploadError.message || t("create.publish.error.upload"))
          return uploadPrepData.url as string
        }))
        : Promise.resolve([])

      const colorPaletteImageUploadPromise = colorPaletteImage
        ? (async () => {
          const uploadPrepRes = await fetch("/api/upload", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              filename: colorPaletteImage.name,
              contentType: colorPaletteImage.type
            })
          })
          const uploadPrepData = await uploadPrepRes.json()
          if (!uploadPrepRes.ok) throw new Error(uploadPrepData.error || t("create.publish.error.upload"))

          const supabase = createClient()
          const { error: uploadError } = await supabase.storage
            .from("uploads")
            .uploadToSignedUrl(uploadPrepData.path, uploadPrepData.token, colorPaletteImage)

          if (uploadError) throw new Error(uploadError.message || t("create.publish.error.upload"))
          return uploadPrepData.url as string
        })()
        : Promise.resolve("")

      const [screenshotUrl, bgImageUrl, smallImageUrl, personalImageUrls, colorPaletteImageUrl] = await Promise.all([
        uploadPromise,
        bgUploadPromise,
        smallImageUploadPromise,
        personalImagesUploadPromise,
        colorPaletteImageUploadPromise
      ])

      const invitationPayload = {
        brideName: form.brideName,
        groomName: form.groomName,
        eventType: form.eventType,
        eventDate: form.eventDate,
        eventTime: form.eventTime,
        venue: form.venue,
        templateId: form.templateId,
        packageName: selectedPackage,
        sections: sectionLabels,
        extras: extraLabelsWithLanguageRequest,
        email: form.email || null,
        whatsapp: `${form.countryCode}${form.whatsapp}`,
        paymentMethod,
        paymentScreenshot: screenshotUrl,
        backgroundImage: bgImageUrl,
        smallInvitationImage: smallImageUrl,
        personalImages: personalImageUrls,
        colorPaletteText,
        colorPaletteImage: colorPaletteImageUrl,
        orderCurrency: currency,
        orderTotal: totalPrice,
        discountCode: appliedDiscount?.code || null,
        discountPercentage: appliedDiscount?.percentage || null,
      }

      const res = await fetch("/api/invitations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(invitationPayload),
      })
      const data = await res.json()
      if (!res.ok) {
        console.error("Server error data:", JSON.stringify(data, null, 2))
        throw new Error(data.error || t("create.publish.error.create"))
      }

      // Save sections data
      const invitationId = data.id
      const sectionsToSave = Object.keys(preparedSections).length
      console.log(`Saving ${sectionsToSave} sections for invitation ${invitationId}...`)

      if (sectionsToSave === 0) {
        console.warn("No sections data found to save.")
      }

      console.log("Saving sections data...")
      const sectionsRes = await fetch(`/api/invitations/${invitationId}/sections`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sectionsData: preparedSections }),
      })

      const saveResult = await sectionsRes.json()
      console.log("Sections save response:", saveResult)

      if (!sectionsRes.ok || !saveResult.success) {
        throw new Error(saveResult.error || "Failed to save sections details")
      }

      setStep(4)
    } catch (e) {
      alert(e instanceof Error ? e.message : t("create.publish.error.generic"))
    } finally {
      setLoading(false)
    }
  }

  const basePrice = packageSections[selectedPackage].price
  const limit = PACKAGE_LIMITS[selectedPackage]
  const includedLanguages = INCLUDED_LANGUAGES[selectedPackage]
  const totalLanguagesCount = selectedLanguages.length + customLanguages.length

  // Calculate extra sections cost
  let sectionsExtraPrice = 0
  if (selectedPackage !== "custom") {
    const standardCount = selectedSections.filter(id => !id.startsWith("custom_")).length;
    const customCount = selectedSections.filter(id => id.startsWith("custom_")).length;
    let extraStandard = 0;
    let paidCustom = 0;
    let remainingLimit = limit;

    if (standardCount > remainingLimit) {
      extraStandard = standardCount - remainingLimit;
      remainingLimit = 0;
    } else {
      remainingLimit -= standardCount;
    }

    if (customCount > remainingLimit) {
      paidCustom = customCount - remainingLimit;
    }

    sectionsExtraPrice = (extraStandard * pricingRates.extraSection) + (paidCustom * pricingRates.customSection);
  }

  const extrasPrice = selectedExtras.reduce((sum, id) => {
    const extra = extras.find((e) => e.id === id)
    return sum + (extra?.price || 0)
  }, 0)

  const extraLanguagesCount = selectedPackage === "custom" ? 0 : Math.max(0, totalLanguagesCount - includedLanguages)
  const languagesExtraPrice = extraLanguagesCount * pricingRates.language

  const rawTotalPrice = basePrice + sectionsExtraPrice + extrasPrice + languagesExtraPrice
  const totalPrice = appliedDiscount
    ? Math.max(0, rawTotalPrice - (rawTotalPrice * (appliedDiscount.percentage / 100)))
    : rawTotalPrice

  const handleApplyDiscount = async () => {
    if (!discountCodeInput.trim()) return
    setApplyingDiscount(true)
    setDiscountError("")
    try {
      const res = await fetch(`/api/discount-codes/validate?code=${encodeURIComponent(discountCodeInput.trim())}`)
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || "Invalid or expired discount code")
      setAppliedDiscount({ code: data.code, percentage: data.percentage })
      setDiscountCodeInput("")
    } catch (e: any) {
      setDiscountError(e.message)
      setAppliedDiscount(null)
    } finally {
      setApplyingDiscount(false)
    }
  }

  const handleRemoveDiscount = () => {
    setAppliedDiscount(null)
    setDiscountError("")
  }

  const canProceedToStep2 = Boolean(form.templateId) && selectedSections.length > 0

  const canProceedToPayment =
    Boolean(form.brideName.trim()) &&
    Boolean(form.groomName.trim()) &&
    Boolean(form.eventDate) &&
    Boolean(form.eventTime.trim()) &&
    Boolean(form.venue.trim()) &&
    isStep2Valid

  useEffect(() => {
    if ((step === 2 || step === 3) && selectedPackage === "custom") {
      setStep(1)
      return
    }
    if ((step === 2 || step === 3) && !canProceedToStep2) {
      setStep(1)
      return
    }
    if (step === 3 && !canProceedToPayment) {
      setStep(2)
    }
  }, [step, canProceedToStep2, canProceedToPayment, selectedPackage])

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" })
  }, [step])

  const sectionIcon = (id: string) => {
    switch (id) {
      case "countdown":
        return Clock
      case "venueMap":
        return MapPin
      case "messages":
        return MessageSquare
      case "ourStory":
        return Heart
      case "timeline":
        return Calendar
      case "guestNotes":
        return NotebookPen
      case "dressCode":
        return Shirt
      case "rsvp":
        return ClipboardList
      case "photoUpload":
        return ImageIcon
      case "song":
        return Music
      case "transport":
        return Bus
      case "giftList":
        return Gift
      default:
        return HelpCircle
    }
  }

  const addCustomSection = () => {
    const label = customBlockLabel.trim()
    if (!label) return
    const id = `custom_${Date.now()}`
    setCustomSections((prev) => [...prev, { id, label }])
    setSelectedSections((prev) => (prev.includes(id) ? prev : [...prev, id]))
    setCustomBlockLabel("")
  }

  return (
    <div className="max-w-3xl mx-auto py-8 px-4">
      {step < 4 && (
        <div className="mb-8">
          <div className="grid grid-cols-3 gap-4 mb-4">
            {[1, 2, 3].map((s) => (
              <div
                key={s}
                className={`flex items-center justify-center w-10 h-10 rounded-full border-2 transition-colors mx-auto ${step >= s ? "bg-primary border-primary text-white" : "border-border text-muted-foreground"
                  }`}
              >
                {step > s ? <Check className="w-5 h-5" /> : s}
              </div>
            ))}
          </div>
          <div className="grid grid-cols-3 gap-4 text-xs text-muted-foreground text-center">
            <span>{t("create.step.style")}</span>
            <span>{t("create.step.details")}</span>
            <span>{t("create.step.payment")}</span>
          </div>
        </div>
      )}

      {step === 1 && (
        <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-32">
          {selectedPackage !== "custom" && (
            <>
              <div className="text-center space-y-3">
                <h1 className="text-4xl font-serif text-foreground">{t("create.chooseStyle.title")}</h1>
                <p className="text-muted-foreground text-lg">{t("create.chooseStyle.sub")}</p>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {templates.map((template) => {
                  const isVideo = template.image.endsWith('.mp4')
                  const isSelected = form.templateId === template.id
                  const isPremium = template.isPremium
                  const isPremiumLocked = isPremium && selectedPackage === "standard"
                  return (
                    <button
                      key={template.id}
                      disabled={isPremiumLocked}
                      className={`group relative aspect-[3/4] rounded-2xl overflow-hidden border-2 transition-all text-left ${isSelected ? "border-primary ring-2 ring-primary ring-offset-2 scale-[1.02]" : "border-transparent hover:border-primary/50"
                        } ${isPremiumLocked ? "opacity-75 cursor-not-allowed" : ""}`}
                      onClick={() => {
                        if (isPremiumLocked) {
                          // Show alert or toast that premium template requires premium package
                          alert(t("create.premiumRequired"))
                          return
                        }
                        update("templateId", template.id)
                      }}
                    >
                      {isVideo ? (
                        <video
                          src={template.image}
                          autoPlay
                          loop
                          muted
                          playsInline
                          className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                        />
                      ) : (
                        <img
                          src={template.image}
                          alt={template.name}
                          className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                        />
                      )}
                      {/* Premium Badge */}
                      {isPremium && (
                        <div className="absolute top-3 right-3 z-10">
                          <div className="flex items-center gap-1 px-2 py-1 bg-gradient-to-r from-amber-500 to-orange-500 text-white text-xs font-semibold rounded-full shadow-lg">
                            <Crown className="w-3 h-3" />
                            {t("create.premiumBadge")}
                          </div>
                        </div>
                      )}
                      {/* Premium Lock Overlay */}
                      {isPremiumLocked && (
                        <div className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center z-20">
                          <Crown className="w-8 h-8 text-amber-400 mb-2" />
                          <span className="text-white text-xs font-medium text-center px-2">{t("create.upgradeToPremium")}</span>
                        </div>
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent p-4 flex flex-col justify-between">
                        <div className="flex justify-between">
                          {isSelected && (
                            <div className="bg-primary text-white rounded-full p-1 self-end shadow-md">
                              <Check className="w-4 h-4" />
                            </div>
                          )}
                        </div>
                        <div className="flex justify-between items-end w-full">
                          <div className="font-semibold text-white/90 text-lg leading-tight drop-shadow-md">
                            {t(`template.name.${template.id}`) !== `template.name.${template.id}` ? t(`template.name.${template.id}`) : template.name}
                          </div>
                          <a
                            href={template.demoUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white hover:bg-white/40 transition-colors shadow-sm"
                            onClick={(e) => e.stopPropagation()}
                            title={t("create.previewDemo")}
                          >
                            <ExternalLink className="w-4 h-4" />
                          </a>
                        </div>
                      </div>
                    </button>
                  )
                })}
              </div>
            </>
          )}

          <Card className="border-none shadow-lg bg-card/50 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-2xl font-serif">{t("create.selectPackage")}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-8">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {(Object.keys(packageSections) as PackageId[]).map((id) => {
                  const pkg = packageSections[id]
                  const isActive = selectedPackage === id
                  return (
                    <button
                      key={id}
                      type="button"
                      onClick={() => handlePackageChange(id)}
                      className={`rounded-xl border-2 p-4 text-left transition-all ${isActive
                        ? "border-primary bg-primary/5 shadow-md scale-[1.02]"
                        : "border-border hover:border-primary/50"
                        }`}
                    >
                      <div className="font-semibold text-foreground">{pkg.label}</div>
                      <div className="text-xs text-muted-foreground mt-1">{pkg.description}</div>
                      <div className="mt-2 font-bold text-primary">
                        {pkg.price} {currencyShort}
                      </div>
                    </button>
                  )
                })}
              </div>

              {selectedPackage === "custom" ? (
                <div className="space-y-8 py-8 animate-in fade-in slide-in-from-top-4 duration-500">
                  <div className="text-center space-y-4">
                    <h3 className="text-2xl font-serif text-foreground">{t("create.custom.title")}</h3>
                    <p className="text-muted-foreground max-w-md mx-auto">
                      {t("create.custom.sub")}
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <a
                      href={`https://wa.me/${randomWhatsapp}?text=${encodeURIComponent("Hello! I'm interested in the Customized Package for my invitation. I'd like to share my vision with you.")}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex flex-col items-center justify-center p-6 rounded-2xl border-2 border-green-500/20 bg-green-500/5 hover:bg-green-500/10 transition-all group"
                    >
                      <MessageCircle className="w-8 h-8 mb-3 text-green-600 group-hover:scale-110 transition-transform" />
                      <span className="font-semibold text-green-700">{t("create.contact.whatsapp")}</span>
                    </a>

                    <a
                      href="https://www.instagram.com/digitiva.co?igsh=MXNteGgyZjIzenQwaQ=="
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex flex-col items-center justify-center p-6 rounded-2xl border-2 border-pink-500/20 bg-pink-500/5 hover:bg-pink-500/10 transition-all group"
                    >
                      <Instagram className="w-8 h-8 mb-3 text-pink-600 group-hover:scale-110 transition-transform" />
                      <span className="font-semibold text-pink-700">{t("create.contact.instagram")}</span>
                    </a>

                    <a
                      href="mailto:digitivaa@gmail.com?subject=Customized Package Vision&body=Hello! I'm interested in the Customized Package for my invitation. I'd like to share my vision with you."
                      className="flex flex-col items-center justify-center p-6 rounded-2xl border-2 border-blue-500/20 bg-blue-500/5 hover:bg-blue-500/10 transition-all group"
                    >
                      <Mail className="w-8 h-8 mb-3 text-blue-600 group-hover:scale-110 transition-transform" />
                      <span className="font-semibold text-blue-700">{t("create.contact.email")}</span>
                    </a>
                  </div>
                </div>
              ) : (
                <>
                  <div className="space-y-4">
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center justify-between">
                        <div className="text-sm font-medium text-foreground">{t("create.sections.title")}</div>
                        <div className="text-[10px] text-muted-foreground bg-muted px-2 py-0.5 rounded-full uppercase tracking-tight">
                          {t("create.sections.extraEach")
                            .replace("{price}", String(pricingRates.extraSection))
                            .replace("{currency}", currencyShort)}
                        </div>
                      </div>
                      <div className="text-[11px] text-primary font-medium">
                        {selectedPackage === "standard"
                          ? t("create.sections.pick3")
                          : selectedPackage === "premium"
                            ? t("create.sections.pick7")
                            : t("create.sections.pickAny")}
                      </div>
                    </div>
                    <div
                      className="grid gap-2 sm:gap-3 w-full"
                      style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(4, minmax(0, 1fr))',
                        width: '100%'
                      }}
                    >
                      {allSections.map((section, index) => {
                        const Icon = sectionIcon(section.id)
                        const active = selectedSections.includes(section.id)

                        // Logic: First 3 (Standard) or 7 (Premium) selected sections are free.
                        // Others are +50.
                        const selectedIndex = selectedSections.indexOf(section.id)
                        const isExtra = active && selectedIndex >= limit

                        return (
                          <button
                            key={section.id}
                            type="button"
                            onClick={() => toggleSection(section.id)}
                            className={`rounded-2xl border px-1 py-4 text-center transition-all flex flex-col items-center justify-center min-h-[85px] sm:min-h-[110px] w-full relative group ${active
                              ? "border-primary bg-primary/5 ring-1 ring-primary"
                              : "border-border bg-card hover:border-primary/40"
                              }`}
                          >
                            {isExtra && (
                              <div className="absolute left-1/2 -translate-x-1/2 bottom-0 translate-y-1/2 bg-primary text-primary-foreground text-[9px] font-medium px-2 py-0.5 rounded-full pointer-events-none whitespace-nowrap min-w-[45px]">
                                {t("create.section.badgeExtra")
                                  .replace("{price}", String(pricingRates.extraSection))
                                  .replace("{currency}", currencyShort)}
                              </div>
                            )}
                            <Icon className={`h-5 w-5 sm:h-6 sm:w-6 mb-1.5 ${active ? "text-primary" : "text-muted-foreground"}`} />
                            <div className={`text-[9px] sm:text-xs leading-tight font-medium px-0.5 ${active ? "text-foreground" : "text-muted-foreground"}`}>
                              {section.label}
                            </div>
                          </button>
                        )
                      })}

                      {customSections.map((section, index) => {
                        const active = selectedSections.includes(section.id)
                        const selectedIndex = selectedSections.indexOf(section.id)
                        const isExtra = active && selectedIndex >= limit

                        return (
                          <button
                            key={section.id}
                            type="button"
                            onClick={() => toggleSection(section.id)}
                            className={`rounded-2xl border px-1 py-4 text-center transition-all flex flex-col items-center justify-center min-h-[85px] sm:min-h-[110px] w-full relative group ${active
                              ? "border-primary bg-primary/5 ring-1 ring-primary"
                              : "border-border bg-card hover:border-primary/40"
                              }`}
                          >
                            {isExtra && (
                              <div className="absolute left-1/2 -translate-x-1/2 bottom-0 translate-y-1/2 bg-primary text-primary-foreground text-[9px] font-medium px-2 py-0.5 rounded-full pointer-events-none whitespace-nowrap min-w-[45px]">
                                {t("create.section.badgeExtra")
                                  .replace("{price}", String(pricingRates.customSection))
                                  .replace("{currency}", currencyShort)}
                              </div>
                            )}
                            <Heart className={`h-5 w-5 sm:h-6 sm:w-6 mb-1.5 ${active ? "text-primary" : "text-muted-foreground"}`} />
                            <div className={`text-[9px] sm:text-xs leading-tight font-medium px-0.5 ${active ? "text-foreground" : "text-muted-foreground"}`}>
                              {section.label}
                            </div>
                          </button>
                        )
                      })}
                    </div>

                    <div className="flex gap-3">
                      <Input
                        className="rounded-xl h-11"
                        value={customBlockLabel}
                        onChange={(e) => setCustomBlockLabel(e.target.value)}
                        placeholder={t("create.customBlock.placeholder")}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            e.preventDefault()
                            addCustomSection()
                          }
                        }}
                      />
                      <Button
                        type="button"
                        variant="outline"
                        className="rounded-xl h-11 px-4"
                        onClick={addCustomSection}
                      >
                        +
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-4 pt-2">
                    <div className="text-center">
                      <div className="font-serif text-2xl text-foreground">{t("create.lang.title")}</div>
                      <div className="text-xs text-muted-foreground mt-1">
                        {selectedPackage === "standard" ? t("create.lang.sub1") : t("create.lang.sub2")}
                      </div>
                      <div className="text-[11px] text-muted-foreground mt-2">
                        +{pricingRates.language} {currencyShort} {" "}
                        {selectedPackage === "standard"
                          ? `(${t("create.label.extraCount").replace("{count}", String(Math.max(0, totalLanguagesCount - 1)))})`
                          : `(${t("create.label.extraCount").replace("{count}", String(Math.max(0, totalLanguagesCount - 2)))})`}
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div className="space-y-2">
                        {selectedLanguages.map((code, idx) => (
                          <div key={code} className="flex gap-3">
                            <Select
                              value={code}
                              onValueChange={(v) => {
                                const next = v as SiteLocale
                                setSelectedLanguages((prev) => {
                                  if (prev.includes(next)) return prev
                                  const copy = [...prev]
                                  copy[idx] = next
                                  return copy
                                })
                              }}
                            >
                              <SelectTrigger className="w-full rounded-xl h-11">
                                <SelectValue placeholder={idx === 0 ? t("create.lang.selectPrimary") : t("create.lang.selectSecondary")} />
                              </SelectTrigger>
                              <SelectContent className="max-h-[300px]">
                                {SITE_LOCALES.filter((l) => !selectedLanguages.includes(l.code) || l.code === code).map((l) => (
                                  <SelectItem key={l.code} value={l.code}>
                                    {l.label}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            {idx > 0 && (
                              <Button
                                type="button"
                                variant="outline"
                                className="rounded-xl h-11 px-4 shrink-0"
                                onClick={() => setSelectedLanguages((prev) => prev.filter((_, i) => i !== idx))}
                              >
                                {t("create.lang.remove")}
                              </Button>
                            )}
                          </div>
                        ))}

                        <Button
                          type="button"
                          variant="outline"
                          className="rounded-xl h-11 w-full"
                          onClick={() => {
                            const available = SITE_LOCALES.find((l) => !selectedLanguages.includes(l.code))
                            if (!available) return
                            setSelectedLanguages((prev) => [...prev, available.code])
                          }}
                        >
                          {t("create.lang.add")}
                        </Button>

                        <div className="pt-2">
                          <div className="text-[11px] text-muted-foreground mb-2">
                            {t("create.lang.cantFind")}
                          </div>
                          <div className="flex gap-3">
                            <Input
                              className="rounded-xl h-11"
                              value={requestedLanguage}
                              onChange={(e) => setRequestedLanguage(e.target.value)}
                              placeholder={t("create.lang.typePlaceholder")}
                            />
                            <Button
                              type="button"
                              variant="outline"
                              className="rounded-xl h-11 px-4 shrink-0"
                              onClick={() => {
                                const v = requestedLanguage.trim()
                                if (!v) return
                                setCustomLanguages((prev) => (prev.includes(v) ? prev : [...prev, v]))
                                setRequestedLanguage("")
                              }}
                            >
                              {t("create.lang.add")}
                            </Button>
                          </div>

                          {customLanguages.length > 0 && (
                            <div className="pt-2 space-y-2">
                              {customLanguages.map((l) => (
                                <div key={l} className="flex gap-3">
                                  <div className="flex-1 rounded-xl h-11 border border-border bg-muted/40 px-4 flex items-center text-sm text-foreground">
                                    {l}
                                  </div>
                                  <Button
                                    type="button"
                                    variant="outline"
                                    className="rounded-xl h-11 px-4 shrink-0"
                                    onClick={() => setCustomLanguages((prev) => prev.filter((x) => x !== l))}
                                  >
                                    {t("create.lang.remove")}
                                  </Button>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-6 pt-4">
                    <div className="text-center space-y-1">
                      <h3 className="font-serif text-3xl text-foreground">{t("create.extras.title")}</h3>
                      <p className="text-sm text-muted-foreground">{t("create.extras.sub")}</p>
                    </div>

                    <div className="space-y-3">
                      {extras.map((extra) => {
                        const active = selectedExtras.includes(extra.id)
                        const Icon = extra.icon
                        return (
                          <button
                            key={extra.id}
                            type="button"
                            onClick={() => {
                              setSelectedExtras((prev) =>
                                prev.includes(extra.id)
                                  ? prev.filter((id) => id !== extra.id)
                                  : [...prev, extra.id]
                              )
                            }}
                            className={`w-full flex items-center gap-4 p-4 rounded-2xl border transition-all text-left ${active
                              ? "border-primary bg-primary/5 ring-1 ring-primary"
                              : "border-border bg-card hover:border-primary/20"
                              }`}
                          >
                            <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${active ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"
                              }`}>
                              <Icon className="w-6 h-6" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2">
                                <span className="font-semibold text-foreground">{extra.label}</span>
                              </div>
                              <p className="text-xs text-muted-foreground sm:line-clamp-1">{extra.description}</p>
                            </div>
                            <div className="text-sm font-bold text-foreground shrink-0">
                              +{extra.price} {currencyShort}
                            </div>
                          </button>
                        )
                      })}
                    </div>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </div>
      )}

      {step === 1 && selectedPackage !== "custom" && (
        <div className="fixed bottom-0 left-0 right-0 p-4 bg-background/80 backdrop-blur-md border-t border-border z-50">
          <div className="max-w-md mx-auto">
            <div className="text-center text-[11px] text-muted-foreground mb-2">
              {t("create.bottom.summary")
                .replace("{count}", String(selectedSections.length))
                .replace("{extra}", String(sectionsExtraPrice + extrasPrice + languagesExtraPrice))
                .replace("{currency}", currencyShort)}
            </div>
            {!canProceedToStep2 && (
              <div className="text-center text-[11px] text-muted-foreground mb-2">
                {!form.templateId ? t("create.bottom.needTemplate") : t("create.bottom.needSection")}
              </div>
            )}
            <Button
              disabled={!canProceedToStep2}
              className={`w-full h-14 text-xl font-bold rounded-full bg-primary text-primary-foreground shadow-xl transition-all group overflow-hidden relative ${canProceedToStep2 ? "hover:bg-primary/90" : "opacity-60 cursor-not-allowed"
                }`}
              onClick={() => {
                if (!canProceedToStep2) return
                setStep(2)
              }}
            >
              <span className="relative z-10 flex items-center justify-center gap-2 uppercase tracking-wide">
                {t("create.bottom.pay")
                  .replace("{price}", String(totalPrice))
                  .replace("{currency}", currencyShort)}{" "}
                <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
              </span>
              <div className="absolute inset-0 bg-white/10 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
            </Button>
            <div className="mt-2 text-center">
              <p className="text-[10px] text-muted-foreground opacity-80">
                {t("create.bottom.discount_notice")}
              </p>
            </div>
          </div>
        </div>
      )}

      {step === 2 && (
        <Card className="border-none shadow-lg bg-card/50 backdrop-blur-sm animate-in fade-in slide-in-from-right-4 duration-500">
          <CardHeader className="flex flex-row items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => setStep(1)}>
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <CardTitle className="text-2xl font-serif">{t("create.details.title")}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>{t("create.label.bride")}</Label>
                <Input
                  className="rounded-xl h-11"
                  value={form.brideName}
                  onChange={(e) => update("brideName", e.target.value)}
                  placeholder={t("create.ph.bride")}
                />
              </div>
              <div className="space-y-2">
                <Label>{t("create.label.groom")}</Label>
                <Input
                  className="rounded-xl h-11"
                  value={form.groomName}
                  onChange={(e) => update("groomName", e.target.value)}
                  placeholder={t("create.ph.groom")}
                />
              </div>
              <div className="space-y-2 sm:col-span-2">
                <Label>{t("create.label.eventType")}</Label>
                <Input
                  className="rounded-xl h-11"
                  value={form.eventType}
                  onChange={(e) => update("eventType", e.target.value)}
                  placeholder={t("create.ph.eventType")}
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <Label className="text-[10px] uppercase text-muted-foreground font-bold">{t("create.label.eventDate")}</Label>
                <Input
                  className="rounded-xl h-6 text-xs px-1 bg-white"
                  type="date"
                  min={todayStr}
                  value={form.eventDate}
                  onChange={(e) => update("eventDate", e.target.value)}
                />
              </div>
              <div className="space-y-1">
                <Label className="text-[10px] uppercase text-muted-foreground font-bold">{t("create.label.eventTime")}</Label>
                <Input
                  className="rounded-xl h-10 text-xs px-2 bg-white"
                  value={form.eventTime}
                  onChange={(e) => update("eventTime", e.target.value)}
                  placeholder={t("create.ph.eventTime")}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label>{t("create.label.venue")}</Label>
              <Input
                className="rounded-xl h-11"
                value={form.venue}
                onChange={(e) => update("venue", e.target.value)}
                placeholder={t("create.ph.venue")}
              />
            </div>

            {!["royal-entrance", "lamis", "sunset-love"].includes(form.templateId) && (
              <div className="pt-4 border-t border-border space-y-4">
                <div className="text-sm font-semibold text-primary uppercase tracking-wider mb-4">{t("create.label.bgImage")}</div>
                <div className="grid grid-cols-2 gap-3 sm:gap-6 items-start">
                  {/* Guide Image Section */}
                  <div className="space-y-2">
                    <div className="flex items-center gap-1.5">
                      <div className="h-px flex-1 bg-border" />
                      <p className="text-[8px] sm:text-[10px] font-bold uppercase text-muted-foreground tracking-widest px-1 sm:px-2 whitespace-nowrap">{t("create.guide.bgImageTitle")}</p>
                      <div className="h-px flex-1 bg-border" />
                    </div>
                    <div className="rounded-xl sm:rounded-2xl overflow-hidden border border-border bg-muted shadow-sm">
                      <img
                        src="/bg-img.jpg"
                        alt="Background guide"
                        className="w-full h-auto block"
                      />
                    </div>
                    <p className="text-[9px] sm:text-[11px] text-muted-foreground text-center italic px-1">
                      {t("create.guide.bgImageDesc")}
                    </p>
                  </div>

                  {/* Upload Section */}
                  <div className="space-y-3 mt-20 sm:mt-6">
                    <div className="relative border-2 border-dashed border-border rounded-xl sm:rounded-2xl p-10 sm:p-8 transition-colors hover:border-primary/50 text-center cursor-pointer group bg-white/50 h-full flex flex-col justify-center min-h-[120px] sm:min-h-[200px]">
                      <input
                        type="file"
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        onChange={(e) => setBgImage(e.target.files?.[0] || null)}
                        accept="image/*"
                      />
                      <div className="flex flex-col items-center gap-2 sm:gap-3">
                        <div className="w-8 h-8 sm:w-12 sm:h-12 rounded-full bg-primary/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                          <Upload className="w-4 h-4 sm:w-6 sm:h-6 text-primary" />
                        </div>
                        <div className="space-y-0.5 sm:space-y-1">
                          <p className="text-xs sm:text-base font-semibold text-foreground line-clamp-1">
                            {bgImage ? bgImage.name : t("create.ph.bgImage")}
                          </p>
                          <p className="text-[9px] sm:text-xs text-muted-foreground">{t("create.help.bgImage")}</p>
                        </div>
                      </div>
                    </div>
                    {bgImage && (
                      <div className="flex justify-center">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setBgImage(null)}
                          className="text-destructive hover:text-destructive/80 text-[10px] sm:text-xs h-7 sm:h-8 gap-1.5 sm:gap-2"
                        >
                          <X className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                          {t("create.btn.removeBgImage")}
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {["lamis", "ahmed", "minimalist-chic", "ivory-romance"].includes(form.templateId) && (
              <div className="pt-4 border-t border-border space-y-4">
                <div className="text-sm font-semibold text-primary uppercase tracking-wider mb-4">{t("create.label.smallImage")}</div>
                <div className="grid grid-cols-2 gap-3 sm:gap-6 items-start">
                  {/* Guide Image Section */}
                  <div className="space-y-2">
                    <div className="flex items-center gap-1.5">
                      <div className="h-px flex-1 bg-border" />
                      <p className="text-[8px] sm:text-[10px] font-bold uppercase text-muted-foreground tracking-widest px-1 sm:px-2 whitespace-nowrap">{t("create.guide.smallImageTitle")}</p>
                      <div className="h-px flex-1 bg-border" />
                    </div>
                    <div className="w-full mx-auto rounded-xl sm:rounded-2xl overflow-hidden border border-border bg-muted shadow-sm">
                      <img
                        src="/small-img.jpg"
                        alt="Small image guide"
                        className="w-full h-auto block"
                      />
                    </div>
                    <p className="text-[9px] sm:text-[11px] text-muted-foreground text-center italic px-1 mt-1 sm:mt-2">
                      {t("create.guide.smallImageDesc")}
                    </p>
                  </div>

                  {/* Upload Section */}
                  <div className="space-y-3 mt-20 sm:mt-6">
                    <div className="relative border-2 border-dashed border-border rounded-xl sm:rounded-2xl p-10 sm:p-8 transition-colors hover:border-primary/50 text-center cursor-pointer group bg-white/50 h-full flex flex-col justify-center min-h-[120px] sm:min-h-[200px]">
                      <input
                        type="file"
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        onChange={(e) => setSmallImage(e.target.files?.[0] || null)}
                        accept="image/*"
                      />
                      <div className="flex flex-col items-center gap-2 sm:gap-3">
                        <div className="w-8 h-8 sm:w-12 sm:h-12 rounded-full bg-primary/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                          <Upload className="w-4 h-4 sm:w-6 sm:h-6 text-primary" />
                        </div>
                        <div className="space-y-0.5 sm:space-y-1">
                          <p className="text-xs sm:text-base font-semibold text-foreground line-clamp-1">
                            {smallImage ? smallImage.name : t("create.ph.smallImage")}
                          </p>
                          <p className="text-[9px] sm:text-xs text-muted-foreground">{t("create.help.smallImage")}</p>
                        </div>
                      </div>
                    </div>
                    {smallImage && (
                      <div className="flex justify-center">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setSmallImage(null)}
                          className="text-destructive hover:text-destructive/80 text-[10px] sm:text-xs h-7 sm:h-8 gap-1.5 sm:gap-2"
                        >
                          <X className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                          {t("create.lang.remove")}
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {["lamis", "ivory-romance"].includes(form.templateId) && (
              <div className="pt-4 border-t border-border space-y-4">
                <div className="text-sm font-semibold text-primary uppercase tracking-wider mb-4">{t("create.label.personalImages")}</div>
                <div className="grid grid-cols-2 gap-3 sm:gap-6 items-start">
                  {/* Guide Image Section */}
                  <div className="space-y-2">
                    <div className="flex items-center gap-1.5">
                      <div className="h-px flex-1 bg-border" />
                      <p className="text-[8px] sm:text-[10px] font-bold uppercase text-muted-foreground tracking-widest px-1 sm:px-2 whitespace-nowrap">{t("create.guide.personalImagesTitle")}</p>
                      <div className="h-px flex-1 bg-border" />
                    </div>
                    <div className="w-full mx-auto rounded-xl sm:rounded-2xl overflow-hidden border border-border bg-muted shadow-sm">
                      <img
                        src="/personal-img.jpg"
                        alt="Personal image guide"
                        className="w-full h-auto block"
                      />
                    </div>
                    <p className="text-[9px] sm:text-[11px] text-muted-foreground text-center italic px-1 mt-1 sm:mt-2">
                      {t("create.guide.personalImagesDesc")}
                    </p>
                  </div>

                  {/* Upload Section */}
                  <div className="space-y-3 mt-20 sm:mt-6">
                    <div className="relative border-2 border-dashed border-border rounded-xl sm:rounded-2xl p-10 sm:p-8 transition-colors hover:border-primary/50 text-center cursor-pointer group bg-white/50 h-full flex flex-col justify-center min-h-[120px] sm:min-h-[200px]">
                      <input
                        type="file"
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        onChange={(e) => {
                          const files = Array.from(e.target.files || [])
                          if (files.length + personalImages.length > 2) {
                            alert("Max 2 images allowed")
                            return
                          }
                          setPersonalImages([...personalImages, ...files].slice(0, 2))
                        }}
                        accept="image/*"
                        multiple
                      />
                      <div className="flex flex-col items-center gap-2 sm:gap-3">
                        <div className="w-8 h-8 sm:w-12 sm:h-12 rounded-full bg-primary/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                          <Upload className="w-4 h-4 sm:w-6 sm:h-6 text-primary" />
                        </div>
                        <div className="space-y-0.5 sm:space-y-1">
                          <p className="text-xs sm:text-base font-semibold text-foreground line-clamp-1">
                            {personalImages.length > 0
                              ? `${personalImages.length} ${t("create.field.common.filesSelected")}`
                              : t("create.ph.personalImages")}
                          </p>
                          <p className="text-[9px] sm:text-xs text-muted-foreground">{t("create.help.personalImages")}</p>
                        </div>
                      </div>
                    </div>

                    {personalImages.length > 0 && (
                      <div className="grid grid-cols-2 gap-1.5 sm:gap-2">
                        {personalImages.map((file, idx) => (
                          <div key={idx} className="relative group">
                            <div className="aspect-square rounded-lg overflow-hidden border border-border">
                              <img
                                src={URL.createObjectURL(file)}
                                alt={`Personal ${idx + 1}`}
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <button
                              onClick={() => setPersonalImages(personalImages.filter((_, i) => i !== idx))}
                              className="absolute -top-1 -right-1 w-4 h-4 sm:w-5 sm:h-5 rounded-full bg-destructive text-white flex items-center justify-center shadow-sm opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                              <X className="w-2.5 h-2.5 sm:w-3 h-3" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}



            {!["royal-entrance", "sunset-love", "green-essence"].includes(form.templateId) && (
              <div className="pt-4 border-t border-border space-y-4">
                <div className="text-sm font-semibold text-primary uppercase tracking-wider">{t("create.label.colorPalette")}</div>
                <div className="space-y-6">
                  <div className="space-y-4">
                    <div className="space-y-4">
                      {/* Current Palette Display - Visual Chips */}
                      <div className="flex flex-wrap gap-2 min-h-[44px] p-2 rounded-xl border border-border bg-muted/20">
                        {colorPaletteText ? (
                          colorPaletteText.split(',').map((c, i) => {
                            const trimmed = c.trim();
                            const isHex = trimmed.startsWith('#');
                            return (
                              <div
                                key={i}
                                className="flex items-center gap-1.5 pl-1.5 pr-1 py-1 rounded-lg bg-white border border-border shadow-sm group animate-in fade-in zoom-in duration-200"
                              >
                                {isHex && (
                                  <div
                                    className="w-4 h-4 rounded-full border border-black/10 flex-shrink-0"
                                    style={{ backgroundColor: trimmed }}
                                  />
                                )}
                                <span className="text-[10px] font-bold uppercase tracking-tight text-foreground">{trimmed}</span>
                                <button
                                  type="button"
                                  onClick={() => {
                                    const parts = colorPaletteText.split(',').map(p => p.trim());
                                    parts.splice(i, 1);
                                    setColorPaletteText(parts.join(', '));
                                  }}
                                  className="w-5 h-5 flex items-center justify-center rounded-md hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors"
                                >
                                  <X className="w-3 h-3" />
                                </button>
                              </div>
                            );
                          })
                        ) : (
                          <p className="text-xs text-muted-foreground/60 italic flex items-center h-full pl-2">
                            {t("create.ph.colorPalette")}
                          </p>
                        )}
                      </div>

                      <div className="flex gap-2">
                        <Input
                          className="rounded-xl h-12 flex-1 shadow-sm border-2 focus-visible:border-primary transition-all"
                          value={colorPaletteText}
                          onChange={(e) => setColorPaletteText(e.target.value)}
                          placeholder={t("create.ph.colorPalette")}
                        />

                        <Popover>
                          <PopoverTrigger asChild>
                            <Button
                              type="button"
                              variant="outline"
                              className="h-12 w-12 p-0 rounded-xl border-2 flex items-center justify-center bg-white shadow-sm hover:border-primary hover:text-primary transition-all relative overflow-hidden group"
                            >
                              <div
                                className="w-7 h-7 rounded-full border border-black/10 shadow-inner z-10 group-hover:scale-110 transition-transform"
                                style={{ backgroundColor: tempColor }}
                              />
                              <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-72 p-4 rounded-3xl shadow-2xl border-border bg-white" align="end" sideOffset={8}>
                            <div className="space-y-4">
                              <div className="flex items-center justify-between">
                                <div className="text-[11px] font-black uppercase tracking-widest text-primary flex items-center gap-2">
                                  <Palette className="w-3.5 h-3.5" />
                                  {t("create.label.colorPalette")}
                                </div>
                                <code className="text-[10px] font-mono font-bold bg-muted px-2 py-0.5 rounded-full text-muted-foreground border border-border/50">
                                  {tempColor.toUpperCase()}
                                </code>
                              </div>

                              <div className="flex flex-col gap-4">
                                <div className="relative w-full aspect-[4/3] rounded-2xl overflow-hidden border-2 border-border shadow-inner group">
                                  <input
                                    type="color"
                                    className="absolute inset-0 w-[200%] h-[200%] -translate-x-1/4 -translate-y-1/4 cursor-pointer"
                                    value={tempColor}
                                    onChange={(e) => setTempColor(e.target.value)}
                                  />
                                  <div className="absolute inset-0 pointer-events-none ring-1 ring-inset ring-black/5" />
                                </div>

                                <div className="flex gap-2">
                                  <Button
                                    type="button"
                                    className="flex-1 rounded-2xl gap-2 font-bold py-6 text-sm shadow-lg shadow-primary/20 hover:shadow-primary/30 transition-all hover:-translate-y-0.5 active:translate-y-0"
                                    onClick={() => {
                                      setColorPaletteText(prev => {
                                        const parts = prev ? prev.split(',').map(p => p.trim()) : [];
                                        if (!parts.includes(tempColor)) {
                                          return prev ? `${prev}, ${tempColor}` : tempColor;
                                        }
                                        return prev;
                                      });
                                    }}
                                  >
                                    <Plus className="w-4 h-4" />
                                    {t("create.lang.add")}
                                  </Button>

                                  {colorPaletteText.includes(tempColor) && (
                                    <Button
                                      type="button"
                                      variant="outline"
                                      className="rounded-2xl w-12 h-12 p-0 border-2 hover:border-destructive hover:text-destructive hover:bg-destructive/5 transition-all"
                                      onClick={() => {
                                        const parts = colorPaletteText.split(',').map(p => p.trim());
                                        const filtered = parts.filter(p => p !== tempColor);
                                        setColorPaletteText(filtered.join(', '));
                                      }}
                                    >
                                      <Trash2 className="w-4 h-4" />
                                    </Button>
                                  )}
                                </div>
                              </div>
                            </div>
                          </PopoverContent>
                        </Popover>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label>{t("create.label.colorPaletteImage")}</Label>
                      <div className="relative border-2 border-dashed border-border rounded-2xl p-8 transition-colors hover:border-primary/50 text-center cursor-pointer group bg-white/50">
                        <input
                          type="file"
                          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                          onChange={(e) => setColorPaletteImage(e.target.files?.[0] || null)}
                          accept="image/*"
                        />
                        <div className="flex flex-col items-center gap-3">
                          <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                            <Upload className="w-6 h-6 text-primary" />
                          </div>
                          <div className="space-y-1">
                            <p className="text-base font-semibold text-foreground">
                              {colorPaletteImage ? colorPaletteImage.name : t("create.ph.colorPaletteImage")}
                            </p>
                            <p className="text-xs text-muted-foreground">{t("create.help.colorPaletteImage")}</p>
                          </div>
                        </div>
                      </div>
                      {colorPaletteImage && (
                        <div className="flex justify-center">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setColorPaletteImage(null)}
                            className="text-destructive hover:text-destructive/80 text-xs h-8 gap-2"
                          >
                            <X className="w-3.5 h-3.5" />
                            {t("create.lang.remove")}
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <div className="h-px flex-1 bg-border" />
                      <p className="text-[10px] font-bold uppercase text-muted-foreground tracking-widest px-2">{t("create.guide.colorPaletteTitle")}</p>
                      <div className="h-px flex-1 bg-border" />
                    </div>
                    <p className="text-[11px] text-muted-foreground text-center italic px-4">
                      {t("create.guide.colorPaletteDesc")}
                    </p>
                  </div>
                </div>
              </div>
            )}

            <div className="pt-4 border-t border-border space-y-4">
              <div className="text-sm font-semibold text-primary uppercase tracking-wider">{t("create.contactInfo")}</div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className={errors.email ? "text-destructive" : ""}>{t("create.label.emailAddr")}</Label>
                  <Input
                    className={`rounded-xl h-11 ${errors.email ? "border-destructive focus-visible:ring-destructive" : ""}`}
                    type="email"
                    value={form.email}
                    onChange={(e) => update("email", e.target.value)}
                    placeholder={t("create.ph.email")}
                  />
                  {errors.email && <p className="text-xs text-destructive mt-1">{errors.email}</p>}
                </div>
                <div className="space-y-2">
                  <Label className={errors.whatsapp ? "text-destructive" : ""}>{t("create.label.whatsapp")}</Label>
                  <div className="flex gap-2">
                    <Select
                      value={form.countryCode}
                      onValueChange={(val) => update("countryCode" as any, val)}
                    >
                      <SelectTrigger className="w-[160px] rounded-xl h-11 shrink-0">
                        <SelectValue placeholder={t("create.countryPlaceholder")} />
                      </SelectTrigger>
                      <SelectContent className="max-h-[300px]">
                        {countries.map((c) => (
                          <SelectItem key={`${c.code}-${c.dial_code}`} value={c.dial_code}>
                            <span className="flex items-center justify-between w-full gap-2">
                              <span className="truncate">{c.name}</span>
                              <span className="text-muted-foreground text-xs shrink-0">{c.dial_code}</span>
                            </span>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Input
                      className={`rounded-xl h-11 ${errors.whatsapp ? "border-destructive focus-visible:ring-destructive" : ""}`}
                      type="text"
                      inputMode="numeric"
                      value={form.whatsapp}
                      onChange={(e) => {
                        const val = e.target.value.replace(/\D/g, '')
                        update("whatsapp", val)
                      }}
                      placeholder={t("create.ph.phone")}
                    />
                  </div>
                  {errors.whatsapp && <p className="text-xs text-destructive mt-1">{errors.whatsapp}</p>}
                </div>
              </div>
            </div>

            {/* Dynamic Section Forms */}
            <div className="pt-4 border-t border-border space-y-4">
              <div className="text-sm font-semibold text-primary uppercase tracking-wider">
                {t("create.sections.detailsTitle") || "Section Details"}
              </div>
              <DynamicFormContainer
                selectedSections={selectedSections}
                sectionsData={sectionsData}
                onSectionDataChange={updateSectionData}
                errors={sectionErrors}
                getSectionLabel={(id) => t(`create.sec.${id}`)}
              />
              {hasSectionErrors && (
                <p className="text-xs text-destructive text-center">
                  {t("create.err.sectionsFix")}
                </p>
              )}
            </div>

            <Button
              className="w-full h-12 text-lg rounded-full shadow-md hover:shadow-lg transition-all"
              disabled={!canProceedToPayment || hasSectionErrors}
              onClick={() => {
                if (validateStep2()) {
                  if (validateSections(selectedSections)) {
                    setStep(3)
                  }
                }
              }}
            >
              {t("create.nextPayment")
                .replace("{price}", String(totalPrice))
                .replace("{currency}", currencyShort)}
            </Button>
          </CardContent>
        </Card>
      )}

      {step === 3 && (
        <Card className="border-none shadow-lg bg-card/50 backdrop-blur-sm animate-in fade-in slide-in-from-right-4 duration-500">
          <CardHeader className="flex flex-row items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => setStep(2)}>
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <CardTitle className="text-2xl font-serif">{t("create.payment.title")}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-8">
            <div className="p-4 rounded-2xl bg-primary/5 border border-primary/20 flex flex-col gap-4">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm text-muted-foreground font-medium uppercase">{t("create.payment.totalLabel")}</p>
                  <div className="flex items-end gap-3 tracking-tight">
                    {appliedDiscount ? (
                      <>
                        <p className="text-3xl font-bold text-primary">{totalPrice} {currencyShort}</p>
                        <p className="text-lg font-semibold text-muted-foreground line-through mb-1">
                          {rawTotalPrice} {currencyShort}
                        </p>
                      </>
                    ) : (
                      <p className="text-3xl font-bold text-primary">{totalPrice} {currencyShort}</p>
                    )}
                  </div>
                </div>
                <CreditCard className="w-10 h-10 text-primary opacity-20" />
              </div>

              {/* Discount Section */}
              <div className="pt-4 border-t border-primary/10">
                {appliedDiscount ? (
                  <div className="flex items-center justify-between bg-emerald-500/10 border border-emerald-500/20 rounded-lg p-3">
                    <div className="flex items-center gap-2">
                      <div className="bg-emerald-500 text-white text-xs font-bold px-2 py-1 rounded">
                        {appliedDiscount.code}
                      </div>
                      <span className="text-sm font-medium text-emerald-700">-{appliedDiscount.percentage}% applied</span>
                    </div>
                    <Button variant="ghost" size="sm" onClick={handleRemoveDiscount} className="text-muted-foreground hover:text-destructive h-8 px-2">
                      Remove
                    </Button>
                  </div>
                ) : (
                  <div className="flex items-start gap-2">
                    <div className="flex-1 space-y-1">
                      <Input
                        placeholder={t("create.ph.discountCode")}
                        value={discountCodeInput}
                        onChange={(e) => setDiscountCodeInput(e.target.value.toUpperCase())}
                        className="bg-background h-10"
                      />
                      {discountError && <p className="text-xs text-destructive pl-1">{discountError}</p>}
                    </div>
                    <Button
                      onClick={handleApplyDiscount}
                      disabled={!discountCodeInput.trim() || applyingDiscount}
                      className="h-10"
                    >
                      {applyingDiscount ? t("create.btn.applying") : t("create.btn.applyDiscount")}
                    </Button>
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-4">
              <Label className="text-lg font-medium">{t("create.payment.method")}</Label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <button
                  type="button"
                  onClick={() => setPaymentMethod("instapay")}
                  className={`flex flex-col items-center justify-center p-6 rounded-2xl border-2 transition-all ${paymentMethod === "instapay"
                    ? "border-primary bg-primary/5 shadow-md scale-[1.02]"
                    : "border-border hover:border-primary/30"
                    }`}
                >
                  <Smartphone className="w-8 h-8 mb-2 text-primary" />
                  <span className="font-semibold">{t("create.payment.instapay")}</span>
                </button>
                <button
                  type="button"
                  onClick={() => setPaymentMethod("bank")}
                  className={`flex flex-col items-center justify-center p-6 rounded-2xl border-2 transition-all ${paymentMethod === "bank"
                    ? "border-primary bg-primary/5 shadow-md scale-[1.02]"
                    : "border-border hover:border-primary/30"
                    }`}
                >
                  <Landmark className="w-8 h-8 mb-2 text-primary" />
                  <span className="font-semibold">{t("create.payment.bank")}</span>
                </button>
                <button
                  type="button"
                  onClick={() => setPaymentMethod("vodafone_cash")}
                  className={`flex flex-col items-center justify-center p-6 rounded-2xl border-2 transition-all ${paymentMethod === "vodafone_cash"
                    ? "border-primary bg-primary/5 shadow-md scale-[1.02]"
                    : "border-border hover:border-primary/30"
                    }`}
                >
                  <Smartphone className="w-8 h-8 mb-2 text-primary" />
                  <span className="font-semibold">{t("create.payment.vodafoneCash")}</span>
                </button>
              </div>
            </div>

            <div className="p-6 rounded-2xl bg-muted/50 border border-border space-y-3">
              <p className="font-semibold text-foreground">{t("create.payment.detailsHeading")}</p>
              {paymentMethod === "bank" && (
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">
                    {t("create.payment.beneficiaryLabel")}{" "}
                    <span className="text-foreground">Zeyad Mohamed Abo Eleneen Khaled</span>
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {t("create.payment.accountNumberLabel")}{" "}
                    <span className="text-foreground font-mono">1020656463735</span>
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {t("create.payment.ibanLabel")}{" "}
                    <span className="text-foreground font-mono">
                      EG78 0037 0027 0818 1020 6564 6373 5
                    </span>
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {t("create.payment.swiftLabel")}{" "}
                    <span className="text-foreground font-mono">QNBAEGCXXXX</span>
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {t("create.payment.accountCurrencyLabel")}{" "}
                    <span className="text-foreground font-mono">EGP</span>
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {t("create.payment.bankNameLabel")}{" "}
                    <span className="text-foreground">
                      Qatar National Bank (QNB Alahli)
                    </span>
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {t("create.payment.bankAddressLabel")}{" "}
                    <span className="text-foreground">
                      213 El Gomhoria Street In front of Dar El Thaqafa Mansoura,
                      Dakahlia
                    </span>
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {t("create.payment.bankCountryLabel")} <span className="text-foreground">Egypt</span>
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {t("create.payment.addrLabel")}{" "}
                    <span className="text-foreground">
                      Talkha Salah Salem street
                    </span>
                  </p>
                </div>
              )}

              {paymentMethod === "instapay" && (
                <div className="space-y-2">
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">
                      {t("create.payment.addrLabel")}{" "}
                      <span className="text-foreground font-mono">rawanamr2002@instapay</span>
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {t("create.payment.phoneLabel")}{" "}
                      <span className="text-foreground font-mono">01024285771</span>
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {t("create.payment.payeeLabel")}{" "}
                      <span className="text-foreground">Rawan Amr</span>
                    </p>
                  </div>
                  <a
                    href="https://ipn.eg/S/rawanamr2002/instapay/6ucjU6"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center h-10 px-4 rounded-full bg-primary text-primary-foreground text-sm font-semibold hover:opacity-90 transition-opacity"
                  >
                    {t("create.payment.goToInstapay")}
                  </a>
                </div>
              )}

              {paymentMethod === "vodafone_cash" && (
                <div className="space-y-2">
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">
                      {t("create.payment.phoneLabel")}{" "}
                      <span className="text-foreground font-mono">01024285771</span>
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {t("create.payment.payeeLabel")}{" "}
                      <span className="text-foreground">Rawan Amr</span>
                    </p>
                  </div>
                  <a
                    href="http://vf.eg/vfcash?id=mt&qrId=we6XaS"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center h-10 px-4 rounded-full bg-primary text-primary-foreground text-sm font-semibold hover:opacity-90 transition-opacity"
                  >
                    {t("create.payment.goToVodafoneCash")}
                  </a>
                </div>
              )}
            </div>

            <div className="space-y-4">
              <Label className="text-lg font-medium">{t("create.payment.uploadLabel")}</Label>
              <div className="relative border-2 border-dashed border-border rounded-2xl p-8 transition-colors hover:border-primary/50 text-center cursor-pointer group">
                <input
                  type="file"
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  onChange={(e) => setPaymentScreenshot(e.target.files?.[0] || null)}
                  accept="image/*"
                />
                <div className="flex flex-col items-center gap-2">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Upload className="w-6 h-6 text-primary" />
                  </div>
                  <p className="text-sm font-medium text-foreground">
                    {paymentScreenshot ? paymentScreenshot.name : t("create.payment.uploadCTA")}
                  </p>
                  <p className="text-xs text-muted-foreground">{t("create.payment.uploadTypes")}</p>
                </div>
              </div>
            </div>

            <div className="space-y-6 pt-4 border-t border-border/50">
              <div className="space-y-2 text-center">
                <p className="text-sm font-medium text-primary flex items-center justify-center gap-2">
                  <CheckCircle2 className="w-4 h-4" />
                  {t("create.payment.reassurance")}
                </p>
                <div className="pt-2">
                  <p className="text-xs text-muted-foreground mb-3">{t("create.payment.question")}</p>
                  <div className="flex flex-wrap justify-center gap-4">
                    <a
                      href={`https://wa.me/${randomWhatsapp}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground hover:text-green-600 transition-colors"
                    >
                      <MessageCircle className="w-3.5 h-3.5" />
                      WhatsApp
                    </a>
                    <a
                      href="https://www.instagram.com/digitiva.co"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground hover:text-pink-600 transition-colors"
                    >
                      <Instagram className="w-3.5 h-3.5" />
                      Instagram
                    </a>
                    <a
                      href="mailto:digitivaa@gmail.com"
                      className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground hover:text-blue-600 transition-colors"
                    >
                      <Mail className="w-3.5 h-3.5" />
                      Email
                    </a>
                  </div>
                </div>
              </div>

              <Button
                className="w-full h-12 text-lg rounded-full shadow-md hover:shadow-lg transition-all"
                disabled={!paymentScreenshot || loading}
                onClick={handlePublish}
              >
                {loading ? t("create.payment.processing") : t("create.payment.submit")}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {step === 4 && (
        <Card className="border-none shadow-2xl bg-card/50 backdrop-blur-sm overflow-hidden animate-in zoom-in-95 duration-500">
          <div className="bg-gradient-to-r from-primary to-teal h-2 w-full" />
          <CardContent className="p-12 text-center space-y-6">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 className="w-12 h-12 text-green-600 animate-in zoom-in duration-500" />
            </div>
            <h2 className="text-3xl font-serif font-bold text-foreground">{t("create.success.title")}</h2>
            <p className="text-lg text-muted-foreground leading-relaxed max-w-md mx-auto">
              {t("create.success.body")}
            </p>
            <div className="p-6 rounded-2xl bg-primary/5 border border-primary/20 inline-block space-y-2">
              <p className="font-semibold text-primary">{t("create.success.note1")}</p>
              <p className="text-sm text-primary/80 font-medium">{t("create.success.note2")}</p>
            </div>
            <div className="pt-8 flex flex-col sm:flex-row gap-3 justify-center items-center">
              <Button
                variant="outline"
                className="rounded-full px-8 hover:bg-primary/5"
                onClick={() => router.push("/")}
              >
                {t("create.success.home")}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

function CreateFallback() {
  const { t } = useSiteLanguage()
  return <div className="flex items-center justify-center min-h-screen">{t("common.loading")}</div>
}

export default function CreateInvitationPage() {
  return (
    <Suspense fallback={<CreateFallback />}>
      <CreateInvitationContent />
    </Suspense>
  )
}


