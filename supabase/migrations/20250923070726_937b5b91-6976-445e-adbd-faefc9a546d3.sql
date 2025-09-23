-- Corriger les politiques RLS pour permettre l'insertion des demandes publiques

-- Supprimer les politiques restrictives existantes pour les insertions
DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON public.requests;

-- Créer une nouvelle politique qui permet l'insertion pour tous les utilisateurs (formulaire public)
CREATE POLICY "Enable insert for all users" ON public.requests
FOR INSERT 
WITH CHECK (true);

-- Garder la politique de lecture existante
-- Les autres politiques restent inchangées pour la sécurité