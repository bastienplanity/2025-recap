# Template de Mail Mobile Planity

Template de mail mobile uniquement créé en MJML avec **styles inline maximum**.

## Structure

- `template.mjml` : Template MJML pur avec toutes les données intégrées
- `build.js` : Script qui compile MJML vers HTML
- `output.html` : HTML généré (prêt à envoyer)

## Installation

```bash
npm install
```

## Utilisation

### Compiler le template

```bash
npm run build
```

Cela compile `template.mjml` en `output.html`.

### Mode développement avec watch

```bash
npm run dev
```

Cela lance :
- Watch sur `template.mjml` (recompile automatiquement)
- Serveur de prévisualisation sur `http://localhost:3000`

### Prévisualiser

```bash
npm run preview
```

## Caractéristiques

✅ **Mobile uniquement** : Largeur fixe 393px, pas de responsive  
✅ **Styles inline maximum** : Tous les styles sont inline sur les éléments MJML  
✅ **MJML pur** : Pas de Handlebars, compilation directe MJML → HTML  
✅ **Simple** : Un seul fichier template à éditer  

## Modifier le template

Éditez directement `template.mjml` :

- **Textes** : Modifiez directement dans le MJML
- **Styles** : Utilisez les attributs inline sur les éléments MJML (font-size, color, padding, etc.)
- **Images** : Modifiez les URLs dans les balises `<mj-image>`
- **Liens** : Modifiez les `href` dans les balises `<mj-button>` et `<a>`

## Structure du template

1. **Hero** : Image mobile avec logo, sous-titre et année
2. **Intro** : Message d'introduction
3. **Stats** : Tableau avec 3 statistiques (15M, 130M, 60 000)
4. **Bouton** : "Voir la retrospective vidéo"
5. **Titre personnalisé** : "Ces chiffres vous donnent le sourire ?"
6. **KPI Cards** : 4 cartes avec statistiques personnalisées
7. **Disclaimer** : Note légale
8. **Section Future** : "Et si 2026 allait encore plus loin ?"
9. **Clôture** : Message de fin avec fond gris
10. **Footer** : Réseaux sociaux, app stores, copyright et liens

## Styles inline

Tous les styles sont définis directement sur les éléments MJML :

```xml
<mj-text
  font-family="Aeonik, Arial, sans-serif"
  font-size="28px"
  line-height="32px"
  color="#08080B"
  padding-bottom="24px"
>
  Texte
</mj-text>
```

## Notes

- Le template est optimisé pour mobile uniquement (393px de largeur)
- Les polices Inter et Aeonik sont chargées via Google Fonts CDN
- Tous les styles sont inline pour une meilleure compatibilité email
