-- Fix for production migration error: Duplicate key name 'idx_status_due_date'
-- Run this SQL script on your production database to resolve the issue

-- First, check if the index exists
SELECT 
    INDEX_NAME,
    TABLE_NAME,
    COLUMN_NAME
FROM information_schema.statistics 
WHERE table_schema = DATABASE() 
AND table_name = 'penalties' 
AND index_name = 'idx_status_due_date';

-- If the index exists, drop it first
-- DROP INDEX idx_status_due_date ON penalties;

-- Also check for other potentially conflicting indexes
SELECT 
    INDEX_NAME,
    TABLE_NAME,
    GROUP_CONCAT(COLUMN_NAME ORDER BY SEQ_IN_INDEX) as COLUMNS
FROM information_schema.statistics 
WHERE table_schema = DATABASE() 
AND table_name = 'penalties' 
AND index_name IN ('idx_penalty_month', 'idx_status_due_date', 'idx_calculated_at')
GROUP BY INDEX_NAME, TABLE_NAME;

-- Check for unique constraints
SELECT 
    CONSTRAINT_NAME,
    TABLE_NAME,
    CONSTRAINT_TYPE
FROM information_schema.table_constraints 
WHERE constraint_schema = DATABASE() 
AND table_name = 'penalties' 
AND constraint_name = 'unique_member_penalty_month';

-- If you need to clean up before re-running the migration:
-- DROP INDEX IF EXISTS idx_penalty_month ON penalties;
-- DROP INDEX IF EXISTS idx_status_due_date ON penalties;
-- DROP INDEX IF EXISTS idx_calculated_at ON penalties;
-- ALTER TABLE penalties DROP CONSTRAINT IF EXISTS unique_member_penalty_month;

-- Check current table structure
DESCRIBE penalties;
