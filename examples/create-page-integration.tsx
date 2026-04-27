/**
 * EXAMPLE: Complete Integration of Dynamic Form System
 * 
 * This file shows how to integrate the dynamic form system into your create page.
 * Copy the relevant parts into your actual app/create/page.tsx
 */

"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent } from "@/components/ui/card"
import { DynamicFormContainer } from "@/components/dynamic-form/DynamicFormContainer"
import { useDynamicSections } from "@/hooks/use-dynamic-sections"
import { createClient } from "@/lib/supabase/client"

export default function CreatePageExample() {
  // ========================================
  // EXISTING STATE (keep your current state)
  // ========================================
  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [selectedPackage, setSelectedPackage] = useState<"standard" | "premium">("standard")
  const [selectedSections, setSelectedSections] = useState<string[]>([])
  
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
    templateId: "",
  })

  // ========================================
  // NEW: Dynamic Sections Hook
  // ========================================
  const {
    sectionsData,
    errors: sectionErrors,
    updateSectionData,
    validateSections,
    clearSectionData,
    hasErrors,
  } = useDynamicSections()

  // ========================================
  // MODIFIED: Toggle Section (with cleanup)
  // ========================================
  const toggleSection = (id: string) => {
    setSelectedSections((prev) => {
      const isRemoving = prev.includes(id)
      
      // Clear section data when removing
      if (isRemoving) {
        clearSectionData(id)
      }
      
      return isRemoving 
        ? prev.filter((s) => s !== id) 
        : [...prev, id]
    })
  }

  // ========================================
  // HELPER: Upload Section Files
  // ========================================
  async function uploadSectionFiles(
    sectionsData: Record<string, Record<string, any>>
  ): Promise<Record<string, Record<string, any>>> {
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

  // ========================================
  // MODIFIED: Handle Publish (with sections)
  // ========================================
  const handlePublish = async () => {
    setLoading(true)
    try {
      // 1. Validate basic form
      if (!form.brideName || !form.groomName || !form.eventDate) {
        alert("Please fill in all required fields")
        setLoading(false)
        return
      }

      // 2. Validate sections
      if (!validateSections(selectedSections)) {
        alert("Please complete all required section fields")
        setLoading(false)
        return
      }

      // 3. Upload section files
      console.log("Uploading section files...")
      const preparedSections = await uploadSectionFiles(sectionsData)

      // 4. Create invitation
      console.log("Creating invitation...")
      const invitationPayload = {
        brideName: form.brideName,
        groomName: form.groomName,
        eventType: form.eventType,
        eventDate: form.eventDate,
        eventTime: form.eventTime,
        venue: form.venue,
        templateId: form.templateId,
        packageName: selectedPackage,
        email: form.email,
        whatsapp: `${form.countryCode}${form.whatsapp}`,
      }

      const res = await fetch("/api/invitations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(invitationPayload),
      })
      
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || "Failed to create invitation")

      const invitationId = data.invitation.id

      // 5. Save sections data
      console.log("Saving sections data...")
      const sectionsRes = await fetch(`/api/invitations/${invitationId}/sections`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sectionsData: preparedSections }),
      })

      if (!sectionsRes.ok) {
        const sectionsError = await sectionsRes.json()
        console.error("Failed to save sections:", sectionsError)
        // Continue anyway - sections can be added later
      }

      console.log("Success!")
      setStep(4) // Success step
    } catch (e) {
      console.error("Error creating invitation:", e)
      alert(e instanceof Error ? e.message : "Failed to create invitation")
    } finally {
      setLoading(false)
    }
  }

  // ========================================
  // RENDER: Step 2 with Dynamic Forms
  // ========================================
  return (
    <div className="max-w-3xl mx-auto py-8 px-4">
      {step === 1 && (
        <div className="space-y-8">
          <h2 className="text-2xl font-bold">Step 1: Choose Template & Sections</h2>
          
          {/* Template selection (your existing code) */}
          
          {/* Section selection (your existing code) */}
          <div className="grid grid-cols-4 gap-3">
            {["countdown", "venueMap", "messages", "ourStory", "rsvp", "photoUpload"].map((id) => (
              <button
                key={id}
                onClick={() => toggleSection(id)}
                className={`p-4 border rounded-lg ${
                  selectedSections.includes(id) 
                    ? "border-primary bg-primary/5" 
                    : "border-border"
                }`}
              >
                {id}
              </button>
            ))}
          </div>

          <Button 
            onClick={() => setStep(2)}
            disabled={selectedSections.length === 0}
          >
            Continue
          </Button>
        </div>
      )}

      {step === 2 && (
        <div className="space-y-8">
          <h2 className="text-2xl font-bold">Step 2: Enter Details</h2>

          {/* Basic Information Card */}
          <Card>
            <CardContent className="space-y-4 pt-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Bride Name *</Label>
                  <Input
                    value={form.brideName}
                    onChange={(e) => setForm({ ...form, brideName: e.target.value })}
                    placeholder="Enter bride name"
                  />
                </div>
                <div>
                  <Label>Groom Name *</Label>
                  <Input
                    value={form.groomName}
                    onChange={(e) => setForm({ ...form, groomName: e.target.value })}
                    placeholder="Enter groom name"
                  />
                </div>
                <div>
                  <Label>Event Date *</Label>
                  <Input
                    type="date"
                    value={form.eventDate}
                    onChange={(e) => setForm({ ...form, eventDate: e.target.value })}
                  />
                </div>
                <div>
                  <Label>Event Time *</Label>
                  <Input
                    type="time"
                    value={form.eventTime}
                    onChange={(e) => setForm({ ...form, eventTime: e.target.value })}
                  />
                </div>
                <div className="col-span-2">
                  <Label>Venue *</Label>
                  <Input
                    value={form.venue}
                    onChange={(e) => setForm({ ...form, venue: e.target.value })}
                    placeholder="Enter venue name"
                  />
                </div>
                <div>
                  <Label>Email *</Label>
                  <Input
                    type="email"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    placeholder="your@email.com"
                  />
                </div>
                <div>
                  <Label>WhatsApp *</Label>
                  <Input
                    value={form.whatsapp}
                    onChange={(e) => setForm({ ...form, whatsapp: e.target.value })}
                    placeholder="1234567890"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* ========================================
              NEW: Dynamic Section Forms
              ======================================== */}
          <DynamicFormContainer
            selectedSections={selectedSections}
            sectionsData={sectionsData}
            onSectionDataChange={updateSectionData}
            errors={sectionErrors}
            getSectionLabel={(id) => {
              // Map section IDs to display labels
              const labels: Record<string, string> = {
                countdown: "Countdown Timer",
                venueMap: "Venue Map",
                messages: "Messages",
                ourStory: "Our Story",
                rsvp: "RSVP Settings",
                photoUpload: "Photo Gallery",
                song: "Background Music",
                timeline: "Event Timeline",
                dressCode: "Dress Code",
                transport: "Transportation",
                giftList: "Gift Registry",
                guestNotes: "Guest Notes",
              }
              return labels[id] || id
            }}
          />

          {/* Show validation errors */}
          {hasErrors && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-600 font-medium">
                Please fix the errors in the sections above
              </p>
            </div>
          )}

          {/* Navigation */}
          <div className="flex gap-4">
            <Button variant="outline" onClick={() => setStep(1)}>
              Back
            </Button>
            <Button 
              onClick={() => setStep(3)}
              disabled={hasErrors}
            >
              Continue to Payment
            </Button>
          </div>
        </div>
      )}

      {step === 3 && (
        <div className="space-y-8">
          <h2 className="text-2xl font-bold">Step 3: Payment</h2>
          
          {/* Payment form (your existing code) */}

          <Button 
            onClick={handlePublish}
            disabled={loading}
          >
            {loading ? "Creating..." : "Complete Order"}
          </Button>
        </div>
      )}

      {step === 4 && (
        <div className="text-center space-y-4">
          <h2 className="text-3xl font-bold text-green-600">Success!</h2>
          <p>Your invitation has been created successfully.</p>
        </div>
      )}
    </div>
  )
}
