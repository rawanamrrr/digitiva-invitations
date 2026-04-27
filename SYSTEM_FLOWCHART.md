# Dynamic Form System - Visual Flowchart

## 🔄 Complete Data Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                         USER JOURNEY                             │
└─────────────────────────────────────────────────────────────────┘

STEP 1: SELECT SECTIONS
┌──────────────────────┐
│  User clicks section │
│  (e.g., Venue Map)   │
└──────────┬───────────┘
           │
           ↓
┌──────────────────────┐
│ toggleSection(id)    │
│ • Add to selected[]  │
│ • Or remove & clean  │
└──────────┬───────────┘
           │
           ↓
┌──────────────────────┐
│ selectedSections     │
│ ["venueMap", "rsvp"] │
└──────────────────────┘

═══════════════════════════════════════════════════════════════════

STEP 2: DYNAMIC FORMS APPEAR
┌──────────────────────┐
│ DynamicFormContainer │
│ receives selected[]  │
└──────────┬───────────┘
           │
           ↓
┌──────────────────────────────────────────────────────┐
│ For each selected section:                           │
│ 1. Look up config in SECTIONS_CONFIG                 │
│ 2. Get field definitions                             │
│ 3. Render DynamicSectionForm                         │
└──────────┬───────────────────────────────────────────┘
           │
           ↓
┌──────────────────────────────────────────────────────┐
│ DynamicSectionForm (Venue Map)                       │
│ ┌────────────────────────────────────────────────┐  │
│ │ DynamicField (map_url)                         │  │
│ │ • Type: url                                    │  │
│ │ • Validation: pattern                          │  │
│ │ • Required: true                               │  │
│ └────────────────────────────────────────────────┘  │
│ ┌────────────────────────────────────────────────┐  │
│ │ DynamicField (venue_address)                   │  │
│ │ • Type: textarea                               │  │
│ │ • Required: false                              │  │
│ └────────────────────────────────────────────────┘  │
└──────────────────────────────────────────────────────┘

═══════════════════════════════════════════════════════════════════

STEP 3: USER FILLS FORM
┌──────────────────────┐
│ User types in field  │
└──────────┬───────────┘
           │
           ↓
┌──────────────────────┐
│ onChange triggered   │
└──────────┬───────────┘
           │
           ↓
┌──────────────────────────────────────┐
│ updateSectionData(sectionId, data)   │
│ • Updates sectionsData state         │
│ • Clears errors for this section     │
└──────────┬───────────────────────────┘
           │
           ↓
┌──────────────────────────────────────┐
│ sectionsData = {                     │
│   venueMap: {                        │
│     map_url: "https://...",          │
│     venue_address: "123 Main St"     │
│   },                                 │
│   rsvp: {                            │
│     enable_rsvp: true,               │
│     max_guests: 5                    │
│   }                                  │
│ }                                    │
└──────────────────────────────────────┘

═══════════════════════════════════════════════════════════════════

STEP 4: VALIDATION
┌──────────────────────┐
│ User clicks Submit   │
└──────────┬───────────┘
           │
           ↓
┌──────────────────────────────────────┐
│ validateSections(selectedSections)   │
└──────────┬───────────────────────────┘
           │
           ↓
┌──────────────────────────────────────────────────────┐
│ For each selected section:                           │
│ 1. Get field definitions from config                 │
│ 2. Check required fields                             │
│ 3. Validate field types (url, number, etc.)          │
│ 4. Check min/max constraints                         │
│ 5. Validate patterns (regex)                         │
└──────────┬───────────────────────────────────────────┘
           │
           ├─── Valid ───────────────────────┐
           │                                  │
           │                                  ↓
           │                         ┌────────────────┐
           │                         │ Continue       │
           │                         └────────────────┘
           │
           └─── Invalid ─────────────────────┐
                                              │
                                              ↓
                                     ┌────────────────┐
                                     │ Show errors    │
                                     │ errors = {     │
                                     │   venueMap: {  │
                                     │     map_url:   │
                                     │     "Invalid"  │
                                     │   }            │
                                     │ }              │
                                     └────────────────┘

═══════════════════════════════════════════════════════════════════

STEP 5: FILE UPLOAD
┌──────────────────────────────────────┐
│ uploadSectionFiles(sectionsData)     │
└──────────┬───────────────────────────┘
           │
           ↓
