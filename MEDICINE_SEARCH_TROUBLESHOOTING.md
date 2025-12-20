# Medicine Search Troubleshooting Guide

## Issue: "Medicine Interaction Checker not getting any medicine results"

This guide will help you diagnose and fix medicine search issues in the MediCare Online Pharmacy application.

---

## Quick Diagnosis Steps

### Step 1: Open Browser Console
1. Open the Medicine Interaction Checker page
2. Press `F12` or right-click → "Inspect" → "Console" tab
3. Type at least 2 characters in the search box (e.g., "asp" for Aspirin)
4. Watch the console for log messages

### Step 2: Check Console Messages

You should see messages like this:

```
🔍 Searching for: asp
🔎 medicineApiService.searchMedicines called with: {query: "asp", limit: 20, useLocalData: false}
🌐 Calling Supabase searchSupabaseMedicines...
🔍 searchMedicines (Supabase RPC) called with: {query: "asp", limit: 20}
📡 Calling supabase.rpc("search_medicines")...
✅ Supabase RPC returned: 15 results
First result sample: {id: 123, name: "Aspirin 500mg", ...}
✅ Supabase returned 15 results
✅ Search results: 15 medicines found
First result: {id: "123", name: "Aspirin 500mg", ...}
```

---

## Common Issues and Solutions

### Issue 0: NaN Error When Checking Interactions

**Symptoms:**
```
GET .../medicine_interactions?...medicine_a_id.eq.NaN... 400 (Bad Request)
Error: invalid input syntax for type bigint: "NaN"
```

**Cause:** Trying to check interactions with local medicines that have string IDs like "local-1" instead of numeric database IDs.

**Solution:**
- The system now automatically filters out local medicines before checking interactions
- You'll see a warning message: "Some selected medicines are from local sample data"
- Only medicines with numeric database IDs will be checked for interactions
- To check interactions properly, ensure Supabase is connected and medicines are from the database

**Console Output:**
```
🔍 Checking interactions for medicines: [{id: "local-1", name: "Aspirin"}, {id: "12345", name: "Ibuprofen"}]
✅ Valid medicines (numeric IDs): 1 out of 2
⚠️ Some medicines have local IDs and cannot be checked: ["Aspirin"]
```

---

### Issue 1: Supabase Not Connected

**Symptoms:**
```
❌ Supabase RPC error: {...}
📦 Falling back to local search
📦 Local search found 8 results
```

**Cause:** Supabase database is not initialized or connection failed.

**Solution:**
1. Check if `.env` file exists with correct Supabase credentials:
   ```
   VITE_SUPABASE_URL=your-project-url
   VITE_SUPABASE_ANON_KEY=your-anon-key
   ```
2. Verify Supabase project is active
3. Check network connection
4. **Fallback:** The app will automatically use local data (8 sample medicines)

---

### Issue 2: RPC Function Not Found

**Symptoms:**
```
❌ Supabase RPC error: {message: "function search_medicines does not exist"}
```

**Cause:** Database migration not applied or RPC function not created.

**Solution:**
1. Check if migrations were applied:
   ```bash
   # Check migration files
   ls supabase/migrations/
   ```
2. Look for these migrations:
   - `00008_create_medicine_data_table.sql` - Creates search_medicines function
   - `00009_fix_column_case_sensitivity.sql` - Fixes column names
3. If migrations exist but function is missing, the database needs to be re-initialized

---

### Issue 3: Empty Results from Supabase

**Symptoms:**
```
✅ Supabase RPC returned: 0 results
⚠️ No results from Supabase, trying local fallback
📦 Local search found 3 results
```

**Cause:** 
- Medicine database table is empty
- Search query doesn't match any medicines
- Full-text search vector not populated

**Solution:**
1. **Check if medicine_data table has data:**
   - The table should have 253,973 medicine records
   - If empty, data needs to be imported
   
