/**
 * MAPPAGE DES NOMS DE PARTIES DE DOMMAGE
 * 
 * Ce fichier gère la correspondance entre les noms utilisés dans l'interface utilisateur
 * et les noms stockés en base de données.
 */

// Mapping bidirectionnel entre noms UI et noms de base de données
// IMPORTANT: Les noms UI doivent correspondre EXACTEMENT aux noms utilisés dans le SVG CarDamageSelector
const DAMAGE_NAME_MAPPING = {
  // Portières
  "Portière avant gauche": "portiere_avant_gauche",
  "Portière avant droite": "portiere_avant_droite", 
  "Portière arrière gauche": "portiere_arriere_gauche",
  "Portière arrière droite": "portiere_arriere_droite",
  
  // Rétroviseurs - ATTENTION À LA CASSE (droite avec d minuscule dans le SVG)
  "Rétroviseur gauche": "retroviseur_gauche",
  "Rétroviseur droite": "retroviseur_droite", // Corrigé pour correspondre au SVG
  
  // Vitres - chaque vitre a maintenant son propre identifiant unique
  "Vitre avant gauche": "vitre_avant_gauche",
  "Vitre avant droite": "vitre_avant_droite", 
  "Vitre arrière gauche": "vitre_arriere_gauche",
  "Vitre arrière droite": "vitre_arriere_droite",
  "Pare-brise": "pare_brise",
  "Lunette arrière": "lunette_arriere",
  "Vitre de toit": "vitre_toit",
  
  // Custodes - identifiants uniques
  "Custode arrière gauche": "custode_arriere_gauche",
  "Custode arrière droite": "custode_arriere_droite",
  
  // Ailes
  "Aile avant gauche": "aile_avant_gauche",
  "Aile avant droite": "aile_avant_droite",
  "Aile arrière gauche": "aile_arriere_gauche",
  "Aile arrière droite": "aile_arriere_droite",
  
  // Extensions
  "Extension avant gauche": "extension_avant_gauche",
  "Extension avant droite": "extension_avant_droite",
  "Extension arrière gauche": "extension_arriere_gauche", 
  "Extension arrière droite": "extension_arriere_droite",
  
  // Montants
  "Montant gauche": "montant_gauche",
  "Montant droite": "montant_droite", // droite avec d minuscule
  
  // Carrosserie principale
  "Capot": "capot",
  "Toit": "toit",
  "Hayon": "hayon",
  
  // Pare-chocs - noms EXACTS du SVG
  "Pare-choc avant": "pare_choc_avant",
  "Pare-choc avant gauche": "pare_choc_avant_gauche",
  "Pare-choc avant droite": "pare_choc_avant_droite",
  "Pare-choc arrière": "pare_choc_arriere",
  "Pare-choc arrière gauche": "pare_choc_arriere_gauche",
  "Pare-choc arrière droite": "pare_choc_arriere_droite",
  
  // Phares et feux - ATTENTION À LA CASSE
  "Phare avant gauche": "phare_avant_gauche",
  "Phare avant droite": "phare_avant_droite", // droite avec d minuscule
  "Feu arrière gauche": "feu_arriere_gauche", 
  "Feu arrière droite": "feu_arriere_droite", // droite avec d minuscule
  "Feu intérieur arrière gauche": "feu_interieur_arriere_gauche",
  "Feu intérieur arrière droite": "feu_interieur_arriere_droite",
  
  // Catadioptres
  "Catadioptre arrière gauche": "catadioptre_arriere_gauche",
  "Catadioptre arrière droite": "catadioptre_arriere_droite",
  
  // Plaques d'immatriculation
  "Cadre de plaque avant": "cadre_plaque_avant",
  "Cadre de plaque arrière": "cadre_plaque_arriere",
  
  // Roues et pneumatiques
  "Pneu avant gauche": "pneu_avant_gauche",
  "Jante avant gauche": "jante_avant_gauche",
  "Pneu avant droite": "pneu_avant_droite", // droite avec d minuscule
  "Jante avant droite": "jante_avant_droite", // droite avec d minuscule
  "Pneu arrière gauche": "pneu_arriere_gauche",
  "Jante arrière gauche": "jante_arriere_gauche",
  "Pneu arrière droite": "pneu_arriere_droite", // droite avec d minuscule
  "Jante arrière droite": "jante_arriere_droite", // droite avec d minuscule
  
  // Bas de caisse
  "Bas de caisse gauche": "bas_caisse_gauche",
  "Bas de caisse droite": "bas_caisse_droite" // droite avec d minuscule
} as const;

// Mapping inverse pour l'affichage
const DB_TO_UI_MAPPING = Object.fromEntries(
  Object.entries(DAMAGE_NAME_MAPPING).map(([ui, db]) => [db, ui])
);

/**
 * Convertit un nom d'affichage UI vers le nom de base de données
 */
export const mapUIToDB = (uiName: string): string => {
  return DAMAGE_NAME_MAPPING[uiName as keyof typeof DAMAGE_NAME_MAPPING] || uiName.toLowerCase().replace(/\s+/g, '_').replace(/[àáâãäå]/g, 'a').replace(/[èéêë]/g, 'e').replace(/[ìíîï]/g, 'i').replace(/[òóôõö]/g, 'o').replace(/[ùúûü]/g, 'u').replace(/[çć]/g, 'c');
};

/**
 * Convertit un nom de base de données vers le nom d'affichage UI
 * Gère les cas d'ambiguïté pour les anciens mappings
 */
export const mapDBToUI = (dbName: string): string => {
  // Cas spécial pour l'ancien mapping ambigü de vitre_laterale
  if (dbName === 'vitre_laterale') {
    // Retourner le premier mapping trouvé comme fallback
    // TODO: À terme, migrer toutes les données vers les nouveaux identifiants spécifiques
    return 'Vitre avant gauche'; // Fallback, mais pas idéal
  }
  
  return DB_TO_UI_MAPPING[dbName] || dbName.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
};

/**
 * Convertit un tableau de noms UI vers des noms DB
 */
export const mapUIArrayToDB = (uiNames: string[]): string[] => {
  return uiNames.map(mapUIToDB);
};

/**
 * Convertit un tableau de noms DB vers des noms UI
 */
export const mapDBArrayToUI = (dbNames: string[]): string[] => {
  return dbNames.map(mapDBToUI);
};

/**
 * Vérifie si un nom UI a une correspondance en base
 */
export const hasDBMapping = (uiName: string): boolean => {
  return uiName in DAMAGE_NAME_MAPPING;
};

/**
 * Obtient tous les noms UI valides
 */
export const getAllUINames = (): string[] => {
  return Object.keys(DAMAGE_NAME_MAPPING);
};

/**
 * Obtient tous les noms DB valides
 */
export const getAllDBNames = (): string[] => {
  return Object.values(DAMAGE_NAME_MAPPING);
};