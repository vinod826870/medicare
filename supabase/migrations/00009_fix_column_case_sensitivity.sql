/*
# Fix Column Case Sensitivity

## Purpose
Rename `Is_discontinued` to `is_discontinued` (lowercase) to match PostgreSQL conventions and fix query errors.

## Changes
1. Rename column from `Is_discontinued` to `is_discontinued`
2. Update all indexes that reference this column
3. Update RPC functions to use lowercase column name

## Notes
- PostgreSQL converts unquoted identifiers to lowercase
- This fixes the "column medicine_data.Is_discontinued does not exist" error
*/

-- Rename the column to lowercase
ALTER TABLE medicine_data 
RENAME COLUMN "Is_discontinued" TO is_discontinued;

-- Drop and recreate the index with correct column name
DROP INDEX IF EXISTS medicine_discontinued_idx;
CREATE INDEX medicine_discontinued_idx ON medicine_data(is_discontinued);

-- Drop and recreate composite index
DROP INDEX IF EXISTS medicine_composite_search_idx;
CREATE INDEX medicine_composite_search_idx ON medicine_data(type, is_discontinued, name);

-- Update the search_medicines RPC function
CREATE OR REPLACE FUNCTION search_medicines(
  search_query TEXT DEFAULT NULL,
  medicine_type TEXT DEFAULT NULL,
  exclude_discontinued BOOLEAN DEFAULT true,
  page_num INTEGER DEFAULT 1,
  page_size INTEGER DEFAULT 20
)
RETURNS TABLE (
  id BIGINT,
  name TEXT,
  price NUMERIC,
  is_discontinued BOOLEAN,
  manufacturer_name TEXT,
  type TEXT,
  pack_size_label TEXT,
  short_composition1 TEXT,
  salt_composition TEXT,
  side_effects TEXT,
  drug_interactions TEXT,
  relevance REAL
) 
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    m.id,
    m.name,
    m.price,
    m.is_discontinued,
    m.manufacturer_name,
    m.type,
    m.pack_size_label,
    m.short_composition1,
    m.salt_composition,
    m.side_effects,
    m.drug_interactions,
    CASE 
      WHEN search_query IS NULL OR search_query = '' THEN 1.0
      ELSE ts_rank(m.search_vector, plainto_tsquery('english', search_query))
    END::REAL as relevance
  FROM medicine_data m
  WHERE 
    (search_query IS NULL OR search_query = '' OR m.search_vector @@ plainto_tsquery('english', search_query))
    AND (medicine_type IS NULL OR m.type = medicine_type)
    AND (NOT exclude_discontinued OR m.is_discontinued = false OR m.is_discontinued IS NULL)
  ORDER BY 
    relevance DESC,
    m.id ASC
  LIMIT page_size
  OFFSET (page_num - 1) * page_size;
END;
$$;

-- Update the count_medicines RPC function
CREATE OR REPLACE FUNCTION count_medicines(
  search_query TEXT DEFAULT NULL,
  medicine_type TEXT DEFAULT NULL,
  exclude_discontinued BOOLEAN DEFAULT true
)
RETURNS BIGINT
LANGUAGE plpgsql
AS $$
DECLARE
  total_count BIGINT;
BEGIN
  SELECT COUNT(*)
  INTO total_count
  FROM medicine_data m
  WHERE 
    (search_query IS NULL OR search_query = '' OR m.search_vector @@ plainto_tsquery('english', search_query))
    AND (medicine_type IS NULL OR m.type = medicine_type)
    AND (NOT exclude_discontinued OR m.is_discontinued = false OR m.is_discontinued IS NULL);
  
  RETURN total_count;
END;
$$;