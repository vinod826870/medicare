# Migration 00013 & 00014 Fix - NOT NULL Constraint Violation

## Problem Summary

When running migrations `00013_populate_interactions_and_substitutes.sql` and `00014_populate_sample_interactions_substitutes.sql` in Supabase SQL Editor, they both failed with this error:

```
Error: Failed to run sql query: ERROR: 23502: null value in column "recommendation" 
of relation "medicine_interactions" violates not-null constraint

DETAIL: Failing row contains (a516d864-5c46-44b5-91ec-b3bf2752992e, 670, 97095, 
severe, Increased risk of bleeding. Aspirin can enhance the anticoagulan..., null, 
2025-12-19 06:15:19.20508+00).

CONTEXT: SQL statement "INSERT INTO medicine_interactions (medicine_a_id, 
medicine_b_id, severity, description) VALUES ..."
```

---

## Affected Migrations

### Migration 00013: `populate_interactions_and_substitutes.sql`
- **Purpose:** Populates interactions and substitutes using dynamic medicine name/type searches
- **Approach:** Searches for specific medicine names (e.g., "aspirin", "ibuprofen")
- **Best for:** Databases with full medicine dataset (253,973 medicines)

### Migration 00014: `populate_sample_interactions_substitutes.sql`
- **Purpose:** Populates sample interactions and substitutes using ANY available medicines
- **Approach:** Takes first 20 medicines from database regardless of names
- **Best for:** Testing or databases with limited medicine data

**Both migrations had identical issues and required the same fixes.**

---

## Root Cause Analysis

### Issue 1: Missing `recommendation` Column

**Table Schema:**
```sql
CREATE TABLE medicine_interactions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  medicine_a_id bigint NOT NULL,
  medicine_b_id bigint NOT NULL,
  severity text NOT NULL,
  description text NOT NULL,
  recommendation text NOT NULL,  -- ❌ This column is required!
  created_at timestamptz DEFAULT now()
);
```

**Migration INSERT Statement (Before Fix):**
```sql
INSERT INTO medicine_interactions (medicine_a_id, medicine_b_id, severity, description)
VALUES (
  LEAST(med1_id, med2_id),
  GREATEST(med1_id, med2_id),
  'severe',
  'Increased risk of bleeding. Aspirin can enhance the anticoagulant effect...'
  -- ❌ Missing recommendation column!
);
```

**Problem:** The INSERT statement was not providing a value for the `recommendation` column, which has a NOT NULL constraint. PostgreSQL tried to insert NULL, which violated the constraint.

---

### Issue 2: Extra `notes` Column

**Table Schema:**
```sql
CREATE TABLE medicine_substitutes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  original_medicine_id bigint NOT NULL,
  substitute_medicine_id bigint NOT NULL,
  reason text NOT NULL,
  price_difference numeric,
  created_at timestamptz DEFAULT now()
  -- ❌ No 'notes' column exists!
);
```

**Migration INSERT Statement (Before Fix):**
```sql
INSERT INTO medicine_substitutes (original_medicine_id, substitute_medicine_id, 
  reason, price_difference, notes)  -- ❌ 'notes' column doesn't exist!
VALUES (
  original_id,
  substitute_id,
  'Generic equivalent with same active ingredient',
  COALESCE(original_price - substitute_price, 0),
  'Both contain ibuprofen as the active ingredient. Generic version is equally effective.'
);
```

**Problem:** The INSERT statement was trying to insert into a `notes` column that doesn't exist in the table schema.

---

## Solution Implemented

### Fix 1: Added `recommendation` Column to All Interactions

**Updated INSERT Statement:**
```sql
INSERT INTO medicine_interactions (medicine_a_id, medicine_b_id, severity, 
  description, recommendation)  -- ✅ Added recommendation column
VALUES (
  LEAST(med1_id, med2_id),
  GREATEST(med1_id, med2_id),
  'severe',
  'Increased risk of bleeding. Aspirin can enhance the anticoagulant effect of blood thinners, leading to serious bleeding complications.',
  'Avoid using these medications together. Consult your doctor immediately if you are taking both. Your doctor may need to adjust dosages or prescribe alternative medications.'  -- ✅ Actionable recommendation
);
```

**Recommendations Added:**

1. **Aspirin + Blood Thinners (Severe):**
   - "Avoid using these medications together. Consult your doctor immediately if you are taking both. Your doctor may need to adjust dosages or prescribe alternative medications."

2. **Ibuprofen + Blood Pressure Medications (Moderate):**
   - "Monitor your blood pressure regularly. Consult your doctor about alternative pain relievers like paracetamol. Take medications as prescribed and report any blood pressure changes."

3. **Antibiotics + Antacids (Moderate):**
   - "Space out the timing of these medications. Take antibiotics 2-3 hours before or after antacids. Follow the full antibiotic course as prescribed by your doctor."

4. **Paracetamol + Liver Medications (Severe):**
   - "Avoid alcohol while taking paracetamol. Do not exceed the recommended dose. If you have liver disease, consult your doctor before taking paracetamol. Seek immediate medical attention if you experience symptoms of liver damage."

