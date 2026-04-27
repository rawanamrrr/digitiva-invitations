# Testing Your Dynamic Forms Integration

## ✅ What Was Done

I've integrated the dynamic form system into your `app/create/page.tsx`. Here's what changed:

### 1. Added Imports
```typescript
import { useDynamicSections } from "@/hooks/use-dynamic-sections"
import { DynamicFormContainer } from "@/components/dynamic-form/DynamicFormContainer"
```

### 2. Added Hook
```typescript
const {
  sectionsData,
  errors: sectionErrors,
  updateSectionData,
  validateSections,
  clearSectionData,
} = useDynamicSections()
```

### 3. Updated toggleSection
Now clears section data when you unselect a section:
```typescript
const toggleSection = (id: string) => {
  setSelectedSections((prev) => {
    const isRemoving = prev.includes(id)
    if (isRemoving) {
      clearSectionData(id)  // NEW: Clean up data
    }
    return isRemoving ? prev.filter((s) => s !== id) : [...prev, id]
  })
}
```

### 4. Added Dynamic Forms to Step 2
Right after the contact info section, the dynamic forms now appear:
```typescript
{selectedSections.length > 0 && (
  <div className="pt-4 border-t border-border space-y-4">
    <div className="text-sm font-semibold text-primary uppercase tracking-wider">
      Section Details
    </div>
    <DynamicFormContainer
      selectedSections={selectedSections}
      sectionsData={sectionsData}
      onSectionDataChange={updateSectionData}
      errors={sectionErrors}
      getSectionLabel={(id) => {
        const section = allSections.find((s) => s.id === id)
        if (section) return section.label
        const customSection = customSections.find((s) => s.id === id)
        if (customSection) return customSection.label
        return id
      }}
    />
  </div>
)}
```

## 🧪 How to Test

### Step 1: Start Your Dev Server
```bash
npm run dev
```

### Step 2: Navigate to Create Page
Go to `/create` in your browser

### Step 3: Select a Section
1. Choose a template
2. Select a package (Standard or Premium)
3. Click on a section (e.g., "Venue Map" or "RSVP")
4. Click "Continue" to go to Step 2

### Step 4: Check for Dynamic Forms
In Step 2, after the contact info fields, you should now see:
- A "Section Details" header
- Collapsible cards for each selected section
- Input fields specific to that section

### Example: Venue Map Section
If you selected "Venue Map", you should see:
- **Google Maps Link** (URL input)
- **Venue Address** (Textarea)

### Example: RSVP Section
If you selected "RSVP", you should see:
- **Enable RSVP** (Checkbox)
- **Max Guests** (Number input)
- **RSVP Deadline** (Date picker)

## 🐛 Troubleshooting

### Issue: Forms Not Appearing
**Check:**
1. Did you select at least one section in Step 1?
2. Did you click "Continue" to go to Step 2?
3. Check browser console for errors (F12)

**Solution:**
- Make sure you're on Step 2
- Verify sections are selected (check `selectedSections` state)
- Check console for import errors

### Issue: TypeScript Errors
**Check:**
```bash
npm run type-check
```

**Common fixes:**
- Restart TypeScript server in VS Code
- Run `npm install` to ensure all dependencies are installed

### Issue: Components Not Found
**Check:**
- Verify files exist:
  - `hooks/use-dynamic-sections.ts`
  - `components/dynamic-form/DynamicFormContainer.tsx`
  - `components/dynamic-form/DynamicSectionForm.tsx`
  - `components/dynamic-form/DynamicField.tsx`
  - `lib/sections-config.ts`

### Issue: Validation Not Working
**Check:**
- Fill in required fields (marked with *)
- Check for error messages below fields
- Verify validation rules in `lib/sections-config.ts`

## 📸 What You Should See

### Step 1 (Section Selection)
```
┌─────────────────────────────────────┐
│ Select Sections:                    │
│ ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐│
│ │ Map ✓│ │ RSVP │ │Story │ │Photos││
│ └──────┘ └──────┘ └──────┘ └──────┘│
│                                     │
│ [Continue Button]                   │
└─────────────────────────────────────┘
```

### Step 2 (With Dynamic Forms)
```
┌─────────────────────────────────────┐
│ Basic Information:                  │
│ Bride Name: [____________]          │
│ Groom Name: [____________]          │
│ ...                                 │
├─────────────────────────────────────┤
│ Contact Information:                │
│ Email: [____________]               │
│ WhatsApp: [____________]            │
├─────────────────────────────────────┤
│ Section Details:                    │ ← NEW!
│                                     │
│ ┌─────────────────────────────────┐│
│ │ 🗺️  Venue Map Details          ││ ← NEW!
│ │ ┌─────────────────────────────┐││
│ │ │ Google Maps Link:           │││
│ │ │ [_________________________] │││
│ │ │                             │││
│ │ │ Venue Address:              │││
│ │ │ [_________________________] │││
│ │ │ [_________________________] │││
│ │ └─────────────────────────────┘││
│ └─────────────────────────────────┘│
│                                     │
│ [Continue to Payment]               │
└─────────────────────────────────────┘
```

## ✅ Success Indicators

You'll know it's working when:
1. ✅ Selecting a section in Step 1 works
2. ✅ Going to Step 2 shows basic form fields
3. ✅ "Section Details" header appears
4. ✅ Dynamic form cards appear for selected sections
5. ✅ Fields are specific to each section
6. ✅ Validation works (try submitting empty required fields)
7. ✅ Unselecting a section removes its form

## 🎯 Next Steps

Once you confirm it's working:

1. **Test All Sections**: Try each section to see its fields
2. **Test Validation**: Try submitting with empty required fields
3. **Test File Uploads**: Try sections with file uploads (Gallery, Music)
4. **Customize**: Add your own sections in `lib/sections-config.ts`

## 📞 Still Not Working?

If you're still having issues:

1. **Check Console**: Open browser console (F12) and look for errors
2. **Check Network**: Look for failed API calls
3. **Check State**: Use React DevTools to inspect component state
4. **Share Error**: Copy the exact error message from console

Let me know what you see and I'll help debug!
