# Portfolio de Raphael Rajarison

Site vanilla **HTML / CSS / JavaScript** (aucune installation ni build nécessaire) : dark/light mode, 5 langues (Malagasy, Français, English, Deutsch, Español) traduites en direct, animations au scroll, marquee de rôles, filtres de projets, modale de détails, et bien plus.

## ✅ Contenu aligné sur le CV final

- **Photo** : `assets/img/profile.png` (costume bleu, fond blanc, qualité d'origine inchangée), utilisée dans le hero et « À propos ».
- **CV** : `assets/cv/CV_RAJARISON_Raphael.pdf` = dernière version du CV fournie.
- **Expérience** (5) et **formation** (4) : deux chronologies dans la section « Parcours », traduites en mg / fr / en / de / es.
- **Compétences** : Développement web (HTML/CSS/Bootstrap, JavaScript/jQuery, React/Vue.js, PHP/Laravel, WordPress, Node.js), Bases de données & langages (SQL/MySQL, MongoDB/PostgreSQL, Python, C/C++/C#), Design/Multimédia.
- **Projets** (15) : 2 projets de stage web (Gestion universitaire, Inventaire des machines — React/Laravel/PHP/MySQL), 1 site de stage (réparation automobile), et 12 projets personnels (Wine-Shop, restaurant, guitares, artisanat malgache, cosmétiques, site entreprise, architecture, jardin d'enfants, garage auto, commande de restaurant, site personnel, agence de voyage M'Life Compagnie). 13 des 15 cartes utilisent une vraie capture d'écran du site (non retouchée) comme vignette ; les 2 restantes (site de réparation Novion, site vitrine personnel) n'ont pas encore de capture. Chaque carte porte les bons tags technologiques (utilisés pour le filtre de la page Projets).
- **Réseaux sociaux** : GitHub, LinkedIn et Facebook pointent vers les vrais profils (section réseaux, contact, footer).

## 🖱️ Interactions récentes

- Le badge "Stage" / "Projet personnel" est désormais vert (visible sur fond clair ou sombre).
- Les cartes projets s'affichent toujours immédiatement (elles ne dépendent plus du défilement pour apparaître).
- Cliquer sur la capture d'écran d'un projet ouvre la même fenêtre de détails que le bouton "Détails", avec la capture affichée en grand en haut de la fenêtre.

## 📂 Structure

```
index.html
css/style.css          → tous les styles + thème clair/sombre + nouveaux composants
js/main.js             → thème, menu, scroll reveal, marquee, filtres projets, modale, compteurs
js/i18n.js             → moteur de traduction (lit js/i18n-data.js)
js/i18n-data.js        → dictionnaire des 5 langues (généré depuis locales/*.json)
js/projects-data.js    → tags + liens (démo/code) de chaque projet, utilisés par la modale
locales/*.json         → source lisible des traductions (mg, fr, en, de, es)
assets/cv/             → CV PDF téléchargeable (par défaut, à remplacer)
```

## ✏️ Modifier le contenu

Tout le texte visible passe par `locales/*.json` (sauf le nom). Après modification, régénère `js/i18n-data.js` (commande ci-dessous). Les tags des projets se trouvent dans `js/projects-data.js` et dans l'attribut `data-tags` de chaque `.project-card` de `index.html`.

### Régénérer js/i18n-data.js après avoir modifié les fichiers locales/*.json

Avec Python 3 installé :
```bash
python3 -c "
import json
langs = ['mg','fr','en','de','es']
data = {l: json.load(open(f'locales/{l}.json', encoding='utf-8')) for l in langs}
with open('js/i18n-data.js','w',encoding='utf-8') as f:
    f.write('window.I18N = ' + json.dumps(data, ensure_ascii=False, indent=2) + ';\n')
"
```

## 🎛️ Fonctionnalités principales

- **Dark / Light mode** avec mémorisation du choix (localStorage)
- **5 langues** commutables instantanément, sans recharger la page
- **Marquee** de rôles qui défile en continu sous le hero
- **Filtres de projets** par technologie + barre de recherche en direct
- **Modale « Détails »** par projet : description longue, points clés, stack technique
- **Compteurs animés** dans la section « Parcours en chiffres »
- **Flèches de défilement** (haut / bas) flottantes
- Sections : Hero, À propos, Centres d'intérêt, Parcours en chiffres, Compétences, Outils, Langues, Projets, Parcours académique, Réseaux sociaux, Appel à l'action, Contact, Footer complet

## 🚀 Déploiement

Ce site est 100 % statique : aucune étape de build. Tu peux :
- Glisser-déposer le dossier sur **Netlify** (netlify.com/drop) ou **Vercel**.
- L'ouvrir directement dans un navigateur (`index.html`) pour tester en local.

## 🎨 Inspirations

Le design combine des idées prises sur plusieurs portfolios de référence (dégradé violet façon Mitia RJ, cartes de compétences et grille d'outils, cartes de projets avec badges et filtres, chronologie, sections chiffres/langues/réseaux sociaux, footer riche) — appliquées à une identité originale.
