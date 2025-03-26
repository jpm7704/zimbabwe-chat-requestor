
-- Additional schema updates for Zimbabwe Chat Request Support System

-- 1. Update the user_profiles table to include additional staff fields
ALTER TABLE public.user_profiles
ADD COLUMN IF NOT EXISTS first_name VARCHAR,
ADD COLUMN IF NOT EXISTS last_name VARCHAR,
ADD COLUMN IF NOT EXISTS staff_number INTEGER,
ADD COLUMN IF NOT EXISTS region VARCHAR;

-- 2. Create a staff roles table to maintain role hierarchy
CREATE TABLE IF NOT EXISTS public.staff_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  role_key VARCHAR NOT NULL UNIQUE,
  display_name VARCHAR NOT NULL,
  description TEXT,
  hierarchy_level INTEGER NOT NULL,
  can_approve BOOLEAN DEFAULT false,
  can_assign BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- 3. Insert the complete staff role hierarchy
INSERT INTO public.staff_roles (role_key, display_name, description, hierarchy_level, can_approve, can_assign)
VALUES
  ('director', 'Director', 'Final approver with ultimate decision authority', 50, true, true),
  ('head_of_programs', 'Head of Programs (HOP)', 'Manages overall program and assigns tasks to officers', 40, true, true),
  ('assistant_project_officer', 'Assistant Project Officer', 'Handles project implementation under HOP guidance', 30, false, true),
  ('regional_project_officer', 'Regional Project Officer', 'Manages projects in specific regions', 20, false, true),
  ('field_officer', 'Field Officer', 'Conducts field verification and assessment', 10, false, false),
  ('user', 'Regular User', 'Beneficiary requesting assistance', 0, false, false)
ON CONFLICT (role_key) DO UPDATE
SET 
  display_name = EXCLUDED.display_name,
  description = EXCLUDED.description,
  hierarchy_level = EXCLUDED.hierarchy_level,
  can_approve = EXCLUDED.can_approve,
  can_assign = EXCLUDED.can_assign;

-- 4. Create a function to get available staff roles for the registration form
CREATE OR REPLACE FUNCTION public.get_available_staff_roles()
RETURNS TABLE (
  role_key VARCHAR,
  display_name VARCHAR,
  description TEXT
) 
LANGUAGE SQL
SECURITY DEFINER
AS $$
  SELECT role_key, display_name, description 
  FROM public.staff_roles
  WHERE role_key != 'user'
  ORDER BY hierarchy_level DESC;
$$;

-- 5. Update the user creation trigger to handle staff fields
CREATE OR REPLACE FUNCTION public.create_profile_for_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  INSERT INTO public.user_profiles (
    id, 
    first_name, 
    last_name, 
    email, 
    role,
    staff_number,
    region
  )
  VALUES (
    NEW.id, 
    COALESCE(NEW.raw_user_meta_data->>'firstName', ''), 
    COALESCE(NEW.raw_user_meta_data->>'lastName', ''),
    NEW.email, 
    COALESCE(NEW.raw_user_meta_data->>'role', 'user'),
    (NEW.raw_user_meta_data->>'staff_number')::integer,
    NEW.raw_user_meta_data->>'region'
  );
  RETURN NEW;
END;
$$;
