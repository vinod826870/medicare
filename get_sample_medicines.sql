SELECT name, manufacturer_name, type 
FROM medicine_data 
WHERE price IS NOT NULL 
  AND (is_discontinued IS NULL OR is_discontinued = false)
ORDER BY id 
LIMIT 20;
