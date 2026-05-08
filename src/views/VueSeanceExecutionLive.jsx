import React, { useState, useEffect } from "react";
import { generateClient } from 'aws-amplify/data';
import { ImageExercice } from "../theme/ImageExercice";

export default function VueSeanceExecutionLive({ seance, onTerminer, onAbandonner }) {
    const client = generateClient(); 
    
    const [indexExo, setIndexExo] = useState(0);
    const [setActuel, setSetActuel] = useState(1);
    const [etat, setEtat] = useState("travail"); 
    const [chrono, setChrono] = useState(60);
    const [logsSeance, setLogsSeance] = useState([]);
    const [notePerso, setNotePerso] = useState("");
    const [ressentiSelectionne, setRessentiSelectionne] = useState(null);

    const exercice = seance.exercices[indexExo];

    useEffect(() => {
        let timer;
        if (etat === "repos" && chrono > 0) {
            timer = setInterval(() => setChrono(c => c - 1), 1000);
        } else if (chrono === 0) {
            setEtat("travail");
            setSetActuel(setActuel + 1);
            setChrono(60);
        }
        return () => clearInterval(timer);
    }, [etat, chrono]);

    const validerSerie = () => {
        if (setActuel < exercice.series) {
            setEtat("repos");
        } else {
            setEtat("feedback");
        }
    };

    const confirmerEtContinuer = async () => {
        if (!ressentiSelectionne) {
            alert("Veuillez sélectionner un ressenti (🟢, 🟠 ou 🔴).");
            return;
        }

        const log = {
            id: exercice.id,
            name: exercice.name,
            bodyPart: exercice.bodyPart,
            ressenti: ressentiSelectionne,
            note: notePerso
        };

        const nouveauxLogs = [...logsSeance, log];
        setLogsSeance(nouveauxLogs);

        if (indexExo < seance.exercices.length - 1) {
            setIndexExo(indexExo + 1);
            setSetActuel(1);
            setEtat("travail");
            setNotePerso("");
            setRessentiSelectionne(null);
        } else {
            try {
                await client.models.SessionLog.create({
                    seanceId: seance.id,
                    nomSeance: seance.nom,
                    date: new Date().toISOString(),
                    exercicesLogs: JSON.stringify(nouveauxLogs)
                });
                onTerminer();
            } catch (e) { console.error("Erreur AWS:", e); }
        }
    };

    return (
        <div style={styles.fullscreen}>
            
            {/* ZONE CHRONO (HAUT 25%) */}
            <div style={{...styles.zoneChrono, backgroundColor: etat === "repos" ? "#1e293b" : "#020617"}}>
                <div style={{textAlign: 'center'}}>
                    <p style={styles.labelChrono}>{etat === "repos" ? "RÉCUPÉRATION ACTIVE" : "TEMPS DE REPOS PRÊT"}</p>
                    <h1 style={{...styles.chiffreChrono, color: etat === "repos" ? "#bef264" : "#1e293b"}}>
                        {chrono}s
                    </h1>
                    {etat === "repos" && <button onClick={() => setChrono(0)} style={styles.btnSkip}>Passer le repos</button>}
                </div>
            </div>

            {/* ZONE ACTION (BAS 75%) */}
            <div style={styles.zoneAction}>
                <div style={styles.header}>
                    <div style={{textAlign: 'left'}}>
                        <h2 style={styles.nomExo}>{exercice.name}</h2>
                        <span style={styles.progression}>Exercice {indexExo + 1} sur {seance.exercices.length}</span>
                    </div>
                    <button onClick={onAbandonner} style={styles.btnAbandon}>Abandonner</button>
                </div>

                <div style={styles.content}>
                    <ImageExercice 
                        src={exercice.gifUrl} 
                        alt="demo" 
                        style={styles.gif} 
                    />
                    
                    <div style={styles.compteurSets}>
                        <h1 style={styles.setHighlight}>SÉRIE {setActuel} / {exercice.series}</h1>
                        <p style={styles.targetReps}>{exercice.reps} RÉPÉTITIONS</p>
                    </div>

                    <button onClick={validerSerie} style={styles.btnPrincipal}>
                        SÉRIE TERMINÉE
                    </button>
                </div>
            </div>

            {/* OVERLAY FEEDBACK */}
            {etat === "feedback" && (
                <div style={styles.overlay}>
                    <h3 style={{fontSize: '24px', marginBottom: '5px'}}>Bien joué !</h3>
                    <p style={{color: '#94a3b8', marginBottom: '20px', textAlign: 'center'}}>Comment était l'effort pour cet exercice ?</p>
                    
                    <div style={styles.emojiRow}>
                        {["facile", "moyen", "dur"].map((type, idx) => (
                            <button 
                                key={type}
                                onClick={() => setRessentiSelectionne(type)} 
                                style={{...styles.emoji, background: ressentiSelectionne === type ? "#334155" : "none"}}
                            >
                                {idx === 0 ? "🟢" : idx === 1 ? "🟠" : "🔴"}
                            </button>
                        ))}
                    </div>

                    <textarea 
                        placeholder="Une note sur votre séance ?" 
                        style={styles.textarea}
                        value={notePerso}
                        onChange={(e) => setNotePerso(e.target.value)}
                    />

                    <button onClick={confirmerEtContinuer} style={{...styles.btnPrincipal, marginTop: '20px', backgroundColor: !ressentiSelectionne ? '#4b5563' : '#bef264'}}>
                        ENREGISTRER ET CONTINUER
                    </button>
                </div>
            )}
        </div>
    );
}

