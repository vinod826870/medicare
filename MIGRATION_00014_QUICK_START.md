# Migration 00014 Quick Start Guide

## What is Migration 00014?

Migration 00014 is a **sample data migration** that creates medicine interactions and substitutes using **ANY available medicines** in your database. Unlike migration 00013 which searches for specific medicine names, this migration works with whatever medicines you have.

---

## When to Use Migration 00014

### ✅ Perfect For:
- **Testing the feature** - You want to see how interactions and substitutes work
- **Limited medicine data** - You have less than 100 medicines in your database
- **Quick setup** - You want sample data without importing the full medicine dataset
- **Development** - You're developing and need sample data quickly

### ❌ Not Ideal For:
- **Production with full dataset** - Use migration 00013 instead for realistic data
- **Specific medicine interactions** - This creates generic sample data
- **Medical accuracy** - The interactions are samples, not based on real medicine names

---

## How It Works

### Medicine Selection
```sql
-- Gets first 20 medicines from your database
SELECT ARRAY_AGG(id ORDER BY id) INTO medicines 
FROM (SELECT id FROM medicine_data LIMIT 20) sub;
```

### Interaction Creation
- **Creates 8 sample interactions** using pairs of medicines
- **Severity levels:** 2 severe, 3 moderate, 3 mild
- **Guaranteed data:** Works with any medicines, no name matching required

### Substitute Creation
- **Creates 6 sample substitutes** by pairing medicines
- **Price-aware:** Calculates price differences automatically
- **Varied reasons:** Different substitute types (generic, bioequivalent, etc.)

---

## What Gets Created

### 8 Sample Interactions

| Pair | Severity | Description |
|------|----------|-------------|
| Medicine 1 + 2 | Severe | Increased risk of bleeding |
| Medicine 3 + 4 | Moderate | May reduce effectiveness |
| Medicine 5 + 6 | Mild | Both cause drowsiness |
| Medicine 7 + 8 | Moderate | Can affect absorption |
| Medicine 9 + 10 | Severe | May cause liver damage |
| Medicine 11 + 12 | Mild | May reduce nutrient absorption |
| Medicine 13 + 14 | Moderate | May increase blood levels |
| Medicine 15 + 16 | Mild | May cause stomach upset |

### 6 Sample Substitutes

| Pair | Reason Type |
|------|-------------|
| Medicine 1 → 2 | Generic equivalent |
| Medicine 3 → 4 | Cost-effective alternative |
| Medicine 5 → 6 | Generic with proven efficacy |
| Medicine 7 → 8 | Bioequivalent medication |
| Medicine 9 → 10 | Similar mechanism of action |
| Medicine 11 → 12 | Budget-friendly alternative |

---

## Quick Start (3 Steps)

### Step 1: Check Prerequisites
```sql
-- Make sure you have at least 2 medicines
SELECT COUNT(*) FROM medicine_data;
-- Should return at least 2 (ideally 20+ for all samples)
```

### Step 2: Run the Migration
1. Open Supabase SQL Editor
2. Copy entire content of `supabase/migrations/00014_populate_sample_interactions_substitutes.sql`
3. Paste and click **Run**

### Step 3: Verify
```sql
-- Check interactions created
SELECT COUNT(*) FROM medicine_interactions;

-- Check substitutes created
SELECT COUNT(*) FROM medicine_substitutes;
```

---

## Expected Results

### If You Have 20+ Medicines:
- ✅ 8 interactions created
- ✅ 6 substitutes created
- ✅ All features fully testable

### If You Have 10-19 Medicines:
- ⚠️ 4-7 interactions created
- ⚠️ 3-5 substitutes created
- ⚠️ Some features testable

### If You Have 2-9 Medicines:
- ⚠️ 1-3 interactions created
- ⚠️ 1-2 substitutes created
- ⚠️ Limited testing possible

### If You Have 0-1 Medicines:
- ❌ No data created
- ❌ Need to add medicines first

---

## Advantages of Migration 00014

### 1. **Guaranteed Data**
- Works with ANY medicines
- No dependency on specific medicine names
- Always creates data if you have at least 2 medicines

### 2. **Fast Setup**
- No need to import 253,973 medicines
- Perfect for development and testing
- Quick to run (1-2 seconds)

### 3. **Flexible**
- Adapts to your medicine count
- Creates as many samples as possible
- Safe to run multiple times

### 4. **Complete Features**
- All interaction severities (severe, moderate, mild)
- All substitute types (generic, bioequivalent, etc.)
- Full recommendation text for each interaction

---

## Disadvantages of Migration 00014

### 1. **Not Realistic**
- Interactions are between random medicines
- May pair unrelated medicine types
- Not suitable for production medical advice

### 2. **Generic Descriptions**
- Descriptions are generic samples
- Not based on actual medicine properties
- Should be replaced with real data for production

