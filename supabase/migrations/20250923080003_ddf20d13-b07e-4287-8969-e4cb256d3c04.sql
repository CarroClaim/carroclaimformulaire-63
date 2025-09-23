-- Supprimer l'ancienne politique RLS restrictive sur la table photos
DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON public.photos;

-- Créer une nouvelle politique qui permet l'insertion publique si la request_id existe
CREATE POLICY "Enable insert for valid requests" 
ON public.photos 
FOR INSERT 
WITH CHECK (
  EXISTS (
    SELECT 1 
    FROM public.requests 
    WHERE requests.id = photos.request_id
  )
);