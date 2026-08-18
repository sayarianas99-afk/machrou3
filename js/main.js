/* =========================================================
   main.js — Fonctions communes à toutes les pages
   Montagne Maghraoui & Partenaires
   ========================================================= */

const MM = (() => {

  const CLES = {
    PANIER: "mm_panier",
    FAVORIS: "mm_favoris",
    PRODUITS_ADMIN: "mm_produits_admin",
    PRODUITS_MODIFS: "mm_produits_modifs",
    PRODUITS_SUPPRIMES: "mm_produits_supprimes",
    SESSION_ADMIN: "mm_session_admin"
  };

  /* ---------- Produits de secours (fallback si fetch impossible, ex: ouverture en file://) ---------- */
  const PRODUITS_SECOURS = [
    { id: 1, nom: "Agneau fermier", categorie: "Agneaux", prix: 32, ancienPrix: 36, unite: "kg", stock: 15, image: "images/agneau.jpg", badge: "Meilleure vente", promotion: true, origine: "Tunisie", elevageCulture: "Élevage en plein air, alimentation naturelle", qualite: "Contrôlée et certifiée fraîcheur", descriptionCourte: "Agneau fermier frais et de qualité.", description: "Agneau élevé localement dans un environnement naturel avec une alimentation soigneusement sélectionnée et un suivi régulier afin de garantir une viande tendre et savoureuse.", disponible: true },
    { id: 2, nom: "Viande bovine", categorie: "Bovins", prix: 38, ancienPrix: null, unite: "kg", stock: 10, image: "images/boeuf.jpg", badge: "Nouveau", promotion: false, origine: "Tunisie", elevageCulture: "Vaches élevées en pâturage naturel", qualite: "Viande fraîche, maturation contrôlée", descriptionCourte: "Viande bovine tendre, issue de nos fermes de montagne.", description: "Viande bovine provenant de bovins élevés en pâturage libre dans la région montagneuse, sans hormones de croissance.", disponible: true },
    { id: 3, nom: "Poulet fermier", categorie: "Poulets", prix: 15, ancienPrix: 18, unite: "kg", stock: 25, image: "images/poulet.jpg", badge: "Meilleure vente", promotion: true, origine: "Tunisie", elevageCulture: "Élevage fermier en plein air", qualite: "Frais du jour, sans antibiotiques", descriptionCourte: "Poulet fermier frais, élevé localement et préparé avec soin.", description: "Poulet fermier élevé en plein air dans nos fermes de montagne, nourri d'une alimentation naturelle.", disponible: true },
    { id: 4, nom: "Œufs frais", categorie: "Œufs", prix: 12, ancienPrix: null, unite: "plateau de 30 œufs", stock: 40, image: "images/oeufs.jpg", badge: "Nouveau", promotion: false, origine: "Tunisie", elevageCulture: "Poules élevées en plein air", qualite: "Ramassage quotidien", descriptionCourte: "Œufs frais provenant de poules élevées dans des conditions naturelles.", description: "Œufs frais pondus par des poules élevées en plein air, ramassés quotidiennement.", disponible: true },
    { id: 5, nom: "Pommes de terre", categorie: "Légumes", prix: 2.5, ancienPrix: null, unite: "kg", stock: 100, image: "images/pommes-de-terre.jpg", badge: "", promotion: false, origine: "Tunisie", elevageCulture: "Culture de saison, sans pesticides intensifs", qualite: "Calibrées et triées à la main", descriptionCourte: "Pommes de terre fraîchement récoltées.", description: "Pommes de terre cultivées dans nos terres de montagne, récoltées à maturité.", disponible: true },
    { id: 6, nom: "Tomates", categorie: "Légumes", prix: 3.2, ancienPrix: 4, unite: "kg", stock: 60, image: "images/tomates.jpg", badge: "Promo", promotion: true, origine: "Tunisie", elevageCulture: "Culture en pleine terre", qualite: "Récoltées à maturité", descriptionCourte: "Tomates juteuses cueillies à maturité.", description: "Tomates cultivées en pleine terre dans la campagne tunisienne, cueillies à maturité.", disponible: true },
    { id: 7, nom: "Poivrons", categorie: "Légumes", prix: 4.5, ancienPrix: null, unite: "kg", stock: 45, image: "images/poivrons.jpg", badge: "", promotion: false, origine: "Tunisie", elevageCulture: "Culture de saison", qualite: "Fraîchement récoltés", descriptionCourte: "Poivrons colorés et croquants.", description: "Poivrons de saison cultivés localement, récoltés frais.", disponible: true },
    { id: 8, nom: "Oignons", categorie: "Légumes", prix: 1.8, ancienPrix: null, unite: "kg", stock: 120, image: "images/oignons.jpg", badge: "", promotion: false, origine: "Tunisie", elevageCulture: "Culture traditionnelle", qualite: "Séchage naturel", descriptionCourte: "Oignons fermes et parfumés.", description: "Oignons cultivés selon des méthodes traditionnelles, séchés naturellement.", disponible: true },
    { id: 9, nom: "Pommes", categorie: "Fruits", prix: 5, ancienPrix: 6, unite: "kg", stock: 50, image: "images/pommes.jpg", badge: "Promo", promotion: true, origine: "Tunisie", elevageCulture: "Vergers de montagne", qualite: "Cueillies à la main", descriptionCourte: "Pommes croquantes des vergers de montagne.", description: "Pommes cultivées dans les vergers de montagne, cueillies à la main à pleine maturité.", disponible: true },
    { id: 10, nom: "Fruits de saison", categorie: "Fruits", prix: 6.5, ancienPrix: null, unite: "kg", stock: 35, image: "images/fruits.jpg", badge: "Nouveau", promotion: false, origine: "Tunisie", elevageCulture: "Culture de saison, vergers familiaux", qualite: "Sélection quotidienne", descriptionCourte: "Assortiment de fruits frais de saison.", description: "Une sélection de fruits de saison provenant de nos vergers familiaux.", disponible: true },
    { id: 11, nom: "Agneau grillades", categorie: "Agneaux", prix: 34, ancienPrix: null, unite: "kg", stock: 8, image: "images/agneau.jpg", badge: "", promotion: false, origine: "Tunisie", elevageCulture: "Élevage en plein air", qualite: "Découpe spéciale grillades", descriptionCourte: "Découpe d'agneau idéale pour les grillades.", description: "Morceaux d'agneau sélectionnés et découpés spécialement pour les grillades.", disponible: true },
    { id: 12, nom: "Veau fermier", categorie: "Bovins", prix: 42, ancienPrix: 46, unite: "kg", stock: 6, image: "images/boeuf.jpg", badge: "Promo", promotion: true, origine: "Tunisie", elevageCulture: "Élevage fermier, alimentation au lait et pâturage", qualite: "Viande tendre et claire", descriptionCourte: "Veau fermier tendre, idéal pour les plats mijotés.", description: "Veau élevé de manière fermière, nourri au lait puis au pâturage naturel.", disponible: false },
    { id: 13, nom: "Bagra Alfa", categorie: "Bovins", prix: 36000, ancienPrix: null, unite: "pièce", stock: 1, image: "images/-99751.jpg", badge: "Toute Option", promotion: false, origine: "Seniyet Maghraoui", elevageCulture: "Srouh serha, 10km au compteur", qualite: "Premier main, 150kg lham safi, 500L hlib/nhar", descriptionCourte: "Bagra alfa mechya 10km srouh serha, 150kg lham safi, boîte auto, 500L hlib/nhar.", description: "Bagra alfa mechya 10km srouh serha fi seniyet maghraoui feha 150kl lham safi hethy okht li jebha ahmed fi 3irsou. Caractéristiques: Âge 1 an et 1 mois, kilométrage 10km, toute option, premier main, blanda avec des taches noires, boîte auto, produit 500L de lait par jour.", disponible: true },
    { id: 14, nom: "Karmouuus", categorie: "Fruits", prix: 15, ancienPrix: 20, unite: "kg (Gajou b 70 DT)", stock: 30, image: "images/figuejerba17082018-00.jpg", badge: "En Promo", promotion: true, origine: "Djerba, Tunisie", elevageCulture: "Karma All Wed Bio", qualite: "Bio 100% naturel", descriptionCourte: "Karmous bio djerbien en promo. Kilo b 15dt, Gajou b 70dt.", description: "Karma all wed bio. Prix en promo: kilo b 15dt ou gajou complet b 70dt en promo.", disponible: true },
    { id: 15, nom: "Batata", categorie: "Légumes", prix: 1, ancienPrix: 1.5, unite: "kg (Gajou b 10 DT)", stock: 100, image: "images/images (1).jpg", badge: "3+1 Blech", promotion: true, origine: "Tunisie", elevageCulture: "Mazrou3a b yed thamina w majmou3a b yed ma athmen", qualite: "Mil 9alb tabi3a 100%", descriptionCourte: "Batata mil 9alb tabi3a. Kilo b 1dt, Gajou b 10dt. 3 gajouwet + 1 raba3 blech!", description: "Batata mil 9alb tabi3a mazrou3a b yed thamina w majmou3a b yed ma athmen. Echriii terbah: tekhou 3 gajouwet raba3 bleechhhh! Prix: gajou b 10dt, kilo b 1dt.", disponible: true },
    { id: 16, nom: "3dham Arbi", categorie: "Œufs", prix: 10, ancienPrix: 12, unite: "plateau (30 œufs)", stock: 50, image: "images/images (2).jpg", badge: "Offre Limoun", promotion: true, origine: "Tunisie", elevageCulture: "Poules fermières arbi", qualite: "Œufs frais du jour", descriptionCourte: "3dham arbi. Hata b 2.300 DT, Platou b 10 DT. 5 platous = 1kg limoun blech!", description: "3dham arbi frais. Prix: hata b 2300 DT, platou b 10 DT en promo. Techri 5 platou andk min 3ana kilou limoun blechhhhhhhhh!", disponible: true },
    { id: 17, nom: "Djej Arbi", categorie: "Poulets", prix: 35, ancienPrix: 40, unite: "pièce (4 pour 100 DT)", stock: 20, image: "images/images (3).jpg", badge: "Tout Option", promotion: true, origine: "Tunisie", elevageCulture: "Nwaklou fih fi salami bheyem", qualite: "M9ater 3alif 3.5kg", descriptionCourte: "Djej arbi 3.5kg tout option. 1 ka3ba b 35DT, 4 b 100DT.", description: "Djej arbi m9ater 3alif nwaklou fih fi salami bheyem karba 3kl w nos tout option yba9ba9 yba3ba3 sa3at yanbah. Prix: 1 ka3ba ala 35dt, 4 ala 100dt.", disponible: true },
    { id: 18, nom: "3alouch Sordi", categorie: "Agneaux", prix: 2475, ancienPrix: null, unite: "pièce", stock: 1, image: "images/images.jpg", badge: "Golf 7", promotion: false, origine: "Hammam Sayala, Tunisie", elevageCulture: "3alif 60kg lham safi, sbeh yofter danet yet3acha chawyaet", qualite: "Mogran, bayoudhi, toute option, ynatah", descriptionCourte: "3alouch sordi 60kg lham safi, toute option. Échange Golf 7.", description: "3alouch 3alif 60kl lham safi andou groun yba3ba3 sbeh yofter danet yet3acha chawyaet sa3at yesken bil codia talbin fih echange b golf 7. Caractéristiques: age 6moin, mogran, bayoudhi min hamem sayala, toute option, ynatah, yba3ba3 yetkayef zatla. Prix: 2475dt bidoun ni9ach.", disponible: true },
    { id: 19, nom: "Pack 1: 3alouch Sordi + 2 Djej + 2 Platous 3dham", categorie: "Agneaux", prix: 2500, ancienPrix: 2615, unite: "pack", stock: 5, image: "images/images.jpg", badge: "Pack Promo", promotion: true, origine: "Hammam Sayala / Tunisie", elevageCulture: "3alouch sordi + 2 djej arbi + 2 platous 3dham blech", qualite: "Qualité supérieure 100% fermier", descriptionCourte: "3alouch Sordi + 2 Djej Arbi b 2500 DT + 2 Platous 3dham BLECH!", description: "Pack 1: 3alouch Sordi 60kg lham safi m3ah 2 djej arbi b 2500 DT w m3ahom 2 platou 3dham arbi blechhhhh!", disponible: true },
    { id: 20, nom: "Pack 2: 3alouch Sordi + 4 Gajouwet Karmous + Sardouk", categorie: "Agneaux", prix: 2650, ancienPrix: 2755, unite: "pack", stock: 5, image: "images/figuejerba17082018-00.jpg", badge: "Pack VIP", promotion: true, origine: "Hammam Sayala / Djerba", elevageCulture: "3alouch sordi + 4 gajouwet karmous + sardouk arbi blech", qualite: "Qualité supérieure 100% bio & fermier", descriptionCourte: "3alouch Sordi + 4 Gajouwet Karmous b 2650 DT + Sardouk Arbi BLECH!", description: "Pack 2: 3alouch Sordi 60kg lham safi m3ah 4 gajouwet karmous b 2650 DT w m3ahom sardouk arbi 3alif blechhhh!", disponible: true }
  ];

  /* ---------- Stockage local (helpers génériques) ---------- */
  function lire(cle, defaut) {
    try {
      const brut = localStorage.getItem(cle);
      return brut ? JSON.parse(brut) : defaut;
    } catch (e) {
      return defaut;
    }
  }
  function ecrire(cle, valeur) {
    try {
      localStorage.setItem(cle, JSON.stringify(valeur));
    } catch (e) { /* stockage indisponible */ }
  }

  /* ---------- Chargement des produits (JSON + fallback + surcharges admin) ---------- */
  async function chargerProduits() {
    let base;
    try {
      const reponse = await fetch("data/produits.json");
      if (!reponse.ok) throw new Error("fichier introuvable");
      base = await reponse.json();
    } catch (e) {
      base = PRODUITS_SECOURS;
    }

    const ajoutes = lire(CLES.PRODUITS_ADMIN, []);
    const modifs = lire(CLES.PRODUITS_MODIFS, {});
    const supprimes = lire(CLES.PRODUITS_SUPPRIMES, []);

    let produits = [...base, ...ajoutes]
      .filter(p => !supprimes.includes(p.id))
      .map(p => modifs[p.id] ? { ...p, ...modifs[p.id] } : p);

    return produits;
  }

  function prochainId(produits) {
    return produits.reduce((max, p) => Math.max(max, p.id), 0) + 1;
  }

  function ajouterProduitAdmin(produit) {
    const liste = lire(CLES.PRODUITS_ADMIN, []);
    liste.push(produit);
    ecrire(CLES.PRODUITS_ADMIN, liste);
  }

  function modifierProduit(id, donnees) {
    const modifs = lire(CLES.PRODUITS_MODIFS, {});
    const ajoutes = lire(CLES.PRODUITS_ADMIN, []);
    const idxAjoute = ajoutes.findIndex(p => p.id === id);
    if (idxAjoute !== -1) {
      ajoutes[idxAjoute] = { ...ajoutes[idxAjoute], ...donnees };
      ecrire(CLES.PRODUITS_ADMIN, ajoutes);
    } else {
      modifs[id] = { ...(modifs[id] || {}), ...donnees };
      ecrire(CLES.PRODUITS_MODIFS, modifs);
    }
  }

  function supprimerProduit(id) {
    const ajoutes = lire(CLES.PRODUITS_ADMIN, []);
    if (ajoutes.some(p => p.id === id)) {
      ecrire(CLES.PRODUITS_ADMIN, ajoutes.filter(p => p.id !== id));
      return;
    }
    const supprimes = lire(CLES.PRODUITS_SUPPRIMES, []);
    if (!supprimes.includes(id)) {
      supprimes.push(id);
      ecrire(CLES.PRODUITS_SUPPRIMES, supprimes);
    }
  }

  /* ---------- Favoris ---------- */
  function obtenirFavoris() { return lire(CLES.FAVORIS, []); }
  function estFavori(id) { return obtenirFavoris().includes(id); }
  function basculerFavori(id) {
    let favoris = obtenirFavoris();
    let ajout;
    if (favoris.includes(id)) {
      favoris = favoris.filter(f => f !== id);
      ajout = false;
    } else {
      favoris.push(id);
      ajout = true;
    }
    ecrire(CLES.FAVORIS, favoris);
    majCompteurs();
    return ajout;
  }
  function retirerFavori(id) {
    ecrire(CLES.FAVORIS, obtenirFavoris().filter(f => f !== id));
    majCompteurs();
  }

  /* ---------- Panier ---------- */
  function obtenirPanier() { return lire(CLES.PANIER, []); }
  function ajouterAuPanier(id, quantite = 1) {
    const panier = obtenirPanier();
    const ligne = panier.find(l => l.id === id);
    if (ligne) ligne.quantite += quantite;
    else panier.push({ id, quantite });
    ecrire(CLES.PANIER, panier);
    majCompteurs();
  }
  function definirQuantitePanier(id, quantite) {
    let panier = obtenirPanier();
    if (quantite <= 0) {
      panier = panier.filter(l => l.id !== id);
    } else {
      const ligne = panier.find(l => l.id === id);
      if (ligne) ligne.quantite = quantite;
    }
    ecrire(CLES.PANIER, panier);
    majCompteurs();
  }
  function retirerDuPanier(id) {
    ecrire(CLES.PANIER, obtenirPanier().filter(l => l.id !== id));
    majCompteurs();
  }
  function viderPanier() {
    ecrire(CLES.PANIER, []);
    majCompteurs();
  }

  function majCompteurs() {
    const totalPanier = obtenirPanier().reduce((s, l) => s + l.quantite, 0);
    const totalFavoris = obtenirFavoris().length;
    document.querySelectorAll("[data-compteur-panier]").forEach(el => {
      el.textContent = totalPanier;
      el.style.display = totalPanier > 0 ? "flex" : "none";
    });
    document.querySelectorAll("[data-compteur-favoris]").forEach(el => {
      el.textContent = totalFavoris;
      el.style.display = totalFavoris > 0 ? "flex" : "none";
    });
  }

  /* ---------- Toasts ---------- */
  function toast(message, type = "succes") {
    let zone = document.querySelector(".zone-toasts");
    if (!zone) {
      zone = document.createElement("div");
      zone.className = "zone-toasts";
      document.body.appendChild(zone);
    }
    const el = document.createElement("div");
    el.className = "toast" + (type === "erreur" ? " erreur" : "");
    el.textContent = message;
    zone.appendChild(el);
    setTimeout(() => el.remove(), 2800);
  }

  /* ---------- Utilitaires d'affichage ---------- */
  function formaterPrix(nombre) {
    const n = Number(nombre);
    const texte = Number.isInteger(n) ? n.toString() : n.toFixed(2).replace(/\.00$/, "");
    return `${texte} DT`;
  }

  function echapper(texte) {
    const div = document.createElement("div");
    div.textContent = texte ?? "";
    return div.innerHTML;
  }

  const EMOJIS_CATEGORIES = {
    "Agneaux": "🐑", "Bovins": "🐄", "Poulets": "🐔",
    "Œufs": "🥚", "Légumes": "🥬", "Fruits": "🍎"
  };

  /* ---------- Carte produit (HTML réutilisable) ---------- */
  function carteProduitHTML(p) {
    const favori = estFavori(p.id);
    const badge = p.promotion ? "Promo" : (p.badge || "");
    const classeBadge = p.promotion ? "badge badge--promo" : (p.badge === "Meilleure vente" ? "badge badge--doree" : "badge");
    return `
    <article class="carte-produit" data-id="${p.id}">
      <div class="carte-produit__media">
        <a href="produit.html?id=${p.id}">
          <img src="${p.image}" alt="${echapper(p.nom)}" loading="lazy">
        </a>
        ${badge ? `<span class="${classeBadge}">${echapper(badge)}</span>` : ""}
        ${!p.disponible ? `<div class="badge-indispo">Indisponible</div>` : ""}
        <button class="bouton-favori ${favori ? "actif" : ""}" data-action="favori" data-id="${p.id}" aria-label="Ajouter aux favoris">${favori ? "❤️" : "🤍"}</button>
      </div>
      <div class="carte-produit__corps">
        <span class="carte-produit__categorie">${echapper(p.categorie)}</span>
        <h3 class="carte-produit__nom"><a href="produit.html?id=${p.id}">${echapper(p.nom)}</a></h3>
        <p class="carte-produit__desc">${echapper(p.descriptionCourte)}</p>
        <div class="carte-produit__prix">
          <span class="prix-actuel">${formaterPrix(p.prix)}</span>
          ${p.ancienPrix ? `<span class="prix-ancien">${formaterPrix(p.ancienPrix)}</span>` : ""}
          <span class="prix-unite">/ ${echapper(p.unite)}</span>
        </div>
        <div class="carte-produit__actions">
          <a class="btn btn-contour-sombre btn-petit" href="produit.html?id=${p.id}">Voir détails</a>
          <button class="btn btn-primaire btn-petit" data-action="panier" data-id="${p.id}" ${!p.disponible ? "disabled" : ""}>🛒 Ajouter</button>
        </div>
      </div>
    </article>`;
  }

  /* ---------- Délégation d'événements pour cartes produits ---------- */
  function activerActionsProduits(conteneur, produitsRef) {
    conteneur.addEventListener("click", (e) => {
      const btnFavori = e.target.closest("[data-action='favori']");
      const btnPanier = e.target.closest("[data-action='panier']");
      if (btnFavori) {
        const id = Number(btnFavori.dataset.id);
        const ajout = basculerFavori(id);
        btnFavori.classList.toggle("actif", ajout);
        btnFavori.textContent = ajout ? "❤️" : "🤍";
        toast(ajout ? "Produit ajouté aux favoris ❤️" : "Produit retiré des favoris");
      }
      if (btnPanier) {
        const id = Number(btnPanier.dataset.id);
        ajouterAuPanier(id, 1);
        toast("Produit ajouté au panier ✓");
      }
    });
  }

  /* ---------- Menu mobile & en-tête ---------- */
  function initEntete() {
    const btnMenu = document.querySelector(".btn-menu");
    const navMobile = document.querySelector(".nav-mobile");
    const btnFermer = document.querySelector(".nav-mobile__fermer");
    if (btnMenu && navMobile) {
      btnMenu.addEventListener("click", () => navMobile.classList.add("ouvert"));
    }
    if (btnFermer && navMobile) {
      btnFermer.addEventListener("click", () => navMobile.classList.remove("ouvert"));
    }
    if (navMobile) {
      navMobile.querySelectorAll("a").forEach(a => a.addEventListener("click", () => navMobile.classList.remove("ouvert")));
    }
    majCompteurs();

    // Marquer le lien actif
    const page = location.pathname.split("/").pop() || "index.html";
    document.querySelectorAll(".nav-principale a, .nav-mobile a").forEach(a => {
      if (a.getAttribute("href") === page) a.classList.add("actif");
    });
  }

  document.addEventListener("DOMContentLoaded", initEntete);

  return {
    CLES, lire, ecrire, chargerProduits, prochainId,
    ajouterProduitAdmin, modifierProduit, supprimerProduit,
    obtenirFavoris, estFavori, basculerFavori, retirerFavori,
    obtenirPanier, ajouterAuPanier, definirQuantitePanier, retirerDuPanier, viderPanier,
    majCompteurs, toast, formaterPrix, echapper, EMOJIS_CATEGORIES,
    carteProduitHTML, activerActionsProduits
  };
})();
