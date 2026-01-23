# Fresh Testing Guide - Financial System

## Current State ✅
- **Cash Balance**: 0 TZS (Fresh start)
- **All Financial Transactions**: Cleared
- **Account Balances**: Reset to zero
- **Chart of Accounts**: Preserved (28 accounts)
- **Members**: Preserved (6 members)
- **Users**: Preserved (8 users)

## Testing Sequence

### Phase 1: Build Cash Balance 💰

#### Test 1.1: Add Member Contributions
1. **Go to**: Admin Portal → Financials → Monthly Contributions
2. **Action**: Add monthly contributions for members
3. **Expected**: 
   - Cash balance increases
   - Journal entries created automatically
   - Debit: Cash (1000), Credit: Member Contributions (4000)

**Sample Test Data**:
```
Member: [Any member]
Amount: 50,000 TZS
Type: Monthly
Date: Current date
```

#### Test 1.2: Verify Cash Balance
1. **Check**: Dashboard shows updated cash balance
2. **Check**: Chart of Accounts shows Cash (1000) with positive balance
3. **Check**: Journal Entries page shows contribution entries

### Phase 2: Test Cash Flow Validation 🚫

#### Test 2.1: Attempt Loan Disbursement (Should Fail)
1. **Go to**: Admin Portal → Financials → Loans
2. **Action**: Create a loan for amount > current cash balance
3. **Action**: Try to disburse the loan
4. **Expected**: 
   - Error message: "Insufficient cash balance for loan disbursement"
   - Loan remains in 'pending' status
   - No journal entry created

#### Test 2.2: Attempt Disaster Payment (Should Fail)
1. **Go to**: Admin Portal → Financials → Disbursements
2. **Action**: Try to create disaster payment > current cash balance
3. **Expected**: 
   - Error message: "Insufficient cash balance for disaster payment"
   - Payment not created
   - No journal entry created

### Phase 3: Test Valid Transactions ✅

#### Test 3.1: Valid Loan Disbursement
1. **Ensure**: Cash balance > loan amount
2. **Action**: Create and disburse loan within cash limits
3. **Expected**:
   - Loan status changes to 'disbursed'
   - Cash balance decreases
   - Journal entry: Debit: Loans Receivable (1300), Credit: Cash (1000)

#### Test 3.2: Valid Expense Payment
1. **Go to**: Admin Portal → Expenses
2. **Action**: Create expense and mark as paid (within cash limits)
3. **Expected**:
   - Expense status changes to 'paid'
   - Cash balance decreases
   - Journal entry: Debit: [Expense Account], Credit: Cash (1000)

#### Test 3.3: Valid Disaster Payment
1. **Action**: Create disaster payment within cash limits
2. **Expected**:
   - Payment created successfully
   - Cash balance decreases
   - Journal entry: Debit: Disaster Relief (5950), Credit: Cash (1000)

### Phase 4: Test Loan Repayment 💸

#### Test 4.1: Loan Repayment
1. **Action**: Mark a disbursed loan as 'repaid'
2. **Expected**:
   - Cash balance increases by total amount (principal + interest)
   - Journal entry: 
     - Debit: Cash (1000) - total amount
     - Credit: Loans Receivable (1300) - principal
     - Credit: Interest Income (4300) - interest

### Phase 5: Test Penalty System 📋

#### Test 5.1: Create and Pay Penalty
1. **Action**: Create a penalty for a member
2. **Action**: Mark penalty as paid
3. **Expected**:
   - Cash balance increases
   - Journal entry: Debit: Cash (1000), Credit: Penalty Revenue (4200)

### Phase 6: Verify Accounting Integrity 📊

#### Test 6.1: Check Journal Entries
1. **Go to**: Admin Portal → Accounting → Journal Entries
2. **Verify**: All transactions have corresponding journal entries
3. **Verify**: All entries are balanced (Total Debit = Total Credit)

#### Test 6.2: Check Account Balances
1. **Go to**: Admin Portal → Accounting → Chart of Accounts
2. **Verify**: Account balances reflect all transactions
3. **Verify**: Cash account balance matches dashboard

#### Test 6.3: Check Financial Reports
1. **Go to**: Admin Portal → Accounting → Balance Sheet
2. **Go to**: Admin Portal → Accounting → Income Statement
3. **Verify**: Reports show accurate financial position

## Expected Account Activity

### After Contributions:
- **Cash (1000)**: Positive balance
- **Member Contributions (4000)**: Positive balance

### After Loan Disbursement:
- **Cash (1000)**: Decreased
- **Loans Receivable (1300)**: Positive balance

### After Loan Repayment:
- **Cash (1000)**: Increased
- **Loans Receivable (1300)**: Decreased
- **Interest Income (4300)**: Positive balance

### After Expenses:
- **Cash (1000)**: Decreased
- **[Expense Accounts]**: Positive balance

### After Disaster Payments:
- **Cash (1000)**: Decreased
- **Disaster Relief (5950)**: Positive balance

### After Penalties:
- **Cash (1000)**: Increased
- **Penalty Revenue (4200)**: Positive balance

## Key Validation Points

### ✅ Cash Flow Control
- No transaction should succeed if it would make cash balance negative
- Error messages should be clear and informative
- Failed transactions should not create partial records

### ✅ Double-Entry Bookkeeping
- Every transaction should have balanced journal entries
- Debits should always equal credits
- Account balances should reflect all transactions

### ✅ System Integration
- Dashboard should show real-time cash balance
- All financial pages should reflect current state
- Reports should be accurate and up-to-date

## Troubleshooting

### If Cash Validation Fails:
1. Check if observers are registered in `AppServiceProvider`
2. Verify `AccountingService` methods are being called
3. Check application logs for error details

### If Journal Entries Missing:
1. Verify observers are triggering correctly
2. Check for database transaction rollbacks
3. Ensure account codes exist in chart of accounts

### If Balances Don't Match:
1. Check journal entry line calculations
2. Verify account balance update logic
3. Run account balance reconciliation

---

## Quick Start Commands

```bash
# Check current cash balance
php artisan tinker --execute="echo app(App\Services\AccountingService::class)->getCashBalance();"

# Check account balances
php artisan tinker --execute="App\Models\Account::where('current_balance', '!=', 0)->get(['account_code', 'account_name', 'current_balance'])->each(function(\$a) { echo \$a->account_code . ' - ' . \$a->account_name . ': ' . \$a->current_balance . PHP_EOL; });"

# Check recent journal entries
php artisan tinker --execute="App\Models\JournalEntry::with('lines.account')->latest()->take(5)->get()->each(function(\$e) { echo \$e->entry_number . ' - ' . \$e->description . ' (' . \$e->total_debit . ')' . PHP_EOL; });"
```

Happy testing! 🚀