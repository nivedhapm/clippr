-- Database updates for Clippr
-- Run this script to add missing columns to existing database

USE clippr;

-- Add lastclicked column to urls table if it doesn't exist
ALTER TABLE urls
ADD COLUMN IF NOT EXISTS lastclicked TIMESTAMP NULL DEFAULT NULL;

-- Verify the table structures
DESCRIBE urls;
DESCRIBE users;

-- Check if data exists
SELECT COUNT(*) as total_urls FROM urls;
SELECT COUNT(*) as total_users FROM users;
