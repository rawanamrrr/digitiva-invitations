/**
 * Dynamic Sections Configuration
 * 
 * This config-driven approach allows easy addition of new sections
 * without modifying core logic. Each section defines its own fields.
 */

export type FieldType = 
  | "text" 
  | "textarea" 
  | "url" 
  | "number" 
  | "boolean" 
  | "email"
  | "tel"
  | "date"
  | "time"
  | "file"
  | "multifile"
  | "audio"
  | "timeline"

export interface FieldConfig {
  name: string
  label: string
  type: FieldType
  placeholder?: string
  required?: boolean
  validation?: {
    min?: number
    max?: number
    pattern?: RegExp
    message?: string
  }
  accept?: string // for file inputs
  multiple?: boolean // for file inputs
  helpText?: string
}

export interface SectionConfig {
  id: string
  fields: FieldConfig[]
  icon?: string
}

/**
 * Sections Configuration Map
 * Add new sections here - no core logic changes needed!
 */
export const SECTIONS_CONFIG: Record<string, SectionConfig> = {
  venueMap: {
    id: "venueMap",
    fields: [
      {
        name: "map_url",
        label: "create.field.venueMap.map_url.label",
        type: "url",
        placeholder: "create.field.venueMap.map_url.placeholder",
        required: true,
        validation: {
          pattern: /^https?:\/\/.+/,
          message: "Please enter a valid URL"
        },
        helpText: "create.field.venueMap.map_url.help"
      }
    ]
  },
  
  ourStory: {
    id: "ourStory",
    fields: [
      {
        name: "story_text",
        label: "create.field.ourStory.story_text.label",
        type: "textarea",
        placeholder: "create.field.ourStory.story_text.placeholder",
        required: true
      }
    ]
  },
  
  messages: {
    id: "messages",
    fields: []
  },
  
  rsvp: {
    id: "rsvp",
    fields: [
      {
        name: "max_guests",
        label: "create.field.rsvp.max_guests.label",
        type: "number",
        placeholder: "create.field.rsvp.max_guests.placeholder",
        required: false,
        validation: {
          min: 1,
          max: 20,
          message: "Must be between 1 and 20"
        },
        helpText: "create.field.rsvp.max_guests.help"
      },
      {
        name: "rsvp_deadline",
        label: "create.field.rsvp.rsvp_deadline.label",
        type: "date",
        required: false,
        helpText: "create.field.rsvp.rsvp_deadline.help"
      }
    ]
  },
  
  photoUpload: {
    id: "photoUpload",
    fields: [
      {
        name: "gallery_images",
        label: "create.field.photoUpload.gallery_images.label",
        type: "multifile",
        accept: "image/*",
        multiple: true,
        required: true,
        validation: {
          min: 1,
          message: "Please upload at least 1 image"
        },
        helpText: "create.field.photoUpload.gallery_images.help"
      }
    ]
  },
  
  song: {
    id: "song",
    fields: [

      {
        name: "music_url",
        label: "create.field.song.music_url.label",
        type: "url",
        placeholder: "create.field.song.music_url.placeholder",
        required: false,
        helpText: "create.field.song.music_url.help"
      },
      {
        name: "music_file",
        label: "create.field.song.music_file.label",
        type: "audio",
        accept: "audio/*",
        required: false,
        helpText: "create.field.song.music_file.help"
      }
    ]
  },
  
  timeline: {
    id: "timeline",
    fields: [
      {
        name: "timeline_events",
        label: "create.field.timeline.timeline_events.label",
        type: "timeline",
        required: true,
        helpText: "create.field.timeline.timeline_events.help"
      }
    ]
  },
  
  dressCode: {
    id: "dressCode",
    fields: [
      {
        name: "dress_code",
        label: "create.field.dressCode.dress_code.label",
        type: "text",
        placeholder: "create.field.dressCode.dress_code.placeholder",
        required: true,
        helpText: "create.field.dressCode.dress_code.help"
      },
      {
        name: "dress_code_details",
        label: "create.field.dressCode.dress_code_details.label",
        type: "textarea",
        placeholder: "create.field.dressCode.dress_code_details.placeholder",
        required: false,
        helpText: "create.field.dressCode.dress_code_details.help"
      }
    ]
  },
  
  transport: {
    id: "transport",
    fields: [
      {
        name: "transport_info",
        label: "create.field.transport.transport_info.label",
        type: "textarea",
        placeholder: "create.field.transport.transport_info.placeholder",
        required: true,
        helpText: "create.field.transport.transport_info.help"
      },
      {
        name: "transport_link",
        label: "create.field.transport.transport_link.label",
        type: "url",
        placeholder: "create.field.transport.transport_link.placeholder",
        required: false,
        helpText: "create.field.transport.transport_link.help"
      }
    ]
  },
  
  giftList: {
    id: "giftList",
    fields: [
      {
        name: "gift_registry_url",
        label: "create.field.giftList.gift_registry_url.label",
        type: "url",
        placeholder: "create.field.giftList.gift_registry_url.placeholder",
        required: true,
        validation: {
          pattern: /^https?:\/\/.+/,
          message: "Please enter a valid URL"
        },
        helpText: "create.field.giftList.gift_registry_url.help"
      },
      {
        name: "gift_message",
        label: "create.field.giftList.gift_message.label",
        type: "textarea",
        placeholder: "create.field.giftList.gift_message.placeholder",
        required: false,
        helpText: "create.field.giftList.gift_message.help"
      }
    ]
  },
  
  countdown: {
    id: "countdown",
    fields: []
  },
  
  guestNotes: {
    id: "guestNotes",
    fields: [
      {
        name: "guest_notes",
        label: "create.field.guestNotes.guest_notes.label",
        type: "textarea",
        placeholder: "create.field.guestNotes.guest_notes.placeholder",
        required: true,
        helpText: "create.field.guestNotes.guest_notes.help"
      }
    ]
  }
}

