import React from "react"
import { BarChart3 } from "lucide-react"
import { Button } from "@/components/ui/button"

export function AnalyticsButton({ propertyId }: { propertyId: string }) {
  // Generates the GA4 dashboard URL based on the Property ID
  const analyticsUrl = `https://analytics.google.com/analytics/web/#/p${propertyId}/reports/intelligenthome`

  return (
    <Button variant="outline" className="gap-2 shrink-0 p-0 overflow-hidden" title="View Google Analytics">
      <a 
        href={analyticsUrl} 
        target="_blank" 
        rel="noopener noreferrer" 
        className="flex items-center gap-2 px-4 py-2 w-full h-full"
        onClick={(e) => {
          // Fallback for some mobile browsers that might block target="_blank"
          if (typeof window !== 'undefined' && /iPhone|iPad|iPod|Android/i.test(navigator.userAgent)) {
            // Optional: log or handle specific mobile behavior
          }
        }}
      >
        <BarChart3 className="w-4 h-4" />
        View Analytics
      </a>
    </Button>
  )
}
