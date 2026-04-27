"use client"

import { useState, useCallback, useEffect } from "react"
import { validateAllSections } from "@/components/dynamic-form/DynamicFormContainer"

export interface UseDynamicSectionsReturn {
  sectionsData: Record<string, Record<string, any>>
  errors: Record<string, Record<string, string>>
  updateSectionData: (sectionId: string, data: Record<string, any>) => void
  validateSections: (selectedSections: string[]) => boolean
  clearSectionData: (sectionId: string) => void
  resetAllSections: () => void
  getSectionData: (sectionId: string) => Record<string, any>
  hasErrors: boolean
}

/**
 * Hook for managing dynamic sections form state
 */
export function useDynamicSections(): UseDynamicSectionsReturn {
  const [sectionsData, setSectionsData] = useState<Record<string, Record<string, any>>>({})
  const [errors, setErrors] = useState<Record<string, Record<string, string>>>({})

  const updateSectionData = useCallback((sectionId: string, data: Record<string, any>) => {
    setSectionsData((prev) => ({
      ...prev,
      [sectionId]: data,
    }))

    // Clear errors for this section when data changes
    setErrors((prev) => {
      const newErrors = { ...prev }
      delete newErrors[sectionId]
      return newErrors
    })
  }, [])

  const validateSections = useCallback(
    (selectedSections: string[]) => {
      const validation = validateAllSections(selectedSections, sectionsData)
      setErrors(validation.errors)
      return validation.valid
    },
    [sectionsData]
  )

  const clearSectionData = useCallback((sectionId: string) => {
    setSectionsData((prev) => {
      const newData = { ...prev }
      delete newData[sectionId]
      return newData
    })

    setErrors((prev) => {
      const newErrors = { ...prev }
      delete newErrors[sectionId]
      return newErrors
    })
  }, [])

  const resetAllSections = useCallback(() => {
    setSectionsData({})
    setErrors({})
  }, [])

  const getSectionData = useCallback(
    (sectionId: string) => {
      return sectionsData[sectionId] || {}
    },
    [sectionsData]
  )

  const hasErrors = Object.keys(errors).length > 0

  return {
    sectionsData,
    errors,
    updateSectionData,
    validateSections,
    clearSectionData,
    resetAllSections,
    getSectionData,
    hasErrors,
  }
}
