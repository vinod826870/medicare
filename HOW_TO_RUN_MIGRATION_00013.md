# How to Run Migrations 00013 & 00014 - Quick Guide

## Overview

There are **two migrations** available for populating medicine interactions and substitutes:

### Migration 00013: Dynamic Name-Based Population
- **File:** `00013_populate_interactions_and_substitutes.sql`
- **Approach:** Searches for specific medicine names (e.g., "aspirin", "ibuprofen")
- **Best for:** Databases with full medicine dataset (253,973 medicines)
- **Creates:** Up to 8 realistic interactions and 6 substitutes

### Migration 00014: Sample Data Population
- **File:** `00014_populate_sample_interactions_substitutes.sql`
- **Approach:** Uses ANY available medicines (first 20 from database)
- **Best for:** Testing or databases with limited medicine data
- **Creates:** Up to 8 sample interactions and 6 substitutes

---

## Which Migration Should You Use?

### Use Migration 00013 if:
- ✅ You have imported the full medicine dataset
- ✅ You want realistic interactions (e.g., "Aspirin + Warfarin")
- ✅ You want meaningful medicine names in your data

### Use Migration 00014 if:
- ✅ You have limited medicine data (less than 100 medicines)
- ✅ You're testing the feature
- ✅ You want guaranteed sample data regardless of medicine names

### Can I Run Both?
- ⚠️ Not recommended, but safe
- Both use `ON CONFLICT DO NOTHING` to prevent duplicates
- Choose the one that best fits your data situation

---

## What These Migrations Do
- **8 Medicine Interactions** - Common drug interactions with severity levels and recommendations
- **6 Medicine Substitutes** - Generic alternatives and cost-effective substitutes

---

## Prerequisites

Before running this migration, ensure:

1. ✅ **Migration 00008 is applied** - Creates the `medicine_data` table
2. ✅ **Migration 00011 is applied** - Creates `medicine_interactions` and `medicine_substitutes` tables
3. ✅ **Medicine data is populated** - The `medicine_data` table should have medicines

**Check if prerequisites are met:**
```sql
-- Check if tables exist
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
  AND table_name IN ('medicine_data', 'medicine_interactions', 'medicine_substitutes');

-- Check if medicine_data has data
SELECT COUNT(*) as medicine_count FROM medicine_data;
```

**Expected Results:**
- Should see all 3 tables listed
- `medicine_count` should be greater than 0 (ideally 100,000+)

---

## Step-by-Step Instructions

### Step 1: Open Supabase SQL Editor

1. Go to your Supabase Dashboard: https://supabase.com/dashboard
2. Select your project
3. Click on **SQL Editor** in the left sidebar
4. Click **New Query**

---

### Step 2: Copy the Migration SQL

**For Migration 00013:**
1. Open the migration file: `supabase/migrations/00013_populate_interactions_and_substitutes.sql`
2. Copy the **entire content** of the file (all 338 lines)

**For Migration 00014:**
1. Open the migration file: `supabase/migrations/00014_populate_sample_interactions_substitutes.sql`
2. Copy the **entire content** of the file (all 215 lines)

---

### Step 3: Run the Migration

1. Paste the SQL into the SQL Editor
2. Click **Run** button (or press Ctrl+Enter / Cmd+Enter)
3. Wait for the query to complete (should take 1-5 seconds)

---

### Step 4: Verify Success

**Check for success message:**
```
Success. No rows returned
```

**Verify data was inserted:**
```sql
-- Check medicine interactions
SELECT COUNT(*) as interaction_count FROM medicine_interactions;

-- Check medicine substitutes
SELECT COUNT(*) as substitute_count FROM medicine_substitutes;
```

**Expected Results:**
- `interaction_count`: Between 0 and 8 (depends on available medicines)
- `substitute_count`: Between 0 and 6 (depends on available medicines)

**Note:** If counts are 0, it means the required medicines weren't found in `medicine_data`. This is normal if your database doesn't have those specific medicines yet.

---

### Step 5: View the Data

**View interactions:**
```sql
SELECT 
  severity,
  description,
  recommendation,
  created_at
FROM medicine_interactions
ORDER BY 
  CASE severity 
    WHEN 'severe' THEN 1 
    WHEN 'moderate' THEN 2 
    WHEN 'mild' THEN 3 
  END,
  created_at DESC;
```

**View substitutes:**
```sql
SELECT 
  reason,
  price_difference,
  created_at
FROM medicine_substitutes
ORDER BY price_difference DESC, created_at DESC;
```

---

## Troubleshooting

### Error: "null value in column recommendation violates not-null constraint"

**Cause:** You're using an old version of the migration file.

**Solution:**
1. Make sure you're using the **fixed version** from the repository
2. The file should include `recommendation` in all INSERT statements
3. Re-copy the entire file and run again

---

### Error: "column notes does not exist"

**Cause:** You're using an old version of the migration file.

**Solution:**
1. Make sure you're using the **fixed version** from the repository
2. The file should NOT include `notes` in any INSERT statements
3. Re-copy the entire file and run again

---

### No Data Inserted (Count = 0)

**Cause:** The required medicines don't exist in your `medicine_data` table.

**Solution:** This is normal and not an error. The migration uses dynamic queries to find medicines by name/type. If specific medicines aren't found, those interactions/substitutes won't be created.

**To populate with sample medicines:**
```sql
-- Check what medicines you have
SELECT name, type FROM medicine_data LIMIT 20;

-- If you need sample data, run migration 00014 instead
-- (It creates sample interactions with guaranteed medicine IDs)
```

---

### Error: "relation medicine_interactions does not exist"

