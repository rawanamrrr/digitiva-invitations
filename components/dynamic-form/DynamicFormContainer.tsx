"use client"

import { DynamicSectionForm } from "./DynamicSectionForm"
import { validateSectionData } from "@/lib/sections-config"

interface DynamicFormContainerProps {
  selectedSections: string[]
  sectionsData: Record<string, Record<string, any>>
  onSectionDataChange: (sectionId: string, data: Record<string, any>) => void
  errors?: Record<string, Record<string, string>>
  getSectionLabel: (sectionId: string) => string
}

export function DynamicFormContainer({
  selectedSections,
  sectionsData,
  onSectionDataChange,
  errors = {},
  getSectionLabel,
}: DynamicFormContainerProps) {
  if (selectedSections.length === 0) {
    return null
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        {selectedSections
          .filter((sectionId) => !sectionId.startsWith("custom_"))
          .map((sectionId) => (
            <button
              key={sectionId}
              type="button"
              className="text-xs px-3 py-1.5 rounded-full border border-border bg-card hover:bg-muted transition-colors"
              onClick={() => {
                const el = document.getElementById(`section-form-${sectionId}`)
                el?.scrollIntoView({ behavior: "smooth", block: "start" })
              }}
            >
              {getSectionLabel(sectionId)}
            </button>
          ))}
      </div>
      {selectedSections.map((sectionId) => {
        // Skip custom sections (they don't have dynamic fields)
        if (sectionId.startsWith("custom_")) {
          return null
        }

        return (
          <DynamicSectionForm
            key={sectionId}
            sectionId={sectionId}
            sectionLabel={getSectionLabel(sectionId)}
            data={sectionsData[sectionId] || {}}
            onChange={onSectionDataChange}
            errors={errors[sectionId]}
            collapsible={false}
            defaultExpanded={true}
          />
        )
      })}
    </div>
  )
}

/**
 * Validate all sections data
 */
export function validateAllSections(
  selectedSections: string[],
  sectionsData: Record<string, Record<string, any>>
): {
  valid: boolean
  errors: Record<string, Record<string, string>>
} {
  const allErrors: Record<string, Record<string, string>> = {}
  let isValid = true

  for (const sectionId of selectedSections) {
    // Skip custom sections
    if (sectionId.startsWith("custom_")) continue

    const data = sectionsData[sectionId] || {}
    const validation = validateSectionData(sectionId, data)

    if (!validation.valid) {
      allErrors[sectionId] = validation.errors
      isValid = false
    }
  }

  return {
    valid: isValid,
    errors: allErrors,
  }
}
