# Template de Mail Responsive Planity

Template de mail responsive créé en MJML avec **boucles Handlebars** pour éviter la répétition.

## Structure

- `data.json` : Toutes les données du template (textes, statistiques, liens, etc.)
- `template.hbs` : Template Handlebars avec **boucles {{#each}}** (comme React !)
- `generate-template.js` : Script qui compile le template Handlebars en MJML
- `template.mjml` : Template MJML généré (ne pas éditer directement)
- `images/` : Images du template (logo, background)

## Installation

```bash
npm install
```

## Utilisation

### 1. Modifier les données

Éditez le fichier `data.json` pour modifier les textes, statistiques, liens, etc.

**Exemple pour modifier les statistiques :**
```json
{
  "stats": {
    "items": [
      {
        "number": "15M",
        "label": "de Français ont utilisé Planity cette année"
      },
      {
        "number": "130M",
        "label": "de rendez-vous réservés\nen ligne"
      }
    ]
  }
}
```

**Exemple pour modifier les KPI personnalisés :**
```json
{
  "personalStats": {
    "kpis": [
      {
        "number": "178",
        "category": "Nouveaux clients",
        "data": "pour un chiffre d'affaires estimé à XXX €",
        "note": "*Estimation basée sur..."
      }
    ]
  }
}
```

### 2. Générer le template

```bash
npm run generate
```

Cela compile le template Handlebars (`template.hbs`) avec les données JSON et génère `template.mjml`.

**Les boucles sont dans le template !** Regardez `template.hbs` :
- `{{#each stats.items}}` pour les statistiques
- `{{#each kpiGroups}}` pour les KPI (groupés par 2)
- `{{#each footer.links}}` pour les liens du footer

### 3. Compiler en HTML

```bash
npm run build
```

Ou manuellement :
```bash
mjml template.mjml -o output.html
```

## Avantages

✅ **Boucles dans le template** : Utilisez `{{#each}}` directement dans `template.hbs` (comme React !)  
✅ **Pas de répétition** : Les statistiques et KPI sont générés automatiquement  
✅ **Données centralisées** : Tout le contenu est dans `data.json`  
✅ **Facile à modifier** : Changez le JSON ou ajoutez des boucles dans le template  
✅ **Type-safe** : Structure JSON claire et organisée

## Exemple de boucle dans template.hbs

```handlebars
{{#each stats.items}}
<mj-column>
  <mj-text>{{number}}</mj-text>
  <mj-text>{{label}}</mj-text>
</mj-column>
{{/each}}
```

C'est exactement comme `.map()` en React ! 🎉  

## Structure des données

- `hero` : Section hero (logo, sous-titre, année)
- `intro` : Message d'introduction
- `stats` : Statistiques 2025 (avec boucle automatique)
- `personalStats` : KPI personnalisés (avec boucle automatique)
- `future` : Section 2026
- `closing` : Message de clôture
- `footer` : Footer avec réseaux sociaux, app stores, copyright

## Notes

- Les sauts de ligne dans le JSON (`\n`) sont automatiquement convertis en `<br />`
- Les caractères spéciaux sont automatiquement échappés pour XML
- Le template est responsive : les grilles s'empilent automatiquement sur mobile

