-- Ajouter toutes les parties de dommage manquantes avec des identifiants complets et corrects

-- Suppression des anciens mappings ambigus (optionnel, pour éviter les conflits)
DELETE FROM damage_parts WHERE name IN ('vitre_laterale', 'pare_chocs_avant', 'pare_chocs_arriere');

-- Insertion de toutes les parties avec les nouveaux identifiants uniques
INSERT INTO damage_parts (name, description) VALUES 
  -- Rétroviseurs (correction de la casse)
  ('retroviseur_droite', 'Rétroviseur droite'),
  
  -- Extensions (identifiants spécifiques)
  ('extension_avant_gauche', 'Extension avant gauche'),
  ('extension_avant_droite', 'Extension avant droite'),
  ('extension_arriere_gauche', 'Extension arrière gauche'), 
  ('extension_arriere_droite', 'Extension arrière droite'),
  
  -- Montants
  ('montant_gauche', 'Montant gauche'),
  ('montant_droite', 'Montant droite'),
  
  -- Carrosserie principale
  ('hayon', 'Hayon'),
  
  -- Pare-chocs (noms exacts du SVG)
  ('pare_choc_avant', 'Pare-choc avant'),
  ('pare_choc_avant_gauche', 'Pare-choc avant gauche'),
  ('pare_choc_avant_droite', 'Pare-choc avant droite'),
  ('pare_choc_arriere', 'Pare-choc arrière'),
  ('pare_choc_arriere_gauche', 'Pare-choc arrière gauche'),
  ('pare_choc_arriere_droite', 'Pare-choc arrière droite'),
  
  -- Phares et feux (correction de la casse pour "droite")
  ('phare_avant_droite', 'Phare avant droite'),
  ('feu_arriere_droite', 'Feu arrière droite'),
  ('feu_interieur_arriere_gauche', 'Feu intérieur arrière gauche'),
  ('feu_interieur_arriere_droite', 'Feu intérieur arrière droite'),
  
  -- Catadioptres
  ('catadioptre_arriere_gauche', 'Catadioptre arrière gauche'),
  ('catadioptre_arriere_droite', 'Catadioptre arrière droite'),
  
  -- Plaques d'immatriculation
  ('cadre_plaque_avant', 'Cadre de plaque avant'),
  ('cadre_plaque_arriere', 'Cadre de plaque arrière'),
  
  -- Roues et pneumatiques
  ('pneu_avant_gauche', 'Pneu avant gauche'),
  ('jante_avant_gauche', 'Jante avant gauche'),
  ('pneu_avant_droite', 'Pneu avant droite'),
  ('jante_avant_droite', 'Jante avant droite'),
  ('pneu_arriere_gauche', 'Pneu arrière gauche'),
  ('jante_arriere_gauche', 'Jante arrière gauche'),
  ('pneu_arriere_droite', 'Pneu arrière droite'),
  ('jante_arriere_droite', 'Jante arrière droite'),
  
  -- Bas de caisse
  ('bas_caisse_gauche', 'Bas de caisse gauche'),
  ('bas_caisse_droite', 'Bas de caisse droite')
ON CONFLICT (name) DO UPDATE SET description = EXCLUDED.description;