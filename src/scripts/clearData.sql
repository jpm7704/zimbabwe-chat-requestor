
-- Clear all data from tables while preserving structure
-- This is done in a specific order to respect foreign key constraints

-- First clear tables that reference other tables
TRUNCATE public.attachments CASCADE;
TRUNCATE public.field_visits CASCADE;
TRUNCATE public.messages CASCADE;
TRUNCATE public.notifications CASCADE;
TRUNCATE public.reports CASCADE;
TRUNCATE public.requests CASCADE;
TRUNCATE public.status_updates CASCADE;

-- Then clear reference tables
TRUNCATE public.staff_roles CASCADE;
TRUNCATE public.staff_verification_codes CASCADE;

-- Clear user profiles last
TRUNCATE public.user_profiles CASCADE;

-- Reset sequences if any
-- Note: This will reset auto-incrementing IDs to start from 1 again
ALTER SEQUENCE IF EXISTS public.staff_roles_id_seq RESTART WITH 1;
