/* =========================================================
   offres.js — Page "Nos offres & packs"
   ========================================================= */

const PACKS = [
  {
    id: "pack-sordi-djej",
    nom: "Pack 1: 3alouch Sordi & Djej Arbi",
    badge: "EXCLUSIF",
    contenu: [
      "1 3alouch Sordi (60kg lham safi, toute option)",
      "2 Djej Arbi m9ater 3alif",
      "🎁 BONUS : 2 Platous 3dham Arbi BLECHHHHH !"
    ],
    prixNormal: 2615,
    prixPromo: 2500
  },
  {
    id: "pack-sordi-karmous",
    nom: "Pack 2: 3alouch Sordi & Karmous",
    badge: "SUPER PACK",
    contenu: [
      "1 3alouch Sordi (60kg lham safi, toute option)",
      "4 Gajouwet Karmous All Wed Bio",
      "🎁 BONUS : 1 Sardouk Arbi 3alif BLECHHHHH !"
    ],
    prixNormal: 2755,
    prixPromo: 2650
  },
  {
    id: "pack-famille",
    nom: "Pack Famille",
    badge: "-18%",
    contenu: ["2 kg de viande", "1 poulet fermier", "1 plateau d'œufs", "2 kg de légumes de saison"],
    prixNormal: 120,
    prixPromo: 99
  },
  {
    id: "pack-ferme",
    nom: "Pack Ferme",
    badge: "-21%",
    contenu: ["1 poulet fermier", "Œufs frais", "Légumes de saison", "Fruits de saison"],
    prixNormal: 75,
    prixPromo: 59
  },
  {
    id: "pack-ramadan",
    nom: "Pack Ramadan",
    badge: "OFFRE LIMITÉE",
    contenu: ["Viande", "Poulet fermier", "Œufs frais", "Légumes de saison"],
    prixNormal: null,
    prixPromo: 149
  }
];

(function () {
  const grille = document.getElementById("grille-offres");

  grille.innerHTML = PACKS.map(pack => `
    <div class="carte-offre" data-id="${pack.id}">
      <span class="badge badge--doree">${MM.echapper(pack.badge)}</span>
      <h3>${MM.echapper(pack.nom)}</h3>
      <ul>
        ${pack.contenu.map(item => `<li>${MM.echapper(item)}</li>`).join("")}
      </ul>
      <div class="carte-offre__prix">
        <span class="prix-actuel">${MM.formaterPrix(pack.prixPromo)}</span>
        ${pack.prixNormal ? `<span class="prix-ancien">${MM.formaterPrix(pack.prixNormal)}</span>` : ""}
      </div>
      <button class="btn btn-doree btn-bloc" data-action="commander-pack" data-id="${pack.id}">Commander ce pack</button>
    </div>
  `).join("");

  grille.addEventListener("click", (e) => {
    const btn = e.target.closest("[data-action='commander-pack']");
    if (!btn) return;
    const pack = PACKS.find(p => p.id === btn.dataset.id);
    ouvrirConfirmation(pack);
  });

  function ouvrirConfirmation(pack) {
    const superposition = document.getElementById("superposition-commande");
    const corps = document.getElementById("contenu-confirmation-commande");
    corps.innerHTML = `
      <h3>Demande enregistrée</h3>
      <p>Votre demande de commande pour le <strong>${MM.echapper(pack.nom)}</strong> a été enregistrée. Notre équipe vous contactera pour confirmer la commande.</p>
      <a class="btn btn-primaire btn-bloc" href="contact.html">Aller à la page contact</a>
      <button class="btn btn-contour-sombre btn-bloc mt-40" data-role="fermer-confirmation">Fermer</button>
    `;
    superposition.classList.add("visible");
    corps.querySelector("[data-role='fermer-confirmation']").addEventListener("click", () => {
      superposition.classList.remove("visible");
    });
  }

  document.getElementById("superposition-commande")?.addEventListener("click", (e) => {
    if (e.target.id === "superposition-commande") e.target.classList.remove("visible");
  });
})();
