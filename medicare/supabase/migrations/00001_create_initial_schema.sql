/*
# MediCare Online Pharmacy - Initial Database Schema

## Overview
This migration creates the complete database structure for the MediCare Online Pharmacy platform,
including user profiles, medicine catalog, shopping cart, and order management.

## Tables Created

### 1. profiles
User profile information with role-based access control.
- `id` (uuid, primary key, references auth.users)
- `email` (text, unique)
- `full_name` (text)
- `phone` (text)
- `address` (text)
- `role` (user_role enum: 'user', 'admin')
- `created_at` (timestamptz)
- `updated_at` (timestamptz)

### 2. categories
Medicine categories for organization and filtering.
- `id` (uuid, primary key)
- `name` (text, unique, not null)
- `description` (text)
- `created_at` (timestamptz)

### 3. medicines
Complete medicine catalog with stock tracking.
- `id` (uuid, primary key)
- `name` (text, not null)
- `description` (text)
- `category_id` (uuid, references categories)
- `price` (numeric, not null)
- `stock_quantity` (integer, not null, default 0)
- `image_url` (text)
- `prescription_required` (boolean, default false)
- `manufacturer` (text)
- `dosage` (text)
- `created_at` (timestamptz)
- `updated_at` (timestamptz)

### 4. cart_items
Shopping cart items for logged-in users.
- `id` (uuid, primary key)
- `user_id` (uuid, references profiles)
- `medicine_id` (uuid, references medicines)
- `quantity` (integer, not null)
- `created_at` (timestamptz)
- `updated_at` (timestamptz)

### 5. orders
Order records with payment tracking.
- `id` (uuid, primary key)
- `user_id` (uuid, references profiles)
- `items` (jsonb, not null)
- `total_amount` (numeric, not null)
- `currency` (text, default 'usd')
- `status` (order_status enum: 'pending', 'completed', 'cancelled', 'refunded')
- `stripe_session_id` (text, unique)
- `stripe_payment_intent_id` (text)
- `customer_email` (text)
- `customer_name` (text)
- `shipping_address` (text)
- `completed_at` (timestamptz)
- `created_at` (timestamptz)
- `updated_at` (timestamptz)

### 6. order_items
Individual items within each order.
- `id` (uuid, primary key)
- `order_id` (uuid, references orders)
- `medicine_id` (uuid, references medicines)
- `quantity` (integer, not null)
- `price_at_purchase` (numeric, not null)
- `created_at` (timestamptz)

## Security

### Row Level Security (RLS)
All tables have RLS enabled with appropriate policies:

1. **profiles**: 
   - Admins have full access
   - Users can view and update their own profile (except role field)

2. **categories**: 
   - Public read access
   - Only admins can create/update/delete

3. **medicines**: 
   - Public read access
   - Only admins can create/update/delete

4. **cart_items**: 
   - Users can only access their own cart items
   - Admins have full access

5. **orders**: 
   - Users can view their own orders
   - Service role (edge functions) can manage all orders
   - Admins can view all orders

6. **order_items**: 
   - Users can view items from their own orders
   - Admins can view all order items

### Helper Functions
- `is_admin(uid uuid)`: Checks if a user has admin role
- `handle_new_user()`: Trigger function to auto-create profile on user confirmation
  - First user becomes admin automatically
  - Subsequent users get 'user' role

## Storage

### Medicine Images Bucket
- Bucket name: `app-84tul5br4fsx_medicine_images`
- Public access for reading
- Admin-only upload permissions
- Max file size: 1MB
- Allowed MIME types: image/jpeg, image/png, image/webp, image/gif

## Notes
- First registered user automatically becomes admin
- All monetary values use numeric type for precision
- Timestamps use timestamptz for timezone awareness
- Cart items are user-specific and persist across sessions
- Orders store item snapshots in JSONB for historical accuracy
*/

-- Create ENUM types
CREATE TYPE user_role AS ENUM ('user', 'admin');
CREATE TYPE order_status AS ENUM ('pending', 'completed', 'cancelled', 'refunded');

-- Create profiles table
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email text UNIQUE,
  full_name text,
  phone text,
  address text,
  role user_role DEFAULT 'user'::user_role NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create categories table
CREATE TABLE IF NOT EXISTS categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text UNIQUE NOT NULL,
  description text,
  created_at timestamptz DEFAULT now()
);

