-- Migration to add google_drive_url column to files table
-- Run this in your Supabase SQL editor

-- Add the new column
ALTER TABLE files ADD COLUMN IF NOT EXISTS google_drive_url TEXT;

-- Make file_path, cdn_url optional (for backward compatibility)
ALTER TABLE files ALTER COLUMN file_path DROP NOT NULL;
ALTER TABLE files ALTER COLUMN cdn_url DROP NOT NULL;

-- Update existing records to have a placeholder google_drive_url if they don't have one
-- (You'll need to manually update these with actual Google Drive links)
UPDATE files 
SET google_drive_url = 'https://drive.google.com/file/d/PLACEHOLDER/view?usp=sharing'
WHERE google_drive_url IS NULL AND cdn_url IS NOT NULL;

-- Add a comment to the table
COMMENT ON COLUMN files.google_drive_url IS 'Google Drive sharing URL for the file';
COMMENT ON COLUMN files.file_path IS 'Legacy field - path in Supabase storage (optional)';
COMMENT ON COLUMN files.cdn_url IS 'Legacy field - Supabase storage public URL (optional)';