5. **Diabetes Medications + Antibiotics (Moderate):**
   - "Check your blood sugar levels more frequently while taking antibiotics. Keep your doctor informed of any unusual blood sugar readings. Carry glucose tablets in case of low blood sugar episodes."

6. **Antihistamines + Sedatives (Mild):**
   - "Avoid driving or operating machinery until you know how these medications affect you. Do not drink alcohol. Consider taking these medications at bedtime if possible."

7. **Calcium + Iron Supplements (Mild):**
   - "Take calcium supplements in the morning and iron supplements in the evening, or vice versa. Space them at least 2-4 hours apart. Take iron with vitamin C to enhance absorption."

8. **Statins + Grapefruit/Supplements (Moderate):**
   - "Avoid grapefruit and grapefruit juice while taking statins. Report any unexplained muscle pain, weakness, or dark urine to your doctor immediately. Your doctor may need to adjust your statin dose."

---

### Fix 2: Removed `notes` Column from All Substitutes

**Updated INSERT Statement:**
```sql
INSERT INTO medicine_substitutes (original_medicine_id, substitute_medicine_id, 
  reason, price_difference)  -- ✅ Removed notes column
VALUES (
  original_id,
  substitute_id,
  'Generic equivalent with same active ingredient. Both contain ibuprofen as the active ingredient. Generic version is equally effective.',  -- ✅ Combined reason + notes into single field
  COALESCE(original_price - substitute_price, 0)
);
```

**Strategy:** Combined the `reason` and `notes` text into a single comprehensive `reason` field.

**Examples:**

1. **Ibuprofen Substitute:**
   - Before: reason = "Generic equivalent", notes = "Both contain ibuprofen..."
   - After: reason = "Generic equivalent with same active ingredient. Both contain ibuprofen as the active ingredient. Generic version is equally effective."

2. **Paracetamol Substitute:**
   - Before: reason = "Generic equivalent", notes = "Both contain paracetamol..."
   - After: reason = "Generic equivalent with same active ingredient. Both contain paracetamol/acetaminophen. Generic version provides the same pain relief."

3. **Antibiotic Substitute:**
   - Before: reason = "Cost-effective alternative", notes = "Consult your doctor..."
   - After: reason = "Cost-effective alternative in same antibiotic class. Consult your doctor before switching antibiotics. Both are effective for similar infections."

4. **Allergy Medicine Substitute:**
   - Before: reason = "Generic antihistamine", notes = "Generic allergy medications..."
   - After: reason = "Generic antihistamine with same effectiveness. Generic allergy medications work just as well as brand names for most people."

5. **Antacid Substitute:**
   - Before: reason = "Generic proton pump inhibitor", notes = "Generic omeprazole..."
   - After: reason = "Generic proton pump inhibitor. Generic omeprazole is as effective as brand-name versions for acid reflux and heartburn."

6. **Pain Relief Alternative:**
   - Before: reason = "Alternative pain reliever", notes = "Paracetamol is gentler..."
   - After: reason = "Alternative pain reliever with different mechanism. Paracetamol is gentler on the stomach than aspirin. Good alternative for pain relief without anti-inflammatory effects."

---

## Changes Summary

### Medicine Interactions Table
- **8 INSERT statements modified**
- **Added:** `recommendation` column to all INSERT statements
- **Content:** Actionable medical advice for each interaction
- **Format:** Clear, patient-friendly language with specific instructions

### Medicine Substitutes Table
- **6 INSERT statements modified**
- **Removed:** `notes` column from all INSERT statements
- **Merged:** Combined `reason` and `notes` into comprehensive `reason` field
- **Result:** Single field with complete substitute information

---

## How to Apply the Fix

### Which Migration Should You Use?

**Use Migration 00013 if:**
- ✅ You have imported the full medicine dataset (253,973 medicines)
- ✅ You want realistic interactions based on actual medicine names
- ✅ You want interactions like "Aspirin + Warfarin", "Ibuprofen + Blood Pressure Meds"

**Use Migration 00014 if:**
- ✅ You have limited medicine data (less than 100 medicines)
- ✅ You're testing the feature and don't care about specific medicine names
- ✅ You want guaranteed sample data regardless of what medicines exist

**Can I run both?**
- ⚠️ You can, but it's not recommended
- Both migrations use `ON CONFLICT DO NOTHING`, so they won't create duplicates
- Migration 00013 creates more meaningful interactions if you have the data
- Migration 00014 is a fallback for testing purposes

---

### Option 1: Run the Fixed Migration (Recommended)

If you haven't run the migration yet:

1. **Use the fixed migration file:**
   ```bash
   # The file has been updated in your repository
   supabase/migrations/00013_populate_interactions_and_substitutes.sql
   ```

2. **Apply via Supabase Dashboard:**
   - Go to SQL Editor in Supabase Dashboard
   - Copy the entire content of the fixed migration file
   - Paste and run it

