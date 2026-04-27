"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { DynamicField } from "./DynamicField"
import { getSectionFields, validateSectionData } from "@/lib/sections-config"
import { ChevronDown, ChevronUp } from "lucide-react"
import { Button } from "@/components/ui/button"

interface DynamicSectionFormProps {
  sectionId: string
  sectionLabel: string
  data: Record<string, any>
  onChange: (sectionId: string, data: Record<string, any>) => void
  errors?: Record<string, string>
  collapsible?: boolean
  defaultExpanded?: boolean
}

export function DynamicSectionForm({
  sectionId,
  sectionLabel,
  data,
  onChange,
  errors = {},
  collapsible = true,
  defaultExpanded = true,
}: DynamicSectionFormProps) {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded)
  const fields = getSectionFields(sectionId)

  const handleFieldChange = (fieldName: string, value: any) => {
    const updatedData = { ...data, [fieldName]: value }
    onChange(sectionId, updatedData)
  }

  if (fields.length === 0) {
    return null
  }

  return (
    <Card className="border-2 border-primary/20 bg-primary/5 animate-in fade-in slide-in-from-top-2 duration-300">
      <CardHeader
        className={collapsible ? "cursor-pointer" : ""}
        onClick={() => collapsible && setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold text-primary">
            {sectionLabel}
          </CardTitle>
          {collapsible && (
            <Button variant="ghost" size="sm" type="button">
              {isExpanded ? (
                <ChevronUp className="h-5 w-5" />
              ) : (
                <ChevronDown className="h-5 w-5" />
              )}
            </Button>
          )}
        </div>
      </CardHeader>
      {isExpanded && (
        <CardContent className="space-y-4 pt-0">
          {fields.map((field) => (
            <DynamicField
              key={field.name}
              field={field}
              value={data[field.name]}
              onChange={(value) => handleFieldChange(field.name, value)}
              error={errors[field.name]}
            />
          ))}
        </CardContent>
      )}
    </Card>
  )
}
