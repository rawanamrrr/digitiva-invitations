"use client"

import { useState, useEffect, Suspense, useMemo } from "react"
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
  CheckCircle2,
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
} from "lucide-react"
import { templates } from "@/lib/templates"

type PackageId = "standard" | "premium" | "custom"

const EXTRAS = [
  {
    id: "custom_music",
    label: "Custom music",
    description: "Your song playing when opening the invitation",
    price: 100,
    icon: Music,
  },
  {
    id: "custom_wax_seal",
    label: "Custom wax seal",
    description: "Add your wedding logo or any custom design to your seal",
    price: 100,
    icon: PenTool,
    popular: true,
  },
  {
    id: "custom_illustration",
    label: "Custom illustration",
    description: "Illustration of your venue or special place",
    price: 100,
    icon: Heart,
    popular: true,
  },
  {
    id: "animated_video",
    label: "Animated video",
    description: "Your invitation comes to life with a unique animation",
    price: 100,
    icon: Video,
    popular: true,
  },
  {
    id: "custom_domain",
    label: "Custom domain",
    description: "Your own web address (e.g. paula-and-marcos.com)",
    price: 600,
    icon: Globe,
  },
  {
    id: "express_delivery",
    label: "Express delivery",
    description: "72h to 120h",
    price: 100,
    icon: Zap,
  },
]

const PACKAGE_LIMITS = {
  standard: 3,
  premium: 7,
  custom: 0,
}

const SECTION_PRICE = 50

const ALL_SECTIONS = [
  { id: "countdown", label: "Countdown timer" },
  { id: "venueMap", label: "Venue map section" },
  { id: "messages", label: "Messages" },
  { id: "ourStory", label: "Our Story" },
  { id: "timeline", label: "Timeline" },
  { id: "guestNotes", label: "Guest Notes" },
  { id: "dressCode", label: "Dress Code" },
  { id: "rsvp", label: "RSVP" },
  { id: "photoUpload", label: "Gallery" },
  { id: "song", label: "Background music" },
]

const PACKAGE_SECTIONS: Record<
  PackageId,
  {
    label: string
    price: number
    description: string
    sections: string[]
  }
> = {
  standard: {
    label: "Standard Package",
    price: 500,
    description: "Template + 3 included sections",
    sections: ["countdown", "venueMap", "messages"],
  },
  premium: {
    label: "Premium Package",
    price: 600,
    description: "Template + 7 included sections",
    sections: [
      "countdown",
      "venueMap",
      "messages",
      "ourStory",
      "timeline",
      "guestNotes",
      "dressCode",
    ],
  },
  custom: {
    label: "Customized Package",
    price: 900,
    description: "Total control over your invitation",
    sections: [],
  },
}

function CreateInvitationContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [selectedPackage, setSelectedPackage] = useState<PackageId>("premium")
  const [selectedSections, setSelectedSections] = useState<string[]>([])
  const [selectedExtras, setSelectedExtras] = useState<string[]>([])
  const [customSections, setCustomSections] = useState<{ id: string; label: string }[]>([])
  const [customBlockLabel, setCustomBlockLabel] = useState("")
  const [primaryLanguage, setPrimaryLanguage] = useState<"en" | "ar">("en")
  const [secondaryLanguage, setSecondaryLanguage] = useState<"en" | "ar" | "">("")
  const [paymentMethod, setPaymentMethod] = useState<"instapay" | "bank">("instapay")
  const [paymentScreenshot, setPaymentScreenshot] = useState<File | null>(null)

  const whatsappNumbers = useMemo(() => ["201024285771", "201014924924", "201028807788"], [])
  const [randomWhatsapp, setRandomWhatsapp] = useState("")

  useEffect(() => {
    const randomIndex = Math.floor(Math.random() * whatsappNumbers.length)
    setRandomWhatsapp(whatsappNumbers[randomIndex])
  }, [whatsappNumbers])

  const [form, setForm] = useState({
    brideName: "",
    groomName: "",
    eventDate: "",
    eventTime: "",
    venue: "",
    email: "",
    whatsapp: "",
    countryCode: "+20",
    templateId: searchParams.get("template") || "",
  })

  const [errors, setErrors] = useState<{ email?: string; whatsapp?: string }>({})

  const validateStep2 = () => {
    const newErrors: { email?: string; whatsapp?: string } = {}
    
    // Email validation
    if (form.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      newErrors.email = "Please enter a valid email address"
    }
    
    // WhatsApp validation
    if (form.whatsapp && form.whatsapp.length < 6) {
      newErrors.whatsapp = "Please enter a valid phone number"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

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
    // Reset secondary language if switching to standard package
    if (pkg === "standard") {
      setSecondaryLanguage("")
    }
  }

  const toggleSection = (id: string) => {
    setSelectedSections((prev) =>
      prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id],
    )
  }

  const handlePublish = async () => {
    setLoading(true)
    try {
      // 1. Upload payment screenshot
      let screenshotUrl = ""
      if (paymentScreenshot) {
        const fd = new FormData()
        fd.append("file", paymentScreenshot)
        const uploadRes = await fetch("/api/upload", { method: "POST", body: fd })
        const uploadData = await uploadRes.json()
        if (!uploadRes.ok) throw new Error(uploadData.error || "Upload failed")
        screenshotUrl = uploadData.url
      }

      // 2. Create the invitation via API
      const sectionLabels = selectedSections.map((id) => {
        if (id.startsWith("custom_")) {
          return customSections.find((s) => s.id === id)?.label || id
        }
        // Find standard section label
        const section = ALL_SECTIONS.find((s) => s.id === id)
        return section ? section.label : id
      })

      const extraLabels = selectedExtras.map((id) => {
        return EXTRAS.find((e) => e.id === id)?.label || id
      })

      console.log("Publishing with payload:", {
        brideName: form.brideName,
        groomName: form.groomName,
        eventDate: form.eventDate,
        eventTime: form.eventTime,
        venue: form.venue,
        templateId: form.templateId,
        packageName: selectedPackage,
        sections: sectionLabels,
        extras: extraLabels,
        email: form.email,
        whatsapp: form.whatsapp,
        paymentMethod,
        paymentScreenshot: screenshotUrl,
      })

    const res = await fetch("/api/invitations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          brideName: form.brideName,
          groomName: form.groomName,
          eventDate: form.eventDate,
          eventTime: form.eventTime,
          venue: form.venue,
          templateId: form.templateId,
          packageName: selectedPackage,
          sections: sectionLabels,
          extras: extraLabels,
          email: form.email || null,
          whatsapp: `${form.countryCode}${form.whatsapp}`,
          paymentMethod,
          paymentScreenshot: screenshotUrl,
        }),
      })
      const data = await res.json()
      if (!res.ok) {
        console.error("Server error data:", JSON.stringify(data, null, 2))
        throw new Error(data.error || "Failed to create invitation")
      }

      setStep(4)
    } catch (e) {
      alert(e instanceof Error ? e.message : "Something went wrong")
    } finally {
      setLoading(false)
    }
  }

  const currentPackageConfig = PACKAGE_SECTIONS[selectedPackage]
  const basePrice = PACKAGE_SECTIONS[selectedPackage].price
  const limit = PACKAGE_LIMITS[selectedPackage]
  
  // Calculate extra sections cost
  const totalSelectedSections = selectedSections.length
  const extraSectionsCount = selectedPackage === "custom" ? 0 : Math.max(0, totalSelectedSections - limit)
  const sectionsExtraPrice = extraSectionsCount * SECTION_PRICE

  const extrasPrice = selectedExtras.reduce((sum, id) => {
    const extra = EXTRAS.find((e) => e.id === id)
    return sum + (extra?.price || 0)
  }, 0)
  
  const totalPrice = basePrice + sectionsExtraPrice + extrasPrice

  const canProceedToStep2 = Boolean(form.templateId) && selectedSections.length > 0

  useEffect(() => {
    if ((step === 2 || step === 3) && selectedPackage === "custom") {
      setStep(1)
      return
    }
    if ((step === 2 || step === 3) && !canProceedToStep2) {
      setStep(1)
    }
  }, [step, canProceedToStep2, selectedPackage])

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
          <div className="flex items-center justify-between mb-4">
            {[1, 2, 3].map((s) => (
              <div
                key={s}
                className={`flex items-center justify-center w-10 h-10 rounded-full border-2 transition-colors ${
                  step >= s ? "bg-primary border-primary text-white" : "border-border text-muted-foreground"
                }`}
              >
                {step > s ? <Check className="w-5 h-5" /> : s}
              </div>
            ))}
          </div>
          <div className="flex justify-between text-xs text-muted-foreground px-1">
            <span>Style</span>
            <span>Details</span>
            <span>Payment</span>
          </div>
        </div>
      )}

      {step === 1 && (
        <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-32">
          <div className="text-center space-y-3">
            <h1 className="text-4xl font-serif text-foreground">Choose your style</h1>
            <p className="text-muted-foreground text-lg">The theme is just the starting point, customized with your details</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {templates.map((template) => {
              const isVideo = template.image.endsWith('.mp4')
              const isSelected = form.templateId === template.id
              return (
                <button
                  key={template.id}
                  className={`group relative aspect-[3/4] rounded-2xl overflow-hidden border-2 transition-all text-left ${
                    isSelected ? "border-primary ring-2 ring-primary ring-offset-2 scale-[1.02]" : "border-transparent hover:border-primary/50"
                  }`}
                  onClick={() => {
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
                        {template.name}
                      </div>
                      <a
                        href={template.demoUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white hover:bg-white/40 transition-colors shadow-sm"
                        onClick={(e) => e.stopPropagation()}
                        title="Preview Demo"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </a>
                    </div>
                  </div>
                </button>
              )
            })}
          </div>

          <Card className="border-none shadow-lg bg-card/50 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-2xl font-serif">Select Package & Sections</CardTitle>
            </CardHeader>
            <CardContent className="space-y-8">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {(Object.keys(PACKAGE_SECTIONS) as PackageId[]).map((id) => {
                  const pkg = PACKAGE_SECTIONS[id]
                  const isActive = selectedPackage === id
                  return (
                    <button
                      key={id}
                      type="button"
                      onClick={() => handlePackageChange(id)}
                      className={`rounded-xl border-2 p-4 text-left transition-all ${
                        isActive
                          ? "border-primary bg-primary/5 shadow-md scale-[1.02]"
                          : "border-border hover:border-primary/50"
                      }`}
                    >
                      <div className="font-semibold text-foreground">{pkg.label}</div>
                      <div className="text-xs text-muted-foreground mt-1">{pkg.description}</div>
                      <div className="mt-2 font-bold text-primary">{pkg.price} LE</div>
                    </button>
                  )
                })}
              </div>

              {selectedPackage === "custom" ? (
                <div className="space-y-8 py-8 animate-in fade-in slide-in-from-top-4 duration-500">
                  <div className="text-center space-y-4">
                    <h3 className="text-2xl font-serif text-foreground">Tell us your vision</h3>
                    <p className="text-muted-foreground max-w-md mx-auto">
                      For customized packages, our team will work with you directly to bring your unique vision to life. Contact us through any of these platforms:
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
                      <span className="font-semibold text-green-700">WhatsApp</span>
                    </a>

                    <a
                      href="https://www.instagram.com/digitiva.co?igsh=MXNteGgyZjIzenQwaQ=="
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex flex-col items-center justify-center p-6 rounded-2xl border-2 border-pink-500/20 bg-pink-500/5 hover:bg-pink-500/10 transition-all group"
                    >
                      <Instagram className="w-8 h-8 mb-3 text-pink-600 group-hover:scale-110 transition-transform" />
                      <span className="font-semibold text-pink-700">Instagram</span>
                    </a>

                    <a
                      href="mailto:digitivaa@gmail.com?subject=Customized Package Vision&body=Hello! I'm interested in the Customized Package for my invitation. I'd like to share my vision with you."
                      className="flex flex-col items-center justify-center p-6 rounded-2xl border-2 border-blue-500/20 bg-blue-500/5 hover:bg-blue-500/10 transition-all group"
                    >
                      <Mail className="w-8 h-8 mb-3 text-blue-600 group-hover:scale-110 transition-transform" />
                      <span className="font-semibold text-blue-700">Email</span>
                    </a>
                  </div>
                </div>
              ) : (
                <>
                  <div className="space-y-4">
                <div className="flex flex-col gap-1">
                  <div className="flex items-center justify-between">
                    <div className="text-sm font-medium text-foreground">Select Sections</div>
                    <div className="text-[10px] text-muted-foreground bg-muted px-2 py-0.5 rounded-full uppercase tracking-tight">
                      Extra sections +{SECTION_PRICE} LE each
                    </div>
                  </div>
                  <div className="text-[11px] text-primary font-medium">
                    {selectedPackage === "standard" ? "Pick any 3 sections (Included)" : 
                     selectedPackage === "premium" ? "Pick any 7 sections (Included)" : 
                     "Pick any sections"}
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
                  {ALL_SECTIONS.map((section, index) => {
                    const Icon = sectionIcon(section.id)
                    const active = selectedSections.includes(section.id)
                    
                    // Logic: First 3 (Standard) or 7 (Premium) selected sections are free.
                    // Others are +50.
                    const selectedIndex = selectedSections.indexOf(section.id)
                    const isExtra = active && selectedPackage !== "custom" && selectedIndex >= limit
                    
                    return (
                      <button
                        key={section.id}
                        type="button"
                        onClick={() => toggleSection(section.id)}
                        className={`rounded-2xl border px-1 py-4 text-center transition-all flex flex-col items-center justify-center min-h-[85px] sm:min-h-[110px] w-full relative group ${
                          active
                            ? "border-primary bg-primary/5 ring-1 ring-primary"
                            : "border-border bg-card hover:border-primary/40"
                        }`}
                      >
                        {isExtra && (
                          <div className="absolute left-1/2 -translate-x-1/2 bottom-0 translate-y-1/2 bg-primary text-primary-foreground text-[9px] font-medium px-2 py-0.5 rounded-full pointer-events-none whitespace-nowrap min-w-[45px]">
                            +50 EGP
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
                    const isExtra = active && selectedPackage !== "custom" && selectedIndex >= limit

                    return (
                      <button
                        key={section.id}
                        type="button"
                        onClick={() => toggleSection(section.id)}
                        className={`rounded-2xl border px-1 py-4 text-center transition-all flex flex-col items-center justify-center min-h-[85px] sm:min-h-[110px] w-full relative group ${
                          active
                            ? "border-primary bg-primary/5 ring-1 ring-primary"
                            : "border-border bg-card hover:border-primary/40"
                        }`}
                      >
                        {isExtra && (
                          <div className="absolute left-1/2 -translate-x-1/2 bottom-0 translate-y-1/2 bg-primary text-primary-foreground text-[9px] font-medium px-2 py-0.5 rounded-full pointer-events-none whitespace-nowrap min-w-[45px]">
                            +50 EGP
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
                    placeholder="Custom block..."
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
                  <div className="font-serif text-2xl text-foreground">Languages</div>
                  <div className="text-xs text-muted-foreground mt-1">
                    {selectedPackage === "standard" ? "1 language included" : "Up to 2 languages free"}
                  </div>
                </div>

                <div className="space-y-3">
                  <div>
                    <Select
                      value={primaryLanguage}
                      onValueChange={(v) => {
                        const next = v as "en" | "ar"
                        setPrimaryLanguage(next)
                        if (secondaryLanguage === next) setSecondaryLanguage("")
                      }}
                    >
                      <SelectTrigger className="w-full rounded-xl h-11">
                        <SelectValue placeholder="Select language..." />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="en">English</SelectItem>
                        <SelectItem value="ar">Arabic</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {selectedPackage !== "standard" && (
                    <div className="flex gap-3 animate-in fade-in slide-in-from-top-2 duration-300">
                      <Select
                        value={secondaryLanguage}
                        onValueChange={(v) => setSecondaryLanguage(v as "en" | "ar")}
                      >
                        <SelectTrigger className="w-full rounded-xl h-11">
                          <SelectValue placeholder="Other language..." />
                        </SelectTrigger>
                        <SelectContent>
                          {primaryLanguage !== "en" && <SelectItem value="en">English</SelectItem>}
                          {primaryLanguage !== "ar" && <SelectItem value="ar">Arabic</SelectItem>}
                        </SelectContent>
                      </Select>
                      <Button
                        type="button"
                        variant="outline"
                        className="rounded-xl h-11 px-4 shrink-0"
                        onClick={() => setSecondaryLanguage(secondaryLanguage ? "" : (primaryLanguage === "en" ? "ar" : "en"))}
                      >
                        {secondaryLanguage ? "Remove" : "Add"}
                      </Button>
                    </div>
                  )}
                </div>
              </div>

              <div className="space-y-6 pt-4">
                <div className="text-center space-y-1">
                  <h3 className="font-serif text-3xl text-foreground">Extras</h3>
                  <p className="text-sm text-muted-foreground">Add the touches you want</p>
                </div>

                <div className="space-y-3">
                  {EXTRAS.map((extra) => {
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
                        className={`w-full flex items-center gap-4 p-4 rounded-2xl border transition-all text-left ${
                          active
                            ? "border-primary bg-primary/5 ring-1 ring-primary"
                            : "border-border bg-card hover:border-primary/20"
                        }`}
                      >
                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${
                          active ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"
                        }`}>
                          <Icon className="w-6 h-6" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="font-semibold text-foreground">{extra.label}</span>
                            {extra.popular && (
                              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-orange-100 text-orange-600 uppercase tracking-tight">
                                Popular
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-muted-foreground line-clamp-1">{extra.description}</p>
                        </div>
                        <div className="text-sm font-bold text-foreground shrink-0">
                          +{extra.price} LE
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
              {selectedSections.length} blocks · +{sectionsExtraPrice + extrasPrice} LE extras
            </div>
            {!canProceedToStep2 && (
              <div className="text-center text-[11px] text-muted-foreground mb-2">
                {!form.templateId ? "Select a template" : "Select at least 1 section"}
              </div>
            )}
            <Button
              disabled={!canProceedToStep2}
              className={`w-full h-14 text-xl font-bold rounded-full bg-primary text-primary-foreground shadow-xl transition-all group overflow-hidden relative ${
                canProceedToStep2 ? "hover:bg-primary/90" : "opacity-60 cursor-not-allowed"
              }`}
              onClick={() => {
                if (!canProceedToStep2) return
                setStep(2)
              }}
            >
              <span className="relative z-10 flex items-center justify-center gap-2 uppercase tracking-wide">
                PAY {totalPrice} LE <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
              </span>
              <div className="absolute inset-0 bg-white/10 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
            </Button>
          </div>
        </div>
      )}

      {step === 2 && (
        <Card className="border-none shadow-lg bg-card/50 backdrop-blur-sm animate-in fade-in slide-in-from-right-4 duration-500">
          <CardHeader className="flex flex-row items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => setStep(1)}>
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <CardTitle className="text-2xl font-serif">Invitation Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Bride&apos;s Name</Label>
                <Input
                  className="rounded-xl h-11"
                  value={form.brideName}
                  onChange={(e) => update("brideName", e.target.value)}
                  placeholder="Sarah"
                />
              </div>
              <div className="space-y-2">
                <Label>Groom&apos;s Name</Label>
                <Input
                  className="rounded-xl h-11"
                  value={form.groomName}
                  onChange={(e) => update("groomName", e.target.value)}
                  placeholder="John"
                />
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Event Date</Label>
                <Input
                  className="rounded-xl h-11"
                  type="date"
                  value={form.eventDate}
                  onChange={(e) => update("eventDate", e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label>Event Time</Label>
                <Input
                  className="rounded-xl h-11"
                  value={form.eventTime}
                  onChange={(e) => update("eventTime", e.target.value)}
                  placeholder="6:00 PM"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Venue Name</Label>
              <Input
                className="rounded-xl h-11"
                value={form.venue}
                onChange={(e) => update("venue", e.target.value)}
                placeholder="Grand Ballroom"
              />
            </div>
            
            <div className="pt-4 border-t border-border space-y-4">
              <div className="text-sm font-semibold text-primary uppercase tracking-wider">Contact Information</div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className={errors.email ? "text-destructive" : ""}>Email Address</Label>
                  <Input
                    className={`rounded-xl h-11 ${errors.email ? "border-destructive focus-visible:ring-destructive" : ""}`}
                    type="email"
                    value={form.email}
                    onChange={(e) => update("email", e.target.value)}
                    placeholder="your@email.com"
                  />
                  {errors.email && <p className="text-xs text-destructive mt-1">{errors.email}</p>}
                </div>
                <div className="space-y-2">
                  <Label className={errors.whatsapp ? "text-destructive" : ""}>WhatsApp Number</Label>
                  <div className="flex gap-2">
                    <Select
                      value={form.countryCode}
                      onValueChange={(val) => update("countryCode" as any, val)}
                    >
                      <SelectTrigger className="w-[160px] rounded-xl h-11 shrink-0">
                        <SelectValue placeholder="Country" />
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
                      placeholder="123456789"
                    />
                  </div>
                  {errors.whatsapp && <p className="text-xs text-destructive mt-1">{errors.whatsapp}</p>}
                </div>
              </div>
            </div>

            <Button 
              className="w-full h-12 text-lg rounded-full shadow-md hover:shadow-lg transition-all" 
              onClick={() => {
                if (validateStep2()) {
                  setStep(3)
                }
              }}
            >
              Next: Payment ({totalPrice} LE)
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
            <CardTitle className="text-2xl font-serif">Payment</CardTitle>
          </CardHeader>
          <CardContent className="space-y-8">
            <div className="p-4 rounded-2xl bg-primary/5 border border-primary/20 flex justify-between items-center">
              <div>
                <p className="text-sm text-muted-foreground font-medium uppercase">Total Amount</p>
                <p className="text-3xl font-bold text-primary">{totalPrice} LE</p>
              </div>
              <CreditCard className="w-10 h-10 text-primary opacity-20" />
            </div>

            <div className="space-y-4">
              <Label className="text-lg font-medium">Select Payment Method</Label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <button
                  type="button"
                  onClick={() => setPaymentMethod("instapay")}
                  className={`flex flex-col items-center justify-center p-6 rounded-2xl border-2 transition-all ${
                    paymentMethod === "instapay"
                      ? "border-primary bg-primary/5 shadow-md scale-[1.02]"
                      : "border-border hover:border-primary/30"
                  }`}
                >
                  <Smartphone className="w-8 h-8 mb-2 text-primary" />
                  <span className="font-semibold">InstaPay</span>
                </button>
                <button
                  type="button"
                  onClick={() => setPaymentMethod("bank")}
                  className={`flex flex-col items-center justify-center p-6 rounded-2xl border-2 transition-all ${
                    paymentMethod === "bank"
                      ? "border-primary bg-primary/5 shadow-md scale-[1.02]"
                      : "border-border hover:border-primary/30"
                  }`}
                >
                  <Landmark className="w-8 h-8 mb-2 text-primary" />
                  <span className="font-semibold">Bank Transfer</span>
                </button>
              </div>
            </div>

            <div className="p-6 rounded-2xl bg-muted/50 border border-border space-y-3">
              <p className="font-semibold text-foreground">Payment Details:</p>
              {paymentMethod === "instapay" ? (
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Address: <span className="text-foreground font-mono">user@instapay</span></p>
                  <p className="text-sm text-muted-foreground">Name: <span className="text-foreground">Digitiva Invitations</span></p>
                </div>
              ) : (
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Bank: <span className="text-foreground font-mono">CIB Bank</span></p>
                  <p className="text-sm text-muted-foreground">Account: <span className="text-foreground font-mono">1234 5678 9012 3456</span></p>
                  <p className="text-sm text-muted-foreground">Name: <span className="text-foreground">Digitiva Co.</span></p>
                </div>
              )}
            </div>

            <div className="space-y-4">
              <Label className="text-lg font-medium">Upload Payment Screenshot</Label>
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
                    {paymentScreenshot ? paymentScreenshot.name : "Click to upload screenshot"}
                  </p>
                  <p className="text-xs text-muted-foreground">PNG, JPG up to 10MB</p>
                </div>
              </div>
            </div>

            <Button
              className="w-full h-12 text-lg rounded-full shadow-md hover:shadow-lg transition-all"
              disabled={!paymentScreenshot || loading}
              onClick={handlePublish}
            >
              {loading ? "Processing..." : "Submit Payment"}
            </Button>
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
            <h2 className="text-3xl font-serif font-bold text-foreground">Payment Received!</h2>
            <p className="text-lg text-muted-foreground leading-relaxed max-w-md mx-auto">
              Thank you for choosing Digitiva. Your invitation is being crafted by our team.
            </p>
            <div className="p-6 rounded-2xl bg-primary/5 border border-primary/20 inline-block space-y-2">
              <p className="font-semibold text-primary">
                Your invitation will be ready and sent to you within 72 hours on your email or WhatsApp number.
              </p>
              <p className="text-sm text-primary/80 font-medium">
                One of our team will contact you within the next 24 hours.
              </p>
            </div>
            <div className="pt-8">
              <Button
                variant="outline"
                className="rounded-full px-8 hover:bg-primary/5"
                onClick={() => router.push("/")}
              >
                Back to Home
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

export default function CreateInvitationPage() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center min-h-screen">Loading...</div>}>
      <CreateInvitationContent />
    </Suspense>
  )
}


