import React, { useState, useEffect } from "react";
import { generateClient } from 'aws-amplify/data';


export const CarteExerciceExecution = ({ exo, majExoExecution }) => {
    const client = generateClient();
    // --- ÉTAT DU CHRONOMÈTRE ---
    const [tempsDeRepos, setTempsDeRepos] = useState(60); // Par défaut 60 secondes
    const [chronoActif, setChronoActif] = useState(false);

    // --- LOGIQUE DU CHRONOMÈTRE ---
    useEffect(() => {
        let interval = null;
        if (chronoActif && tempsDeRepos > 0) {
            interval = setInterval(() => {
                setTempsDeRepos((tempsPrecedent) => tempsPrecedent - 1);
            }, 1000);
        } else if (tempsDeRepos === 0) {
            setChronoActif(false);
            // Optionnel : Vous pourriez ajouter un son ici (Audio play)
        }
        return () => clearInterval(interval);
    }, [chronoActif, tempsDeRepos]);

    const basculerChrono = () => setChronoActif(!chronoActif);
    
    const reinitialiserChrono = () => {
        setChronoActif(false);
        setTempsDeRepos(60); // Remet à 60s
    };

    // Styles pour les boutons emoji
    const styleEmojiBtn = (estSelectionne, couleurActive) => ({
        padding: "8px 12px", border: "none", borderRadius: "6px", cursor: "pointer", fontSize: "16px",
        backgroundColor: estSelectionne ? couleurActive : "#f3f4f6",
        boxShadow: estSelectionne ? "inset 0 2px 4px rgba(0,0,0,0.2)" : "0 2px 4px rgba(0,0,0,0.05)",
        transition: "all 0.2s"
    });

    // Formatage du temps pour l'affichage (ex: "01:30" ou "00:45")
    const formaterTemps = (secondes) => {
        const min = Math.floor(secondes / 60);
        const sec = secondes % 60;
        return `${min < 10 ? '0' : ''}${min}:${sec < 10 ? '0' : ''}${sec}`;
    };

    return (
        <div style={{ 
            display: "flex", flexDirection: "column", backgroundColor: "white", padding: "15px", 
            borderRadius: "8px", marginBottom: "12px", border: exo.estTermine ? "2px solid #10b981" : "2px solid #e5e7eb",
            boxShadow: "0 4px 6px rgba(0,0,0,0.05)",
            transition: "all 0.3s"
        }}>
            {/* --- NOUVEAU : Visuel et Infos --- */}
            <div style={{ display: "flex", gap: "15px", borderBottom: "1px solid #f3f4f6", paddingBottom: "15px", marginBottom: "15px" }}>
                
                {/* Image de l'exercice (si l'API fournit une URL gifUrl ou imageUrl) */}
                <div style={{ width: "80px", height: "80px", flexShrink: 0, backgroundColor: "#f3f4f6", borderRadius: "8px", overflow: "hidden", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    {exo.gifUrl || exo.imageUrl ? (
                        <img src={exo.gifUrl || exo.imageUrl} alt={exo.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                    ) : (
                        <span style={{ fontSize: "24px" }}>🏋️</span>
                    )}
                </div>

                <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center" }}>
                    <strong style={{ fontSize: "18px", textTransform: "capitalize", color: exo.estTermine ? "#10b981" : "#1f2937", marginBottom: "5px" }}>
                        {exo.name}
                    </strong>
                    <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
                        <span style={{ fontWeight: "bold", color: "#4b5563", fontSize: "16px", backgroundColor: "#f3f4f6", padding: "4px 10px", borderRadius: "8px" }}>
                            {exo.series} × {exo.reps}
                        </span>
                        <span style={{ fontSize: "13px", color: "#6b7280", textTransform: "capitalize" }}>
                            {exo.bodyPart || "Corps entier"}
                        </span>
                    </div>
                </div>
            </div>

            {/* --- Ligne d'Actions (Check + Emojis) --- */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "10px" }}>
                
                <button
                    onClick={() => {
                        const nouvelEtatTermine = !exo.estTermine;
                        majExoExecution(exo.id, { estTermine: nouvelEtatTermine, ressenti: !nouvelEtatTermine ? null : exo.ressenti });
                        
                        // Si on marque "Terminé", on arrête le chrono par sécurité
                        if (nouvelEtatTermine) setChronoActif(false);
                    }}
                    style={{ 
                        padding: "10px 20px", borderRadius: "8px", border: "none", fontWeight: "bold", cursor: "pointer", fontSize: "14px",
                        backgroundColor: exo.estTermine ? "#10b981" : "#e5e7eb", color: exo.estTermine ? "white" : "#4b5563",
                        transition: "all 0.2s"
                    }}
                >
                    {exo.estTermine ? "✅ Exercice fini" : "⏳ C'est parti"}
                </button>

                <div style={{ 
                    display: "flex", gap: "10px", alignItems: "center",
                    opacity: exo.estTermine ? 1 : 0.4, pointerEvents: exo.estTermine ? "auto" : "none" 
                }}>
                    <span style={{ fontSize: "12px", color: "#6b7280", fontWeight: "bold" }}>Difficulté :</span>
                    <button onClick={() => majExoExecution(exo.id, { ressenti: "facile" })} style={styleEmojiBtn(exo.ressenti === "facile", "#a7f3d0")}>🟢</button>
                    <button onClick={() => majExoExecution(exo.id, { ressenti: "moyen" })} style={styleEmojiBtn(exo.ressenti === "moyen", "#fde68a")}>🟠</button>
                    <button onClick={() => majExoExecution(exo.id, { ressenti: "dur" })} style={styleEmojiBtn(exo.ressenti === "dur", "#fecaca")}>🔴</button>
                </div>
            </div>

            {/* --- NOUVEAU : CHRONOMÈTRE DE REPOS --- */}
            {/* On ne l'affiche que si l'exercice n'est pas terminé, pour aider pendant les séries */}
            {!exo.estTermine && (
                <div style={{ marginTop: "15px", padding: "10px", backgroundColor: chronoActif ? "#eff6ff" : "#f9fafb", borderRadius: "8px", border: chronoActif ? "1px solid #bfdbfe" : "1px solid transparent", display: "flex", alignItems: "center", justifyContent: "space-between", transition: "all 0.3s" }}>
                    
                    <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                        <span style={{ fontSize: "20px" }}>⏱️</span>
                        <div style={{ display: "flex", flexDirection: "column" }}>
                            <span style={{ fontSize: "12px", color: "#6b7280", fontWeight: "bold" }}>Repos entre séries</span>
                            <span style={{ fontSize: "22px", fontWeight: "bold", color: tempsDeRepos === 0 ? "#ef4444" : "#1f2937", fontFamily: "monospace" }}>
                                {formaterTemps(tempsDeRepos)}
                            </span>
                        </div>
                    </div>

                    <div style={{ display: "flex", gap: "5px" }}>
                        <button 
                            onClick={basculerChrono} 
                            style={{ padding: "8px 15px", backgroundColor: chronoActif ? "#ef4444" : "#3b82f6", color: "white", border: "none", borderRadius: "6px", cursor: "pointer", fontWeight: "bold" }}
                        >
                            {chronoActif ? "Pause" : "Démarrer"}
                        </button>
                        <button 
                            onClick={reinitialiserChrono} 
                            style={{ padding: "8px", backgroundColor: "#e5e7eb", color: "#4b5563", border: "none", borderRadius: "6px", cursor: "pointer", fontWeight: "bold" }}
                            title="Remettre à 60s"
                        >
                            🔄
                        </button>
                    </div>

                </div>
            )}
        </div>
    );
};