"use client"

import { useState, useEffect, Suspense } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Check, CreditCard, Upload, Smartphone, Landmark, ArrowLeft, CheckCircle2 } from "lucide-react"
import { templates } from "@/lib/templates"

type PackageId = "standard" | "premium" | "custom"

const PACKAGE_SECTIONS: Record<
  PackageId,
  {
    label: string
    price: number
    description: string
    sections: { id: string; label: string; helper?: string }[]
  }
> = {
  standard: {
    label: "Standard Package",
    price: 500,
    description: "Template, countdown, venue details, and messages",
    sections: [
      { id: "countdown", label: "Countdown timer" },
      { id: "venueMap", label: "Venue map section" },
      { id: "handwrittenMessage", label: "Messages / wishes section" },
    ],
  },
  premium: {
    label: "Premium Package",
    price: 600,
    description: "All standard sections plus RSVP, gallery, and music",
    sections: [
      { id: "countdown", label: "Countdown timer" },
      { id: "venueMap", label: "Venue map section" },
      { id: "handwrittenMessage", label: "Messages / Our story" },
      { id: "rsvp", label: "RSVP (attendance confirmation)" },
      { id: "photoUpload", label: "Photo upload / gallery section" },
      { id: "song", label: "Background music" },
    ],
  },
  custom: {
    label: "Customized Package",
    price: 900,
    description: "Choose exactly the sections you want",
    sections: [
      { id: "countdown", label: "Countdown timer" },
      { id: "venueMap", label: "Venue map section" },
      { id: "handwrittenMessage", label: "Messages / Our story" },
      { id: "rsvp", label: "RSVP (attendance confirmation)" },
      { id: "photoUpload", label: "Photo upload / gallery section" },
      { id: "song", label: "Background music" },
    ],
  },
}

function CreateInvitationContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [selectedPackage, setSelectedPackage] = useState<PackageId>("premium")
  const [selectedSections, setSelectedSections] = useState<string[]>(
    PACKAGE_SECTIONS.premium.sections.map((s) => s.id),
  )
  const [paymentMethod, setPaymentMethod] = useState<"instapay" | "bank">("instapay")
  const [paymentScreenshot, setPaymentScreenshot] = useState<File | null>(null)

  const [form, setForm] = useState({
    brideName: "",
    groomName: "",
    eventDate: "",
    eventTime: "",
    venue: "",
    email: "",
    whatsapp: "",
    templateId: searchParams.get("template") || "lamis",
  })

  const update = (k: keyof typeof form, v: string) =>
    setForm((p) => ({ ...p, [k]: v }))

  const handlePackageChange = (pkg: PackageId) => {
    setSelectedPackage(pkg)
    setSelectedSections(PACKAGE_SECTIONS[pkg].sections.map((s) => s.id))
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
          sections: selectedSections,
          email: form.email,
          whatsapp: form.whatsapp,
          paymentMethod,
          paymentScreenshot: screenshotUrl,
        }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || "Failed to create invitation")

      setStep(4)
    } catch (e) {
      alert(e instanceof Error ? e.message : "Something went wrong")
    } finally {
      setLoading(false)
    }
  }

  const currentPackageConfig = PACKAGE_SECTIONS[selectedPackage]
  const totalPrice = PACKAGE_SECTIONS[selectedPackage].price

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
            <span>Sections</span>
            <span>Details</span>
            <span>Payment</span>
          </div>
        </div>
      )}

      {step === 1 && (
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
                    <div className="text-xs text-muted-foreground mt-1">
                      {pkg.description}
                    </div>
                    <div className="mt-2 font-bold text-primary">{pkg.price} LE</div>
                  </button>
                )
              })}
            </div>

            <div className="space-y-4">
              <div className="text-sm font-medium text-foreground">
                Included Sections
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {currentPackageConfig.sections.map((section) => (
                  <label
                    key={section.id}
                    className="flex items-start gap-3 rounded-xl border border-border p-4 text-sm cursor-pointer hover:border-primary/60 transition-colors group"
                  >
                    <div className="relative flex items-center">
                      <input
                        type="checkbox"
                        className="peer h-5 w-5 cursor-pointer appearance-none rounded border border-border transition-all checked:border-primary checked:bg-primary"
                        checked={selectedSections.includes(section.id)}
                        onChange={() => toggleSection(section.id)}
                      />
                      <Check className="absolute h-3.5 w-3.5 text-white opacity-0 peer-checked:opacity-100 transition-opacity left-[3px]" />
                    </div>
                    <div className="flex flex-col">
                      <span className="font-medium text-foreground group-hover:text-primary transition-colors">{section.label}</span>
                      {section.helper && (
                        <span className="text-xs text-muted-foreground">
                          {section.helper}
                        </span>
                      )}
                    </div>
                  </label>
                ))}
              </div>
            </div>

            <Button className="w-full h-12 text-lg rounded-full" onClick={() => setStep(2)}>
              Next: Invitation Details
            </Button>
          </CardContent>
        </Card>
      )}

      {step === 2 && (
        <Card className="border-none shadow-lg bg-card/50 backdrop-blur-sm">
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
                  <Label>Email Address</Label>
                  <Input
                    className="rounded-xl h-11"
                    type="email"
                    value={form.email}
                    onChange={(e) => update("email", e.target.value)}
                    placeholder="your@email.com"
                  />
                </div>
                <div className="space-y-2">
                  <Label>WhatsApp Number</Label>
                  <Input
                    className="rounded-xl h-11"
                    value={form.whatsapp}
                    onChange={(e) => update("whatsapp", e.target.value)}
                    placeholder="+20 123 456 7890"
                  />
                </div>
              </div>
            </div>

            <Button className="w-full h-12 text-lg rounded-full" onClick={() => setStep(3)}>
              Next: Payment ({totalPrice} LE)
            </Button>
          </CardContent>
        </Card>
      )}

      {step === 3 && (
        <Card className="border-none shadow-lg bg-card/50 backdrop-blur-sm">
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
                      ? "border-primary bg-primary/5 shadow-md"
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
                      ? "border-primary bg-primary/5 shadow-md"
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
              className="w-full h-12 text-lg rounded-full"
              disabled={!paymentScreenshot || loading}
              onClick={handlePublish}
            >
              {loading ? "Processing..." : "Submit Payment"}
            </Button>
          </CardContent>
        </Card>
      )}

      {step === 4 && (
        <Card className="border-none shadow-2xl bg-card/50 backdrop-blur-sm overflow-hidden">
          <div className="bg-gradient-to-r from-primary to-teal h-2 w-full" />
          <CardContent className="p-12 text-center space-y-6">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 className="w-12 h-12 text-green-600 animate-in zoom-in duration-500" />
            </div>
            <h2 className="text-3xl font-serif font-bold text-foreground">Payment Received!</h2>
            <p className="text-lg text-muted-foreground leading-relaxed max-w-md mx-auto">
              Thank you for choosing Digitiva. Your invitation is being crafted by our team.
            </p>
            <div className="p-6 rounded-2xl bg-primary/5 border border-primary/20 inline-block">
              <p className="font-semibold text-primary">
                Your invitation will be ready and sent to you within 72 hours on your email or WhatsApp number.
              </p>
            </div>
            <div className="pt-8">
              <Button
                variant="outline"
                className="rounded-full px-8"
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

