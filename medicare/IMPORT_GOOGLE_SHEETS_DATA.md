# 📊 Import Google Sheets Data to Supabase

## Overview

This guide will help you import data from your Google Sheets into the `medicine_data` table in Supabase.

**Google Sheets URL**: https://docs.google.com/spreadsheets/d/1tTY-Yc2asdqIreWBBrWPgr8ijs-hja0fCpvya3R7F6s/edit?gid=431348946#gid=431348946

---

## 📋 Table Structure

Your `medicine_data` table has these columns:
- `id` (BIGSERIAL) - Auto-generated, don't include in import
- `name` (TEXT) - Medicine name
- `price` (NUMERIC) - Medicine price
- `Is_discontinued` (BOOLEAN) - Discontinued status
- `manufacturer_name` (TEXT) - Manufacturer
- `type` (TEXT) - Medicine type/category
- `pack_size_label` (TEXT) - Dosage/pack size
- `short_composition1` (TEXT) - Short description
- `salt_composition` (TEXT) - Chemical composition
- `side_effects` (TEXT) - Side effects
- `drug_interactions` (TEXT) - Drug interactions
- `created_at` (TIMESTAMPTZ) - Auto-generated
- `updated_at` (TIMESTAMPTZ) - Auto-generated

---

## 🚀 Method 1: Import via Supabase Dashboard (Recommended)

### Step 1: Export Google Sheets as CSV

1. **Open your Google Sheets**:
   - Go to: https://docs.google.com/spreadsheets/d/1tTY-Yc2asdqIreWBBrWPgr8ijs-hja0fCpvya3R7F6s/edit

2. **Select the correct sheet**:
   - Click on the sheet tab at the bottom (gid=431348946)

3. **Export as CSV**:
   - Click **File** → **Download** → **Comma Separated Values (.csv)**
   - Save the file as `medicine_data.csv`

### Step 2: Prepare CSV File

**Important**: Make sure your CSV has these column headers (in this exact order):

```csv
name,price,Is_discontinued,manufacturer_name,type,pack_size_label,short_composition1,salt_composition,side_effects,drug_interactions
```

**Example CSV format**:
```csv
name,price,Is_discontinued,manufacturer_name,type,pack_size_label,short_composition1,salt_composition,side_effects,drug_interactions
Aspirin,5.99,false,Bayer,Tablet,100mg,Pain reliever,Acetylsalicylic acid,Stomach upset,Blood thinners
Ibuprofen,7.50,false,Advil,Tablet,200mg,Anti-inflammatory,Ibuprofen,Nausea,Aspirin
```

**Notes**:
- Don't include `id`, `created_at`, or `updated_at` columns (auto-generated)
- Use `true` or `false` for `Is_discontinued` (not TRUE/FALSE or 1/0)
- Empty fields should be left blank (not NULL)
- Prices should be numbers without currency symbols

### Step 3: Import to Supabase

1. **Open Supabase Dashboard**:
   - Go to: https://supabase.com/dashboard
   - Select your project: `vbslaaisgoiwvkymaohu`

2. **Navigate to Table Editor**:
   - Click **Table Editor** in the left sidebar
   - Find and click on `medicine_data` table

3. **Import CSV**:
   - Click the **Import** button (top right)
   - Select your `medicine_data.csv` file
   - Map columns:
     - CSV Column → Database Column
     - name → name
     - price → price
     - Is_discontinued → Is_discontinued
     - manufacturer_name → manufacturer_name
     - type → type
     - pack_size_label → pack_size_label
     - short_composition1 → short_composition1
     - salt_composition → salt_composition
     - side_effects → side_effects
     - drug_interactions → drug_interactions

4. **Import Settings**:
   - ✅ First row is header
   - ✅ Skip duplicate rows
   - Click **Import**

5. **Wait for completion**:
   - Large files may take several minutes
   - You'll see a progress indicator

---

## 🔧 Method 2: Import via SQL (For Large Files)

If you have a very large CSV file (>10MB), use SQL import:

### Step 1: Export Google Sheets as CSV
(Same as Method 1, Step 1)

### Step 2: Upload CSV to Supabase Storage

1. **Create a bucket** (if not exists):
   - Go to **Storage** in Supabase Dashboard
   - Create a new bucket called `imports`
   - Make it **private**

2. **Upload CSV**:
   - Click on `imports` bucket
   - Click **Upload file**
   - Select your `medicine_data.csv`

### Step 3: Import via SQL

1. **Open SQL Editor**:
   - Go to **SQL Editor** in Supabase Dashboard

2. **Run this SQL**:

