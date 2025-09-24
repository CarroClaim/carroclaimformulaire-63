-- Fix RLS policies step by step to avoid conflicts

-- First, drop all existing policies that might conflict
DROP POLICY IF EXISTS "Allow public form submissions (anonymous)" ON public.requests;
DROP POLICY IF EXISTS "Allow public form submissions" ON public.requests;
DROP POLICY IF EXISTS "Enable users to view their own data only" ON public.requests;
DROP POLICY IF EXISTS "Users can view their own active requests" ON public.requests;
DROP POLICY IF EXISTS "Service role can access requests for statistics" ON public.requests;
DROP POLICY IF EXISTS "Users can view photos of their own requests" ON public.photos;
DROP POLICY IF EXISTS "Users can view their request damages" ON public.request_damages;

-- Create comprehensive policies for requests table
CREATE POLICY "Public can insert requests" 
ON public.requests 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Users can view own requests" 
ON public.requests 
FOR SELECT 
USING (auth.uid() = user_id OR user_id IS NULL);

CREATE POLICY "Admin staff view all requests" 
ON public.requests 
FOR SELECT 
USING (get_current_user_role() = ANY (ARRAY['staff'::text, 'admin'::text]));

-- Create policy for statistics access (allows reading all requests for stats)
CREATE POLICY "Statistics access for all requests" 
ON public.requests 
FOR SELECT 
USING (true);

-- Fix photos policies
CREATE POLICY "View photos for accessible requests" 
ON public.photos 
FOR SELECT 
USING (EXISTS ( 
  SELECT 1 FROM requests 
  WHERE requests.id = photos.request_id 
  AND (requests.user_id = auth.uid() OR requests.user_id IS NULL OR get_current_user_role() = ANY (ARRAY['staff'::text, 'admin'::text]))
));

-- Fix request_damages policies  
CREATE POLICY "View damages for accessible requests" 
ON public.request_damages 
FOR SELECT 
USING (EXISTS ( 
  SELECT 1 FROM requests 
  WHERE requests.id = request_damages.request_id 
  AND (requests.user_id = auth.uid() OR requests.user_id IS NULL OR get_current_user_role() = ANY (ARRAY['staff'::text, 'admin'::text]))
));