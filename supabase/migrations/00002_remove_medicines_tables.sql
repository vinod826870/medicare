/*
# Remove Medicines and Categories Tables

Since medicine data is now fetched from external APIs (like PharmEasy),
we no longer need to store medicines and categories in the database.

The cart_items and orders tables will store medicine_id as text (API medicine IDs)
instead of foreign key references.

## Changes
1. Drop medicines table
2. Drop categories table
3. Keep cart_items and orders tables (they already use text for medicine_id)
*/

-- Drop tables if they exist
DROP TABLE IF EXISTS medicines CASCADE;
DROP TABLE IF EXISTS categories CASCADE;
