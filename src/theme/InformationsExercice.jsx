import React from "react";

export const InformationsExercice = ({ series, setSeries, reps, setReps }) => {
    const stylePetitBouton = {
        padding: "8px 15px",
        backgroundColor: "#1f2937",
        color: "white",
        border: "none",
        borderRadius: "8px",
        cursor: "pointer",
        fontWeight: "bold",
        fontSize: "14px",
        boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
        transition: "transform 0.1s"
    };

    return (
        <div style={{ 
            flex: 3, // 75% de l'espace de la carte
            padding: "20px", 
            display: "flex", 
            flexDirection: "column", 
            justifyContent: "center",
            gap: "20px" 
        }}>
            
            {/* 🔽 LIGNE 1 : LES SÉRIES 🔽 */}
            <div style={{ display: "flex", alignItems: "center", gap: "15px" }}>
                <strong style={{ width: "80px", fontSize: "16px" }}>Séries :</strong>
                
                <button style={stylePetitBouton} onClick={() => setSeries(series > 1 ? series - 1 : 1)}>-</button>
                <span style={{ fontSize: "20px", fontWeight: "bold", width: "40px", textAlign: "center" }}>
                    {series}
                </span>
                <button style={stylePetitBouton} onClick={() => setSeries(series + 1)}>+</button>
            </div>

            {/* 🔽 LIGNE 2 : L'INPUT LIBRE + ÉCHEC 🔽 */}
            <div style={{ display: "flex", alignItems: "center", gap: "15px", flexWrap: "wrap" }}>
                <strong style={{ width: "80px", fontSize: "16px" }}>Objectif :</strong>
                
                <input 
                    type="text" 
                    value={reps} 
                    onChange={(e) => setReps(e.target.value)} 
                    style={{ 
                        width: "80px", padding: "10px", textAlign: "center", 
                        borderRadius: "8px", border: "2px solid #d1d5db", 
                        fontWeight: "bold", fontSize: "16px", outline: "none"
                    }}
                />
                
                <button style={{ ...stylePetitBouton, backgroundColor: "#ef4444" }} onClick={() => setReps("ÉCHEC")}>
                    🔥 ÉCHEC
                </button>
            </div>

            {/* 🔽 LIGNE 3 : PANNEAU DES RACCOURCIS RAPIDES 🔽 */}
            <div style={{ 
                display: "flex", flexDirection: "column", gap: "12px", 
                backgroundColor: "#f9fafb", padding: "15px", 
                borderRadius: "10px", border: "1px dashed #d1d5db", marginTop: "5px"
            }}>
                
                {/* Raccourcis Musculation */}
                <div style={{ display: "flex", alignItems: "center", gap: "10px", flexWrap: "wrap" }}>
                    <span style={{ fontSize: "13px", color: "#6b7280", width: "80px", fontWeight: "bold" }}>MUSCLE :</span>
                    <button style={stylePetitBouton} onClick={() => setReps(6)}>6 reps</button>
                    <button style={stylePetitBouton} onClick={() => setReps(8)}>8 reps</button>
                    <button style={stylePetitBouton} onClick={() => setReps(10)}>10 reps</button>
                    <button style={stylePetitBouton} onClick={() => setReps(12)}>12 reps</button>
                </div>

                {/* Raccourcis Cardio */}
                <div style={{ display: "flex", alignItems: "center", gap: "10px", flexWrap: "wrap" }}>
                    <span style={{ fontSize: "13px", color: "#6b7280", width: "80px", fontWeight: "bold" }}>CARDIO :</span>
                    <button style={{...stylePetitBouton, backgroundColor: "#3b82f6"}} onClick={() => setReps("1 min")}>1 min</button>
                    <button style={{...stylePetitBouton, backgroundColor: "#3b82f6"}} onClick={() => setReps("5 mins")}>5 mins</button>
                    <button style={{...stylePetitBouton, backgroundColor: "#3b82f6"}} onClick={() => setReps("30 mins")}>30 mins</button>
                    <button style={{...stylePetitBouton, backgroundColor: "#3b82f6"}} onClick={() => setReps("1 h")}>1 h</button>
                </div>
                
            </div>

        </div>
    );
};