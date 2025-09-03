-- Check current policies and fix security vulnerability step by step
-- Remove all existing policies first to ensure clean state

DO $$ 
BEGIN
    -- Drop all existing policies for requests table
    DROP POLICY IF EXISTS "Users can create requests" ON public.requests;
    DROP POLICY IF EXISTS "Users can update their own requests" ON public.requests;
    DROP POLICY IF EXISTS "Users can view their own requests" ON public.requests;
    DROP POLICY IF EXISTS "Authenticated users can create their own requests" ON public.requests;
    DROP POLICY IF EXISTS "Users can view only their own requests" ON public.requests;
    DROP POLICY IF EXISTS "Users can update only their own requests" ON public.requests;

    -- Drop all existing policies for photos table
    DROP POLICY IF EXISTS "Users can create request photos" ON public.photos;
    DROP POLICY IF EXISTS "Users can view their request photos" ON public.photos;
    DROP POLICY IF EXISTS "Authenticated users can create photos for their requests" ON public.photos;
    DROP POLICY IF EXISTS "Users can view photos for their own requests" ON public.photos;

    -- Drop all existing policies for request_damages table
    DROP POLICY IF EXISTS "Users can create request damages" ON public.request_damages;
    DROP POLICY IF EXISTS "Users can view their request damages" ON public.request_damages;
    DROP POLICY IF EXISTS "Authenticated users can create damages for their requests" ON public.request_damages;
    DROP POLICY IF EXISTS "Users can view damages for their own requests" ON public.request_damages;
END $$;

-- Create secure policies for requests table (requires authentication)
CREATE POLICY "secure_requests_insert" 
ON public.requests 
FOR INSERT 
TO authenticated
WITH CHECK (auth.uid() = user_id AND user_id IS NOT NULL);

CREATE POLICY "secure_requests_select" 
ON public.requests 
FOR SELECT 
TO authenticated
USING (auth.uid() = user_id AND user_id IS NOT NULL);

CREATE POLICY "secure_requests_update" 
ON public.requests 
FOR UPDATE 
TO authenticated
USING (auth.uid() = user_id AND user_id IS NOT NULL);

-- Create secure policies for photos table
CREATE POLICY "secure_photos_insert" 
ON public.photos 
FOR INSERT 
TO authenticated
WITH CHECK (EXISTS (
  SELECT 1 FROM requests r 
  WHERE r.id = photos.request_id 
  AND r.user_id = auth.uid() 
  AND r.user_id IS NOT NULL
));

CREATE POLICY "secure_photos_select" 
ON public.photos 
FOR SELECT 
TO authenticated
USING (EXISTS (
  SELECT 1 FROM requests r 
  WHERE r.id = photos.request_id 
  AND r.user_id = auth.uid() 
  AND r.user_id IS NOT NULL
));

-- Create secure policies for request_damages table
CREATE POLICY "secure_request_damages_insert" 
ON public.request_damages 
FOR INSERT 
TO authenticated
WITH CHECK (EXISTS (
  SELECT 1 FROM requests r 
  WHERE r.id = request_damages.request_id 
  AND r.user_id = auth.uid() 
  AND r.user_id IS NOT NULL
));

CREATE POLICY "secure_request_damages_select" 
ON public.request_damages 
FOR SELECT 
TO authenticated
USING (EXISTS (
  SELECT 1 FROM requests r 
  WHERE r.id = request_damages.request_id 
  AND r.user_id = auth.uid() 
  AND r.user_id IS NOT NULL
));