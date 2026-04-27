# Dynamic Form System - Integration Guide

## Overview
This guide shows how to integrate the dynamic form system into your invitation builder.

## Architecture

### 1. Config-Driven Approach
All section fields are defined in `lib/sections-config.ts`. To add a new section:

```typescript
// In lib/sections-config.ts
export const SECTIONS_CONFIG: Record<string, SectionConfig> = {
  // ... existing sections
  
  newSection: {
    id: "newSection",
    fields: [
      {
        name: "field_name",
        label: "Field Label",
        type: "text",
        placeholder: "Enter value...",
        required: true,
        helpText: "Help text for users"
      }
    ]
  }
}
```

### 2. Database Schema

**invitations table** (existing):
- Basic invitation info (names, date, venue, etc.)

**invitation_sections table** (new):
- `id`: UUID primary key
- `invitation_id`: Foreign key to invitations
- `section_key`: Section identifier (e.g., "venue_map", "story")
- `content`: JSONB - flexible data storage
- `created_at`, `updated_at`: Timestamps

### 3. State Management

Use the `useDynamicSections` hook:

```typescript
const {
  sectionsData,
  errors,
  updateSectionData,
  validateSections,
  clearSectionData,
  hasErrors
} = useDynamicSections()
```

## Integration Steps

### Step 1: Add to Create Page State

```typescript
// In app/create/page.tsx
import { useDynamicSections } from "@/hooks/use-dynamic-sections"
import { DynamicFormContainer } from "@/components/dynamic-form/DynamicFormContainer"

function CreateInvitationContent() {
  // Existing state...
  const [selectedSections, setSelectedSections] = useState<string[]>([])
  
  // Add dynamic sections hook
  const {
    sectionsData,
    errors: sectionErrors,
    updateSectionData,
    validateSections,
    clearSectionData,
  } = useDynamicSections()
  
  // ... rest of component
}
```

### Step 2: Clear Section Data When Unselected

```typescript
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
```

### Step 3: Add Dynamic Form to Step 2

```typescript
{step === 2 && (
  <div className="space-y-8">
    {/* Existing basic form fields */}
    <Card>
      <CardContent className="space-y-4 pt-6">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label>Bride Name</Label>
            <Input
              value={form.brideName}
              onChange={(e) => update("brideName", e.target.value)}
            />
          </div>
          {/* ... other basic fields */}
        </div>
      </CardContent>
    </Card>

    {/* NEW: Dynamic Section Forms */}
    <DynamicFormContainer
      selectedSections={selectedSections}
      sectionsData={sectionsData}
      onSectionDataChange={updateSectionData}
      errors={sectionErrors}
      getSectionLabel={(id) => {
        const section = allSections.find((s) => s.id === id)
        return section?.label || id
      }}
    />

    {/* Navigation buttons */}
    <div className="flex gap-4">
      <Button onClick={() => setStep(1)}>Back</Button>
      <Button 
        onClick={() => {
          if (validateStep2() && validateSections(selectedSections)) {
            setStep(3)
          }
        }}
      >
        Continue to Payment
      </Button>
    </div>
  </div>
)}
```

### Step 4: Handle File Uploads

```typescript
// Helper function to upload files from sections
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
        }
      }
      // Handle file array
      else if (Array.isArray(value) && value[0] instanceof File) {
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
```

### Step 5: Save Data on Publish

```typescript
const handlePublish = async () => {
  setLoading(true)
  try {
    // 1. Validate sections
    if (!validateSections(selectedSections)) {
      alert("Please fill in all required section fields")
      setLoading(false)
      return
    }

    // 2. Upload section files
    const preparedSections = await uploadSectionFiles(sectionsData)

    // 3. Create invitation (existing code)
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
      // ... other fields
    }

    const res = await fetch("/api/invitations", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(invitationPayload),
    })
    
    const data = await res.json()
    if (!res.ok) throw new Error(data.error)

    const invitationId = data.invitation.id

    // 4. Save sections data
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

    setStep(4) // Success
  } catch (e) {
    alert(e instanceof Error ? e.message : "Failed to create invitation")
  } finally {
    setLoading(false)
  }
}
```

### Step 6: Retrieve Data