┌──────────────────────────────────────────────────────┐
│ For each section:                                    │
│   For each field:                                    │
│     If value is File:                                │
│       1. Generate unique path                        │
│       2. Upload to Supabase Storage                  │
│       3. Get public URL                              │
│       4. Replace File with URL                       │
│     If value is File[]:                              │
│       1. Upload each file                            │
│       2. Get URLs                                    │
│       3. Replace array with URLs                     │
│     Else:                                            │
│       Keep value as-is                               │
└──────────┬───────────────────────────────────────────┘
           │
           ↓
┌──────────────────────────────────────┐
│ preparedSections = {                 │
│   photoUpload: {                     │
│     gallery_images: [                │
│       "https://storage.../img1.jpg", │
│       "https://storage.../img2.jpg"  │
│     ]                                │
│   }                                  │
│ }                                    │
└──────────────────────────────────────┘

═══════════════════════════════════════════════════════════════════

STEP 6: SAVE TO DATABASE
┌──────────────────────────────────────┐
│ 1. Create Invitation                 │
└──────────┬───────────────────────────┘
           │
           ↓
┌──────────────────────────────────────┐
│ POST /api/invitations                │
│ {                                    │
│   brideName: "...",                  │
│   groomName: "...",                  │
│   eventDate: "...",                  │
│   ...                                │
│ }                                    │
└──────────┬───────────────────────────┘
           │
           ↓
┌──────────────────────────────────────┐
│ INSERT INTO invitations              │
│ RETURNING id                         │
└──────────┬───────────────────────────┘
           │
           ↓
┌──────────────────────────────────────┐
│ invitationId = "uuid-123..."         │
└──────────┬───────────────────────────┘
           │
           ↓
┌──────────────────────────────────────┐
│ 2. Save Sections                     │
└──────────┬───────────────────────────┘
           │
           ↓
┌──────────────────────────────────────┐
│ POST /api/invitations/[id]/sections  │
│ {                                    │
│   sectionsData: {                    │
│     venueMap: {...},                 │
│     rsvp: {...}                      │
│   }                                  │
│ }                                    │
└──────────┬───────────────────────────┘
           │
           ↓
┌──────────────────────────────────────────────────────┐
│ For each section in sectionsData:                    │
│   INSERT INTO invitation_sections                    │
│   (invitation_id, section_key, content)              │
│   VALUES (uuid, 'venueMap', '{"map_url": "..."}')    │
│   ON CONFLICT (invitation_id, section_key)           │
│   DO UPDATE SET content = EXCLUDED.content           │
└──────────┬───────────────────────────────────────────┘
           │
           ↓
┌──────────────────────────────────────┐
│ Database State:                      │
│                                      │
│ invitations:                         │
│ ┌────────────────────────────────┐  │
│ │ id: uuid-123                   │  │
│ │ bride_name: "Alice"            │  │
│ │ groom_name: "Bob"              │  │
│ │ event_date: "2026-12-31"       │  │
│ └────────────────────────────────┘  │
│                                      │
│ invitation_sections:                 │
│ ┌────────────────────────────────┐  │
│ │ invitation_id: uuid-123        │  │
│ │ section_key: "venueMap"        │  │
│ │ content: {                     │  │
│ │   "map_url": "https://...",    │  │
│ │   "venue_address": "..."       │  │
│ │ }                              │  │
│ └────────────────────────────────┘  │
│ ┌────────────────────────────────┐  │
│ │ invitation_id: uuid-123        │  │
│ │ section_key: "rsvp"            │  │
│ │ content: {                     │  │
│ │   "enable_rsvp": true,         │  │
│ │   "max_guests": 5              │  │
│ │ }                              │  │
│ └────────────────────────────────┘  │
└──────────────────────────────────────┘

═══════════════════════════════════════════════════════════════════

