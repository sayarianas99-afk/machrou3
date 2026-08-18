/* =========================================================
   produit-details.js — Page détail d'un produit
   ========================================================= */

(async function () {
  const zone = document.getElementById("zone-detail-produit");
  const params = new URLSearchParams(location.search);
  const id = Number(params.get("id"));

  const produits = await MM.chargerProduits();
  const produit = produits.find(p => p.id === id);

  if (!produit) {
    zone.innerHTML = `
      <div class="etat-vide">
        <span class="emoji">🔎</span>
        <h3>Produit introuvable</h3>
        <p>Ce produit n'existe pas ou a été retiré du catalogue.</p>
        <a class="btn btn-primaire" href="produits.html">Voir tous les produits</a>
      </div>`;
    return;
  }

  document.title = `${produit.nom} — Montagne Maghraoui & Partenaires`;

  let quantite = 1;

  function rendu() {
    const favori = MM.estFavori(produit.id);
    zone.innerHTML = `
      <nav class="fil-ariane"><a href="index.html">Accueil</a> / <a href="produits.html">Produits</a> / ${MM.echapper(produit.nom)}</nav>
      <div class="detail-produit">
        <div class="detail-produit__media">
          <img src="${produit.image}" alt="${MM.echapper(produit.nom)}">
        </div>
        <div class="detail-produit__infos">
          <span class="carte-produit__categorie">${MM.echapper(produit.categorie)}</span>
          <h1>${MM.echapper(produit.nom)}</h1>
          <div class="detail-produit__disponibilite ${produit.disponible ? "" : "indispo"}">
            ${produit.disponible ? "✓ En stock" : "✕ Indisponible"}
          </div>
          <div class="detail-produit__prix">
            <span class="prix-actuel">${MM.formaterPrix(produit.prix)}</span>
            ${produit.ancienPrix ? `<span class="prix-ancien">${MM.formaterPrix(produit.ancienPrix)}</span>` : ""}
            <span class="prix-unite">/ ${MM.echapper(produit.unite)}</span>
          </div>
          <p>${MM.echapper(produit.description)}</p>

          <div class="tableau-infos">
            <div><strong>Origine</strong>${MM.echapper(produit.origine || "—")}</div>
            <div><strong>Mode d'élevage / culture</strong>${MM.echapper(produit.elevageCulture || "—")}</div>
            <div><strong>Qualité</strong>${MM.echapper(produit.qualite || "—")}</div>
            <div><strong>Poids / quantité</strong>${MM.echapper(produit.unite || "—")}</div>
          </div>

          <ul class="liste-infos">
            <li>Élevage / culture local${produit.categorie === "Légumes" || produit.categorie === "Fruits" ? "e" : ""}</li>
            <li>Produit frais</li>
            <li>Origine tunisienne</li>
            <li>Qualité contrôlée</li>
          </ul>

          <div class="detail-produit__actions">
            <div class="stepper">
              <button type="button" data-role="moins" aria-label="Diminuer la quantité">−</button>
              <span data-role="quantite">1</span>
              <button type="button" data-role="plus" aria-label="Augmenter la quantité">+</button>
            </div>
            <button class="btn btn-primaire" data-role="ajouter-panier" ${!produit.disponible ? "disabled" : ""}>🛒 Ajouter au panier</button>
            <button class="btn btn-contour-sombre" data-role="favori">${favori ? "❤️ Sauvegardé" : "🤍 Sauvegarder"}</button>
          </div>
        </div>
      </div>`;

    const spanQte = zone.querySelector("[data-role='quantite']");
    zone.querySelector("[data-role='moins']").addEventListener("click", () => {
      quantite = Math.max(1, quantite - 1);
      spanQte.textContent = quantite;
    });
    zone.querySelector("[data-role='plus']").addEventListener("click", () => {
      quantite += 1;
      spanQte.textContent = quantite;
    });
    zone.querySelector("[data-role='ajouter-panier']").addEventListener("click", () => {
      MM.ajouterAuPanier(produit.id, quantite);
      MM.toast("Produit ajouté au panier ✓");
    });
    zone.querySelector("[data-role='favori']").addEventListener("click", (e) => {
      const ajout = MM.basculerFavori(produit.id);
      e.target.textContent = ajout ? "❤️ Sauvegardé" : "🤍 Sauvegarder";
      MM.toast(ajout ? "Produit ajouté aux favoris ❤️" : "Produit retiré des favoris");
    });
  }

  rendu();

  // Produits similaires
  const zoneSimilaires = document.getElementById("grille-similaires");
  if (zoneSimilaires) {
    const similaires = produits.filter(p => p.categorie === produit.categorie && p.id !== produit.id).slice(0, 4);
    if (similaires.length) {
      zoneSimilaires.innerHTML = similaires.map(MM.carteProduitHTML).join("");
      MM.activerActionsProduits(zoneSimilaires, produits);
    } else {
      document.getElementById("section-similaires").style.display = "none";
    }
  }
})();
