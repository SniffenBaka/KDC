-- Check and add device_id column to comments table for ownership tracking
-- Run this in Supabase SQL Editor

-- Add device_id column if not exists
ALTER TABLE comments 
ADD COLUMN IF NOT EXISTS device_id TEXT;

-- Verify columns in comments table
SELECT column_name, data_type, column_default
FROM information_schema.columns
WHERE table_name = 'comments'
ORDER BY ordinal_position;
