/*
# Create medicine_data table

## Purpose
Create a table to store 253,973 medicine records with comprehensive information including pricing, composition, side effects, and drug interactions.

## Tables Created

### medicine_data
- `id` (bigint, primary key, auto-increment) - Unique identifier for each medicine
- `name` (text, not null, indexed) - Medicine name (searchable)
- `price` (numeric) - Medicine price
- `Is_discontinued` (boolean, default false) - Discontinued status
- `manufacturer_name` (text, indexed) - Manufacturer name
- `type` (text, indexed) - Medicine type/category for filtering
- `pack_size_label` (text) - Dosage/pack size information
- `short_composition1` (text) - Short description of composition
- `salt_composition` (text) - Chemical/salt composition
- `side_effects` (text) - Side effects information
- `drug_interactions` (text) - Drug interaction warnings
- `created_at` (timestamptz, default now()) - Record creation timestamp
- `updated_at` (timestamptz, default now()) - Record update timestamp

## Indexes for Performance
1. **name_idx** - B-tree index on name for fast exact searches
2. **name_trgm_idx** - GIN index with pg_trgm for fuzzy/partial text search
3. **type_idx** - B-tree index on type for category filtering
4. **manufacturer_idx** - B-tree index on manufacturer_name
5. **discontinued_idx** - B-tree index on Is_discontinued for filtering
6. **composite_search_idx** - Composite index on (type, Is_discontinued, name) for combined filters

## Full-Text Search
- **medicine_search_vector** - tsvector column for full-text search
- **medicine_search_idx** - GIN index on search vector
- Automatic trigger to update search vector on insert/update

## Security
- RLS (Row Level Security) is NOT enabled - public read access for all users
- All users can read medicine data
- Only authenticated users can insert/update/delete (for admin functionality)

## Performance Optimizations
- pg_trgm extension for fuzzy text search
- Full-text search with tsvector
- Multiple indexes for different query patterns
- Automatic statistics updates
*/

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS pg_trgm;

