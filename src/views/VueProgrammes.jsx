import React, { useState, useEffect } from "react";
import { generateClient } from 'aws-amplify/data';
import { styleTitre } from "../theme/theme";
import { CarteProgramme } from "../theme/CarteProgramme"; 

export default function VueProgrammes({ onLancerSeance }) {
    const client = generateClient();
    const [programmes, setProgrammes] = useState([]);
    const [chargement, setChargement] = useState(true);

    const fetchProgrammes = async () => {
        try {
            const { data: seancesCloud, errors } = await client.models.Seance.list();
            if (errors) {
                console.error("Erreur:", errors);
            } else {
                const seancesFormatees = seancesCloud.map(seance => ({
                    ...seance,
                    date: seance.description || "Date inconnue",
                    exercices: seance.exercices ? JSON.parse(seance.exercices) : []
                }));
                setProgrammes(seancesFormatees); 
            }
        } catch (error) {
            console.error("Erreur réseau :", error);
        } finally {
            setChargement(false);
        }
    };

    useEffect(() => {
        fetchProgrammes();
    }, []);

    const handleSupprimer = async (idProgramme) => {
        if (window.confirm("Voulez-vous vraiment supprimer ?")) {
            try {
                await client.models.Seance.delete({ id: idProgramme });
                setProgrammes(programmes.filter(prog => prog.id !== idProgramme));
            } catch (error) {
                console.error(error);
            }
        }
    };

    if (chargement) return <div style={{ textAlign: "center", padding: "50px" }}>Chargement... ⏳</div>;

    return(
        <div style={{ boxSizing: "border-box", textAlign:"center", maxWidth: "800px", margin: "0 auto", padding: "20px" }}>
            <h2 style={{...styleTitre, marginBottom: "30px"}}>Mes Programmes & Séances</h2>
            <br/>
            {programmes.length === 0 ? (
                <div style={{ padding: "30px", backgroundColor: "#f3f4f6", borderRadius: "10px" }}>Aucun programme.</div>
            ) : (
                programmes.map((prog) => (
                    <CarteProgramme 
                        key={prog.id} 
                        programme={prog}
                        supprimerProgramme={() => handleSupprimer(prog.id)} 
                        onLancerSeance={onLancerSeance} // TRANSMISSION ICI
                    />
                ))
            )}
        </div>
    )
}