STEP 7: SUCCESS
┌──────────────────────┐
│ Show success message │
│ Redirect to preview  │
└──────────────────────┘
```

---

## 🔍 Retrieval Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                      LOADING INVITATION                          │
└─────────────────────────────────────────────────────────────────┘

STEP 1: FETCH INVITATION
┌──────────────────────────────────────┐
│ GET /api/invitations/[id]            │
└──────────┬───────────────────────────┘
           │
           ↓
┌──────────────────────────────────────┐
│ SELECT * FROM invitations            │
│ WHERE id = 'uuid-123'                │
└──────────┬───────────────────────────┘
           │
           ↓
┌──────────────────────────────────────┐
│ invitation = {                       │
│   id: "uuid-123",                    │
│   bride_name: "Alice",               │
│   groom_name: "Bob",                 │
│   event_date: "2026-12-31",          │
│   ...                                │
│ }                                    │
└──────────────────────────────────────┘

═══════════════════════════════════════════════════════════════════

STEP 2: FETCH SECTIONS
┌──────────────────────────────────────┐
│ GET /api/invitations/[id]/sections   │
└──────────┬───────────────────────────┘
           │
           ↓
┌──────────────────────────────────────┐
│ SELECT * FROM invitation_sections    │
│ WHERE invitation_id = 'uuid-123'     │
└──────────┬───────────────────────────┘
           │
           ↓
┌──────────────────────────────────────────────────────┐
│ sections = [                                         │
│   {                                                  │
│     id: "section-1",                                 │
│     invitation_id: "uuid-123",                       │
│     section_key: "venueMap",                         │
│     content: {                                       │
│       "map_url": "https://...",                      │
│       "venue_address": "123 Main St"                 │
│     }                                                │
│   },                                                 │
│   {                                                  │
│     id: "section-2",                                 │
│     invitation_id: "uuid-123",                       │
│     section_key: "rsvp",                             │
│     content: {                                       │
│       "enable_rsvp": true,                           │
│       "max_guests": 5                                │
│     }                                                │
│   }                                                  │
│ ]                                                    │
└──────────┬───────────────────────────────────────────┘
           │
           ↓
┌──────────────────────────────────────┐
│ Convert array to object              │
└──────────┬───────────────────────────┘
           │
           ↓
┌──────────────────────────────────────┐
│ sectionsData = {                     │
│   venueMap: {                        │
│     map_url: "https://...",          │
│     venue_address: "123 Main St"     │
│   },                                 │
│   rsvp: {                            │
│     enable_rsvp: true,               │
│     max_guests: 5                    │
│   }                                  │
│ }                                    │
└──────────────────────────────────────┘

═══════════════════════════════════════════════════════════════════

STEP 3: POPULATE FORM
┌──────────────────────────────────────┐
│ setForm(invitation)                  │
│ setSectionsData(sectionsData)        │
│ setSelectedSections(                 │
│   Object.keys(sectionsData)          │
│ )                                    │
└──────────┬───────────────────────────┘
           │
           ↓
┌──────────────────────────────────────┐
│ Form populated with data             │
│ Dynamic forms rendered               │
│ Ready for editing                    │
└──────────────────────────────────────┘
```

---

## 🎨 Component Hierarchy

```
CreatePage
│
├─ Step 1: Select Template & Sections
│  │
│  ├─ Template Grid
│  │  └─ Template Cards
│  │
│  └─ Section Grid
│     └─ Section Buttons
│        └─ onClick: toggleSection(id)
│
├─ Step 2: Enter Details
│  │
│  ├─ Basic Info Card
│  │  └─ Input fields (names, date, venue, etc.)
│  │
│  └─ DynamicFormContainer ← NEW
│     │
│     ├─ Props:
│     │  • selectedSections: string[]
│     │  • sectionsData: Record<string, Record<string, any>>
│     │  • onSectionDataChange: (id, data) => void
│     │  • errors: Record<string, Record<string, string>>
│     │  • getSectionLabel: (id) => string
│     │
│     └─ For each selected section:
│        │
│        └─ DynamicSectionForm
│           │
│           ├─ Props:
│           │  • sectionId: string
│           │  • sectionLabel: string
│           │  • data: Record<string, any>
│           │  • onChange: (id, data) => void
│           │  • errors: Record<string, string>
│           │  • collapsible: boolean
│           │
│           └─ For each field in section:
│              │
│              └─ DynamicField
│                 │
│                 ├─ Props:
│                 │  • field: FieldConfig
│                 │  • value: any
│                 │  • onChange: (value) => void
│                 │  • error: string
│                 │
│                 └─ Renders based on field.type:
│                    • text → Input
│                    • textarea → Textarea
│                    • url → Input[type=url]
│                    • number → Input[type=number]
│                    • boolean → Checkbox
│                    • file → File Input
│                    • multifile → Multiple File Input
│                    • timeline → Timeline Builder
│                    • etc.
│
└─ Step 3: Payment & Submit
   │
   └─ handlePublish()
      │
      ├─ 1. Validate sections
      ├─ 2. Upload files
      ├─ 3. Create invitation
      └─ 4. Save sections
```

