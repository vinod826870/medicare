# Database Setup Guide - Medicine Search Not Working

## Problem

When searching for medicines (e.g., "aspirin"), you see this message:
> "No medicines found for 'aspirin'"

This means your `medicine_data` table is either:
1. Empty (no medicine records)
2. Not created yet
3. Or the `search_medicines` RPC function doesn't exist

---

## Quick Diagnosis

### Step 1: Check if medicine_data table exists

Run this in your Supabase SQL Editor:

```sql
SELECT COUNT(*) as total_medicines FROM medicine_data;
```

**Expected Result:**
- If you see a number > 0: Table exists and has data ✅
- If you see 0: Table exists but is empty ❌
- If you see an error: Table doesn't exist ❌

---

### Step 2: Check if search_medicines RPC function exists

Run this in your Supabase SQL Editor:

```sql
SELECT * FROM pg_proc WHERE proname = 'search_medicines';
```

**Expected Result:**
- If you see a row: RPC function exists ✅
- If you see no rows: RPC function doesn't exist ❌

---

### Step 3: Test search manually

Run this in your Supabase SQL Editor:

```sql
SELECT * FROM medicine_data 
WHERE name ILIKE '%aspirin%' 
LIMIT 5;
```

**Expected Result:**
- If you see medicines: Data exists and search should work ✅
- If you see no rows: No medicines with "aspirin" in the name ❌

---

## Solution 1: Create medicine_data Table

If the table doesn't exist, create it:

```sql
-- Create medicine_data table
CREATE TABLE IF NOT EXISTS medicine_data (
  id bigint PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  name text NOT NULL,
  manufacturer_name text,
  short_composition1 text,
  type text,
  price numeric(10, 2),
  is_discontinued boolean DEFAULT false,
  pack_size_label text,
  created_at timestamptz DEFAULT now()
);

-- Create indexes for fast searching
CREATE INDEX IF NOT EXISTS idx_medicine_name ON medicine_data(name);
CREATE INDEX IF NOT EXISTS idx_medicine_manufacturer ON medicine_data(manufacturer_name);
CREATE INDEX IF NOT EXISTS idx_medicine_type ON medicine_data(type);

-- Enable trigram extension for fuzzy search
CREATE EXTENSION IF NOT EXISTS pg_trgm;

-- Create trigram indexes
CREATE INDEX IF NOT EXISTS idx_medicine_name_trgm ON medicine_data USING gin(name gin_trgm_ops);
CREATE INDEX IF NOT EXISTS idx_medicine_manufacturer_trgm ON medicine_data USING gin(manufacturer_name gin_trgm_ops);
```

---

## Solution 2: Create search_medicines RPC Function

If the RPC function doesn't exist, create it:

```sql
-- Create search_medicines RPC function
CREATE OR REPLACE FUNCTION search_medicines(
  search_query text,
  medicine_type text DEFAULT NULL,
  exclude_discontinued boolean DEFAULT true,
  page_num integer DEFAULT 1,
  page_size integer DEFAULT 20
)
RETURNS SETOF medicine_data
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN QUERY
  SELECT *
  FROM medicine_data
  WHERE
    (search_query IS NULL OR search_query = '' OR
     name ILIKE '%' || search_query || '%' OR
     manufacturer_name ILIKE '%' || search_query || '%' OR
     short_composition1 ILIKE '%' || search_query || '%')
    AND (medicine_type IS NULL OR type = medicine_type)
    AND (NOT exclude_discontinued OR is_discontinued IS NULL OR is_discontinued = false)
  ORDER BY
    CASE
      WHEN name ILIKE search_query || '%' THEN 1
      WHEN name ILIKE '%' || search_query || '%' THEN 2
      ELSE 3
    END,
    name
  LIMIT page_size
  OFFSET (page_num - 1) * page_size;
END;
$$;
```

---

## Solution 3: Populate medicine_data Table

### Option A: Add Sample Medicines for Testing

