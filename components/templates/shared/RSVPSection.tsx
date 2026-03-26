"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { useTranslation } from "@/lib/template-translations"
import { useLanguage } from "@/contexts/LanguageContext"

export default function RSVPSection() {
  const t = useTranslation()
  const { language } = useLanguage()
  const [name, setName] = useState("")
  const [attending, setAttending] = useState<"yes" | "no" | "">("")
  const [guests, setGuests] = useState("1")
  const [guestNames, setGuestNames] = useState<string[]>([""])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [message, setMessage] = useState<{
    text: string
    type: "" | "success" | "error" | "info"
  }>({ text: "", type: "" })

  const handleGuestsChange = (v: string) => {
    setGuests(v)
    const n = parseInt(v, 10) || 0
    setGuestNames((p) => {
      const next = [...p]
      while (next.length < n) next.push("")
      next.length = n
      return next
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim() || (attending !== "yes" && attending !== "no")) {
      setMessage({ text: t("rsvpError"), type: "error" })
      return
    }
    if (attending === "yes") {
      const n = parseInt(guests, 10) || 0
      if (n < 1 || guestNames.slice(0, n).some((g) => !g.trim())) {
        setMessage({ text: t("rsvpError"), type: "error" })
        return
      }
    }
    setIsSubmitting(true)
    setMessage({ text: language === "ar" ? "جاري الإرسال..." : "Submitting...", type: "info" })
    try {
      const fd = new FormData()
      fd.append("name", name.trim())
      fd.append("attending", attending)
      fd.append("guests", attending === "yes" ? guests : "0")
      fd.append("type", "rsvp")
      if (attending === "yes")
        fd.append("guestNames", guestNames.slice(0, parseInt(guests, 10)).join(", "))
      const res = await fetch("/api/send-email", { method: "POST", body: fd })
      const data = await res.json()
      if (!res.ok || !data.success) throw new Error("Failed")
      setMessage({ text: t("rsvpSuccess"), type: "success" })
      setName("")
      setAttending("")
      setGuests("1")
      setGuestNames([""])
    } catch {
      setMessage({ text: t("rsvpError"), type: "error" })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <section
      id="rsvp"
      className="relative py-20 px-4 md:py-32 bg-gradient-to-b from-accent/5 via-background to-transparent overflow-hidden"
    >
      <div className="max-w-3xl mx-auto">
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="font-luxury text-4xl md:text-6xl text-foreground mb-4">
            {t("rsvpTitle")}
          </h2>
          <p className="font-luxury text-lg text-muted-foreground mb-8 italic">
            {t("rsvpDescription")}
          </p>
        </motion.div>
        <motion.div
          className="relative bg-card/95 border-4 border-accent/40 p-8 md:p-12 shadow-2xl rounded-lg"
          initial={{ scale: 0.95, opacity: 0, y: 50 }}
          whileInView={{ scale: 1, opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium mb-2">{t("rsvpFormName")}</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder={t("rsvpFormName")}
                className="w-full px-4 py-3 border-2 border-accent/30 rounded-lg bg-background/50"
                required
                disabled={isSubmitting}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-3">
                {language === "ar" ? "حالة الحضور" : "Attendance"}
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setAttending("yes")}
                  className={`px-4 py-2 rounded-lg border-2 ${
                    attending === "yes" ? "bg-accent text-white border-accent" : "border-accent/30"
                  }`}
                  disabled={isSubmitting}
                >
                  {language === "ar" ? "سأحضر" : "Attending"}
                </button>
                <button
                  type="button"
                  onClick={() => setAttending("no")}
                  className={`px-4 py-2 rounded-lg border-2 ${
                    attending === "no" ? "bg-accent text-white border-accent" : "border-accent/30"
                  }`}
                  disabled={isSubmitting}
                >
                  {language === "ar" ? "لن أتمكن من الحضور" : "Not attending"}
                </button>
              </div>
            </div>
            {attending === "yes" && (
              <>
                <div>
                  <label className="block text-sm font-medium mb-2">{t("rsvpFormGuests")}</label>
                  <select
                    value={guests}
                    onChange={(e) => handleGuestsChange(e.target.value)}
                    className="w-full px-4 py-3 border-2 border-accent/30 rounded-lg bg-background/50"
                    disabled={isSubmitting}
                  >
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((n) => (
                      <option key={n} value={n}>
                        {n} {n === 1 ? (language === "ar" ? "ضيف" : "Guest") : language === "ar" ? "ضيوف" : "Guests"}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="space-y-3">
                  {Array.from({ length: parseInt(guests, 10) || 0 }).map((_, i) => (
                    <input
                      key={i}
                      type="text"
                      value={guestNames[i] || ""}
                      onChange={(e) => {
                        const next = [...guestNames]
                        next[i] = e.target.value
                        setGuestNames(next)
                      }}
                      placeholder={language === "ar" ? `اسم الضيف ${i + 1}` : `Guest ${i + 1} Name`}
                      className="w-full px-4 py-3 border-2 border-accent/30 rounded-lg bg-background/50"
                      disabled={isSubmitting}
                    />
                  ))}
                </div>
              </>
            )}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-4 bg-accent text-accent-foreground rounded-lg font-medium text-lg disabled:opacity-50"
            >
              {isSubmitting ? (language === "ar" ? "جاري الإرسال..." : "Submitting...") : t("rsvpFormSubmit")}
            </button>
            {message.text && (
              <p
                className={`p-4 rounded text-center ${
                  message.type === "error"
                    ? "bg-red-100 text-red-700"
                    : message.type === "success"
                      ? "bg-green-100 text-green-700"
                      : "bg-blue-100 text-blue-700"
                }`}
              >
                {message.text}
              </p>
            )}
          </form>
        </motion.div>
      </div>
    </section>
  )
}
