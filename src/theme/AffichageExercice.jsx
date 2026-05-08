import React from "react";


export const AffichageExercice = ({ nom, cible, gifUrl }) => {
    return (
        <div style={{ 
            flex: 1, 
            padding: "20px",
            display: "flex",       
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center", 
            gap: "15px",           
            borderRight: "2px solid #e5e7eb" 
        }}>

            {/* 1. Le texte (Nom et Cible) */}
            <div style={{ display: "flex", flexDirection: "column", gap: "8px", alignItems: "center", textAlign: "center" }}>
                <h3 style={{ margin: 0, color: "#1f2937", fontSize: "20px" }}>
                    {nom} {/* <--- Utilisation de la variable ici */}
                </h3>
                
                <span style={{ 
                    backgroundColor: "#3b82f6", 
                    color: "white", 
                    padding: "4px 12px", 
                    borderRadius: "20px", 
                    fontSize: "12px", 
                    fontWeight: "bold",
                    width: "fit-content" 
                }}>
                    {cible} {/* <--- Utilisation de la variable ici */}
                </span>
            </div>
            
            {/* 2. Le carré d'emplacement pour le GIF */}
            <img 
                src={gifUrl}
                alt={nom}
                style={{
                    width: "120px", height: "120px", borderRadius: "8px", objectFit: "cover", 
                    backgroundColor: "#e5e7eb", boxShadow: "0 2px 4px rgba(0,0,0,0.1)"
                }}
            />

        </div>
    );
};