const styles = {
    fullscreen: { position: 'fixed', inset: 0, zIndex: 11000, display: 'flex', flexDirection: 'column', backgroundColor: '#0f172a', color: 'white', fontFamily: 'sans-serif' },
    
    // 25% Haut
    zoneChrono: { flex: '0 0 25%', display: 'flex', justifyContent: 'center', alignItems: 'center', borderBottom: '1px solid #1e293b' },
    labelChrono: { color: '#94a3b8', fontSize: '12px', letterSpacing: '2px', marginBottom: '5px' },
    chiffreChrono: { fontSize: '80px', margin: 0, lineHeight: 1, fontFamily: 'monospace' },
    btnSkip: { marginTop: '10px', color: '#bef264', background: 'none', border: '1px solid #bef264', padding: '4px 12px', borderRadius: '20px', fontSize: '12px', cursor: 'pointer' },

    // 75% Bas
    zoneAction: { flex: '0 0 75%', padding: '20px', display: 'flex', flexDirection: 'column', backgroundColor: '#0f172a' },
    header: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px' },
    nomExo: { margin: 0, fontSize: '20px', color: '#f8fafc' },
    progression: { fontSize: '12px', color: '#94a3b8' },
    btnAbandon: { backgroundColor: '#ef4444', color: 'white', border: 'none', padding: '8px 15px', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer', fontSize: '12px' },

    content: { flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'space-around' },
    gif: { width: '100%', maxWidth: '300px', borderRadius: '15px', boxShadow: '0 10px 30px rgba(0,0,0,0.5)' },
    compteurSets: { textAlign: 'center' },
    setHighlight: { fontSize: '36px', margin: 0 },
    targetReps: { color: '#bef264', fontSize: '18px', margin: 0, fontWeight: 'bold' },
    btnPrincipal: { width: '100%', maxWidth: '350px', padding: '18px', fontSize: '18px', backgroundColor: '#bef264', color: '#020617', border: 'none', borderRadius: '12px', fontWeight: 'bold', cursor: 'pointer' },

    overlay: { position: 'absolute', inset: 0, backgroundColor: 'rgba(2, 6, 23, 0.98)', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', zIndex: 12000, padding: '20px' },
    emojiRow: { display: 'flex', gap: '15px', marginBottom: '20px' },
    emoji: { fontSize: '40px', border: 'none', cursor: 'pointer', padding: '10px', borderRadius: '15px', transition: 'all 0.2s' },
    textarea: { width: '100%', maxWidth: '350px', height: '100px', padding: '15px', borderRadius: '10px', border: '1px solid #334155', backgroundColor: '#1e293b', color: 'white', outline: 'none' }
};