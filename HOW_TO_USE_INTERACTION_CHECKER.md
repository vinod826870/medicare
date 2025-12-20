# How to Use the Medicine Interaction Checker

## Quick Start Guide

The Medicine Interaction Checker helps you find out if two or more medicines can be safely taken together.

---

## Step-by-Step Instructions

### Step 1: Navigate to the Page
1. Open your MediCare Online Pharmacy website
2. Click on "Interaction Checker" in the navigation menu
3. You'll see the Medicine Interaction Checker page

### Step 2: Search for Your First Medicine
1. Look for the search box under "Add Medicines"
2. Type at least **2 characters** of the medicine name
   - Example: Type "asp" for Aspirin
   - Example: Type "para" for Paracetamol
   - Example: Type "ibu" for Ibuprofen

3. **Wait a moment** (300ms) - the search will start automatically
4. You'll see a **loading spinner** with "Searching medicines..."

### Step 3: Select from Results
1. A dropdown list will appear with matching medicines
2. Each medicine shows:
   - **Medicine Name** (e.g., "Aspirin 500mg")
   - **Manufacturer** (e.g., "Bayer Pharmaceuticals")
3. Click on the medicine you want to add
4. The medicine will be added to your selected list

### Step 4: Add More Medicines
1. The search box will clear automatically
2. Repeat Steps 2-3 to add another medicine
3. You need at least **2 medicines** to check for interactions

### Step 5: Check for Interactions
1. Once you've added 2 or more medicines, you'll see a "Check Interactions" button
2. Click the button
3. The system will analyze potential interactions

### Step 6: Review Results
The results will show:
- **No Interactions Found:** ✅ Safe to take together
- **Mild Interaction:** ⚠️ Minor interaction, usually safe
- **Moderate Interaction:** ⚠️ May require monitoring
- **Severe Interaction:** ❌ Should not be taken together

---

## Visual Guide

### What You'll See

#### 1. Empty Search Box
```
┌─────────────────────────────────────────┐
│ 🔍 Type at least 2 characters to       │
│    search...                            │
└─────────────────────────────────────────┘
```

#### 2. Typing (Less than 2 characters)
```
┌─────────────────────────────────────────┐
│ 🔍 a                                    │
└─────────────────────────────────────────┘
┌─────────────────────────────────────────┐
│ ℹ️ Type at least 2 characters to start  │
│   searching                             │
└─────────────────────────────────────────┘
```

#### 3. Searching (2+ characters)
```
┌─────────────────────────────────────────┐
│ 🔍 asp                                  │
└─────────────────────────────────────────┘
┌─────────────────────────────────────────┐
│ ⏳ Searching medicines...               │
└─────────────────────────────────────────┘
```

#### 4. Results Appear
```
┌─────────────────────────────────────────┐
│ 🔍 asp                                  │
└─────────────────────────────────────────┘
┌─────────────────────────────────────────┐
│ Aspirin 500mg                           │
│ Bayer Pharmaceuticals                   │
├─────────────────────────────────────────┤
│ Aspirin 100mg                           │
│ Generic Pharma                          │
├─────────────────────────────────────────┤
│ Aspirin 325mg                           │
│ Sun Pharma                              │
└─────────────────────────────────────────┘
```

#### 5. Medicine Added
```
Selected Medicines:
┌─────────────────────────────────────────┐
│ 💊 Aspirin 500mg                        │
│    Bayer Pharmaceuticals                │
│    [Remove] ❌                          │
└─────────────────────────────────────────┘
```

#### 6. Multiple Medicines Selected
```
Selected Medicines:
┌─────────────────────────────────────────┐
│ 💊 Aspirin 500mg                        │
│    Bayer Pharmaceuticals                │
│    [Remove] ❌                          │
├─────────────────────────────────────────┤
│ 💊 Ibuprofen 400mg                      │
│    Generic Pharma                       │
│    [Remove] ❌                          │
└─────────────────────────────────────────┘

[Check Interactions] 🔍
```

#### 7. Interaction Results

**No Interactions:**
```
┌─────────────────────────────────────────┐
│ ✅ No Interactions Found                │
│                                         │
│ These medicines appear to be safe to    │
│ take together. However, always consult  │
│ your doctor or pharmacist.              │
└─────────────────────────────────────────┘
```