-- Create medicines table
CREATE TABLE IF NOT EXISTS medicines (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text,
  category_id uuid REFERENCES categories(id) ON DELETE SET NULL,
  price numeric(10,2) NOT NULL CHECK (price >= 0),
  stock_quantity integer NOT NULL DEFAULT 0 CHECK (stock_quantity >= 0),
  image_url text,
  prescription_required boolean DEFAULT false,
  manufacturer text,
  dosage text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create cart_items table
CREATE TABLE IF NOT EXISTS cart_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  medicine_id uuid REFERENCES medicines(id) ON DELETE CASCADE NOT NULL,
  quantity integer NOT NULL CHECK (quantity > 0),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(user_id, medicine_id)
);

-- Create orders table
CREATE TABLE IF NOT EXISTS orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE SET NULL,
  items jsonb NOT NULL,
  total_amount numeric(12,2) NOT NULL CHECK (total_amount >= 0),
  currency text NOT NULL DEFAULT 'usd',
  status order_status NOT NULL DEFAULT 'pending'::order_status,
  stripe_session_id text UNIQUE,
  stripe_payment_intent_id text,
  customer_email text,
  customer_name text,
  shipping_address text,
  completed_at timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create order_items table
CREATE TABLE IF NOT EXISTS order_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id uuid REFERENCES orders(id) ON DELETE CASCADE NOT NULL,
  medicine_id uuid REFERENCES medicines(id) ON DELETE SET NULL,
  quantity integer NOT NULL CHECK (quantity > 0),
  price_at_purchase numeric(10,2) NOT NULL CHECK (price_at_purchase >= 0),
  created_at timestamptz DEFAULT now()
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_medicines_category ON medicines(category_id);
CREATE INDEX IF NOT EXISTS idx_medicines_name ON medicines(name);
CREATE INDEX IF NOT EXISTS idx_cart_items_user ON cart_items(user_id);
CREATE INDEX IF NOT EXISTS idx_orders_user ON orders(user_id);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_stripe_session ON orders(stripe_session_id);
CREATE INDEX IF NOT EXISTS idx_order_items_order ON order_items(order_id);

-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE medicines ENABLE ROW LEVEL SECURITY;
ALTER TABLE cart_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;

-- Helper function to check if user is admin
CREATE OR REPLACE FUNCTION is_admin(uid uuid)
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM profiles
    WHERE id = uid AND role = 'admin'::user_role
  );
$$;

-- Trigger function to create profile on user confirmation
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  user_count int;
BEGIN
  SELECT COUNT(*) INTO user_count FROM profiles;
  
  INSERT INTO profiles (id, email, role)
  VALUES (
    NEW.id,
    NEW.email,
    CASE WHEN user_count = 0 THEN 'admin'::user_role ELSE 'user'::user_role END
  );
  
  RETURN NEW;
END;
$$;

-- Create trigger for new user
DROP TRIGGER IF EXISTS on_auth_user_confirmed ON auth.users;
CREATE TRIGGER on_auth_user_confirmed
  AFTER UPDATE ON auth.users
  FOR EACH ROW
  WHEN (OLD.confirmed_at IS NULL AND NEW.confirmed_at IS NOT NULL)
  EXECUTE FUNCTION handle_new_user();

-- RLS Policies for profiles
CREATE POLICY "Admins have full access to profiles"
  ON profiles FOR ALL
  TO authenticated
  USING (is_admin(auth.uid()));

CREATE POLICY "Users can view own profile"
  ON profiles FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (role IS NOT DISTINCT FROM (SELECT role FROM profiles WHERE id = auth.uid()));

-- RLS Policies for categories
CREATE POLICY "Anyone can view categories"
  ON categories FOR SELECT
  TO authenticated, anon
  USING (true);

CREATE POLICY "Only admins can manage categories"
  ON categories FOR ALL
  TO authenticated
  USING (is_admin(auth.uid()));

-- RLS Policies for medicines
CREATE POLICY "Anyone can view medicines"
  ON medicines FOR SELECT
  TO authenticated, anon
  USING (true);

CREATE POLICY "Only admins can manage medicines"
  ON medicines FOR ALL
  TO authenticated
  USING (is_admin(auth.uid()));

-- RLS Policies for cart_items
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

-- RLS Policies for orders
CREATE POLICY "Users can view own orders"
  ON orders FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Service role can manage orders"
  ON orders FOR ALL
  USING (auth.jwt()->>'role' = 'service_role');

CREATE POLICY "Admins can view all orders"
  ON orders FOR SELECT
  TO authenticated
  USING (is_admin(auth.uid()));