**Cause:** Migration 00011 hasn't been applied yet.

**Solution:**
1. First run migration `00011_add_new_features.sql`
2. Then run migration `00013_populate_interactions_and_substitutes.sql`

---

### Error: "relation medicine_data does not exist"

**Cause:** Migration 00008 hasn't been applied yet.

**Solution:**
1. First run migration `00008_create_medicine_data_table.sql`
2. Then run migration `00011_add_new_features.sql`
3. Finally run migration `00013_populate_interactions_and_substitutes.sql`

---

## What Gets Created

### Medicine Interactions (Up to 8)

1. **Aspirin + Blood Thinners** (Severe)
   - Risk: Increased bleeding
   - Recommendation: Avoid combination, consult doctor

2. **Ibuprofen + Blood Pressure Medications** (Moderate)
   - Risk: Reduced effectiveness of BP meds
   - Recommendation: Monitor BP, consider alternatives

3. **Antibiotics + Antacids** (Moderate)
   - Risk: Reduced antibiotic absorption
   - Recommendation: Space out timing by 2-3 hours

4. **Paracetamol + Liver Medications** (Severe)
   - Risk: Liver damage
   - Recommendation: Avoid alcohol, don't exceed dose

5. **Diabetes Medications + Antibiotics** (Moderate)
   - Risk: Blood sugar fluctuations
   - Recommendation: Monitor glucose frequently

6. **Antihistamines + Sedatives** (Mild)
   - Risk: Increased drowsiness
   - Recommendation: Avoid driving, no alcohol

7. **Calcium + Iron Supplements** (Mild)
   - Risk: Reduced iron absorption
   - Recommendation: Take at different times

8. **Statins + Grapefruit/Supplements** (Moderate)
   - Risk: Increased statin levels, muscle pain
   - Recommendation: Avoid grapefruit, report muscle pain

---

### Medicine Substitutes (Up to 6)

1. **Brand Ibuprofen → Generic Ibuprofen**
   - Reason: Same active ingredient, lower cost

2. **Brand Paracetamol → Generic Paracetamol**
   - Reason: Same active ingredient, lower cost

3. **Expensive Antibiotic → Generic Antibiotic**
   - Reason: Cost-effective alternative, consult doctor

4. **Brand Allergy Medicine → Generic Antihistamine**
   - Reason: Same effectiveness, lower cost

5. **Brand Antacid → Generic Omeprazole**
   - Reason: Same effectiveness for acid reflux

6. **Aspirin → Paracetamol**
   - Reason: Alternative pain reliever, gentler on stomach

---

## Important Notes

### Data Depends on medicine_data Content

The migration uses **dynamic queries** to find medicines:
- Searches by medicine name (e.g., "aspirin", "ibuprofen")
- Searches by medicine type (e.g., "antibiotic", "blood pressure")
- Only creates interactions/substitutes if both medicines are found

**This means:**
- ✅ If you have 253,973 medicines from the CSV import, you'll likely get all 8 interactions and 6 substitutes
- ⚠️ If you have limited sample data, you may get fewer or none
- ✅ The migration will never fail - it just creates what it can

---

### Safe to Run Multiple Times

The migration uses `ON CONFLICT DO NOTHING`, which means:
- ✅ Safe to run multiple times
- ✅ Won't create duplicate data
- ✅ Won't error if data already exists

---

### No Sample Data?

If your `medicine_data` table is empty or has limited data:

**Option 1:** Import the full medicine dataset first
```bash
# Import 253,973 medicines from CSV
# (See medicine data import documentation)
```

**Option 2:** Use migration 00014 instead
```sql
-- Migration 00014 creates sample interactions with guaranteed IDs
-- Run this if you want to test the feature without full medicine data
```

---

## After Running the Migration

### Test the Features

1. **Test Medicine Interaction Checker:**
   - Go to: http://your-app-url/interaction-checker
   - Search for two medicines
   - Click "Check Interactions"
   - Should see interaction results if they exist

2. **Test Medicine Substitutes Finder:**
   - Go to: http://your-app-url/substitutes
   - Search for a medicine
   - Should see substitute suggestions if they exist

3. **Test Admin Panels:**
   - Go to: http://your-app-url/admin/interactions
   - Should see the created interactions
   - Go to: http://your-app-url/admin/substitutes
   - Should see the created substitutes

---

## Need Help?

### Check the Documentation

- **MIGRATION_00013_FIX.md** - Detailed explanation of the fix
- **MEDICINE_SEARCH_TROUBLESHOOTING.md** - Search feature troubleshooting
- **INTERACTION_CHECKER_FIX.md** - Interaction checker troubleshooting

### Common Questions

**Q: Why are no interactions created?**
A: The required medicines don't exist in your database. This is normal if you haven't imported the full medicine dataset.

**Q: Can I add more interactions manually?**
A: Yes! Use the Admin Panel → Interactions page to add custom interactions.

**Q: How do I know which medicines were found?**
A: Check the console logs in the SQL Editor. The migration will show which medicines it found and created relationships for.

**Q: Is it safe to delete and re-run?**
A: Yes! You can delete all data and re-run:
```sql
DELETE FROM medicine_interactions;
DELETE FROM medicine_substitutes;
-- Then run the migration again
```

---

## Summary

1. ✅ Ensure prerequisites are met (tables exist, medicine data available)
2. ✅ Copy the entire migration file content
3. ✅ Paste into Supabase SQL Editor
4. ✅ Click Run
5. ✅ Verify data was created
6. ✅ Test the features in your application

The migration is designed to be safe, idempotent, and flexible. It will create as many interactions and substitutes as possible based on your available medicine data.
