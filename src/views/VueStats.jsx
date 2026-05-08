import React, { useState, useEffect } from "react";
import { generateClient } from 'aws-amplify/data';


export default function VueStats() {
    const client = generateClient();
    
    const [statsParMuscle, setStatsParMuscle] = useState({});
    const [groupesJournal, setGroupesJournal] = useState([]);
    const [chargement, setChargement] = useState(true);

    const determinerCategorie = (exo) => {
        const motsCles = ((exo.bodyPart || "") + " " + (exo.target || "") + " " + (exo.name || "")).toLowerCase();
        if (motsCles.includes("chest") || motsCles.includes("pectoral")) return "Pectoraux";
        if (motsCles.includes("abs") || motsCles.includes("waist") || motsCles.includes("core")) return "Abdos";
        if (motsCles.includes("back") || motsCles.includes("lat") || motsCles.includes("spine")) return "Dos";
        if (motsCles.includes("leg") || motsCles.includes("calf") || motsCles.includes("thigh")) return "Jambes";
        if (motsCles.includes("cardio") || motsCles.includes("run")) return "Cardio";
        if (motsCles.includes("shoulder") || motsCles.includes("delt")) return "Épaules";
        return "Général";
    };

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const { data: sessions, errors } = await client.models.SessionLog.list();
                if (errors) return;

                const calculs = {};
                const journalGroupe = {};

                const sessionsTriees = sessions.sort((a, b) => new Date(b.date) - new Date(a.date));

                sessionsTriees.forEach(session => {
                    const exercices = session.exercicesLogs ? JSON.parse(session.exercicesLogs) : [];
                    
                    const dateTitre = new Date(session.date).toLocaleDateString('fr-FR', {
                        day: 'numeric', month: 'long', year: 'numeric'
                    });

                    const heureNote = new Date(session.date).toLocaleTimeString('fr-FR', {
                        hour: '2-digit', minute: '2-digit'
                    });

                    exercices.forEach(exo => {
                        const categorie = determinerCategorie(exo);
                        if (!calculs[categorie]) {
                            calculs[categorie] = { total: 0, facile: 0, moyen: 0, dur: 0 };
                        }
                        calculs[categorie].total += 1;
                        if (exo.ressenti === "facile") calculs[categorie].facile += 1;
                        else if (exo.ressenti === "moyen") calculs[categorie].moyen += 1;
                        else if (exo.ressenti === "dur") calculs[categorie].dur += 1;

                        if (exo.note && exo.note.trim() !== "") {
                            if (!journalGroupe[dateTitre]) {
                                journalGroupe[dateTitre] = [];
                            }
                            journalGroupe[dateTitre].push({
                                heure: heureNote,
                                exoNom: exo.name,
                                ressenti: exo.ressenti,
                                texte: exo.note
                            });
                        }
                    });
                });

                setStatsParMuscle(calculs);
                setGroupesJournal(Object.entries(journalGroupe));

            } catch (error) {
                console.error("Erreur stats:", error);
            } finally {
                setChargement(false);
            }
        };
        fetchStats();
    }, []);

    const purgerHistorique = async () => {
        if (window.confirm("Es-tu sûr de vouloir supprimer tout l'historique pour repartir à zéro ?")) {
            try {
                const { data: sessions } = await client.models.SessionLog.list();
                await Promise.all(sessions.map(s => client.models.SessionLog.delete({ id: s.id })));
                alert("Historique nettoyé !");
                window.location.reload(); 
            } catch (e) {
                console.error("Erreur lors du nettoyage :", e);
            }
        }
    };

    if (chargement) return <div style={{ textAlign: "center", padding: "50px" }}>Analyse des données... 📊</div>;

    return (
        <div style={{ fontFamily: "sans-serif", maxWidth: "900px", margin: "0 auto", padding: "20px" }}>
            
            <h2 style={styles.sectionTitre}>📊 Analyse par Groupe Musculaire</h2>
            <div style={styles.grille}>
                {Object.entries(statsParMuscle).length === 0 ? (
                    <p style={{color: '#64748b'}}>Aucune donnée disponible pour le moment.</p>
                ) : (
                    Object.entries(statsParMuscle).map(([muscle, stats]) => (
                        <div key={muscle} style={styles.carteStat}>
                            <h3 style={{marginTop: 0, fontSize: '16px'}}>{muscle}</h3>
                            <div style={styles.barreFond}>
                                <div style={{ width: `${(stats.facile / stats.total) * 100}%`, backgroundColor: "#34d399", height: '100%' }} />
                                <div style={{ width: `${(stats.moyen / stats.total) * 100}%`, backgroundColor: "#fbbf24", height: '100%' }} />
                                <div style={{ width: `${(stats.dur / stats.total) * 100}%`, backgroundColor: "#f87171", height: '100%' }} />
                            </div>
                            <div style={styles.legende}>
                                <span>🟢 {stats.facile}</span> <span>🟠 {stats.moyen}</span> <span>🔴 {stats.dur}</span>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {groupesJournal.length > 0 && (
                <div style={{ marginTop: '50px', marginBottom: '30px' }}>
                    <h2 style={styles.sectionTitre}>📝 Journal par Séance</h2>
                    
                    <div style={styles.scrollContainer}>
                        {groupesJournal.map(([date, notes], idx) => (
                            <div key={idx} style={styles.blocJour}>
                                <div style={styles.dateHeader}>{date}</div>
                                <div style={styles.timeline}>
                                    {notes.map((note, i) => (
                                        <div key={i} style={styles.itemNote}>
                                            <div style={styles.noteHeader}>
                                                <span>{note.ressenti === "facile" ? "🟢" : note.ressenti === "moyen" ? "🟠" : "🔴"}</span>
                                                <strong style={{ textTransform: 'capitalize' }}>{note.exoNom}</strong>
                                                <span style={styles.noteHeure}>{note.heure}</span>
                                            </div>
                                            <p style={styles.noteTexte}>"{note.texte}"</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Zone de nettoyage en bas de page */}
            <div style={{ marginTop: '80px', paddingTop: '20px', borderTop: '1px solid #fee2e2', textAlign: 'center' }}>
                <p style={{ fontSize: '12px', color: '#94a3b8', marginBottom: '10px' }}>Zone d'administration</p>
                <button onClick={purgerHistorique} style={styles.btnDanger}>
                    Supprimer tout l'historique (Reset)
                </button>
            </div>
        </div>
    );
}

const styles = {
    sectionTitre: { borderBottom: '2px solid #e2e8f0', paddingBottom: '10px', marginBottom: '20px', color: '#1f2937', fontSize: '22px' },
    grille: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "20px" },
    carteStat: { backgroundColor: "white", padding: "15px", borderRadius: "12px", boxShadow: "0 2px 8px rgba(0,0,0,0.05)", border: '1px solid #e5e7eb' },
    barreFond: { display: "flex", height: "10px", borderRadius: "5px", overflow: "hidden", backgroundColor: "#f3f4f6", margin: '12px 0' },
    legende: { display: "flex", justifyContent: "space-between", fontSize: "11px", fontWeight: "bold" },
    scrollContainer: {
        maxHeight: "500px",
        overflowY: "auto",
        backgroundColor: "#f8fafc",
        padding: "20px",
        borderRadius: "15px",
        border: "1px solid #e2e8f0"
    },
    blocJour: { marginBottom: '30px' },
    dateHeader: { 
        backgroundColor: '#1e293b', 
        color: 'white', 
        padding: '5px 15px', 
        borderRadius: '20px', 
        fontSize: '13px', 
        fontWeight: 'bold',
        display: 'inline-block',
        marginBottom: '15px'
    },
    timeline: { display: 'flex', flexDirection: 'column', gap: '10px', paddingLeft: '10px', borderLeft: '2px dashed #cbd5e1' },
    itemNote: { backgroundColor: 'white', padding: '12px', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' },
    noteHeader: { display: 'flex', alignItems: 'center', gap: '10px', fontSize: '14px' },
    noteHeure: { marginLeft: 'auto', color: '#94a3b8', fontSize: '11px' },
    noteTexte: { margin: '5px 0 0 25px', fontStyle: 'italic', color: '#475569', fontSize: '14px' },
    btnDanger: { backgroundColor: 'transparent', color: '#ef4444', border: '1px solid #ef4444', padding: '8px 16px', borderRadius: '6px', fontSize: '12px', cursor: 'pointer', fontWeight: 'bold' }
};