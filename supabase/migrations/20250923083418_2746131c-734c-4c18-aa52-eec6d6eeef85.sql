-- Rendre le bucket claim-photos public pour permettre l'affichage des images
UPDATE storage.buckets 
SET public = true 
WHERE name = 'claim-photos';

-- Créer une politique RLS pour permettre la lecture publique des objets dans le bucket claim-photos
CREATE POLICY "Public read access for claim photos" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'claim-photos');

-- Créer une politique RLS pour permettre l'insertion dans le bucket claim-photos
CREATE POLICY "Allow upload to claim photos bucket" 
ON storage.objects 
FOR INSERT 
WITH CHECK (bucket_id = 'claim-photos');