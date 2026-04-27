# Dynamic Form System for Invitation Builder

## 🎯 Overview

A complete, scalable, config-driven dynamic form system that allows users to select invitation sections and automatically displays relevant input fields. Built with React, Next.js, TypeScript, and Supabase.

## ✨ Features

- **Config-Driven**: Add new sections by editing a single config file
- **Type-Safe**: Full TypeScript support
- **Flexible Storage**: JSONB-based database schema for any data structure
- **File Uploads**: Built-in support for single and multiple file uploads
- **Validation**: Field-level and form-level validation
- **Smooth UX**: Animated transitions, collapsible sections
- **Scalable**: Easy to extend without touching core logic

## 📁 File Structure

```
lib/
├── sections-config.ts              # Section definitions (CONFIG)
├── invitation-sections.ts          # Client-side DB helpers
└── supabase/
    └── server-sections.ts          # Server-side DB helpers

components/
└── dynamic-form/
    ├── DynamicField.tsx            # Individual field renderer
    ├── DynamicSectionForm.tsx      # Section form wrapper
    └── DynamicFormContainer.tsx    # Main container

hooks/
└── use-dynamic-sections.ts         # State management hook

app/api/invitations/[id]/sections/
└── route.ts                        # API endpoints

supabase/migrations/
└── 002_dynamic_sections.sql        # Database schema

examples/
└── create-page-integration.tsx     # Complete example

INTEGRATION_GUIDE.md                # Step-by-step guide
```

## 🚀 Quick Start

### 1. Run Database Migration

```bash
# Apply the migration to your Supabase database
supabase migration up
```

Or manually run the SQL in `supabase/migrations/002_dynamic_sections.sql`

### 2. Add to Your Create Page

```typescript
import { useDynamicSections } from "@/hooks/use-dynamic-sections"
import { DynamicFormContainer } from "@/components/dynamic-form/DynamicFormContainer"

function CreatePage() {
  const {
    sectionsData,
    errors,
    updateSectionData,
    validateSections,
  } = useDynamicSections()

  return (
    <DynamicFormContainer
      selectedSections={selectedSections}
      sectionsData={sectionsData}
      onSectionDataChange={updateSectionData}
      errors={errors}
      getSectionLabel={(id) => labels[id]}
    />
  )
}
```

### 3. Save Data

```typescript
const handleSubmit = async () => {
  // Validate
  if (!validateSections(selectedSections)) {
    alert("Please complete all required fields")
    return
  }

  // Upload files
  const prepared = await uploadSectionFiles(sectionsData)

  // Create invitation
  const res = await fetch("/api/invitations", {
    method: "POST",
    body: JSON.stringify(invitationData),
  })
  const { invitation } = await res.json()

  // Save sections
  await fetch(`/api/invitations/${invitation.id}/sections`, {
    method: "POST",
    body: JSON.stringify({ sectionsData: prepared }),
  })
}
```

## 📋 Supported Field Types

| Type | Description | Example Use Case |
|------|-------------|------------------|
| `text` | Single-line text | Names, titles |
| `textarea` | Multi-line text | Stories, descriptions |
| `url` | URL with validation | Maps, registries |
| `number` | Numeric input | Guest count, capacity |
| `boolean` | Checkbox | Enable/disable features |
| `email` | Email validation | Contact info |
| `tel` | Phone number | Contact info |
| `date` | Date picker | Deadlines, dates |
| `time` | Time picker | Event times |
| `file` | Single file upload | Cover image, audio |
| `multifile` | Multiple files | Photo gallery |
| `audio` | Audio file | Background music |
| `timeline` | Dynamic event list | Event schedule |

## 🔧 Adding a New Section

### Step 1: Define in Config

Edit `lib/sections-config.ts`:

```typescript
export const SECTIONS_CONFIG: Record<string, SectionConfig> = {
  // ... existing sections
  
  accommodation: {
    id: "accommodation",
    fields: [
      {
        name: "hotel_name",
        label: "Hotel Name",
        type: "text",
        required: true,
        placeholder: "Grand Hotel",
        helpText: "Recommended hotel for guests"
      },
      {
        name: "hotel_url",
        label: "Booking Link",
        type: "url",
        required: false,
        placeholder: "https://hotel.com/book",
        validation: {
          pattern: /^https?:\/\/.+/,
          message: "Must be a valid URL"
        }
      },
      {
        name: "discount_code",
        label: "Discount Code",
        type: "text",
        required: false,
        placeholder: "WEDDING2026",
        helpText: "Special code for wedding guests"
      }
    ]
  }
}
```

### Step 2: Add to Section List

In your create page:

```typescript
const SECTION_IDS = [
  "countdown",
  "venueMap",
  // ... existing
  "accommodation", // NEW
] as const
```

### Step 3: Add Icon (Optional)

```typescript
import { Hotel } from "lucide-react"

const sectionIcon = (id: string) => {
  switch (id) {
    // ... existing
    case "accommodation":
      return Hotel
    default:
      return HelpCircle
  }
}
```

### Step 4: Add Translation

```typescript
"create.sec.accommodation": "Accommodation"
```

**That's it!** The form will automatically render with validation.

## 💾 Database Schema

### invitations table (existing)
```sql
CREATE TABLE invitations (
  id UUID PRIMARY KEY,
  bride_name TEXT NOT NULL,
  groom_name TEXT NOT NULL,
  event_date DATE NOT NULL,
  event_time TEXT NOT NULL,
  venue TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  event_type TEXT,
  -- ... other fields
);
```

### invitation_sections table (new)
```sql
CREATE TABLE invitation_sections (
  id UUID PRIMARY KEY,
  invitation_id UUID REFERENCES invitations(id) ON DELETE CASCADE,
  section_key TEXT NOT NULL,
  content JSONB NOT NULL DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(invitation_id, section_key)
);
```

### Example Data

```json
// Venue Map Section
{
  "invitation_id": "123e4567-e89b-12d3-a456-426614174000",
  "section_key": "venueMap",
  "content": {
    "map_url": "https://maps.google.com/...",
    "venue_address": "123 Main Street, City"
  }
}

// RSVP Section
{
  "invitation_id": "123e4567-e89b-12d3-a456-426614174000",
  "section_key": "rsvp",
  "content": {
    "enable_rsvp": true,
    "max_guests": 5,
    "rsvp_deadline": "2026-12-31"
  }
}

// Gallery Section
{
  "invitation_id": "123e4567-e89b-12d3-a456-426614174000",
  "section_key": "photoUpload",
  "content": {
    "gallery_images": [
      "https://storage.supabase.co/...",
      "https://storage.supabase.co/..."
    ],
    "gallery_title": "Our Memories"
  }
}

// Timeline Section
{
  "invitation_id": "123e4567-e89b-12d3-a456-426614174000",
  "section_key": "timeline",
  "content": {
    "timeline_events": [
      {
        "time": "14:00",
        "title": "Ceremony",
        "description": "Wedding ceremony at the chapel"
      },
      {
        "time": "16:00",
        "title": "Reception",
        "description": "Dinner and dancing"
      }
    ]
  }
}
```

## 🔐 Validation

### Field-Level Validation

```typescript
{
  name: "story_text",
  label: "Your Story",
  type: "textarea",
  required: true,
  validation: {
    min: 50,
    max: 2000,
    message: "Story must be 50-2000 characters"
  }
}
```

### Form-Level Validation

```typescript
const isValid = validateSections(selectedSections)
if (!isValid) {
  // Show errors
  console.log(sectionErrors)
}
```

### Custom Validation

```typescript
import { validateSectionData } from "@/lib/sections-config"

const result = validateSectionData("venueMap", {
  map_url: "https://maps.google.com/..."
})

if (!result.valid) {
  console.log(result.errors)
}
```

## 📤 File Upload Handling

### Single File

```typescript
{
  name: "cover_image",
  label: "Cover Image",
  type: "file",
  accept: "image/*",
  required: true
}
```

### Multiple Files

```typescript
{
  name: "gallery_images",
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

### Upload Implementation

```typescript
async function uploadSectionFiles(sectionsData) {
  const supabase = createClient()
  const prepared = {}

  for (const [sectionKey, content] of Object.entries(sectionsData)) {
    const preparedContent = {}

    for (const [key, value] of Object.entries(content)) {
      if (value instanceof File) {
        // Single file
        const path = `sections/${sectionKey}/${Date.now()}_${value.name}`
        const { data } = await supabase.storage
          .from("uploads")
          .upload(path, value)
        
        const { data: urlData } = supabase.storage
          .from("uploads")
          .getPublicUrl(path)
        
        preparedContent[key] = urlData.publicUrl
      } else if (Array.isArray(value) && value[0] instanceof File) {
        // Multiple files
        const urls = await Promise.all(
          value.map(async (file, idx) => {
            const path = `sections/${sectionKey}/${Date.now()}_${idx}_${file.name}`
            await supabase.storage.from("uploads").upload(path, file)
            const { data: urlData } = supabase.storage
              .from("uploads")
              .getPublicUrl(path)
            return urlData.publicUrl
          })
        )
        preparedContent[key] = urls
      } else {
        preparedContent[key] = value
      }
    }

    prepared[sectionKey] = preparedContent
  }

  return prepared
}
```

## 🎨 UI Customization

### Collapsible Sections

```typescript
<DynamicSectionForm
  sectionId="venueMap"
  sectionLabel="Venue Map"
  data={data}
  onChange={onChange}
  collapsible={true}
  defaultExpanded={false}