```typescript
// When loading an invitation for editing
async function loadInvitation(invitationId: string) {
  // 1. Load basic invitation data
  const invitationRes = await fetch(`/api/invitations/${invitationId}`)
  const invitationData = await invitationRes.json()

  // 2. Load sections data
  const sectionsRes = await fetch(`/api/invitations/${invitationId}/sections`)
  const sectionsResult = await sectionsRes.json()

  if (sectionsResult.success) {
    // Convert array to object format
    const sectionsObj = sectionsResult.sections.reduce(
      (acc: any, section: any) => {
        acc[section.section_key] = section.content
        return acc
      },
      {}
    )

    // Set state
    setSectionsData(sectionsObj)
    setSelectedSections(Object.keys(sectionsObj))
  }

  // Set basic form data
  setForm({
    brideName: invitationData.bride_name,
    groomName: invitationData.groom_name,
    // ... other fields
  })
}
```

## Field Types Reference

### Supported Field Types

1. **text** - Single line text input
2. **textarea** - Multi-line text input
3. **url** - URL input with validation
4. **number** - Numeric input with min/max
5. **boolean** - Checkbox
6. **email** - Email input with validation
7. **tel** - Phone number input
8. **date** - Date picker
9. **time** - Time picker
10. **file** - Single file upload
11. **multifile** - Multiple file upload
12. **audio** - Audio file upload
13. **timeline** - Dynamic list of events

### Example Field Configurations

```typescript
// URL field with validation
{
  name: "website_url",
  label: "Website URL",
  type: "url",
  required: true,
  validation: {
    pattern: /^https?:\/\/.+/,
    message: "Must be a valid URL"
  }
}

// Textarea with length limits
{
  name: "description",
  label: "Description",
  type: "textarea",
  required: true,
  validation: {
    min: 50,
    max: 500,
    message: "Must be between 50-500 characters"
  }
}

// Number with range
{
  name: "guest_count",
  label: "Number of Guests",
  type: "number",
  required: true,
  validation: {
    min: 1,
    max: 500,
    message: "Must be between 1-500"
  }
}

// File upload
{
  name: "cover_image",
  label: "Cover Image",
  type: "file",
  accept: "image/*",
  required: true
}

// Multiple files
{
  name: "gallery_photos",
  label: "Gallery Photos",
  type: "multifile",
  accept: "image/*",
  multiple: true,
  validation: {
    min: 3,
    message: "Upload at least 3 photos"
  }
}
```

## Adding New Sections

To add a new section (e.g., "Accommodation"):

1. **Add to config** (`lib/sections-config.ts`):
```typescript
accommodation: {
  id: "accommodation",
  fields: [
    {
      name: "hotel_name",
      label: "Hotel Name",
      type: "text",
      required: true
    },
    {
      name: "hotel_url",
      label: "Booking Link",
      type: "url",
      required: false
    },
    {
      name: "hotel_discount_code",
      label: "Discount Code",
      type: "text",
      required: false
    }
  ]
}
```

2. **Add to SECTION_IDS** (in create page):
```typescript
const SECTION_IDS = [
  "countdown",
  "venueMap",
  // ... existing
  "accommodation", // NEW
] as const
```

3. **Add icon** (in create page):
```typescript
const sectionIcon = (id: string) => {
  switch (id) {
    // ... existing cases
    case "accommodation":
      return Hotel // from lucide-react
    default:
      return HelpCircle
  }
}
```

4. **Add translation** (in your i18n files):
```typescript
"create.sec.accommodation": "Accommodation"
```

That's it! The dynamic form will automatically render the fields.

## Validation

Validation happens at two levels:

1. **Field-level**: As user types (pattern, min/max)
2. **Form-level**: On submit (required fields, complete validation)

```typescript
// Validate before proceeding
const isValid = validateSections(selectedSections)
if (!isValid) {
  alert("Please complete all required fields")
  return
}
```

## Best Practices

1. **Keep sections focused** - Each section should have a clear purpose
2. **Use helpful text** - Add `helpText` to guide users
3. **Validate appropriately** - Don't over-validate, but ensure data quality
4. **Handle files carefully** - Upload files before saving section data
5. **Provide feedback** - Show loading states and error messages
6. **Test thoroughly** - Test all field types and validation rules

## Troubleshooting

### Sections not appearing
- Check that section ID is in `SECTIONS_CONFIG`
- Verify section is in `selectedSections` array
- Check console for errors

### Validation not working
- Ensure validation rules are properly defined
- Check that `validateSections` is called before submit
- Verify error messages are displayed

### Files not uploading
- Check Supabase storage bucket permissions
- Verify file size limits
- Ensure proper error handling

### Data not saving
- Check API route responses
- Verify invitation ID is correct
- Check database permissions
- Look for console errors

## Example: Complete Integration

See `examples/create-page-integration.tsx` for a complete working example.
