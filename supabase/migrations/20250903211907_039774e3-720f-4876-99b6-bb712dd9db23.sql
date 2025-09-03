-- Fix RLS infinite recursion by creating security definer function for role checking
CREATE OR REPLACE FUNCTION public.get_current_user_role()
RETURNS TEXT AS $$
  SELECT role FROM public.profiles WHERE id = auth.uid();
$$ LANGUAGE SQL SECURITY DEFINER STABLE SET search_path = public;

-- Drop the problematic policies that cause recursion
DROP POLICY IF EXISTS "Staff can view all profiles" ON public.profiles;
DROP POLICY IF EXISTS "Staff can view all requests" ON public.requests;
DROP POLICY IF EXISTS "Staff can update all requests" ON public.requests;

-- Recreate policies using the security definer function
CREATE POLICY "Staff can view all profiles" 
ON public.profiles 
FOR SELECT 
USING (public.get_current_user_role() = ANY(ARRAY['staff', 'admin']));

CREATE POLICY "Staff can view all requests" 
ON public.requests 
FOR SELECT 
USING (
  ((auth.uid() = user_id) AND (user_id IS NOT NULL)) 
  OR 
  (public.get_current_user_role() = ANY(ARRAY['staff', 'admin']))
);

CREATE POLICY "Staff can update all requests" 
ON public.requests 
FOR UPDATE 
USING (public.get_current_user_role() = ANY(ARRAY['staff', 'admin']));

-- Also fix similar issues in other tables
DROP POLICY IF EXISTS "Users can view their photos" ON public.photos;
DROP POLICY IF EXISTS "Users can view their request damages" ON public.request_damages;

CREATE POLICY "Users can view their photos" 
ON public.photos 
FOR SELECT 
USING (
  (EXISTS (SELECT 1 FROM requests WHERE ((requests.id = photos.request_id) AND (requests.user_id = auth.uid()))))
  OR 
  (public.get_current_user_role() = ANY(ARRAY['staff', 'admin']))
);

CREATE POLICY "Users can view their request damages" 
ON public.request_damages 
FOR SELECT 
USING (
  (EXISTS (SELECT 1 FROM requests WHERE ((requests.id = request_damages.request_id) AND (requests.user_id = auth.uid()))))
  OR 
  (public.get_current_user_role() = ANY(ARRAY['staff', 'admin']))
);