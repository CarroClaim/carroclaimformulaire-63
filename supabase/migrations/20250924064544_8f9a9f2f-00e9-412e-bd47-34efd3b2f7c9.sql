-- CRITICAL SECURITY FIX: Remove public access to sensitive customer data

-- Drop the overly permissive policies that allow public access to sensitive data
DROP POLICY IF EXISTS "Enable read access for all users" ON public.requests;
DROP POLICY IF EXISTS "Enable read access for all users" ON public.photos;

-- Create secure policies for requests table - only staff/admin can view all data
CREATE POLICY "Staff can view all requests" 
ON public.requests 
FOR SELECT 
USING (get_current_user_role() = ANY (ARRAY['staff'::text, 'admin'::text]));

-- Users can only view their own non-archived requests
CREATE POLICY "Users can view their own active requests" 
ON public.requests 
FOR SELECT 
USING (auth.uid() = user_id AND is_archived = false);

-- Create secure policies for photos table - only staff/admin can view
CREATE POLICY "Staff can view all photos" 
ON public.photos 
FOR SELECT 
USING (get_current_user_role() = ANY (ARRAY['staff'::text, 'admin'::text]));

-- Users can view photos of their own requests
CREATE POLICY "Users can view photos of their own requests" 
ON public.photos 
FOR SELECT 
USING (EXISTS (
    SELECT 1 FROM public.requests 
    WHERE requests.id = photos.request_id 
    AND requests.user_id = auth.uid()
    AND requests.is_archived = false
));