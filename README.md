# Montagne Maghraoui & Partenaires — Site e-commerce statique

Site vitrine et catalogue produits pour une entreprise tunisienne vendant des produits agricoles et naturels (agneaux, bovins, poulets, œufs, légumes, fruits). Site 100 % statique : HTML5, CSS3, JavaScript Vanilla, JSON, LocalStorage. Aucun backend, aucun serveur, aucun paiement réel.

## 1. Lancer le site

Aucune installation n'est nécessaire.

- **Option simple** : double-cliquez sur `index.html` pour l'ouvrir directement dans votre navigateur (`file://…`). Le site prévoit un jeu de données de secours intégré dans `js/main.js` si le navigateur bloque le chargement de `data/produits.json` en local.
- **Option recommandée** : lancez un petit serveur local pour un fonctionnement optimal (charge le vrai fichier JSON) :
  ```bash
  # depuis le dossier du projet
  python3 -m http.server 8000
  # puis ouvrez http://localhost:8000
  ```

## 2. Structure du projet

```
montagne-maghraoui/
├── index.html          Page d'accueil
├── produits.html        Catalogue complet (recherche, filtres, tri)
├── produit.html          Fiche produit détaillée (?id=...)
├── offres.html            Packs et offres promotionnelles
├── favoris.html            Produits sauvegardés (❤️)
├── panier.html              Panier d'achat (démonstration)
├── apropos.html               Présentation de l'entreprise et ses valeurs
├── contact.html                 Formulaire et coordonnées
├── admin.html                     Espace d'administration (démo)
│
├── css/
│   ├── style.css        Design system (couleurs, typographie, composants)
│   ├── responsive.css   Adaptations mobile / tablette / desktop
│   └── admin.css        Styles de l'espace admin
│
├── js/
│   ├── main.js             Fonctions communes (données, panier, favoris, toasts)
│   ├── produits.js         Logique de la page catalogue
│   ├── produit-details.js  Logique de la fiche produit
│   ├── favoris.js          Logique de la page favoris
│   ├── offres.js           Logique des packs et offres
│   ├── panier.js           Logique du panier
│   └── admin.js            Logique de l'espace admin
│
├── data/
│   └── produits.json    Données des produits (12 produits de démonstration)
│
├── images/               Images placeholder générées (à remplacer par vos photos)
└── README.md
```

> Remarque : deux pages (`apropos.html` et `panier.html`) ont été ajoutées en plus de la liste de fichiers d'origine, car le header et les sections « À propos » et « Panier » du cahier des charges les nécessitent pour fonctionner (liens de navigation, bouton panier, page de commande).

## 3. Modifier les produits

Deux façons de modifier le catalogue :

1. **Fichier JSON** (recommandé pour les données de base) : éditez `data/produits.json`. Chaque produit suit cette structure :
   ```json
   {
     "id": 1,
     "nom": "Agneau fermier",
     "categorie": "Agneaux",
     "prix": 32,
     "ancienPrix": 36,
     "unite": "kg",
     "stock": 15,
     "image": "images/agneau.jpg",
     "badge": "Meilleure vente",
     "promotion": true,
     "origine": "Tunisie",
     "descriptionCourte": "...",
     "description": "...",
     "disponible": true
   }
   ```
2. **Espace Admin** : ajoutez, modifiez ou supprimez des produits depuis le tableau de bord (voir ci-dessous). Ces changements sont stockés dans le `localStorage` du navigateur et se combinent avec le fichier JSON — ils ne modifient pas le fichier `produits.json` lui-même.

## 4. Utiliser l'Espace Admin

- Ouvrez `admin.html` ou cliquez sur « Espace Admin » dans le menu.
- Identifiants de démonstration :
  - **Utilisateur** : `admin`
  - **Mot de passe** : `admin123`
- Depuis le tableau de bord vous pouvez : voir les statistiques du catalogue, ajouter un produit, le modifier, l'activer/désactiver, le mettre en promotion ou le supprimer (avec confirmation).

⚠️ **Important** : ce système de connexion est une démonstration purement frontend (aucune vérification côté serveur). Il ne doit **jamais** être utilisé tel quel pour un site commercial réel. Une vraie mise en production nécessiterait un backend sécurisé, une authentification robuste (hachage des mots de passe, sessions serveur, HTTPS, etc.) et une base de données.

## 5. Changer les images

Remplacez simplement les fichiers dans le dossier `images/` en conservant les mêmes noms (`agneau.jpg`, `poulet.jpg`, `hero.jpg`, `logo.png`, etc.), ou ajoutez de nouvelles images et mettez à jour le champ `"image"` correspondant dans `data/produits.json` ou dans le formulaire de l'espace Admin. Les images fournies dans ce projet sont des **placeholders générés automatiquement** (illustrations simples aux couleurs du site) destinés à être remplacés par de vraies photographies des produits.

## 6. Modifier les offres et packs

Les packs affichés sur `offres.html` sont définis directement dans `js/offres.js`, dans la constante `PACKS` en haut du fichier. Vous pouvez modifier le nom, le contenu, le badge et les prix de chaque pack, ou en ajouter de nouveaux en suivant le même format.

## 7. Fonctionnement du panier et des favoris

Le panier (`panier.html`) et les favoris (`favoris.html`) utilisent le `localStorage` du navigateur : les données restent propres à chaque appareil/navigateur et ne sont pas partagées entre visiteurs. Le bouton « Commander » du panier et des offres n'envoie pas réellement de commande (site statique, sans backend) : il affiche un message de confirmation invitant le client à être contacté par l'équipe, comme précisé dans le cahier des charges.

## 8. Limites à connaître

- Aucun paiement réel n'est traité.
- L'espace Admin n'est pas sécurisé (démonstration uniquement).
- Les données ajoutées/modifiées depuis l'Admin sont stockées en local dans le navigateur utilisé — elles ne sont pas visibles par les autres visiteurs et disparaissent si le `localStorage` est vidé.

Bon développement ! 🌿
