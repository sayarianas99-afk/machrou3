/* =========================================================
   admin.js — Espace administration (démonstration frontend)
   Identifiants démo : admin / admin123
   Ceci N'EST PAS un système d'authentification sécurisé.
   ========================================================= */

(function () {
  const CLE_SESSION = "mm_session_admin";
  const IDENTIFIANT = "admin";
  const MOT_DE_PASSE = "admin123";

  const pageConnexion = document.getElementById("page-connexion");
  const pageDashboard = document.getElementById("page-dashboard");
  const formConnexion = document.getElementById("form-connexion");
  const erreurConnexion = document.getElementById("erreur-connexion");
  const btnDeconnexion = document.getElementById("btn-deconnexion");

  let produits = [];

  function estConnecte() {
    return sessionStorage.getItem(CLE_SESSION) === "1";
  }

  function afficherApp() {
    if (estConnecte()) {
      pageConnexion.style.display = "none";
      pageDashboard.style.display = "flex";
      initDashboard();
    } else {
      pageConnexion.style.display = "flex";
      pageDashboard.style.display = "none";
    }
  }

  formConnexion.addEventListener("submit", (e) => {
    e.preventDefault();
    const utilisateur = document.getElementById("champ-utilisateur").value.trim();
    const motDePasse = document.getElementById("champ-motdepasse").value;
    if (utilisateur === IDENTIFIANT && motDePasse === MOT_DE_PASSE) {
      sessionStorage.setItem(CLE_SESSION, "1");
      erreurConnexion.classList.remove("visible");
      afficherApp();
    } else {
      erreurConnexion.textContent = "Identifiant ou mot de passe incorrect.";
      erreurConnexion.classList.add("visible");
    }
  });

  btnDeconnexion.addEventListener("click", () => {
    sessionStorage.removeItem(CLE_SESSION);
    afficherApp();
  });

  /* ---------- Dashboard ---------- */
  async function initDashboard() {
    produits = await MM.chargerProduits();
    rendreStats();
    rendreTableau();
  }

  function rendreStats() {
    const categories = new Set(produits.map(p => p.categorie));
    const disponibles = produits.filter(p => p.disponible).length;
    const enPromotion = produits.filter(p => p.promotion).length;
    const favoris = MM.obtenirFavoris().length;

    document.getElementById("stats-conteneur").innerHTML = `
      <div class="carte-stat"><div class="valeur">${produits.length}</div><div class="libelle">Produits</div></div>
      <div class="carte-stat"><div class="valeur">${categories.size}</div><div class="libelle">Catégories</div></div>
      <div class="carte-stat"><div class="valeur">${disponibles}</div><div class="libelle">Disponibles</div></div>
      <div class="carte-stat"><div class="valeur">${enPromotion}</div><div class="libelle">En promotion</div></div>
      <div class="carte-stat"><div class="valeur">${favoris}</div><div class="libelle">Favoris (cet appareil)</div></div>
    `;
  }

  function rendreTableau() {
    const corps = document.getElementById("corps-tableau-produits");
    if (produits.length === 0) {
      corps.innerHTML = `<tr><td colspan="6">Aucun produit pour le moment.</td></tr>`;
      return;
    }
    corps.innerHTML = produits.map(p => `
      <tr data-id="${p.id}">
        <td style="display:flex;align-items:center;gap:10px;">
          <img src="${p.image}" alt="">
          <span>${MM.echapper(p.nom)}</span>
        </td>
        <td>${MM.echapper(p.categorie)}</td>
        <td>${MM.formaterPrix(p.prix)}</td>
        <td>${p.stock ?? "—"}</td>
        <td><span class="pastille ${p.promotion ? "oui" : "non"}">${p.promotion ? "Oui" : "Non"}</span></td>
        <td>
          <div class="actions-table">
            <button data-action="modifier">Modifier</button>
            <button data-action="basculer-dispo">${p.disponible ? "Désactiver" : "Activer"}</button>
            <button data-action="basculer-promo">${p.promotion ? "Retirer promo" : "Promotion"}</button>
            <button class="supprimer" data-action="supprimer">Supprimer</button>
          </div>
        </td>
      </tr>
    `).join("");
  }

  document.getElementById("corps-tableau-produits").addEventListener("click", (e) => {
    const tr = e.target.closest("tr[data-id]");
    if (!tr) return;
    const id = Number(tr.dataset.id);
    const produit = produits.find(p => p.id === id);
    const action = e.target.dataset.action;

    if (action === "modifier") ouvrirFormulaire(produit);

    if (action === "basculer-dispo") {
      MM.modifierProduit(id, { disponible: !produit.disponible });
      MM.toast("Disponibilité mise à jour ✓");
      initDashboard();
    }

    if (action === "basculer-promo") {
      const nouvellePromo = !produit.promotion;
      MM.modifierProduit(id, { promotion: nouvellePromo, ancienPrix: nouvellePromo ? (produit.ancienPrix || produit.prix) : produit.ancienPrix });
      MM.toast(nouvellePromo ? "Produit mis en promotion ✓" : "Promotion retirée");
      initDashboard();
    }

    if (action === "supprimer") ouvrirConfirmationSuppression(id, produit.nom);
  });

  /* ---------- Modale ajout / modification ---------- */
  const superposition = document.getElementById("superposition-formulaire");
  const formProduit = document.getElementById("form-produit");
  const titreModale = document.getElementById("titre-modale-produit");

  document.getElementById("btn-ajouter-produit").addEventListener("click", () => ouvrirFormulaire(null));
  document.querySelectorAll("[data-role='fermer-modale']").forEach(btn =>
    btn.addEventListener("click", () => superposition.classList.remove("visible"))
  );

  function ouvrirFormulaire(produit) {
    formProduit.reset();
    titreModale.textContent = produit ? "Modifier le produit" : "Ajouter un produit";
    formProduit.querySelector("button[type='submit']").textContent = produit ? "Enregistrer les modifications" : "Ajouter le produit";
    formProduit.dataset.id = produit ? produit.id : "";
    if (produit) {
      for (const cle of ["nom", "categorie", "descriptionCourte", "description", "prix", "ancienPrix", "unite", "stock", "image", "origine", "badge"]) {
        if (formProduit.elements[cle]) formProduit.elements[cle].value = produit[cle] ?? "";
      }
      formProduit.elements["disponible"].checked = !!produit.disponible;
      formProduit.elements["promotion"].checked = !!produit.promotion;
    } else {
      formProduit.elements["disponible"].checked = true;
      formProduit.elements["image"].value = "images/legumes.jpg";
    }
    superposition.classList.add("visible");
  }

  formProduit.addEventListener("submit", (e) => {
    e.preventDefault();
    const donnees = Object.fromEntries(new FormData(formProduit).entries());
    const objetProduit = {
      nom: donnees.nom.trim(),
      categorie: donnees.categorie,
      descriptionCourte: donnees.descriptionCourte.trim(),
      description: donnees.description.trim(),
      prix: parseFloat(donnees.prix) || 0,
      ancienPrix: donnees.ancienPrix ? parseFloat(donnees.ancienPrix) : null,
      unite: donnees.unite.trim() || "kg",
      stock: parseInt(donnees.stock, 10) || 0,
      image: donnees.image.trim() || "images/legumes.jpg",
      origine: donnees.origine.trim() || "Tunisie",
      badge: donnees.badge.trim(),
      disponible: formProduit.elements["disponible"].checked,
      promotion: formProduit.elements["promotion"].checked,
      elevageCulture: donnees.elevageCulture?.trim() || "",
      qualite: donnees.qualite?.trim() || ""
    };

    const idExistant = formProduit.dataset.id;
    if (idExistant) {
      MM.modifierProduit(Number(idExistant), objetProduit);
      MM.toast("Produit modifié avec succès ✓");
    } else {
      const nouvelId = MM.prochainId(produits);
      MM.ajouterProduitAdmin({ id: nouvelId, ...objetProduit });
      MM.toast("Produit ajouté avec succès ✓");
    }
    superposition.classList.remove("visible");
    initDashboard();
  });

  /* ---------- Suppression avec confirmation ---------- */
  const superpositionSuppression = document.getElementById("superposition-suppression");
  let idASupprimer = null;

  function ouvrirConfirmationSuppression(id, nom) {
    idASupprimer = id;
    document.getElementById("texte-confirmation-suppression").textContent =
      `Êtes-vous sûr de vouloir supprimer « ${nom} » ?`;
    superpositionSuppression.classList.add("visible");
  }

  document.getElementById("btn-annuler-suppression").addEventListener("click", () => {
    superpositionSuppression.classList.remove("visible");
    idASupprimer = null;
  });
  document.getElementById("btn-confirmer-suppression").addEventListener("click", () => {
    if (idASupprimer !== null) {
      MM.supprimerProduit(idASupprimer);
      MM.toast("Produit supprimé");
      initDashboard();
    }
    superpositionSuppression.classList.remove("visible");
    idASupprimer = null;
  });

  afficherApp();
})();
