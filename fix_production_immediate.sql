-- IMMEDIATE FIX for production migration error
-- Run this SQL script on your production database to resolve the idx_member_status error

-- Check current indexes on penalties table
SELECT 
    INDEX_NAME,
    TABLE_NAME,
    GROUP_CONCAT(COLUMN_NAME ORDER BY SEQ_IN_INDEX) as COLUMNS
FROM information_schema.statistics 
WHERE table_schema = DATABASE() 
AND table_name = 'penalties' 
AND INDEX_NAME != 'PRIMARY'
GROUP BY INDEX_NAME, TABLE_NAME;

-- Drop all potentially conflicting indexes
-- These will be recreated by the migration with proper existence checks

DROP INDEX IF EXISTS idx_member_status ON penalties;
DROP INDEX IF EXISTS idx_penalty_month ON penalties;
DROP INDEX IF EXISTS idx_status_due_date ON penalties;
DROP INDEX IF EXISTS idx_calculated_at ON penalties;

-- Also drop the unique constraint if it exists
-- ALTER TABLE penalties DROP CONSTRAINT IF EXISTS unique_member_penalty_month;

-- Check that indexes are gone
SELECT 
    INDEX_NAME,
    TABLE_NAME,
    GROUP_CONCAT(COLUMN_NAME ORDER BY SEQ_IN_INDEX) as COLUMNS
FROM information_schema.statistics 
WHERE table_schema = DATABASE() 
AND table_name = 'penalties' 
AND INDEX_NAME != 'PRIMARY'
GROUP BY INDEX_NAME, TABLE_NAME;

-- Now you can run: php artisan migrate
-- The migration will recreate these indexes safely
