import React, { useState, useEffect } from "react";

// NOTRE STRUCTURE DE DONNÉES SUR MESURE
const MENU_STRUCTURE = {
  "Arms": {
    nomAffiche: "Bras (Arms)",
    sousCategories: [
      { id: "all", nom: "Tous les bras", requetes: ["upper arms", "lower arms"] },
      { id: "upper arms", nom: "Haut des bras (Biceps/Triceps)", requetes: ["upper arms"] },
      { id: "lower arms", nom: "Avant-bras", requetes: ["lower arms"] }
    ]
  },
  "Legs": {
    nomAffiche: "Jambes (Legs)",
    sousCategories: [
      { id: "all", nom: "Toutes les jambes", requetes: ["upper legs", "lower legs"] },
      { id: "upper legs", nom: "Cuisses & Fessiers", requetes: ["upper legs"] },
      { id: "lower legs", nom: "Mollets", requetes: ["lower legs"] }
    ]
  },
  "Chest": {
    nomAffiche: "Pectoraux (Chest)",
    sousCategories: [{ id: "chest", nom: "Pectoraux", requetes: ["chest"] }]
  },
  "Back": {
    nomAffiche: "Dos (Back)",
    sousCategories: [{ id: "back", nom: "Dos", requetes: ["back"] }]
  },
  "Shoulders": {
    nomAffiche: "Épaules (Shoulders)",
    sousCategories: [{ id: "shoulders", nom: "Épaules", requetes: ["shoulders"] }]
  },
  "Cardio": {
    nomAffiche: "Cardio",
    sousCategories: [{ id: "cardio", nom: "Cardio", requetes: ["cardio"] }]
  }
};

