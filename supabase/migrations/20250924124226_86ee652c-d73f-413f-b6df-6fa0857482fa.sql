-- Corriger les politiques RLS pour permettre l'accès admin via service key

-- 1. Créer une politique pour permettre l'accès complet aux requests avec service key
CREATE POLICY "Service role can access all requests" 
ON public.requests 
FOR ALL 
USING (
  -- Allow access if using service role key (no auth.uid() available)
  current_setting('role', true) = 'service_role'
  OR 
  -- Keep existing policies for authenticated users
  auth.uid() IS NOT NULL
);

-- 2. Créer une politique pour permettre l'accès complet aux photos avec service key
CREATE POLICY "Service role can access all photos" 
ON public.photos 
FOR ALL 
USING (
  current_setting('role', true) = 'service_role'
  OR 
  -- Keep existing logic for regular users
  (EXISTS ( SELECT 1 FROM requests WHERE requests.id = photos.request_id AND requests.user_id = auth.uid() AND requests.is_archived = false))
  OR
  -- Staff can view all photos
  get_current_user_role() = ANY (ARRAY['staff'::text, 'admin'::text])
);

-- 3. Créer une politique pour permettre l'accès complet aux request_damages avec service key
CREATE POLICY "Service role can access all request_damages" 
ON public.request_damages 
FOR ALL 
USING (
  current_setting('role', true) = 'service_role'
  OR
  -- Keep existing logic for regular users
  (EXISTS ( SELECT 1 FROM requests WHERE requests.id = request_damages.request_id AND requests.user_id = auth.uid()))
  OR 
  -- Staff can view all
  get_current_user_role() = ANY (ARRAY['staff'::text, 'admin'::text])
);

-- 4. Créer une politique pour permettre l'accès aux damage_parts avec service key
CREATE POLICY "Service role can access all damage_parts" 
ON public.damage_parts 
FOR ALL 
USING (
  current_setting('role', true) = 'service_role'
  OR 
  -- Keep public read access
  true
);

-- 5. Mettre à jour la fonction update_request_status pour s'assurer qu'elle fonctionne avec service key
CREATE OR REPLACE FUNCTION public.update_request_status(request_id uuid, new_status text)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
    -- Update the status (this will work with service role)
    UPDATE public.requests
    SET 
        status = new_status,
        updated_at = now(),
        -- Automatically set archiving fields when status is 'archived'
        is_archived = CASE 
            WHEN new_status = 'archived' THEN true 
            ELSE is_archived 
        END,
        archived_at = CASE 
            WHEN new_status = 'archived' THEN now() 
            ELSE archived_at 
        END
    WHERE id = request_id;
    
    -- Check if the update was successful
    IF NOT FOUND THEN
        RAISE EXCEPTION 'Request with id % not found', request_id;
    END IF;
END;
$$;