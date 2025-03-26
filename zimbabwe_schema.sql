
-- Schema for Zimbabwe Chat Requestor

-- 1. User profiles and roles
CREATE TABLE IF NOT EXISTS public.user_profiles (
  id UUID PRIMARY KEY REFERENCES auth.users ON DELETE CASCADE,
  first_name VARCHAR,
  last_name VARCHAR,
  email VARCHAR NOT NULL,
  role VARCHAR NOT NULL DEFAULT 'user',
  avatar_url TEXT,
  staff_number INTEGER,
  region VARCHAR,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- 2. Staff role hierarchy
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

-- 3. Support requests
CREATE TABLE IF NOT EXISTS public.requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  title VARCHAR NOT NULL,
  description TEXT NOT NULL,
  ticket_number VARCHAR NOT NULL,
  type VARCHAR NOT NULL,
  status VARCHAR NOT NULL DEFAULT 'pending',
  field_officer_id UUID,
  program_manager_id UUID,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- 4. Request status history
CREATE TABLE IF NOT EXISTS public.status_updates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  request_id UUID NOT NULL REFERENCES public.requests ON DELETE CASCADE,
  status VARCHAR NOT NULL,
  notes TEXT,
  updated_by UUID NOT NULL,
  timestamp TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- 5. Communication messages
CREATE TABLE IF NOT EXISTS public.messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  request_id UUID NOT NULL REFERENCES public.requests ON DELETE CASCADE,
  sender_id UUID NOT NULL,
  content TEXT NOT NULL,
  is_system_message BOOLEAN DEFAULT false,
  timestamp TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- 6. File attachments 
CREATE TABLE IF NOT EXISTS public.attachments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  request_id UUID REFERENCES public.requests ON DELETE CASCADE,
  message_id UUID REFERENCES public.messages ON DELETE CASCADE,
  name VARCHAR NOT NULL,
  type VARCHAR NOT NULL,
  size INTEGER NOT NULL,
  url TEXT NOT NULL,
  uploaded_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Workflow:
-- 1. User submits request (status: pending)
-- 2. HOP reviews and assigns to Assistant Project Officer (status: under_review)
-- 3. APO assigns to Regional Project Officer (status: assessment)
-- 4. RPO reviews and returns to APO (status: verified)
-- 5. APO returns to HOP (status: awaiting_approval)
-- 6. HOP forwards to Director (status: final_review)
-- 7. Director approves or rejects (status: approved/rejected)
-- 8. HOP processes final decision (status: completed)
