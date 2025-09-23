/**
 * MAPPAGE DES NOMS DE PARTIES DE DOMMAGE
 * 
 * Ce fichier gère la correspondance entre les noms utilisés dans l'interface utilisateur
 * et les noms stockés en base de données.
 */

// Mapping bidirectionnel entre noms UI et noms de base de données
const DAMAGE_NAME_MAPPING = {
  // Portières
  "Portière avant gauche": "portiere_avant_gauche",
  "Portière avant droite": "portiere_avant_droite", 
  "Portière arrière gauche": "portiere_arriere_gauche",
  "Portière arrière droite": "portiere_arriere_droite",
  
  // Rétroviseurs
  "Rétroviseur gauche": "retroviseur_gauche",
  "Rétroviseur droite": "retroviseur_droit",
  
  // Vitres
  "Vitre avant gauche": "vitre_laterale",
  "Vitre avant droite": "vitre_laterale", 
  "Vitre arrière gauche": "vitre_laterale",
  "Vitre arrière droite": "vitre_laterale",
  "Pare-brise": "pare_brise",
  "Lunette arrière": "vitre_laterale",
  "Vitre de toit": "toit",
  
  // Custodes
  "Custode arrière gauche": "vitre_laterale",
  "Custode arrière droite": "vitre_laterale",
  
  // Ailes
  "Aile avant gauche": "aile_avant_gauche",
  "Aile avant droite": "aile_avant_droite",
  "Aile arrière gauche": "aile_arriere_gauche",
  "Aile arrière droite": "aile_arriere_droite",
  
  // Extensions
  "Extension avant gauche": "pare_chocs_avant",
  "Extension avant droite": "pare_chocs_avant",
  "Extension arrière gauche": "pare_chocs_arriere", 
  "Extension arrière droite": "pare_chocs_arriere",
  
  // Capot et coffre
  "Capot": "capot",
  "Coffre": "coffre",
  
  // Pare-chocs
  "Pare-chocs avant": "pare_chocs_avant",
  "Pare-chocs arrière": "pare_chocs_arriere",
  
  // Phares et feux
  "Phare avant gauche": "phare_avant_gauche",
  "Phare avant droite": "phare_avant_droit",
  "Feu arrière gauche": "feu_arriere_gauche", 
  "Feu arrière droite": "feu_arriere_droit",
  
  // Roues
  "Roue avant gauche": "roue_avant_gauche",
  "Roue avant droite": "roue_avant_droite",
  "Roue arrière gauche": "roue_arriere_gauche",
  "Roue arrière droite": "roue_arriere_droite",
  
  // Toit
  "Toit": "toit"
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
 */
export const mapDBToUI = (dbName: string): string => {
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