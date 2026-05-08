import React from "react";

import { styleTitre } from "../theme/theme";
import { CarteRechercheAPI } from "../theme/CarteRechercheAPI";
import { styleFiltre, styleFiltreActif } from "../theme/theme";
import { useState } from "react";


export default function VueAccueil ({ panier, ajouterAuPanier }) {
    // MÉMOIRE : Quel est le filtre sélectionné en ce moment ?
    const [filtreSelectionne, setFiltreSelectionne] = useState("Chest");

    // Notre liste de catégories
    const categories = ["Chest", "Abs", "Back", "Legs", "Cardio", "Shoulders"];

    return (
        <div style={{
            boxSizing: "border-box", textAlign:"center", fontFamily: "sans-serif",
            maxWidth: "800px", margin: "0 auto", padding: "20px"
        }}>
            
            <h2 style={{...styleTitre, marginBottom: "20px"}}>
                Catalogue d'exercices
            </h2>

            {/* LA BARRE DE FILTRES DYNAMIQUE */}
            <div style={{ 
                display: "flex", justifyContent: "center", alignItems: "center",    
                gap: "10px", padding: "10px 0 30px 0", flexWrap: "wrap" 
            }}>
                {/* On génère les boutons automatiquement ! */}
                {categories.map((cat) => (
                    <div 
                        key={cat}
                        onClick={() => setFiltreSelectionne(cat)} // Quand on clique, on change la mémoire !
                        style={filtreSelectionne === cat ? styleFiltreActif : styleFiltre}
                    >
                        {cat}
                    </div>
                ))}
            </div>

            {/* LE SEUL ET UNIQUE COMPOSANT DE RECHERCHE ! */}
            {/* On lui passe le mot actuel (ex: "Chest") pour qu'il se débrouille tout seul */}
            <CarteRechercheAPI 
                filtreActif={filtreSelectionne} 
                panier={panier}
                ajouterAuPanier={ajouterAuPanier}
            />

        </div>
    );
};