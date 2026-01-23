#!/bin/bash

# Script to verify all admin portal pages have proper Head titles
# This script checks for Head title components in all admin portal pages

echo "Checking Admin Portal pages for Head title components..."
echo "============================================================"

# Define the pages and their expected titles
declare -A pages=(
    ["Dashboard.jsx"]="Dashboard - Tabata Welfare Association"
    ["Expenses/Index.jsx"]="Expenses Management - Tabata Welfare Association"
    ["Members/Index.jsx"]="Members Management - Tabata Welfare Association"
    ["Financials.jsx"]="Financial Reports - Tabata Welfare Association"
    ["ChartOfAccounts.jsx"]="Chart of Accounts - Tabata Welfare Association"
    ["JournalEntries.jsx"]="Journal Entries - Tabata Welfare Association"
    ["BalanceSheet.jsx"]="Balance Sheet - Tabata Welfare Association"
    ["IncomeStatement.jsx"]="Income Statement - Tabata Welfare Association"
    ["CashFlow.jsx"]="Cash Flow Statement - Tabata Welfare Association"
    ["Documents/Index.jsx"]="Documents Management - Tabata Welfare Association"
    ["Announcements/Index.jsx"]="Announcements Management - Tabata Welfare Association"
    ["AuditLogs/Index.jsx"]="Audit Logs - Tabata Welfare Association"
    ["Backups.jsx"]="System Backups - Tabata Welfare Association"
    ["Reports.jsx"]="Reports - Tabata Welfare Association"
    ["GeneralLedger.jsx"]="General Ledger - Tabata Welfare Association"
    ["TrialBalance.jsx"]="Trial Balance - Tabata Welfare Association"
    ["Settings/Index.jsx"]="Settings - Tabata Welfare Association"
    ["Assets/Index.jsx"]="Assets Management - Tabata Welfare Association"
    ["Roles/Index.jsx"]="Roles & Permissions - Tabata Welfare Association"
    ["Fundraising/Index.jsx"]="Fundraising Campaigns - Tabata Welfare Association"
)

# Check each page
for page in "${!pages[@]}"; do
    file_path="resources/js/Pages/AdminPortal/$page"
    expected_title="${pages[$page]}"
    
    if [ -f "$file_path" ]; then
        if grep -q "Head title=\"$expected_title\"" "$file_path"; then
            echo "✅ $page - Title found: $expected_title"
        else
            echo "❌ $page - Title missing or incorrect"
            echo "   Expected: $expected_title"
            if grep -q "Head title=" "$file_path"; then
                actual_title=$(grep "Head title=" "$file_path" | sed 's/.*Head title="\([^"]*\)".*/\1/')
                echo "   Found: $actual_title"
            else
                echo "   Found: No Head title component"
            fi
        fi
    else
        echo "⚠️  $page - File not found"
    fi
done

echo ""
echo "============================================================"
echo "Page title verification complete!"
echo ""
echo "All pages should now display proper browser tab titles in the format:"
echo "'{Page Name} - Tabata Welfare Association'"