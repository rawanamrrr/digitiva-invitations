# Dynamic Form System - Quick Reference

## 🎯 Core Concepts

**Config-Driven**: All sections defined in `lib/sections-config.ts`  
**JSONB Storage**: Flexible data in `invitation_sections` table  
**Type-Safe**: Full TypeScript support  
**Validation**: Built-in field and form validation  

---

## 📦 Key Files

| File | Purpose |
|------|---------|
| `lib/sections-config.ts` | Section & field definitions |
| `components/dynamic-form/DynamicField.tsx` | Field renderer |
| `components/dynamic-form/DynamicSectionForm.tsx` | Section wrapper |
| `components/dynamic-form/DynamicFormContainer.tsx` | Main container |
| `hooks/use-dynamic-sections.ts` | State management |
| `app/api/invitations/[id]/sections/route.ts` | API endpoints |

---

## 🚀 Quick Setup

### 1. Import Hook
```typescript
import { useDynamicSections } from "@/hooks/use-dynamic-sections"

const {
  sectionsData,
  errors,
  updateSectionData,
  validateSections,
} = useDynamicSections()
```

### 2. Render Form
```typescript
<DynamicFormContainer
  selectedSections={selectedSections}
  sectionsData={sectionsData}
  onSectionDataChange={updateSectionData}
  errors={errors}
  getSectionLabel={(id) => labels[id]}
/>
```

### 3. Validate & Save
```typescript
if (!validateSections(selectedSections)) {
  alert("Please complete required fields")
  return
}

// Upload files
const prepared = await uploadSectionFiles(sectionsData)

// Save to database
await fetch(`/api/invitations/${id}/sections`, {
  method: "POST",
  body: JSON.stringify({ sectionsData: prepared }),
})
```

---

## 🔧 Add New Section

### Step 1: Config
```typescript
// lib/sections-config.ts
mySection: {
  id: "mySection",
  fields: [
    {
      name: "field_name",
      label: "Field Label",
      type: "text",
      required: true,
      placeholder: "Enter value...",
      helpText: "Help text"
    }
  ]
}
```

### Step 2: Add to List
```typescript
const SECTION_IDS = [...existing, "mySection"]
```

### Step 3: Done! ✅
The form automatically renders with validation.

---

## 📋 Field Types Cheat Sheet

```typescript
// Text
{ name: "title", type: "text" }

// Long text
{ name: "story", type: "textarea" }

// URL with validation
{ 
  name: "link", 
  type: "url",
  validation: { pattern: /^https?:\/\/.+/ }
}

// Number with range
{ 
  name: "count", 
  type: "number",
  validation: { min: 1, max: 100 }
}

// Checkbox
{ name: "enabled", type: "boolean" }

// Date/Time
{ name: "deadline", type: "date" }
{ name: "start_time", type: "time" }

// Single file
{ name: "image", type: "file", accept: "image/*" }

// Multiple files
{ 
  name: "photos", 
  type: "multifile", 
  accept: "image/*",
  validation: { min: 3 }
}

// Timeline (dynamic list)
{ name: "events", type: "timeline" }
```

---

## 💾 Database Schema

```sql
-- Main table
CREATE TABLE invitations (
  id UUID PRIMARY KEY,
  bride_name TEXT,
  groom_name TEXT,
  event_date DATE,
  -- ... basic fields
);

-- Sections table
CREATE TABLE invitation_sections (
  id UUID PRIMARY KEY,
  invitation_id UUID REFERENCES invitations(id),
  section_key TEXT NOT NULL,
  content JSONB NOT NULL,
  UNIQUE(invitation_id, section_key)
);
```

---

## 🔄 Data Flow

```
Select Sections → Fill Forms → Validate → Upload Files → Save
```

**Save:**
```typescript
1. Create invitation (basic data)
2. Upload section files to storage
3. Save sections (JSONB with URLs)
```

**Load:**
```typescript
1. Fetch invitation
2. Fetch sections
3. Convert to object format
4. Populate form state
```

---

## ✅ Validation

### Field-Level
```typescript
{
  name: "story",
  type: "textarea",
  required: true,
  validation: {
    min: 50,
    max: 2000,
    message: "Must be 50-2000 characters"
  }
}
```

### Form-Level
```typescript
const isValid = validateSections(selectedSections)
if (!isValid) {
  console.log(errors) // { sectionId: { fieldName: "error" } }
}
```

---

## 📤 File Upload

```typescript
async function uploadSectionFiles(sectionsData) {
  const prepared = {}
  
  for (const [sectionKey, content] of Object.entries(sectionsData)) {
    for (const [key, value] of Object.entries(content)) {
      if (value instanceof File) {
        // Upload single file
        const url = await uploadFile(value)
        prepared[sectionKey][key] = url
      } else if (Array.isArray(value) && value[0] instanceof File) {
        // Upload multiple files
        const urls = await Promise.all(value.map(uploadFile))
        prepared[sectionKey][key] = urls
      } else {
        prepared[sectionKey][key] = value
      }
    }
  }
  
  return prepared
}
```

---

## 🎨 Customization

### Collapsible Sections
```typescript
<DynamicSectionForm
  collapsible={true}
  defaultExpanded={false}
/>
```

### Custom Styling
```typescript
// Edit DynamicSectionForm.tsx
<Card className="your-custom-classes">
```

### Error Display
```typescript
{hasErrors && (
  <div className="error-banner">
    Please fix errors above
  </div>
)}
```

---

## 🧪 Testing

```typescript
import { runAllTests } from "@/utils/test-sections"

// In browser console or test file
runAllTests()

// Or individual tests
testSectionValidation("venueMap", { map_url: "..." })
printSectionStructure("rsvp")
generateSampleData("ourStory")
```

---

## 🐛 Common Issues

| Issue | Solution |
|-------|----------|
| Sections not appearing | Check `SECTIONS_CONFIG` has section ID |
| Validation not working | Call `validateSections()` before submit |
| Files not uploading | Check storage permissions & size limits |
| Data not saving | Check API responses & DB permissions |
| TypeScript errors | Run `npm run type-check` |

---

## 📚 API Reference

### Hook
```typescript
const {
  sectionsData,              // Current form data
  errors,                    // Validation errors
  updateSectionData,         // Update section
  validateSections,          // Validate all
  clearSectionData,          // Clear section
  resetAllSections,          // Reset all
  getSectionData,            // Get section
  hasErrors                  // Has any errors
} = useDynamicSections()
```

### Endpoints
```
GET    /api/invitations/[id]/sections
POST   /api/invitations/[id]/sections
PUT    /api/invitations/[id]/sections
```

---

## 💡 Pro Tips

1. **Keep sections focused** - One purpose per section
2. **Use helpful text** - Guide users with `helpText`
3. **Validate appropriately** - Balance UX and quality
4. **Handle files first** - Upload before saving metadata
5. **Provide feedback** - Show loading & error states
6. **Test thoroughly** - All field types & edge cases

---

## 📖 Full Documentation

- `DYNAMIC_FORM_SYSTEM_README.md` - Complete guide
- `INTEGRATION_GUIDE.md` - Step-by-step integration
- `examples/create-page-integration.tsx` - Working example

---

**Need help?** Check the full docs or console logs for errors.
