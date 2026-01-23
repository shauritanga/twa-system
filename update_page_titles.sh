#!/bin/bash

# Script to add Head components to all admin portal pages

# Array of pages with their titles
declare -A pages=(
    ["resources/js/Pages/AdminPortal/CashFlow.jsx"]="Cash Flow Statement"
    ["resources/js/Pages/AdminPortal/TrialBalance.jsx"]="Trial Balance"
    ["resources/js/Pages/AdminPortal/GeneralLedger.jsx"]="General Ledger"
    ["resources/js/Pages/AdminPortal/Reports.jsx"]="Reports"
    ["resources/js/Pages/AdminPortal/Settings.jsx"]="Settings"
    ["resources/js/Pages/AdminPortal/Roles.jsx"]="Roles & Permissions"
    ["resources/js/Pages/AdminPortal/AuditLogs.jsx"]="Audit Logs"
    ["resources/js/Pages/AdminPortal/Backups.jsx"]="Backup Management"
    ["resources/js/Pages/AdminPortal/Fundraising.jsx"]="Fundraising Campaigns"
)

for file in "${!pages[@]}"; do
    title="${pages[$file]}"
    echo "Processing $file with title: $title"
    
    if [ -f "$file" ]; then
        # Add Head import if not present
        if ! grep -q "Head" "$file"; then
            sed -i '' 's/from '\''@inertiajs\/react'\'';/from '\''@inertiajs\/react'\'';/' "$file"
            sed -i '' 's/import { \([^}]*\) } from '\''@inertiajs\/react'\'';/import { \1, Head } from '\''@inertiajs\/react'\'';/' "$file"
        fi
        
        # Add Head component in return statement
        if ! grep -q "<Head title=" "$file"; then
            sed -i '' 's/return (/return (\
        <>\
            <Head title="'"$title"' - Tabata Welfare Association" \/>\
            <AdminSidebarLayout>/' "$file"
            
            # Close the fragment
            sed -i '' 's/<\/AdminSidebarLayout>/<\/AdminSidebarLayout>\
        <\/>\
    );/' "$file"
        fi
    else
        echo "File $file not found"
    fi
done

echo "Done updating page titles!"