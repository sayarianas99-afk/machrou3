/* =========================================================
   panier.js — Page "Panier"
   ========================================================= */

(async function () {
  const zoneLignes = document.getElementById("lignes-panier");
  const etatVide = document.getElementById("etat-vide-panier");
  const zoneRecap = document.getElementById("recap-panier");
  const elSousTotal = document.getElementById("sous-total");
  const elLivraison = document.getElementById("livraison");
  const elTotal = document.getElementById("total-panier");
  const btnCommander = document.getElementById("btn-commander");
  const superposition = document.getElementById("superposition-commande");

  const FRAIS_LIVRAISON = 7;
  const produits = await MM.chargerProduits();

  function rendu() {
    const lignes = MM.obtenirPanier()
      .map(l => ({ ...l, produit: produits.find(p => p.id === l.id) }))
      .filter(l => l.produit);

    if (lignes.length === 0) {
      zoneLignes.innerHTML = "";
      etatVide.style.display = "block";
      zoneRecap.style.display = "none";
      return;
    }
    etatVide.style.display = "none";
    zoneRecap.style.display = "block";

    zoneLignes.innerHTML = lignes.map(l => `
      <div class="ligne-panier" data-id="${l.id}">
        <img src="${l.produit.image}" alt="${MM.echapper(l.produit.nom)}">
        <div class="ligne-panier__infos">
          <h4>${MM.echapper(l.produit.nom)}</h4>
          <span class="prix-unite">${MM.formaterPrix(l.produit.prix)} / ${MM.echapper(l.produit.unite)}</span>
        </div>
        <div class="stepper">
          <button type="button" data-role="moins">−</button>
          <span>${l.quantite}</span>
          <button type="button" data-role="plus">+</button>
        </div>
        <strong>${MM.formaterPrix(l.produit.prix * l.quantite)}</strong>
        <button class="btn btn-petit btn-danger" data-role="supprimer">Supprimer</button>
      </div>
    `).join("");

    const sousTotal = lignes.reduce((s, l) => s + l.produit.prix * l.quantite, 0);
    const total = sousTotal + (sousTotal > 0 ? FRAIS_LIVRAISON : 0);
    elSousTotal.textContent = MM.formaterPrix(sousTotal);
    elLivraison.textContent = MM.formaterPrix(FRAIS_LIVRAISON);
    elTotal.textContent = MM.formaterPrix(total);
  }

  zoneLignes.addEventListener("click", (e) => {
    const ligne = e.target.closest(".ligne-panier");
    if (!ligne) return;
    const id = Number(ligne.dataset.id);
    const panierActuel = MM.obtenirPanier();
    const courant = panierActuel.find(l => l.id === id);
    if (e.target.closest("[data-role='plus']")) {
      MM.definirQuantitePanier(id, (courant?.quantite || 0) + 1);
      rendu();
    } else if (e.target.closest("[data-role='moins']")) {
      MM.definirQuantitePanier(id, (courant?.quantite || 1) - 1);
      rendu();
    } else if (e.target.closest("[data-role='supprimer']")) {
      MM.retirerDuPanier(id);
      MM.toast("Produit supprimé du panier");
      rendu();
    }
  });

  btnCommander?.addEventListener("click", () => {
    if (MM.obtenirPanier().length === 0) return;
    superposition.classList.add("visible");
    document.getElementById("contenu-confirmation-commande").innerHTML = `
      <h3>Demande enregistrée</h3>
      <p>Votre demande de commande a été enregistrée. Notre équipe vous contactera pour confirmer la commande.</p>
      <a class="btn btn-primaire btn-bloc" href="contact.html">Aller à la page contact</a>
      <button class="btn btn-contour-sombre btn-bloc mt-40" data-role="fermer-confirmation">Fermer</button>
    `;
    document.querySelector("[data-role='fermer-confirmation']").addEventListener("click", () => {
      superposition.classList.remove("visible");
      MM.viderPanier();
      rendu();
    });
  });

  superposition?.addEventListener("click", (e) => {
    if (e.target.id === "superposition-commande") e.target.classList.remove("visible");
  });

  rendu();
})();