export default function App() {
  // 1. Les mémoires de navigation
  const [categorieActive, setCategorieActive] = useState(null); // Ex: "Arms"
  const [sousCategorieActive, setSousCategorieActive] = useState(null); // Ex: "upper arms"
  
  // 2. Les mémoires de données
  const [donneesExercices, setDonneesExercices] = useState(null);
  const [chargement, setChargement] = useState(false);

  // 3. LA LOGIQUE DE RÉCUPÉRATION (Avec support Multi-requêtes pour le bouton "Tous")
  const recupererExercices = async (listeRequetes, idSousCategorie) => {
    setChargement(true);
    setDonneesExercices(null);

    // Le nom du cache dépend de la sélection
    const nomDuCache = `fit_cache_${idSousCategorie}`;
    const cacheExistant = localStorage.getItem(nomDuCache);

    if (cacheExistant) {
      setDonneesExercices(JSON.parse(cacheExistant));
      setChargement(false);
      return;
    }

    try {
      // Magie JavaScript : on crée plusieurs requêtes en même temps si besoin
      const promessesFetch = listeRequetes.map(bodyPart => 
        // limit=5 par requête pour ne pas trop charger l'écran de démo
        fetch(`https://exercisedb.dev/api/v1/bodyparts/${encodeURIComponent(bodyPart)}/exercises?limit=5`)
          .then(res => {
            if (!res.ok) throw new Error("Erreur réseau");
            return res.json();
          })
      );

      // On attend que toutes les requêtes soient terminées
      const resultatsBruts = await Promise.all(promessesFetch);
      
      // On regroupe tout dans un seul grand tableau
      // (On gère le fait que l'API puisse renvoyer {data: [...]} ou directement [...])
      let donneesCombinees = [];
      resultatsBruts.forEach(resultat => {
        const tableau = Array.isArray(resultat.data) ? resultat.data : (Array.isArray(resultat) ? resultat : []);
        donneesCombinees = [...donneesCombinees, ...tableau];
      });

      setDonneesExercices(donneesCombinees);
      localStorage.setItem(nomDuCache, JSON.stringify(donneesCombinees));
    } catch (erreur) {
      console.error("Erreur lors de la récupération :", erreur);
    } finally {
      setChargement(false);
    }
  };

  // Gestion du clic sur une Catégorie Principale
  const handleCategorieClick = (clefCategorie) => {
    setCategorieActive(clefCategorie);
    setSousCategorieActive(null); // On réinitialise la sous-catégorie
    setDonneesExercices(null); // On nettoie l'écran
    
    // Si la catégorie n'a qu'une seule option (ex: Chest, Back, Cardio), on lance direct la requête !
    if (MENU_STRUCTURE[clefCategorie].sousCategories.length === 1) {
      const sousCat = MENU_STRUCTURE[clefCategorie].sousCategories[0];
      setSousCategorieActive(sousCat.id);
      recupererExercices(sousCat.requetes, sousCat.id);
    }
  };

  // Gestion du clic sur une Sous-Catégorie (ex: Upper Arms)
  const handleSousCategorieClick = (sousCat) => {
    setSousCategorieActive(sousCat.id);
    recupererExercices(sousCat.requetes, sousCat.id);
  };

  return (
    <div style={{ padding: "30px", fontFamily: "sans-serif", maxWidth: "900px", margin: "0 auto" }}>
      
      <h1 style={{ color: "#1f2937", borderBottom: "3px solid #3b82f6", paddingBottom: "10px" }}>
        Menu Intelligent
      </h1>

      {/* NIVEAU 1 : CATÉGORIES PRINCIPALES */}
      <h3 style={{ color: "#4b5563" }}>1. Choisissez un groupe musculaire :</h3>
      <div style={{ display: "flex", gap: "10px", flexWrap: "wrap", marginBottom: "20px" }}>
        {Object.keys(MENU_STRUCTURE).map((clef) => (
          <button 
            key={clef}
            onClick={() => handleCategorieClick(clef)}
            style={{
              padding: "12px 20px",
              backgroundColor: categorieActive === clef ? "#1f2937" : "#e5e7eb",
              color: categorieActive === clef ? "white" : "#374151",
              border: "none",
              borderRadius: "8px",
              cursor: "pointer",
              fontWeight: "bold",
              fontSize: "16px",
              transition: "background 0.2s"
            }}
          >
            {MENU_STRUCTURE[clef].nomAffiche}
          </button>
        ))}
      </div>

      {/* NIVEAU 2 : SOUS-CATÉGORIES (Affiché seulement si pertinent) */}
      {categorieActive && MENU_STRUCTURE[categorieActive].sousCategories.length > 1 && (
        <div style={{ backgroundColor: "#eff6ff", padding: "20px", borderRadius: "8px", marginBottom: "20px", borderLeft: "4px solid #3b82f6" }}>
          <h4 style={{ margin: "0 0 15px 0", color: "#1e3a8a" }}>2. Précisez la zone (Optionnel) :</h4>
          <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
            {MENU_STRUCTURE[categorieActive].sousCategories.map((sousCat) => (
              <button 
                key={sousCat.id}
                onClick={() => handleSousCategorieClick(sousCat)}
                style={{
                  padding: "8px 16px",
                  backgroundColor: sousCategorieActive === sousCat.id ? "#3b82f6" : "white",
                  color: sousCategorieActive === sousCat.id ? "white" : "#2563eb",
                  border: "2px solid #3b82f6",
                  borderRadius: "20px",
                  cursor: "pointer",
                  fontWeight: "bold",
                }}
              >
                {sousCat.nom}
              </button>
            ))}
          </div>
        </div>
      )}

      <hr style={{ margin: "30px 0", border: "1px solid #e5e7eb" }} />

      {/* NIVEAU 3 : AFFICHAGE DES RÉSULTATS */}
      {chargement && <p style={{ color: "#d97706", fontWeight: "bold", fontSize: "18px" }}>⏳ Récupération de la base de données...</p>}
      
      {!chargement && donneesExercices && (
        <div>
          <h3 style={{ color: "#10b981" }}>
            ✅ Données récupérées ({donneesExercices.length} exercices) :
          </h3>
          <pre style={{ 
            backgroundColor: "#111827", color: "#34d399", padding: "20px", 
            borderRadius: "8px", overflowX: "auto", fontSize: "13px", maxHeight: "400px"
          }}>
            {JSON.stringify(donneesExercices, null, 2)}
          </pre>
        </div>
      )}

    </div>
  );
}