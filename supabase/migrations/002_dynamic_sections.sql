-- Migration: Dynamic Sections System
-- This migration adds support for flexible, section-based invitation data

-- Create invitation_sections table
CREATE TABLE IF NOT EXISTS invitation_sections (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  invitation_id UUID NOT NULL REFERENCES invitations(id) ON DELETE CASCADE,
  section_key TEXT NOT NULL,
  content JSONB NOT NULL DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  
  -- Ensure one entry per section per invitation
  UNIQUE(invitation_id, section_key)
);

-- Add indexes for performance
CREATE INDEX IF NOT EXISTS idx_invitation_sections_invitation_id 
  ON invitation_sections(invitation_id);

CREATE INDEX IF NOT EXISTS idx_invitation_sections_section_key 
  ON invitation_sections(section_key);

-- Add GIN index for JSONB content queries (optional but recommended)
CREATE INDEX IF NOT EXISTS idx_invitation_sections_content 
  ON invitation_sections USING GIN (content);

-- Updated_at trigger for invitation_sections
CREATE TRIGGER invitation_sections_updated_at
  BEFORE UPDATE ON invitation_sections
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- Add event_type column to invitations table (if not exists)
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'invitations' AND column_name = 'event_type'
  ) THEN
    ALTER TABLE invitations ADD COLUMN event_type TEXT;
  END IF;
END $$;

-- Add email and phone columns to invitations table (if not exists)
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'invitations' AND column_name = 'email'
  ) THEN
    ALTER TABLE invitations ADD COLUMN email TEXT;
  END IF;
  
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'invitations' AND column_name = 'phone'
  ) THEN
    ALTER TABLE invitations ADD COLUMN phone TEXT;
  END IF;
END $$;

-- Comments for documentation
COMMENT ON TABLE invitation_sections IS 'Stores dynamic section data for invitations in flexible JSONB format';
COMMENT ON COLUMN invitation_sections.section_key IS 'Section identifier (e.g., venue_map, story, rsvp)';
COMMENT ON COLUMN invitation_sections.content IS 'Flexible JSON data specific to each section type';

-- Example content structures:
-- venue_map: {"map_url": "https://maps.google.com/...", "venue_address": "123 Main St"}
-- story: {"story_text": "Our love story began..."}
-- rsvp: {"enable_rsvp": true, "max_guests": 5, "rsvp_deadline": "2026-12-31"}
-- gallery: {"gallery_images": ["url1", "url2"], "gallery_title": "Our Memories"}
-- timeline: {"timeline_events": [{"time": "14:00", "title": "Ceremony", "description": "..."}]}
