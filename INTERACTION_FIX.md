# Medicine Interactions Column Name Fix

## Issue
When admins tried to add a new interaction, they received this error:
```
Error creating interaction: {
  code: 'PGRST204',
  details: null,
  hint: null,
  message: "Could not find the 'medicine1_id' column of 'medicine_interactions' in the schema cache"
}
```

## Root Cause
There was a mismatch between the database schema and the application code:

- **Database Schema** (in `supabase/migrations/00011_add_new_features.sql`):
  - Uses columns: `medicine_a_id` and `medicine_b_id`
  
- **Application Code** (in `src/db/api.ts` and `src/pages/admin/AdminInteractions.tsx`):
  - Was using: `medicine1_id` and `medicine2_id`

## Solution
Updated all references in the application code to match the database schema:

### 1. API Layer (`src/db/api.ts`)
- Changed `getAllInteractions()` to use `medicine_a` and `medicine_b` in the select query
- Updated `createInteraction()` parameter type to use `medicine_a_id` and `medicine_b_id`
- Updated `updateInteraction()` parameter type to use `medicine_a_id` and `medicine_b_id`
- Added `recommendation` field to both create and update operations

### 2. Admin Page (`src/pages/admin/AdminInteractions.tsx`)
- Updated `InteractionFormData` interface to use `medicine_a_id` and `medicine_b_id`
- Added `recommendation` field to the form interface
- Updated form default values
- Updated form field names in JSX
- Updated validation logic
- Updated submit handler to use correct field names
- Updated display logic to show `medicine_a` and `medicine_b` names
- Updated search filter to use correct field names
- Added recommendation textarea field to the form

## Files Changed
1. `src/db/api.ts` - API functions for interactions
2. `src/pages/admin/AdminInteractions.tsx` - Admin interface for managing interactions

## Testing
After this fix, admins can now:
- ✅ Create new medicine interactions
- ✅ Edit existing interactions
- ✅ View interaction details correctly
- ✅ Search and filter interactions
- ✅ Add recommendations for each interaction

## Database Schema Reference
The correct schema from migration `00011_add_new_features.sql`:
```sql
CREATE TABLE IF NOT EXISTS medicine_interactions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  medicine_a_id bigint REFERENCES medicine_data(id) ON DELETE CASCADE NOT NULL,
  medicine_b_id bigint REFERENCES medicine_data(id) ON DELETE CASCADE NOT NULL,
  severity text NOT NULL CHECK (severity IN ('mild', 'moderate', 'severe')),
  description text NOT NULL,
  recommendation text NOT NULL,
  created_at timestamptz DEFAULT now(),
  CHECK (medicine_a_id < medicine_b_id)
);
```

## Note
The database enforces that `medicine_a_id < medicine_b_id` to prevent duplicate interactions (e.g., A+B and B+A are the same interaction). The application handles this automatically by sorting the IDs before insertion.
