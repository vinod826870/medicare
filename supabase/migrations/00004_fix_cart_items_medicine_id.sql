/*
# Fix Cart Items and Order Items Medicine ID

## Problem
The cart_items and order_items tables have foreign key constraints to the medicines table,
but the medicines table was removed in migration 00002.
This causes cart operations and order operations to fail.

## Solution
1. Drop the foreign key constraint on medicine_id
2. Change medicine_id from uuid to text to store external API medicine IDs
3. Recreate both tables with the correct structure

## Changes
- Drop cart_items table
- Drop order_items table
- Recreate cart_items table with medicine_id as text (no foreign key)
- Recreate order_items table with medicine_id as text (no foreign key)
- Restore RLS policies
- Restore indexes
*/

-- Drop existing cart_items table (this will cascade delete all cart items)
DROP TABLE IF EXISTS cart_items CASCADE;

-- Drop existing order_items table (this will cascade delete all order items)
DROP TABLE IF EXISTS order_items CASCADE;

-- Recreate cart_items table with medicine_id as text
CREATE TABLE cart_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  medicine_id text NOT NULL,
  quantity integer NOT NULL CHECK (quantity > 0),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(user_id, medicine_id)
);

-- Recreate order_items table with medicine_id as text
CREATE TABLE order_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id uuid REFERENCES orders(id) ON DELETE CASCADE NOT NULL,
  medicine_id text NOT NULL,
  medicine_name text NOT NULL,
  quantity integer NOT NULL CHECK (quantity > 0),
  price_at_purchase numeric(10,2) NOT NULL CHECK (price_at_purchase >= 0),
  created_at timestamptz DEFAULT now()
);

-- Recreate indexes
CREATE INDEX idx_cart_items_user ON cart_items(user_id);
CREATE INDEX idx_order_items_order ON order_items(order_id);

-- Enable RLS
ALTER TABLE cart_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;

-- Recreate RLS policies for cart_items
CREATE POLICY "Users can view own cart items"
  ON cart_items FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own cart items"
  ON cart_items FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own cart items"
  ON cart_items FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own cart items"
  ON cart_items FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Admins have full access to cart items"
  ON cart_items FOR ALL
  TO authenticated
  USING (is_admin(auth.uid()));

-- Recreate RLS policies for order_items
CREATE POLICY "Users can view own order items"
  ON order_items FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM orders
      WHERE orders.id = order_items.order_id
      AND orders.user_id = auth.uid()
    )
  );

CREATE POLICY "Admins have full access to order items"
  ON order_items FOR ALL
  TO authenticated
  USING (is_admin(auth.uid()));