```sql
-- Insert sample medicines for testing
INSERT INTO medicine_data (name, manufacturer_name, short_composition1, type, price, is_discontinued)
VALUES
  ('Aspirin 100mg Tablet', 'Bayer', 'Acetylsalicylic Acid 100mg', 'tablet', 5.99, false),
  ('Aspirin 75mg Tablet', 'Generic Pharma', 'Acetylsalicylic Acid 75mg', 'tablet', 3.99, false),
  ('Aspirin 325mg Tablet', 'Bayer', 'Acetylsalicylic Acid 325mg', 'tablet', 7.99, false),
  ('Paracetamol 500mg Tablet', 'GSK', 'Paracetamol 500mg', 'tablet', 4.99, false),
  ('Paracetamol 650mg Tablet', 'Johnson & Johnson', 'Paracetamol 650mg', 'tablet', 6.99, false),
  ('Ibuprofen 200mg Tablet', 'Pfizer', 'Ibuprofen 200mg', 'tablet', 8.99, false),
  ('Ibuprofen 400mg Tablet', 'Pfizer', 'Ibuprofen 400mg', 'tablet', 12.99, false),
  ('Amoxicillin 500mg Capsule', 'Cipla', 'Amoxicillin 500mg', 'capsule', 15.99, false),
  ('Cetirizine 10mg Tablet', 'Sun Pharma', 'Cetirizine Hydrochloride 10mg', 'tablet', 6.99, false),
  ('Omeprazole 20mg Capsule', 'Dr. Reddy''s', 'Omeprazole 20mg', 'capsule', 9.99, false),
  ('Metformin 500mg Tablet', 'Lupin', 'Metformin Hydrochloride 500mg', 'tablet', 5.99, false),
  ('Atorvastatin 10mg Tablet', 'Ranbaxy', 'Atorvastatin 10mg', 'tablet', 18.99, false),
  ('Losartan 50mg Tablet', 'Torrent', 'Losartan Potassium 50mg', 'tablet', 14.99, false),
  ('Amlodipine 5mg Tablet', 'Alkem', 'Amlodipine 5mg', 'tablet', 7.99, false),
  ('Levothyroxine 50mcg Tablet', 'Abbott', 'Levothyroxine Sodium 50mcg', 'tablet', 11.99, false),
  ('Pantoprazole 40mg Tablet', 'Zydus', 'Pantoprazole 40mg', 'tablet', 10.99, false),
  ('Clopidogrel 75mg Tablet', 'Piramal', 'Clopidogrel 75mg', 'tablet', 16.99, false),
  ('Ranitidine 150mg Tablet', 'Mankind', 'Ranitidine 150mg', 'tablet', 5.99, false),
  ('Diclofenac 50mg Tablet', 'Intas', 'Diclofenac Sodium 50mg', 'tablet', 8.99, false),
  ('Montelukast 10mg Tablet', 'Hetero', 'Montelukast 10mg', 'tablet', 13.99, false);
```

---

### Option B: Import Full Medicine Dataset

If you have a CSV file with medicine data:

1. Go to Supabase Dashboard
2. Navigate to Table Editor → medicine_data
3. Click "Insert" → "Import data from CSV"
4. Upload your CSV file
5. Map the columns correctly
6. Click "Import"

**CSV Format Example:**
```csv
name,manufacturer_name,short_composition1,type,price,is_discontinued
"Aspirin 100mg Tablet","Bayer","Acetylsalicylic Acid 100mg","tablet",5.99,false
"Paracetamol 500mg Tablet","GSK","Paracetamol 500mg","tablet",4.99,false
```

---

## Solution 4: Check Supabase Connection

### Verify Environment Variables

Check your `.env` file:

```bash
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

**Make sure:**
- ✅ URL is correct (ends with `.supabase.co`)
- ✅ Anon key is correct (long string starting with `eyJ`)
- ✅ No extra spaces or quotes
- ✅ File is named `.env` (not `.env.example`)

---

### Test Connection in Browser Console

1. Open your app in browser
2. Open DevTools (F12)
3. Go to Console tab
4. Run this:

```javascript
// Test Supabase connection
const { data, error } = await supabase.from('medicine_data').select('count');
console.log('Connection test:', { data, error });
```

**Expected Result:**
- If you see `data: [{ count: X }]`: Connection works ✅
- If you see `error: {...}`: Connection failed ❌

---

## Solution 5: Check RLS (Row Level Security) Policies

If the table exists but search returns nothing, check RLS:

```sql
-- Check if RLS is enabled
SELECT tablename, rowsecurity 
FROM pg_tables 
WHERE tablename = 'medicine_data';
```

**If RLS is enabled (rowsecurity = true):**

You need to add a policy to allow reading:

```sql
-- Disable RLS (for public read access)
ALTER TABLE medicine_data DISABLE ROW LEVEL SECURITY;

-- OR create a policy to allow public read access
ALTER TABLE medicine_data ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read access" ON medicine_data
  FOR SELECT
  USING (true);
