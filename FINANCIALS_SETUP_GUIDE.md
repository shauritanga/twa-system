# Financial Management System - Setup & Testing Guide

## Quick Setup

### 1. Install Dependencies (if not already done)
```bash
# Install PHP dependencies
composer install

# Install Node dependencies
npm install
```

### 2. Build Frontend Assets
```bash
# Development build
npm run dev

# Or production build
npm run build
```

### 3. Set Up Scheduler (for automatic penalties)
Add to your crontab:
```bash
# Edit crontab
crontab -e

# Add this line
* * * * * cd /path/to/twa-system && php artisan schedule:run >> /dev/null 2>&1
```

### 4. Verify Settings
Check your database `settings` table has these records:
```sql
SELECT * FROM settings WHERE key IN ('monthly_contribution_amount', 'penalty_percentage_rate');
```

If missing, add them:
```sql
INSERT INTO settings (key, value, created_at, updated_at) VALUES
('monthly_contribution_amount', '50000', NOW(), NOW()),
('penalty_percentage_rate', '10', NOW(), NOW());
```

---

## Testing the Features

### Test 1: Add a Normal Monthly Contribution
1. Login as admin
2. Go to `/admin-portal/financials`
3. Click "Add Contribution"
4. Select:
   - Type: Monthly
   - Member: Any member
   - Amount: 50000 (or your monthly amount)
   - Date: Today
   - Purpose: Monthly Contribution
5. Submit
6. **Expected**: Contribution recorded for current month

### Test 2: Add an Installment Payment
1. Add first installment:
   - Amount: 25000
   - Purpose: Monthly Contribution (Installment 1)
2. Check contributions table - should show partial payment
3. Add second installment:
   - Amount: 25000
   - Purpose: Monthly Contribution (Installment 2)
4. **Expected**: Both payments recorded, total = 50000 for the month

### Test 3: Add an Advance Payment
1. Add contribution:
   - Amount: 150000 (3 months worth)
   - Purpose: Monthly Contribution (Advance)
2. Check database:
```sql
SELECT * FROM contributions 
WHERE member_id = [YOUR_MEMBER_ID] 
ORDER BY contribution_month;
```
3. **Expected**: 3 separate records for 3 consecutive months

### Test 4: Add a Debt
1. Go to Debts tab
2. Click "Add Debt"
3. Fill form:
   - Member: Select member
   - Amount: 100000
   - Reason: Equipment loan
   - Due Date: 30 days from now
4. Submit
5. **Expected**: Debt appears in table with "unpaid" status

### Test 5: Add a Disbursement
1. Go to Disbursements tab
2. Click "Add Disbursement"
3. Fill form:
   - Member: Select member
   - Amount: 500000
   - Date: Today
   - Purpose: Medical Emergency
4. Submit
5. **Expected**: 
   - Disbursement recorded
   - Email progress shown
   - Notification sent to all members

### Test 6: Manual Penalty Calculation
```bash
# Test for all members
php artisan penalties:calculate --force

# Test for specific member
php artisan penalties:calculate --member=1 --force
```

**Expected Output**:
```
Starting penalty calculation...
Date: 2026-01-17 10:30:00

Calculating penalties for all members...

Penalty Calculation Summary
==========================

+-------------------+-------+
| Metric            | Value |
+-------------------+-------+
| Members Processed | 10    |
| Penalties Created | 3     |
| Errors            | 0     |
+-------------------+-------+

Members with New Penalties:
===========================
+---------------+-----------+----------+
| Member        | Penalties | Months   |
+---------------+-----------+----------+
| John Doe      | 2         | 2025-11, |
|               |           | 2025-12  |
| Jane Smith    | 1         | 2025-12  |
+---------------+-----------+----------+

✓ Penalty calculation completed successfully!
```

### Test 7: Verify Scheduled Task
```bash
# List all scheduled tasks
php artisan schedule:list

# Should show:
# 0 1 5 * * penalties:calculate ... Next Due: 2026-02-05 01:00:00
```

---

## Database Verification Queries

### Check Contributions
```sql
-- View all contributions with member names
SELECT 
    c.id,
    m.name as member_name,
    c.amount,
    c.type,
    c.contribution_month,
    c.date,
    c.purpose,
    c.notes
FROM contributions c
JOIN members m ON c.member_id = m.id
ORDER BY c.contribution_month DESC, c.created_at DESC
LIMIT 20;
```

