-- Ajouter les nouvelles parties de dommage avec des identifiants uniques
INSERT INTO damage_parts (name, description) VALUES 
  ('vitre_avant_gauche', 'Vitre avant gauche'),
  ('vitre_avant_droite', 'Vitre avant droite'),
  ('vitre_arriere_gauche', 'Vitre arrière gauche'),
  ('vitre_arriere_droite', 'Vitre arrière droite'),
  ('lunette_arriere', 'Lunette arrière'),
  ('vitre_toit', 'Vitre de toit'),
  ('custode_arriere_gauche', 'Custode arrière gauche'),
  ('custode_arriere_droite', 'Custode arrière droite')
ON CONFLICT (name) DO NOTHING;