/**
 * Get fields for a specific section
 */
export function getSectionFields(sectionId: string): FieldConfig[] {
  return SECTIONS_CONFIG[sectionId]?.fields || []
}

/**
 * Get all section IDs
 */
export function getAllSectionIds(): string[] {
  return Object.keys(SECTIONS_CONFIG)
}

/**
 * Validate section data
 */
export function validateSectionData(
  sectionId: string, 
  data: Record<string, any>
): { valid: boolean; errors: Record<string, string> } {
  const fields = getSectionFields(sectionId)
  const errors: Record<string, string> = {}
  
  for (const field of fields) {
    const value = data[field.name]
    
    // Required field check
    if (field.required && !value) {
      errors[field.name] = `${field.label} is required`
      continue
    }
    
    // Skip validation if field is not required and empty
    if (!value) continue
    
    // Type-specific validation
    if (field.type === "url" && field.validation?.pattern) {
      if (!field.validation.pattern.test(value)) {
        errors[field.name] = field.validation.message || "Invalid URL format"
      }
    }
    
    if (field.type === "textarea" || field.type === "text") {
      if (field.validation?.min && value.length < field.validation.min) {
        errors[field.name] = field.validation.message || `Minimum ${field.validation.min} characters required`
      }
      if (field.validation?.max && value.length > field.validation.max) {
        errors[field.name] = field.validation.message || `Maximum ${field.validation.max} characters allowed`
      }
    }
    
    if (field.type === "number") {
      const numValue = Number(value)
      if (isNaN(numValue)) {
        errors[field.name] = "Must be a valid number"
      } else {
        if (field.validation?.min !== undefined && numValue < field.validation.min) {
          errors[field.name] = field.validation.message || `Minimum value is ${field.validation.min}`
        }
        if (field.validation?.max !== undefined && numValue > field.validation.max) {
          errors[field.name] = field.validation.message || `Maximum value is ${field.validation.max}`
        }
      }
    }
    
    if (field.type === "multifile" && field.validation?.min) {
      const files = Array.isArray(value) ? value : []
      if (files.length < field.validation.min) {
        errors[field.name] = field.validation.message || `At least ${field.validation.min} file(s) required`
      }
    }
  }
  
  return {
    valid: Object.keys(errors).length === 0,
    errors
  }
}
