import React, { useState } from "react";
import { generateClient } from 'aws-amplify/data';
import { styleTitre } from "../theme/theme";
import { CarteExercice } from "../theme/CarteExercice";


export default function VueSeance({ panier, modifierExoPanier, viderPanier }) {
    // Initialisation du client AWS
    const client = generateClient();
    
    const [nomSeance, setNomSeance] = useState("");
    const [chargement, setChargement] = useState(false);

    // --- NOUVELLE MÉTHODE CLOUD (Étape 4) ---
    const handleSauvegarder = async () => {
        if (!nomSeance) {
            alert("Veuillez donner un nom à votre séance.");
            return;
        }

        setChargement(true);
        try {

            const dateAujourdhui = new Date().toLocaleDateString('fr-FR');


            const { data: nouvelleSeance, errors } = await client.models.Seance.create({
                nom: nomSeance,
                description: dateAujourdhui,
                exercices: JSON.stringify(panier) // <--- C'est ici que la magie opère !
            });

            if (errors) {
                console.error("Erreur AWS:", errors);
                alert("Erreur lors de la sauvegarde.");
            } else {
                alert(`Séance "${nouvelleSeance.nom}" sauvegardée sur le Cloud !`);
                setNomSeance("");
                if(viderPanier) viderPanier(); // On vide le panier après succès
            }
        } catch (error) {
            console.error("Erreur réseau:", error);
            alert("Problème de connexion au Cloud.");
        } finally {
            setChargement(false);
        }
    };

    return(
        <div style={{
            boxSizing: "border-box",
            textAlign:"center",
            fontFamily: "sans-serif",
            maxWidth: "800px", 
            margin: "0 auto", 
            padding: "20px"
        }}>
            <h2 style={{...styleTitre, marginBottom: "30px"}}>
                Configurez votre séance
            </h2>

            <br/>

            <div style={{ 
                display: "flex", 
                gap: "20px",
                marginBottom: "30px",
                alignItems: "stretch"
            }}>
                <p style={{ ...styleTitre, flex: 1, marginBottom: 0 }}>
                    1. Entrez le nom de la séance.
                </p>

                <input 
                    type="text"
                    value={nomSeance}
                    onChange={(e) => setNomSeance(e.target.value.toUpperCase())}
                    placeholder="Jour, groupe musculaire ..."
                    style={{
                        boxSizing: "border-box",
                        flex: 1, 
                        padding: "15px",
                        borderRadius: "10px",
                        border: "2px solid #1f2937",
                        fontSize: "16px",
                        textAlign: "center",
                        outline: "none"
                    }}
                />
            </div>

            <p style={{...styleTitre, marginBottom: "30px"}}>
                2. Réglez vos séries et répétitions.
            </p>

            <br/>

            {panier.length === 0 ? (
                <div>Le panier est vide. Retournez à l'accueil.</div>
            ) : (
                panier.map((exo) => (
                    <CarteExercice 
                        key={exo.id} 
                        exo={exo} 
                        modifierExoPanier={modifierExoPanier} 
                    />
                ))
            )}

            <br />

            <button
                onClick={handleSauvegarder} // On appelle la nouvelle fonction
                disabled={panier.length === 0 || chargement}
                style={{ 
                    ...styleTitre,
                    backgroundColor: (panier.length === 0 || chargement) ? "#9ca3af" : "#1f2937",
                    cursor: (panier.length === 0 || chargement) ? "not-allowed" : "pointer", 
                    display: "block",
                    margin: "0 auto", 
                    width: "fit-content",
                    border: "none",
                    color: "white",
                    padding: "15px 30px",
                    borderRadius: "10px"
            }}>
                {chargement ? "Envoi au Cloud..." : "Sauvegarder sur AWS Cloud"}
            </button>
        </div>
    )
}