**Severe Interaction:**
```
┌─────────────────────────────────────────┐
│ ❌ SEVERE INTERACTION                   │
│                                         │
│ Aspirin 500mg ↔️ Ibuprofen 400mg        │
│                                         │
│ Taking these medicines together may     │
│ increase the risk of stomach bleeding   │
│ and reduce effectiveness.               │
│                                         │
│ ⚠️ Consult your doctor immediately      │
└─────────────────────────────────────────┘
```

---

## Tips for Best Results

### 1. Use Common Names
- ✅ "aspirin" instead of "acetylsalicylic acid"
- ✅ "paracetamol" instead of "acetaminophen"
- ✅ "ibuprofen" instead of "isobutylphenyl propionic acid"

### 2. Try Partial Names
- ✅ "asp" will find Aspirin
- ✅ "para" will find Paracetamol
- ✅ "met" will find Metformin

### 3. Search by Manufacturer
- ✅ "cipla" will show all Cipla medicines
- ✅ "sun pharma" will show all Sun Pharma medicines

### 4. Be Patient
- Wait for the search to complete (you'll see the loading spinner)
- Results appear after 300ms of no typing
- If no results appear, try a different search term

---

## Troubleshooting

### Problem: "No medicines found"

**Possible Causes:**
1. Typed less than 2 characters
2. Misspelled the medicine name
3. Medicine not in database
4. Database connection issue

**Solutions:**
1. ✅ Type at least 2 characters
2. ✅ Check spelling
3. ✅ Try a different medicine name
4. ✅ Try common medicines: "aspirin", "paracetamol", "ibuprofen"
5. ✅ Open browser console (F12) to see detailed logs

### Problem: Search not working at all

**Solutions:**
1. ✅ Refresh the page (F5)
2. ✅ Clear browser cache (Ctrl+Shift+Delete)
3. ✅ Check browser console for errors (F12)
4. ✅ Try a different browser

### Problem: Can't add medicine

**Possible Causes:**
1. Medicine already added
2. Clicked outside the dropdown

**Solutions:**
1. ✅ Check if medicine is already in your selected list
2. ✅ Click directly on the medicine name in the dropdown

---

## Example Searches

### Example 1: Check Aspirin + Ibuprofen
```
Step 1: Type "asp" → Select "Aspirin 500mg"
Step 2: Type "ibu" → Select "Ibuprofen 400mg"
Step 3: Click "Check Interactions"
Result: ⚠️ Moderate to Severe interaction warning
```

### Example 2: Check Paracetamol + Ibuprofen
```
Step 1: Type "para" → Select "Paracetamol 650mg"
Step 2: Type "ibu" → Select "Ibuprofen 400mg"
Step 3: Click "Check Interactions"
Result: ✅ Generally safe to take together
```

### Example 3: Check Multiple Medicines
```
Step 1: Type "asp" → Select "Aspirin 500mg"
Step 2: Type "met" → Select "Metformin 500mg"
Step 3: Type "ator" → Select "Atorvastatin 10mg"
Step 4: Click "Check Interactions"
Result: Shows all pairwise interactions
```

---

## Important Notes

### ⚠️ Medical Disclaimer
- This tool provides **general information** only
- **Always consult** your doctor or pharmacist before taking multiple medications
- This is **not a substitute** for professional medical advice
- Some interactions may not be listed in the database

### 🔒 Privacy
- Your searches are **not stored**
- No personal information is collected
- All searches are anonymous

### 📊 Database
- Contains information on **253,973+ medicines**
- Regularly updated with new medicines
- Includes prescription and OTC medicines
- Covers major manufacturers and brands

---

## Keyboard Shortcuts

- **Tab:** Move to next field
- **Enter:** Select highlighted medicine
- **Escape:** Close dropdown
- **Arrow Up/Down:** Navigate results (coming soon)

---

## Need Help?

If you're still having trouble:

1. **Check the console:** Press F12 and look for error messages
2. **Read the troubleshooting guide:** See `MEDICINE_SEARCH_TROUBLESHOOTING.md`
3. **Try the examples above:** Use the exact search terms provided
4. **Test with common medicines:** Aspirin, Paracetamol, Ibuprofen

---

## Summary

**Quick Steps:**
1. Type 2+ characters
2. Wait for results
3. Click to add medicine
4. Repeat for more medicines
5. Click "Check Interactions"
6. Review results

**Remember:**
- ✅ Minimum 2 characters to search
- ✅ Wait for loading to complete
- ✅ Need at least 2 medicines to check
- ✅ Always consult your doctor

Happy searching! 💊🔍
