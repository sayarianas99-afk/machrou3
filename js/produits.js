/* =========================================================
   produits.js — Page "Tous nos produits" : recherche, filtres, tri
   ========================================================= */

(async function () {
  const grille = document.getElementById("grille-produits");
  const champRecherche = document.getElementById("recherche-produit");
  const selectTri = document.getElementById("tri-produits");
  const puces = document.querySelectorAll(".puce[data-categorie]");
  const etatVide = document.getElementById("etat-vide");
  const compteurResultats = document.getElementById("compteur-resultats");

  let tousLesProduits = [];
  let categorieActive = "toutes";

  const params = new URLSearchParams(location.search);
  if (params.get("categorie")) categorieActive = params.get("categorie");

  try {
    tousLesProduits = await MM.chargerProduits();
  } catch (e) {
    MM.toast("Impossible de charger les produits.", "erreur");
  }

  function appliquerFiltres() {
    const terme = (champRecherche.value || "").trim().toLowerCase();
    let resultat = tousLesProduits.filter(p => {
      const okCategorie = categorieActive === "toutes" || p.categorie === categorieActive;
      const okRecherche = !terme ||
        p.nom.toLowerCase().includes(terme) ||
        p.categorie.toLowerCase().includes(terme) ||
        (p.description || "").toLowerCase().includes(terme) ||
        (p.descriptionCourte || "").toLowerCase().includes(terme);
      return okCategorie && okRecherche;
    });

    switch (selectTri.value) {
      case "prix-asc": resultat.sort((a, b) => a.prix - b.prix); break;
      case "prix-desc": resultat.sort((a, b) => b.prix - a.prix); break;
      case "nouveautes": resultat = resultat.filter(p => p.badge === "Nouveau").concat(resultat.filter(p => p.badge !== "Nouveau")); break;
      case "populaires": resultat = resultat.filter(p => p.badge === "Meilleure vente").concat(resultat.filter(p => p.badge !== "Meilleure vente")); break;
      default: break;
    }

    afficher(resultat);
  }

  function afficher(liste) {
    compteurResultats.textContent = `${liste.length} produit${liste.length > 1 ? "s" : ""}`;
    if (liste.length === 0) {
      grille.innerHTML = "";
      etatVide.style.display = "block";
      return;
    }
    etatVide.style.display = "none";
    grille.innerHTML = liste.map(MM.carteProduitHTML).join("");
  }

  puces.forEach(p => p.addEventListener("click", () => {
    puces.forEach(x => x.classList.remove("actif"));
    p.classList.add("actif");
    categorieActive = p.dataset.categorie;
    appliquerFiltres();
  }));
  puces.forEach(p => { if (p.dataset.categorie === categorieActive) { puces.forEach(x=>x.classList.remove("actif")); p.classList.add("actif"); } });

  champRecherche.addEventListener("input", appliquerFiltres);
  selectTri.addEventListener("change", appliquerFiltres);

  MM.activerActionsProduits(grille, tousLesProduits);
  appliquerFiltres();
})();