2. **Try different search terms:**
   - Try common medicines: "aspirin", "paracetamol", "ibuprofen"
   - Try partial matches: "asp", "para", "ibu"
   - Try manufacturer names: "cipla", "sun pharma"

3. **Automatic Fallback:**
   - The app automatically falls back to local data (8 sample medicines)
   - You'll see results from local data even if Supabase is empty

---

### Issue 4: Search Too Strict

**Symptoms:**
- Searching for "Aspirin" returns results
- Searching for "asprin" (typo) returns nothing

**Cause:** Full-text search requires exact word matches.

**Current Behavior:**
- The search uses PostgreSQL full-text search
- Requires at least 2 characters
- Matches against: medicine name, manufacturer, composition

**Workaround:**
- Use correct spelling
- Try shorter search terms (e.g., "asp" instead of "aspirin")
- Try manufacturer names

---

### Issue 5: Local Data Fallback

**Symptoms:**
```
📦 Using local data for search
📦 Local search found 3 results
```

**Cause:** System detected Supabase is unavailable and switched to local mode.

**Local Data Includes:**
1. Aspirin 500mg
2. Paracetamol 650mg
3. Ibuprofen 400mg
4. Amoxicillin 500mg
5. Omeprazole 20mg
6. Metformin 500mg
7. Atorvastatin 10mg
8. Losartan 50mg

**Solution:**
- This is expected behavior when Supabase is unavailable
- To use full database, ensure Supabase is properly configured
- Local data is sufficient for testing the UI

---

## Testing the Search

### Test Case 1: Basic Search
1. Go to Medicine Interaction Checker
2. Type "asp" in the search box
3. Wait 300ms (debounce delay)
4. Should see loading spinner
5. Should see results or "No medicines found" message

### Test Case 2: Full Medicine Name
1. Type "aspirin"
2. Should see all Aspirin variants (different dosages, manufacturers)

### Test Case 3: Manufacturer Search
1. Type "cipla" or "sun pharma"
2. Should see medicines from that manufacturer

### Test Case 4: Composition Search
1. Type "paracetamol"
2. Should see medicines containing paracetamol

### Test Case 5: No Results
1. Type "xyzabc123"
2. Should see "No medicines found. Try a different search term."

---

## Understanding the Search Flow

```
User types in search box
         ↓
Wait 300ms (debounce)
         ↓
searchMedicines() called
         ↓
medicineApiService.searchMedicines()
         ↓
Check if useLocalData flag is set
         ↓
    ┌────┴────┐
    │         │
   YES       NO
    │         │
    │    searchSupabaseMedicines()
    │         ↓
    │    supabase.rpc('search_medicines')
    │         ↓
    │    ┌────┴────┐
    │    │         │
    │  SUCCESS   ERROR
    │    │         │
    │    │    Set useLocalData = true
    │    │         │
    └────┴─────────┘
         ↓
searchLocalMedicines()
         ↓
Return results to UI
         ↓
Display in dropdown
```

---

## Debug Checklist

Use this checklist to diagnose search issues:

- [ ] Browser console is open (F12)
- [ ] Typed at least 2 characters in search box
- [ ] Waited for debounce (300ms)
- [ ] Checked console for log messages
- [ ] Verified Supabase connection status
- [ ] Checked if RPC function exists
- [ ] Verified medicine_data table has data
- [ ] Tried different search terms
- [ ] Checked network tab for API calls
- [ ] Verified .env file has correct credentials

---

## Expected Console Output

### Successful Search (Supabase)
```
🔍 Searching for: aspirin
🔎 medicineApiService.searchMedicines called with: {query: "aspirin", limit: 20, useLocalData: false}
🌐 Calling Supabase searchSupabaseMedicines...
🔍 searchMedicines (Supabase RPC) called with: {query: "aspirin", limit: 20}
📡 Calling supabase.rpc("search_medicines")...
✅ Supabase RPC returned: 15 results
First result sample: {id: 12345, name: "Aspirin 500mg", manufacturer_name: "Bayer", ...}
✅ Supabase returned 15 results
✅ Search results: 15 medicines found
First result: {id: "12345", name: "Aspirin 500mg", manufacturer: "Bayer", ...}
```

