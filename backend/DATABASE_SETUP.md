# Database Setup Instructions

## Automatic Method (Recommended)

Run the migration script:
```bash
cd backend
node run-migrations.js
```

## Manual Method (If automatic fails)

1. Go to your Supabase SQL Editor:
   https://supabase.com/dashboard/project/auccbswepellxtoulbld/sql

2. Open and run each migration file in order:
   - `backend/migrations/001_medicines_tables.sql`
   - `backend/migrations/002_lab_tests_tables.sql`

3. Copy the entire content of each file and execute in the SQL editor

## What Gets Created

### Medicines System
- **medicines** table: 12 medicines with prices, descriptions, stock status
- **prescription_orders** table: For tracking medicine orders

### Lab Tests System
- **lab_tests** table: 15 common medical tests with details
- **test_bookings** table: For booking and tracking lab tests

## Verify Installation

Run these queries in Supabase SQL Editor:

```sql
-- Check medicines
SELECT COUNT(*) FROM medicines;
-- Should return: 12

-- Check lab tests
SELECT COUNT(*) FROM lab_tests;
-- Should return: 15
```
