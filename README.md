# dailySort

Petite application web pour désigner **qui commence** lors d'une réunion. Chaque participant est représenté par une carte à jouer portant son nom. Au clic, les cartes se mélangent (animation) et une carte est tirée au hasard.

HTML / CSS / JS vanilla, sans dépendance ni build.

## Fonctionnalités

- Ajouter / retirer des participants
- Une carte par participant, face cachée
- Bouton « Mélanger & piocher » : animation de battage puis tirage au sort
- La carte gagnante se retourne et s'illumine → « X commence ! »
- Liste des participants persistée via `localStorage`
- Respect de `prefers-reduced-motion`

## Lancer le projet

Ouvrir `index.html` dans un navigateur, ou servir le dossier :

```bash
python3 -m http.server 8000
```

Puis ouvrir http://localhost:8000

## Structure

```
dailySort/
├── index.html
├── css/style.css
└── js/app.js
```
