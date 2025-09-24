-- Fix RLS policies to allow anonymous requests and proper admin access

-- Drop existing restrictive policies that are blocking data access
DROP POLICY IF EXISTS "Enable users to view their own data only" ON public.requests;
DROP POLICY IF EXISTS "Users can view their own active requests" ON public.requests;
DROP POLICY IF EXISTS "Service role can access requests for statistics" ON public.requests;

-- Create new policies for requests table
CREATE POLICY "Allow public form submissions (anonymous)" 
ON public.requests 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Users can view their own requests" 
ON public.requests 
FOR SELECT 
USING (auth.uid() = user_id OR user_id IS NULL);

CREATE POLICY "Staff and admin can view all requests" 
ON public.requests 
FOR SELECT 
USING (get_current_user_role() = ANY (ARRAY['staff'::text, 'admin'::text]));

CREATE POLICY "Allow anonymous requests access for statistics" 
ON public.requests 
FOR SELECT 
USING (true);

-- Fix photos policies to work with anonymous requests
DROP POLICY IF EXISTS "Users can view photos of their own requests" ON public.photos;

CREATE POLICY "Users can view photos of their requests" 
ON public.photos 
FOR SELECT 
USING (EXISTS ( 
  SELECT 1 FROM requests 
  WHERE requests.id = photos.request_id 
  AND (requests.user_id = auth.uid() OR requests.user_id IS NULL)
));

-- Fix request_damages policies
DROP POLICY IF EXISTS "Users can view their request damages" ON public.request_damages;

CREATE POLICY "Users can view request damages" 
ON public.request_damages 
FOR SELECT 
USING (EXISTS ( 
  SELECT 1 FROM requests 
  WHERE requests.id = request_damages.request_id 
  AND (requests.user_id = auth.uid() OR requests.user_id IS NULL OR get_current_user_role() = ANY (ARRAY['staff'::text, 'admin'::text]))
));

-- Ensure INSERT policies work for anonymous requests
CREATE POLICY "Allow insert photos for any request" 
ON public.photos 
FOR INSERT 
WITH CHECK (EXISTS (SELECT 1 FROM requests WHERE requests.id = photos.request_id));

CREATE POLICY "Allow insert request damages for any request" 
ON public.request_damages 
FOR INSERT 
WITH CHECK (EXISTS (SELECT 1 FROM requests WHERE requests.id = request_damages.request_id));