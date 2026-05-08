import React, { useState } from "react";
import { generateClient } from 'aws-amplify/data';
import { CarteExerciceVue } from "./CarteExerciceVue";
import { CarteExerciceExecution } from "./CarteExerciceExecution";

// Styles mis à jour pour les boutons
const styleCadre = { backgroundColor: "#f3f4f6", padding: "0px", borderRadius: "10px", marginBottom: "15px", textAlign: "left", boxSizing: "border-box", overflow: "hidden", transition: "all 0.3s" };

const styleBtnSupprimer = { 
    padding: "8px 15px", 
    backgroundColor: "#ef4444", // Rouge
    color: "white", 
    border: "none", 
    borderRadius: "6px", 
    cursor: "pointer", 
    fontWeight: "bold", 
    fontSize: "12px" 
};

const styleBtnModifier = { 
    padding: "8px 15px", 
    backgroundColor: "#3b82f6", // Bleu
    color: "white", 
    border: "none", 
    borderRadius: "6px", 
    cursor: "pointer", 
    fontWeight: "bold", 
    fontSize: "12px" 
};

const styleBtnLancer = { 
    padding: "8px 20px", 
    backgroundColor: "#10b981", // Vert
    color: "white", 
    border: "none", 
    borderRadius: "6px", 
    cursor: "pointer", 
    fontWeight: "bold", 
    fontSize: "14px",
    display: "flex",
    alignItems: "center",
    gap: "8px"
};

export const CarteProgramme = ({ programme, supprimerProgramme, majProgrammeGlobal, onLancerSeance }) => {
    const client = generateClient();
    
    const [estOuvert, setEstOuvert] = useState(false);
    const [mode, setMode] = useState("lecture"); 
    const [exosTemporaires, setExosTemporaires] = useState(programme.exercices || []);

    const majExoLocal = (id, nouvellesValeurs) => {
        setExosTemporaires(prev => prev.map(exo => exo.id === id ? { ...exo, ...nouvellesValeurs } : exo));
    };

    const annulerModifs = () => {
        setMode("lecture");
        setExosTemporaires(programme.exercices || []); 
    };

    const handleEnregistrerEdition = async () => {
        try {
            if(majProgrammeGlobal) majProgrammeGlobal(programme.id, exosTemporaires);
            setMode("lecture");
            alert("Modifications enregistrées !");
        } catch (error) {
            console.error("Erreur AWS :", error);
        }
    };

    let borderStyle = mode === "edition" ? "2px solid #3b82f6" : mode === "execution" ? "2px solid #f59e0b" : "1px solid #d1d5db";
    let bgHeader = mode === "execution" ? "#fffbeb" : estOuvert ? "#f8fafc" : "transparent";

    return (
        <div style={{ ...styleCadre, border: borderStyle }}>
            {/* EN-TÊTE */}
            <div 
                onClick={() => mode === "lecture" && setEstOuvert(!estOuvert)}
                style={{ padding: "20px", display: "flex", justifyContent: "space-between", alignItems: "center", cursor: mode === "lecture" ? "pointer" : "default", backgroundColor: bgHeader }}
            >
                <div>
                    <h3 style={{ margin: 0, color: "#1f2937", fontSize: "18px", display: "flex", alignItems: "center", gap: "10px" }}>
                        {programme.nom} 
                        {mode === "edition" && <span style={{ backgroundColor: "#3b82f6", color: "white", padding: "2px 6px", borderRadius: "4px", fontSize: "10px" }}>ÉDITION</span>}
                    </h3>
                    <span style={{ fontSize: "12px", color: "#6b7280" }}>{programme.date}</span>
                </div>
                <div style={{ fontSize: "20px", fontWeight: "bold" }}>{estOuvert ? "▲" : "▼"}</div>
            </div>

            {/* CONTENU */}
            {estOuvert && (
                <div style={{ padding: "20px", borderTop: "1px solid #d1d5db", backgroundColor: "#f9fafb" }}>
                    {exosTemporaires.map((exo) => (
                        <CarteExerciceVue 
                            key={exo.id} 
                            exo={exo} 
                            estEnEdition={mode === "edition"} 
                            majExo={majExoLocal} 
                            supprimerExo={(id) => setExosTemporaires(prev => prev.filter(e => e.id !== id))} 
                        />
                    ))}

                    <div style={{ marginTop: "20px", display: "flex", justifyContent: "space-between", alignItems: "center", borderTop: "1px dashed #d1d5db", paddingTop: "15px" }}>
                        
                        {mode === "lecture" && (
                            <>
                                {/* BOUTON SUPPRIMER (À GAUCHE) */}
                                <button onClick={() => supprimerProgramme(programme.id)} style={styleBtnSupprimer}>
                                    Supprimer
                                </button>

                                {/* BOUTON MODIFIER (AU MILIEU) */}
                                <button onClick={() => setMode("edition")} style={styleBtnModifier}>
                                    Modifier
                                </button>
                                
                                {/* BOUTON LANCER (À DROITE) */}
                                <button onClick={() => onLancerSeance(programme)} style={styleBtnLancer}>
                                    ▶️
                                </button>
                            </>
                        )}

                        {mode === "edition" && (
                            <div style={{ display: "flex", gap: "10px", width: "100%", justifyContent: "flex-end" }}>
                                <button onClick={annulerModifs} style={{ padding: "8px 15px", backgroundColor: "#9ca3af", color: "white", border: "none", borderRadius: "6px", cursor: "pointer" }}>Annuler</button>
                                <button onClick={handleEnregistrerEdition} style={{ padding: "8px 15px", backgroundColor: "#10b981", color: "white", border: "none", borderRadius: "6px", cursor: "pointer" }}>💾 Enregistrer</button>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};