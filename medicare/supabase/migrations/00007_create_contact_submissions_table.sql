/*
# Create Contact Submissions Table

## Purpose
Store contact form submissions from users with their inquiries and support requests.

## Tables Created

### contact_submissions
- `id` (uuid, primary key) - Unique identifier for each submission
- `name` (text, not null) - Full name of the person submitting
- `email` (text, not null) - Email address for response
- `subject` (text, not null) - Subject of the inquiry
- `message` (text, not null) - Detailed message content
- `user_id` (uuid, nullable) - Reference to auth.users if logged in
- `status` (text, default: 'new') - Status: new, in_progress, resolved
- `created_at` (timestamptz, default: now()) - Submission timestamp
- `updated_at` (timestamptz, default: now()) - Last update timestamp

## Security
- Enable RLS on contact_submissions table
- Allow anyone to insert (public can submit contact forms)
- Only admins can view all submissions
- Users can view their own submissions if logged in

## Indexes
- Index on email for faster lookups
- Index on status for filtering
- Index on created_at for sorting
*/

-- Create contact_submissions table
CREATE TABLE IF NOT EXISTS contact_submissions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text NOT NULL,
  subject text NOT NULL,
  message text NOT NULL,
  user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  status text DEFAULT 'new' CHECK (status IN ('new', 'in_progress', 'resolved')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create indexes
CREATE INDEX idx_contact_submissions_email ON contact_submissions(email);
CREATE INDEX idx_contact_submissions_status ON contact_submissions(status);
CREATE INDEX idx_contact_submissions_created_at ON contact_submissions(created_at DESC);
CREATE INDEX idx_contact_submissions_user_id ON contact_submissions(user_id);

-- Enable RLS
ALTER TABLE contact_submissions ENABLE ROW LEVEL SECURITY;

-- Policy: Anyone can insert (public contact form)
CREATE POLICY "Anyone can submit contact form" ON contact_submissions
  FOR INSERT TO anon, authenticated
  WITH CHECK (true);

-- Policy: Users can view their own submissions
CREATE POLICY "Users can view own submissions" ON contact_submissions
  FOR SELECT TO authenticated
  USING (auth.uid() = user_id);

-- Policy: Admins can view all submissions
CREATE POLICY "Admins can view all submissions" ON contact_submissions
  FOR SELECT TO authenticated
  USING (is_admin(auth.uid()));

-- Policy: Admins can update submissions (change status)
CREATE POLICY "Admins can update submissions" ON contact_submissions
  FOR UPDATE TO authenticated
  USING (is_admin(auth.uid()))
  WITH CHECK (is_admin(auth.uid()));

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION update_contact_submissions_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_contact_submissions_updated_at
  BEFORE UPDATE ON contact_submissions
  FOR EACH ROW
  EXECUTE FUNCTION update_contact_submissions_updated_at();