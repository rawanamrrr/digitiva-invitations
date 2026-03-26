"use client"

import { motion } from "framer-motion"
import { useLanguage } from "@/contexts/LanguageContext"
import { ShieldAlert } from "lucide-react"

export default function PhotoUploadSection() {
  const { language } = useLanguage()

  return (
    <motion.section
      className="relative py-20 px-4 md:py-32 bg-gradient-to-b from-transparent via-accent/5 to-transparent overflow-hidden"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
    >
      <div className="max-w-6xl mx-auto">
        <motion.div
          className="text-center mb-20"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <div className="flex items-center justify-center gap-4 mb-8">
            <div className="w-24 h-px bg-accent/40" />
            <ShieldAlert className="w-6 h-6 text-accent" />
            <div className="w-24 h-px bg-accent/40" />
          </div>
          <h2 className="font-luxury text-5xl md:text-6xl text-foreground mb-4">
            {language === "ar" ? "تنبيه" : "Gentle Reminder"}
          </h2>
        </motion.div>
        <motion.div
          className="max-w-3xl mx-auto bg-card border-2 border-accent/20 rounded-3xl p-10 md:p-14 shadow-2xl"
          initial={{ scale: 0.9, opacity: 0, y: 50 }}
          whileInView={{ scale: 1, opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <p className="font-luxury text-xl md:text-2xl text-foreground text-center" dir="rtl">
            الرجاء حضور الرجال ببدل كاملة رسمية
          </p>
        </motion.div>
      </div>
    </motion.section>
  )
}
