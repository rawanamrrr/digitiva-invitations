"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { Button } from "@/components/ui/button"
import { X, Plus, Trash2 } from "lucide-react"
import { FieldConfig } from "@/lib/sections-config"
import { useSiteLanguage } from "@/contexts/SiteLanguageContext"

interface DynamicFieldProps {
  field: FieldConfig
  value: any
  onChange: (value: any) => void
  error?: string
}

export function DynamicField({ field, value, onChange, error }: DynamicFieldProps) {
  const { t } = useSiteLanguage()
  const [timelineEvents, setTimelineEvents] = useState<Array<{ time: string; title: string; description?: string }>>(
    value || [{ time: "", title: "", description: "" }]
  )

  const tt = (raw?: string) => {
    if (!raw) return raw
    if (raw.startsWith("create.")) return t(raw)
    return raw
  }

  const handleTimelineChange = (index: number, key: string, val: string) => {
    const updated = [...timelineEvents]
    updated[index] = { ...updated[index], [key]: val }
    setTimelineEvents(updated)
    onChange(updated)
  }

  const addTimelineEvent = () => {
    const updated = [...timelineEvents, { time: "", title: "", description: "" }]
    setTimelineEvents(updated)
    onChange(updated)
  }

  const removeTimelineEvent = (index: number) => {
    const updated = timelineEvents.filter((_, i) => i !== index)
    setTimelineEvents(updated)
    onChange(updated)
  }

  const renderField = () => {
    switch (field.type) {
      case "text":
      case "email":
      case "tel":
      case "url":
        return (
          <Input
            type={field.type}
            placeholder={tt(field.placeholder)}
            value={value || ""}
            onChange={(e) => onChange(e.target.value)}
            className={error ? "border-red-500" : ""}
          />
        )

      case "number":
        return (
          <Input
            type="number"
            placeholder={tt(field.placeholder)}
            value={value || ""}
            onChange={(e) => onChange(e.target.value)}
            min={field.validation?.min}
            max={field.validation?.max}
            className={error ? "border-red-500" : ""}
          />
        )

      case "date":
      case "time":
        return (
          <Input
            type={field.type}
            value={value || ""}
            onChange={(e) => onChange(e.target.value)}
            className={error ? "border-red-500" : ""}
          />
        )

      case "textarea":
        return (
          <Textarea
            placeholder={tt(field.placeholder)}
            value={value || ""}
            onChange={(e) => onChange(e.target.value)}
            rows={4}
            className={error ? "border-red-500" : ""}
          />
        )

      case "boolean":
        return (
          <div className="flex items-center space-x-2">
            <Checkbox
              checked={value || false}
              onCheckedChange={(checked) => onChange(checked)}
            />
            <span className="text-sm text-muted-foreground">
              {tt(field.helpText) || t("create.field.common.enableOption")}
            </span>
          </div>
        )

      case "file":
      case "audio":
        return (
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Input
                type="file"
                accept={field.accept}
                onChange={(e) => {
                  const file = e.target.files?.[0]
                  if (file) onChange(file)
                }}
                className={error ? "border-red-500" : ""}
              />
              {value && (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => onChange(null)}
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>
            {value && typeof value === "object" && (
              <p className="text-xs text-muted-foreground">
                {t("create.field.common.selected")} {value.name}
              </p>
            )}
          </div>
        )

      case "multifile":
        const files = Array.isArray(value) ? value : []
        return (
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Input
                type="file"
                accept={field.accept}
                multiple={field.multiple}
                onChange={(e) => {
                  const newFiles = Array.from(e.target.files || [])
                  onChange([...files, ...newFiles])
                }}
                className={error ? "border-red-500" : ""}
              />
            </div>
            {files.length > 0 && (
              <div className="space-y-2">
                <p className="text-sm font-medium">
                  {files.length} {t("create.field.common.filesSelected")}
                </p>
                <div className="grid grid-cols-2 gap-2">
                  {files.map((file: File, index: number) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-2 bg-muted rounded-md text-xs"
                    >
                      <span className="truncate flex-1">{file.name}</span>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          const updated = files.filter((_, i) => i !== index)
                          onChange(updated)
                        }}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )

      case "timeline":
        return (
          <div className="space-y-4">
            {timelineEvents.map((event, index) => (
              <div
                key={index}
                className="p-4 border rounded-lg space-y-3 bg-card"
              >
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">{t("create.field.timeline.event")} {index + 1}</span>
                  {timelineEvents.length > 1 && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeTimelineEvent(index)}
                    >
                      <Trash2 className="h-4 w-4 text-red-500" />
                    </Button>
                  )}
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="min-w-0">
                    <Label className="text-xs">{t("create.field.timeline.time")}</Label>
                    <Input
                      type="time"
                      value={event.time}
                      onChange={(e) =>
                        handleTimelineChange(index, "time", e.target.value)
                      }
                      placeholder={t("create.field.timeline.timePlaceholder")}
                      className="w-full"
                    />
                  </div>
                  <div className="min-w-0">
                    <Label className="text-xs">{t("create.field.timeline.eventTitle")}</Label>
                    <Input
                      type="text"
                      value={event.title}
                      onChange={(e) =>
                        handleTimelineChange(index, "title", e.target.value)
                      }
                      placeholder={t("create.field.timeline.eventTitlePlaceholder")}
                      className="w-full"
                    />
                  </div>
                </div>
                <div>
                  <Label className="text-xs">{t("create.field.timeline.descriptionOptional")}</Label>
                  <Textarea
                    value={event.description || ""}
                    onChange={(e) =>
                      handleTimelineChange(index, "description", e.target.value)
                    }
                    placeholder={t("create.field.timeline.descriptionPlaceholder")}
                    rows={2}
                  />
                </div>
              </div>
            ))}
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={addTimelineEvent}
              className="w-full"
            >
              <Plus className="h-4 w-4 mr-2" />
              {t("create.field.timeline.addEvent")}
            </Button>
          </div>
        )

      default:
        return (
          <Input
            type="text"
            placeholder={tt(field.placeholder)}
            value={value || ""}
            onChange={(e) => onChange(e.target.value)}
            className={error ? "border-red-500" : ""}
          />
        )
    }
  }

  return (
    <div className="space-y-2">
      <Label htmlFor={field.name} className="text-sm font-medium">
        {tt(field.label)}
        {field.required && <span className="text-red-500 ml-1">*</span>}
      </Label>
      {renderField()}
      {field.helpText && field.type !== "boolean" && !error && (
        <p className="text-xs text-muted-foreground">{tt(field.helpText)}</p>
      )}
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  )
}
