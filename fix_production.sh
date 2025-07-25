#!/bin/bash

# Production Migration Fix Script
# This script fixes the duplicate index error and runs the migration

echo "🔧 Fixing production migration error..."

# Step 1: Check if we have the fix command
echo "📋 Step 1: Checking for penalties indexes..."
php artisan fix:penalties-indexes --dry-run

# Step 2: Ask for confirmation
echo ""
read -p "Do you want to proceed with cleaning up the conflicting indexes? (y/N): " -n 1 -r
echo ""

if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo "🧹 Step 2: Cleaning up conflicting indexes..."
    php artisan fix:penalties-indexes
    
    echo ""
    echo "🚀 Step 3: Running migration..."
    php artisan migrate
    
    echo ""
    echo "✅ Migration fix completed!"
    echo "📊 Checking final table structure..."
    php artisan tinker --execute="
        use Illuminate\Support\Facades\DB;
        \$indexes = DB::select(\"
            SELECT 
                INDEX_NAME,
                GROUP_CONCAT(COLUMN_NAME ORDER BY SEQ_IN_INDEX) as COLUMNS
            FROM information_schema.statistics 
            WHERE table_schema = DATABASE() 
            AND table_name = 'penalties' 
            AND INDEX_NAME != 'PRIMARY'
            GROUP BY INDEX_NAME
        \");
        echo \"Indexes on penalties table:\n\";
        foreach(\$indexes as \$index) {
            echo \"- {\$index->INDEX_NAME}: {\$index->COLUMNS}\n\";
        }
    "
else
    echo "❌ Operation cancelled."
    echo ""
    echo "Manual fix option:"
    echo "1. Connect to your database"
    echo "2. Run: DROP INDEX IF EXISTS idx_member_status ON penalties;"
    echo "3. Run: DROP INDEX IF EXISTS idx_penalty_month ON penalties;"
    echo "4. Run: DROP INDEX IF EXISTS idx_status_due_date ON penalties;"
    echo "5. Run: DROP INDEX IF EXISTS idx_calculated_at ON penalties;"
    echo "6. Run: php artisan migrate"
fi
