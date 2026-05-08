import React from "react";
import { InformationsExercice } from "./InformationsExercice";
import { AffichageExercice } from "./AffichageExercice";

export const CarteExercice = ({ modifierExoPanier, exo }) => {

    return (
        <div style={{
            display: "flex",
            backgroundColor: "#f3f4f6",
            padding: "20px",
            borderRadius: "10px",
            marginBottom: "15px",
            textAlign: "left"
        }}>
            {/* --- MOITIÉ GAUCHE (Image et Nom) --- */}
            <AffichageExercice
                nom={exo.name.toUpperCase()}
                cible={exo.target}
                gifUrl={exo.gifUrl}
            />

            {/* --- MOITIÉ DROITE (Maintenant isolée et appelée proprement !) --- */}
            <InformationsExercice 
                series={exo.series}
                setSeries={(nouvellesSeries) => modifierExoPanier(exo.id, nouvellesSeries, exo.reps)}

                reps={exo.reps}
                setReps={(nouvellesReps) => modifierExoPanier(exo.id, exo.series, nouvellesReps)}
            />
        </div>
    );
};