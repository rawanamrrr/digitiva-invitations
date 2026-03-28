"use client"

import { useSiteLanguage } from "@/contexts/SiteLanguageContext"

export function AdminDenied() {
  const { t } = useSiteLanguage()
  return (
    <div className="min-h-screen flex items-center justify-center">
      <p className="text-muted-foreground">{t("admin.denied")}</p>
    </div>
  )
}
