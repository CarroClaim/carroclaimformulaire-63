-- Fix security vulnerability: Remove anonymous access to requests table
-- This ensures only authenticated users can access requests and only their own data

-- Drop existing policies that allow anonymous access
DROP POLICY IF EXISTS "Users can create requests" ON public.requests;
DROP POLICY IF EXISTS "Users can update their own requests" ON public.requests;
DROP POLICY IF EXISTS "Users can view their own requests" ON public.requests;

-- Create secure policies that require authentication
CREATE POLICY "Authenticated users can create their own requests" 
ON public.requests 
FOR INSERT 
TO authenticated
WITH CHECK (auth.uid() = user_id AND user_id IS NOT NULL);

CREATE POLICY "Users can view only their own requests" 
ON public.requests 
FOR SELECT 
TO authenticated
USING (auth.uid() = user_id AND user_id IS NOT NULL);

CREATE POLICY "Users can update only their own requests" 
ON public.requests 
FOR UPDATE 
TO authenticated
USING (auth.uid() = user_id AND user_id IS NOT NULL);

-- Also fix related tables to ensure consistency
-- Update photos policies to be more restrictive
DROP POLICY IF EXISTS "Users can create request photos" ON public.photos;
DROP POLICY IF EXISTS "Users can view their request photos" ON public.photos;

CREATE POLICY "Authenticated users can create photos for their requests" 
ON public.photos 
FOR INSERT 
TO authenticated
WITH CHECK (EXISTS (
  SELECT 1 FROM requests r 
  WHERE r.id = photos.request_id 
  AND r.user_id = auth.uid() 
  AND r.user_id IS NOT NULL
));

CREATE POLICY "Users can view photos for their own requests" 
ON public.photos 
FOR SELECT 
TO authenticated
USING (EXISTS (
  SELECT 1 FROM requests r 
  WHERE r.id = photos.request_id 
  AND r.user_id = auth.uid() 
  AND r.user_id IS NOT NULL
));

-- Update request_damages policies to be more restrictive
DROP POLICY IF EXISTS "Users can create request damages" ON public.request_damages;
DROP POLICY IF EXISTS "Users can view their request damages" ON public.request_damages;

CREATE POLICY "Authenticated users can create damages for their requests" 
ON public.request_damages 
FOR INSERT 
TO authenticated
WITH CHECK (EXISTS (
  SELECT 1 FROM requests r 
  WHERE r.id = request_damages.request_id 
  AND r.user_id = auth.uid() 
  AND r.user_id IS NOT NULL
));

CREATE POLICY "Users can view damages for their own requests" 
ON public.request_damages 
FOR SELECT 
TO authenticated
USING (EXISTS (
  SELECT 1 FROM requests r 
  WHERE r.id = request_damages.request_id 
  AND r.user_id = auth.uid() 
  AND r.user_id IS NOT NULL
));

-- Make user_id NOT NULL to enforce authentication requirement
-- First update any existing NULL values (this might fail if there are existing records)
-- UPDATE public.requests SET user_id = '00000000-0000-0000-0000-000000000000' WHERE user_id IS NULL;

-- Then make the column NOT NULL (commented out to avoid breaking existing data)
-- ALTER TABLE public.requests ALTER COLUMN user_id SET NOT NULL;