---

## 🔧 Configuration Flow

```
SECTIONS_CONFIG (lib/sections-config.ts)
│
├─ venueMap: {
│   id: "venueMap",
│   fields: [
│     {
│       name: "map_url",
│       label: "Google Maps Link",
│       type: "url",
│       required: true,
│       validation: { pattern: /^https?:\/\/.+/ }
│     },
│     {
│       name: "venue_address",
│       label: "Venue Address",
│       type: "textarea",
│       required: false
│     }
│   ]
│ }
│
├─ rsvp: {
│   id: "rsvp",
│   fields: [
│     {
│       name: "enable_rsvp",
│       label: "Enable RSVP",
│       type: "boolean"
│     },
│     {
│       name: "max_guests",
│       label: "Max Guests",
│       type: "number",
│       validation: { min: 1, max: 20 }
│     }
│   ]
│ }
│
└─ ... (other sections)

↓ Used by ↓

DynamicFormContainer
│
└─ getSectionFields(sectionId)
   │
   └─ Returns field definitions
      │
      └─ DynamicSectionForm renders fields
         │
         └─ DynamicField renders based on type
```

---

## 💾 Database Relationships

```
┌─────────────────────────────────────┐
│          invitations                │
├─────────────────────────────────────┤
│ id (PK)                             │
│ bride_name                          │
│ groom_name                          │
│ event_date                          │
│ event_time                          │
│ venue                               │
│ email                               │
│ phone                               │
│ ...                                 │
└──────────────┬──────────────────────┘
               │
               │ 1:N
               │
               ↓
┌─────────────────────────────────────┐
│      invitation_sections            │
├─────────────────────────────────────┤
│ id (PK)                             │
│ invitation_id (FK) ─────────────────┘
│ section_key                         │
│ content (JSONB)                     │
│ created_at                          │
│ updated_at                          │
│                                     │
│ UNIQUE(invitation_id, section_key)  │
└─────────────────────────────────────┘

Example Data:

invitations:
┌──────────────────────────────────────────────────┐
│ id: "abc-123"                                    │
│ bride_name: "Alice"                              │
│ groom_name: "Bob"                                │
│ event_date: "2026-12-31"                         │
└──────────────────────────────────────────────────┘

invitation_sections:
┌──────────────────────────────────────────────────┐
│ invitation_id: "abc-123"                         │
│ section_key: "venueMap"                          │
│ content: {"map_url": "...", "address": "..."}    │
└──────────────────────────────────────────────────┘
┌──────────────────────────────────────────────────┐
│ invitation_id: "abc-123"                         │
│ section_key: "rsvp"                              │
│ content: {"enable_rsvp": true, "max_guests": 5}  │
└──────────────────────────────────────────────────┘
```

---

## 🎯 State Management Flow

```
useDynamicSections Hook
│
├─ State:
│  ├─ sectionsData: Record<string, Record<string, any>>
│  └─ errors: Record<string, Record<string, string>>
│
├─ Actions:
│  ├─ updateSectionData(sectionId, data)
│  │  └─ Updates sectionsData[sectionId] = data
│  │     Clears errors[sectionId]
│  │
│  ├─ validateSections(selectedSections)
│  │  └─ For each section:
│  │     └─ validateSectionData(id, data)
│  │        └─ Returns { valid, errors }
│  │
│  ├─ clearSectionData(sectionId)
│  │  └─ Deletes sectionsData[sectionId]
│  │     Deletes errors[sectionId]
│  │
│  └─ resetAllSections()
│     └─ Clears all data and errors
│
└─ Returns:
   ├─ sectionsData
   ├─ errors
   ├─ updateSectionData
   ├─ validateSections
   ├─ clearSectionData
   ├─ resetAllSections
   ├─ getSectionData
   └─ hasErrors
```

---

**This flowchart provides a complete visual reference for understanding the system architecture and data flow.**