### Check Penalties
```sql
-- View all penalties
SELECT 
    p.id,
    m.name as member_name,
    p.amount,
    p.penalty_month,
    p.status,
    p.due_date,
    p.calculated_at
FROM penalties p
JOIN members m ON p.member_id = m.id
ORDER BY p.created_at DESC
LIMIT 20;
```

### Check Member Financial Summary
```sql
-- Get financial summary for a specific member
SELECT 
    m.name,
    COALESCE(SUM(CASE WHEN c.type = 'monthly' THEN c.amount END), 0) as total_monthly,
    COALESCE(SUM(CASE WHEN c.type = 'other' THEN c.amount END), 0) as total_other,
    COALESCE(SUM(CASE WHEN d.status = 'unpaid' THEN d.amount END), 0) as unpaid_debts,
    COALESCE(SUM(CASE WHEN p.status = 'unpaid' THEN p.amount END), 0) as unpaid_penalties
FROM members m
LEFT JOIN contributions c ON m.id = c.member_id
LEFT JOIN debts d ON m.id = d.member_id
LEFT JOIN penalties p ON m.id = p.member_id
WHERE m.id = [MEMBER_ID]
GROUP BY m.id, m.name;
```

---

## Common Issues & Solutions

### Issue: "Add Contribution" button not showing
**Solution**: Clear browser cache and rebuild assets
```bash
npm run build
php artisan optimize:clear
```

### Issue: Penalties not calculating automatically
**Solution**: 
1. Verify cron is running: `crontab -l`
2. Check scheduler: `php artisan schedule:list`
3. Test manually: `php artisan penalties:calculate --force`
4. Check logs: `tail -f storage/logs/laravel.log`

### Issue: Emails not sending
**Solution**:
1. Check `.env` mail configuration:
```env
MAIL_MAILER=smtp
MAIL_HOST=your-smtp-host
MAIL_PORT=587
MAIL_USERNAME=your-username
MAIL_PASSWORD=your-password
MAIL_ENCRYPTION=tls
MAIL_FROM_ADDRESS=noreply@example.com
MAIL_FROM_NAME="${APP_NAME}"
```
2. Test mail: `php artisan tinker`
```php
Mail::raw('Test email', function($message) {
    $message->to('test@example.com')->subject('Test');
});
```

### Issue: Contribution distribution not working
**Solution**:
1. Verify settings exist:
```sql
SELECT * FROM settings WHERE key = 'monthly_contribution_amount';
```
2. Check logs for errors
3. Verify member_id exists in members table

### Issue: Forms not submitting
**Solution**:
1. Check browser console for errors
2. Verify CSRF token is present
3. Check network tab for API response
4. Verify routes are registered: `php artisan route:list | grep contributions`

---

## Performance Testing

### Test Large Batch Penalty Calculation
```bash
# Time the calculation
time php artisan penalties:calculate --force

# Should complete in < 30 seconds for 1000 members
```

### Test Contribution Import
```bash
# Download template
curl http://localhost/contributions/template -o template.csv

# Fill with test data and import via UI
```

---

## Monitoring

### Check Scheduler Status
```bash
# View scheduled tasks
php artisan schedule:list

# Test scheduler (runs all due tasks)
php artisan schedule:run

# View last run
php artisan schedule:work
```

### Monitor Logs
```bash
# Watch all logs
tail -f storage/logs/laravel.log

# Watch penalty-related logs only
tail -f storage/logs/laravel.log | grep -i penalty

# Watch email-related logs
tail -f storage/logs/laravel.log | grep -i "email\|mail"
```

---

## Production Deployment Checklist

- [ ] Set up cron job for scheduler
- [ ] Configure mail settings in `.env`
- [ ] Set correct `monthly_contribution_amount` in settings
- [ ] Set correct `penalty_percentage_rate` in settings
- [ ] Test penalty calculation manually
- [ ] Test email sending
- [ ] Verify all forms work
- [ ] Check database indexes are created
- [ ] Set up log rotation
- [ ] Configure backup schedule
- [ ] Test with real member data
- [ ] Train administrators on system usage

---

## Support

For issues or questions:
1. Check logs: `storage/logs/laravel.log`
2. Review documentation: `FINANCIALS_FEATURES_DOCUMENTATION.md`
3. Test manually: `php artisan penalties:calculate --force -v`
4. Check database: Run verification queries above

---

## Next Steps

1. **Test all features** using the test scenarios above
2. **Configure settings** for your organization
3. **Set up scheduler** for automatic penalties
4. **Train administrators** on using the system
5. **Monitor logs** for the first few days
6. **Adjust settings** based on feedback

The system is ready for production use! 🚀
