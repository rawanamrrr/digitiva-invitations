/**
 * Testing utilities for dynamic sections
 * Use these to test your section configurations
 */

import { SECTIONS_CONFIG, validateSectionData, getSectionFields } from "@/lib/sections-config"

/**
 * Test all section configurations
 */
export function testAllSections() {
  console.log("🧪 Testing Section Configurations...\n")

  const results: Array<{
    sectionId: string
    fieldsCount: number
    requiredFields: number
    issues: string[]
  }> = []

  for (const [sectionId, config] of Object.entries(SECTIONS_CONFIG)) {
    const issues: string[] = []
    const fields = config.fields

    // Check if section has fields
    if (fields.length === 0) {
      issues.push("No fields defined")
    }

    // Check for duplicate field names
    const fieldNames = fields.map((f) => f.name)
    const duplicates = fieldNames.filter(
      (name, index) => fieldNames.indexOf(name) !== index
    )
    if (duplicates.length > 0) {
      issues.push(`Duplicate field names: ${duplicates.join(", ")}`)
    }

    // Check required fields have labels
    fields.forEach((field) => {
      if (!field.label) {
        issues.push(`Field "${field.name}" missing label`)
      }
      if (field.required && !field.validation) {
        // This is OK, just noting
      }
    })

    const requiredCount = fields.filter((f) => f.required).length

    results.push({
      sectionId,
      fieldsCount: fields.length,
      requiredFields: requiredCount,
      issues,
    })
  }

  // Print results
  results.forEach((result) => {
    const status = result.issues.length === 0 ? "✅" : "⚠️"
    console.log(`${status} ${result.sectionId}`)
    console.log(`   Fields: ${result.fieldsCount} (${result.requiredFields} required)`)
    if (result.issues.length > 0) {
      result.issues.forEach((issue) => {
        console.log(`   ⚠️  ${issue}`)
      })
    }
    console.log()
  })

  const totalIssues = results.reduce((sum, r) => sum + r.issues.length, 0)
  console.log(`\n📊 Summary: ${results.length} sections, ${totalIssues} issues`)

  return results
}

/**
 * Test validation for a specific section
 */
export function testSectionValidation(
  sectionId: string,
  testData: Record<string, any>
) {
  console.log(`\n🧪 Testing validation for: ${sectionId}`)
  console.log("Test data:", JSON.stringify(testData, null, 2))

  const result = validateSectionData(sectionId, testData)

  if (result.valid) {
    console.log("✅ Validation passed")
  } else {
    console.log("❌ Validation failed")
    console.log("Errors:", JSON.stringify(result.errors, null, 2))
  }

  return result
}

/**
 * Generate sample data for a section
 */
export function generateSampleData(sectionId: string): Record<string, any> {
  const fields = getSectionFields(sectionId)
  const sampleData: Record<string, any> = {}

  fields.forEach((field) => {
    switch (field.type) {
      case "text":
      case "email":
      case "tel":
        sampleData[field.name] = `Sample ${field.label}`
        break
      case "url":
        sampleData[field.name] = "https://example.com"
        break
      case "number":
        sampleData[field.name] = field.validation?.min || 1
        break
      case "boolean":
        sampleData[field.name] = true
        break
      case "date":
        sampleData[field.name] = "2026-12-31"
        break
      case "time":
        sampleData[field.name] = "14:00"
        break
      case "textarea":
        sampleData[field.name] = "Sample text content for " + field.label
        break
      case "timeline":
        sampleData[field.name] = [
          { time: "14:00", title: "Event 1", description: "Description 1" },
          { time: "16:00", title: "Event 2", description: "Description 2" },
        ]
        break
      case "file":
      case "audio":
        sampleData[field.name] = null // Files need to be handled separately
        break
      case "multifile":
        sampleData[field.name] = [] // Files need to be handled separately
        break
      default:
        sampleData[field.name] = null
    }
  })

  return sampleData
}

/**
 * Print section structure
 */
export function printSectionStructure(sectionId: string) {
  const fields = getSectionFields(sectionId)

  console.log(`\n📋 Section: ${sectionId}`)
  console.log(`Fields: ${fields.length}\n`)

  fields.forEach((field, index) => {
    console.log(`${index + 1}. ${field.label}`)
    console.log(`   Name: ${field.name}`)
    console.log(`   Type: ${field.type}`)
    console.log(`   Required: ${field.required ? "Yes" : "No"}`)
    if (field.placeholder) {
      console.log(`   Placeholder: ${field.placeholder}`)
    }
    if (field.helpText) {
      console.log(`   Help: ${field.helpText}`)
    }
    if (field.validation) {
      console.log(`   Validation:`, field.validation)
    }
    console.log()
  })
}

/**
 * Test data persistence (mock)
 */
export function testDataPersistence() {
  console.log("\n🧪 Testing Data Persistence Flow...\n")

  const sectionId = "venueMap"
  const testData = {
    map_url: "https://maps.google.com/test",
    venue_address: "123 Test Street",
  }

  console.log("1. Generate test data")
  console.log(JSON.stringify(testData, null, 2))

  console.log("\n2. Validate data")
  const validation = validateSectionData(sectionId, testData)
  console.log(validation.valid ? "✅ Valid" : "❌ Invalid")

  console.log("\n3. Prepare for database")
  const dbRecord = {
    invitation_id: "test-uuid",
    section_key: sectionId,
    content: testData,
  }
  console.log(JSON.stringify(dbRecord, null, 2))

  console.log("\n4. Simulate retrieval")
  const retrieved = {
    id: "section-uuid",
    invitation_id: "test-uuid",
    section_key: sectionId,
    content: testData,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  }
  console.log(JSON.stringify(retrieved, null, 2))

  console.log("\n✅ Persistence flow test complete")
}

/**
 * Run all tests
 */
export function runAllTests() {
  console.log("🚀 Running All Tests\n")
  console.log("=" .repeat(50))

  testAllSections()
  console.log("\n" + "=".repeat(50))

  testSectionValidation("venueMap", {
    map_url: "https://maps.google.com/test",
  })
  console.log("\n" + "=".repeat(50))

  testSectionValidation("venueMap", {
    map_url: "invalid-url",
  })
  console.log("\n" + "=".repeat(50))

  printSectionStructure("rsvp")
  console.log("\n" + "=".repeat(50))

  testDataPersistence()
  console.log("\n" + "=".repeat(50))

  console.log("\n✅ All tests complete!")
}

// Export for use in browser console or Node.js
if (typeof window !== "undefined") {
  // @ts-ignore
  window.testSections = {
    testAllSections,
    testSectionValidation,
    generateSampleData,
    printSectionStructure,
    testDataPersistence,
    runAllTests,
  }
  console.log("💡 Test utilities available at window.testSections")
}