### Successful Search (Local Fallback)
```
🔍 Searching for: aspirin
🔎 medicineApiService.searchMedicines called with: {query: "aspirin", limit: 20, useLocalData: false}
🌐 Calling Supabase searchSupabaseMedicines...
🔍 searchMedicines (Supabase RPC) called with: {query: "aspirin", limit: 20}
📡 Calling supabase.rpc("search_medicines")...
✅ Supabase RPC returned: 0 results
⚠️ No results from Supabase, trying local fallback
📦 Local search found 1 results
✅ Search results: 1 medicines found
First result: {id: "local-1", name: "Aspirin 500mg", manufacturer: "Generic Pharma", ...}
```

### Error with Fallback
```
🔍 Searching for: aspirin
🔎 medicineApiService.searchMedicines called with: {query: "aspirin", limit: 20, useLocalData: false}
🌐 Calling Supabase searchSupabaseMedicines...
🔍 searchMedicines (Supabase RPC) called with: {query: "aspirin", limit: 20}
📡 Calling supabase.rpc("search_medicines")...
❌ Supabase RPC error: {message: "connection error", ...}
❌ Error searching Supabase: Error: connection error
📦 Falling back to local search
✅ Search results: 1 medicines found
```

---

## How to Fix Common Errors

### Error: "function search_medicines does not exist"

**Fix:**
The RPC function needs to be created in Supabase. Check migration file:
`supabase/migrations/00009_fix_column_case_sensitivity.sql`

This file should contain:
```sql
CREATE OR REPLACE FUNCTION search_medicines(
  search_query TEXT DEFAULT NULL,
  medicine_type TEXT DEFAULT NULL,
  exclude_discontinued BOOLEAN DEFAULT true,
  page_num INTEGER DEFAULT 1,
  page_size INTEGER DEFAULT 20
)
RETURNS TABLE (...)
```

### Error: "column medicine_data.Is_discontinued does not exist"

**Fix:**
Column name case sensitivity issue. Migration `00009_fix_column_case_sensitivity.sql` should fix this:
```sql
ALTER TABLE medicine_data 
RENAME COLUMN "Is_discontinued" TO is_discontinued;
```

### Error: "relation medicine_data does not exist"

**Fix:**
Table not created. Check migration `00008_create_medicine_data_table.sql` was applied.

---

## Performance Notes

### Search Optimization
- **Debounce:** 300ms delay after typing stops
- **Limit:** Returns max 20 results
- **Caching:** Categories are cached after first load
- **Fallback:** Automatic switch to local data on errors

### Expected Response Times
- **Local Search:** < 10ms
- **Supabase Search:** 100-500ms (depending on network)
- **First Load:** May take longer due to cold start

---

## Still Having Issues?

If you've followed all steps and still can't get search results:

1. **Check the console output** and compare with expected output above
2. **Copy the error messages** from console
3. **Try these test searches:**
   - "asp" (should match Aspirin)
   - "para" (should match Paracetamol)
   - "ibu" (should match Ibuprofen)

4. **Verify the UI shows:**
   - Loading spinner while searching
   - "No medicines found" message if no results
   - "Type at least 2 characters" hint for short queries

5. **Check if local fallback works:**
   - Even if Supabase fails, you should see 8 local medicines
   - Try searching for "Aspirin" - should find at least 1 result from local data

---

## Summary

The medicine search has multiple layers of fallback:

1. **Primary:** Supabase database with 253,973 medicines
2. **Fallback:** Local data with 8 sample medicines
3. **UI Feedback:** Clear messages at every step

The search should ALWAYS return results (either from Supabase or local data) unless:
- Search term doesn't match anything in both databases
- There's a critical error in the code (which would show in console)

With the debugging logs added, you can now see exactly where the search is failing and which fallback is being used.