CREATE POLICY "Admins can update orders"
  ON orders FOR UPDATE
  TO authenticated
  USING (is_admin(auth.uid()));

-- RLS Policies for order_items
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

CREATE POLICY "Admins can view all order items"
  ON order_items FOR SELECT
  TO authenticated
  USING (is_admin(auth.uid()));

-- Create storage bucket for medicine images
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'app-84tul5br4fsx_medicine_images',
  'app-84tul5br4fsx_medicine_images',
  true,
  1048576,
  ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif']
)
ON CONFLICT (id) DO NOTHING;

-- Storage policies for medicine images
CREATE POLICY "Public can view medicine images"
  ON storage.objects FOR SELECT
  TO authenticated, anon
  USING (bucket_id = 'app-84tul5br4fsx_medicine_images');

CREATE POLICY "Admins can upload medicine images"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (
    bucket_id = 'app-84tul5br4fsx_medicine_images'
    AND is_admin(auth.uid())
  );

CREATE POLICY "Admins can update medicine images"
  ON storage.objects FOR UPDATE
  TO authenticated
  USING (
    bucket_id = 'app-84tul5br4fsx_medicine_images'
    AND is_admin(auth.uid())
  );

CREATE POLICY "Admins can delete medicine images"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (
    bucket_id = 'app-84tul5br4fsx_medicine_images'
    AND is_admin(auth.uid())
  );

-- Insert initial categories
INSERT INTO categories (name, description) VALUES
  ('Prescription Medicines', 'Medicines that require a valid prescription from a healthcare provider'),
  ('Over-the-Counter (OTC)', 'Medicines available without prescription for common ailments'),
  ('Health Supplements', 'Vitamins, minerals, and dietary supplements for overall wellness'),
  ('Personal Care', 'Personal hygiene and care products'),
  ('Medical Devices', 'Medical equipment and supplies for home healthcare');

-- Insert sample medicines for demonstration
INSERT INTO medicines (name, description, category_id, price, stock_quantity, prescription_required, manufacturer, dosage) VALUES
  (
    'Paracetamol 500mg',
    'Effective pain relief and fever reducer for adults and children',
    (SELECT id FROM categories WHERE name = 'Over-the-Counter (OTC)'),
    5.99,
    500,
    false,
    'PharmaCorp',
    '500mg tablets, take 1-2 tablets every 4-6 hours'
  ),
  (
    'Amoxicillin 250mg',
    'Antibiotic for bacterial infections',
    (SELECT id FROM categories WHERE name = 'Prescription Medicines'),
    15.99,
    200,
    true,
    'MediPharm',
    '250mg capsules, take as prescribed by doctor'
  ),
  (
    'Vitamin D3 1000 IU',
    'Essential vitamin for bone health and immune support',
    (SELECT id FROM categories WHERE name = 'Health Supplements'),
    12.99,
    300,
    false,
    'HealthPlus',
    '1000 IU softgels, take 1 daily'
  ),
  (
    'Ibuprofen 400mg',
    'Anti-inflammatory pain reliever',
    (SELECT id FROM categories WHERE name = 'Over-the-Counter (OTC)'),
    7.99,
    450,
    false,
    'PharmaCorp',
    '400mg tablets, take 1 tablet every 6-8 hours'
  ),
  (
    'Omega-3 Fish Oil',
    'Supports heart and brain health',
    (SELECT id FROM categories WHERE name = 'Health Supplements'),
    18.99,
    250,
    false,
    'HealthPlus',
    '1000mg softgels, take 1-2 daily with meals'
  ),
  (
    'Hand Sanitizer 500ml',
    'Antibacterial hand sanitizer with 70% alcohol',
    (SELECT id FROM categories WHERE name = 'Personal Care'),
    8.99,
    600,
    false,
    'CleanCare',
    'Apply to hands and rub thoroughly'
  ),
  (
    'Digital Thermometer',
    'Fast and accurate temperature measurement',
    (SELECT id FROM categories WHERE name = 'Medical Devices'),
    14.99,
    150,
    false,
    'MediTech',
    'Place under tongue or in armpit for 30 seconds'
  ),
  (
    'Cetirizine 10mg',
    'Antihistamine for allergy relief',
    (SELECT id FROM categories WHERE name = 'Over-the-Counter (OTC)'),
    9.99,
    400,
    false,
    'AllergyFree',
    '10mg tablets, take 1 daily'
  );