import React, { useState } from "react";

export const CarteExerciceFlip = ({ exo, panier, ajouterAuPanier }) => {
    const [estRetournee, setEstRetournee] = useState(false);
    const estDejaAjoute = panier.some(item => item.id === exo.id);

    const gererAjout = (e) => {
        e.stopPropagation();
        if (!estDejaAjoute) {
            ajouterAuPanier(exo);
        }
    };

    // Sécurité au cas où l'image met du temps à charger ou n'existe pas
    const imageDeSecours = `https://placehold.co/400x400/e2e8f0/475569?text=${encodeURIComponent(exo.name)}`;
    const urlImageFinale = exo.gifUrl ? exo.gifUrl : imageDeSecours;

    return (
        <div 
            onClick={() => setEstRetournee(!estRetournee)}
            style={{ width: "100%", height: "320px", perspective: "1000px", cursor: "pointer" }}
        >
            <div style={{ 
                width: "100%", height: "100%", position: "relative", 
                transition: "transform 0.6s", transformStyle: "preserve-3d", 
                transform: estRetournee ? "rotateY(180deg)" : "rotateY(0deg)" 
            }}>
                
                {/* --- FACE AVANT --- */}
                <div style={{ 
                    position: "absolute", width: "100%", height: "100%", backfaceVisibility: "hidden", 
                    backgroundColor: "white", borderRadius: "12px", border: "1px solid #e5e7eb", 
                    display: "flex", flexDirection: "column", overflow: "hidden", boxShadow: "0 4px 6px rgba(0,0,0,0.1)"
                }}>
                    <div style={{ padding: "10px", textAlign: "center", backgroundColor: "#f9fafb", borderBottom: "1px solid #e5e7eb" }}>
                        <div style={{ fontSize: "11px", color: "#6b7280", textTransform: "uppercase", fontWeight: "bold", marginBottom: "4px" }}>
                            Équipement : {exo.equipment}
                        </div>
                        <h3 style={{ margin: 0, fontSize: "15px", color: "#1f2937", textTransform: "capitalize", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                            {exo.name}
                        </h3>
                    </div>

                    <div style={{ flex: 1, backgroundColor: "#f3f4f6", overflow: "hidden" }}>
                        {/* 💡 Plus besoin de ChargeurImage, une simple image suffit ! */}
                        <img 
                            src={urlImageFinale} 
                            alt={exo.name} 
                            style={{ width: "100%", height: "100%", objectFit: "cover" }} 
                            onError={(e) => { e.target.src = imageDeSecours; }}
                        />
                    </div>

                    <div style={{ padding: "10px", backgroundColor: "white" }}>
                        <button 
                            onClick={gererAjout} disabled={estDejaAjoute}
                            style={{
                                width: "100%", padding: "10px", borderRadius: "6px", fontWeight: "bold", border: "none", fontSize: "13px",
                                backgroundColor: estDejaAjoute ? "#9ca3af" : "#10b981", color: "white", cursor: estDejaAjoute ? "not-allowed" : "pointer"
                            }}
                        >
                            {estDejaAjoute ? "✓ Ajouté" : "➕ Ajouter"}
                        </button>
                    </div>
                </div>

                {/* --- FACE ARRIÈRE (Instructions) --- */}
                <div style={{ 
                    position: "absolute", width: "100%", height: "100%", backfaceVisibility: "hidden", transform: "rotateY(180deg)", 
                    backgroundColor: "#1f2937", color: "white", borderRadius: "12px", padding: "15px", boxSizing: "border-box", 
                    display: "flex", flexDirection: "column", boxShadow: "0 4px 6px rgba(0,0,0,0.1)"
                }}>
                    <h3 style={{ borderBottom: "1px solid #4b5563", paddingBottom: "8px", marginTop: 0, color: "#60a5fa", fontSize: "15px" }}>
                        Instructions
                    </h3>
                    <ol style={{ paddingLeft: "15px", margin: 0, overflowY: "auto", flex: 1, fontSize: "13px", lineHeight: "1.4" }}>
                        {exo.instructions && exo.instructions.map((etape, index) => (
                            <li key={index} style={{ marginBottom: "8px" }}>{etape}</li>
                        ))}
                    </ol>
                </div>
            </div>
        </div>
    );
};