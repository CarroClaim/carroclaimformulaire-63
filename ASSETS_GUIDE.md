# Guide de Gestion des Assets Personnalisés

## 🎯 Structure des Assets

Votre application dispose maintenant d'un système d'assets organisé qui vous permet d'ajouter facilement vos logos personnalisés et photos d'exemples.

### 📁 Structure des Dossiers

```
public/assets/
├── logos/              # Vos logos personnalisés
│   ├── logo-primary.png     # Logo principal
│   ├── logo-header.png      # Logo en-tête  
│   └── logo-custom.png      # Logo personnalisé
├── examples/
│   ├── documents/      # Exemples de documents
│   │   ├── carte-grise-example-1.jpg
│   │   ├── carte-grise-example-2.jpg
│   │   ├── compteur-example-1.jpg
│   │   └── compteur-animated.gif (optionnel)
│   ├── vehicles/       # Exemples d'angles de véhicule
│   │   ├── car-front-left-example.jpg
│   │   ├── car-rear-left-example.jpg
│   │   ├── car-rear-right-example.jpg
│   │   └── car-front-right-example.jpg
│   └── damages/        # Exemples de dommages
│       ├── damage-close-example.jpg
│       ├── damage-wide-example.jpg
│       └── how-to-photograph.gif (optionnel)
```

## 🔧 Comment Ajouter Vos Assets

### 1. Logos Personnalisés

1. **Placez vos fichiers** dans `public/assets/logos/`
2. **Nommez-les correctement** :
   - `logo-primary.png` - Logo principal (120x40px recommandé)
   - `logo-header.png` - Logo en-tête (100x32px recommandé)  
   - `logo-custom.png` - Logo personnalisé (80x30px recommandé)

3. **Formats supportés** : PNG, JPG, SVG

### 2. Photos d'Exemples

#### Documents
- **Carte grise** : `carte-grise-example-1.jpg`, `carte-grise-example-2.jpg`
- **Compteur** : `compteur-example-1.jpg`, `compteur-animated.gif`

#### Véhicules  
- **Angles** : `car-front-left-example.jpg`, `car-rear-left-example.jpg`, etc.

#### Dommages
- **Photos** : `damage-close-example.jpg`, `damage-wide-example.jpg`
- **Animation** : `how-to-photograph.gif`

### 3. Support des GIFs

✅ **Les GIFs sont entièrement supportés !**
- Ajoutez vos GIFs d'instruction dans les dossiers appropriés
- Ils seront automatiquement détectés et affichés avec un badge "GIF"
- Parfait pour montrer les bonnes pratiques de prise de photo

## ⚙️ Configuration Avancée

### Modifier les Configs dans `src/lib/assets.ts`

```typescript
// Ajouter un nouveau type de logo
export const LOGOS: Record<string, LogoConfig> = {
  // ... logos existants
  monLogo: {
    src: '/assets/logos/mon-logo-special.png',
    alt: 'Mon logo spécial',
    width: 150,
    height: 50,
    type: 'image'
  }
};

// Ajouter de nouveaux exemples
export const EXAMPLES: Record<string, AssetConfig[]> = {
  // ... exemples existants
  nouvelleCategorie: [
    {
      src: '/assets/examples/nouvelle/exemple-1.jpg',
      alt: 'Mon exemple personnalisé',
      title: 'Titre de l\'exemple',
      type: 'image'
    }
  ]
};
```

### Utiliser les Assets dans vos Composants

```tsx
// Afficher un logo
import { LogoDisplay } from './LogoDisplay';
<LogoDisplay type="monLogo" />

// Afficher une galerie d'exemples
import { ExampleGallery } from './ExampleGallery';
<ExampleGallery category="nouvelleCategorie" />

// Afficher une image unique
import { AssetImage } from './AssetImage';
<AssetImage 
  src="/assets/logos/mon-logo.png" 
  alt="Mon logo"
  type="image"
/>
```

## 📱 Optimisation

### Formats Recommandés
- **Logos** : PNG avec fond transparent, ou SVG
- **Photos** : JPG optimisées (< 200KB)
- **Animations** : GIF optimisés (< 500KB)

### Tailles Recommandées
- **Logos header** : 100x32px à 120x40px
- **Photos d'exemples** : 400x300px minimum
- **GIFs** : 400x300px, 10-20 frames max

## 🎨 Exemple Complet

1. **Ajoutez vos fichiers** :
   ```
   public/assets/logos/logo-header.png
   public/assets/examples/documents/carte-grise-example-1.jpg
   public/assets/examples/damages/how-to-photograph.gif
   ```

2. **Vos assets apparaîtront automatiquement** dans :
   - Le header (logos)
   - Les guides du formulaire (exemples)
   - Avec support complet des GIFs

3. **Fallbacks automatiques** : Si un asset n'existe pas, un placeholder s'affiche

---

## 🚀 Prêt à Personnaliser !

Votre système d'assets est maintenant configuré. Ajoutez simplement vos fichiers dans les bons dossiers et ils seront automatiquement intégrés dans votre application !

**Questions ?** Consultez `src/lib/assets.ts` pour voir toute la configuration disponible.