```sql
-- Create temporary table for import
CREATE TEMP TABLE temp_medicine_import (
  name TEXT,
  price NUMERIC,
  Is_discontinued BOOLEAN,
  manufacturer_name TEXT,
  type TEXT,
  pack_size_label TEXT,
  short_composition1 TEXT,
  salt_composition TEXT,
  side_effects TEXT,
  drug_interactions TEXT
);

-- Import CSV from Storage
-- Note: Replace 'YOUR_CSV_URL' with the actual URL from Storage
COPY temp_medicine_import (
  name,
  price,
  Is_discontinued,
  manufacturer_name,
  type,
  pack_size_label,
  short_composition1,
  salt_composition,
  side_effects,
  drug_interactions
)
FROM '/path/to/medicine_data.csv'
WITH (FORMAT csv, HEADER true, DELIMITER ',');

-- Insert into medicine_data table
INSERT INTO medicine_data (
  name,
  price,
  Is_discontinued,
  manufacturer_name,
  type,
  pack_size_label,
  short_composition1,
  salt_composition,
  side_effects,
  drug_interactions
)
SELECT 
  name,
  price,
  Is_discontinued,
  manufacturer_name,
  type,
  pack_size_label,
  short_composition1,
  salt_composition,
  side_effects,
  drug_interactions
FROM temp_medicine_import
ON CONFLICT (id) DO NOTHING;

-- Drop temporary table
DROP TABLE temp_medicine_import;

-- Update statistics for better query performance
ANALYZE medicine_data;
```

---

## 🐍 Method 3: Import via Python Script (Most Flexible)

For maximum control and data transformation, use a Python script:

### Step 1: Install Dependencies

```bash
pip install pandas supabase-py python-dotenv
```

### Step 2: Create Import Script

Create a file called `import_medicines.py`:

```python
import pandas as pd
from supabase import create_client, Client
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Supabase credentials
SUPABASE_URL = os.getenv('VITE_SUPABASE_URL')
SUPABASE_KEY = os.getenv('VITE_SUPABASE_ANON_KEY')

# Initialize Supabase client
supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)

# Google Sheets URL (export as CSV)
SHEET_URL = 'https://docs.google.com/spreadsheets/d/1tTY-Yc2asdqIreWBBrWPgr8ijs-hja0fCpvya3R7F6s/export?format=csv&gid=431348946'

def import_medicines():
    print("📥 Downloading data from Google Sheets...")
    
    # Read CSV from Google Sheets
    df = pd.read_csv(SHEET_URL)
    
    print(f"✅ Downloaded {len(df)} rows")
    print(f"📊 Columns: {list(df.columns)}")
    
    # Clean and prepare data
    print("🧹 Cleaning data...")
    
    # Convert column names to match database
    column_mapping = {
        # Map your Google Sheets column names to database columns
        # Example:
        # 'Medicine Name': 'name',
        # 'Price': 'price',
        # 'Discontinued': 'Is_discontinued',
        # Add your mappings here
    }
    
    if column_mapping:
        df = df.rename(columns=column_mapping)
    
    # Handle missing values
    df = df.fillna({
        'price': 0,
        'Is_discontinued': False,
        'manufacturer_name': 'Unknown',
        'type': 'General',
        'pack_size_label': '',
        'short_composition1': '',
        'salt_composition': '',
        'side_effects': '',
        'drug_interactions': ''
    })
    
    # Convert boolean values
    if 'Is_discontinued' in df.columns:
        df['Is_discontinued'] = df['Is_discontinued'].astype(bool)
    
    # Convert to list of dictionaries
    records = df.to_dict('records')
    
    # Import in batches (Supabase has a limit)
    batch_size = 1000
    total_imported = 0
    
    print(f"📤 Importing {len(records)} records in batches of {batch_size}...")
    
    for i in range(0, len(records), batch_size):
        batch = records[i:i + batch_size]
        
        try:
            response = supabase.table('medicine_data').insert(batch).execute()
            total_imported += len(batch)
            print(f"✅ Imported batch {i//batch_size + 1}: {total_imported}/{len(records)} records")
        except Exception as e:
            print(f"❌ Error importing batch {i//batch_size + 1}: {str(e)}")
            continue
    
    print(f"🎉 Import complete! Total imported: {total_imported} records")

if __name__ == '__main__':
    import_medicines()
```

### Step 3: Run the Script

```bash
python import_medicines.py
```

---

## 📝 Method 4: Direct Google Sheets API (Advanced)

For real-time sync, use Google Sheets API:

### Step 1: Enable Google Sheets API

1. Go to: https://console.cloud.google.com/
2. Create a new project or select existing
3. Enable **Google Sheets API**
4. Create credentials (Service Account)
5. Download JSON key file

### Step 2: Share Sheet with Service Account

1. Open your Google Sheet
2. Click **Share**
3. Add service account email (from JSON key)
4. Give **Viewer** permission

### Step 3: Create Import Script

