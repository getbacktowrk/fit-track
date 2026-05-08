import { stylePetitBouton } from "./theme";

export const CarteExerciceVue = ({ exo, estEnEdition, majExo, supprimerExo }) => {
    const imageDeSecours = `https://placehold.co/50x50/e2e8f0/475569?text=IMG`;

    return (
        <div style={{ display: "flex", backgroundColor: "white", padding: "12px", borderRadius: "8px", marginBottom: "10px", border: "1px solid #e5e7eb", alignItems: "center", gap: "15px" }}>
            <img src={exo.gifUrl || imageDeSecours} alt={exo.name} style={{ width: "50px", height: "50px", borderRadius: "6px", objectFit: "cover" }} />
            <div style={{ flex: 1 }}>
                <strong style={{ textTransform: "capitalize", display: "block" }}>
                    {exo.name} 
                    {/* Affichage du feedback passé si existant */}
                    {exo.estTermine && exo.ressenti === 'facile' && " 🟢"}
                    {exo.estTermine && exo.ressenti === 'moyen' && " 🟠"}
                    {exo.estTermine && exo.ressenti === 'dur' && " 🔴"}
                </strong> 
                <span style={{ fontSize: "12px", color: "#6b7280", textTransform: "capitalize" }}>{exo.target}</span>
            </div>

            {estEnEdition ? (
                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "5px", border: "1px solid #d1d5db", padding: "2px", borderRadius: "6px" }}>
                        <button style={stylePetitBouton} onClick={() => majExo(exo.id, { series: Math.max(1, (exo.series || 1) - 1) })}>-</button>
                        <span style={{ width: "20px", textAlign: "center", fontWeight: "bold" }}>{exo.series}</span>
                        <button style={stylePetitBouton} onClick={() => majExo(exo.id, { series: (exo.series || 0) + 1 })}>+</button>
                    </div>
                    <input type="text" value={exo.reps} onChange={(e) => majExo(exo.id, { reps: e.target.value })} style={{ width: "70px", padding: "5px", border: "1px solid #d1d5db", borderRadius: "6px", textAlign: "center" }} />
                    <button onClick={() => supprimerExo(exo.id)} style={{ background: "none", border: "none", cursor: "pointer", fontSize: "18px" }}>🗑️</button>
                </div>
            ) : (
                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                    {/* Badge de statut */}
                    {exo.estTermine && <span style={{ fontSize: "10px", backgroundColor: "#10b981", color: "white", padding: "2px 6px", borderRadius: "10px", fontWeight: "bold" }}>FAIT</span>}
                    <div style={{ color: "#4b5563", fontWeight: "bold", backgroundColor: "#f3f4f6", padding: "5px 10px", borderRadius: "6px", fontSize: "14px" }}>
                        {exo.series} × {exo.reps}
                    </div>
                </div>
            )}
        </div>
    );
};