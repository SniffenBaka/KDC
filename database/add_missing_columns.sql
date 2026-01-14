-- Migration: Add missing columns to posts table
-- Run this in Supabase SQL Editor

-- Add excerpt column (short description)
ALTER TABLE posts 
ADD COLUMN IF NOT EXISTS excerpt TEXT;

-- Add category column
ALTER TABLE posts 
ADD COLUMN IF NOT EXISTS category TEXT DEFAULT 'Tất cả';

-- Add image column (cover image URL)
ALTER TABLE posts 
ADD COLUMN IF NOT EXISTS image TEXT;

-- Add video column (video URL)
ALTER TABLE posts 
ADD COLUMN IF NOT EXISTS video TEXT;

-- Add author column
ALTER TABLE posts 
ADD COLUMN IF NOT EXISTS author TEXT DEFAULT 'Ẩn danh';

-- Add device_id column for ownership tracking
ALTER TABLE posts 
ADD COLUMN IF NOT EXISTS device_id TEXT;

-- Add view_count column if not exists
ALTER TABLE posts 
ADD COLUMN IF NOT EXISTS view_count INTEGER DEFAULT 0;

-- Verify columns
SELECT column_name, data_type, column_default
FROM information_schema.columns
WHERE table_name = 'posts'
ORDER BY ordinal_position;