```

---

## Verification Steps

After applying the solutions, verify everything works:

### Step 1: Check Table Has Data

```sql
SELECT COUNT(*) FROM medicine_data;
-- Should return a number > 0
```

### Step 2: Test Search Function

```sql
SELECT * FROM search_medicines('aspirin', NULL, true, 1, 10);
-- Should return aspirin medicines
```

### Step 3: Test in Application

1. Go to `/interaction-checker` or `/substitutes`
2. Type "aspirin" in the search box
3. Wait 300ms
4. Should see medicines from the database

**Expected Result:** ✅ Medicines appear, no error message

---

## Common Issues and Solutions

### Issue 1: "relation 'medicine_data' does not exist"

**Solution:** Create the table using Solution 1

---

### Issue 2: "function search_medicines does not exist"

**Solution:** Create the RPC function using Solution 2

---

### Issue 3: Table exists but search returns nothing

**Possible Causes:**
1. Table is empty → Use Solution 3 to populate
2. RLS is blocking access → Use Solution 5 to fix policies
3. Medicine names don't match search → Try different search terms

---

### Issue 4: "permission denied for table medicine_data"

**Solution:** Fix RLS policies:

```sql
-- Allow public read access
ALTER TABLE medicine_data ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read access" ON medicine_data
  FOR SELECT
  USING (true);
```

---

### Issue 5: Search is very slow

**Solution:** Add indexes:

```sql
-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_medicine_name ON medicine_data(name);
CREATE INDEX IF NOT EXISTS idx_medicine_name_trgm ON medicine_data USING gin(name gin_trgm_ops);
```

---

## Complete Setup Script

Run this complete script to set up everything:

```sql
-- 1. Create table
CREATE TABLE IF NOT EXISTS medicine_data (
  id bigint PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  name text NOT NULL,
  manufacturer_name text,
  short_composition1 text,
  type text,
  price numeric(10, 2),
  is_discontinued boolean DEFAULT false,
  pack_size_label text,
  created_at timestamptz DEFAULT now()
);

-- 2. Create indexes
CREATE INDEX IF NOT EXISTS idx_medicine_name ON medicine_data(name);
CREATE INDEX IF NOT EXISTS idx_medicine_manufacturer ON medicine_data(manufacturer_name);
CREATE INDEX IF NOT EXISTS idx_medicine_type ON medicine_data(type);

-- 3. Enable trigram extension
CREATE EXTENSION IF NOT EXISTS pg_trgm;

-- 4. Create trigram indexes
CREATE INDEX IF NOT EXISTS idx_medicine_name_trgm ON medicine_data USING gin(name gin_trgm_ops);
CREATE INDEX IF NOT EXISTS idx_medicine_manufacturer_trgm ON medicine_data USING gin(manufacturer_name gin_trgm_ops);

-- 5. Disable RLS for public read access
ALTER TABLE medicine_data DISABLE ROW LEVEL SECURITY;

-- 6. Create search function
CREATE OR REPLACE FUNCTION search_medicines(
  search_query text,
  medicine_type text DEFAULT NULL,
  exclude_discontinued boolean DEFAULT true,
  page_num integer DEFAULT 1,
  page_size integer DEFAULT 20
)
RETURNS SETOF medicine_data
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN QUERY
  SELECT *
  FROM medicine_data
  WHERE
    (search_query IS NULL OR search_query = '' OR
     name ILIKE '%' || search_query || '%' OR
     manufacturer_name ILIKE '%' || search_query || '%' OR
     short_composition1 ILIKE '%' || search_query || '%')
    AND (medicine_type IS NULL OR type = medicine_type)
    AND (NOT exclude_discontinued OR is_discontinued IS NULL OR is_discontinued = false)
  ORDER BY
    CASE
      WHEN name ILIKE search_query || '%' THEN 1
      WHEN name ILIKE '%' || search_query || '%' THEN 2
      ELSE 3
    END,
    name
  LIMIT page_size
  OFFSET (page_num - 1) * page_size;
END;
$$;

