import React from "react";

import { useState, useEffect } from "react";
import { CarteExerciceFlip } from "./CarteExerciceFlip";


export const CarteRechercheAPI = ({ filtreActif, panier, ajouterAuPanier }) => {
    const [resultats, setResultats] = useState([]);
    const [enChargement, setEnChargement] = useState(false);

    // 💡 Mise à jour du dictionnaire pour correspondre aux "bodyparts" de la nouvelle API
    const dictionnaireMuscles = {
        "Chest": "chest", 
        "Abs": "waist", 
        "Back": "back",
        "Legs": "upper legs", 
        "Cardio": "cardio", 
        "Shoulders": "shoulders"
    };

    useEffect(() => {
        if (!filtreActif) return;

        const chercherExercices = async () => {
            setEnChargement(true);
            try {
                const bodyPart = dictionnaireMuscles[filtreActif];
                
                // 💡 La nouvelle URL simplifiée
                const url = `https://oss.exercisedb.dev/api/v1/exercises/bodyparts?bodyParts=${bodyPart}&limit=12`;
                
                const reponse = await fetch(url);
                
                if (!reponse.ok) throw new Error("Erreur API");

                
                // On récupère le gros bloc JSON
                const donneesJson = await reponse.json();

                let tableauDonnees = [];
                if (Array.isArray(donneesJson)) {
                    tableauDonnees = donneesJson;
                } else if (donneesJson && Array.isArray(donneesJson.data)) {
                    tableauDonnees = donneesJson.data;
                } else {
                    throw new Error("Impossible de trouver le tableau d'exercices dans la réponse API.");
                }

                // On extrait le tableau, puis on le transforme dans NOTRE format
                // On utilise tableauDonnees.map
                const exercicesFormates = tableauDonnees.map(apiExo => ({
                    id: apiExo.exerciseId || apiExo.id,
                    target: apiExo.targetMuscles ? apiExo.targetMuscles[0] : (apiExo.target || "N/A"),
                    equipment: apiExo.equipments ? apiExo.equipments[0] : (apiExo.equipment || "N/A"),
                    name: apiExo.name,  
                    gifUrl: apiExo.gifUrl,
                    instructions: apiExo.instructions || [] // Sécurité au cas où il n'y a pas d'instructions
                }));

                // On sauvegarde nos données propres
                setResultats(exercicesFormates);

            } catch (erreur) {
                console.error("Erreur API :", erreur);
                setResultats([]); 
            } finally {
                setEnChargement(false);
            }
        };

        chercherExercices();

    }, [filtreActif]);

    if (enChargement) return <div style={{ padding: "40px", color: "#6b7280", fontWeight: "bold", textAlign: "center" }}>
        ⏳ Téléchargement...
    </div>;
    if (resultats.length === 0) return <div style={{ padding: "40px", color: "#ef4444", fontWeight: "bold", textAlign: "center" }}>
        ❌ Aucun résultat.
    </div>;

    return (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "15px", width: "100%" }}>
            {resultats.map((exo) => (
                <CarteExerciceFlip key={exo.id} exo={exo} panier={panier} ajouterAuPanier={ajouterAuPanier} />
            ))}
        </div>
    );
};