### 3. **Limited Medical Value**
- Good for testing UI/UX
- Not suitable for real medical guidance
- Users should not rely on this data

---

## Migration 00013 vs 00014 Comparison

| Feature | Migration 00013 | Migration 00014 |
|---------|----------------|----------------|
| **Approach** | Name-based search | First 20 medicines |
| **Best For** | Production | Testing |
| **Medicine Count** | 253,973 recommended | 2+ minimum |
| **Realism** | High | Low |
| **Guaranteed Data** | No (depends on names) | Yes (if 2+ medicines) |
| **Setup Time** | Requires full import | Instant |
| **Medical Accuracy** | High | Low |
| **Use Case** | Real application | Development/Testing |

---

## After Running Migration 00014

### Test the Features

**1. Medicine Interaction Checker:**
```
http://your-app-url/interaction-checker
```
- Select any 2 medicines from your database
- Click "Check Interactions"
- Should see sample interaction if they're paired

**2. Medicine Substitutes Finder:**
```
http://your-app-url/substitutes
```
- Search for any medicine
- Should see substitute suggestions if available

**3. Admin Panels:**
```
http://your-app-url/admin/interactions
http://your-app-url/admin/substitutes
```
- View all created interactions and substitutes
- Edit or delete sample data
- Add real data to replace samples

---

## Replacing Sample Data

Once you're ready for production:

### Option 1: Clear and Use Migration 00013
```sql
-- Clear sample data
DELETE FROM medicine_interactions;
DELETE FROM medicine_substitutes;

-- Import full medicine dataset (253,973 medicines)
-- Then run migration 00013 for realistic data
```

### Option 2: Manually Replace via Admin Panel
```
1. Go to Admin → Interactions
2. Delete sample interactions
3. Add real interactions based on medical research

4. Go to Admin → Substitutes
5. Delete sample substitutes
6. Add real substitutes based on medical equivalence
```

---

## Troubleshooting

### No Data Created

**Problem:** Migration runs but no interactions/substitutes created

**Solution:**
```sql
-- Check medicine count
SELECT COUNT(*) FROM medicine_data;

-- If count is 0 or 1, add more medicines first
-- You need at least 2 medicines for interactions
-- You need at least 20 medicines for all samples
```

---

### Error: "recommendation violates not-null constraint"

**Problem:** Using old version of migration file

**Solution:**
1. Make sure you're using the **fixed version** from the repository
2. The file should include `recommendation` in all INSERT statements
3. Re-copy the entire file and run again

---

### Error: "column notes does not exist"

**Problem:** Using old version of migration file

**Solution:**
1. Make sure you're using the **fixed version** from the repository
2. The file should NOT include `notes` in any INSERT statements
3. Re-copy the entire file and run again

---

## Best Practices

### For Development:
1. ✅ Use migration 00014 for quick setup
2. ✅ Test all features with sample data
3. ✅ Verify UI/UX works correctly
4. ✅ Check error handling

### For Production:
1. ✅ Import full medicine dataset
2. ✅ Use migration 00013 for realistic data
3. ✅ Verify medical accuracy
4. ✅ Add disclaimer about medical advice

### For Testing:
1. ✅ Use migration 00014 with minimal medicines
2. ✅ Test edge cases (0 interactions, 1 interaction, etc.)
3. ✅ Verify empty state handling
4. ✅ Test search and filter functionality

---

## Summary

**Migration 00014 is perfect for:**
- 🚀 Quick development setup
- 🧪 Testing features
- 📊 Demo purposes
- 🎓 Learning the system

**Migration 00014 is NOT for:**
- 🏥 Production medical applications
- 📚 Real medical advice
- 🔬 Clinical accuracy
- 👨‍⚕️ Healthcare professionals

**Key Takeaway:** Use migration 00014 to get started quickly, then replace with migration 00013 and real data for production use.

---

## Related Documentation

- **MIGRATION_00013_FIX.md** - Detailed explanation of both migrations
- **HOW_TO_RUN_MIGRATION_00013.md** - Step-by-step guide for both migrations
- **MEDICINE_SEARCH_TROUBLESHOOTING.md** - Search feature troubleshooting

---

## Need Help?

### Common Questions

**Q: Can I edit the sample data?**
A: Yes! Use the Admin Panel to edit or delete any sample data.

**Q: Will this affect my real medicine data?**
A: No! This only creates interactions and substitutes, not medicines.

**Q: Can I run this multiple times?**
A: Yes! It uses `ON CONFLICT DO NOTHING` to prevent duplicates.

**Q: How do I delete all sample data?**
A: Run:
```sql
DELETE FROM medicine_interactions;
DELETE FROM medicine_substitutes;
```

**Q: Should I use this in production?**
A: No! Use migration 00013 with full medicine dataset for production.

---

**Ready to start?** Just copy the migration file and run it in Supabase SQL Editor. You'll have sample data in seconds! 🚀