-- 7. Insert sample data
INSERT INTO medicine_data (name, manufacturer_name, short_composition1, type, price, is_discontinued)
VALUES
  ('Aspirin 100mg Tablet', 'Bayer', 'Acetylsalicylic Acid 100mg', 'tablet', 5.99, false),
  ('Aspirin 75mg Tablet', 'Generic Pharma', 'Acetylsalicylic Acid 75mg', 'tablet', 3.99, false),
  ('Aspirin 325mg Tablet', 'Bayer', 'Acetylsalicylic Acid 325mg', 'tablet', 7.99, false),
  ('Paracetamol 500mg Tablet', 'GSK', 'Paracetamol 500mg', 'tablet', 4.99, false),
  ('Paracetamol 650mg Tablet', 'Johnson & Johnson', 'Paracetamol 650mg', 'tablet', 6.99, false),
  ('Ibuprofen 200mg Tablet', 'Pfizer', 'Ibuprofen 200mg', 'tablet', 8.99, false),
  ('Ibuprofen 400mg Tablet', 'Pfizer', 'Ibuprofen 400mg', 'tablet', 12.99, false),
  ('Amoxicillin 500mg Capsule', 'Cipla', 'Amoxicillin 500mg', 'capsule', 15.99, false),
  ('Cetirizine 10mg Tablet', 'Sun Pharma', 'Cetirizine Hydrochloride 10mg', 'tablet', 6.99, false),
  ('Omeprazole 20mg Capsule', 'Dr. Reddy''s', 'Omeprazole 20mg', 'capsule', 9.99, false),
  ('Metformin 500mg Tablet', 'Lupin', 'Metformin Hydrochloride 500mg', 'tablet', 5.99, false),
  ('Atorvastatin 10mg Tablet', 'Ranbaxy', 'Atorvastatin 10mg', 'tablet', 18.99, false),
  ('Losartan 50mg Tablet', 'Torrent', 'Losartan Potassium 50mg', 'tablet', 14.99, false),
  ('Amlodipine 5mg Tablet', 'Alkem', 'Amlodipine 5mg', 'tablet', 7.99, false),
  ('Levothyroxine 50mcg Tablet', 'Abbott', 'Levothyroxine Sodium 50mcg', 'tablet', 11.99, false),
  ('Pantoprazole 40mg Tablet', 'Zydus', 'Pantoprazole 40mg', 'tablet', 10.99, false),
  ('Clopidogrel 75mg Tablet', 'Piramal', 'Clopidogrel 75mg', 'tablet', 16.99, false),
  ('Ranitidine 150mg Tablet', 'Mankind', 'Ranitidine 150mg', 'tablet', 5.99, false),
  ('Diclofenac 50mg Tablet', 'Intas', 'Diclofenac Sodium 50mg', 'tablet', 8.99, false),
  ('Montelukast 10mg Tablet', 'Hetero', 'Montelukast 10mg', 'tablet', 13.99, false)
ON CONFLICT (id) DO NOTHING;

-- 8. Verify setup
SELECT 
  'Total medicines: ' || COUNT(*) as status
FROM medicine_data;

SELECT 
  'Search function exists: ' || 
  CASE WHEN EXISTS (SELECT 1 FROM pg_proc WHERE proname = 'search_medicines') 
    THEN 'YES' 
    ELSE 'NO' 
  END as status;
```

---

## After Setup

Once you've run the setup script:

1. **Verify in Supabase:**
   - Go to Table Editor
   - Check medicine_data table has records
   - Try running: `SELECT * FROM medicine_data LIMIT 10;`

2. **Test in Application:**
   - Go to `/interaction-checker`
   - Search for "aspirin"
   - Should see 3 aspirin medicines

3. **Check Console:**
   - Open browser DevTools
   - Should see: `✅ Supabase returned X results`
   - Should NOT see errors

---

## Need More Help?

### Check These Files:
- `MEDICINE_DATA_INTEGRATION.md` - How the integration works
- `MEDICINE_DATA_FLOW.md` - Visual data flow diagrams
- `REMOVE_LOCAL_DATA_FALLBACK.md` - Why local data was removed

### Common Questions:

**Q: How many medicines should I have?**
A: Minimum 20 for testing. Ideally 253,973 for production.

**Q: Where do I get medicine data?**
A: You can:
- Use the sample data provided above (20 medicines)
- Import from a CSV file
- Use a medicine database API
- Manually add medicines through Supabase UI

**Q: Why is search slow?**
A: Make sure you have indexes created (see Solution 5)

**Q: Can I use a different table name?**
A: Yes, but you'll need to update the code in:
- `src/db/medicineDataApi.ts`
- `src/services/medicineApi.ts`

---

## Summary

To fix "No medicines found" error:

1. ✅ Create `medicine_data` table
2. ✅ Create `search_medicines` RPC function
3. ✅ Populate table with medicine data
4. ✅ Disable RLS or add read policy
5. ✅ Verify Supabase connection
6. ✅ Test search in application

**Quick Fix:** Run the Complete Setup Script above in your Supabase SQL Editor!

---

**After setup, searching for "aspirin" should return 3 medicines!** 🎉