/>
```

### Custom Styling

```typescript
// In DynamicSectionForm.tsx
<Card className="border-2 border-primary/20 bg-primary/5">
  {/* Your custom styles */}
</Card>
```

### Error Display

```typescript
{hasErrors && (
  <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
    <p className="text-sm text-red-600">
      Please fix the errors above
    </p>
  </div>
)}
```

## 🔄 Data Flow

```
1. User selects sections
   ↓
2. Dynamic forms appear
   ↓
3. User fills in fields
   ↓
4. Validation runs
   ↓
5. Files uploaded to Supabase Storage
   ↓
6. Invitation created (basic data)
   ↓
7. Sections saved (JSONB data)
   ↓
8. Success!
```

## 📊 Retrieval Flow

```
1. Load invitation by ID
   ↓
2. Fetch basic data from invitations table
   ↓
3. Fetch sections from invitation_sections table
   ↓
4. Convert sections array to object
   ↓
5. Populate form state
   ↓
6. Render forms with data
```

## 🧪 Testing

### Test Section Validation

```typescript
import { validateSectionData } from "@/lib/sections-config"

describe("Section Validation", () => {
  it("validates required fields", () => {
    const result = validateSectionData("venueMap", {})
    expect(result.valid).toBe(false)
    expect(result.errors.map_url).toBeDefined()
  })

  it("validates URL format", () => {
    const result = validateSectionData("venueMap", {
      map_url: "not-a-url"
    })
    expect(result.valid).toBe(false)
  })

  it("passes with valid data", () => {
    const result = validateSectionData("venueMap", {
      map_url: "https://maps.google.com/..."
    })
    expect(result.valid).toBe(true)
  })
})
```

## 🐛 Troubleshooting

### Issue: Sections not appearing
**Solution**: Check that section ID exists in `SECTIONS_CONFIG`

### Issue: Validation not working
**Solution**: Ensure `validateSections()` is called before submit

### Issue: Files not uploading
**Solution**: Check Supabase storage bucket permissions and size limits

### Issue: Data not saving
**Solution**: Check API route responses and database permissions

### Issue: TypeScript errors
**Solution**: Run `npm run type-check` and fix type mismatches

## 📚 API Reference

### Client-Side

```typescript
// Hook
const {
  sectionsData,
  errors,
  updateSectionData,
  validateSections,
  clearSectionData,
  resetAllSections,
  getSectionData,
  hasErrors
} = useDynamicSections()

// Database helpers
import {
  saveSectionData,
  saveSectionsData,
  getInvitationSections,
  getInvitationSection,
  deleteInvitationSection
} from "@/lib/invitation-sections"
```

### Server-Side

```typescript
import {
  saveSectionsDataServer,
  getInvitationSectionsServer,
  deleteInvitationSectionsServer
} from "@/lib/supabase/server-sections"
```

### API Endpoints

```
GET    /api/invitations/[id]/sections     # Get all sections
POST   /api/invitations/[id]/sections     # Save sections
PUT    /api/invitations/[id]/sections     # Update sections
```

## 🎯 Best Practices

1. **Keep sections focused** - One clear purpose per section
2. **Use helpful text** - Guide users with `helpText`
3. **Validate appropriately** - Balance UX and data quality
4. **Handle files carefully** - Upload before saving metadata
5. **Provide feedback** - Show loading states and errors
6. **Test thoroughly** - Test all field types and edge cases
7. **Document changes** - Update config comments
8. **Version migrations** - Keep database changes tracked

## 🚀 Performance Tips

1. **Lazy load sections** - Only render visible sections
2. **Debounce validation** - Don't validate on every keystroke
3. **Optimize file uploads** - Compress images before upload
4. **Use indexes** - Database indexes on `invitation_id` and `section_key`
5. **Cache section configs** - Memoize config lookups

## 📝 License

This system is part of your invitation builder project.

## 🤝 Contributing

To add new field types:

1. Add type to `FieldType` in `sections-config.ts`
2. Add renderer in `DynamicField.tsx`
3. Add validation in `validateSectionData()`
4. Update documentation

## 📞 Support

For issues or questions:
- Check `INTEGRATION_GUIDE.md`
- Review `examples/create-page-integration.tsx`
- Check console for errors
- Verify database schema

---

**Built with ❤️ for scalable, maintainable forms**
