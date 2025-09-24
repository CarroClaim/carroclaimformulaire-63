-- Correction des permissions RLS pour le service de statistiques
-- Permet au service role et aux admins d'accéder aux données pour les statistiques

-- Politique pour permettre aux administrateurs de voir toutes les demandes pour les statistiques  
CREATE POLICY "Admins can view all requests for statistics"
ON public.requests
FOR SELECT
TO authenticated
USING (
  get_current_user_role() = ANY (ARRAY['staff'::text, 'admin'::text])
);

-- Politique pour permettre au service role d'accéder aux statistiques
CREATE POLICY "Service role can access requests for statistics"
ON public.requests
FOR SELECT
TO service_role
USING (true);

-- Mise à jour de la fonction pour améliorer la gestion des rôles
CREATE OR REPLACE FUNCTION public.get_current_user_role()
RETURNS text
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path = 'public'
AS $$
    SELECT COALESCE(
        (SELECT role FROM public.profiles WHERE id = auth.uid()),
        'client'
    );
$$;