-- Create medicine_data table
CREATE TABLE IF NOT EXISTS medicine_data (
  id BIGSERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  price NUMERIC(10, 2),
  Is_discontinued BOOLEAN DEFAULT false,
  manufacturer_name TEXT,
  type TEXT,
  pack_size_label TEXT,
  short_composition1 TEXT,
  salt_composition TEXT,
  side_effects TEXT,
  drug_interactions TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Add full-text search column
ALTER TABLE medicine_data ADD COLUMN IF NOT EXISTS search_vector tsvector;

-- Create indexes for fast searching and filtering

-- 1. B-tree index on name for exact matches
CREATE INDEX IF NOT EXISTS medicine_name_idx ON medicine_data(name);

-- 2. GIN index with pg_trgm for fuzzy/partial text search (FAST!)
CREATE INDEX IF NOT EXISTS medicine_name_trgm_idx ON medicine_data USING gin(name gin_trgm_ops);

-- 3. Index on type for category filtering
CREATE INDEX IF NOT EXISTS medicine_type_idx ON medicine_data(type);

-- 4. Index on manufacturer
CREATE INDEX IF NOT EXISTS medicine_manufacturer_idx ON medicine_data(manufacturer_name);

-- 5. Index on discontinued status
CREATE INDEX IF NOT EXISTS medicine_discontinued_idx ON medicine_data(Is_discontinued);

-- 6. Composite index for common query patterns (type + discontinued + name)
CREATE INDEX IF NOT EXISTS medicine_composite_search_idx ON medicine_data(type, Is_discontinued, name);

-- 7. GIN index for full-text search
CREATE INDEX IF NOT EXISTS medicine_search_idx ON medicine_data USING gin(search_vector);

-- 8. Index on price for sorting
CREATE INDEX IF NOT EXISTS medicine_price_idx ON medicine_data(price);

-- Function to update search vector
CREATE OR REPLACE FUNCTION medicine_search_vector_update()
RETURNS TRIGGER AS $$
BEGIN
  NEW.search_vector := 
    setweight(to_tsvector('english', COALESCE(NEW.name, '')), 'A') ||
    setweight(to_tsvector('english', COALESCE(NEW.manufacturer_name, '')), 'B') ||
    setweight(to_tsvector('english', COALESCE(NEW.short_composition1, '')), 'C') ||
    setweight(to_tsvector('english', COALESCE(NEW.salt_composition, '')), 'D');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to automatically update search vector
DROP TRIGGER IF EXISTS medicine_search_vector_trigger ON medicine_data;
CREATE TRIGGER medicine_search_vector_trigger
  BEFORE INSERT OR UPDATE ON medicine_data
  FOR EACH ROW
  EXECUTE FUNCTION medicine_search_vector_update();

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_medicine_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to automatically update updated_at
DROP TRIGGER IF EXISTS medicine_updated_at_trigger ON medicine_data;
CREATE TRIGGER medicine_updated_at_trigger
  BEFORE UPDATE ON medicine_data
  FOR EACH ROW
  EXECUTE FUNCTION update_medicine_updated_at();

-- Create optimized search function
CREATE OR REPLACE FUNCTION search_medicines(
  search_query TEXT DEFAULT '',
  medicine_type TEXT DEFAULT NULL,
  exclude_discontinued BOOLEAN DEFAULT true,
  page_num INTEGER DEFAULT 1,
  page_size INTEGER DEFAULT 20
)
RETURNS TABLE (
  id BIGINT,
  name TEXT,
  price NUMERIC,
  Is_discontinued BOOLEAN,
  manufacturer_name TEXT,
  type TEXT,
  pack_size_label TEXT,
  short_composition1 TEXT,
  salt_composition TEXT,
  side_effects TEXT,
  drug_interactions TEXT,
  relevance REAL
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    m.id,
    m.name,
    m.price,
    m.Is_discontinued,
    m.manufacturer_name,
    m.type,
    m.pack_size_label,
    m.short_composition1,
    m.salt_composition,
    m.side_effects,
    m.drug_interactions,
    CASE 
      WHEN search_query = '' THEN 0
      ELSE ts_rank(m.search_vector, plainto_tsquery('english', search_query))
    END AS relevance
  FROM medicine_data m
  WHERE 
    (search_query = '' OR m.search_vector @@ plainto_tsquery('english', search_query) OR m.name ILIKE '%' || search_query || '%')
    AND (medicine_type IS NULL OR m.type = medicine_type)
    AND (NOT exclude_discontinued OR m.Is_discontinued = false OR m.Is_discontinued IS NULL)
  ORDER BY 
    CASE WHEN search_query = '' THEN 0 ELSE ts_rank(m.search_vector, plainto_tsquery('english', search_query)) END DESC,
    m.name ASC
  LIMIT page_size
  OFFSET (page_num - 1) * page_size;
END;
$$ LANGUAGE plpgsql STABLE;

-- Create function to get medicine count
CREATE OR REPLACE FUNCTION count_medicines(
  search_query TEXT DEFAULT '',
  medicine_type TEXT DEFAULT NULL,
  exclude_discontinued BOOLEAN DEFAULT true
)
RETURNS BIGINT AS $$
DECLARE
  total_count BIGINT;
BEGIN
  SELECT COUNT(*)
  INTO total_count
  FROM medicine_data m
  WHERE 
    (search_query = '' OR m.search_vector @@ plainto_tsquery('english', search_query) OR m.name ILIKE '%' || search_query || '%')
    AND (medicine_type IS NULL OR m.type = medicine_type)
    AND (NOT exclude_discontinued OR m.Is_discontinued = false OR m.Is_discontinued IS NULL);
  
  RETURN total_count;
END;
$$ LANGUAGE plpgsql STABLE;

-- Create function to get unique medicine types
CREATE OR REPLACE FUNCTION get_medicine_types()
RETURNS TABLE (type TEXT, count BIGINT) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    m.type,
    COUNT(*) as count
  FROM medicine_data m
  WHERE m.type IS NOT NULL
  GROUP BY m.type
  ORDER BY count DESC, m.type ASC;
END;
$$ LANGUAGE plpgsql STABLE;

-- Grant permissions
GRANT SELECT ON medicine_data TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON medicine_data TO authenticated;
GRANT USAGE ON SEQUENCE medicine_data_id_seq TO authenticated;

-- Analyze table for query optimization
ANALYZE medicine_data;

-- Add helpful comments
COMMENT ON TABLE medicine_data IS 'Stores 253,973 medicine records with comprehensive information';
COMMENT ON COLUMN medicine_data.name IS 'Medicine name - indexed for fast search';
COMMENT ON COLUMN medicine_data.type IS 'Medicine category/type - used for filtering';
COMMENT ON COLUMN medicine_data.search_vector IS 'Full-text search vector - automatically updated';
COMMENT ON INDEX medicine_name_trgm_idx IS 'Trigram index for fuzzy text search - enables fast partial matching';
COMMENT ON FUNCTION search_medicines IS 'Optimized search function with pagination and filtering';
