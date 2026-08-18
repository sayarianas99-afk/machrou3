/* =========================================================
   favoris.js — Page "Mes produits sauvegardés"
   ========================================================= */

(async function () {
  const grille = document.getElementById("grille-favoris");
  const etatVide = document.getElementById("etat-vide-favoris");

  const produits = await MM.chargerProduits();

  function rendu() {
    const idsFavoris = MM.obtenirFavoris();
    const favoris = produits.filter(p => idsFavoris.includes(p.id));

    if (favoris.length === 0) {
      grille.innerHTML = "";
      etatVide.style.display = "block";
      return;
    }
    etatVide.style.display = "none";
    grille.innerHTML = favoris.map(MM.carteProduitHTML).join("");
  }

  grille.addEventListener("click", (e) => {
    const btnFavori = e.target.closest("[data-action='favori']");
    const btnPanier = e.target.closest("[data-action='panier']");
    if (btnFavori) {
      const id = Number(btnFavori.dataset.id);
      MM.retirerFavori(id);
      MM.toast("Produit supprimé des favoris");
      rendu();
    }
    if (btnPanier) {
      const id = Number(btnPanier.dataset.id);
      MM.ajouterAuPanier(id, 1);
      MM.toast("Produit ajouté au panier ✓");
    }
  });

  rendu();
})();