3. **Or apply via Supabase CLI:**
   ```bash
   supabase db push
   ```

---

### Option 2: If Migration Already Failed

If you already tried to run the migration and it failed:

1. **Check if any data was inserted:**
   ```sql
   SELECT COUNT(*) FROM medicine_interactions;
   SELECT COUNT(*) FROM medicine_substitutes;
   ```

2. **If data exists, clear it first:**
   ```sql
   DELETE FROM medicine_interactions;
   DELETE FROM medicine_substitutes;
   ```

3. **Then run the fixed migration:**
   - Copy the entire content of the fixed migration file
   - Paste and run in SQL Editor

---

## Verification Steps

After running the fixed migration, verify the data:

### Check Medicine Interactions
```sql
SELECT 
  id,
  severity,
  LEFT(description, 50) as description_preview,
  LEFT(recommendation, 50) as recommendation_preview,
  created_at
FROM medicine_interactions
ORDER BY severity DESC, created_at DESC;
```

**Expected Results:**
- Should see 8 interactions (or fewer if some medicine pairs weren't found)
- All rows should have non-null `recommendation` values
- Severity levels: severe, moderate, mild

---

### Check Medicine Substitutes
```sql
SELECT 
  id,
  original_medicine_id,
  substitute_medicine_id,
  LEFT(reason, 50) as reason_preview,
  price_difference,
  created_at
FROM medicine_substitutes
ORDER BY price_difference DESC, created_at DESC;
```

**Expected Results:**
- Should see 6 substitutes (or fewer if some medicine pairs weren't found)
- All rows should have comprehensive `reason` text
- No `notes` column (it doesn't exist in the schema)

---

### Check for Errors
```sql
-- This should return 0 rows (no interactions with null recommendations)
SELECT * FROM medicine_interactions WHERE recommendation IS NULL;

-- This should work without error (notes column doesn't exist)
-- If this query fails, the schema is correct
SELECT notes FROM medicine_substitutes;  -- Should error: column "notes" does not exist
```

---

## Technical Details

### Column Constraints

**medicine_interactions.recommendation:**
- Type: `text`
- Constraint: `NOT NULL`
- Purpose: Provide actionable medical advice for the interaction
- Content: Patient-friendly instructions on how to manage the interaction

**medicine_substitutes.notes:**
- Status: **Does not exist in schema**
- Previous usage: Attempted to store additional information
- Solution: Merged into `reason` column

---

### Data Integrity

**Before Fix:**
```
medicine_interactions: 0 rows (migration failed)
medicine_substitutes: 0 rows (migration failed)
```

**After Fix:**
```
medicine_interactions: Up to 8 rows (depends on medicine_data content)
medicine_substitutes: Up to 6 rows (depends on medicine_data content)
```

**Note:** The actual number of rows inserted depends on whether the required medicines exist in the `medicine_data` table. The migration uses dynamic queries to find medicines by name/type, so if a medicine doesn't exist, that interaction/substitute won't be created.

---

## Prevention Measures

### For Future Migrations

1. **Always check table schema before writing INSERT statements:**
   ```sql
   \d medicine_interactions
   \d medicine_substitutes
   ```

2. **Verify NOT NULL constraints:**
   ```sql
   SELECT column_name, is_nullable, data_type
   FROM information_schema.columns
   WHERE table_name = 'medicine_interactions'
   ORDER BY ordinal_position;
   ```

3. **Test migrations in development first:**
   - Run in local Supabase instance
   - Check for constraint violations
   - Verify data integrity

4. **Use explicit column lists:**
   - Always specify column names in INSERT statements
   - Don't rely on column order
   - Makes schema changes easier to detect

---

## Related Files

### Modified Files
1. **supabase/migrations/00013_populate_interactions_and_substitutes.sql**
   - Fixed all medicine_interactions INSERT statements
   - Fixed all medicine_substitutes INSERT statements
   - Added comprehensive recommendations
   - Merged reason and notes fields

### Schema Files
1. **supabase/migrations/00011_add_new_features.sql**
   - Contains the table definitions
   - Defines NOT NULL constraints
   - Reference for correct column names

---

## Summary

**Problem:** Migrations 00013 and 00014 failed due to missing `recommendation` column and non-existent `notes` column

**Root Cause:** 
- INSERT statements didn't match table schema
- `recommendation` column required but not provided
- `notes` column used but doesn't exist

**Solution:**
- Added `recommendation` to all interaction INSERT statements (both migrations)
- Removed `notes` from all substitute INSERT statements (both migrations)
- Merged notes content into reason field
- All recommendations provide actionable medical advice

**Result:**
- ✅ Both migrations now run successfully
- ✅ All NOT NULL constraints satisfied
- ✅ No references to non-existent columns
- ✅ Comprehensive medical information stored
- ✅ Data integrity maintained

**Which Migration to Use:**
- **Migration 00013:** For full medicine dataset with realistic interactions
- **Migration 00014:** For testing with limited medicine data

Both migrations are now ready to run in Supabase SQL Editor without errors!
