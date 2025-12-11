/*
# Update Profile Creation Trigger

## Changes
1. Update `handle_new_user()` function to extract and save full_name from user metadata
2. Ensure profile is created immediately on signup (not just on confirmation)
3. Support both confirmed and unconfirmed users

## Details
- Extracts `full_name` from `raw_user_meta_data`
- Creates profile on INSERT (signup) instead of UPDATE (confirmation)
- First user still gets admin role automatically
- Subsequent users get user role

## Security
- No changes to RLS policies
- Function remains SECURITY DEFINER for proper access
*/

-- Drop existing trigger
DROP TRIGGER IF EXISTS on_auth_user_confirmed ON auth.users;

-- Update the function to handle full_name and work on INSERT
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  user_count int;
  user_full_name text;
BEGIN
  -- Get count of existing profiles
  SELECT COUNT(*) INTO user_count FROM profiles;
  
  -- Extract full_name from user metadata
  user_full_name := NEW.raw_user_meta_data->>'full_name';
  
  -- Insert new profile
  INSERT INTO profiles (id, email, full_name, role)
  VALUES (
    NEW.id,
    NEW.email,
    user_full_name,
    CASE WHEN user_count = 0 THEN 'admin'::user_role ELSE 'user'::user_role END
  );
  
  RETURN NEW;
END;
$$;

-- Create trigger on INSERT (when user signs up)
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION handle_new_user();