```python
import gspread
from oauth2client.service_account import ServiceAccountCredentials
from supabase import create_client
import os

# Google Sheets setup
scope = ['https://spreadsheets.google.com/feeds',
         'https://www.googleapis.com/auth/drive']
creds = ServiceAccountCredentials.from_json_keyfile_name('credentials.json', scope)
client = gspread.authorize(creds)

# Open the sheet
sheet = client.open_by_url('https://docs.google.com/spreadsheets/d/1tTY-Yc2asdqIreWBBrWPgr8ijs-hja0fCpvya3R7F6s')
worksheet = sheet.get_worksheet(0)  # First sheet

# Get all records
records = worksheet.get_all_records()

# Supabase setup
supabase = create_client(
    os.getenv('VITE_SUPABASE_URL'),
    os.getenv('VITE_SUPABASE_ANON_KEY')
)

# Import to Supabase
for record in records:
    supabase.table('medicine_data').insert(record).execute()

print(f"✅ Imported {len(records)} records")
```

---

## ✅ Verification

After import, verify the data:

### Check Record Count

```sql
SELECT COUNT(*) FROM medicine_data;
```

### Check Sample Data

```sql
SELECT * FROM medicine_data LIMIT 10;
```

### Check for Duplicates

```sql
SELECT name, COUNT(*) as count
FROM medicine_data
GROUP BY name
HAVING COUNT(*) > 1;
```

### Check for Missing Data

```sql
SELECT 
  COUNT(*) as total,
  COUNT(name) as has_name,
  COUNT(price) as has_price,
  COUNT(manufacturer_name) as has_manufacturer,
  COUNT(type) as has_type
FROM medicine_data;
```

### Update Search Vectors

After import, update search vectors for full-text search:

```sql
-- Update all search vectors
UPDATE medicine_data
SET search_vector = 
  setweight(to_tsvector('english', COALESCE(name, '')), 'A') ||
  setweight(to_tsvector('english', COALESCE(manufacturer_name, '')), 'B') ||
  setweight(to_tsvector('english', COALESCE(short_composition1, '')), 'C') ||
  setweight(to_tsvector('english', COALESCE(salt_composition, '')), 'D');

-- Update statistics
ANALYZE medicine_data;
```

---

## 🔧 Troubleshooting

### Issue: CSV Import Fails

**Solution**:
1. Check CSV format (UTF-8 encoding)
2. Remove special characters
3. Ensure boolean values are `true`/`false`
4. Check for empty required fields

### Issue: Duplicate Records

**Solution**:
```sql
-- Remove duplicates, keep first occurrence
DELETE FROM medicine_data a
USING medicine_data b
WHERE a.id > b.id
AND a.name = b.name;
```

### Issue: Slow Import

**Solution**:
1. Import in smaller batches (500-1000 records)
2. Disable triggers temporarily
3. Drop indexes before import, recreate after

```sql
-- Drop indexes
DROP INDEX IF EXISTS medicine_name_trgm_idx;
DROP INDEX IF EXISTS medicine_search_idx;

-- Import data here

-- Recreate indexes
CREATE INDEX medicine_name_trgm_idx ON medicine_data USING gin(name gin_trgm_ops);
CREATE INDEX medicine_search_idx ON medicine_data USING gin(search_vector);
```

### Issue: Column Mismatch

**Solution**:
Map Google Sheets columns to database columns:

| Google Sheets | Database Column |
|---------------|-----------------|
| Medicine Name | name |
| Price | price |
| Discontinued | Is_discontinued |
| Manufacturer | manufacturer_name |
| Type | type |
| Pack Size | pack_size_label |
| Composition | short_composition1 |
| Salt | salt_composition |
| Side Effects | side_effects |
| Interactions | drug_interactions |

---

## 📊 Post-Import Optimization

After importing all data:

### 1. Update Statistics

```sql
ANALYZE medicine_data;
```

### 2. Vacuum Table

```sql
VACUUM ANALYZE medicine_data;
```

### 3. Reindex

```sql
REINDEX TABLE medicine_data;
```

### 4. Check Performance

```sql
EXPLAIN ANALYZE
SELECT * FROM search_medicines(
  search_query := 'aspirin',
  medicine_type := NULL,
  exclude_discontinued := true,
  page_num := 1,
  page_size := 20
);
```

---

## 🎉 Summary

**Recommended Method**: Method 1 (Supabase Dashboard) for files < 10MB

**Steps**:
1. ✅ Export Google Sheets as CSV
2. ✅ Prepare CSV with correct column headers
3. ✅ Import via Supabase Dashboard
4. ✅ Verify data
5. ✅ Update search vectors
6. ✅ Run ANALYZE

**Your data will be ready to use in the application immediately!**

---

## 📞 Need Help?

If you encounter issues:
1. Check CSV format and encoding
2. Verify column names match database
3. Check for special characters
4. Try importing a small sample first (10-100 rows)
5. Check Supabase logs for error messages

**Your application is ready to display the imported data!** 🚀
